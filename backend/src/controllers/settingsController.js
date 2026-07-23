const supabase = require('../config/supabase');
const { encrypt } = require('../utils/encryption');

// Configuraciones por defecto
const defaultSettings = {
  platform_name: 'CineMatch',
  platform_description: 'Plataforma de streaming de películas y series.',
  platform_url: 'https://cinematch.com',
  logo_url: '/logo.svg',
  logo_dark_url: '/logo-dark.svg',
  favicon_url: '/favicon.ico',
  language: 'es-ES',
  timezone: 'America/Argentina/Buenos_Aires',
  maintenance_mode: 'false',
  maintenance_message: 'Estamos realizando tareas de mantenimiento. Volveremos pronto.',
  
  // SEO
  seo_title: 'CineMatch - Películas y Series en HD',
  seo_description: 'Disfruta de las mejores películas y estrenos cinematográficos en calidad HD y 4K sin interrupciones.',
  seo_keywords: 'cine, peliculas, streaming, series, estrenos, peliculas online',
  seo_og_image: '/og-image.jpg',
  seo_robots: 'index, follow',
  seo_canonical_url: 'https://cinematch.com',
  google_analytics_id: '',
  google_search_console_id: '',
  auto_sitemap: 'true',
  
  // Redes
  social_twitter: 'https://twitter.com/cinematch',
  social_instagram: 'https://instagram.com/cinematch',
  social_youtube: 'https://youtube.com/cinematch',
  social_discord: 'https://discord.gg/cinematch',
  
  // Apariencia
  theme_mode: 'dark', // light, dark, auto
  color_primary: '#e50914',
  color_secondary: '#1f2937',
  color_button: '#e50914',
  color_background: '#030712',
  home_bg_image: '',
  
  // Integraciones (Las API keys se mantienen en BD encriptadas)
  tmdb_api_key: '',
};

const getSettings = async (req, res) => {
  try {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) throw error;

    let settings = { ...defaultSettings };
    if (data && data.length > 0) {
      data.forEach(row => {
        // Parse booleans correctly if needed
        let value = row.setting_value;
        if (value === 'true') value = true;
        else if (value === 'false') value = false;
        
        if (row.setting_key === 'tmdb_api_key' && value) {
          // Si está configurada, enviamos un string con asteriscos para no exponerla
          settings[row.setting_key] = '********' + value.slice(-4);
        } else {
          settings[row.setting_key] = value;
        }
      });
    }
    res.json(settings);
  } catch (err) {
    console.error('Error in getSettings:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const updates = req.body;
    
    // Preparar el array para upsert
    const upsertData = [];
    for (const key of Object.keys(updates)) {
      let value = typeof updates[key] === 'boolean' ? String(updates[key]) : updates[key] || '';
      
      // Manejar la encriptación de tmdb_api_key
      if (key === 'tmdb_api_key') {
        if (!value) continue; // Si enviaron vacío, no hacemos nada o tal vez quieren borrar?
        if (value.includes('********')) continue; // No sobreescribir con el placeholder
        value = encrypt(value);
      }
      
      upsertData.push({
        setting_key: key,
        setting_value: value
      });
    }

    const { data, error } = await supabase
      .from('settings')
      .upsert(upsertData, { onConflict: 'setting_key' })
      .select();

    if (error) throw error;
    
    res.json({ success: true, message: 'Settings updated' });
  } catch (err) {
    console.error('Error in updateSettings:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSettings, updateSettings };
