const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('products').select('name, variants').ilike('name', '%allulose%').then(res => {
  console.log(JSON.stringify(res.data, null, 2));
}).catch(console.error);
