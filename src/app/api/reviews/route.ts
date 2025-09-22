import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabaseAdmin.from('reviews').select('*', { count: 'exact' }).order('created_at', { ascending: false })
    if (productId) query = query.eq('product_id', productId)
    query = query.range(from, to)

    const { data, count, error } = await query
    if (error) throw error

    const totalReviews = count || 0
    const totalPages = Math.ceil(totalReviews / limit)

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        totalReviews,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, rating, comment, name, email } = body

    if (!productId || !rating || !comment || !name || !email) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // prevent duplicates by (product_id, email)
    const { data: existing, error: existErr } = await supabaseAdmin
      .from('reviews')
      .select('id')
      .eq('product_id', productId)
      .eq('email', email)
      .maybeSingle()
    if (existErr) throw existErr
    if (existing) {
      return NextResponse.json({ success: false, message: 'You have already reviewed this product' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([{ product_id: productId, rating, comment, name, email }])
      .select()
      .single()
    if (error) throw error

    return NextResponse.json({ success: true, message: 'Review submitted successfully', data }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
