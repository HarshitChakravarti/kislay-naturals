'use client';

import dynamic from 'next/dynamic';
import { Product, Feature, FeaturesBannerProps } from '@/types';
import WhatsAppButton from '@/components/WhatsAppButton';

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
      description: "Plant Based",
      icon: 'Leaf',
    },
    {
      title: "ZERO CALORIES",
      description: "100% Healthy",
      icon: 'Zap',
    },
    {
      title: "TASTY",
      description: "Tastes Like Sugar",
      icon: 'Smile',
    },
    {
      title: "NO SIDE EFFECTS",
      description: "Scientifically Backed",
      icon: 'CheckCircle',
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
      <FeaturedProducts products={products} />
      <FeaturesBanner features={features} />
      <Recipes />
      <Testimonials />
      <BlogPreview />
      <WhatsAppButton />
    </main>
  );
}
