import Link from 'next/link'
import Image from 'next/image'
import { Yeseva_One } from 'next/font/google'

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
})

async function getBlogPosts() {
  try {
    // Use supabaseAdmin to bypass RLS for server-side rendering
    const { supabaseAdmin } = await import('@/lib/supabase');
    const { data, error } = await supabaseAdmin
      .from('blogposts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch blog posts:', error);
      return [];
    }
    
    // Filter out any posts with missing required fields
    const validPosts = (data || []).filter(post => 
      post && 
      post.slug && 
      post.title && 
      post.published_at
    );
    
    console.log('Blog posts data:', validPosts.length, 'out of', data?.length || 0);
    return validPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export default async function BlogPage() {
  const blogPosts = await getBlogPosts()
  console.log('Blog posts fetched:', blogPosts.length, 'posts');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with green background and gradient shadow */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        {/* Gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        {/* Content layer */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  OUR BLOGS
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
                Discover the latest insights about natural sweeteners, healthy living, and delicious recipes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {blogPosts.map((post: any) => (
            <Link 
              key={post.slug} 
              href={`/blog/${post.slug}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-40 sm:h-48 w-full">
                <Image
                  src={post.image || '/cover.jpg'}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                  <span>{post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}</span>
                  <span className="mx-2">•</span>
                  <span>{post.read_time || '5 min read'}</span>
                </div>
                {post.category && (
                  <div className="mb-3">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                )}
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* End CTA Section */}
      <div className="bg-green-50">
        <div className="container mx-auto px-4 py-14 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-black mb-4 ${yeseva_One.className}`}>
            Ready to Keep Exploring?
          </h2>
          <p className="text-lg md:text-xl text-green-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Dive deeper into healthy living with more blogs, or bring the goodness home with our monk fruit sweetener.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors"
            >
              Shop Kislay Naturals
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-green-600 px-4 py-2 text-green-700 hover:bg-green-100 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
