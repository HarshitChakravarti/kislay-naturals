import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';
import type { OrderItem, OrderDetails } from '@/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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

    // Calculate pricing with coupon discount
    let itemsPrice = 0;
    if (payload.cartItems && payload.cartItems.length > 0) {
      itemsPrice = payload.cartItems.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    } else if (payload.product && payload.quantity) {
      itemsPrice = payload.product.price * payload.quantity;
    }
    const originalPrice = payload.originalPrice || itemsPrice;
    const discountedPrice = payload.discountedPrice || itemsPrice;
    const couponDiscount = payload.couponDiscount || 0;
    const totalPrice = payload.totalAmount; // Use the final total from frontend

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
