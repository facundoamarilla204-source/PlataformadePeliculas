require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Faltan credenciales de Supabase en .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateSEO() {
  const seoSettings = {
    seo_title: 'CineMatch - Películas y Series Online en HD y 4K',
    seo_description: 'Disfruta de los mejores estrenos de películas y series online en máxima calidad HD y 4K. Explora nuestro catálogo premium y míralo todo sin interrupciones.',
    seo_keywords: 'ver películas online, series en español, estrenos HD, cine premium, streaming 4K, películas completas, CineMatch',
    seo_og_image: '/og-image.jpg',
    seo_canonical_url: 'https://cinematch.com',
    seo_sitemap: 'true'
  };

  try {
    for (const [key, value] of Object.entries(seoSettings)) {
      const { error } = await supabase
        .from('settings')
        .upsert({ setting_key: key, setting_value: String(value), updated_at: new Date() }, { onConflict: 'setting_key' });
      
      if (error) {
        console.error(`Error updating ${key}:`, error.message);
      } else {
        console.log(`Updated ${key} successfully.`);
      }
    }
    console.log('¡Configuración SEO actualizada con éxito!');
  } catch (err) {
    console.error('Execution error:', err);
  }
}

updateSEO();
