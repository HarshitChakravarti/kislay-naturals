'use client';

import { 
  Leaf, 
  Award, 
  ShoppingBag, 
  Shield, 
  Users 
} from 'lucide-react';
import { ReactNode } from 'react';
export type IconName = 'Leaf' | 'Award' | 'ShoppingBag' | 'Shield' | 'Users';

export interface Feature {
  title: string;
  description: string;
  icon: IconName;
}

export interface FeaturesBannerProps {
  features: Feature[];
}

const iconComponents: Record<IconName, ReactNode> = {
  'Leaf': <Leaf className="w-12 h-12 text-green-600" />,
  'Award': <Award className="w-12 h-12 text-green-600" />,
  'ShoppingBag': <ShoppingBag className="w-12 h-12 text-green-600" />,
  'Shield': <Shield className="w-12 h-12 text-green-600" />,
  'Users': <Users className="w-12 h-12 text-green-600" />
};

const mobileIconComponents: Record<IconName, ReactNode> = {
  'Leaf': <Leaf className="w-8 h-8 text-green-600" />,
  'Award': <Award className="w-8 h-8 text-green-600" />,
  'ShoppingBag': <ShoppingBag className="w-8 h-8 text-green-600" />,
  'Shield': <Shield className="w-8 h-8 text-green-600" />,
  'Users': <Users className="w-8 h-8 text-green-600" />
};

export default function FeaturesBanner({ features }: FeaturesBannerProps) {
  return (
    <div className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: 2x2 Grid Layout with centered last item */}
        <div className="md:hidden">
          {/* First 4 features in 2x2 grid */}
          <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-6">
            {features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-3">
                  {mobileIconComponents[feature.icon] || null}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
          
          {/* 5th feature centered if exists */}
          {features.length > 4 && (
            <div className="flex justify-center">
              <div className="flex flex-col items-center text-center w-32">
                <div className="mb-3">
                  {mobileIconComponents[features[4].icon] || null}
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-2 tracking-wide leading-tight">
                  {features[4].title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {features[4].description}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex flex-wrap justify-center items-start gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center min-w-[200px] flex-1">
              <div className="mb-4">
                {iconComponents[feature.icon] || null}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 tracking-wide">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
  