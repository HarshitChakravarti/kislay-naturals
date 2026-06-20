import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Hidden Dangers of Artificial Sweeteners | Kislay Naturals',
  description: 'Learn about the health risks of artificial sweeteners and why natural options like monk fruit are safer.',
  keywords: 'artificial sweeteners health risks, dangers of artificial sweeteners, monk fruit vs artificial sweeteners, natural sweetener, sugar substitute side effects, gut health sweeteners',
  openGraph: {
    title: 'Hidden Dangers of Artificial Sweeteners',
    description: 'Learn about the health risks of artificial sweeteners and why natural options like monk fruit are safer.',
    type: 'article',
    authors: ['Kislay Naturals'],
  },
};

export default function ArtificialSweetenersHealthRisksBlog() {
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
              Hidden Health Risks of <span className="text-green-600">Artificial Sweeteners</span> You Should Know
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Artificial sweeteners are often marketed as &quot;safe,&quot; but growing research raises concerns about long-term usage. Here&apos;s what you need to know before reaching for that sugar-free label.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800"
              alt="Hidden Health Risks of Artificial Sweeteners You Should Know"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">

              {/* Common Problems Linked to Artificial Sweeteners */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Problems Linked to Artificial Sweeteners</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While artificial sweeteners like aspartame, sucralose, and saccharin promise zero calories and guilt-free sweetness, studies are increasingly pointing to hidden downsides that most people aren&apos;t aware of.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <h3 className="font-semibold text-red-900 mb-2">🦠 Gut Microbiome Imbalance</h3>
                    <p className="text-red-800 text-sm">
                      Artificial sweeteners can alter the composition of beneficial gut bacteria, disrupting digestion and weakening immunity over time.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <h3 className="font-semibold text-orange-900 mb-2">🍬 Increased Sugar Cravings</h3>
                    <p className="text-orange-800 text-sm">
                      They trick the brain into expecting calories that never arrive, often leading to stronger sugar cravings and overeating later.
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <h3 className="font-semibold text-yellow-900 mb-2">😣 Digestive Discomfort</h3>
                    <p className="text-yellow-800 text-sm">
                      Many people experience bloating, gas, and stomach issues after regular consumption of artificial sweeteners like sorbitol and xylitol.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <h3 className="font-semibold text-purple-900 mb-2">⚡ Possible Metabolic Effects</h3>
                    <p className="text-purple-800 text-sm">
                      Research suggests artificial sweeteners may interfere with glucose metabolism, potentially increasing the risk of metabolic syndrome.
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <p className="text-red-800 font-medium">
                    ⚠️ What seems like a healthy swap may actually be doing more harm than good in the long run.
                  </p>
                </div>
              </div>

              {/* Why Natural Matters */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Natural Matters</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  When it comes to sweetening your food, the source matters just as much as the calories. Natural sweeteners like monk fruit offer a fundamentally different — and safer — approach.
                </p>

                <div className="bg-green-50 p-5 rounded-lg border border-green-100 mb-4">
                  <h3 className="font-semibold text-green-900 mb-3">✅ Why natural sweeteners like monk fruit are better:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2 mt-0.5">🌿</span>
                      <div>
                        <span className="font-semibold text-green-900">Plant-Derived</span>
                        <p className="text-green-800 text-sm mt-1">
                          Monk fruit sweetener comes directly from the Luo Han Guo fruit — no chemicals, no lab processing. What you get is nature&apos;s own sweetness.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2 mt-0.5">🧠</span>
                      <div>
                        <span className="font-semibold text-green-900">Non-Addictive</span>
                        <p className="text-green-800 text-sm mt-1">
                          Unlike artificial options that can heighten cravings, monk fruit satisfies your sweet tooth without creating a dependency cycle.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 font-bold mr-2 mt-0.5">💚</span>
                      <div>
                        <span className="font-semibold text-green-900">Easier on Digestion</span>
                        <p className="text-green-800 text-sm mt-1">
                          Monk fruit is gentle on the gut and doesn&apos;t cause the bloating, gas, or discomfort commonly associated with artificial sweeteners.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Artificial vs Natural Comparison */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Artificial vs Natural: A Quick Comparison</h2>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Factor</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Artificial Sweeteners</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Monk Fruit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">Source</td>
                        <td className="px-4 py-3 text-sm text-red-600">Chemically synthesised</td>
                        <td className="px-4 py-3 text-sm text-green-600">100% plant-derived</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">Gut Health</td>
                        <td className="px-4 py-3 text-sm text-red-600">May disrupt microbiome</td>
                        <td className="px-4 py-3 text-sm text-green-600">Gentle on digestion</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">Cravings</td>
                        <td className="px-4 py-3 text-sm text-red-600">Can increase cravings</td>
                        <td className="px-4 py-3 text-sm text-green-600">Satisfies without addiction</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">Metabolism</td>
                        <td className="px-4 py-3 text-sm text-red-600">May interfere</td>
                        <td className="px-4 py-3 text-sm text-green-600">No metabolic impact</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-700">Calories</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Zero</td>
                        <td className="px-4 py-3 text-sm text-green-600">Zero</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* A Safer Alternative */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">A Safer Alternative</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Monk fruit contains <strong>mogrosides</strong>, natural compounds that provide sweetness without harming your metabolism. These antioxidant-rich compounds are up to 200 times sweeter than sugar, yet they have zero calories, zero glycemic impact, and no known side effects.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Unlike artificial sweeteners that are engineered in labs, mogrosides are extracted from the monk fruit using a gentle, natural process — preserving all the benefits nature intended.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-blue-800">
                    💡 <strong>Did you know?</strong> Monk fruit has been used in traditional Chinese medicine for centuries and has been generally recognised as safe (GRAS) by the FDA.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Choose Safety Over Shortcuts</h3>
                <p className="mb-4">
                  👉 Choose safety over shortcuts with <strong>Kislay Monk Fruit Sweetener</strong> — 100% natural, zero calories, and gentle on your body.
                </p>
                <Link 
                  href="/products" 
                  className="inline-block bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Monk Fruit Sweetener
                </Link>
              </div>

            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/blog/monk-fruit-vs-artificial-sweeteners" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Monk Fruit vs Artificial Sweeteners — The Healthier Sugar Alternative</h4>
                <p className="text-gray-600 text-sm">Learn why monk fruit sweetener is a safer choice than artificial sweeteners like aspartame or sucralose.</p>
              </div>
            </Link>
            <Link href="/blog/monk-fruit-gut-health" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Can Monk Fruit Sweetener Improve Your Gut Health?</h4>
                <p className="text-gray-600 text-sm">Find out how monk fruit sweetener supports gut health and digestion compared to sugar and artificial alternatives.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
