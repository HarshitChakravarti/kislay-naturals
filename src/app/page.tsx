import HomeClient from '@/components/HomeClient';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/types';

export default async function Home() {
  // Fetch featured products from database
  let featuredProducts: Product[] = [];
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(3); // Show top 3 products as featured
    
    // Ensure originalPrice is set for all products
    if (data) {
      data.forEach(product => {
        if (!product.originalPrice) {
          product.originalPrice = 350; // Set default original price
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
          originalPrice: 350,
          image: '/p1.png',
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
        originalPrice: 350,
        image: '/p1.png',
        description: 'The perfect monk fruit sweetener for you',
        inStock: true
      }
    ];
  }

  return (
    <main>
      <HomeClient products={featuredProducts} />
    </main>
  );
}
