import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import type { OrderDetails } from '@/types';

// Use service role key to bypass RLS for guest orders

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Save-order endpoint called');
    
    const body: OrderDetails = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    if (!body || !body.user || !body.product || !body.quantity || !body.totalAmount || !body.shippingAddress || !body.paymentDetails) {
      console.log('❌ Invalid payload - missing required fields');
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    const payload = body;

    // Ensure paymentDetails exists after validation
    if (!payload.paymentDetails) {
      console.log('❌ Payment details missing after validation');
      return NextResponse.json({ success: false, message: 'Payment details are required.' }, { status: 400 });
    }

    // 1) If an order already exists with this Razorpay order/payment id, update it or return it
    const razorpayOrderId = payload.paymentDetails.razorpay_order_id;
    const razorpayPaymentId = payload.paymentDetails.razorpay_payment_id;

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
          razorpay_signature: payload.paymentDetails.razorpay_signature,
          status: 'paid',
          order_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          payload
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
      .eq('user_email', payload.user.email)
      .eq('product_id', payload.product.id)
      .eq('quantity', payload.quantity)
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
          razorpay_signature: payload.paymentDetails.razorpay_signature,
          status: 'paid',
          order_status: 'paid',
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_amount: payload.totalAmount,
          unit_price: payload.product.price,
          product_name: payload.product.name,
          shipping_street: payload.shippingAddress.street,
          shipping_city: payload.shippingAddress.city,
          shipping_state: payload.shippingAddress.state,
          shipping_zip: payload.shippingAddress.zip,
          payload
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
      user_name: payload.user.name,
      user_email: payload.user.email,
      user_mobile: payload.user.mobile,
      product_id: payload.product.id,
      product_name: payload.product.name,
      unit_price: payload.product.price,
      quantity: payload.quantity,
      total_amount: payload.totalAmount,
      shipping_street: payload.shippingAddress.street,
      shipping_city: payload.shippingAddress.city,
      shipping_state: payload.shippingAddress.state,
      shipping_zip: payload.shippingAddress.zip,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: payload.paymentDetails.razorpay_signature,
      status: 'paid' as const,
      order_status: 'paid' as const,
      paid_at: new Date().toISOString(),
      payload,
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
