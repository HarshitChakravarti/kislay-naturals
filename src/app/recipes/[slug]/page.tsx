import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, Users, ChefHat, ArrowLeft, Share2, Heart } from 'lucide-react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { notFound } from 'next/navigation';

interface RecipePageProps {
  params: {
    slug: string;
  };
}

async function getRecipe(slug: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('recipes')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error || !data) return null;
    return data;
  } catch (error) {
    console.error('Error fetching recipe:', error);
    return null;
  }
}

export const revalidate = 0;

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const recipe = await getRecipe(params.slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found | Kislay Naturals',
    };
  }

  return {
    title: `${recipe.title} | Kislay Naturals`,
    description: recipe.description,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'article',
      authors: [recipe.author || 'Kislay Naturals'],
    },
    twitter: {
      card: 'summary_large_image',
      title: recipe.title,
      description: recipe.description,
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const recipe = await getRecipe(params.slug);

  if (!recipe) {
    notFound();
  }

  const nutrition = typeof recipe.nutrition === 'string' ? JSON.parse(recipe.nutrition) : recipe.nutrition;
  const ingredients = typeof recipe.ingredients === 'string' ? JSON.parse(recipe.ingredients) : recipe.ingredients;
  const instructions = typeof recipe.instructions === 'string' ? JSON.parse(recipe.instructions) : recipe.instructions;
  const tips = typeof recipe.tips === 'string' ? JSON.parse(recipe.tips) : recipe.tips;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="relative bg-green-700 text-white py-6 w-full overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <Link 
                href="/recipes" 
                className="flex items-center text-white hover:text-yellow-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Recipes
              </Link>
              <div className="flex items-center space-x-4">
                <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-green-600 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 md:h-[500px] relative overflow-hidden">
          <Image
            src={recipe.image || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800'}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4 font-heading">
                {recipe.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                {recipe.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recipe Info Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 sticky top-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 font-heading">
                Recipe Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Prep Time</p>
                    <p className="font-semibold">{recipe.prep_time || recipe.prepTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Cook Time</p>
                    <p className="font-semibold">{recipe.cook_time || recipe.cookTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Servings</p>
                    <p className="font-semibold">{recipe.servings}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-5 h-5 bg-green-600 rounded-full mr-3 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Difficulty</p>
                    <p className="font-semibold">{recipe.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Nutrition Info */}
              {nutrition && (
                <div className="mt-8">
                  <h4 className="font-semibold text-gray-900 mb-4">Nutrition (per serving)</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-600">Calories</p>
                      <p className="font-bold text-green-600">{nutrition.calories}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-600">Sugar</p>
                      <p className="font-bold text-green-600">{nutrition.sugar}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-600">Carbs</p>
                      <p className="font-bold text-green-600">{nutrition.carbs}g</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                      <p className="text-gray-600">Protein</p>
                      <p className="font-bold text-green-600">{nutrition.protein}g</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Recipe Content */}
          <div className="lg:col-span-2">
            {/* Ingredients */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                Ingredients
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {ingredients?.map((ingredient: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-3 mt-1">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructions */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                Instructions
              </h2>
              <div className="space-y-4">
                {instructions?.map((instruction: string, index: number) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            {tips && tips.length > 0 && (
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 font-heading">
                  Pro Tips
                </h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <ul className="space-y-3">
                    {tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <span className="text-yellow-600 mr-3 mt-1">💡</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                Made with Kislay Monk Fruit Sweetener
              </h3>
              <p className="text-gray-600 mb-6">
                Get the same natural sweetness in your own kitchen with our monk fruit sweetener drops.
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop Kislay Monk Fruit Sweetener
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
