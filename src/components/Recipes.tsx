import Image from "next/image";
import { Clock, Users, Heart } from "lucide-react";

const recipes = [
  {
    id: 1,
    title: "Sugar-Free Lemonade",
    prepTime: "5 mins",
    servings: 2,
    image: "/recipes/lemonade.jpg",
    description: "Refreshing lemonade sweetened naturally with KislayNaturals",
    ingredients: [
      "2 cups water",
      "4 tbsp lemon juice",
      "1 tsp KislayNaturals sweetener",
      "Ice cubes",
      "Mint leaves for garnish"
    ]
  },
  {
    id: 2,
    title: "Healthy Oatmeal",
    prepTime: "10 mins",
    servings: 1,
    image: "/recipes/oatmeal.jpg",
    description: "Warm and comforting oatmeal with natural sweetness",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup almond milk",
      "1 tsp KislayNaturals sweetener",
      "1/2 tsp cinnamon",
      "Handful of berries"
    ]
  },
  {
    id: 3,
    title: "Fruit Smoothie",
    prepTime: "7 mins",
    servings: 2,
    image: "/recipes/smoothie.jpg",
    description: "Creamy fruit smoothie with zero added sugar",
    ingredients: [
      "1 banana",
      "1/2 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1 tsp KislayNaturals sweetener",
      "1/2 cup almond milk"
    ]
  }
];

export default function Recipes() {
  return (
    <div className="w-full bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-700 mb-4">DELICIOUS SUGAR-FREE RECIPES 😋</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover tasty recipes made with KislayNaturals sweetener that are both healthy and satisfying.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50 hover:border-green-50"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                <Image 
                  src={recipe.image} 
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                <p className="text-gray-600 mb-4">{recipe.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1 text-green-600" />
                    <span>{recipe.prepTime}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1 text-green-600" />
                    <span>{recipe.servings} {recipe.servings > 1 ? 'servings' : 'serving'}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-1">•</span>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-100">
                  <span>View Full Recipe</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
