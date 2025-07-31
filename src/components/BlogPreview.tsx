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
  <section className="w-full py-16 lg:py-20 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-50 rounded-full mb-3">
          Latest Articles
        </span>
        <h2 className="text-3xl font-bold text-gray-700 mb-4">
          NOURISH YOUR KNOWLEDGE WITH US 😊
        </h2>
        <div className="w-20 h-1 bg-green-400 mx-auto rounded-full"></div>
      </div>
      
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