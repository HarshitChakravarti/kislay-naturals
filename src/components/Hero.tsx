"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentMobileImage, setCurrentMobileImage] = useState(0);
  const [currentDesktopImage, setCurrentDesktopImage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const quotes = [
    "What you eat today builds your tomorrow - choose sweet, not sugar.",
    "Nature's sweetness, without the guilt - pure monk fruit magic.",
    "Sweeten your life the natural way - 300x sweeter than sugar.",
    "From farm to table - the purest monk fruit sweetener on Earth."
  ];

  const mobileImages = ['/herophoto.png',  '/mcover.png','/herophoto2.png', '/mcover2.png'];
  const desktopImages = ['/herophoto.png', '/mcover.png', '/herophoto2.png', '/cover333.jpg'];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setIsAnimating(false);
      }, 500); // Half of the transition time
    }, 3000); // Change quote every 5 seconds

    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    const mobileImageInterval = setInterval(() => {
      setCurrentMobileImage(prev => (prev + 1) % mobileImages.length);
    }, 3000);

    const desktopImageInterval = setInterval(() => {
      setCurrentDesktopImage(prev => (prev + 1) % desktopImages.length);
    }, 3000);

    return () => {
      clearInterval(mobileImageInterval);
      clearInterval(desktopImageInterval);
    };
  }, [mobileImages.length, desktopImages.length]);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full md:aspect-[2.15/1] aspect-[9/16] min-h-[80vh] md:min-h-[500px] max-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {/* Desktop Image - hidden on mobile */}
        <div className="hidden md:block w-full h-full relative">
          {desktopImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Monk Fruit Sweeteners"
              fill
              priority={index === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${index === currentDesktopImage ? 'opacity-100' : 'opacity-0'}`}
              style={{ 
                filter: 'brightness(0.9) contrast(1.1)',
                objectPosition: 'center center'
              }}
            />
          ))}
        </div>
        {/* Mobile Image - shown only on mobile */}
        <div className="md:hidden w-full h-full relative">
          {mobileImages.map((src, index) => (
            <Image
              key={src}
              src={src}
              alt="Monk Fruit Sweeteners"
              fill
              priority={index === 0}
              sizes="100vw"
              quality={90}
              className={`object-cover object-center transition-opacity duration-1000 ${index === currentMobileImage ? 'opacity-100' : 'opacity-0'}`}
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
        <div className="min-h-[180px] sm:min-h-[200px] lg:min-h-[240px] flex items-center">
          <h1 
            className={`text-6xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} 
            style={{ fontFamily: 'var(--font-dancing-script), cursive' }}
            aria-live="polite"
          >
            {quotes[currentQuote]}
          </h1>
        </div>
        <p className="text-xl sm:text-xl md:text-2xl text-green-50 mb-8 font-sans max-w-3xl drop-shadow-md leading-relaxed px-4" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        Our monk fruit sweeteners are 100% natural, zero-calorie, and 300x sweeter than sugar — without the crash, guilt, or chemicals.
        </p>
        <Link 
          href="/products/1" 
          className="inline-block bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-xl px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg hover:from-green-700 hover:to-green-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 transform hover:shadow-2xl"
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
};

export default Hero; 