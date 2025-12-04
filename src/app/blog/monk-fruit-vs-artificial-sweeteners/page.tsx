import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, User } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabase';

async function getBlogPost() {
  try {
    const { data, error } = await supabaseAdmin
      .from('blogposts')
      .select('*')
      .eq('slug', 'monk-fruit-vs-artificial-sweeteners')
      .eq('is_published', true)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export const revalidate = 0; // Disable caching to ensure fresh data

export async function generateMetadata(): Promise<Metadata> {
  const post = await getBlogPost();
  const publishedTime = post?.published_at || new Date().toISOString();

  return {
    title: 'Monk Fruit vs Artificial Sweeteners — The Healthier Sugar Alternative | Kislay Naturals',
    description: 'Learn why monk fruit sweetener is a safer choice than artificial sweeteners like aspartame or sucralose. 100% natural, zero calories, and diabetic-friendly.',
    keywords: 'monk fruit vs artificial sweeteners, aspartame, sucralose, saccharin, natural sweetener, healthy sugar alternative, monk fruit benefits',
    openGraph: {
      title: 'Monk Fruit vs Artificial Sweeteners — The Healthier Sugar Alternative',
      description: 'Learn why monk fruit sweetener is a safer choice than artificial sweeteners like aspartame or sucralose. 100% natural, zero calories, and diabetic-friendly.',
      type: 'article',
      publishedTime: publishedTime,
      authors: ['Kislay Naturals'],
    },
  };
}

export default async function MonkFruitVsArtificialSweetenersBlog() {
  const post = await getBlogPost();
  const publishedDate = post?.published_at 
    ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

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
              <span>{publishedDate}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Monk Fruit vs Artificial Sweeteners — Which Is the <span className="text-green-600">Healthier Choice?</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              There are many sugar substitutes in the market today — but not all of them are healthy. While some are made chemically, monk fruit sweetener is 100% natural and safer for long-term use.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src="/cover.jpg"
              alt="Monk Fruit vs Artificial Sweeteners"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              
              {/* What Are Artificial Sweeteners */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Artificial Sweeteners?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Artificial sweeteners are synthetic sugar substitutes that provide sweetness without calories. Common examples include:
                </p>
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Aspartame</strong> — Found in diet sodas and sugar-free products</li>
                    <li><strong>Sucralose</strong> — Marketed as Splenda, used in many processed foods</li>
                    <li><strong>Saccharin</strong> — One of the oldest artificial sweeteners, often found in tabletop sweeteners</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  These may provide sweetness without calories but may also come with health concerns, including potential links to digestive issues, headaches, and long-term health risks.
                </p>
              </div>

              {/* Why Monk Fruit Stands Out */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Monk Fruit Stands Out</h2>
                
                {/* Comparison Table */}
                <div className="overflow-x-auto mb-6">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Feature</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-green-700 border-b">Monk Fruit</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Artificial Sweeteners</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Source</td>
                        <td className="px-4 py-3 text-sm text-green-700">Natural fruit</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Synthetic chemicals</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Effect on blood sugar</td>
                        <td className="px-4 py-3 text-sm text-green-700">None</td>
                        <td className="px-4 py-3 text-sm text-gray-600">None</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Long-term safety</td>
                        <td className="px-4 py-3 text-sm text-green-700">Considered safe</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Some linked to side effects</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">Taste</td>
                        <td className="px-4 py-3 text-sm text-green-700">Clean & natural</td>
                        <td className="px-4 py-3 text-sm text-gray-600">Metallic or bitter aftertaste</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🍯 <strong>Monk fruit contains mogrosides</strong>, known for their antioxidant benefits — something artificial sweeteners lack. These natural compounds not only provide sweetness but also offer potential health benefits.
                  </p>
                </div>
              </div>

              {/* Best Sweetener for Health */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Best Sweetener for Health?</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  If you care about natural, clean, and safe sweetening — monk fruit is the clear winner. Unlike artificial sweeteners that are created in laboratories, monk fruit sweetener comes directly from nature, making it a better choice for those who prioritize whole, unprocessed foods.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    ✅ <strong>Monk fruit sweetener</strong> offers the sweetness you crave without the concerns associated with artificial alternatives. It&apos;s perfect for diabetics, weight watchers, and anyone looking to reduce their intake of processed chemicals.
                  </p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Ready to Choose the Healthier Option?</h3>
                <p className="mb-4">
                  👉 Choose a healthier future with <strong>Kislay Monk Fruit Sweetener</strong> — pure sweetness, naturally.
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
            <Link href="/blog/monk-fruit-1" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Monk Fruit Sweetener – The Best Natural Sugar Substitute</h4>
                <p className="text-gray-600 text-sm">Learn why monk fruit is the healthiest sugar alternative available today.</p>
              </div>
            </Link>
            <Link href="/blog/monk-fruit-diabetics-guide" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Is Monk Fruit Safe for Diabetics? The Complete Guide</h4>
                <p className="text-gray-600 text-sm">Learn why monk fruit sweetener is safe for diabetics.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

