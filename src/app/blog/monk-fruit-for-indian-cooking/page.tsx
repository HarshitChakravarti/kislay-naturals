import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Can Monk Fruit Sweetener Be Used in Indian Cooking?',
  description: 'Learn how monk fruit sweetener works in Indian recipes like chai, kheer, halwa, and homemade sweets.',
  openGraph: {
    title: 'Can Monk Fruit Sweetener Be Used in Indian Cooking?',
    description: 'Learn how monk fruit sweetener works in Indian recipes like chai, kheer, halwa, and homemade sweets.',
    type: 'article',
    publishedTime: new Date().toISOString(),
    authors: ['Kislay Naturals'],
  },
};

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-green-700 text-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/blog"
                className="flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Blog
              </Link>
            </div>
            <div className="text-sm">
              <Link href="/" className="text-white hover:text-yellow-300 transition-colors">
                Kislay Naturals
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Article Header */}
          <div className="p-6 lg:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-gray-900 mb-6">
            Monk Fruit Sweetener for Indian Cooking – Does It Really Work?
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
            A common myth is that natural sweeteners don’t work well in Indian food. The truth? Monk fruit sweetener works exceptionally well when used correctly.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800"
              alt="Monk Fruit Sweetener for Indian Cooking – Does It Really Work? – Cover"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              {/* Where Monk Fruit Works Best */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Where Monk Fruit Works Best</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Chai & coffee</li>
                  <li>Kheer, custard, payasam</li>
                  <li>Halwa & homemade mithai</li>
                  <li>Oats, porridge, breakfast bowls</li>
                </ul>
              </div>

              {/* Tips for Cooking with Monk Fruit */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Cooking with Monk Fruit</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Use smaller quantities (it’s much sweeter than sugar)</li>
                  <li>Add towards the end of cooking for best taste</li>
                  <li>Avoid overheating for long durations</li>
                </ul>
              </div>

              {/* Taste & Texture */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Taste & Texture</h2>
                <p className="text-gray-700 leading-relaxed">
                Unlike stevia, monk fruit has no bitter aftertaste, making it suitable for Indian desserts.
                </p>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Upgrade your traditional recipes</h3>
                <p className="mb-4">
                👉 Upgrade your traditional recipes with Kislay Monk Fruit Sweetener—without compromising health.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
