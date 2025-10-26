import dotenv from 'dotenv';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

// Create Supabase admin client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env.local');
  console.error('Required variables:');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Blog posts data extracted from the existing blog structure
const blogPostsData = [
  {
    slug: 'monk-fruit-daily-uses',
    title: '7 Easy Ways to Use Monk Fruit Sweetener in Your Daily Diet',
    excerpt: 'Discover 7 simple ways to add monk fruit sweetener to your daily diet. Perfect for tea, coffee, desserts, and Indian recipes.',
    content: `If you're looking for a healthy alternative to sugar, monk fruit sweetener is becoming the top choice for health-conscious individuals in India. Unlike artificial sweeteners or refined sugar, monk fruit extract is 100% natural, zero-calorie, and diabetic-friendly.

## What is Monk Fruit Sweetener?

🍯 **Monk fruit**, also known as *luo han guo*, is a small fruit native to Southeast Asia. The extract from monk fruit is **150–200 times sweeter than sugar**, but without the calories.

## Health Benefits of Monk Fruit Sweetener

- 🎯 **Zero Calories** - Ideal for weight management
- 💚 **Safe for Diabetics** - No effect on blood sugar levels
- 🛡️ **Anti-inflammatory Properties** - Supports immunity
- 🌿 **No Artificial Chemicals** - Unlike aspartame or sucralose

## Why Choose Monk Fruit Sweetener Over Other Sugar Substitutes?

🍯 Compared to stevia or artificial sweeteners, monk fruit has a **clean, natural taste with no bitter aftertaste**. It's perfect for tea, coffee, desserts, and everyday cooking.

## Monk Fruit Sweetener in India – A Growing Trend

As more Indians shift towards healthy eating, monk fruit sweetener is becoming a popular choice for fitness enthusiasts, diabetics, and weight-watchers.

## Ready to Make the Switch?

👉 Switch to **Kislay Monk Fruit Sweetener** today for a healthier lifestyle!`,
    image: '/cover4.jpg',
    author: 'Kislay Naturals',
    category: 'Daily Living',
    read_time: '4 min read',
    published_at: '2025-10-14T00:00:00.000Z',
    meta_title: '7 Easy Ways to Use Monk Fruit Sweetener in Your Daily Diet | Kislay Naturals',
    meta_description: 'Discover 7 simple ways to add monk fruit sweetener to your daily diet. Perfect for tea, coffee, desserts, and Indian recipes.',
    meta_keywords: 'monk fruit sweetener daily uses, natural sweetener, healthy diet, sugar substitute',
    is_published: true
  },
  {
    slug: 'monk-fruit-weight-loss',
    title: 'How Monk Fruit Sweetener Supports Weight Loss Naturally',
    excerpt: 'Find out how monk fruit sweetener helps with weight loss. Zero calories, reduces cravings, and keeps you full without sugar spikes.',
    content: `Trying to lose weight but struggling with sugar cravings? You're not alone. One of the easiest lifestyle changes is switching from sugar to monk fruit sweetener.

## Why Sugar is a Barrier to Weight Loss

⚠️ Refined sugar adds empty calories, causes energy crashes, and increases fat storage. When you consume sugar, your blood glucose levels spike rapidly, triggering insulin release that promotes fat storage, especially around the midsection.

These sugar highs are inevitably followed by crashes that leave you feeling tired and craving more sugar, creating a vicious cycle that sabotages weight loss efforts.

## Benefits of Monk Fruit for Weight Loss

- 🎯 **Zero-Calorie Sweetness** - Enjoy without guilt - no extra calories
- 💪 **Reduces Cravings** - Prevents overeating and sugar addiction
- ⚡ **Stable Energy** - No sugar highs and lows
- 🔥 **Boosts Metabolism** - Natural fat burning support

## How to Add Monk Fruit to a Weight-Loss Diet

- ☕ **Replace Sugar in Tea/Coffee** - Start your morning right with zero calories
- 🍰 **Use in Baking and Smoothies** - Heat-stable for cooking and baking
- 🥣 **Sweeten Healthy Snacks** - Perfect for yogurt, oatmeal, and energy balls
- 💡 **Pro Tip** - Start gradually to let your taste buds adjust

## Making the Switch: Tips for Success

💡 When transitioning from sugar to monk fruit sweetener, start gradually. Replace sugar in one meal or beverage at a time to allow your taste buds to adjust. Most people find that monk fruit tastes very similar to sugar, making the transition much easier than with other sugar alternatives.

Remember, sustainable weight loss is about making small, consistent changes that you can maintain long-term. Switching to monk fruit sweetener is one simple change that can have a significant impact on your overall caloric intake and help you achieve your weight loss goals naturally.

## Ready to Start Your Weight Loss Journey?

👉 Try **Kislay's premium monk fruit sweetener** and experience the difference natural sweetness can make.`,
    image: '/herophoto2.png',
    author: 'Kislay Naturals',
    category: 'Weight Loss',
    read_time: '5 min read',
    published_at: '2025-10-02T00:00:00.000Z',
    meta_title: 'How Monk Fruit Sweetener Supports Weight Loss Naturally | Kislay Naturals',
    meta_description: 'Find out how monk fruit sweetener helps with weight loss. Zero calories, reduces cravings, and keeps you full without sugar spikes.',
    meta_keywords: 'monk fruit sweetener weight loss, zero calories, natural sweetener, sugar substitute, healthy weight management',
    is_published: true
  },
  {
    slug: 'monk-fruit-3',
    title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today',
    excerpt: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
    content: `Sugar is one of the biggest contributors to obesity, diabetes, and heart disease. If you're planning to quit sugar, monk fruit sweetener is your best option. Here's why:

## 1. Zero Calories, Zero Guilt

🎯 Enjoy sweetness without adding extra calories. Unlike sugar which contains 16 calories per teaspoon, monk fruit sweetener has **zero calories**, making it perfect for weight management and calorie-conscious individuals.

## 2. Perfect for Weight Loss

💪 Supports fat loss and reduces cravings. Monk fruit sweetener helps you maintain a calorie deficit while still satisfying your sweet tooth, making it easier to stick to your weight loss goals.

## 3. Diabetic-Friendly

🩺 Safe for diabetics and those monitoring blood sugar. Monk fruit sweetener doesn't raise blood glucose levels, making it an excellent choice for people with diabetes or pre-diabetes.

## 4. Natural and Chemical-Free

🌿 Unlike artificial sweeteners, monk fruit is completely natural. It's extracted from the monk fruit without any harmful chemicals or artificial processing.

## 5. No Bitter Aftertaste

😋 Monk fruit sweetener has a clean, sweet taste without the bitter aftertaste that some other natural sweeteners have. It's the closest thing to sugar without the negative health effects.

## Ready to Make the Switch?

👉 Try **Kislay Monk Fruit Sweetener** today and experience the difference natural sweetness can make in your life!`,
    image: '/mcover.png',
    author: 'Kislay Naturals',
    category: 'Health & Wellness',
    read_time: '6 min read',
    published_at: '2025-09-14T00:00:00.000Z',
    meta_title: '5 Reasons to Switch from Sugar to Monk Fruit Sweetener Today | Kislay Naturals',
    meta_description: 'Thinking of quitting sugar? Here are 5 powerful reasons why monk fruit sweetener is the healthiest sugar replacement for your daily lifestyle.',
    meta_keywords: 'monk fruit sweetener benefits, quit sugar, natural sweetener, healthy lifestyle, sugar substitute',
    is_published: true
  },
  {
    slug: 'monk-fruit-2',
    title: 'Is Monk Fruit Sweetener Good for Diabetics?',
    excerpt: 'Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.',
    content: `If you have diabetes, finding safe sweeteners is crucial for managing your blood sugar levels. Monk fruit sweetener is one of the best options available. Here's why:

## What Makes Monk Fruit Safe for Diabetics?

🩺 Monk fruit sweetener has **zero sugar, zero carbs, and zero calories**, making it completely safe for diabetics. It doesn't raise blood glucose levels or trigger insulin responses.

## Scientific Evidence

📊 Studies have shown that monk fruit extract doesn't affect blood sugar levels, making it safe for people with diabetes, pre-diabetes, or those following a low-carb diet.

## Benefits for Diabetic Management

- 🎯 **Zero Glycemic Impact** - No effect on blood sugar levels
- 💚 **Natural Sweetness** - Satisfies sweet cravings without health risks
- 🛡️ **No Artificial Chemicals** - Unlike some artificial sweeteners
- 🌿 **Anti-inflammatory Properties** - May help with overall health

## How to Use Monk Fruit Sweetener Safely

- ☕ **In Beverages** - Perfect for tea, coffee, and smoothies
- 🍰 **In Baking** - Heat-stable and works great in recipes
- 🥣 **In Cooking** - Use in sauces, marinades, and dressings
- 💡 **Start Small** - Begin with small amounts and adjust to taste

## Consultation with Healthcare Provider

Always consult with your healthcare provider before making significant changes to your diet, especially if you have diabetes or other health conditions.

## Ready to Try Monk Fruit Sweetener?

👉 **Kislay Monk Fruit Sweetener** offers a safe, natural way to enjoy sweetness without compromising your health goals.`,
    image: '/herophoto.png',
    author: 'Kislay Naturals',
    category: 'Health & Diabetes',
    read_time: '4 min read',
    published_at: '2025-09-09T00:00:00.000Z',
    meta_title: 'Is Monk Fruit Sweetener Good for Diabetics? | Kislay Naturals',
    meta_description: 'Find out why monk fruit sweetener is safe for diabetics. Zero sugar, zero carbs, and a natural way to sweeten food without raising blood sugar levels.',
    meta_keywords: 'monk fruit sweetener diabetics, diabetic friendly, zero sugar, blood sugar, natural sweetener',
    is_published: true
  },
  {
    slug: 'monk-fruit-1',
    title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India',
    excerpt: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
    content: `If you're looking for a healthy alternative to sugar, monk fruit sweetener is becoming the top choice for health-conscious individuals in India. Unlike artificial sweeteners or refined sugar, monk fruit extract is 100% natural, zero-calorie, and diabetic-friendly.

## What is Monk Fruit Sweetener?

🍯 **Monk fruit**, also known as *luo han guo*, is a small fruit native to Southeast Asia. The extract from monk fruit is **150–200 times sweeter than sugar**, but without the calories.

## Health Benefits of Monk Fruit Sweetener

- 🎯 **Zero Calories** - Ideal for weight management
- 💚 **Safe for Diabetics** - No effect on blood sugar levels
- 🛡️ **Anti-inflammatory Properties** - Supports immunity
- 🌿 **No Artificial Chemicals** - Unlike aspartame or sucralose

## Why Choose Monk Fruit Sweetener Over Other Sugar Substitutes?

🍯 Compared to stevia or artificial sweeteners, monk fruit has a **clean, natural taste with no bitter aftertaste**. It's perfect for tea, coffee, desserts, and everyday cooking.

## Monk Fruit Sweetener in India – A Growing Trend

As more Indians shift towards healthy eating, monk fruit sweetener is becoming a popular choice for fitness enthusiasts, diabetics, and weight-watchers.

## Ready to Make the Switch?

👉 Switch to **Kislay Monk Fruit Sweetener** today for a healthier lifestyle!`,
    image: '/cover3.jpg',
    author: 'Kislay Naturals',
    category: 'Health & Nutrition',
    read_time: '5 min read',
    published_at: '2025-08-24T00:00:00.000Z',
    meta_title: 'Why Monk Fruit Sweetener is the Best Natural Sugar Substitute in India | Kislay Naturals',
    meta_description: 'Discover why monk fruit sweetener is the healthiest sugar alternative in India. Zero calories, diabetic-friendly, and perfect for weight management.',
    meta_keywords: 'monk fruit sweetener India, natural sugar substitute, zero calorie sweetener, diabetic friendly, healthy sweetener',
    is_published: true
  }
];

