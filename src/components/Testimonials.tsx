import React from "react";
import Image from "next/image";
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

const testimonials = [
  {
    id: 1,
    name: "Tanishka",
    avatar: "https://randomuser.me/api/portraits/women/45.jpg",
    review: "It's very nice alternative to sugar",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Harshit",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    review: "Tried your sugar replacement and I'm genuinely impressed! It tastes amazing - couldn't even tell there's no sugar in it. Highly recommended!",
    rating: 4,
  },
  {
    id: 3,
    name: "Sanju",
    avatar: "https://randomuser.me/api/portraits/men/30.jpg",
    review: "I've been using Kislay's sugar-free product for a few months now, and I honestly couldn't be more impressed. As someone managing diabetes, finding a product that satisfies my sweet cravings without compromising my health has always been a challenge — until I discovered Kislay. Not only is it completely sugar-free, but it also tastes amazing! Highly recommended.",
    rating: 5,
  },
];

const Testimonials = () => (
  <section className="w-full bg-white">
    {/* Header with green background and gradient shadow */}
    <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
      {/* Gradient shadow at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
      
      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h2 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                WHAT OUR CUSTOMERS SAY
              </span>
              {' \u{1F607}'}
            </h2>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
              Discover our premium collection of natural monk fruit sweeteners, carefully crafted for health-conscious
              individuals
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
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
                <p className="text-green-800 mb-6 text-lg leading-relaxed">&quot;{t.review}&quot;</p>
              </div>
              
              <div className="w-16 h-1 bg-green-200 mx-auto my-4 rounded-full group-hover:bg-green-400 transition-colors duration-300"></div>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => {
                  const isHalfStar = i + 0.5 === t.rating;
                  const isFilled = i < Math.floor(t.rating) || isHalfStar;
                  
                  return (
                    <div key={i} className="relative">
                      <svg
                        className={`w-5 h-5 ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {isHalfStar && (
                        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                          <svg
                            className="w-5 h-5 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <span className="font-semibold text-green-700 text-lg">{t.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials; 