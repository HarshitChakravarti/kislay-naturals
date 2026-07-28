const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function updateRecipesSlugs() {
  const { data: recipes, error } = await supabase.from('recipes').select('id, title');
  if (error) {
    console.error("Error fetching recipes:", error);
    return;
  }
  
  console.log("Found recipes:", recipes.length);
  
  for (const recipe of recipes) {
    const slug = generateSlug(recipe.title);
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ slug })
      .eq('id', recipe.id);
      
    if (updateError) {
      console.error(`Error updating recipe ${recipe.id}:`, updateError.message);
    } else {
      console.log(`Updated recipe ${recipe.id} -> slug: ${slug}`);
    }
  }
}

updateRecipesSlugs();
