import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Is Monk Fruit Sweetener Safe for Diabetics? A Complete Guide',
  description: 'Learn why monk fruit sweetener is safe for diabetics. Zero calories, zero carbs, and no effect on blood sugar levels.',
  openGraph: {
    title: 'Is Monk Fruit Sweetener Safe for Diabetics? A Complete Guide',
    description: 'Learn why monk fruit sweetener is safe for diabetics. Zero calories, zero carbs, and no effect on blood sugar levels.',
    type: 'article',
    publishedTime: '2025-10-29T00:00:00.000Z',
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
              <span>October 29, 2025</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-gray-900 mb-6">
              Is Monk Fruit Safe for Diabetics? The Complete Guide
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Managing diabetes often means cutting down on sugar – but that doesn’t mean giving up sweetness. Monk fruit sweetener is a natural alternative that makes life sweeter without harming your health.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800"
              alt="Is Monk Fruit Safe for Diabetics – Cover"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              {/* Why Diabetics Need Sugar Alternatives */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Diabetics Need Sugar Alternatives</h2>
                <p className="text-gray-700 leading-relaxed">
                  Excess sugar can spike blood glucose and increase insulin resistance. That’s why low-glycemic sweeteners are crucial for people with diabetes.
                </p>
              </div>

              {/* How Monk Fruit Helps Diabetics */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Monk Fruit Helps Diabetics</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Zero glycemic index</strong> → does not raise blood sugar</li>
                  <li><strong>No calories, no carbs</strong> → perfect for weight control</li>
                  <li><strong>Natural sweetness</strong> → no chemicals, no aftertaste</li>
                </ul>
              </div>

              {/* How to Use Monk Fruit */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use Monk Fruit in a Diabetic Diet</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Sweeten tea, coffee, lemonade</li>
                  <li>Prepare sugar-free desserts</li>
                  <li>Add to oats, yogurt, smoothies</li>
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Enjoy Sweetness Without Spikes</h3>
                <p className="mb-4">
                  👉 If you’re diabetic, <strong>Kislay Monk Fruit Sweetener</strong> is your guilt-free way to enjoy sweetness every day.
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


