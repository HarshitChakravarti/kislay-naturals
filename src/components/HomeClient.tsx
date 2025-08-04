'use client';

import dynamic from 'next/dynamic';
import { Feature } from './FeaturesBanner.types';
import { Product } from '@/types';

// Dynamically import client components
const Hero = dynamic(() => import('@/components/Hero'));
const FeaturedProducts = dynamic(() => import('@/components/FeaturedProducts'));
const BlogPreview = dynamic(() => import('@/components/BlogPreview'));
const Testimonials = dynamic(() => import('@/components/Testimonials'));
const FeaturesBanner = dynamic(() => import('@/components/FeaturesBanner'));
const Recipes = dynamic(() => import('@/components/Recipes'));
const SectionDivider = dynamic(() => import('@/components/SectionDivider'));

interface HomeClientProps {
  products: Product[];
}

export default function HomeClient({ products }: HomeClientProps) {
  const features: Feature[] = [
    {
      title: "100% NATURAL",
      description: "Plant based",
      icon: 'Leaf',
    },
    {
      title: "ZERO CALORIES",
      description: "100% Healthy",
      icon: 'Award',
    },
    {
      title: "TASTY",
      description: "No bitter aftertaste",
      icon: 'ShoppingBag',
    },
    {
      title: "NO SIDE EFFECTS",
      description: "Scientifically backed",
      icon: 'Shield',
    },
    {
      title: "FOR ALL AGE GROUP",
      description: "Universal Age Appeal",
      icon: 'Users',
    },
  ];

  return (
    <main className="min-h-screen">
      <Hero />
      <SectionDivider />
      {products.length > 0 && <FeaturedProducts products={products} />}
      <FeaturesBanner features={features} />
      <Recipes />
      <Testimonials />
      <BlogPreview />
    </main>
  );
}
