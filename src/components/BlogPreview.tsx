import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

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
];

const BlogPreview = () => (
  <section className="w-full bg-white">
    {/* Header with green background and gradient shadow */}
    <div className="relative bg-green-700 text-white w-full overflow-hidden">
      {/* Gradient shadow at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <article 
            key={post.id}
            className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <div className="relative h-48 w-full bg-gray-100">
              <Image 
                src={post.image}
                alt={post.title}
                fill
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

export default BlogPreview; 