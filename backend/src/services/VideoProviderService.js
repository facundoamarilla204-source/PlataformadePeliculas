const supabase = require('../config/supabase');
const VimeusProvider = require('./providers/VimeusProvider');

/**
 * VideoProviderService — Fachada/Factory para proveedores de streaming.
 * 
 * Responsabilidades:
 * - Lee la configuración de streaming_config en Supabase.
 * - Instancia el provider correcto según la configuración activa.
 * - Expone métodos genéricos que el resto del sistema consume.
 * - Implementa caché inteligente para evitar consultas innecesarias.
 * - Nunca expone credenciales fuera del servicio.
 * 
 * Para agregar un nuevo proveedor:
 * 1. Crear una clase que extienda VideoProviderBase (ej: BunnyProvider.js)
 * 2. Registrarla en el mapa PROVIDER_MAP aquí abajo
 * 3. Insertar un registro en streaming_config con el provider name
 */

// Registro de proveedores disponibles
const PROVIDER_MAP = {
  vimeus: VimeusProvider,
  // bunny: BunnyProvider,    // Futuro
  // mux: MuxProvider,        // Futuro
  // cloudflare: CloudflareProvider, // Futuro
};

// Caché de configuración (se invalida cada 5 minutos)
let _configCache = null;
let _configCacheTime = 0;
const CONFIG_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos

// Caché de disponibilidad (24h por película)
const AVAILABILITY_CACHE_HOURS = 24;

/**
 * Obtiene la configuración del proveedor activo desde Supabase.
 * Usa caché para no consultar en cada request.
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

  // Invalida caché
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
 * Implementa caché inteligente basada en streaming_last_checked.
 */
