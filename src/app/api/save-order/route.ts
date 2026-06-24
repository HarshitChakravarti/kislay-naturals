import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { OrderDetails } from '@/types';

// Use service role key to bypass RLS for guest orders

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Save-order endpoint called');
    
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));
    
    // Check if this is a Razorpay webhook payload
    if (body.event && body.payload) {
      console.log('🔄 Detected Razorpay webhook payload, redirecting to webhook handler');
      // This is a webhook payload, redirect to the proper webhook handler
      const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000'}/api/razorpay/webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-razorpay-signature': request.headers.get('x-razorpay-signature') || ''
        },
        body: JSON.stringify(body)
      });
      
      const webhookResult = await webhookResponse.json();
      return NextResponse.json(webhookResult, { status: webhookResponse.status });
    }
    
    // Otherwise, treat as OrderDetails payload
    const orderDetails: OrderDetails = body;

    // Detailed validation with specific field checking
    const missingFields: string[] = [];
    if (!orderDetails) missingFields.push('body');
    if (!orderDetails?.user) missingFields.push('user');
    if (!orderDetails?.user?.name) missingFields.push('user.name');
    if (!orderDetails?.user?.email) missingFields.push('user.email');
    if (!orderDetails?.user?.mobile) missingFields.push('user.mobile');
    if (!orderDetails?.product) missingFields.push('product');
    if (!orderDetails?.product?.id) missingFields.push('product.id');
    if (!orderDetails?.product?.name) missingFields.push('product.name');
    if (!orderDetails?.product?.price) missingFields.push('product.price');
    if (!orderDetails?.quantity) missingFields.push('quantity');
    if (!orderDetails?.totalAmount) missingFields.push('totalAmount');
    if (!orderDetails?.shippingAddress) missingFields.push('shippingAddress');
    if (!orderDetails?.shippingAddress?.street) missingFields.push('shippingAddress.street');
    if (!orderDetails?.shippingAddress?.city) missingFields.push('shippingAddress.city');
    if (!orderDetails?.shippingAddress?.state) missingFields.push('shippingAddress.state');
    if (!orderDetails?.shippingAddress?.zip) missingFields.push('shippingAddress.zip');
    if (!orderDetails?.paymentDetails) missingFields.push('paymentDetails');
    if (!orderDetails?.paymentDetails?.razorpay_payment_id) missingFields.push('paymentDetails.razorpay_payment_id');
    if (!orderDetails?.paymentDetails?.razorpay_order_id) missingFields.push('paymentDetails.razorpay_order_id');
    if (!orderDetails?.paymentDetails?.razorpay_signature) missingFields.push('paymentDetails.razorpay_signature');

    if (missingFields.length > 0) {
      console.log('❌ Invalid payload - missing required fields:', missingFields);
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid order payload - missing required fields.',
        missingFields 
      }, { status: 400 });
    }

    // Ensure paymentDetails exists after validation
    if (!orderDetails.paymentDetails) {
      console.log('❌ Payment details missing after validation');
      return NextResponse.json({ success: false, message: 'Payment details are required.' }, { status: 400 });
    }

    // 1) If an order already exists with this Razorpay order/payment id, update it or return it
    const razorpayOrderId = orderDetails.paymentDetails.razorpay_order_id;
    const razorpayPaymentId = orderDetails.paymentDetails.razorpay_payment_id;

    // Try to find by Razorpay IDs first
    const { data: existingByRazorpay } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or(`razorpay_order_id.eq.${razorpayOrderId},razorpay_payment_id.eq.${razorpayPaymentId}`)
      .limit(1)
      .maybeSingle();

    if (existingByRazorpay) {
      // If already paid, return it; otherwise update to paid
      if (existingByRazorpay.status === 'paid' || existingByRazorpay.order_status === 'paid') {
        console.log('ℹ️ Existing paid order found by Razorpay IDs, returning as-is:', existingByRazorpay.id);
        return NextResponse.json({ success: true, message: 'Order already recorded.', order: existingByRazorpay }, { status: 200 });
      }

      const { data: updatedExisting, error: updateExistingErr } = await supabaseAdmin
        .from('orders')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: orderDetails.paymentDetails.razorpay_signature,
          status: 'paid',
          order_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          payload: orderDetails
        })
        .eq('id', existingByRazorpay.id)
        .select('*')
        .single();

      if (updateExistingErr) {
        console.error('❌ Failed updating existing order by Razorpay IDs:', updateExistingErr);
        throw updateExistingErr;
      }

      console.log('✅ Updated existing order to paid (by Razorpay IDs):', updatedExisting.id);
      return NextResponse.json({ success: true, message: 'Order updated successfully.', order: updatedExisting }, { status: 200 });
    }

    // 2) Try to locate a recent 'created' order for this customer/product/amount and upgrade it to paid
    const now = Date.now();
    const thirtyMinutesAgoIso = new Date(now - 30 * 60 * 1000).toISOString();

    const { data: existingCreated, error: findCreatedErr } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('user_email', orderDetails.user.email)
      .eq('product_id', orderDetails.product!.id)
      .eq('quantity', orderDetails.quantity!)
      .or('order_status.eq.created,status.eq.created')
      .gte('created_at', thirtyMinutesAgoIso)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findCreatedErr) {
      console.warn('⚠️ Error searching for existing created order (non-fatal):', findCreatedErr);
    }

    if (existingCreated) {
      const { data: upgraded, error: upgradeErr } = await supabaseAdmin
        .from('orders')
        .update({
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: orderDetails.paymentDetails.razorpay_signature,
          status: 'paid',
          order_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_amount: orderDetails.totalAmount,
          unit_price: orderDetails.product!.price,
          product_name: orderDetails.product!.name,
          shipping_street: orderDetails.shippingAddress.street,
          shipping_city: orderDetails.shippingAddress.city,
          shipping_state: orderDetails.shippingAddress.state,
          shipping_zip: orderDetails.shippingAddress.zip,
          payload: orderDetails
        })
        .eq('id', existingCreated.id)
        .select('*')
        .single();

      if (upgradeErr) {
        console.error('❌ Failed upgrading created order to paid:', upgradeErr);
        throw upgradeErr;
      }

      console.log('✅ Upgraded existing created order to paid:', upgraded.id);
      return NextResponse.json({ success: true, message: 'Order updated successfully.', order: upgraded }, { status: 200 });
    }

    // 3) No matching order found — create a fresh paid order (idempotent by unique Razorpay indexes)
    const insertRow = {
      user_name: orderDetails.user.name,
      user_email: orderDetails.user.email,
      user_mobile: orderDetails.user.mobile,
      product_id: orderDetails.product!.id,
      product_name: orderDetails.product!.name,
      unit_price: orderDetails.product!.price,
      quantity: orderDetails.quantity!,
      total_amount: orderDetails.totalAmount,
      total_price: orderDetails.totalAmount, // Add the missing total_price field that the database expects
      shipping_street: orderDetails.shippingAddress.street,
      shipping_city: orderDetails.shippingAddress.city,
      shipping_state: orderDetails.shippingAddress.state,
      shipping_zip: orderDetails.shippingAddress.zip,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: orderDetails.paymentDetails.razorpay_signature,
      status: 'paid' as const,
      order_status: 'paid' as const,
      paid_at: new Date().toISOString(),
      coupon_code: orderDetails.couponCode || null,
      coupon_discount: orderDetails.couponDiscount || 0,
      payload: orderDetails,
    } as const;

    console.log('💾 Attempting to insert paid order (no existing match found):', JSON.stringify(insertRow, null, 2));

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([insertRow])
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Order inserted successfully:', data);

    return NextResponse.json({ success: true, message: 'Order saved successfully.', order: data }, { status: 201 });

  } catch (error) {
    console.error('❌ Failed to save order:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save order.', error: errorMessage }, { status: 500 });
  }
}
