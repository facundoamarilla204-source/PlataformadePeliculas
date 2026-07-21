const tmdbService = require('../services/tmdbService');

const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: 'Se requiere un término de búsqueda' });
    
    const results = await tmdbService.searchMovies(query);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error comunicándose con TMDb' });
  }
};

const getDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const details = await tmdbService.getMovieDetails(id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo detalles de TMDb' });
  }
};

module.exports = { search, getDetails };
