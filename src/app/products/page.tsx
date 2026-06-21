import React from 'react';
import Image from 'next/image';
import { Star, ShoppingCart, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import ProductCard from '../../components/ProductCard';

export const revalidate = 0; // Disable caching to ensure fresh data
export const dynamic = 'force-dynamic';

const ProductsPage = async () => {
  // Fetch all products from database
  let products: any[] = [];
  
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('price', { ascending: true });
    
    // Ensure originalPrice and variants are set for all products
    if (data) {
      data.forEach(product => {
        if (!product.originalPrice) {
          product.originalPrice = 399; // Set default original price
        }
        // Ensure variants are set with default values if not present
        if (!product.variants || (Array.isArray(product.variants) && product.variants.length === 0)) {
          product.variants = [
            { size: '10ml', price: 299, originalPrice: 399 },
            { size: '30ml', price: 699, originalPrice: 999 }
          ];
        }
      });
    }
    
    if (error) {
      console.error('Error fetching products:', error);
      // Fallback to hardcoded data if database fails
      products = [{
        id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8',
        name: 'Kislay Monk Fruit Sweetener Drops',
        price: 299,
        originalPrice: 399,
        image: '/sweetener-drops/10ml.png',
        description: 'The perfect monk fruit sweetener for you',
        in_stock: true,
        badge: 'Featured'
      }];
    } else {
      products = data || [];
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    // Fallback to hardcoded data if database fails
    products = [{
      id: 'e60c3e2e-083b-4da2-8cb4-6789f934f7a8',
      name: 'Kislay Monk Fruit Sweetener Drops',
      price: 299,
      originalPrice: 399,
      image: '/p1.png',
      description: 'The perfect monk fruit sweetener for you',
      inStock: true,
      rating: 4.5,
      numReviews: 12,
      badge: 'Featured'
    }];
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with green background and gradient shadow */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        {/* Gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        {/* Content layer */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className={`text-3xl md:text-5xl font-semibold mb-4 font-heading`}>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  OUR PRODUCTS
                </span>
                {' \u{1F970}'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
                Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
                individuals
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          {/* Products - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        </div>
      </div>

      {/* More Products Coming Soon Section */}
      <div className="bg-green-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-black mb-4 font-heading`}>
            More Products Coming Soon! 🚀
          </h2>
          <p className="text-lg md:text-xl text-green-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            We&apos;re constantly working on expanding our range of natural, sugar-free products. 
            Stay tuned for exciting new additions to our collection!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <span>🏠</span>
              Back to Home
            </Link>
            <Link 
              href="/contact-us"
              className="inline-flex items-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <span>📧</span>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
