const supabase = require('../config/supabase');
const VimeusProvider = require('./providers/VimeusProvider');

/**
 * VideoProviderService — Fachada/Factory para proveedores de streaming.
 */

// Registro de proveedores disponibles
const PROVIDER_MAP = {
  vimeus: VimeusProvider,
  goodstream: require('./providers/GoodStreamProvider'),
  doodstream: require('./providers/DoodStreamProvider'),
  filemoon: require('./providers/DoodStreamProvider'),
  streamtape: require('./providers/DoodStreamProvider'),
};

// Caché de configuración (se invalida cada 5 minutos)
let _configCache = null;
let _configCacheTime = 0;
const CONFIG_CACHE_TTL_MS = 5 * 60 * 1000;

/**
 * Obtiene la configuración del proveedor activo desde Supabase.
 */
const getActiveConfig = async () => {
  const now = Date.now();
  if (_configCache && (now - _configCacheTime) < CONFIG_CACHE_TTL_MS) {
    return _configCache;
  }

  const { data, error } = await supabase
    .from('streaming_config')
    .select('*')
    .eq('is_active', true)
    .limit(1)
    .single();

  if (error || !data) {
    _configCache = null;
    _configCacheTime = now;
    return null;
  }

  _configCache = data;
  _configCacheTime = now;
  return data;
};

/**
 * Obtiene la configuración de un proveedor específico.
 */
const getProviderConfig = async (providerName) => {
  const { data, error } = await supabase
    .from('streaming_config')
    .select('*')
    .eq('provider', providerName)
    .single();

  if (error || !data) return null;
  return data;
};

/**
 * Actualiza la configuración de un proveedor.
 */
const updateProviderConfig = async (providerName, updates) => {
  const { data, error } = await supabase
    .from('streaming_config')
    .upsert({ provider: providerName, ...updates, updated_at: new Date().toISOString() }, { onConflict: 'provider' })
    .select()
    .single();

  _configCache = null;
  _configCacheTime = 0;

  if (error) throw new Error(`Error actualizando configuración: ${error.message}`);
  return data;
};

/**
 * Instancia el provider adecuado a partir de la configuración.
 */
const createProvider = (config) => {
  const ProviderClass = PROVIDER_MAP[config.provider];
  if (!ProviderClass) {
    throw new Error(`Proveedor de streaming desconocido: ${config.provider}`);
  }
  return new ProviderClass(config);
};

/**
 * Verifica la disponibilidad de una película en el proveedor activo.
 */
const checkAvailability = async (movieId) => {
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('id, tmdb_id, imdb_id, type, season, episode')
    .eq('id', movieId)
    .single();

  if (movieError || !movie) {
    throw new Error('Película no encontrada');
  }

  if (!movie.tmdb_id && !movie.imdb_id) {
    throw new Error('La película no tiene TMDb ID ni IMDb ID configurados.');
  }

  const config = await getActiveConfig();
  if (!config) {
    throw new Error('No hay proveedor de streaming activo. Configura uno en Ajustes → Streaming.');
  }

  const provider = createProvider(config);
  const options = { type: movie.type, season: movie.season, episode: movie.episode };
  const result = await provider.checkAvailability(movie.tmdb_id, movie.imdb_id, {}, options);
  const newStatus = result.available ? 'available' : 'unavailable';

  return {
    cached: false,
    status: newStatus,
    available: result.available,
    last_checked: new Date().toISOString(),
    metadata: result.metadata,
    error: result.error,
    movie_id: movieId
  };
};

/**
 * Genera las URLs de embed para una película (devuelve array de streams).
 * Este es el corazón del sistema de reproducción.
 */
