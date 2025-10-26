import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET /api/blogposts/[slug] - Get a specific blog post by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const { data: blogpost, error } = await supabase
      .from('blogposts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      console.error('Error fetching blogpost:', error);
      return NextResponse.json({ error: 'Failed to fetch blogpost' }, { status: 500 });
    }

    // Increment view count
    await supabaseAdmin
      .from('blogposts')
      .update({ view_count: (blogpost.view_count || 0) + 1 })
      .eq('id', blogpost.id);

    return NextResponse.json({ blogpost });
  } catch (error) {
    console.error('Error in GET /api/blogposts/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/blogposts/[slug] - Update a blog post
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();

    const { data: blogpost, error } = await supabaseAdmin
      .from('blogposts')
      .update(body)
      .eq('slug', slug)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      console.error('Error updating blogpost:', error);
      return NextResponse.json({ error: 'Failed to update blogpost' }, { status: 500 });
    }

    return NextResponse.json({ blogpost });
  } catch (error) {
    console.error('Error in PUT /api/blogposts/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/blogposts/[slug] - Delete a blog post
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const { error } = await supabaseAdmin
      .from('blogposts')
      .delete()
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting blogpost:', error);
      return NextResponse.json({ error: 'Failed to delete blogpost' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/blogposts/[slug]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
