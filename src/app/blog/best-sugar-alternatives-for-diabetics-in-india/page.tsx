import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Best Sugar Alternatives for Diabetics in India | Kislay Naturals',
  description: 'Discover the best sugar alternatives for diabetics in India. Compare monk fruit, stevia, jaggery, and artificial sweeteners.',
  keywords: 'sugar alternatives india, diabetics sugar, monk fruit, stevia, jaggery, artificial sweeteners',
  openGraph: {
    title: 'Best Sugar Alternatives for Diabetics in India',
    description: 'Discover the best sugar alternatives for diabetics in India. Compare monk fruit, stevia, jaggery, and artificial sweeteners.',
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
              Best Sugar Alternatives for <span className="text-green-600">Diabetics in India</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
            For people living with diabetes, sugar control is not optional—it’s essential. Choosing the right sugar alternative can help manage blood glucose without sacrificing taste.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&q=80&w=800"
              alt="Sugar Alternatives for Diabetics"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Regular Sugar is Harmful for Diabetics</h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                    <li>Causes sudden blood sugar spikes</li>
                    <li>Increases insulin resistance</li>
                    <li>Leads to long-term complications</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Sugar Alternatives in India (Compared)</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Sweetener</th>
                                <th className="py-2 px-4 border-b">Natural</th>
                                <th className="py-2 px-4 border-b">Glycemic Impact</th>
                                <th className="py-2 px-4 border-b">Suitable for Diabetics</th>
                            </tr>
                        </thead>
.                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b">White sugar</td>
                                <td className="py-2 px-4 border-b text-center">❌</td>
                                <td className="py-2 px-4 border-b">Very High</td>
                                <td className="py-2 px-4 border-b text-center">❌</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">Jaggery</td>
                                <td className="py-2 px-4 border-b text-center">✅</td>
                                <td className="py-2 px-4 border-b">High</td>
                                <td className="py-2 px-4 border-b text-center">❌</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">Honey</td>
                                <td className="py-2 px-4 border-b text-center">✅</td>
                                <td className="py-2 px-4 border-b">High</td>
                                <td className="py-2 px-4 border-b text-center">❌</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">Artificial sweeteners</td>
                                <td className="py-2 px-4 border-b text-center">❌</td>
                                <td className="py-2 px-4 border-b">Low</td>
                                <td className="py-2 px-4 border-b text-center">⚠️</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b">Monk fruit</td>
                                <td className="py-2 px-4 border-b text-center">✅</td>
                                <td className="py-2 px-4 border-b">Zero</td>
                                <td className="py-2 px-4 border-b text-center">✅✅</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Monk Fruit is the Best Choice</h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                    <li>Zero glycemic index</li>
                    <li>No calories or carbs</li>
                    <li>No bitter aftertaste</li>
                    <li>Safe for daily use</li>
                </ul>
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
      </div>
    </div>
  );
}
