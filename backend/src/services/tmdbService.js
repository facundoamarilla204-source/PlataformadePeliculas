const axios = require('axios');

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.TMDB_API_KEY;

/**
 * Busca películas por nombre.
 */
const searchMovies = async (query) => {
  if (!TMDB_API_KEY) throw new Error('TMDB_API_KEY no configurada');
  
  try {
    const response = await axios.get(`${TMDB_API_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
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
  if (!TMDB_API_KEY) throw new Error('TMDB_API_KEY no configurada');

  try {
    const response = await axios.get(`${TMDB_API_URL}/movie/${tmdbId}`, {
      params: {
        api_key: TMDB_API_KEY,
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
