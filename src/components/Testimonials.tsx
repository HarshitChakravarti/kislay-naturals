import React from "react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Priya S.",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    review: "Kislay Naturals' monk fruit sweetener is a game changer! No aftertaste and so healthy.",
  },
  {
    id: 2,
    name: "Rahul M.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    review: "I love using it in my tea and baking. The best natural sweetener I've tried!",
  },
  {
    id: 3,
    name: "Anjali T.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    review: "Great taste, great price, and I feel good about what I'm eating.",
  },
];

const Testimonials = () => (
  <section className="w-full py-16 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-700 mb-4">WHAT OUR CUSTOMERS SAY {'\u{1F607}'} </h2>
        <div className="w-20 h-1 bg-green-400 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="group bg-white rounded-xl p-8 flex flex-col items-center text-center transition-all duration-300 
                       hover:shadow-2xl hover:shadow-green-100 hover:-translate-y-2 border border-green-50
                       hover:border-green-100 relative overflow-hidden"
          >
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="relative w-20 h-20 mb-6 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-green-50 rounded-full transform rotate-6 scale-110 group-hover:rotate-0 group-hover:scale-100 transition-all duration-500"></div>
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={80}
                  height={80}
                  className="relative z-10 w-full h-full rounded-full object-cover border-2 border-white shadow-sm"
                />
              </div>
              
              <div className="relative">
                <div className="before:content-['\201C'] before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:-top-4 before:text-6xl before:text-green-100 before:opacity-50 before:font-serif before:leading-none" />
                <div className="after:content-['\201D'] after:absolute after:bottom-0 after:right-1/2 after:translate-x-1/2 after:-bottom-4 after:text-6xl after:text-green-100 after:opacity-50 after:font-serif after:leading-none" />
                <p className="text-green-800 mb-6 text-lg leading-relaxed">"{t.review}"</p>
              </div>
              
              <div className="w-16 h-1 bg-green-200 mx-auto my-4 rounded-full group-hover:bg-green-400 transition-colors duration-300"></div>
              <span className="font-semibold text-green-700 text-lg">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 