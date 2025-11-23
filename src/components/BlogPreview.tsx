import React, { useState, useRef, useMemo } from "react";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  link: string;
  readTime?: string;
}

interface BlogPreviewProps {
  blogPosts?: any[];
}

const BlogPreview = ({ blogPosts = [] }: BlogPreviewProps) => {
  // Transform database blog posts to component format
  const posts: BlogPost[] = useMemo(() => {
    if (blogPosts && blogPosts.length > 0) {
      const transformed = blogPosts
        .filter(post => post && post.slug && post.title) // Filter out invalid posts
        .map((post, index) => ({
          id: post.id || index,
          title: post.title || '',
          excerpt: post.excerpt || '',
          image: post.image || '/cover.jpg',
          category: post.category || 'Health & Wellness',
          date: post.published_at 
            ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          link: `/blog/${post.slug || ''}`,
          readTime: post.read_time || '5 min read',
        }));
      
      // Debug logging
      if (typeof window !== 'undefined') {
        console.log('BlogPreview: Received', blogPosts.length, 'posts, transformed to', transformed.length, 'posts');
      }
      
      return transformed;
    }
    // Fallback to empty array if no blog posts
    return [];
  }, [blogPosts]);
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
      const scrollAmount = window.innerWidth < 640 ? -280 : -320; // Smaller scroll for mobile
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      const scrollAmount = window.innerWidth < 640 ? 280 : 320; // Smaller scroll for mobile
      scrollContainer.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getCurrentPosts = () => {
    const startIndex = currentIndex * postsPerPage;
    const currentPosts = posts.slice(startIndex, startIndex + postsPerPage);
    // Debug: Log when posts change
    if (typeof window !== 'undefined' && currentIndex === 0) {
      console.log(`BlogPreview: Showing ${currentPosts.length} posts on page ${currentIndex + 1} of ${totalPages} (Total: ${posts.length} posts)`);
    }
    return currentPosts;
  };

  return (
  <section className="w-full bg-white">
    <div className="relative bg-green-700 text-white w-full overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                NOURISH YOUR KNOWLEDGE WITH US
              </span>
              {' \u{1F60A}'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
              Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
              individuals
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="relative hidden lg:block">
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={posts.length <= postsPerPage}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 bg-white hover:bg-gray-50 border-2 border-green-600 text-green-600 hover:text-green-700 rounded-full p-3 shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={posts.length <= postsPerPage}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-3 gap-7 transition-all duration-300 px-8">
          {getCurrentPosts().map((post) => (
            <article 
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="relative h-44 w-full bg-gray-100">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3">
                  <span className="inline-block px-2.5 py-0.5 text-[11px] font-medium text-white bg-green-600 rounded-full mb-2">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5">
                <div className="flex items-center text-xs sm:text-xs text-gray-500 mb-2 sm:mb-2.5">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>
                
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-2.5 leading-tight group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
                
                <p className="text-sm sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <a
                  href={post.link}
                  className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors text-sm sm:text-sm"
                >
                  Read Full Article
                  <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-1" />
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
          className="flex space-x-4 sm:space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {posts.map((post) => (
            <article 
              key={post.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex-shrink-0 w-64 sm:w-72 md:w-80 snap-center"
            >
              <div className="relative h-32 sm:h-36 md:h-44 w-full bg-gray-100">
                <Image 
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 256px, (max-width: 768px) 288px, 320px"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 sm:p-3.5">
                  <span className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-0.5 text-[11px] font-medium text-white bg-green-600 rounded-full mb-1 sm:mb-2">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-3 sm:p-4 md:p-5">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime || '5 min read'}</span>
                </div>
                
                <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-xs sm:text-sm md:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                  {post.excerpt}
                </p>
                
                <a
                  href={post.link}
                  className="inline-flex items-center text-green-600 font-medium group-hover:text-green-700 transition-colors text-xs sm:text-sm md:text-sm"
                >
                  Read Full Article
                  <ArrowRight className="ml-1 sm:ml-2 w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform group-hover:translate-x-1" />
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
