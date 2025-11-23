'use client';

import { Product, Feature, FeaturesBannerProps } from '@/types';
import WhatsAppButton from '@/components/WhatsAppButton';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import BlogPreview from '@/components/BlogPreview';
import FeaturesBanner from '@/components/FeaturesBanner';
import Recipes from '@/components/Recipes';
import SectionDivider from '@/components/SectionDivider';

interface HomeClientProps {
  products: Product[];
  blogPosts?: any[];
}

export default function HomeClient({ products, blogPosts = [] }: HomeClientProps) {
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
      <BlogPreview blogPosts={blogPosts} />
      <WhatsAppButton />
    </main>
  );
}
