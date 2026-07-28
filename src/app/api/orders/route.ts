import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth';
import { validateCouponData } from '@/lib/coupon';
import type { OrderDetails } from '@/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    console.log(' Create order endpoint called');
    
    const body: OrderDetails = await request.json();
    console.log(' Request body received:', JSON.stringify(body, null, 2));

    if (!body || !body.user || !body.totalAmount || !body.shippingAddress || (!body.product && !body.cartItems)) {
      console.log(' Invalid payload - missing required fields');
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    // Try to get authenticated user
    let authenticatedUser: { id: string; email: string | undefined; role: any } | null = null;
    try {
      authenticatedUser = await authenticateUser(request);
    } catch (error) {
      console.log(' No authenticated user, creating guest order');
    }

    const payload = body;

    // ── Server-side price recalculation ──────────────────────────────────────
    // Never trust the client's totalAmount. Fetch real prices from the DB.
    let itemsPrice = 0;

    if (payload.cartItems && payload.cartItems.length > 0) {
      // Cart checkout: look up each product's variant price
      const productIds: string[] = [...new Set(payload.cartItems.map((i: any) => String(i.product)))];
      const { data: products, error: productsError } = await supabaseAdmin
        .from('products')
        .select('id, price, variants')
        .in('id', productIds);

      if (productsError || !products) {
        return NextResponse.json({ success: false, message: 'Could not verify product prices.' }, { status: 500 });
      }

      const productMap = new Map(products.map((p: any) => [p.id, p]));

      for (const item of payload.cartItems) {
        const prod = productMap.get(String(item.product));
        if (!prod) {
          return NextResponse.json({ success: false, message: `Product ${item.product} not found.` }, { status: 400 });
        }
        const variants: any[] = prod.variants || [];
        const variant = variants.find(
          (v: any) => v.size?.trim().toLowerCase() === (item.variantSize || '').trim().toLowerCase()
        );
        const unitPrice = variant?.price ?? prod.price;
        itemsPrice += unitPrice * item.quantity;
      }
    } else if (payload.product && payload.quantity) {
      // Single product checkout: look up variant price from DB
      const { data: prod, error: prodError } = await supabaseAdmin
        .from('products')
        .select('id, price, variants')
        .eq('id', payload.product.id)
        .single();

      if (prodError || !prod) {
        return NextResponse.json({ success: false, message: 'Product not found.' }, { status: 400 });
      }

      const variants: any[] = prod.variants || [];
      const variantSize = (payload.product as any).variantSize || '';
      const variant = variants.find(
        (v: any) => v.size?.trim().toLowerCase() === variantSize.trim().toLowerCase()
      );
      const unitPrice = variant?.price ?? prod.price;
      itemsPrice = unitPrice * payload.quantity;
    } else {
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    // Validate coupon server-side if provided
    let serverCouponDiscount = 0;
    if (payload.couponCode) {
      try {
        const couponResult = await validateCouponData(
          payload.couponCode,
          payload.product ? String(payload.product.id) : undefined,
          payload.product ? (payload.product as any).variantSize : undefined,
          payload.quantity,
          payload.cartItems ? payload.cartItems.map((i: any) => ({
            productId: i.product,
            variantSize: i.variantSize,
            quantity: i.quantity
          })) : undefined
        );
        
        if (couponResult.valid) {
          serverCouponDiscount = couponResult.couponDiscount ?? 0;
          itemsPrice = itemsPrice - serverCouponDiscount;
        }
      } catch (couponErr) {
        console.error('Error verifying coupon locally:', couponErr);
      }
    }

    const totalPrice = Math.round(itemsPrice * 100) / 100;
    const originalPrice = payload.originalPrice || (totalPrice + serverCouponDiscount);
    const discountedPrice = totalPrice + serverCouponDiscount; // pre-coupon selling price
    const couponDiscount = serverCouponDiscount;
    // ─────────────────────────────────────────────────────────────────────────

    // Normalize key fields for easier querying; also store full payload
    const insertRow = {
      user_id: authenticatedUser?.id || null, // Set user_id if authenticated
      user_name: payload.user.name,
      user_email: payload.user.email,
      user_mobile: payload.user.mobile,
      product_id: payload.product ? payload.product.id : payload.cartItems?.[0]?.product || 'multi-item',
      product_name: payload.product ? payload.product.name : 'Multi-item Order',
      unit_price: payload.product ? payload.product.price : 0,
      quantity: payload.quantity || payload.cartItems?.reduce((acc: number, item: any) => acc + item.quantity, 0) || 1,
      total_amount: totalPrice,
      total_price: totalPrice, // Add the missing total_price field that the database expects
      items_price: itemsPrice,
      tax_price: 0, // No tax
      shipping_price: 0, // No shipping
      shipping_street: payload.shippingAddress.street,
      shipping_city: payload.shippingAddress.city,
      shipping_state: payload.shippingAddress.state,
      shipping_zip: payload.shippingAddress.zip,
      status: 'created' as const,
      order_status: 'created' as const,
      coupon_code: payload.couponCode || null,
      coupon_discount: couponDiscount,
      payload, // store full JSON for flexibility (includes coupon info)
    };

    console.log(' Attempting to insert order:', JSON.stringify(insertRow, null, 2));

    // Insert into orders table
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([insertRow])
      .select('id, total_amount, order_status')
      .single();

    if (orderError) {
      console.error('Supabase order insert error:', JSON.stringify(orderError, null, 2));
      throw orderError;
    }

    console.log(' Order created successfully:', orderData);

    // Insert into order_items table
    let orderItemsToInsert: any[] = [];
    if (payload.cartItems && payload.cartItems.length > 0) {
      orderItemsToInsert = payload.cartItems.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.product,
        name: item.name,
        image: item.image || null,
        price: item.price,
        quantity: item.quantity,
        variant_size: item.variantSize || null,
        description: null,
        category: null,
        sku: null
      }));
    } else if (payload.product) {
      orderItemsToInsert = [{
        order_id: orderData.id,
        product_id: payload.product.id,
        name: payload.product.name,
        image: payload.product.image || null,
        price: payload.product.price,
        quantity: payload.quantity || 1,
        variant_size: (payload.product as any).variantSize || null,
        description: payload.product.description || null,
        category: payload.product.category || null,
        sku: payload.product.sku || null
      }];
    }

    console.log('📦 Attempting to insert order items:', JSON.stringify(orderItemsToInsert, null, 2));
    console.log('💰 Coupon details - Code:', payload.couponCode, 'Discount:', payload.couponDiscount, 'Type:', payload.couponCode === 'SPECIAL' ? 'fixed' : 'percentage');

    // Try to insert order item with better error handling
    let itemData, itemError;
    try {
      const result = await supabaseAdmin
        .from('order_items')
        .insert(orderItemsToInsert)
        .select('id');
      
      itemData = result.data;
      itemError = result.error;
    } catch (insertError) {
      console.error('❌ Exception during order item insertion:', insertError);
      itemError = insertError;
      itemData = null;
    }

    if (itemError) {
      console.error('❌ Supabase order item insert error:', itemError);
      console.error('❌ Order item details:', JSON.stringify(orderItemsToInsert, null, 2));
      
      // Try to store order item info in the main order record as fallback
      try {
        const fallbackUpdate = {
          order_items_snapshot: orderItemsToInsert.map((item) => ({
            product_id: item.product_id,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            variant_size: item.variant_size,
            description: item.description,
            category: item.category,
            sku: item.sku
          })),
          updated_at: new Date().toISOString()
        };
        
        await supabaseAdmin
          .from('orders')
          .update(fallbackUpdate)
          .eq('id', orderData.id);
        
        console.log('✅ Stored order item info in main order record as fallback');
      } catch (fallbackError) {
        console.error('❌ Failed to store order item info as fallback:', fallbackError);
        
        // Only clean up if fallback also fails
        try {
          await supabaseAdmin
            .from('orders')
            .delete()
            .eq('id', orderData.id);
          console.log('🧹 Cleaned up order due to complete failure');
        } catch (cleanupError) {
          console.error('❌ Failed to cleanup order after complete failure:', cleanupError);
        }
        
        return NextResponse.json({ 
          success: false, 
          message: 'Failed to create order items and fallback storage failed. Order creation aborted.' 
        }, { status: 500 });
      }
    } else {
      console.log('✅ Order items created successfully:', itemData);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully.',
      order: {
        id: orderData.id,
        total_amount: orderData.total_amount,
        order_status: orderData.order_status
      },
    }, { status: 201 });

  } catch (error) {
    console.error(' Failed to create order:', error);
    console.error(' Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to create order.', error: errorMessage }, { status: 500 });
  }
}