const checkAvailability = async (movieId) => {
  // 1. Obtener datos de la película
  const { data: movie, error: movieError } = await supabase
    .from('movies')
    .select('id, tmdb_id, imdb_id, streaming_status, streaming_last_checked, streaming_provider, type, season, episode, streaming_mode, streaming_manual_url')
    .eq('id', movieId)
    .single();

  if (movieError || !movie) {
    throw new Error('Película no encontrada');
  }

  if (!movie.tmdb_id && !movie.imdb_id) {
    throw new Error('La película no tiene TMDb ID ni IMDb ID configurados. Importa los datos desde TMDb primero.');
  }

  // 2. Verificar caché: si fue verificado hace menos de 24h, reutilizar
  if (movie.streaming_last_checked) {
    const lastChecked = new Date(movie.streaming_last_checked);
    const hoursSince = (Date.now() - lastChecked.getTime()) / (1000 * 60 * 60);
    if (hoursSince < AVAILABILITY_CACHE_HOURS && movie.streaming_status !== 'pending') {
      return {
        cached: true,
        status: movie.streaming_status,
        last_checked: movie.streaming_last_checked,
        movie_id: movieId
      };
    }
  }

  // 3. Obtener proveedor activo
  const config = await getActiveConfig();
  if (!config) {
    throw new Error('No hay proveedor de streaming activo. Configura uno en Ajustes → Streaming.');
  }

  const provider = createProvider(config);

  // 4. Consultar disponibilidad
  const options = { type: movie.type, season: movie.season, episode: movie.episode };
  let result = { available: false, metadata: null, error: null };
  
  // Si está en modo manual y tiene URL válida, reportarlo como disponible
  if (movie.streaming_mode === 'manual' && movie.streaming_manual_url) {
     result = {
       available: true,
       metadata: { provider: 'vimeus', mode: 'manual' },
       error: null
     };
  } else {
     // Si está en auto, o si es manual pero no hay URL (comportamiento inesperado), intentar automático
     result = await provider.checkAvailability(movie.tmdb_id, movie.imdb_id, options);
     
     // Fallback: Si el automático falló pero tenemos una URL manual guardada, usarla.
     if (!result.available && movie.streaming_manual_url) {
        result = {
          available: true,
          metadata: { provider: 'vimeus', mode: 'fallback_manual' },
          error: null
        };
     }
  }

  // 5. Actualizar la película en la base de datos
  const newStatus = result.available ? 'available' : (result.error?.includes('conexión') ? 'error' : 'unavailable');
  
  await supabase
    .from('movies')
    .update({
      streaming_provider: config.provider,
      streaming_status: newStatus,
      streaming_last_checked: new Date().toISOString(),
      streaming_last_result: result
    })
    .eq('id', movieId);

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
 * Genera la URL de embed para una película.
 * SOLO el backend debe llamar esto — el frontend recibe la URL final.
 */
const getEmbedUrl = async (movieId) => {
  // 1. Obtener datos de la película
  const { data: movie, error } = await supabase
    .from('movies')
    .select('tmdb_id, imdb_id, streaming_status, streaming_provider, type, season, episode, streaming_mode, streaming_manual_url')
    .eq('id', movieId)
    .single();

  if (error || !movie) return null;

  // 2. Si el modo es manual y tiene URL, la devolvemos inmediatamente sin importar el streaming_status
  if (movie.streaming_mode === 'manual' && movie.streaming_manual_url) {
    return movie.streaming_manual_url;
  }

  // 3. Para modo automático, validamos status y IDs
  if (!movie.streaming_status || !movie.streaming_status.startsWith('available')) return null;
  if (!movie.tmdb_id && !movie.imdb_id) return null;

  // 4. Obtener proveedor para Modo Automático
  const config = await getActiveConfig();
  if (!config) return null;

  const provider = createProvider(config);
  const options = { type: movie.type, season: movie.season, episode: movie.episode };
  const autoUrl = provider.buildEmbedUrl(movie.tmdb_id, movie.imdb_id, options);
  
  if (autoUrl) return autoUrl;

  // 5. Fallback si el auto falló por alguna razón
  if (movie.streaming_manual_url) {
    return movie.streaming_manual_url;
  }

  return null;
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

  // Guardar resultado de la prueba
  await supabase
    .from('streaming_config')
    .update({
      last_test_at: new Date().toISOString(),
      last_test_result: result,
      updated_at: new Date().toISOString()
    })
    .eq('provider', providerName);

  // Invalida caché
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
    // Enmascarar credenciales
    api_key_hint: config.api_key_encrypted ? `****${config.api_key_encrypted.slice(-4)}` : null,
    view_key_hint: config.view_key ? `****${config.view_key.slice(-4)}` : null
  };
};

/**
 * Verifica la disponibilidad de contenido sin depender de un registro guardado en la base de datos.
 * Útil para la UI antes de guardar una nueva película/serie.
 *
 * @param {number|null} tmdbId
 * @param {string|null} imdbId
 * @param {string} type - 'movie' o 'tv'
 * @param {number|null} season
 * @param {number|null} episode
 * @param {string} providerName - Por defecto 'vimeus'
 */
const checkExternalAvailability = async (tmdbId, imdbId, type = 'movie', season = null, episode = null, providerName = 'vimeus') => {
  const config = await getProviderConfig(providerName);
  
  if (!config) {
    throw new Error(`Proveedor ${providerName} no configurado o inactivo.`);
  }

  const provider = createProvider(config);
  const options = { type, season, episode };
  
  const result = await provider.checkAvailability(tmdbId, imdbId, options);
  
  return {
    status: result.available ? 'available' : (result.error?.includes('conexión') ? 'error' : 'unavailable'),
    last_checked: new Date().toISOString(),
    details: result
  };
};

/**
 * Valida una URL de streaming manual.
 */
const validateManualUrl = async (url) => {
  if (!url || typeof url !== 'string') {
    return { valid: false, error: 'La URL no puede estar vacía.' };
  }
  
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'La URL debe usar HTTPS.' };
    }
    
    // Validar el dominio
    if (!parsed.hostname.includes('vimeus.com')) {
      return { valid: false, error: 'La URL debe pertenecer al dominio oficial vimeus.com.' };
    }
    
    // Validar formato de Embed
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
