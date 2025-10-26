import { supabaseAdmin } from './supabase';

// Utility functions for content synchronization

export interface BlogPostData {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: string;
  category?: string;
  read_time?: string;
  published_at?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_published?: boolean;
}

export interface RecipeData {
  title: string;
  description?: string;
  prep_time?: string;
  cook_time?: string;
  total_time?: string;
  servings?: number;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  image?: string;
  ingredients: string[];
  instructions: string[];
  nutrition?: Record<string, any>;
  tips?: string[];
  author?: string;
  is_published?: boolean;
}

// Sync a blog post to the database
export async function syncBlogPost(blogPostData: BlogPostData) {
  try {
    // Check if blog post already exists
    const { data: existingPost } = await supabaseAdmin
      .from('blogposts')
      .select('id')
      .eq('slug', blogPostData.slug)
      .single();

    let result;
    if (existingPost) {
      // Update existing post
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .update(blogPostData)
        .eq('slug', blogPostData.slug)
        .select()
        .single();
      
      if (error) throw error;
      result = { data, action: 'updated' };
    } else {
      // Create new post
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .insert(blogPostData)
        .select()
        .single();
      
      if (error) throw error;
      result = { data, action: 'created' };
    }

    console.log(`✅ Blog post ${result.action}: ${blogPostData.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Error syncing blog post ${blogPostData.slug}:`, error);
    throw error;
  }
}

// Sync a recipe to the database
export async function syncRecipe(recipeData: RecipeData) {
  try {
    // Check if recipe already exists by title
    const { data: existingRecipe } = await supabaseAdmin
      .from('recipes')
      .select('id')
      .eq('title', recipeData.title)
      .single();

    let result;
    if (existingRecipe) {
      // Update existing recipe
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .update(recipeData)
        .eq('id', existingRecipe.id)
        .select()
        .single();
      
      if (error) throw error;
      result = { data, action: 'updated' };
    } else {
      // Create new recipe
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .insert(recipeData)
        .select()
        .single();
      
      if (error) throw error;
      result = { data, action: 'created' };
    }

    console.log(`✅ Recipe ${result.action}: ${recipeData.title}`);
    return result;
  } catch (error) {
    console.error(`❌ Error syncing recipe ${recipeData.title}:`, error);
    throw error;
  }
}

// Get all blog posts from database
export async function getAllBlogPosts() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogposts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// Get all recipes from database
export async function getAllRecipes() {
  try {
    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

// Delete a blog post
export async function deleteBlogPost(slug: string) {
  try {
    const { error } = await supabaseAdmin
      .from('blogposts')
      .delete()
      .eq('slug', slug);

    if (error) throw error;
    console.log(`✅ Blog post deleted: ${slug}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error deleting blog post ${slug}:`, error);
    throw error;
  }
}

// Delete a recipe
export async function deleteRecipe(id: number) {
  try {
    const { error } = await supabaseAdmin
      .from('recipes')
      .delete()
      .eq('id', id);

    if (error) throw error;
    console.log(`✅ Recipe deleted: ID ${id}`);
    return { success: true };
  } catch (error) {
    console.error(`❌ Error deleting recipe ${id}:`, error);
    throw error;
  }
}
