'use server';

import { revalidatePath } from 'next/cache';

export async function fetchFeaturedProducts() {
  try {
    // In a real app, you would fetch from your API
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/featured`);
    // if (!response.ok) throw new Error('Failed to fetch products');
    // return await response.json();
    
    // Mock data for now
    return [
      {
        id: 1,
        name: "Monk Fruit Sweetener Drop",
        price: 229,
        originalPrice: 349,
        rating: 4.5,
        reviews: 100,
        image: "/productimage-removebg-preview.png",
        badge: "Best Seller",
        description: "Kislay Monk Fruit Sweetener Drops - 100% Natural & Zero Calorie Sugar Substitute Fuel your lifestyle with natural, low-carb goodness - packed with clean energy, rich nutrients, and zero guilt. Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that's perfect for your healthy lifestyle.",
      }
    ];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
