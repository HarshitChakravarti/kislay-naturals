import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/ProductDetailClient';

export const revalidate = 0; // Ensure data is always fresh

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = params;

  if (!id) {
    return notFound();
  }

  // Regex to check if the path param is a valid UUID
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

  // Query Supabase by id if it is a UUID, otherwise fall back to slug matching
  let query = supabase.from('products').select('*');
  
  if (isUUID) {
    query = query.eq('id', id);
  } else {
    query = query.eq('slug', id);
  }

  const { data: product, error } = await query.single();

  if (error || !product) {
    console.error(`[ProductDetail] Error fetching product with identifier "${id}":`, error);
    return notFound();
  }

  return <ProductDetailClient product={product} />;
}
