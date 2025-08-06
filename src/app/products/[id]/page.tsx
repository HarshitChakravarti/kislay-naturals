import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetailsWrapper from '@/components/ProductDetailsWrapper';

async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`);
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
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  // Ensure params is available before destructuring
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
