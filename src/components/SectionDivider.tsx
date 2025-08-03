import React from 'react';
import { Leaf } from 'lucide-react';

const SectionDivider = () => {
  return (
    <div className="relative w-full py-8 sm:py-10 md:py-12 overflow-hidden bg-gray-100">
      {/* Decorative leaf pattern */}
      <div className="flex items-center justify-center overflow-hidden px-4">
        <div className="flex justify-center whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <Leaf 
              key={i} 
              className="inline-block w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-700 transform rotate-12 mx-4 sm:mx-6 md:mx-8 lg:mx-10"
              strokeWidth={1.5}
              fill="currentColor"
            />
          ))}
        </div>
      </div>
      
      {/* Subtle bottom shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white via-white/90 to-transparent"></div>
    </div>
  );
};

export default SectionDivider;
