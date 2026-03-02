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
  slug: 'artificial-sweeteners-health-risks',
  title: 'Hidden Health Risks of Artificial Sweeteners You Should Know',
  excerpt: 'Learn about the health risks of artificial sweeteners and why natural options like monk fruit are safer.',
  content: `Artificial sweeteners are often marketed as "safe," but growing research raises concerns about long-term usage. Here's what you need to know before reaching for that sugar-free label.

## Common Problems Linked to Artificial Sweeteners

While artificial sweeteners like aspartame, sucralose, and saccharin promise zero calories and guilt-free sweetness, studies are increasingly pointing to hidden downsides that most people aren't aware of.

- **Gut Microbiome Imbalance** — Artificial sweeteners can alter the composition of beneficial gut bacteria, disrupting digestion and weakening immunity over time.
- **Increased Sugar Cravings** — They trick the brain into expecting calories that never arrive, often leading to stronger sugar cravings and overeating later.
- **Digestive Discomfort** — Many people experience bloating, gas, and stomach issues after regular consumption of artificial sweeteners like sorbitol and xylitol.
- **Possible Metabolic Effects** — Research suggests artificial sweeteners may interfere with glucose metabolism, potentially increasing the risk of metabolic syndrome.

⚠️ What seems like a healthy swap may actually be doing more harm than good in the long run.

## Why Natural Matters

When it comes to sweetening your food, the source matters just as much as the calories. Natural sweeteners like monk fruit offer a fundamentally different — and safer — approach.

Natural sweeteners like monk fruit are:

- **Plant-Derived** — Monk fruit sweetener comes directly from the Luo Han Guo fruit — no chemicals, no lab processing.
- **Non-Addictive** — Unlike artificial options that can heighten cravings, monk fruit satisfies your sweet tooth without creating a dependency cycle.
- **Easier on Digestion** — Monk fruit is gentle on the gut and doesn't cause the bloating, gas, or discomfort commonly associated with artificial sweeteners.

## A Safer Alternative

Monk fruit contains mogrosides, natural compounds that provide sweetness without harming your metabolism. These antioxidant-rich compounds are up to 200 times sweeter than sugar, yet they have zero calories, zero glycemic impact, and no known side effects.

Unlike artificial sweeteners that are engineered in labs, mogrosides are extracted from the monk fruit using a gentle, natural process — preserving all the benefits nature intended.

💡 Did you know? Monk fruit has been used in traditional Chinese medicine for centuries and has been generally recognised as safe (GRAS) by the FDA.

👉 Choose safety over shortcuts with **Kislay Monk Fruit Sweetener** — 100% natural, zero calories, and gentle on your body.`,
  image: '/cover4.jpg',
  author: 'Kislay Naturals',
  category: 'Health & Wellness',
  read_time: '5 min read',
  published_at: new Date().toISOString(),
  meta_title: 'Hidden Dangers of Artificial Sweeteners',
  meta_description: 'Learn about the health risks of artificial sweeteners and why natural options like monk fruit are safer.',
  meta_keywords: 'artificial sweeteners health risks, dangers of artificial sweeteners, monk fruit vs artificial sweeteners, natural sweetener, sugar substitute side effects, gut health sweeteners',
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
