import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Users, ChefHat, ArrowLeft, Share2, Heart } from 'lucide-react';
import { Yeseva_One } from 'next/font/google';
import Link from 'next/link';

const yeseva_One = Yeseva_One({
  weight: '400',
  subsets: ['latin'],
});

// Enhanced recipe data with detailed instructions
const recipes = [
  {
    id: 1,
    title: "Sugar-Free Lemonade",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe1.jpg",
    description: "Refreshing lemonade sweetened naturally with KislayNaturals",
    ingredients: [
      "2 cups water",
      "4 tbsp lemon juice",
      "2 drops KislayNaturals sweetener",
      "Ice cubes",
      "Mint leaves for garnish"
    ],
    instructions: [
      "Fill a large pitcher with 2 cups of cold water",
      "Add 4 tablespoons of fresh lemon juice to the water",
      "Add 2 drops of KislayNaturals sweetener and stir well",
      "Taste and adjust sweetness if needed",
      "Add ice cubes to serving glasses",
      "Pour the lemonade over ice and garnish with fresh mint leaves",
      "Serve immediately and enjoy!"
    ],
    nutrition: {
      calories: 15,
      sugar: 0,
      carbs: 4,
      protein: 0,
      fat: 0
    },
    tips: [
      "Use fresh lemon juice for the best flavor",
      "Adjust the amount of KislayNaturals based on your sweetness preference",
      "Add a pinch of salt to enhance the lemon flavor",
      "For a sparkling version, use sparkling water instead of still water"
    ]
  },
  {
    id: 2,
    title: "Healthy Oatmeal",
    prepTime: "5 mins",
    cookTime: "5 mins",
    totalTime: "10 mins",
    servings: 1,
    difficulty: "Easy",
    image: "/oatmeal.jpg",
    description: "Warm and comforting oatmeal with natural sweetness",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup almond milk",
      "2 drops KislayNaturals sweetener",
      "1/2 tsp cinnamon",
      "Handful of berries"
    ],
    instructions: [
      "In a small saucepan, combine rolled oats and almond milk",
      "Bring to a gentle boil over medium heat, stirring occasionally",
      "Reduce heat to low and simmer for 3-4 minutes until oats are tender",
      "Remove from heat and add KislayNaturals sweetener",
      "Stir in cinnamon and mix well",
      "Transfer to a bowl and top with fresh berries",
      "Serve warm and enjoy!"
    ],
    nutrition: {
      calories: 180,
      sugar: 0,
      carbs: 35,
      protein: 8,
      fat: 3
    },
    tips: [
      "Use old-fashioned rolled oats for the best texture",
      "Add nuts or seeds for extra protein and crunch",
      "Top with your favorite fruits for variety",
      "Make it overnight by mixing ingredients and refrigerating overnight"
    ]
  },
  {
    id: 3,
    title: "Fruit Smoothie",
    prepTime: "7 mins",
    cookTime: "0 mins",
    totalTime: "7 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe3.jpg",
    description: "Creamy fruit smoothie with zero added sugar",
    ingredients: [
      "1 banana",
      "1/2 cup Greek yogurt",
      "1/2 cup mixed berries",
      "2 drops KislayNaturals sweetener",
      "1/2 cup almond milk"
    ],
    instructions: [
      "Peel and slice the banana into chunks",
      "Add banana, Greek yogurt, and mixed berries to a blender",
      "Pour in almond milk and add KislayNaturals sweetener",
      "Blend on high speed for 30-45 seconds until smooth",
      "Taste and adjust sweetness if needed",
      "Pour into glasses and serve immediately",
      "Garnish with fresh berries if desired"
    ],
    nutrition: {
      calories: 120,
      sugar: 0,
      carbs: 25,
      protein: 8,
      fat: 2
    },
    tips: [
      "Use frozen fruit for a thicker, colder smoothie",
      "Add spinach or kale for extra nutrients without changing the taste",
      "Freeze banana chunks for a creamier texture",
      "Experiment with different fruit combinations"
    ]
  },
  {
    id: 4,
    title: "Chia Pudding",
    prepTime: "5 mins",
    cookTime: "0 mins",
    totalTime: "5 mins + chilling",
    servings: 2,
    difficulty: "Easy",
    image: "/chiapudding.jpg",
    description: "Protein-packed chia pudding with natural sweetness",
    ingredients: [
      "1/4 cup chia seeds",
      "1 cup almond milk",
      "3 drops KislayNaturals sweetener",
      "1/2 tsp vanilla extract",
      "Fresh fruits for topping"
    ],
    instructions: [
      "In a bowl, combine chia seeds and almond milk",
      "Add KislayNaturals sweetener and vanilla extract",
      "Whisk vigorously for 2-3 minutes to prevent clumping",
      "Let the mixture sit for 5 minutes, then whisk again",
      "Cover and refrigerate for at least 2 hours or overnight",
      "Stir well before serving",
      "Top with fresh fruits and enjoy!"
    ],
    nutrition: {
      calories: 140,
      sugar: 0,
      carbs: 12,
      protein: 6,
      fat: 8
    },
    tips: [
      "Whisk frequently during the first 10 minutes to prevent clumping",
      "The pudding will thicken as it sits in the refrigerator",
      "Add cocoa powder for a chocolate version",
      "Layer with different fruits for a parfait effect"
    ]
  },
  {
    id: 5,
    title: "Sugar-Free Iced Tea",
    prepTime: "10 mins",
    cookTime: "0 mins",
    totalTime: "10 mins",
    servings: 4,
    difficulty: "Easy",
    image: "/icedtea.jpg",
    description: "Refreshing iced tea with a hint of natural sweetness",
    ingredients: [
      "4 cups water",
      "4 tea bags (black or green)",
      "3 drops KislayNaturals sweetener",
      "Lemon slices and mint for garnish",
      "Ice cubes"
    ],
    instructions: [
      "Bring 4 cups of water to a boil in a large pot",
      "Remove from heat and add tea bags",
      "Let steep for 5-7 minutes depending on desired strength",
      "Remove tea bags and let cool to room temperature",
      "Add KislayNaturals sweetener and stir well",
      "Refrigerate for at least 1 hour to chill",
      "Serve over ice with lemon slices and mint garnish"
    ],
    nutrition: {
      calories: 5,
      sugar: 0,
      carbs: 1,
      protein: 0,
      fat: 0
    },
    tips: [
      "Use high-quality tea bags for the best flavor",
      "Adjust steeping time based on your preference",
      "Add fresh herbs like mint or basil for extra flavor",
      "Make a large batch and store in the refrigerator for up to 3 days"
    ]
  },
  {
    id: 6,
    title: "Protein Pancakes",
    prepTime: "10 mins",
    cookTime: "5 mins",
    totalTime: "15 mins",
    servings: 2,
    difficulty: "Medium",
    image: "/pancakes.jpg",
    description: "Fluffy pancakes with no added sugar",
    ingredients: [
      "1 banana (mashed)",
      "2 eggs",
      "1/2 cup oats",
      "1 scoop protein powder",
      "2 drops KislayNaturals sweetener",
      "1/2 tsp baking powder",
      "1/4 tsp vanilla extract"
    ],
    instructions: [
      "In a large bowl, mash the banana until smooth",
      "Add eggs and whisk until well combined",
      "Add oats, protein powder, and baking powder",
      "Mix in KislayNaturals sweetener and vanilla extract",
      "Let the batter rest for 5 minutes",
      "Heat a non-stick pan over medium heat",
      "Pour 1/4 cup batter for each pancake",
      "Cook for 2-3 minutes until bubbles form on top",
      "Flip and cook for another 1-2 minutes",
      "Serve warm with your favorite toppings"
    ],
    nutrition: {
      calories: 220,
      sugar: 0,
      carbs: 25,
      protein: 18,
      fat: 6
    },
    tips: [
      "Let the batter rest to allow oats to soften",
      "Use a non-stick pan or add a little oil to prevent sticking",
      "Don't flip too early - wait for bubbles to form",
      "Top with fresh berries and a drizzle of sugar-free syrup"
    ]
  }
];

