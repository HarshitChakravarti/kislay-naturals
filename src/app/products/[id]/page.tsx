import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetailsWrapper from '@/components/ProductDetailsWrapper';

async function fetchProductById(id: string): Promise<Product | null> {
  try {
    // Use relative URL for API calls to work in both local and production environments
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NODE_ENV === 'development' 
        ? 'http://localhost:3000' 
        : '';
    
    const url = baseUrl ? `${baseUrl}/api/products/${id}` : `/api/products/${id}`;
    const response = await fetch(url, {
      // Add cache control for better performance
      next: { revalidate: 60 }
    });
    
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const product = await fetchProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <ProductDetailsWrapper product={product} />
    </div>
  );
}
