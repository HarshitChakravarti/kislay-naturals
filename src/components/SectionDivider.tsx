import React from 'react';
import { Leaf, Zap, Smile, Heart, CheckCircle } from 'lucide-react';

const benefits = [
  { text: "100% Natural", icon: Leaf },
  { text: "Zero Calories", icon: Zap },
  { text: "Tastes Like Sugar", icon: Smile },
  { text: "Zero Glycemic Impact", icon: Heart },
  { text: "Keto Friendly", icon: CheckCircle },
  { text: "No Bitter Aftertaste", icon: Leaf },
];

const SectionDivider = () => {
  // We duplicate the array enough times to create a long track that can be seamlessly animated
  const marqueeItems = [...benefits, ...benefits, ...benefits, ...benefits];

  return (
    <div className="relative w-full overflow-hidden bg-yellow-400 py-2.5 shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] border-y border-yellow-500 z-20">
      <div className="flex w-max animate-marquee items-center gap-8 px-4 sm:gap-12">
        {marqueeItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-2.5 text-green-950 font-bold text-xs sm:text-sm uppercase tracking-widest whitespace-nowrap"
            >
              <Icon className="h-4 w-4 text-green-800 shrink-0" />
              <span>{item.text}</span>
              <span className="ml-8 text-green-900/30 sm:ml-12 text-lg">•</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionDivider;
