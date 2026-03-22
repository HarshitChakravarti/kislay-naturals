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
      .eq('slug', 'quit-sugar-naturally-monk-fruit')
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

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const post = await getBlogPost();
  const publishedTime = post?.published_at || new Date().toISOString();

  return {
    title: 'How to Quit Sugar Naturally with Monk Fruit Sweetener | Kislay Naturals',
    description: 'Want to quit sugar without cravings? Learn how monk fruit sweetener helps you transition easily.',
    keywords: 'quit sugar naturally, monk fruit sweetener, sugar cravings, sugar free lifestyle, sugar swap plan, natural sweetener',
    openGraph: {
      title: 'How to Quit Sugar Naturally with Monk Fruit Sweetener',
      description: 'Want to quit sugar without cravings? Learn how monk fruit sweetener helps you transition easily.',
      type: 'article',
      publishedTime,
      authors: ['Kislay Naturals'],
    },
  };
}

export default async function QuitSugarNaturallyMonkFruitBlog() {
  const post = await getBlogPost();
  const publishedDate = post?.published_at
    ? new Date(post.published_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 lg:p-8">
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>{publishedDate}</span>
              <span className="mx-2">•</span>
              <User className="h-4 w-4 mr-2" />
              <span>Kislay Naturals</span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              How to Quit Sugar Naturally Without Feeling <span className="text-green-600">Deprived</span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Most people fail at quitting sugar because they try to eliminate sweetness completely.
              The smarter approach is to replace sugar, not sweetness.
            </p>
          </div>

          <div className="relative w-full h-56 sm:h-72 md:h-80 lg:h-96 mb-6 sm:mb-8 lg:mb-10">
            <Image
              src={post?.image || '/cover2.jpg'}
              alt="How to Quit Sugar Naturally Without Feeling Deprived"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="px-6 lg:px-8 pb-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Quitting Sugar Is So Hard</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sugar habits are not just about taste. They are wired into reward, routine, and
                  comfort. That is why cutting sugar suddenly can feel harder than expected.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-red-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Dopamine Reward Loop</h3>
                    <p className="text-red-800 text-sm">
                      Sugar triggers dopamine release, so your brain starts chasing the same sweet
                      reward again and again.
                    </p>
                  </div>
                  <div className="bg-orange-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-orange-900 mb-2">Dependence Builds Fast</h3>
                    <p className="text-orange-800 text-sm">
                      Repeated sugar highs and crashes can create dependency, making simple cravings
                      feel urgent.
                    </p>
                  </div>
                  <div className="bg-rose-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-rose-900 mb-2">Emotional Eating</h3>
                    <p className="text-rose-800 text-sm">
                      Stress, boredom, and fatigue often push people toward sugar because it feels
                      comforting in the moment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How Monk Fruit Helps You Quit Sugar</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Monk fruit sweetener makes the transition easier because you still get sweetness
                  while removing regular sugar from the equation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-green-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Satisfies Sweet Taste Buds</h3>
                    <p className="text-green-800 text-sm">
                      You do not feel like you are giving up sweetness entirely, which makes the new
                      habit easier to stick with.
                    </p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-blue-900 mb-2">No Insulin Spikes</h3>
                    <p className="text-blue-800 text-sm">
                      Without the usual sugar spike and crash, your energy and cravings stay more
                      stable through the day.
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-lg">
                    <h3 className="text-lg font-semibold text-emerald-900 mb-2">Retrains Taste Preferences</h3>
                    <p className="text-emerald-800 text-sm">
                      Over time, your palate can adjust so you rely less on intense sugar-heavy
                      foods.
                    </p>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed mb-0">
                    This is the practical way to quit sugar: keep the sweet experience, remove the
                    downside, and let your habits change gradually.
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Simple Sugar-Swap Plan</h2>
                <div className="space-y-4">
                  <div className="border border-green-100 rounded-lg p-5 bg-white shadow-sm">
                    <div className="text-sm font-semibold text-green-700 mb-2">Week 1</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Replace sugar in tea and coffee
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-0">
                      Start with your easiest daily habit. This gives you a quick win without
                      changing your entire routine at once.
                    </p>
                  </div>
                  <div className="border border-green-100 rounded-lg p-5 bg-green-50 shadow-sm">
                    <div className="text-sm font-semibold text-green-700 mb-2">Week 2</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Replace desserts and snacks
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-0">
                      Swap sweet snacks, desserts, and packaged treats for lower-sugar options that
                      use monk fruit or no added sugar.
                    </p>
                  </div>
                  <div className="border border-green-100 rounded-lg p-5 bg-white shadow-sm">
                    <div className="text-sm font-semibold text-green-700 mb-2">Week 3</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Move into a fully sugar-free lifestyle
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-0">
                      Once your pantry and habits improve, maintaining a sugar-free lifestyle feels
                      more natural and far less restrictive.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg mb-8">
                <h3 className="text-xl font-bold mb-3">Ready for a Smoother Sugar Exit?</h3>
                <p className="mb-4">
                  Make the transition smooth with <strong>Kislay Monk Fruit Sweetener</strong>.
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

        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/blog/monk-fruit-sugar-cravings"
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Can Monk Fruit Sweetener Help Reduce Sugar Cravings?
                </h4>
                <p className="text-gray-600 text-sm">
                  See how monk fruit can help you control cravings and break the sugar cycle.
                </p>
              </div>
            </Link>
            <Link
              href="/blog/monk-fruit-vs-artificial-sweeteners"
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Monk Fruit vs Artificial Sweeteners
                </h4>
                <p className="text-gray-600 text-sm">
                  Compare monk fruit with common sugar substitutes and see why natural wins.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
