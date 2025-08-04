import { Suspense } from 'react';
import { fetchFeaturedProducts } from './actions/productActions';
import HomeClient from '@/components/HomeClient';

export default async function Home() {
  // Fetch data on the server
  let products: Array<{
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    rating?: number;
    reviews?: number;
    image: string;
    badge?: string;
    description: string;
  }> = [];
  
  try {
    products = await fetchFeaturedProducts() || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeClient products={products} />
    </Suspense>
  );
}
