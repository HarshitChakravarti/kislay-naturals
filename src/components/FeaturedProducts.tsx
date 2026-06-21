"use client";

import { Product } from "@/types"
import ProductCard from './ProductCard'

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // If no products, don't render anything (handled by parent)
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="py-0">
      {/* Header with green background and gradient shadow */}
      <div className="relative bg-green-700 text-white py-8 md:py-12 w-full overflow-hidden">
        {/* Gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        {/* Content layer */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className={`text-3xl md:text-5xl font-semibold mb-4 font-heading`}>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  CHECK OUT OUR SWEET FAVOURITE!
                </span>
                {' \u{1F970}'}
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
                Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
                individuals
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50">
        <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-8">
          {/* Products - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} layout="grid" />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
