import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// POST /api/webhooks/sync-blog - Sync blog post from file system to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, action = 'create' } = body;

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // This webhook would be called when a new blog post is created or updated
    // For now, we'll just log the action
    console.log(`Blog post ${action} webhook triggered for slug: ${slug}`);

    // In a real implementation, you would:
    // 1. Read the blog post file from the file system
    // 2. Parse the content and metadata
    // 3. Insert or update the database record
    // 4. Handle any errors appropriately

    return NextResponse.json({ 
      success: true, 
      message: `Blog post ${action} webhook processed for ${slug}` 
    });
  } catch (error) {
    console.error('Error in blog sync webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
