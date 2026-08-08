'use client';

import { Product, Feature, FeaturesBannerProps } from '@/types';
import WhatsAppButton from '@/components/WhatsAppButton';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import BlogPreview from '@/components/BlogPreview';
import FeaturesBanner from '@/components/FeaturesBanner';
import VideoTestimonials from '@/components/VideoTestimonials';
import Recipes from '@/components/Recipes';
import SectionDivider from '@/components/SectionDivider';

interface HomeClientProps {
  products: Product[];
  blogPosts?: any[];
}

export default function HomeClient({ products, blogPosts = [] }: HomeClientProps) {
  const features: Feature[] = [
    {
      title: "NATURAL",
      description: "",
      icon: 'Leaf',
    },
    {
      title: "ZERO CALORIES",
      description: "",
      icon: 'Zap',
    },
    {
      title: "NO AFTERTASTE",
      description: "",
      icon: 'Smile',
    },
    {
      title: "NO SIDE EFFECTS",
      description: "",
      icon: 'CheckCircle',
    },
    {
      title: "FOR ALL AGE GROUPS",
      description: "",
      icon: 'Users',
    },
  ];

  return (
    <main className="min-h-screen">
      <Hero />
      <SectionDivider />
      <FeaturedProducts products={products} />
      <FeaturesBanner features={features} />
      <VideoTestimonials />
      <Recipes />
      <BlogPreview blogPosts={blogPosts} />
      <WhatsAppButton />
    </main>
  );
}
