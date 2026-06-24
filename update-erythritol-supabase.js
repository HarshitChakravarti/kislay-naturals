const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function updateErythritol() {
  const { data: products, error: getErr } = await supabase
    .from('products')
    .select('*')
    .ilike('name', '%erythritol%');

  if (getErr) {
    console.error('Error getting product:', getErr);
    return;
  }

  const product = products[0];
  if (!product) {
    console.log('No erythritol product found');
    return;
  }

  const newImages = [
    "/erythritol/1.png",
    "/erythritol/400g.png",
    "/erythritol/2.png",
    "/erythritol/400g2.png",
    "/erythritol/3.png",
    "/erythritol/4.png",
    "/erythritol/5.png",
    "/erythritol/6.png",
    "/erythritol/7.png",
    "/erythritol/8.png"
  ];

  const { error: updateErr } = await supabase
    .from('products')
    .update({ images: newImages })
    .eq('id', product.id);

  if (updateErr) {
    console.error('Error updating product:', updateErr);
  } else {
    console.log('Successfully updated Erythritol images!');
  }
}

updateErythritol();
