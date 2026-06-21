import HomeClient from '@/components/HomeClient';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import type { Product } from '@/types';

export const revalidate = 0; // Disable caching to ensure fresh data

export default async function Home() {
  // Fetch featured products from database
  let featuredProducts: Product[] = [];
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('price', { ascending: true })
      .limit(3); // Show top 3 products as featured
    
    // Ensure originalPrice is set for all products
    if (data) {
      data.forEach(product => {
        if (!product.originalPrice) {
          product.originalPrice = 399; // Set default original price
        }
      });
    }
    
    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to hardcoded data if database fails
      featuredProducts = [
        {
          id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8',
          name: 'Kislay Monk Fruit Sweetener Drops',
          price: 299,
          originalPrice: 399,
          image: '/sweetener-drops/10ml.png',
          description: 'The perfect monk fruit sweetener for you',
          inStock: true
        }
      ];
    } else {
      featuredProducts = data || [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to hardcoded data if database fails
    featuredProducts = [
      {
        id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8',
        name: 'Kislay Monk Fruit Sweetener Drops',
        price: 299,
        originalPrice: 399,
        image: '/p1.png',
        description: 'The perfect monk fruit sweetener for you',
        inStock: true
      }
    ];
  }

  // Fetch blog posts from database
  let blogPosts: any[] = [];
  
  try {
    const { data, error } = await supabaseAdmin
      .from('blogposts')
      .select('*')
      .eq('is_published', true);
      // No limit - show all published blog posts
    
    if (error) {
      console.error('Error fetching blog posts:', error);
      blogPosts = [];
    } else {
      // Filter out any posts with missing required fields (slug and title are required)
      // published_at is optional - we'll use created_at as fallback for sorting
      blogPosts = (data || []).filter(post => 
        post && 
        post.slug && 
        post.title
      );
      
      // Sort by published_at (descending), fallback to created_at if published_at is missing
      blogPosts.sort((a, b) => {
        const dateA = a.published_at || a.created_at || '';
        const dateB = b.published_at || b.created_at || '';
        return dateB.localeCompare(dateA); // Descending order (newest first)
      });
      
      console.log('Homepage blog posts fetched:', blogPosts.length, 'out of', data?.length || 0, 'total');
      if (blogPosts.length < (data?.length || 0)) {
        const missing = (data || []).filter(post => !post || !post.slug || !post.title);
        console.log('Filtered out posts:', missing.map(p => ({ slug: p?.slug, title: p?.title?.substring(0, 50) })));
      }
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    blogPosts = [];
  }

  return (
    <main>
      <HomeClient products={featuredProducts} blogPosts={blogPosts} />
    </main>
  );
}
