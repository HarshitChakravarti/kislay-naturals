'use client';

import { Gift, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function DiwaliBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Only update if scroll difference is significant
          if (Math.abs(currentScrollY - lastScrollY) > 10) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              // Scrolling down - hide banner
              setIsVisible(false);
            } else if (currentScrollY < lastScrollY && currentScrollY < 50) {
              // Scrolling up and near top - show banner
              setIsVisible(true);
            }
            
            setLastScrollY(currentScrollY);
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.15, ease: "easeInOut" }}
          className="relative bg-gradient-to-r from-green-50 via-green-100 to-emerald-50 border-b border-green-200/50 z-50 sticky top-0"
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            {/* Mobile Layout */}
            <div className="block sm:hidden py-2">
              <div className="flex items-center justify-center space-x-2">
                <Gift className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="text-green-800 font-semibold text-xs">
                  Diwali Special Offer
                </span>
                <div className="w-px h-3 bg-green-300"></div>
                <Percent className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span className="text-green-700 text-xs font-medium">
                  Extra ₹30 OFF
                </span>
                <div className="bg-green-600 text-white rounded px-1.5 py-0.5">
                  <span className="font-bold text-xs">DIWALI025</span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:block">
              <div className="flex items-center justify-center py-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <Gift className="h-4 w-4 text-green-600" />
                    <span className="text-green-800 font-semibold text-sm sm:text-base">
                      Diwali Special Offer
                    </span>
                  </div>
                  
                  <div className="hidden sm:block w-px h-4 bg-green-300"></div>
                  
                  <div className="flex items-center space-x-2">
                    <Percent className="h-4 w-4 text-green-600" />
                    <span className="text-green-700 text-sm font-medium">
                      Extra ₹30 OFF with code
                    </span>
                    <div className="bg-green-600 text-white rounded-md px-2 py-1">
                      <span className="font-bold text-sm">DIWALI025</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
