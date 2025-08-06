import { Product } from '@/types';

export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`/api/products/${id}`);
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}