// Generate static params for all recipes
export async function generateStaticParams() {
  return recipes.map((recipe) => ({
    id: recipe.id.toString(),
  }));
}

// Get recipe by ID
function getRecipeById(id: string) {
  const recipe = recipes.find(r => r.id.toString() === id);
  return recipe || null;
}

interface PageProps {
  params: {
    id: string;
  };
}

export default function RecipePage({ params }: PageProps) {
  const recipe = getRecipeById(params.id);

  if (!recipe) {
    notFound();
  }

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
            src={recipe.image}
            alt={recipe.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
              <h1 className={`text-3xl md:text-5xl font-bold text-white mb-4 ${yeseva_One.className}`}>
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
              <h3 className={`text-2xl font-bold text-gray-900 mb-6 ${yeseva_One.className}`}>
                Recipe Info
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Prep Time</p>
                    <p className="font-semibold">{recipe.prepTime}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <ChefHat className="w-5 h-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-gray-600">Cook Time</p>
                    <p className="font-semibold">{recipe.cookTime}</p>
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
              <div className="mt-8">
                <h4 className="font-semibold text-gray-900 mb-4">Nutrition (per serving)</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Calories</p>
                    <p className="font-bold text-green-600">{recipe.nutrition.calories}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Sugar</p>
                    <p className="font-bold text-green-600">{recipe.nutrition.sugar}g</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Carbs</p>
                    <p className="font-bold text-green-600">{recipe.nutrition.carbs}g</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-gray-600">Protein</p>
                    <p className="font-bold text-green-600">{recipe.nutrition.protein}g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recipe Content */}
          <div className="lg:col-span-2">
            {/* Ingredients */}
            <div className="mb-8">
              <h2 className={`text-3xl font-bold text-gray-900 mb-6 ${yeseva_One.className}`}>
                Ingredients
              </h2>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
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
              <h2 className={`text-3xl font-bold text-gray-900 mb-6 ${yeseva_One.className}`}>
                Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                      {index + 1}
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 leading-relaxed">{instruction}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="mb-8">
              <h2 className={`text-3xl font-bold text-gray-900 mb-6 ${yeseva_One.className}`}>
                Pro Tips
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <ul className="space-y-3">
                  {recipe.tips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-3 mt-1">💡</span>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <h3 className={`text-2xl font-bold text-gray-900 mb-4 ${yeseva_One.className}`}>
                Made with KislayNaturals
              </h3>
              <p className="text-gray-600 mb-6">
                Get the same natural sweetness in your own kitchen with our monk fruit sweetener drops.
              </p>
              <Link 
                href="/products"
                className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Shop KislayNaturals
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
