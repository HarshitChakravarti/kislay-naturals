import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { authenticateAdmin } from '@/lib/middleware/admin';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const user = await authenticateAdmin(request);
  if (!user) {
    return NextResponse.json({ success: false, message: 'Admin authentication required' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');

    // Build query for orders with all necessary fields
    let query = supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        user_name,
        user_email,
        user_mobile,
        product_name,
        unit_price,
        quantity,
        items_price,
        tax_price,
        shipping_price,
        total_amount,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        razorpay_payment_id,
        razorpay_order_id,
        order_status,
        status,
        paid_at,
        shipped_at,
        delivered_at,
        created_at,
        updated_at,
        notes,
        coupon_code,
        coupon_discount
      `)
      .order('created_at', { ascending: false });

    // Apply date range filter
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      // Add one day to endDate to include the entire end day
      const endDatePlusOne = new Date(endDate);
      endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
      query = query.lt('created_at', endDatePlusOne.toISOString());
    }

    // Filter by status if provided
    if (status) {
      query = query.eq('order_status', status);
    }

    const { data: orders, error } = await query;

    if (error) {
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to fetch orders for export' 
      }, { status: 500 });
    }

    // Generate CSV content
    const csvContent = generateCSV(orders || []);

    // Create filename with date range
    const today = new Date().toISOString().split('T')[0];
    const dateRangeSuffix = startDate && endDate 
      ? `_${startDate}_to_${endDate}`
      : startDate 
        ? `_from_${startDate}`
        : endDate 
          ? `_until_${endDate}`
          : `_${today}`;
    
    const statusSuffix = status ? `_${status}` : '';
    const filename = `orders_export${dateRangeSuffix}${statusSuffix}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error exporting orders to CSV:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

function generateCSV(orders: any[]) {
  // Define CSV headers
  const headers = [
    'Order ID',
    'Order Number',
    'Customer Name',
    'Customer Email',
    'Customer Mobile',
    'Product Name',
    'Unit Price (₹)',
    'Quantity',
    'Items Price (₹)',
    'Tax Price (₹)',
    'Shipping Price (₹)',
    'Total Price (₹)',
    'Shipping Address',
    'City',
    'State',
    'ZIP Code',
    'Razorpay Payment ID',
    'Razorpay Order ID',
    'Order Status',
    'Payment Status',
    'Order Date',
    'Paid Date',
    'Shipped Date',
    'Delivered Date',
    'Last Updated',
    'Notes',
    'Coupon Code',
    'Coupon Discount (₹)'
  ];

  // Convert orders to CSV rows
  const rows = orders.map(order => [
    order.id || '',
    order.order_number || '',
    order.user_name || '',
    order.user_email || '',
    order.user_mobile || '',
    order.product_name || '',
    order.unit_price ? order.unit_price.toString() : '0',
    order.quantity ? order.quantity.toString() : '0',
    order.items_price ? order.items_price.toString() : '0',
    order.tax_price ? order.tax_price.toString() : '0',
    order.shipping_price ? order.shipping_price.toString() : '0',
    order.total_amount ? order.total_amount.toString() : '0',
    order.shipping_street || '',
    order.shipping_city || '',
    order.shipping_state || '',
    order.shipping_zip || '',
    order.razorpay_payment_id || '',
    order.razorpay_order_id || '',
    order.order_status || '',
    order.status || '',
    order.created_at ? formatDateForCSV(order.created_at) : '',
    order.paid_at ? formatDateForCSV(order.paid_at) : '',
    order.shipped_at ? formatDateForCSV(order.shipped_at) : '',
    order.delivered_at ? formatDateForCSV(order.delivered_at) : '',
    order.updated_at ? formatDateForCSV(order.updated_at) : '',
    order.notes || '',
    order.coupon_code || '',
    order.coupon_discount ? order.coupon_discount.toString() : '0'
  ]);

  // Combine headers and rows
  const csvData = [headers, ...rows];
  
  // Convert to CSV string
  return csvData
    .map(row => 
      row.map(field => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const escaped = String(field).replace(/"/g, '""');
        return escaped.includes(',') || escaped.includes('"') || escaped.includes('\n') 
          ? `"${escaped}"` 
          : escaped;
      }).join(',')
    )
    .join('\n');
}

function formatDateForCSV(dateString: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}
