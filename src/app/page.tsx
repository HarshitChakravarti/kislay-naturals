import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import BlogPreview from "../components/BlogPreview";
import Testimonials from "../components/Testimonials";
import FeaturesBanner from "../components/FeaturesBanner";
import Recipes from "../components/Recipes";
import { Leaf, Award, ShoppingBag, Shield, Users } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Leaf className="w-12 h-12 text-green-600" />,
      title: "100% NATURAL",
      description: "Plant based",
    },
    {
      icon: <Award className="w-12 h-12 text-green-600" />,
      title: "ZERO CALORIES",
      description: "100% Healthy",
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-green-600" />,
      title: "TASTY",
      description: "No bitter aftertaste",
    },
    {
      icon: <Shield className="w-12 h-12 text-green-600" />,
      title: "NO SIDE EFFECTS",
      description: "Scientifically backed",
    },
    {
      icon: <Users className="w-12 h-12 text-green-600" />,
      title: "FOR ALL AGE GROUP",
      description: "Universal Age Appeal",
    },
  ]
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BlogPreview />
      <Testimonials />
      {/* Main content below hero and sections */}
      <main className="min-h-screen">
        <Recipes />
        <FeaturesBanner features={features} />
      </main>
    </>
  );
}
