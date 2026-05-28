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
      .eq('slug', 'monk-fruit-gut-health')
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
    title: 'Monk Fruit Sweetener & Gut Health — What Science Says | Kislay Naturals',
    description: 'Discover how monk fruit sweetener supports gut health. A natural, digestion-friendly sugar replacement.',
    keywords: 'monk fruit gut health, gut bacteria, digestion, monk fruit sweetener benefits, gut microbiome, digestive health',
    openGraph: {
      title: 'Monk Fruit Sweetener & Gut Health — What Science Says',
      description: 'Discover how monk fruit sweetener supports gut health. A natural, digestion-friendly sugar replacement.',
      type: 'article',
      publishedTime: publishedTime,
      authors: ['Kislay Naturals'],
    },
  };
}

export default async function MonkFruitGutHealthBlog() {
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
            
            <h1 className="text-3xl lg:text-4xl font-heading font-semibold text-gray-900 mb-6">
              Can Monk Fruit Sweetener <span className="text-green-600">Improve Gut Health?</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Gut health affects immunity, digestion, skin, weight, and mood. Sugar harms gut bacteria — but monk fruit sweetener may actually support wellness.
            </p>
          </div>

          {/* Cover Image */}
          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src={post?.image || '/cover.jpg'}
              alt="Monk Fruit Sweetener & Gut Health"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Article Content */}
          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Sugar & Gut Damage Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Sugar & Gut Damage — The Hidden Truth</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Refined sugar can wreak havoc on your digestive system:
                </p>
                <div className="bg-red-50 p-4 rounded-lg mb-4">
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li><strong>Feeds harmful gut bacteria</strong> — Sugar promotes the growth of bad bacteria while starving beneficial ones</li>
                    <li><strong>Increases bloating and acidity</strong> — Excess sugar fermentation leads to gas, bloating, and acid reflux</li>
                    <li><strong>Leads to inflammation</strong> — Chronic sugar consumption triggers inflammatory responses in the gut</li>
                  </ul>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  These effects can disrupt your entire digestive system, affecting not just your gut but your overall health and well-being.
                </p>
              </div>

              {/* Monk Fruit Is Digestion-Friendly Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Monk Fruit Sweetener Is Digestion-Friendly</h2>
                
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <p className="text-green-800 font-medium mb-3">
                    ✅ <strong>Benefits for gut health:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-green-800">
                    <li><strong>Zero fermentation in the gut</strong> — Unlike sugar, monk fruit doesn&apos;t ferment, preventing gas and bloating</li>
                    <li><strong>No GI distress</strong> — Gentle on the digestive system, making it suitable for sensitive stomachs</li>
                    <li><strong>May support beneficial bacteria</strong> — The antioxidant-rich mogrosides in monk fruit may help maintain a healthy gut microbiome</li>
                  </ul>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">
                  Unlike artificial sweeteners, monk fruit shows no negative impact on gut microbiota. This makes it a superior choice for those looking to maintain digestive health while still enjoying sweetness.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    🍯 <strong>Research suggests</strong> that the natural compounds in monk fruit (mogrosides) may have prebiotic-like effects, potentially supporting the growth of beneficial gut bacteria.
                  </p>
                </div>
              </div>

              {/* Easy Ways to Add Monk Fruit Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Easy Ways to Add Monk Fruit to Meals</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Incorporating monk fruit sweetener into your daily routine is simple and delicious:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🍵 In Herbal Teas</h3>
                    <p className="text-gray-600 text-sm">Add a few drops to your favorite herbal tea for natural sweetness without the gut disruption.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🍓 With Fruits</h3>
                    <p className="text-gray-600 text-sm">Enhance the natural sweetness of fruits without adding sugar that feeds harmful bacteria.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🥛 In Homemade Curd/Yogurt</h3>
                    <p className="text-gray-600 text-sm">Sweeten your probiotic-rich yogurt without compromising gut health.</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">🥤 Smoothies or Breakfast Bowls</h3>
                    <p className="text-gray-600 text-sm">Start your day with gut-friendly sweetness in your morning smoothies and breakfast bowls.</p>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Ready to Support Your Gut Health?</h3>
                <p className="mb-4">
                  👉 Make your gut happier — switch to <strong>Kislay Monk Fruit Sweetener</strong> for a natural, digestion-friendly way to enjoy sweetness.
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
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Monk Fruit vs Artificial Sweeteners</h4>
                <p className="text-gray-600 text-sm">Learn why monk fruit is a safer choice than artificial sweeteners for your gut health.</p>
              </div>
            </Link>
            <Link href="/blog/monk-fruit-1" className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Monk Fruit Sweetener – The Best Natural Sugar Substitute</h4>
                <p className="text-gray-600 text-sm">Discover the health benefits of switching to monk fruit sweetener.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}



