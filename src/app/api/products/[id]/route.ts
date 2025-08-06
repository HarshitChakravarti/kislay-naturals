import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// TODO: Replace this with your actual product data or database query
const getProduct = async (id: string): Promise<Product | null> => {
  // Implement your product fetching logic here
  // This is just a placeholder
  return {
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
    inStock: false
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Ensure params is available before destructuring
  const { id } = await params;

  try {
    const product = await getProduct(id);
    
    if (!product) {
      return new NextResponse(JSON.stringify({ error: 'Product not found' }), {
        status: 404,
      });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
