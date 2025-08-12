import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import ProductDetailsWrapper from '@/components/ProductDetailsWrapper';

// Only log in non-production to avoid noisy build output
const debug = (...args: unknown[]) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...(args as []));
  }
};

// Generate static params for known product IDs
export async function generateStaticParams() {
  // Return the product IDs that should be pre-generated
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

// Import the product data directly instead of making API calls
// This avoids potential server-side fetch issues on Vercel
async function getProductById(id: string): Promise<Product | null> {
  // Return the same product data that the API would return
  // This matches the data structure from your API route
  const product: Product = {
    id,
    name: 'KislayNaturals Monk Fruit Sweetener',
    description: `Kislay Monk Fruit Sweetener Drops – 100% Natural & Zero Calorie Sugar Substitute

Fuel your lifestyle with natural, low-carb goodness – packed with clean energy, rich nutrients, and zero guilt.

Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that's perfect for your healthy lifestyle.

Whether you're diabetic, health-conscious, on a low-carb or keto diet, or simply want a clean alternative to sugar, Kislay drops deliver the same sweet taste without the crash.`,
    price: 299.99,
    image: '/p1.png',
    originalPrice: 329.99,
    rating: 4.5,
    numReviews: 10,
    inStock: true
  };

  return product;
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

    const product = await getProductById(id);

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
