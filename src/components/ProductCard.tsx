'use client';

import Image from "next/image"
import { ShoppingCart, Star, ArrowRight } from "lucide-react"
import { Product } from "@/types"
import Link from "next/link"
import { useState, useEffect } from 'react'

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0
  });


  // Fetch reviews for the product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews?productId=${product.id}&limit=100`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const reviews: Review[] = data.data;
          const totalReviews = reviews.length;
          const sumRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
          
          setReviewStats({
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews
          });
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (product.id) {
      fetchReviews();
    }
  }, [product.id]);

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden group w-full">
      {/* Mobile & Tablet: Vertical Layout */}
      <div className="md:hidden">
        {/* Product Image */}
        <div className="relative bg-white pt-2 sm:pt-3 px-3 sm:px-4">
          <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10">
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-green-800">
                {product.badge}
              </span>
            )}
          </div>
          <div className="relative h-48 sm:h-64 md:h-80 w-full flex items-center justify-center">
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
        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const averageRating = reviewStats.averageRating || 0;
                return (
                  <Star
                    key={i}
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${
                      i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
          
          <div className="mb-3">
            <div className="flex items-baseline gap-2 sm:gap-3">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                ₹{product.price?.toFixed(2) || '0.00'}
              </div>
              {product.originalPrice && product.originalPrice > (product.price || 0) && (
                <>
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-1.5 sm:px-2 py-0.5 rounded">
                    {Math.round((((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100))}% OFF
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes • Free shipping across India</p>
          </div>

          <div className="flex flex-col gap-2 mt-3 sm:mt-4">
            <Link 
              href={`/products/${product.id}`}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 border-2 border-green-600 text-white py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-all duration-300 text-center text-sm sm:text-base"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              Buy Now
            </Link>
            <Link 
              href={`/products/${product.id}`}
              className="w-full flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg font-medium transition-colors duration-300 text-sm sm:text-base"
            >
              View Details
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: Horizontal Layout */}
      <div className="hidden md:flex">
        {/* Left Section - Product Image */}
        <div className="w-1/2 relative bg-white flex items-center justify-center p-5">
          <div className="absolute top-4 left-4 z-10">
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                {product.badge}
              </span>
            )}
          </div>
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.name}
              width={520}
              height={520}
              className="object-contain h-[80%] w-auto max-w-[90%] group-hover:scale-105 transition-transform duration-500"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        {/* Right Section - Product Details */}
        <div className="w-1/2 p-5 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const averageRating = reviewStats.averageRating || 0;
                  return (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            
            <p className="text-gray-600 mb-5 text-justify text-sm">
              {product.description || 'No description available.'}
            </p>

            <div className="mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-2xl font-bold text-green-700">
                  ₹{product.price?.toFixed(2) || '0.00'}
                </span>
                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                  <>
                    <span className="text-base text-gray-400 line-through">
                      ₹{product.originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                      {Math.round((((product.originalPrice - (product.price || 0)) / product.originalPrice) * 100))}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes • Free shipping across India</p>
            </div>

            <div className="flex gap-3">
              <Link 
                href={`/products/${product.id}`}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 border-2 border-green-600 text-white py-2.5 px-5 rounded-lg font-medium transition-all duration-300"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Now
              </Link>
              <Link 
                href={`/products/${product.id}`}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-green-600 text-green-600 hover:bg-green-50 py-2.5 px-5 rounded-lg font-medium transition-colors duration-300"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌿</span>
                  <span>100% Natural</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">🔥</span>
                  <span>Zero Calories</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">💚</span>
                  <span>Keto Friendly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base">✨</span>
                  <span>Diabetic Safe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
