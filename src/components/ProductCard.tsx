'use client';

import Image from "next/image";
import { ShoppingCart, Star, ArrowRight, Heart } from "lucide-react";
import type { Product } from "@/types";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
  });

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
            totalReviews,
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

  const productHref = `/products/${product.id}`;

  return (
    <div
      className="group w-full md:mx-auto md:max-w-6xl cursor-pointer overflow-hidden rounded-xl bg-white shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600/40 focus-visible:ring-offset-2"
      role="link"
      tabIndex={0}
      onClick={() => router.push(productHref)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          router.push(productHref);
        }
      }}
    >
      {/* Mobile */}
      <div className="md:hidden">
        <div className="relative bg-white px-3 pt-2 sm:px-4 sm:pt-3">
          <div className="absolute left-3 top-2.5 z-10 sm:left-4 sm:top-3">
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 shadow-sm ring-1 ring-green-100 backdrop-blur">
                {product.badge}
              </span>
            )}
          </div>

          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-3 top-2.5 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:scale-105 hover:text-red-500 sm:right-4 sm:top-3"
          >
            <Heart className="h-4 w-4" />
          </button>

          <div className="relative flex h-56 w-full items-center justify-center sm:h-64">
            <Image
              src="/sweetener-drops/product1.png"
              alt={product.name}
              width={400}
              height={400}
              className="h-full w-auto object-contain transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
        </div>

        <div className="p-3 pt-2 sm:p-4">
          <div className="mb-1 flex items-center gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => {
                const averageRating = reviewStats.averageRating || 0;
                return (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                    }`}
                  />
                );
              })}
            </div>
            {reviewStats.totalReviews > 0 && (
              <span className="text-[11px] text-gray-500">
                {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews})
              </span>
            )}
          </div>

          <h2 className="text-base font-semibold leading-snug text-gray-900 sm:text-lg">{product.name}</h2>

          <div className="mt-2">
            <div className="flex items-baseline gap-2">
              <div className="text-2xl font-extrabold text-green-700 sm:text-3xl">
                ₹{product.price?.toFixed(2) || '0.00'}
              </div>
              {product.originalPrice && product.originalPrice > (product.price || 0) && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="mt-1 text-[11px] text-gray-500">Inclusive of all taxes • Free shipping across India</p>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <Link
              href={productHref}
              onClick={(event) => event.stopPropagation()}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white transition-all duration-300 hover:bg-green-700"
            >
              <ShoppingCart className="h-4 w-4" />
              Buy Now
            </Link>
            <Link
              href={productHref}
              onClick={(event) => event.stopPropagation()}
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-green-600/30 px-3 py-2 text-sm font-semibold text-green-700 transition-colors hover:bg-green-50"
            >
              Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex">
        <div className="relative flex w-5/12 items-center justify-center bg-white p-5">
          <div className="absolute left-4 top-4 z-10">
            {product.badge && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                {product.badge}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(event) => event.stopPropagation()}
            className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-sm ring-1 ring-gray-200 transition hover:scale-105 hover:text-red-500"
          >
            <Heart className="h-4 w-4" />
          </button>
          <div className="relative flex w-full items-center justify-center">
            <Image
              src="/sweetener-drops/product1.png"
              alt={product.name}
              width={520}
              height={520}
              className="h-auto w-auto max-w-[86%] object-contain transition-transform duration-500 group-hover:scale-105"
              priority
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>

        <div className="flex w-7/12 flex-col p-6">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => {
                  const averageRating = reviewStats.averageRating || 0;
                  return (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <h2 className="mb-3 text-2xl font-bold text-gray-900">{product.name}</h2>

            <p className="mb-7 text-sm leading-relaxed text-gray-600 lg:text-base">
              {product.description || 'No description available.'}
            </p>

            <div className="mb-6">
              <div className="mb-1 flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-green-700">
                  ₹{product.price?.toFixed(2) || '0.00'}
                </span>
                {product.originalPrice && product.originalPrice > (product.price || 0) && (
                  <span className="text-base text-gray-400 line-through">
                    ₹{product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes • Free shipping across India</p>
            </div>

            <div className="flex gap-3">
              <Link
                href={productHref}
                onClick={(event) => event.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-600 bg-green-600 px-5 py-3 text-base font-semibold text-white transition-all duration-300 hover:bg-green-700"
              >
                <ShoppingCart className="h-4 w-4" />
                Buy Now
              </Link>
              <Link
                href={productHref}
                onClick={(event) => event.stopPropagation()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-green-600 px-5 py-3 text-base font-semibold text-green-600 transition-colors duration-300 hover:bg-green-50"
              >
                View Details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
