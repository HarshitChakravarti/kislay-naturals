"use client";
import React, { useEffect, useRef, useState } from "react";

const Hero = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src="/cover.jpg"
        alt="Monk Fruit Sweeteners"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        style={{ 
          filter: 'brightness(0.9) contrast(1.1)',
          objectPosition: 'center 30%'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-green-800/30 to-green-900/50 z-10" />
      <div
        ref={ref}
        className={`relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-serif font-bold text-white mb-6 drop-shadow-2xl leading-tight" style={{ fontFamily: 'var(--font-playfair), serif' }}>
        What you eat today builds your tomorrow — choose sweet, not sugar.
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-green-50 mb-10 font-sans max-w-3xl drop-shadow-lg leading-relaxed" style={{ fontFamily: 'var(--font-poppins), sans-serif' }}>
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