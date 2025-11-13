import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

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

    // Process photos to ensure they're arrays
    const processedData = (data || []).map((review: any) => {
      if (review.photos) {
        // Handle different formats: array, string, or JSON string
        let photosArray: string[] = []
        if (Array.isArray(review.photos)) {
          photosArray = review.photos.filter(Boolean)
        } else if (typeof review.photos === 'string') {
          try {
            const parsed = JSON.parse(review.photos)
            photosArray = Array.isArray(parsed) ? parsed.filter(Boolean) : [parsed].filter(Boolean)
          } catch {
            photosArray = [review.photos].filter(Boolean)
          }
        }
        
        // Log for debugging (remove in production)
        if (photosArray.length > 0) {
          console.log(`Review ${review.id} has ${photosArray.length} photo(s):`, photosArray)
        }
        
        return { ...review, photos: photosArray }
      }
      return review
    })

    const totalReviews = count || 0
    const totalPages = Math.ceil(totalReviews / limit)

    return NextResponse.json({
      success: true,
      data: processedData,
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
    const { productId, rating, comment, name, email, photos } = body

    if (!productId || !rating || !comment || !name || !email) {
      return NextResponse.json({ success: false, message: 'All fields are required' }, { status: 400 })
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Validate photos if provided
    if (photos && !Array.isArray(photos)) {
      return NextResponse.json({ success: false, message: 'Photos must be an array' }, { status: 400 })
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

    // Prepare review data
    const reviewData: any = { 
      product_id: productId, 
      rating, 
      comment, 
      name, 
      email 
    }

    // Add photos if provided (only if column exists)
    if (photos && photos.length > 0) {
      reviewData.photos = photos
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert([reviewData])
      .select()
      .single()
    
    // If error is about missing photos column, try without photos
    if (error && error.message?.includes("'photos' column")) {
      console.warn('Photos column not found, inserting review without photos')
      delete reviewData.photos
      const { data: retryData, error: retryError } = await supabaseAdmin
        .from('reviews')
        .insert([reviewData])
        .select()
        .single()
      if (retryError) throw retryError
      return NextResponse.json({ 
        success: true, 
        message: 'Review submitted successfully (photos column not available)', 
        data: retryData 
      }, { status: 201 })
    }
    
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
