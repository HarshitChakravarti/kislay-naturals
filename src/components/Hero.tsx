"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const banners = [
    {
      headline: "The sweetener that's 300x sweeter — with zero sugar, zero guilt.",
      subheadline: "For diabetics, keto eaters & health-first families.",
      proof: "Kislay Monk Fruit Sweetener Drops. 100% natural, zero-calorie monk fruit sweetness.",
      desktopImage: "/desktop hero/herophoto.png",
      mobileImage: "/desktop hero/herophoto.png",
      alt: "Kislay Monk Fruit Sweetener Drops"
    },
    {
      headline: "Tired of products that promise results but don't deliver? Meet Kislay Naturals.",
      subheadline: "Say no to sugar without giving up sweetness.",
      proof: "Plant-based monk fruit drops for tea, coffee, desserts and daily sugar swaps.",
      desktopImage: "/desktop hero/mcover.png",
      mobileImage: "/desktop hero/mcover.png",
      alt: "Kislay Naturals monk fruit sweetener in everyday drinks"
    },
    {
      headline: "Sweeten your tea, coffee and desserts without the sugar crash.",
      subheadline: "Made for everyday Indian homes choosing better sweetness.",
      proof: "Zero sugar. Zero calories. No artificial sweeteners.",
      desktopImage: "/desktop hero/herophoto2.png",
      mobileImage: "/desktop hero/herophoto2.png",
      alt: "Sugar-free recipes made with monk fruit sweetener"
    },
    {
      headline: "One tiny drop. Big natural sweetness.",
      subheadline: "For parents, fitness routines and anyone cutting refined sugar.",
      proof: "Monk fruit is naturally up to 300x sweeter than sugar, so a little goes a long way.",
      desktopImage: "/desktop hero/cover333.jpg",
      mobileImage: "/about us/mcover2.png",
      alt: "Kislay Naturals monk fruit sweetener for healthy families"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {/* Desktop Image - hidden on mobile */}
        <div className="hidden md:block w-full h-full relative">
          {banners.map((banner, index) => (
            <Image
              key={banner.desktopImage}
              src={banner.desktopImage}
              alt={banner.alt}
              fill
              priority={index === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                filter: 'brightness(0.9) contrast(1.1)',
                objectPosition: 'center center'
              }}
            />
          ))}
        </div>
        {/* Mobile Image - shown only on mobile */}
        <div className="md:hidden w-full h-full relative">
          {banners.map((banner, index) => (
            <Image
              key={banner.mobileImage}
              src={banner.mobileImage}
              alt={banner.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className={`object-cover object-center transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                filter: 'brightness(0.9) contrast(1.1)'
              }}
            />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-800/30 to-green-900/50 z-10" />
      <div
        ref={ref}
        className={`relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="min-h-[180px] sm:min-h-[240px] lg:min-h-[220px] flex w-full max-w-[95vw] lg:max-w-7xl flex-col items-center justify-center">
          <h1 
            className={`font-heading font-semibold text-white mb-4 drop-shadow-2xl leading-tight transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} 
            style={{ 
              fontSize: 'clamp(42px, 8vw, 84px)'
            }}
            aria-live="polite"
          >
            {banners[currentBanner].headline}
          </h1>
          <p className={`max-w-[90vw] lg:max-w-5xl px-4 text-lg font-medium leading-relaxed text-green-50/90 drop-shadow-md transition-opacity duration-500 sm:text-xl md:text-2xl ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
            {banners[currentBanner].subheadline}
          </p>
        </div>
        <p className={`mb-10 max-w-[90vw] lg:max-w-6xl px-4 font-sans leading-relaxed text-green-50 drop-shadow-md transition-opacity duration-500 text-lg sm:text-xl md:text-2xl ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {banners[currentBanner].proof}
        </p>
        <Link 
          href="/products/kislay-monk-fruit-sweetener-drop" 
          className="inline-block bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-xl px-10 py-4 sm:px-12 sm:py-5 text-xl hover:from-green-700 hover:to-green-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 transform hover:shadow-2xl"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default Hero; 
