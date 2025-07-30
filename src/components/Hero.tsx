"use client";
import React, { useEffect, useRef, useState } from "react";

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const quotes = [
    "What you eat today builds your tomorrow - choose sweet, not sugar.",
    "Nature's sweetness, without the guilt - pure monk fruit magic.",
    "Sweeten your life the natural way - 300x sweeter than sugar.",
    "From farm to table - the purest monk fruit sweetener on Earth."
  ];

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
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full aspect-[2.15/1] min-h-[500px] max-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        {/* Desktop Image - hidden on mobile */}
        <img
          src="/cover333.jpg"
          alt="Monk Fruit Sweeteners"
          className="hidden md:block w-full h-full object-cover object-center"
          style={{ 
            filter: 'brightness(0.9) contrast(1.1)',
            objectPosition: 'center center'
          }}
        />
        {/* Mobile Image - shown only on mobile */}
        <img
          src="/mobile-cover.jpg" // Replace with your mobile image path
          alt="Monk Fruit Sweeteners"
          className="md:hidden w-full h-full object-cover object-center"
          style={{ 
            filter: 'brightness(0.9) contrast(1.1)',
            objectPosition: 'center center'
          }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-800/30 to-green-900/50 z-10" />
      <div
        ref={ref}
        className={`relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="min-h-[180px] sm:min-h-[200px] lg:min-h-[240px] flex items-center">
          <h1 
            className={`text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} 
            style={{ fontFamily: 'var(--font-playfair), serif' }}
            aria-live="polite"
          >
            {quotes[currentQuote]}
          </h1>
        </div>
        <p className="text-base sm:text-lg lg:text-xl text-green-50 mb-8 font-sans max-w-3xl drop-shadow-md leading-relaxed" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
        Our monk fruit sweeteners are 100% natural, zero-calorie, and 300x sweeter than sugar — without the crash, guilt, or chemicals.
        </p>
        <a 
          href="#products" 
          className="inline-block bg-gradient-to-r from-green-600 to-green-400 text-white font-semibold rounded-lg shadow-xl px-10 py-4 text-lg hover:from-green-700 hover:to-green-500 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-400/50 transform hover:shadow-2xl"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default Hero; 