import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  try {
    const { id } = await params;

    // Get only the order number and basic info (public endpoint)
    const { data: order, error } = await supabase
      .from('orders')
      .select('id, order_number, order_status, total_amount')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { 
        id: order.id,
        order_number: order.order_number,
        order_status: order.order_status,
        total_amount: order.total_amount
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order number:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
