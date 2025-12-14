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
  slug: 'monk-fruit-sugar-cravings',
  title: 'Can Monk Fruit Sweetener Help Reduce Sugar Cravings?',
  excerpt: 'Struggling with sugar cravings? Learn how monk fruit sweetener helps control appetite and supports a sugar-free lifestyle.',
  content: `Cravings are the biggest reason people fail to quit sugar. The solution? A natural sweetener that satisfies taste without triggering addiction.

## Why Sugar Makes You Crave More

Sugar spikes blood glucose → leads to a crash → triggers more cravings.

This cycle fuels overeating and weight gain.

## Monk Fruit Helps Break the Craving Cycle

- **Stable energy levels** - No sugar highs and crashes
- **Zero calories** - Enjoy sweetness without guilt
- **No insulin spikes** - Keeps blood sugar stable
- **Reduces reward-center dependency on sugar** - Helps break the addiction cycle

It lets you enjoy sweet flavors while your body adjusts to lower sugar dependence.

## Smart Swaps for Sugar-Free Living

| Instead of | Use Monk Fruit In |
|------------|-------------------|
| Sugar in tea | Daily beverages |
| Soft drinks | Lemon water |
| Sweetened yogurt | Homemade flavored yogurt |
| Chocolate/ sweets | Sugar-free desserts |

👉 Reduce cravings naturally with **Kislay Monk Fruit Sweetener** — sweetness without addiction.`,
  image: '/cover3.jpg',
  author: 'Kislay Naturals',
  category: 'Health & Wellness',
  read_time: '5 min read',
  published_at: new Date().toISOString(),
  meta_title: 'Monk Fruit for Sugar Cravings — A Natural Solution',
  meta_description: 'Struggling with sugar cravings? Learn how monk fruit sweetener helps control appetite and supports a sugar-free lifestyle.',
  meta_keywords: 'monk fruit sweetener sugar cravings, reduce sugar cravings, natural sweetener, sugar addiction, sugar-free lifestyle, control appetite',
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

