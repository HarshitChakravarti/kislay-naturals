import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChefHat } from 'lucide-react';
import { Yeseva_One } from 'next/font/google';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

const recipes = [
  {
    id: 1,
    title: "Sugar-Free Lemonade",
    prepTime: "5 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe1.jpg",
    description: "Refreshing lemonade sweetened naturally with KislayNaturals"
  },
  {
    id: 2,
    title: "Healthy Oatmeal",
    prepTime: "10 mins",
    servings: 1,
    difficulty: "Easy",
    image: "/oatmeal.jpg",
    description: "Warm and comforting oatmeal with natural sweetness"
  },
  {
    id: 3,
    title: "Fruit Smoothie",
    prepTime: "7 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe3.jpg",
    description: "Creamy fruit smoothie with zero added sugar"
  },
  {
    id: 4,
    title: "Chia Pudding",
    prepTime: "5 mins + chilling",
    servings: 2,
    difficulty: "Easy",
    image: "/chiapudding.jpg",
    description: "Protein-packed chia pudding with natural sweetness"
  },
  {
    id: 5,
    title: "Sugar-Free Iced Tea",
    prepTime: "10 mins",
    servings: 4,
    difficulty: "Easy",
    image: "/icedtea.jpg",
    description: "Refreshing iced tea with a hint of natural sweetness"
  },
  {
    id: 6,
    title: "Protein Pancakes",
    prepTime: "15 mins",
    servings: 2,
    difficulty: "Medium",
    image: "/pancakes.jpg",
    description: "Fluffy pancakes with no added sugar"
  }
];

export default function RecipesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className={`text-3xl md:text-5xl mb-4 ${yeseva_One.className}`}>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  SUGAR-FREE RECIPES
                </span>
                {' \u{1F60B}'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-white/90 max-w-2xl mx-auto">
                Discover delicious, healthy recipes made with Kislay Monk Fruit Sweetener. 
                From refreshing drinks to satisfying meals, enjoy natural sweetness without the guilt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50 hover:border-green-50"
            >
              <div className="relative h-64 bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image 
                  src={recipe.image} 
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {recipe.difficulty}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1 text-green-600" />
                    <span>{recipe.prepTime}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {recipe.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="w-4 h-4 mr-1 text-green-600" />
                    <span>{recipe.servings} {recipe.servings > 1 ? 'servings' : 'serving'}</span>
                  </div>
                  
                  <div className="flex items-center text-green-600 font-medium group-hover:text-green-700">
                    <span>View Recipe</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 ${yeseva_One.className}`}>
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your hands on KislayNaturals monk fruit sweetener and start creating these delicious, 
            sugar-free recipes in your own kitchen today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Shop KislayNaturals
            </Link>
            <Link 
              href="/"
              className="inline-flex items-center border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
