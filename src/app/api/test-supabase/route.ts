import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can connect
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name')
      .limit(1);

    if (productsError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to connect to Supabase',
        error: productsError.message 
      }, { status: 500 });
    }

    // Test 2: Try to insert a simple order
    const testOrder = {
      user_name: 'Test User',
      user_email: 'test@example.com',
      user_mobile: '1234567890',
      product_id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8',
      product_name: 'Test Product',
      unit_price: 100,
      quantity: 1,
      total_amount: 100,
      items_price: 100,
      tax_price: 15,
      shipping_price: 0,
      total_price: 115,
      shipping_street: 'Test Street',
      shipping_city: 'Test City',
      shipping_state: 'Test State',
      shipping_zip: '12345',
      status: 'created',
      order_status: 'created',
      payload: { test: true }
    };

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([testOrder])
      .select('id')
      .single();

    if (orderError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Failed to insert order',
        error: orderError.message,
        code: orderError.code,
        details: orderError.details,
        hint: orderError.hint
      }, { status: 500 });
    }

    // Clean up test order
    await supabase
      .from('orders')
      .delete()
      .eq('id', orderData.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection and order insertion working',
      orderId: orderData.id
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
