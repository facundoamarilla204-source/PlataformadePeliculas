const supabase = require('../config/supabase');

// Configuraciones por defecto
let inMemorySettings = {
  platform_name: 'CineMatch',
  logo_url: '/logo.svg',
  favicon_url: '/favicon.ico',
  seo_description: 'Disfruta de las mejores películas y estrenos cinematográficos en calidad HD y 4K sin interrupciones.',
  seo_keywords: 'cine, peliculas, streaming, series, estrenos, peliculas online',
  social_twitter: 'https://twitter.com/cinematch',
  social_instagram: 'https://instagram.com/cinematch',
  social_youtube: 'https://youtube.com/cinematch',
  social_discord: 'https://discord.gg/cinematch',
  google_analytics_id: 'G-XYZ1234567',
  maintenance_mode: false
};

const getSettings = async (req, res) => {
  try {
    const { data } = await supabase.from('settings').select('*').limit(1);
    if (data && data.length > 0) {
      return res.json(data[0]);
    }
    res.json(inMemorySettings);
  } catch (err) {
    res.json(inMemorySettings);
  }
};

const updateSettings = async (req, res) => {
  try {
    inMemorySettings = { ...inMemorySettings, ...req.body };
    const { data } = await supabase.from('settings').upsert([inMemorySettings]).select();
    if (data && data.length > 0) {
      return res.json(data[0]);
    }
    res.json(inMemorySettings);
  } catch (err) {
    res.json(inMemorySettings);
  }
};

module.exports = { getSettings, updateSettings };
