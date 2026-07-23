const videoProviderService = require('../services/VideoProviderService');
const { encrypt } = require('../utils/encryption');

/**
 * GET /api/streaming/config
 * Obtiene la configuración del proveedor (sin exponer API Keys completas).
 */
const getConfig = async (req, res) => {
  try {
    const providerName = req.query.provider || 'vimeus';
    const config = await videoProviderService.getProviderConfig(providerName);

    if (!config) {
      return res.json({
        provider: providerName,
        is_active: false,
        api_key_hint: null,
        view_key_hint: null,
        domain: null,
        last_test_at: null,
        last_test_result: null
      });
    }

    // Nunca enviar credenciales completas al frontend
    res.json({
      provider: config.provider,
      is_active: config.is_active,
      domain: config.domain || '',
      api_key_hint: config.api_key_encrypted ? `****${config.api_key_encrypted.slice(-4)}` : '',
      view_key_hint: config.view_key ? `****${config.view_key.slice(-4)}` : '',
      last_test_at: config.last_test_at,
      last_test_result: config.last_test_result,
      updated_at: config.updated_at
    });
  } catch (error) {
    console.error('[StreamingController] getConfig error:', error);
    res.status(500).json({ error: 'Error obteniendo configuración de streaming.' });
  }
};

/**
 * PUT /api/streaming/config
 * Actualiza la configuración del proveedor de streaming.
 */
const updateConfig = async (req, res) => {
  try {
    const { provider = 'vimeus', api_key, view_key, domain, is_active } = req.body;

    const updates = {};
    if (api_key !== undefined && api_key !== '') {
      if (!api_key.includes('********')) {
        updates.api_key_encrypted = encrypt(api_key);
      }
    }
    if (view_key !== undefined && view_key !== '') updates.view_key = view_key;
    if (domain !== undefined) updates.domain = domain;
    if (is_active !== undefined) updates.is_active = is_active;

    const result = await videoProviderService.updateProviderConfig(provider, updates);

    res.json({
      success: true,
      message: 'Configuración actualizada correctamente.',
      provider: result.provider,
      is_active: result.is_active,
      domain: result.domain || '',
      api_key_hint: result.api_key_encrypted ? `****${result.api_key_encrypted.slice(-4)}` : '',
      view_key_hint: result.view_key ? `****${result.view_key.slice(-4)}` : '',
      updated_at: result.updated_at
    });
  } catch (error) {
    console.error('[StreamingController] updateConfig error:', error);
    res.status(500).json({ error: 'Error actualizando configuración de streaming.' });
  }
};

/**
 * POST /api/streaming/test
 * Prueba la conexión con el proveedor de streaming.
 */
const testConnection = async (req, res) => {
  try {
    const { provider = 'vimeus' } = req.body;
    const result = await videoProviderService.testConnection(provider);

    res.json({
      success: result.success,
      message: result.message,
      details: result.details,
      tested_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('[StreamingController] testConnection error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error al probar la conexión.',
      details: null
    });
  }
};

/**
 * POST /api/streaming/check/:movieId
 * Verifica la disponibilidad de una película en el proveedor.
 */
const checkMovieAvailability = async (req, res) => {
  try {
    const { movieId } = req.params;
    const result = await videoProviderService.checkAvailability(movieId);

    res.json(result);
  } catch (error) {
    console.error('[StreamingController] checkMovieAvailability error:', error);
    res.status(400).json({
      status: 'error',
      error: error.message || 'Error al verificar disponibilidad.',
      movie_id: req.params.movieId
    });
  }
};

/**
 * POST /api/streaming/check-external
 * Verifica la disponibilidad usando parámetros externos sin requerir un ID de base de datos.
 */
const checkExternalAvailability = async (req, res) => {
  try {
    const { tmdb_id, imdb_id, type, season, episode, provider } = req.body;
    const result = await videoProviderService.checkExternalAvailability(tmdb_id, imdb_id, type, season, episode, provider);

    res.json(result);
  } catch (error) {
    console.error('[StreamingController] checkExternalAvailability error:', error);
    res.status(400).json({
      status: 'error',
      error: error.message || 'Error al verificar disponibilidad externa.'
    });
  }
};

/**
 * GET /api/streaming/embed/:movieId
 * Genera y devuelve la URL de embed para el reproductor público.
 * Este es el ÚNICO endpoint que el frontend público debe usar para obtener URLs de reproducción.
 */
const getEmbedUrl = async (req, res) => {
  try {
    const { movieId } = req.params;
    const embedUrl = await videoProviderService.getEmbedUrl(movieId);

    if (!embedUrl) {
      return res.json({ available: false, embed_url: null });
    }

    res.json({ available: true, embed_url: embedUrl });
  } catch (error) {
    console.error('[StreamingController] getEmbedUrl error:', error);
    res.json({ available: false, embed_url: null });
  }
};

/**
 * POST /api/streaming/check-manual
 * Valida una URL de streaming manual.
 */
const checkManualUrl = async (req, res) => {
  try {
    const { url } = req.body;
    const result = await videoProviderService.validateManualUrl(url);
    res.json(result);
  } catch (error) {
    console.error('[StreamingController] checkManualUrl error:', error);
    res.status(400).json({ valid: false, error: 'Error al validar la URL.' });
  }
};

module.exports = {
  getConfig,
  updateConfig,
  testConnection,
  checkMovieAvailability,
  checkExternalAvailability,
  getEmbedUrl,
  checkManualUrl
};
