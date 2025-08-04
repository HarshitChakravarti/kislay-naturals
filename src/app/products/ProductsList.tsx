"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Loading from '../loading';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category?: string;
}

export default function ProductsList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run on the client side
    if (!isClient) return;

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Convert searchParams to URLSearchParams
        const params = new URLSearchParams();
        const category = searchParams?.get('category');
        const search = searchParams?.get('search');
        
        if (category) params.set('category', category);
        if (search) params.set('search', search);
        
        const response = await fetch(`/api/products?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, isClient]);

  if (isLoading) return <Loading />;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Products List</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-2">₹{product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{product.description}</p>
              {product.category && (
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">
                  {product.category}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