// Recipes data extracted from the existing recipe structure
const recipesData = [
  {
    title: "Sugar-Free Lemonade",
    description: "Refreshing lemonade sweetened naturally with Kislay Monk Fruit Sweetener",
    prep_time: "5 mins",
    cook_time: "0 mins",
    total_time: "5 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe1.jpg",
    ingredients: [
      "2 cups water",
      "4 tbsp lemon juice",
      "2 drops Kislay Monk Fruit Sweetener",
      "Ice cubes",
      "Mint leaves for garnish"
    ],
    instructions: [
      "Fill a large pitcher with 2 cups of cold water",
      "Add 4 tablespoons of fresh lemon juice to the water",
      "Add 2 drops of Kislay Monk Fruit Sweetener and stir well",
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
      "Adjust the amount of Kislay Monk Fruit Sweetener based on your sweetness preference",
      "Add a pinch of salt to enhance the lemon flavor",
      "For a sparkling version, use sparkling water instead of still water"
    ],
    author: "Kislay Naturals",
    is_published: true
  },
  {
    title: "Healthy Oatmeal",
    description: "Warm and comforting oatmeal with natural sweetness",
    prep_time: "5 mins",
    cook_time: "5 mins",
    total_time: "10 mins",
    servings: 1,
    difficulty: "Easy",
    image: "/oatmeal.jpg",
    ingredients: [
      "1/2 cup rolled oats",
      "1 cup almond milk",
      "2 drops Kislay Monk Fruit Sweetener",
      "1/2 tsp cinnamon",
      "Handful of berries"
    ],
    instructions: [
      "In a small saucepan, combine rolled oats and almond milk",
      "Bring to a gentle boil over medium heat, stirring occasionally",
      "Reduce heat to low and simmer for 3-4 minutes until oats are tender",
      "Remove from heat and add Kislay Monk Fruit Sweetener",
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
    ],
    author: "Kislay Naturals",
    is_published: true
  },
  {
    title: "Fruit Smoothie",
    description: "Creamy fruit smoothie with zero added sugar",
    prep_time: "7 mins",
    cook_time: "0 mins",
    total_time: "7 mins",
    servings: 2,
    difficulty: "Easy",
    image: "/recipe3.jpg",
    ingredients: [
      "1 banana",
      "1 cup mixed berries",
      "1/2 cup Greek yogurt",
      "1/2 cup almond milk",
      "2 drops Kislay Monk Fruit Sweetener",
      "1 tbsp chia seeds"
    ],
    instructions: [
      "Add all ingredients to a blender",
      "Blend on high speed for 1-2 minutes until smooth",
      "Taste and adjust sweetness if needed",
      "Pour into glasses and serve immediately",
      "Garnish with fresh berries if desired"
    ],
    nutrition: {
      calories: 120,
      sugar: 0,
      carbs: 20,
      protein: 6,
      fat: 2
    },
    tips: [
      "Use frozen fruit for a thicker, colder smoothie",
      "Add spinach for extra nutrients without changing the taste",
      "Experiment with different fruit combinations",
      "Store in the refrigerator for up to 24 hours"
    ],
    author: "Kislay Naturals",
    is_published: true
  },
  {
    title: "Chia Pudding",
    description: "Protein-packed chia pudding with natural sweetness",
    prep_time: "5 mins + chilling",
    cook_time: "0 mins",
    total_time: "5 mins + chilling",
    servings: 2,
    difficulty: "Easy",
    image: "/chiapudding.jpg",
    ingredients: [
      "1/4 cup chia seeds",
      "1 cup almond milk",
      "2 drops Kislay Monk Fruit Sweetener",
      "1/2 tsp vanilla extract",
      "Fresh berries for topping"
    ],
    instructions: [
      "In a bowl, whisk together almond milk, Kislay Monk Fruit Sweetener, and vanilla extract",
      "Add chia seeds and stir well to combine",
      "Let sit for 5 minutes, then stir again to prevent clumping",
      "Cover and refrigerate for at least 2 hours or overnight",
      "Stir before serving and top with fresh berries",
      "Enjoy chilled!"
    ],
    nutrition: {
      calories: 150,
      sugar: 0,
      carbs: 12,
      protein: 6,
      fat: 8
    },
    tips: [
      "Let it sit overnight for the best texture",
      "Add cocoa powder for a chocolate version",
      "Top with nuts or granola for extra crunch",
      "Make multiple servings and store in the refrigerator"
    ],
    author: "Kislay Naturals",
    is_published: true
  },
  {
    title: "Sugar-Free Iced Tea",
    description: "Refreshing iced tea with a hint of natural sweetness",
    prep_time: "10 mins",
    cook_time: "0 mins",
    total_time: "10 mins",
    servings: 4,
    difficulty: "Easy",
    image: "/icedtea.jpg",
    ingredients: [
      "4 cups water",
      "4 tea bags (black or green tea)",
      "3 drops Kislay Monk Fruit Sweetener",
      "Lemon slices",
      "Fresh mint leaves",
      "Ice cubes"
    ],
    instructions: [
      "Bring water to a boil in a saucepan",
      "Remove from heat and add tea bags",
      "Let steep for 5-7 minutes",
      "Remove tea bags and let cool to room temperature",
      "Add Kislay Monk Fruit Sweetener and stir well",
      "Refrigerate for at least 1 hour",
      "Serve over ice with lemon slices and mint leaves"
    ],
    nutrition: {
      calories: 5,
      sugar: 0,
      carbs: 1,
      protein: 0,
      fat: 0
    },
    tips: [
      "Use high-quality tea for the best flavor",
      "Adjust sweetness to your preference",
      "Add fruit slices for extra flavor",
      "Store in the refrigerator for up to 3 days"
    ],
    author: "Kislay Naturals",
    is_published: true
  },
  {
    title: "Protein Pancakes",
    description: "Fluffy pancakes with no added sugar",
    prep_time: "10 mins",
    cook_time: "5 mins",
    total_time: "15 mins",
    servings: 2,
    difficulty: "Medium",
    image: "/pancakes.jpg",
    ingredients: [
      "1 banana (mashed)",
      "2 eggs",
      "1/2 cup oats",
      "1 scoop protein powder",
      "2 drops Kislay Monk Fruit Sweetener",
      "1/2 tsp baking powder",
      "1/4 tsp vanilla extract"
    ],
    instructions: [
      "In a large bowl, mash the banana until smooth",
      "Add eggs and whisk until well combined",
      "Add oats, protein powder, and baking powder",
      "Mix in Kislay Monk Fruit Sweetener and vanilla extract",
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
    ],
    author: "Kislay Naturals",
    is_published: true
  }
];

export async function migrateBlogPosts() {
  console.log('Starting blog posts migration...');
  
  for (const blogPost of blogPostsData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('blogposts')
        .insert(blogPost)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting blog post ${blogPost.slug}:`, error);
      } else {
        console.log(`✅ Successfully migrated blog post: ${blogPost.title}`);
      }
    } catch (error) {
      console.error(`Error migrating blog post ${blogPost.slug}:`, error);
    }
  }
  
  console.log('Blog posts migration completed!');
}

export async function migrateRecipes() {
  console.log('Starting recipes migration...');
  
  for (const recipe of recipesData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

      if (error) {
        console.error(`Error inserting recipe ${recipe.title}:`, error);
      } else {
        console.log(`✅ Successfully migrated recipe: ${recipe.title}`);
      }
    } catch (error) {
      console.error(`Error migrating recipe ${recipe.title}:`, error);
    }
  }
  
  console.log('Recipes migration completed!');
}

export async function migrateAllContent() {
  console.log('Starting content migration...');
  await migrateBlogPosts();
  await migrateRecipes();
  console.log('All content migration completed!');
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateAllContent().catch(console.error);
}
