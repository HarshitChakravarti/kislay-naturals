import Image from "next/image";
import Hero from "../components/Hero";
import FeaturedProducts from "../components/FeaturedProducts";
import BlogPreview from "../components/BlogPreview";
import Testimonials from "../components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <BlogPreview />
      <Testimonials />
      {/* Main content below hero and sections */}
      <main className="flex flex-col items-center justify-center min-h-[40vh] px-4 sm:px-0">
        <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
          <div className="bg-white rounded shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🌱</span>
            <h2 className="font-semibold text-green-800 mb-1">100% Natural</h2>
            <p className="text-green-900 text-sm">No artificial additives, just pure monk fruit goodness.</p>
          </div>
          <div className="bg-white rounded shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">💚</span>
            <h2 className="font-semibold text-green-800 mb-1">Healthy & Low-Calorie</h2>
            <p className="text-green-900 text-sm">Enjoy sweetness without the calories or blood sugar spikes.</p>
          </div>
          <div className="bg-white rounded shadow-md p-6 flex flex-col items-center">
            <span className="text-3xl mb-2">🌏</span>
            <h2 className="font-semibold text-green-800 mb-1">Sustainably Sourced</h2>
            <p className="text-green-900 text-sm">Our products are made with care for you and the planet.</p>
          </div>
        </section>
      </main>
    </>
  );
}
