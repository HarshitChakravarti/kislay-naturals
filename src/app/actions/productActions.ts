'use server';

import { supabase } from '@/lib/supabase';

export async function fetchFeaturedProducts() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('created_at', { ascending: false })
      .limit(3);
    
    if (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to mock data if database fails
      return [
        {
          id: 1,
          name: "Monk Fruit Sweetener Drop",
          price: 229,
          originalPrice: 349,
          rating: 4.5,
          numReviews: 100,
          reviews: [],
          image: "/productimage-removebg-preview.png",
          badge: "Best Seller",
          description: "Kislay Monk Fruit Sweetener Drops - 100% Natural & Zero Calorie Sugar Substitute Fuel your lifestyle with natural, low-carb goodness - packed with clean energy, rich nutrients, and zero guilt. Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that's perfect for your healthy lifestyle.",
        }
      ];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}
