const axios = require('axios');
const supabase = require('../config/supabase');
const { decrypt } = require('../utils/encryption');

const testVimeus = async (req, res) => {
  try {
    let apiKey = process.env.VIMEUS_API_KEY;
    const { data } = await supabase.from('streaming_config').select('api_key_encrypted').eq('provider', 'vimeus').single();
    if (data && data.api_key_encrypted) {
      apiKey = decrypt(data.api_key_encrypted) || apiKey;
    }

    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'La API Key de Vimeus no está configurada.' });
    }

    // Probar un endpoint básico de Vimeus
    const response = await axios.get('https://api.vimeus.tv/v1/ping', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      },
      // Ignorar errores HTTP para manejarlos manualmente
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    if (response.status === 200 || response.data?.status === 'ok') {
      return res.json({ success: true, message: 'Conexión a Vimeus exitosa.' });
    } else {
      return res.status(400).json({ success: false, message: `Error en Vimeus: ${response.status} - ${response.statusText}` });
    }
  } catch (error) {
    console.error('Error probando Vimeus:', error.message);
    return res.status(500).json({ success: false, message: 'Fallo al intentar conectar con Vimeus.' });
  }
};

const testTmdb = async (req, res) => {
  try {
    let apiKey = process.env.TMDB_API_KEY;
    const { data } = await supabase.from('settings').select('setting_value').eq('setting_key', 'tmdb_api_key').single();
    if (data && data.setting_value) {
      apiKey = decrypt(data.setting_value) || apiKey;
    }

    if (!apiKey) {
      return res.status(400).json({ success: false, message: 'La API Key de TMDb no está configurada.' });
    }

    const response = await axios.get(`https://api.themoviedb.org/3/authentication`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      validateStatus: function (status) {
        return status >= 200 && status < 500;
      }
    });

    if (response.status === 200) {
      return res.json({ success: true, message: 'Conexión a TMDb exitosa.' });
    } else {
      return res.status(400).json({ success: false, message: 'Token de TMDb inválido o rechazado.' });
    }
  } catch (error) {
    console.error('Error probando TMDb:', error.message);
    return res.status(500).json({ success: false, message: 'Fallo al intentar conectar con TMDb.' });
  }
};

module.exports = { testVimeus, testTmdb };
