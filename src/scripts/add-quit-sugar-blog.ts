import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });

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
    persistSession: false,
  },
});

const newBlogPost = {
  slug: 'quit-sugar-naturally-monk-fruit',
  title: 'How to Quit Sugar Naturally Without Feeling Deprived',
  excerpt: 'Want to quit sugar without cravings? Learn how monk fruit sweetener helps you transition easily.',
  content: `Most people fail at quitting sugar because they try to eliminate sweetness completely. The smarter approach? Replace sugar, not sweetness.

## Why Quitting Sugar Is So Hard

- Sugar triggers dopamine release, making you want more.
- It creates dependency through repeated highs and crashes.
- It often becomes part of emotional eating habits during stress, boredom, or low energy.

## How Monk Fruit Helps You Quit Sugar

- It satisfies sweet taste buds without using regular sugar.
- It does not cause insulin spikes, helping you avoid the sugar roller coaster.
- It supports a gradual retraining of taste preferences so you can rely less on sugar over time.

## Simple Sugar-Swap Plan

### Week 1

Replace sugar in tea and coffee with monk fruit sweetener.

### Week 2

Replace desserts and packaged snacks with monk fruit-based or no-added-sugar options.

### Week 3

Move into a fully sugar-free lifestyle with better pantry swaps and mindful habits.

Make the transition smooth with Kislay Monk Fruit Sweetener.`,
  image: '/cover2.jpg',
  author: 'Kislay Naturals',
  category: 'Health & Wellness',
  read_time: '5 min read',
  published_at: new Date().toISOString(),
  meta_title: 'How to Quit Sugar Naturally with Monk Fruit Sweetener',
  meta_description: 'Want to quit sugar without cravings? Learn how monk fruit sweetener helps you transition easily.',
  meta_keywords: 'quit sugar naturally, monk fruit sweetener, sugar cravings, sugar free lifestyle, sugar swap plan, natural sweetener',
  is_published: true,
};

async function addBlogPost() {
  try {
    console.log('Adding blog post to Supabase...');
    console.log(`Title: ${newBlogPost.title}`);
    console.log(`Slug: ${newBlogPost.slug}`);

    const { data: existingPost } = await supabaseAdmin
      .from('blogposts')
      .select('id, title')
      .eq('slug', newBlogPost.slug)
      .single();

    if (existingPost) {
      console.log('Blog post already exists. Updating...');
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .update(newBlogPost)
        .eq('slug', newBlogPost.slug)
        .select()
        .single();

      if (error) {
        console.error('Error updating blog post:', error);
        process.exit(1);
      }

      console.log('Blog post updated successfully.');
      console.log('Updated:', data?.title);
      process.exit(0);
    }

    const { data, error } = await supabaseAdmin
      .from('blogposts')
      .insert(newBlogPost)
      .select()
      .single();

    if (error) {
      console.error('Error adding blog post:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log('Blog post added successfully.');
    console.log('Created:', data?.title);
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

addBlogPost();
