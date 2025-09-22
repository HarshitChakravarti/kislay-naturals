import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST() {
  try {
    console.log('Testing simple order insertion...');
    
    const simpleOrder = {
      user_id: null,
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

    console.log('Inserting order:', simpleOrder);

    const { data, error } = await supabase
      .from('orders')
      .insert([simpleOrder])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 });
    }

    console.log('Order created successfully:', data);

    // Clean up
    await supabase
      .from('orders')
      .delete()
      .eq('id', data.id);

    return NextResponse.json({ 
      success: true, 
      message: 'Order created and cleaned up successfully',
      orderId: data.id
    });

  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
