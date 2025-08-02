import React from 'react';
import { Leaf } from 'lucide-react';

const SectionDivider = () => {
  return (
    <div className="relative w-full py-10 sm:py-14 md:py-16 lg:py-20 overflow-hidden bg-gray-100">
      {/* Decorative leaf pattern */}
      <div className="flex items-center justify-center overflow-hidden px-2">
        <div className="flex justify-center whitespace-nowrap -rotate-6">
          {[...Array(6)].map((_, i) => (
            <Leaf 
              key={i} 
              className="inline-block w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 text-green-700 transform rotate-12 mx-4 sm:mx-6 md:mx-8 lg:mx-10"
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
