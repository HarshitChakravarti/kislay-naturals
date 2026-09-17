"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * PRE-LAUNCH TEMPORARY: This banner promotes the Seabuckthorn Pulp pre-order.
 * Remove when the product is officially launched as a standalone product.
 */
export default function PrebookBanner() {
  return (
    <Link
      href="/prebook"
      className="block w-full overflow-hidden relative group cursor-pointer shadow-md"
    >
      {/* Gradient background — vibrant amber/orange blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-500" />
      
      {/* Animated shimmer overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:200%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />

      <div className="relative z-10 px-4 py-3.5 sm:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-5">
          
          <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap">
            <span className="bg-white text-orange-600 text-[10px] sm:text-sm font-extrabold px-2 py-0.5 rounded shadow-sm tracking-wider uppercase whitespace-nowrap">
              🍊 Pre-Launch Offer
            </span>
            <span className="text-white font-heading font-semibold text-sm sm:text-lg whitespace-nowrap drop-shadow-sm">
              Seabuckthorn Bundle
            </span>
            <span className="text-amber-100 font-bold text-sm sm:text-lg hidden md:inline-block drop-shadow-sm">
              ₹1,598 worth for just ₹649
            </span>
          </div>

          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <span className="text-amber-100 font-bold text-sm md:hidden drop-shadow-sm">
              Only ₹649
            </span>
            <span className="text-white font-medium text-xs sm:text-base hidden lg:inline-flex items-center whitespace-nowrap drop-shadow-sm">
              + Free Monk Fruit Drops
            </span>
            
            {/* CTA pill */}
            <span className="shrink-0 inline-flex items-center gap-1.5 bg-white text-orange-600 text-xs sm:text-sm font-bold px-4 py-1 sm:px-5 sm:py-1.5 rounded-full shadow-md transition-all duration-300 group-hover:bg-orange-50 group-hover:scale-105 whitespace-nowrap">
              Shop Now
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
          
        </div>
      </div>
    </Link>
  );
}
