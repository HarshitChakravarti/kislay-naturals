import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// TODO: Replace this with your actual product data or database query
const getProduct = async (id: string): Promise<Product | null> => {
  // Implement your product fetching logic here
  // This is just a placeholder
  return {
    id,
    name: 'KislayNaturals Monk Fruit Sweetener',
    description: 'Pure monk fruit extract sweetener. Zero calories, diabetic-friendly, and perfect for keto diet. Natural alternative to sugar with no artificial ingredients.',
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
