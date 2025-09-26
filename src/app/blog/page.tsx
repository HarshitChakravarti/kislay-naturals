import Link from 'next/link'
import Image from 'next/image'
import { Yeseva_One } from 'next/font/google'

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
})

const blogPosts = [
  {
    id: 'monk-fruit-1',
    title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India',
    excerpt: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
    image: '/cover3.jpg',
    date: 'August 24, 2025',
    readTime: '5 min read',
    category: 'Health & Nutrition'
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
    id: 'monk-fruit-3',
    title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today',
    excerpt: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
    image: '/mcover.png',
    date: 'September 14, 2025',
    readTime: '6 min read',
    category: 'Health & Wellness'
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
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              href={`/blog/${post.id}`}
              className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <span>{post.readTime}</span>
                </div>
                <div className="mb-3">
                  <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
