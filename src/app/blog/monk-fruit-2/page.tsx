import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Is Monk Fruit Sweetener Good for Diabetics? | Kislay Naturals',
  description: 'Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.',
  keywords: 'monk fruit sweetener diabetics, diabetic friendly sweetener, zero sugar sweetener, blood sugar control, natural sweetener diabetes',
  openGraph: {
    title: 'Is Monk Fruit Sweetener Good for Diabetics?',
    description: 'Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.',
    type: 'article',
    publishedTime: '2025-09-09T00:00:00.000Z',
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
              <span>September 9, 2025</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Is <span className="text-green-600">Monk Fruit Sweetener</span> Good for Diabetics?
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.
            </p>
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <div className="mb-8">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Diabetes is on the rise in India, and managing sugar intake is a daily challenge. But does that mean you have to give up sweetness altogether? Not at all! Monk fruit sweetener is a natural sugar alternative that is completely safe for diabetics.
                </p>
              </div>

              {/* Why Monk Fruit is Safe Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Monk Fruit is Safe for Diabetics</h2>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    💚 Unlike sugar, monk fruit sweetener does not spike blood glucose levels. It is a <strong>low-glycemic sweetener</strong>, making it safe for daily use by diabetics. The natural compounds in monk fruit, called mogrosides, provide sweetness without affecting blood sugar or insulin levels.
                  </p>
                </div>
              </div>

              {/* How to Use Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use Monk Fruit Sweetener in a Diabetic Diet</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">☕ Beverages</h3>
                    <p className="text-blue-800 text-sm">Add to tea, coffee, or lemonade</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-pink-900 mb-2">🍰 Desserts</h3>
                    <p className="text-pink-800 text-sm">Use in homemade sweets & desserts</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-yellow-900 mb-2">🥣 Breakfast</h3>
                    <p className="text-yellow-800 text-sm">Sprinkle on fruits, oats, or yogurt</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-orange-900 mb-2">🍪 Baking</h3>
                    <p className="text-orange-800 text-sm">Substitute for sugar in recipes</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Sweetness Without the Guilt</h3>
                <p className="mb-4">
                  👉 With <strong>Kislay Monk Fruit Sweetener</strong>, diabetics can finally enjoy sweet foods without worrying about sugar spikes. Make the switch today and experience the natural sweetness your body deserves.
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