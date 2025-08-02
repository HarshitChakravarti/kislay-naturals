import React from 'react';
import { Leaf } from 'lucide-react';

const SectionDivider = () => {
  return (
    <div className="relative w-full py-16 md:py-20 overflow-hidden bg-white">
      {/* Decorative leaf pattern */}
      <div className="flex items-center justify-center">
        <div className="flex space-x-10 md:space-x-20">
          {[...Array(6)].map((_, i) => (
            <Leaf 
              key={i} 
              className="w-12 h-12 text-green-700 transform rotate-12"
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
