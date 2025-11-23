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
  slug: 'monk-fruit-vs-artificial-sweeteners',
  title: 'Monk Fruit vs Artificial Sweeteners — Which Is the Healthier Choice?',
  excerpt: 'Learn why monk fruit sweetener is a safer choice than artificial sweeteners like aspartame or sucralose. 100% natural, zero calories, and diabetic-friendly.',
  content: `There are many sugar substitutes in the market today — but not all of them are healthy. While some are made chemically, monk fruit sweetener is 100% natural and safer for long-term use.

## What Are Artificial Sweeteners?

Artificial sweeteners are synthetic sugar substitutes that provide sweetness without calories. Common examples include:

- **Aspartame** — Found in diet sodas and sugar-free products
- **Sucralose** — Marketed as Splenda, used in many processed foods
- **Saccharin** — One of the oldest artificial sweeteners, often found in tabletop sweeteners

These may provide sweetness without calories but may also come with health concerns, including potential links to digestive issues, headaches, and long-term health risks.

## Why Monk Fruit Stands Out

Monk fruit contains mogrosides, known for their antioxidant benefits — something artificial sweeteners lack. These natural compounds not only provide sweetness but also offer potential health benefits.

**Comparison:**

| Feature | Monk Fruit | Artificial Sweeteners |
|---------|------------|----------------------|
| Source | Natural fruit | Synthetic chemicals |
| Effect on blood sugar | None | None |
| Long-term safety | Considered safe | Some linked to side effects |
| Taste | Clean & natural | Metallic or bitter aftertaste |

## Best Sweetener for Health?

If you care about natural, clean, and safe sweetening — monk fruit is the clear winner. Unlike artificial sweeteners that are created in laboratories, monk fruit sweetener comes directly from nature, making it a better choice for those who prioritize whole, unprocessed foods.

Monk fruit sweetener offers the sweetness you crave without the concerns associated with artificial alternatives. It's perfect for diabetics, weight watchers, and anyone looking to reduce their intake of processed chemicals.

👉 Choose a healthier future with Kislay Monk Fruit Sweetener — pure sweetness, naturally.`,
  image: '/cover.jpg',
  author: 'Kislay Naturals',
  category: 'Health & Wellness',
  read_time: '5 min read',
  published_at: new Date().toISOString(),
  meta_title: 'Monk Fruit vs Artificial Sweeteners — The Healthier Sugar Alternative',
  meta_description: 'Learn why monk fruit sweetener is a safer choice than artificial sweeteners like aspartame or sucralose. 100% natural, zero calories, and diabetic-friendly.',
  meta_keywords: 'monk fruit vs artificial sweeteners, aspartame, sucralose, saccharin, natural sweetener, healthy sugar alternative, monk fruit benefits, artificial sweetener side effects',
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

