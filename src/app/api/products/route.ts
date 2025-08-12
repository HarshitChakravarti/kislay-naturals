import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/types';

// Temporary in-memory data to unblock client while DB models are being wired
const demoProducts: Product[] = [
  {
    id: 'p1',
    name: 'KislayNaturals Monk Fruit Sweetener',
    description:
      'Kislay Monk Fruit Sweetener Drops – 100% Natural & Zero Calorie Sugar Substitute',
    price: 299.99,
    image: '/p1.png',
    originalPrice: 329.99,
    rating: 4.5,
    numReviews: 10,
    inStock: false,
  },
  {
    id: 'p2',
    name: 'KislayNaturals Monk Fruit Powder',
    description: 'Natural sweetener powder alternative',
    price: 349.99,
    image: '/p2.png',
    originalPrice: 379.99,
    rating: 4.6,
    numReviews: 8,
    inStock: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    // Optional: handle query params via request.nextUrl.searchParams
    return NextResponse.json({ products: demoProducts }, { status: 200 });
  } catch (error) {
    console.error('Error listing products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  try {
    let body: Partial<Product>;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers,
      });
    }

    const newProduct: Product = {
      id: body.id || `p_${Date.now()}`,
      name: body.name || 'Untitled Product',
      description: body.description || '',
      price: typeof body.price === 'number' ? body.price : 0,
      image: body.image || '/p1.png',
      originalPrice:
        typeof body.originalPrice === 'number' ? body.originalPrice : (typeof body.price === 'number' ? body.price : 0),
      rating: typeof body.rating === 'number' ? body.rating : 0,
      numReviews: typeof body.numReviews === 'number' ? body.numReviews : 0,
      inStock: typeof body.inStock === 'boolean' ? body.inStock : true,
    };

    // In-memory append for demo purposes
    demoProducts.unshift(newProduct);

    return NextResponse.json({ product: newProduct }, { status: 201, headers });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
