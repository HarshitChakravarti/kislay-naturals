import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today | Kislay Naturals',
  description: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
  keywords: 'monk fruit sweetener benefits, sugar replacement, healthy sweetener, natural sugar substitute, quit sugar',
  openGraph: {
    title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today',
    description: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
    type: 'article',
    publishedTime: '2025-09-14T00:00:00.000Z',
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
              <span>September 14, 2025</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-gray-900 mb-6">
              5 Reasons to Switch from Sugar to <span className="text-green-600">Monk Fruit Sweetener</span> Today
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="/desktop hero/mcover.png"
              alt="5 Reasons to Switch from Sugar to Monk Fruit"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sugar is one of the biggest contributors to obesity, diabetes, and heart disease. If you&apos;re planning to quit sugar, monk fruit sweetener is your best option. Here&apos;s why:
                </p>
              </div>

              {/* Reason 1: Zero Calories */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Zero Calories, Zero Guilt</h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🎯 Enjoy sweetness without adding extra calories. Unlike sugar which contains 16 calories per teaspoon, monk fruit sweetener has <strong>zero calories</strong>, making it perfect for weight management and calorie-conscious individuals.
                  </p>
                </div>
              </div>

              {/* Reason 2: Perfect for Weight Loss */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Perfect for Weight Loss</h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    💪 Supports fat loss and reduces cravings. Monk fruit sweetener helps you maintain a calorie deficit while still satisfying your sweet tooth, making it easier to stick to your weight loss goals.
                  </p>
                </div>
              </div>

              {/* Reason 3: Diabetic-Friendly */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Diabetic-Friendly</h2>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-800 font-medium">
                    💚 Safe for people with Type 1 and Type 2 diabetes. Monk fruit sweetener has a <strong>zero glycemic index</strong>, meaning it doesn&apos;t raise blood sugar levels, making it the perfect choice for diabetics.
                  </p>
                </div>
              </div>

              {/* Reason 4: 100% Natural */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 100% Natural</h2>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-orange-800 font-medium">
                    🌿 No chemicals, no artificial additives. Monk fruit sweetener is extracted from the natural fruit, making it a clean, pure alternative to artificial sweeteners like aspartame or sucralose.
                  </p>
                </div>
              </div>

              {/* Reason 5: Great Taste */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Great Taste</h2>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-teal-800 font-medium">
                    🍯 Sweet, clean taste with no bitter aftertaste. Unlike stevia which can have a bitter aftertaste, monk fruit sweetener provides a clean, natural sweetness that&apos;s closest to sugar.
                  </p>
                </div>
              </div>

              {/* Benefits Summary */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Monk Fruit Over Other Sweeteners?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">🎯 Zero Calories</h3>
                    <p className="text-green-800 text-sm">Perfect for weight management</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">💚 Diabetic Safe</h3>
                    <p className="text-blue-800 text-sm">No blood sugar spikes</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-900 mb-2">🌿 Natural Source</h3>
                    <p className="text-emerald-800 text-sm">No artificial chemicals</p>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-amber-900 mb-2">😋 Great Taste</h3>
                    <p className="text-amber-800 text-sm">Clean, sweet flavor</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Ready to Make the Switch?</h3>
                <p className="mb-4">
                  👉 Whether you&apos;re on a weight-loss journey, diabetic, or simply health-conscious, <strong>Kislay Monk Fruit Sweetener</strong> is your perfect sugar replacement.
                </p>
                <Link 
                  href="/products" 
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Buy Now - Get Started Today
                </Link>
              </div>

            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/monk-fruit-1" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Why Monk Fruit Sweetener is the Best Natural Sugar Substitute</h4>
                <p className="text-gray-600 text-sm">Discover the health benefits of monk fruit sweetener.</p>
              </div>
            </Link>
            <Link href="/blog/monk-fruit-2" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Is Monk Fruit Sweetener Good for Diabetics?</h4>
                <p className="text-gray-600 text-sm">Find out why monk fruit sweetener is safe for diabetics.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}