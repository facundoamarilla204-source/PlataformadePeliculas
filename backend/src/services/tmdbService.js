const axios = require('axios');

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const supabase = require('../config/supabase');
const { decrypt } = require('../utils/encryption');

let _tmdbApiKeyCache = null;
let _tmdbApiKeyCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

const getTmdbApiKey = async () => {
  const now = Date.now();
  if (_tmdbApiKeyCache && (now - _tmdbApiKeyCacheTime) < CACHE_TTL) {
    return _tmdbApiKeyCache;
  }
  
  try {
    const { data } = await supabase.from('settings').select('setting_value').eq('setting_key', 'tmdb_api_key').single();
    if (data && data.setting_value) {
      _tmdbApiKeyCache = decrypt(data.setting_value) || process.env.TMDB_API_KEY;
    } else {
      _tmdbApiKeyCache = process.env.TMDB_API_KEY;
    }
  } catch (error) {
    _tmdbApiKeyCache = process.env.TMDB_API_KEY;
  }
  
  _tmdbApiKeyCacheTime = now;
  return _tmdbApiKeyCache;
};

/**
 * Busca películas por nombre.
 */
const searchMovies = async (query) => {
  const apiKey = await getTmdbApiKey();
  if (!apiKey) throw new Error('TMDB_API_KEY no configurada');

  try {
    const response = await axios.get(`${TMDB_API_URL}/search/multi`, {
      params: {
        api_key: apiKey,
        query,
        language: 'es-ES'
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error buscando en TMDb:', error.message);
    throw error;
  }
};

/**
 * Obtiene los detalles completos de una película por su ID de TMDb, incluyendo reparto y trailers.
 */
const getMovieDetails = async (tmdbId) => {
  const apiKey = await getTmdbApiKey();
  if (!apiKey) throw new Error('TMDB_API_KEY no configurada');

  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${tmdbId}`, {
      params: {
        api_key: apiKey,
        language: 'es-ES',
        append_to_response: 'credits,videos'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error obteniendo detalles de película ${tmdbId} en TMDb:`, error.message);
    throw error;
  }
};

module.exports = {
  searchMovies,
  getMovieDetails
};
