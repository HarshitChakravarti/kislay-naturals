import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized to access this route' }, { status: 403 });
    }

    // Parse range filter
    const { searchParams } = new URL(request.url);
    const range = (searchParams.get('range') || '').toLowerCase();
    const now = new Date();
    const startDate = new Date(now);
    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case '7d':
      case 'lastweek':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '15d':
        startDate.setDate(startDate.getDate() - 15);
        break;
      case '30d':
      case 'lastmonth':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '6m':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1y':
      case 'lastyear':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        // If no range provided, default to last 7 days for recentOrders only; totals remain overall
        // We'll set startDate to null to indicate no filter
        // @ts-ignore
        startDate[Symbol.for('noFilter')] = true;
        break;
    }

    const shouldFilter = !(Symbol.for('noFilter') in startDate);
    const startIso = shouldFilter ? startDate.toISOString() : null;

    // Get various statistics
    const [
      productsResult,
      ordersResult,
      reviewsResult,
      totalRevenueResult,
      recentOrdersResult
    ] = await Promise.all([
      // Total products
      supabase
        .from('products')
        .select('id', { count: 'exact' }),
      
      // Total orders
      (shouldFilter
        ? supabase
            .from('orders')
            .select('id', { count: 'exact' })
            .gte('created_at', startIso as string)
        : supabase
            .from('orders')
            .select('id', { count: 'exact' })),
      
      // Total reviews
      supabase
        .from('reviews')
        .select('id', { count: 'exact' }),
      
      // Total revenue
      (shouldFilter
        ? supabase
            .from('orders')
            .select('total_price, created_at')
            .eq('order_status', 'paid')
            .gte('created_at', startIso as string)
        : supabase
            .from('orders')
            .select('total_price')
            .eq('order_status', 'paid')),
      
      // Recent orders (last 7 days)
      supabase
        .from('orders')
        .select('*')
        .gte('created_at', (shouldFilter ? (startIso as string) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()))
        .order('created_at', { ascending: false })
        .limit(5)
    ]);

    // Calculate total revenue
    const totalRevenue = totalRevenueResult.data?.reduce((sum: number, order: any) => 
      sum + (order.total_price || 0), 0) || 0;

    // Calculate orders by status
    const ordersByStatus = await (shouldFilter
      ? supabase
          .from('orders')
          .select('order_status, created_at')
          .gte('created_at', startIso as string)
      : supabase
          .from('orders')
          .select('order_status'))
      .then(result => {
        const statusCounts: { [key: string]: number } = {};
        result.data?.forEach(order => {
          const status = order.order_status || 'unknown';
          statusCounts[status] = (statusCounts[status] || 0) + 1;
        });
        return statusCounts;
      });

    // Calculate average order value
    const avgOrderValue = ordersResult.count && totalRevenue 
      ? totalRevenue / ordersResult.count 
      : 0;

    const stats = {
      products: {
        total: productsResult.count || 0,
      },
      orders: {
        total: ordersResult.count || 0,
        byStatus: ordersByStatus,
        averageValue: Math.round(avgOrderValue * 100) / 100,
      },
      reviews: {
        total: reviewsResult.count || 0,
      },
      revenue: {
        total: Math.round(totalRevenue * 100) / 100,
        range: range || null,
        from: shouldFilter ? startIso : null,
        to: now.toISOString(),
      },
      recentOrders: recentOrdersResult.data || [],
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
