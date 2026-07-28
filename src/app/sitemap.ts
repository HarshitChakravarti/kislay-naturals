import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  // Ensure baseUrl has no trailing slash and uses https
  // This must match your canonical domain exactly
  let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kislaynaturals.com';
  
  // Remove trailing slash if present
  baseUrl = baseUrl.replace(/\/$/, '');
  
  // Ensure https protocol (required for sitemaps)
  if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
    baseUrl = `https://${baseUrl}`;
  } else if (baseUrl.startsWith('http://')) {
    // Convert http to https for production
    baseUrl = baseUrl.replace('http://', 'https://');
  }
  
  const now = new Date();

  // Base static pages that will be returned even if dynamic content fails
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date('2024-01-01'),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  try {
    // Fetch latest content update times to optimize lastModified dates
    const [
      latestProduct,
      latestBlogPost,
      latestRecipe
    ] = await Promise.allSettled([
      supabase
        .from('products')
        .select('created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from('blogposts')
        .select('published_at, created_at, updated_at')
        .eq('is_published', true)
        .limit(1)
        .single(),
      supabase
        .from('recipes')
        .select('created_at, updated_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
    ]);

    // Get the most recent update time across all content
    const getLatestTimestamp = () => {
      const timestamps: Date[] = [now];
      
      if (latestProduct.status === 'fulfilled' && latestProduct.value.data) {
        if (latestProduct.value.data.updated_at) {
          timestamps.push(new Date(latestProduct.value.data.updated_at));
        } else if (latestProduct.value.data.created_at) {
          timestamps.push(new Date(latestProduct.value.data.created_at));
        }
      }
      if (latestBlogPost.status === 'fulfilled' && latestBlogPost.value.data) {
        if (latestBlogPost.value.data.updated_at) {
          timestamps.push(new Date(latestBlogPost.value.data.updated_at));
        } else if (latestBlogPost.value.data.published_at) {
          timestamps.push(new Date(latestBlogPost.value.data.published_at));
        } else if (latestBlogPost.value.data.created_at) {
          timestamps.push(new Date(latestBlogPost.value.data.created_at));
        }
      }
      if (latestRecipe.status === 'fulfilled' && latestRecipe.value.data?.updated_at) {
        timestamps.push(new Date(latestRecipe.value.data.updated_at));
      }
      
      return new Date(Math.max(...timestamps.map(d => d.getTime())));
    };

    const mostRecentUpdate = getLatestTimestamp();

    // Update dynamic pages with most recent content update
    // Excluded from sitemap: test pages, checkout, account pages, order/payment success pages
    // These are either development-only, require authentication, or are session-specific
    staticPages[0].lastModified = mostRecentUpdate; // Homepage
    staticPages[1].lastModified = mostRecentUpdate; // Products page
    staticPages[2].lastModified = mostRecentUpdate; // Blog page
    staticPages[3].lastModified = mostRecentUpdate; // Recipes page

    // --- Dynamic Pages ---
    let dynamicPages: MetadataRoute.Sitemap = [];

    // Fetch all dynamic content in parallel for better performance
    const [productsResult, blogpostsResult, recipesResult] = await Promise.allSettled([
      supabase
        .from('products')
        .select('id, slug, created_at, updated_at')
        .eq('in_stock', true),
      supabase
        .from('blogposts')
        .select('slug, updated_at, published_at, created_at')
        .eq('is_published', true),
      supabase
        .from('recipes')
        .select('id, slug, updated_at, created_at')
        .eq('is_published', true)
    ]);

    // --- Process Products ---
    if (productsResult.status === 'fulfilled' && productsResult.value.data) {
      const { data: products } = productsResult.value;
      const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug || product.id}`,
        lastModified: product.updated_at 
          ? new Date(product.updated_at) 
          : (product.created_at ? new Date(product.created_at) : now),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));
      dynamicPages = [...dynamicPages, ...productPages];
    } else if (productsResult.status === 'fulfilled' && productsResult.value.error) {
      console.error('Error fetching products for sitemap:', productsResult.value.error);
    }

    // --- Process Blog Posts ---
    if (blogpostsResult.status === 'fulfilled' && blogpostsResult.value.data) {
      const { data: blogposts } = blogpostsResult.value;
      const blogPages = blogposts
        .filter(blogpost => blogpost.slug) // Only include blogs with slugs
        .map((blogpost) => ({
          url: `${baseUrl}/blog/${blogpost.slug}`,
          lastModified: blogpost.updated_at 
            ? new Date(blogpost.updated_at) 
            : (blogpost.published_at 
                ? new Date(blogpost.published_at) 
                : (blogpost.created_at ? new Date(blogpost.created_at) : now)),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }));
      dynamicPages = [...dynamicPages, ...blogPages];
    } else if (blogpostsResult.status === 'fulfilled' && blogpostsResult.value.error) {
      console.error('Error fetching blogposts for sitemap:', blogpostsResult.value.error);
    }

    // --- Process Recipes ---
    if (recipesResult.status === 'fulfilled' && recipesResult.value.data) {
      const { data: recipes } = recipesResult.value;
      const recipePages = recipes.map((recipe) => ({
        url: `${baseUrl}/recipes/${recipe.slug || recipe.id}`,
        lastModified: recipe.updated_at 
          ? new Date(recipe.updated_at) 
          : (recipe.created_at ? new Date(recipe.created_at) : now),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
      dynamicPages = [...dynamicPages, ...recipePages];
    } else if (recipesResult.status === 'fulfilled' && recipesResult.value.error) {
      console.error('Error fetching recipes for sitemap:', recipesResult.value.error);
    }

    return [...staticPages, ...dynamicPages];

  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return static pages even if dynamic content fetching fails
    return staticPages;
  }
}