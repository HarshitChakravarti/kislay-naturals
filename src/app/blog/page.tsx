import Link from 'next/link'
import Image from 'next/image'
import { Yeseva_One } from 'next/font/google'

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
})

const blogPosts = [
  {
    id: 'monk-fruit-daily-uses',
    title: '7 Easy Ways to Use Monk Fruit Sweetener in Your Daily Diet',
    excerpt: 'Discover 7 simple ways to add monk fruit sweetener to your daily diet. Perfect for tea, coffee, desserts, and Indian recipes.',
    image: '/cover4.jpg',
    date: 'October 14, 2025',
    readTime: '4 min read',
    category: 'Daily Living'
  },
  {
    id: 'monk-fruit-weight-loss',
    title: 'How Monk Fruit Sweetener Supports Weight Loss Naturally',
    excerpt: 'Find out how monk fruit sweetener helps with weight loss. Zero calories, reduces cravings, and keeps you full without sugar spikes.',
    image: '/herophoto2.png',
    date: 'October 2, 2025',
    readTime: '5 min read',
    category: 'Weight Loss'
  },
  {
    id: 'monk-fruit-3',
    title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today',
    excerpt: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
    image: '/mcover.png',
    date: 'September 14, 2025',
    readTime: '6 min read',
    category: 'Health & Wellness'
  },
  {
    id: 'monk-fruit-2',
    title: 'Is Monk Fruit Sweetener Good for Diabetics?',
    excerpt: 'Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.',
    image: '/herophoto.png',
    date: 'September 9, 2025',
    readTime: '4 min read',
    category: 'Health & Diabetes'
  },
  {
    id: 'monk-fruit-1',
    title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India',
    excerpt: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
    image: '/cover3.jpg',
    date: 'August 24, 2025',
    readTime: '5 min read',
    category: 'Health & Nutrition'
  }
]

export default function BlogPage() {
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
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-40 sm:h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 sm:p-6">
                <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 sm:px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
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
