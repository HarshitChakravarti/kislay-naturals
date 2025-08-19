import React, { useState, useRef } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

const posts = [
  {
    id: 1,
    title: "5 Surprising Benefits of Monk Fruit",
    excerpt: "Discover why monk fruit is the healthiest sugar alternative for your daily routine.",
    image: "/cover2.jpg", 
    category: "Health & Wellness",
    date: "July 28, 2025",
    link: "#",
  },
  {
    id: 2,
    title: "Diabetes - The Silent Killer",
    excerpt: "How monk fruit sweetener can help manage blood sugar levels and support a healthy lifestyle.",
    image: "/diabetes.jpg", 
    category: "Nutrition",
    date: "July 25, 2025",
    link: "#",
  },
  {
    id: 3,
    title: "The Truth About Sugar Addiction",
    excerpt: "Understanding how sugar affects your brain and why monk fruit is the perfect alternative to break free.",
    image: "/cover3.jpg", 
    category: "Health & Wellness",
    date: "July 22, 2025",
    link: "#",
  },
  {
    id: 4,
    title: "Monk Fruit vs Artificial Sweeteners",
    excerpt: "A comprehensive comparison of natural monk fruit sweetener against synthetic alternatives.",
    image: "/cover4.jpg", 
    category: "Nutrition",
    date: "July 20, 2025",
    link: "#",
  },
  {
    id: 5,
    title: "Managing Blood Sugar Naturally",
    excerpt: "Learn how to maintain healthy glucose levels with natural sweeteners and lifestyle changes.",
    image: "/herophoto.png", 
    category: "Health & Wellness",
    date: "July 18, 2025",
    link: "#",
  },
  {
    id: 6,
    title: "The Hidden Dangers of Refined Sugar",
    excerpt: "Explore the long-term health effects of processed sugar and discover healthier alternatives.",
    image: "/herophoto2.png", 
    category: "Nutrition",
    date: "July 15, 2025",
    link: "#",
  },
  {
    id: 7,
    title: "Keto-Friendly Sweetening Solutions",
    excerpt: "How monk fruit sweetener perfectly fits into your ketogenic lifestyle without breaking ketosis.",
    image: "/mcover.png", 
    category: "Health & Wellness",
    date: "July 12, 2025",
    link: "#",
  },
];

const BlogPreview = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const postsPerPage = 3; // Show 3 posts at a time on desktop
  const totalPages = Math.ceil(posts.length / postsPerPage);
  const scrollContainer = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex >= totalPages - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex <= 0 ? totalPages - 1 : prevIndex - 1
    );
  };

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -320, // Card width + gap
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 320, // Card width + gap
        behavior: 'smooth'
      });
    }
  };

  const getCurrentPosts = () => {
    const startIndex = currentIndex * postsPerPage;
    return posts.slice(startIndex, startIndex + postsPerPage);
  };

  return (
  <section className="w-full bg-white">
    {/* Header with green background and gradient shadow */}
    <div className="relative bg-green-700 text-white w-full overflow-hidden">
      {/* Gradient shadow at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                NOURISH YOUR KNOWLEDGE WITH US
              </span>
              {' \u{1F60A}'}
            </h2>
            <p className="text-lg font-medium text-white/90 max-w-2xl mx-auto">
              Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
              individuals
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Desktop Carousel Container (3 blogs with pagination) */}
      <div className="relative hidden lg:block">
        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={posts.length <= postsPerPage}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={posts.length <= postsPerPage}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Blog Posts Grid for Desktop */}
        <div className="grid grid-cols-3 gap-8 transition-all duration-300">
          {getCurrentPosts().map((post) => (
            <article 
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full mb-2">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-5 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <a
                  href={post.link}
                  className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors"
                >
                  Read Full Article
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination Dots for Desktop */}
        {posts.length > postsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-green-600 scale-110'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile & Tablet Horizontal Scroll Carousel */}
      <div className="relative lg:hidden">
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors"
          aria-label="Previous blog"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700" />
        </button>
        
        <div 
          ref={scrollContainer}
          className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post) => (
            <article 
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex-shrink-0 w-80 snap-center"
            >
              <div className="relative h-48 w-full bg-gray-100">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-green-600 rounded-full mb-2">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>5 min read</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-5 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <a
                  href={post.link}
                  className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors"
                >
                  Read Full Article
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </article>
          ))}
        </div>
        
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors"
          aria-label="Next blog"
        >
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
      </div>
      
      <div className="text-center mt-12">
        <a
          href="/blog"
          className="inline-flex items-center justify-center px-8 py-3 border-2 border-green-600 text-green-600 font-semibold rounded-none hover:bg-green-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 bg-transparent">
          View All Articles
        </a>
      </div>
    </div>
  </section>
);
};

export default BlogPreview;
