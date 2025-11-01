import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials in .env.local')
  console.error('Required variables:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addPhotosColumn() {
  try {
    console.log('Adding photos column to reviews table...')
    
    // Use the Supabase REST API to run SQL
    const { data, error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        -- Add photos column if it doesn't exist
        ALTER TABLE reviews 
        ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT NULL;
        
        -- Add comment
        COMMENT ON COLUMN reviews.photos IS 'Array of photo URLs for review images';
      `
    })

    if (error) {
      // If RPC doesn't work, try direct SQL via PostgREST won't work
      // Instead, provide manual SQL
      console.log('\n⚠️  Automatic column addition failed.')
      console.log('Please run this SQL in your Supabase SQL Editor:')
      console.log('\n' + '='.repeat(60))
      console.log('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT NULL;')
      console.log('='.repeat(60) + '\n')
      
      // Try alternative: check if column exists first
      const { data: columns, error: checkError } = await supabaseAdmin
        .from('reviews')
        .select('photos')
        .limit(1)
      
      if (checkError && checkError.message?.includes('photos')) {
        console.log('Column does not exist. Please add it manually using the SQL above.')
      } else {
        console.log('✅ Column might already exist or was added successfully!')
      }
      return
    }

    console.log('✅ Successfully added photos column to reviews table!')
  } catch (error: any) {
    console.error('Error:', error.message)
    console.log('\n⚠️  Please manually run this SQL in your Supabase SQL Editor:')
    console.log('\n' + '='.repeat(60))
    console.log('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT NULL;')
    console.log('='.repeat(60) + '\n')
  }
}

addPhotosColumn()

