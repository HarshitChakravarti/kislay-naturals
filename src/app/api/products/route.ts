import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';
import type { Product } from '@/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Clone and strip control params
    const reqQuery: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      reqQuery[key] = value;
    });
    
    const controlParams = ['select', 'sort', 'page', 'limit'];
    controlParams.forEach((param) => delete reqQuery[param]);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    // Base select
    const selectColumns = searchParams.get('select') ? searchParams.get('select')!.split(',').join(',') : '*';
    let query = supabase.from('products').select(selectColumns, { count: 'exact' });

    // Basic equality filters (?category=xyz&brand=abc). For advanced ops, add specific handlers later
    Object.entries(reqQuery).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // If value is array, use in filter
        query = query.in(key, value);
      } else {
        query = query.eq(key, value);
      }
    });

    // Sorting (?sort=price,-created_at)
    if (searchParams.get('sort')) {
      const sortFields = searchParams.get('sort')!.split(',');
      // Supabase supports ordering by one column at a time; apply the first then best-effort for others
      sortFields.forEach((field, idx) => {
        const ascending = !field.startsWith('-');
        const column = ascending ? field : field.substring(1);
        // Only the first order is guaranteed; subsequent orders are best-effort
        query = query.order(column, { ascending, nullsFirst: false });
      });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Range for pagination
    query = query.range(startIndex, endIndex);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch products' }, { status: 500 });
    }

    // Build pagination
    const pagination: any = {};
    if (count != null) {
      if (endIndex + 1 < count) {
        pagination.next = { page: page + 1, limit };
      }
      if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
      }
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      pagination,
      data: data || [],
    });
  } catch (error) {
    console.error('Error listing products:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized to access this route' }, { status: 403 });
    }

    let body: Partial<Product>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const payload: any = { ...body };
    // Map user to a likely foreign key if present in schema
    if (user?.id) {
      payload.user_id = user.id;
    }

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to create product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
