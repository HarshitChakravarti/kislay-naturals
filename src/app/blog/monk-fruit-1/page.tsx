import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India | Kislay Naturals',
  description: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
  keywords: 'monk fruit sweetener India, natural sugar substitute, zero calorie sweetener, diabetic friendly, healthy sweetener',
  openGraph: {
    title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India',
    description: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
    type: 'article',
    publishedTime: '2025-08-24T00:00:00.000Z',
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
              <span>August 24, 2025</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Why <span className="text-green-600">Monk Fruit Sweetener</span> is the Best Natural Sugar Substitute in India
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories,
              diabetic-friendly, and perfect for weight management.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="/cover3.jpg"
              alt="Monk Fruit Sweetener – Natural Sugar Substitute"
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
                  If you&apos;re looking for a healthy alternative to sugar, monk fruit sweetener is becoming the top choice for
                  health-conscious individuals in India. Unlike artificial sweeteners or refined sugar, monk fruit extract is
                  100% natural, zero-calorie, and diabetic-friendly.
                </p>
              </div>

              {/* What is Monk Fruit Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Monk Fruit Sweetener?</h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🍯 <strong>Monk fruit</strong>, also known as <em>luo han guo</em>, is a small fruit native to Southeast Asia. The extract
                    from monk fruit is <strong>150–200 times sweeter than sugar</strong>, but without the calories.
                  </p>
                </div>
              </div>

              {/* Health Benefits Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Health Benefits of Monk Fruit Sweetener</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">🎯 Zero Calories</h3>
                    <p className="text-blue-800 text-sm">Ideal for weight management</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-2">💚 Safe for Diabetics</h3>
                    <p className="text-green-800 text-sm">No effect on blood sugar levels</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">🛡️ Anti-inflammatory Properties</h3>
                    <p className="text-purple-800 text-sm">Supports immunity</p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-emerald-900 mb-2">🌿 No Artificial Chemicals</h3>
                    <p className="text-emerald-800 text-sm">Unlike aspartame or sucralose</p>
                  </div>
                </div>
              </div>

              {/* Comparison Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Choose Monk Fruit Sweetener Over Other Sugar Substitutes?
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    🍯 Compared to stevia or artificial sweeteners, monk fruit has a <strong>clean, natural taste with no bitter aftertaste</strong>. 
                    It&apos;s perfect for tea, coffee, desserts, and everyday cooking.
                  </p>
                </div>
              </div>

              {/* India Trend Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Monk Fruit Sweetener in India – A Growing Trend</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  As more Indians shift towards healthy eating, monk fruit sweetener is becoming a popular choice for
                  fitness enthusiasts, diabetics, and weight-watchers.
                </p>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Ready to Make the Switch?</h3>
                <p className="mb-4">
                  👉 Switch to <strong>Kislay Monk Fruit Sweetener</strong> today for a healthier lifestyle!
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
            <Link href="/blog/monk-fruit-2" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Is Monk Fruit Sweetener Good for Diabetics?</h4>
                <p className="text-gray-600 text-sm">Find out why monk fruit sweetener is safe for diabetics.</p>
              </div>
            </Link>
            <Link href="/blog/monk-fruit-3" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">5 Reasons to Switch from Sugar to Monk Fruit</h4>
                <p className="text-gray-600 text-sm">Learn the powerful reasons to make the switch today.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}