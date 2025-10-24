import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kislaynaturals.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/recipes`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ]

  // Dynamic pages from database
  let dynamicPages: MetadataRoute.Sitemap = []

  try {
    // Fetch products from Supabase
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('in_stock', true)

    if (!productsError && products) {
      const productPages = products.map((product) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: product.updated_at ? new Date(product.updated_at) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))
      dynamicPages = [...dynamicPages, ...productPages]
    }

    // Add hardcoded blog posts (since they're currently hardcoded)
    const blogPosts = [
      'monk-fruit-daily-uses',
      'monk-fruit-weight-loss', 
      'monk-fruit-3',
      'monk-fruit-2',
      'monk-fruit-1'
    ]

    const blogPages = blogPosts.map((slug) => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
    dynamicPages = [...dynamicPages, ...blogPages]

    // Add hardcoded recipes (since they're currently hardcoded)
    const recipeIds = [1, 2, 3, 4, 5, 6]
    const recipePages = recipeIds.map((id) => ({
      url: `${baseUrl}/recipes/${id}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
    dynamicPages = [...dynamicPages, ...recipePages]

  } catch (error) {
    console.error('Error fetching dynamic pages for sitemap:', error)
    // Continue with static pages even if dynamic pages fail
  }

  return [...staticPages, ...dynamicPages]
}