const getEmbedUrl = async (movieId) => {
  // 1. Obtener la película — SOLO columnas que existen en la tabla
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('id, tmdb_id, imdb_id, type, season, episode')
    .eq('id', movieId)
    .single();

  if (movieError || !movie) return [];

  const appendVimeusParams = (url) => {
    if (!url || !url.includes('vimeus.com/e/')) return url;
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('title', 'CINARIS');
      parsedUrl.searchParams.set('theme', 'purple');
      parsedUrl.searchParams.set('font', 'v2');
      parsedUrl.searchParams.set('splash', 'v3');
      return parsedUrl.toString();
    } catch (e) {
      return url;
    }
  };

  const streams = [];
  const options = { type: movie.type, season: movie.season, episode: movie.episode };

  // 2. Obtener los servidores de la tabla movie_servers
  const { data: servers, error: serversError } = await supabase
    .from('movie_servers')
    .select('*')
    .eq('movie_id', movieId)
    .eq('is_active', true)
    .order('priority', { ascending: true });

  if (!serversError && servers && servers.length > 0) {
    for (const server of servers) {
      let globalConfig = await getProviderConfig(server.provider);
      if (!globalConfig) {
        globalConfig = { provider: server.provider, api_key_encrypted: '' };
      }

      const provider = createProvider(globalConfig);
      const serverConfig = server.config || {};
      let url = provider.buildEmbedUrl(movie.tmdb_id, movie.imdb_id, serverConfig, options);

      if (url) {
        if (server.provider === 'vimeus') {
          url = appendVimeusParams(url);
        }
        streams.push({
          id: server.id,
          provider: server.provider,
          name: server.provider.charAt(0).toUpperCase() + server.provider.slice(1),
          url: url
        });
      }
    }
  }

  // 3. FALLBACK: Si no hay servidores en movie_servers, intentar auto con Vimeus
  if (streams.length === 0 && (movie.tmdb_id || movie.imdb_id)) {
    const globalConfig = await getActiveConfig();
    if (globalConfig) {
      const provider = createProvider(globalConfig);
      let autoUrl = provider.buildEmbedUrl(movie.tmdb_id, movie.imdb_id, {}, options);
      if (autoUrl) {
        if (globalConfig.provider === 'vimeus') {
          autoUrl = appendVimeusParams(autoUrl);
        }
        streams.push({
          id: 'auto',
          provider: globalConfig.provider,
          name: globalConfig.provider.charAt(0).toUpperCase() + globalConfig.provider.slice(1),
          url: autoUrl
        });
      }
    }
  }

  return streams;
};

/**
 * Prueba la conexión con un proveedor específico.
 */
const testConnection = async (providerName) => {
  const config = await getProviderConfig(providerName);
  if (!config) {
    throw new Error(`Proveedor '${providerName}' no encontrado en la configuración.`);
  }

  const provider = createProvider(config);
  const result = await provider.testConnection();

  await supabase
    .from('streaming_config')
    .update({
      last_test_at: new Date().toISOString(),
      last_test_result: result,
      updated_at: new Date().toISOString()
    })
    .eq('provider', providerName);

  _configCache = null;
  _configCacheTime = 0;

  return result;
};

/**
 * Obtiene info del proveedor activo (sin exponer credenciales).
 */
const getActiveProviderInfo = async () => {
  const config = await getActiveConfig();
  if (!config) return null;

  return {
    provider: config.provider,
    is_active: config.is_active,
    domain: config.domain,
    last_test_at: config.last_test_at,
    last_test_result: config.last_test_result,
    api_key_hint: config.api_key_encrypted ? `****${config.api_key_encrypted.slice(-4)}` : null,
    view_key_hint: config.view_key ? `****${config.view_key.slice(-4)}` : null
  };
};

/**
 * Verifica la disponibilidad de contenido sin depender de un registro guardado en la base de datos.
 */
const checkExternalAvailability = async (tmdbId, imdbId, type = 'movie', season = null, episode = null, providerName = 'vimeus', serverConfig = {}) => {
  let globalConfig = await getProviderConfig(providerName);
  if (!globalConfig) {
    globalConfig = { provider: providerName, api_key_encrypted: '' };
  }

  const provider = createProvider(globalConfig);
  const options = { type, season, episode };

  const result = await provider.checkAvailability(tmdbId, imdbId, serverConfig, options);
  return result;
};

/**
 * Valida un manual URL.
 */
const validateManualUrl = (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'La URL no puede estar vacía.' };
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'La URL debe usar HTTPS.' };
    }

    if (!parsed.hostname.includes('vimeus.com')) {
      return { valid: false, error: 'La URL debe pertenecer al dominio oficial vimeus.com.' };
    }

    if (!parsed.pathname.startsWith('/e/movie') && !parsed.pathname.startsWith('/e/serie') && !parsed.pathname.startsWith('/e/anime')) {
      return { valid: false, error: 'La URL no tiene el formato correcto para un reproductor Embed (/e/).' };
    }

    if (!parsed.searchParams.has('view_key')) {
      return { valid: false, error: 'La URL carece del parámetro view_key necesario para la reproducción.' };
    }

    return { valid: true, error: null };
  } catch (err) {
    return { valid: false, error: 'Formato de URL inválido.' };
  }
};

module.exports = {
  getActiveConfig,
  getProviderConfig,
  updateProviderConfig,
  checkAvailability,
  getEmbedUrl,
  testConnection,
  getActiveProviderInfo,
  checkExternalAvailability,
  validateManualUrl
};
