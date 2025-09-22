import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if ((error as any).code === 'PGRST116') {
        return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
      }
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch review' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: review }, { status: 200 });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    // Check if review exists
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    // Check if user is the author of the review or admin
    const isAdmin = user.role === 'admin';
    const isAuthor = existingReview.email === user.email;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ success: false, message: 'Not authorized to update this review' }, { status: 403 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['rating', 'comment'];
    const updateData: any = {};
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Validate rating if provided
    if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
      return NextResponse.json({ success: false, message: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Review updated successfully',
      data,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    // Check if review exists
    const { data: existingReview, error: fetchError } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ success: false, message: 'Review not found' }, { status: 404 });
    }

    // Check if user is the author of the review or admin
    const isAdmin = user.role === 'admin';
    const isAuthor = existingReview.email === user.email;
    
    if (!isAdmin && !isAuthor) {
      return NextResponse.json({ success: false, message: 'Not authorized to delete this review' }, { status: 403 });
    }

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to delete review' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
