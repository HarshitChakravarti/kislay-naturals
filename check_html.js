const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function check() {
  const { data, error } = await supabase.from('blogposts').select('content');
  if (error) console.error(error);
  else {
    let hasHtml = false;
    for (const post of data) {
      if (post.content && (post.content.includes('<table') || post.content.includes('<div') || post.content.includes('<span'))) {
        hasHtml = true;
        console.log("HTML found in slug:", post.slug || 'unknown');
      }
    }
    console.log("Has HTML:", hasHtml);
  }
}
check();
