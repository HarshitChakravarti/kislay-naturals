import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Create Supabase admin client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Required variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// New blog post data
const newBlogPost = {
  slug: 'monk-fruit-diabetics-guide',
  title: 'Is Monk Fruit Safe for Diabetics? The Complete Guide',
  excerpt: 'Learn why monk fruit sweetener is safe for diabetics. Zero calories, zero carbs, and no effect on blood sugar levels.',
  content: `Managing diabetes often means cutting down on sugar – but that doesn't mean giving up sweetness. Monk fruit sweetener is a natural alternative that makes life sweeter without harming your health.

## Why Diabetics Need Sugar Alternatives

Excess sugar can spike blood glucose and increase insulin resistance. That's why low-glycemic sweeteners are crucial for people with diabetes.

## How Monk Fruit Helps Diabetics

- **Zero glycemic index** → does not raise blood sugar
- **No calories, no carbs** → perfect for weight control
- **Natural sweetness** → no chemicals, no aftertaste

## How to Use Monk Fruit in a Diabetic Diet

- Sweeten tea, coffee, lemonade
- Prepare sugar-free desserts
- Add to oats, yogurt, smoothies

## Conclusion

👉 If you're diabetic, **Kislay Monk Fruit Sweetener** is your guilt-free way to enjoy sweetness every day.`,
  image: '/diabetes.jpg',
  author: 'Kislay Naturals',
  category: 'Health & Diabetes',
  read_time: '5 min read',
  published_at: '2025-10-29T00:00:00.000Z',
  meta_title: 'Is Monk Fruit Sweetener Safe for Diabetics? A Complete Guide',
  meta_description: 'Learn why monk fruit sweetener is safe for diabetics. Zero calories, zero carbs, and no effect on blood sugar levels.',
  meta_keywords: 'monk fruit sweetener diabetics, diabetic friendly sweetener, zero sugar sweetener, blood sugar control, natural sweetener diabetes',
  is_published: true
};

async function addBlogPost() {
  try {
    console.log('🚀 Adding new blog post to Supabase...');
    console.log(`📝 Title: ${newBlogPost.title}`);
    console.log(`🔗 Slug: ${newBlogPost.slug}`);

    // Check if blog post already exists
    const { data: existingPost } = await supabaseAdmin
      .from('blogposts')
      .select('id, title')
      .eq('slug', newBlogPost.slug)
      .single();

    if (existingPost) {
      console.log('⚠️  Blog post already exists. Updating...');
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .update(newBlogPost)
        .eq('slug', newBlogPost.slug)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating blog post:', error);
        process.exit(1);
      }

      console.log('✅ Blog post updated successfully!');
      console.log('📄 Updated:', data?.title);
    } else {
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .insert(newBlogPost)
        .select()
        .single();

      if (error) {
        console.error('❌ Error adding blog post:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        process.exit(1);
      }

      console.log('✅ Blog post added successfully!');
      console.log('📄 Created:', data?.title);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

addBlogPost();

