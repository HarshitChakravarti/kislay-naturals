'use client';

import { Sparkles, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DiwaliBanner() {
  // Banner is now permanently visible - no dismissal option

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative bg-gradient-to-r from-green-600 via-green-500 to-emerald-500 overflow-hidden z-50 sticky top-0"
    >
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-400/30 to-emerald-400/30">
              <div className="absolute top-2 left-4 text-green-200 text-2xl animate-pulse">🪔</div>
              <div className="absolute top-1 right-8 text-green-200 text-xl animate-bounce">✨</div>
              <div className="absolute top-3 left-1/4 text-green-200 text-lg animate-pulse">🕯️</div>
              <div className="absolute top-1 right-1/4 text-green-200 text-xl animate-bounce">🎆</div>
            </div>
          </div>

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-3">
                {/* Left side - Main message */}
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-2xl"
                  >
                    🎉
                  </motion.div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-green-200 animate-pulse" />
                    <span className="text-white font-bold text-sm sm:text-base">
                      🪔 Diwali Special Offer! 🪔
                    </span>
                  </div>
                    
                    <div className="flex items-center space-x-2 text-green-100">
                      <Gift className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Extra ₹30 OFF with code
                      </span>
                      <div className="bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 border border-white/30">
                        <span className="text-white font-bold text-sm">DIWALI025</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right side - Empty for now */}
                <div className="flex items-center space-x-3">
                  {/* Price element removed */}
                </div>
              </div>

              {/* Mobile layout - Price removed */}
              <div className="sm:hidden pb-2">
                <div className="flex items-center justify-between">
                  {/* Price element removed from mobile */}
                </div>
              </div>
            </div>
          </div>

          {/* Animated sparkles */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-200 text-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </div>
    </motion.div>
  );
}
