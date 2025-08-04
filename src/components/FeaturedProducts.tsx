"use client";

import Image from "next/image"
import { ShoppingCart, Star, ArrowRight } from "lucide-react"
import { Product } from "@/types"

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  // If no products, don't render anything (handled by parent)
  if (!products || products.length === 0) {
    return null;
  }
  
  // For now, just use the first product as featured
  const product = products[0];

  return (
    <section className="py-0">
      {/* Header with green background and gradient shadow */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        {/* Gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        {/* Content layer */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  CHECK OUT OUR SWEET FAVOURITE!
                </span>
                {' \u{1F970}'}
              </h2>
              <p className="text-lg font-medium text-white/90 max-w-2xl mx-auto">
                Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
                individuals
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mx-auto px-4 pt-8 pb-16 md:pt-12 md:pb-24">
        {/* Product Card - Responsive Layout */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden group w-full">
          {/* Mobile & Tablet: Vertical Layout */}
          <div className="md:hidden">
            {/* Product Image */}
            <div className="relative bg-white pt-4 px-4">
              <div className="absolute top-6 left-6 z-10">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {product.badge}
                </span>
              </div>
              <div className="relative h-64 w-full flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-contain h-full w-auto"
                  priority
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => {
                    const rating = product.rating || 0;
                    return (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs text-gray-500">
                  ({product.reviews || 0} reviews)
                </span>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
              
              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{product.price?.toFixed(2) || '0.00'}
                  </div>
                  {product.originalPrice && product.originalPrice > (product.price || 0) && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                        {Math.round((((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100))}% OFF
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>

              <div className="flex flex-col gap-3 mt-6">
                <button className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-300">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-4 rounded-lg font-medium transition-colors duration-300">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal Layout */}
          <div className="hidden md:flex">
            {/* Left Section - Product Image */}
            <div className="w-1/2 relative bg-white flex items-center justify-center p-6">
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                  {product.badge}
                </span>
              </div>
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="object-contain h-[90%] w-auto max-w-[95%] group-hover:scale-105 transition-transform duration-500"
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </div>

            {/* Right Section - Product Details */}
            <div className="w-1/2 p-6 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => {
                      const rating = product.rating || 0;
                      return (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {product.name}
                </h2>
                
                <p className="text-gray-600 mb-6 text-justify">
                  {product.description || 'No description available.'}
                </p>

                <div className="mb-8">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-3xl font-bold text-green-700">
                      ₹{product.price?.toFixed(2) || '0.00'}
                    </span>
                    {product.originalPrice && (
                      <>
                        <span className="text-lg text-gray-400 line-through">
                          ₹{product.originalPrice.toFixed(2)}
                        </span>
                        {product.price && product.originalPrice > product.price && (
                          <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            {Math.round((((product.originalPrice - product.price) / product.originalPrice) * 100))}% OFF
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">Inclusive of all taxes</p>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-300">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </button>
                  <button className="flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-6 rounded-lg font-medium transition-colors duration-300">
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>100% Natural</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Zero Calories</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Keto Friendly</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Diabetic Safe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}