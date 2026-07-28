import Link from 'next/link';
import Image from 'next/image';
import { Clock, Users, ChefHat } from 'lucide-react';
async function getRecipes() {
  try {
    // Use supabaseAdmin to bypass RLS for server-side rendering
    const { supabaseAdmin } = await import('@/lib/supabaseAdmin');
    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch recipes:', error);
      return [];
    }
    
    console.log('Recipes data:', data?.length);
    return data || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

export default async function RecipesPage() {
  const recipes = await getRecipes();
  console.log('Recipes fetched:', recipes.length, 'recipes');
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h1 className={`text-3xl md:text-5xl font-semibold mb-4 font-heading`}>
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
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {recipes.map((recipe: any) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug || recipe.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50 hover:border-green-50"
            >
              <div className="relative h-48 sm:h-56 lg:h-64 bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image 
                  src={recipe.image || '/recipes/recipe1.jpg'} 
                  alt={recipe.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2 sm:mb-3">
                  <span className="inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {recipe.difficulty || 'Easy'}
                  </span>
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
                    <span>{recipe.prep_time}</span>
                  </div>
                </div>
                
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3 group-hover:text-green-600 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>
                
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                  {recipe.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xs sm:text-sm text-gray-500">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-green-600" />
                    <span>{recipe.servings} {recipe.servings > 1 ? 'servings' : 'serving'}</span>
                  </div>
                  
                  <div className="flex items-center text-green-600 font-medium group-hover:text-green-700 text-xs sm:text-sm">
                    <span>View Recipe</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 mb-6 font-heading`}>
            Ready to Start Cooking?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Get your hands on Kislay Monk Fruit Sweetener monk fruit sweetener and start creating these delicious, 
            sugar-free recipes in your own kitchen today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/products"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              <ChefHat className="w-5 h-5 mr-2" />
              Shop Kislay Monk Fruit Sweetener
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
