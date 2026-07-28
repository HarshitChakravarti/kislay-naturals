import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import ProductDetailClient from '@/components/ProductDetailClient';

export const revalidate = 0; // Ensure data is always fresh

interface ProductPageProps {
  params: {
    slug: string;
  };
}

import type { Metadata } from 'next';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const supabase = await createClient();
  const { slug } = params;
  
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
  let query = supabase.from('products').select('name, description');
  
  if (isUUID) {
    query = query.eq('id', slug);
  } else {
    query = query.eq('slug', slug);
  }
  
  const { data: product } = await query.single();
  
  if (!product) {
    return { title: 'Product Not Found | Kislay Naturals' };
  }
  
  return {
    title: `${product.name} | Kislay Naturals`,
    description: product.description ? product.description.substring(0, 160) : undefined,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = await createClient();
  const { slug } = params;

  if (!slug) {
    return notFound();
  }

  // Regex to check if the path param is a valid UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  // Query Supabase by id if it is a UUID, otherwise fall back to slug matching
  let query = supabase.from('products').select('*');
  
  if (isUUID) {
    query = query.eq('id', slug);
  } else {
    query = query.eq('slug', slug);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    console.error(`[ProductDetail] Error fetching product with identifier "${slug}":`, error);
    return notFound();
  }

  // Fetch reviews to get average rating and total count
  const { data: reviewsData } = await supabaseAdmin
    .from('reviews')
    .select('rating')
    .eq('product_id', product.id);

  let averageRating = 0;
  let totalReviews = 0;

  if (reviewsData && reviewsData.length > 0) {
    const validReviews = reviewsData.filter(r => r.rating != null);
    totalReviews = validReviews.length;
    if (totalReviews > 0) {
      const sum = validReviews.reduce((acc, curr) => acc + curr.rating, 0);
      averageRating = sum / totalReviews;
    }
  }

  return <ProductDetailClient product={product} reviewStats={{ averageRating, totalReviews }} />;
}
