"use client";

import { useRef } from "react";
import Image from "next/image";
import { Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";

const recipes = [
  {
    id: 1,
    title: "Sugar-Free Lemonade",
    prepTime: "5 mins",
    servings: 2,
    image: "/recipe1.jpg",
    description: "Refreshing lemonade sweetened naturally with KislayNaturals",
    ingredients: [
      "2 cups water",
      "4 tbsp lemon juice",
      "2 drops KislayNaturals sweetener",
      "Ice cubes",
      "Mint leaves for garnish"
    ]
  },
  {
    id: 2,
    title: "Healthy Oatmeal",
    prepTime: "10 mins",
    servings: 1,
    image: "/oatmeal.jpg",
    description: "Warm and comforting oatmeal with natural sweetness",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup almond milk",
      "2 drops KislayNaturals sweetener",
      "1/2 tsp cinnamon",
      "Handful of berries"
    ]
  },
  {
    id: 3,
    title: "Fruit Smoothie",
    prepTime: "7 mins",
    servings: 2,
    image: "/recipe3.jpg",
    description: "Creamy fruit smoothie with zero added sugar",
    ingredients: [
      "1 banana",
      "1/2 cup Greek yogurt",
      "1/2 cup mixed berries",
      "2 drops KislayNaturals sweetener",
      "1/2 cup almond milk"
    ]
  },
  {
    id: 4,
    title: "Chia Pudding",
    prepTime: "5 mins + chilling",
    servings: 2,
    image: "/chiapudding.jpg",
    description: "Protein-packed chia pudding with natural sweetness",
    ingredients: [
      "1/4 cup chia seeds",
      "1 cup almond milk",
      "3 drops KislayNaturals sweetener",
      "1/2 tsp vanilla extract",
      "Fresh fruits for topping"
    ]
  },
  {
    id: 5,
    title: "Sugar-Free Iced Tea",
    prepTime: "10 mins",
    servings: 4,
    image: "/icedtea.jpg",
    description: "Refreshing iced tea with a hint of natural sweetness",
    ingredients: [
      "4 cups water",
      "4 tea bags (black or green)",
      "3 drops KislayNaturals sweetener",
      "Lemon slices and mint for garnish",
      "Ice cubes"
    ]
  },
  {
    id: 6,
    title: "Protein Pancakes",
    prepTime: "15 mins",
    servings: 2,
    image: "/pancakes.jpg",
    description: "Fluffy pancakes with no added sugar",
    ingredients: [
      "1 banana (mashed)",
      "2 eggs",
      "1/2 cup oats",
      "1 scoop protein powder",
      "2 drops KislayNaturals sweetener"
    ]
  }
];

export default function Recipes() {
  const scrollContainer = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: -300, // Adjust scroll amount as needed
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainer.current) {
      scrollContainer.current.scrollBy({
        left: 300, // Adjust scroll amount as needed
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header with green background and gradient shadow */}
      <div className="relative bg-green-700 text-white py-12 w-full overflow-hidden">
        {/* Gradient shadow at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/10 to-transparent z-0"></div>
        
        {/* Content layer */}
        <div className="relative z-10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-transparent bg-clip-text">
                  DELICIOUS SUGAR-FREE RECIPES
                </span>
                {' \u{1F60B}'}
              </h2>
              <p className="text-lg font-medium text-white/90 max-w-2xl mx-auto">
                Discover tasty recipes made with KislayNaturals sweetener that are both healthy and satisfying.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative">
          <button 
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors"
            aria-label="Previous recipe"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <div 
            ref={scrollContainer}
            className="flex space-x-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {recipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-50 hover:border-green-50 flex-shrink-0 w-80 snap-center"
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
          
          <button 
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-50 transition-colors"
            aria-label="Next recipe"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
