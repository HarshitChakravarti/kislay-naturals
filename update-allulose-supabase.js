const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateAllulose() {
  // 1. Get current data
  const { data: products, error: getErr } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%allulose%');

  if (getErr) {
    console.error('Error getting product:', getErr);
    return;
  }

  const product = products[0];
  if (!product) {
    console.log('No allulose product found');
    return;
  }

  console.log('Current images:', product.images);
  console.log('Current variants:', JSON.stringify(product.variants, null, 2));

  // 2. We want to add /allulose/200g1.png and /allulose/200g2.png
  // And maybe remove /allulose/1.png if it is replaced, but let's just add the new ones 
  // and remove 1.png from the array to be clean.
  
  const newImages = [
    "/allulose/200g1.png",
    "/allulose/200g2.png",
    "/allulose/400g.png",
    "/allulose/2.png",
    "/allulose/3.png",
    "/allulose/4.png",
    "/allulose/5.png",
    "/allulose/6.png",
    "/allulose/7.png"
  ];

  // 3. Update the 200gm variant image to /allulose/200g1.png
  const newVariants = product.variants.map(v => {
    if (v.size.includes('200')) {
      return { ...v, image: '/allulose/200g1.png' };
    }
    return v;
  });

  const { error: updateErr } = await supabase
    .from('products')
    .update({ images: newImages, variants: newVariants })
    .eq('id', product.id);

  if (updateErr) {
    console.error('Error updating product:', updateErr);
  } else {
    console.log('Successfully updated product!');
  }
}

updateAllulose();
