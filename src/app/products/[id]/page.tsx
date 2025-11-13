import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetailsWrapper from '@/components/ProductDetailsWrapper';
import { supabase, supabaseAdmin } from '@/lib/supabase';

// Force dynamic rendering to ensure review counts are always fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Disable caching completely for this page

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
    
    // First, get an accurate count of all reviews (using head: true for efficiency)
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('reviews')
      .select('id', { count: 'exact', head: true })
      .eq('product_id', productId);

    if (countError) {
      console.error('Error fetching review count:', countError);
    }

    // Then, fetch all reviews (select id and rating to get all rows, including null ratings)
    // Using 'id,rating' ensures we get all reviews, even if rating is null
    const { data: reviews, error: reviewsError } = await supabaseAdmin
      .from('reviews')
      .select('id, rating')
      .eq('product_id', productId);

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      // Return product with count even if rating fetch fails
      return {
        ...product,
        avgRating: 0,
        numReviews: totalCount ?? 0,
      };
    }

    // Use the count from the count query (most accurate - includes all reviews)
    // Fall back to array length only if count is not available
    const totalReviews = totalCount !== null && totalCount !== undefined ? totalCount : (reviews?.length ?? 0);
    
    // Calculate average rating only from reviews with valid ratings
    // Filter out null/undefined ratings for accurate average calculation
    const reviewsWithRatings = (reviews || []).filter(review => 
      review.rating !== null && review.rating !== undefined
    );
    
    const sumRatings = reviewsWithRatings.reduce((sum, review) => {
      const rating = typeof review.rating === 'number' ? review.rating : parseFloat(String(review.rating));
      return sum + (isNaN(rating) ? 0 : rating);
    }, 0);
    
    // Calculate average only from reviews with valid ratings
    // But display total count of all reviews
    const averageRating = reviewsWithRatings.length > 0 ? sumRatings / reviewsWithRatings.length : 0;

    debug(`Product ${productId}: Found ${totalReviews} reviews (count query: ${totalCount}, array length: ${reviews?.length ?? 0}), avg rating: ${averageRating}`);

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
