import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetailsWrapper from '@/components/ProductDetailsWrapper';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Only log in non-production to avoid noisy build output
const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...(args as []));
  }
};

// Generate static params for known product IDs
export async function generateStaticParams() {
  try {
    // Fetch actual product IDs from database
    const { data: products, error } = await supabase
      .from('products')
      .select('id, slug')
      .eq('in_stock', true);
    
    if (error) {
      console.error('Error fetching products for static params:', error);
      // Fallback to known IDs
      return [
        { id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8' }, // Your Kislay product
      ];
    }
    
    // Return both ID and slug for flexibility
    return products?.map(product => ({
      id: product.id,
    })) || [];
  } catch (error) {
    console.error('Error in generateStaticParams:', error);
    // Fallback to known IDs
    return [
      { id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8' }, // Your Kislay product
    ];
  }
}

// Fetch product data from database
async function getProductById(id: string): Promise<Product | null> {
  try {
    debug('Fetching product with ID:', id);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    // Ensure originalPrice is set
    if (data && !data.originalPrice) {
      data.originalPrice = 350; // Set default original price
    }

    if (error) {
      console.error('Error fetching product by ID:', error);
      
      // Try to find by slug as fallback
      const { data: slugData, error: slugError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', id)
        .single();
      
      // Ensure originalPrice is set for slug data
      if (slugData && !slugData.originalPrice) {
        slugData.originalPrice = 350; // Set default original price
      }
      
      if (slugError) {
        console.error('Error fetching product by slug:', slugError);
        
        // Fallback to hardcoded product data for legacy ID '1'
        if (id === '1') {
          debug('Using fallback product data for legacy ID 1');
          return {
            id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8', // Use the real UUID from database
            name: 'Kislay Monk Fruit Sweetener Drops',
            price: 299,
            originalPrice: 350,
            image: '/p1.png',
            description: 'The perfect monk fruit sweetener for you. Made from 100% natural monk fruit extract, our sweetener provides the perfect balance of sweetness without any calories or artificial ingredients.',
            in_stock: true,
            badge: 'Featured',
            category: 'Sweeteners',
            slug: 'kislay-monk-fruit-sweetener-drops'
          } as Product;
        }
        
        return null;
      }
      
      debug('Found product by slug:', slugData);
      return slugData as Product;
    }

    debug('Found product by ID:', data);
    return data as Product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

async function getProductByIdWithReviews(id: string): Promise<Product | null> {
  const product = await getProductById(id);
  if (!product) {
    return null;
  }

  try {
    // Use supabaseAdmin to bypass RLS and ensure we get all reviews
    // Convert product.id to string to ensure proper matching
    const productId = product.id.toString();
    
    const { data: reviews, error, count } = await supabaseAdmin
      .from('reviews')
      .select('rating', { count: 'exact' })
      .eq('product_id', productId);

    if (error) {
      console.error('Error fetching reviews:', error);
      // Return product without review data if reviews fetch fails
      return {
        ...product,
        avgRating: 0,
        numReviews: 0,
      };
    }

    // Use count if available, otherwise use reviews.length
    const totalReviews = count ?? (reviews?.length ?? 0);
    
    // Calculate average rating from actual review data
    const sumRatings = (reviews || []).reduce((sum, review) => {
      const rating = typeof review.rating === 'number' ? review.rating : parseFloat(review.rating);
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);
    
    const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

    return {
      ...product,
      avgRating: Math.round(averageRating * 10) / 10,
      numReviews: totalReviews,
    };
  } catch (error) {
    console.error('Error processing reviews:', error);
    return {
      ...product,
      avgRating: 0,
      numReviews: 0,
    };
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const { id } = params;
    
    if (!id) {
      notFound();
    }

    const product = await getProductByIdWithReviews(id);

    if (!product) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        <ProductDetailsWrapper product={product} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
