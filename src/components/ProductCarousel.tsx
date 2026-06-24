"use client";

import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductCarouselProps {
  products: Product[];
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft) < scrollWidth - clientWidth - 1);

      const cardElement = scrollContainerRef.current.firstElementChild;
      if (cardElement) {
        const cardWidth = cardElement.clientWidth;
        const gap = 16; // gap-4 is 16px
        const newIndex = Math.round(scrollLeft / (cardWidth + gap));
        setActiveIndex(newIndex);
      } else {
        setActiveIndex(Math.round(scrollLeft / clientWidth));
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 300;
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstElementChild?.clientWidth || 300;
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* Mobile view: Carousel */}
      <div className="md:hidden relative w-full">
        <div 
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <div key={product.id} className="min-w-[100%] sm:min-w-[80%] snap-center flex-shrink-0">
              <ProductCard product={product} layout="grid" />
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        {products.length > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border shadow-sm transition-all flex items-center justify-center ${!canScrollLeft ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' : 'bg-white hover:bg-gray-50 border-green-200 active:bg-gray-100 text-green-700'}`}
              aria-label="Previous product"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-1.5">
              {products.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all ${activeIndex === idx ? 'w-6 bg-green-600' : 'w-2 bg-gray-300'}`}
                />
              ))}
            </div>
            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border shadow-sm transition-all flex items-center justify-center ${!canScrollRight ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200' : 'bg-white hover:bg-gray-50 border-green-200 active:bg-gray-100 text-green-700'}`}
              aria-label="Next product"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>

      {/* Desktop view: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} layout="grid" />
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
