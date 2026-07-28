import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';

// GET /api/recipes - Get all published recipes
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (difficulty) {
      query = query.eq('difficulty', difficulty);
    }

    const { data: recipes, error } = await query;

    if (error) {
      console.error('Error fetching recipes:', error);
      return NextResponse.json({ error: 'Failed to fetch recipes' }, { status: 500 });
    }

    return NextResponse.json({ recipes });
  } catch (error) {
    console.error('Error in GET /api/recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/recipes - Create a new recipe
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  try {
    const body = await request.json();
    const {
      title,
      description,
      prep_time,
      cook_time,
      total_time,
      servings,
      difficulty,
      image,
      ingredients = [],
      instructions = [],
      nutrition,
      tips = [],
      author = 'Kislay Naturals',
      is_published = true
    } = body;

    // Validate required fields
    if (!title || !ingredients.length || !instructions.length) {
      return NextResponse.json(
        { error: 'Missing required fields: title, ingredients, instructions' },
        { status: 400 }
      );
    }

    const { data: recipe, error } = await supabaseAdmin
      .from('recipes')
      .insert({
        title,
        description,
        prep_time,
        cook_time,
        total_time,
        servings,
        difficulty,
        image,
        ingredients,
        instructions,
        nutrition,
        tips,
        author,
        is_published
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating recipe:', error);
      return NextResponse.json({ error: 'Failed to create recipe' }, { status: 500 });
    }

    return NextResponse.json({ recipe }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/recipes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
