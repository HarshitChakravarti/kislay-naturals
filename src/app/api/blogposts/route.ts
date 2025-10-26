import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// GET /api/blogposts - Get all published blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('blogposts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: blogposts, error } = await query;

    if (error) {
      console.error('Error fetching blogposts:', error);
      return NextResponse.json({ error: 'Failed to fetch blogposts' }, { status: 500 });
    }

    return NextResponse.json({ blogposts });
  } catch (error) {
    console.error('Error in GET /api/blogposts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/blogposts - Create a new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      excerpt,
      content,
      image,
      author = 'Kislay Naturals',
      category,
      read_time,
      published_at,
      meta_title,
      meta_description,
      meta_keywords,
      is_published = true
    } = body;

    // Validate required fields
    if (!slug || !title || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, title, content' },
        { status: 400 }
      );
    }

    const { data: blogpost, error } = await supabaseAdmin
      .from('blogposts')
      .insert({
        slug,
        title,
        excerpt,
        content,
        image,
        author,
        category,
        read_time,
        published_at: published_at || new Date().toISOString(),
        meta_title,
        meta_description,
        meta_keywords,
        is_published
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blogpost:', error);
      return NextResponse.json({ error: 'Failed to create blogpost' }, { status: 500 });
    }

    return NextResponse.json({ blogpost }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/blogposts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
