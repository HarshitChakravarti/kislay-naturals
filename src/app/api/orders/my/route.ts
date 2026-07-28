import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth';

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
      .select(`
        *,
        order_items (
          id,
          name,
          image,
          price,
          quantity
        )
      `)
      .or(`user_id.eq.${user.id},user_email.eq.${user.email}`)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      orders: data || [],
    });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
