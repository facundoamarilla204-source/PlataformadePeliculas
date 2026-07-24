const axios = require('axios');
const VideoProviderBase = require('./VideoProviderBase');
const { decrypt } = require('../../utils/encryption');

const VIMEUS_BASE_URL = 'https://vimeus.com';
const REQUEST_TIMEOUT_MS = 10000;
const MAX_RETRIES = 2;
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutos de caché

// Caché global en memoria (compartido por todas las instancias/requests en el mismo worker)
const apiCache = {
  movies: { ids: new Set(), lastSync: null, isSyncing: false },
  series: { ids: new Set(), lastSync: null, isSyncing: false },
  animes: { ids: new Set(), lastSync: null, isSyncing: false }
};

/**
 * VimeusProvider — Implementación concreta del proveedor de streaming Vimeus.
 * Cumple con la API Oficial: usa /api/listing/... para verificación y /e/... para embeds.
 */
class VimeusProvider extends VideoProviderBase {
  constructor(config) {
    super(config);
    this.providerName = 'Vimeus';
    this.apiKey = decrypt(config.api_key_encrypted) || process.env.VIMEUS_API_KEY;
    this.viewKey = config.view_key || process.env.VIMEUS_VIEW_KEY;
    this.domain = config.domain || VIMEUS_BASE_URL;
  }

  get axiosConfig() {
    return {
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/json'
      },
      timeout: REQUEST_TIMEOUT_MS,
      validateStatus: (status) => status < 500
    };
  }

  /**
   * Sincroniza el catálogo completo de un tipo (movies, series, animes) en memoria.
   * Evita múltiples requests simultáneos mediante isSyncing.
   */
  async _syncCatalog(typeEndpoint, cacheKey) {
    const cache = apiCache[cacheKey];
    
    // Si ya está sincronizando, esperar un poco o simplemente retornar
    if (cache.isSyncing) return;

    // Si el caché es válido, no sincronizar
    if (cache.lastSync && (Date.now() - cache.lastSync < CACHE_TTL_MS)) {
      return;
    }

    cache.isSyncing = true;
    try {
      let currentPage = 1;
      let lastPage = 1;
      const baseUrl = this.domain || VIMEUS_BASE_URL;
      
      const newIds = new Set();

      do {
        const url = `${baseUrl}/api/listing/${typeEndpoint}?page=${currentPage}`;
        const response = await axios.get(url, this.axiosConfig);

        if (response.status === 200 && response.data && response.data.error === false) {
          // NOTA: La documentación oficial dice que viene en data.movies y data.pagination,
          // pero en la vida real la API responde con data.result y data.pages.
          const items = response.data.data.result || response.data.data[typeEndpoint] || [];
          items.forEach(item => {
            if (item.tmdb_id) newIds.add(String(item.tmdb_id));
            if (item.imdb_id) newIds.add(String(item.imdb_id));
          });
          
          lastPage = response.data.data.pages || response.data.data.pagination?.last_page || response.data.data.pagination?.total_pages || 1;
          currentPage++;
        } else {
          break; // Error o fin
        }
        
        // Pequeño delay para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      } while (currentPage <= lastPage && currentPage <= 100); // Límite de seguridad 100 páginas

      // Actualizar caché atómicamente
      cache.ids = newIds;
      cache.lastSync = Date.now();
      
    } catch (err) {
      console.warn(`[VimeusProvider] Error sincronizando catálogo ${typeEndpoint}:`, err.message);
    } finally {
      cache.isSyncing = false;
    }
  }

  /**
   * Verifica si un contenido está disponible en Vimeus consultando la API Oficial paginada.
   */
  async checkAvailability(tmdbId, imdbId, serverConfig = {}, options = {}) {
    const identifier = tmdbId || imdbId;
    if (!identifier) {
      return { available: false, metadata: null, error: 'Se requiere TMDb ID o IMDb ID para verificar disponibilidad.' };
    }

    if (!this.apiKey) {
      // Asumimos que es válido para no bloquear al usuario en producción si no tiene la Key.
      // Advertencia: Vimeus mostrará un iframe que puede fallar si la película no existe en su catálogo.
      return { available: true, metadata: null, error: null, warning: 'No se configuró la API Key (necesaria para listar)' };
    }

    // Determinar el endpoint y la clave de caché
    let cacheKey = 'movies';
    let endpoint = 'movies';
    
    if (options.type === 'tv' || options.type === 'series') {
      cacheKey = 'series';
      endpoint = 'series';
    } else if (options.type === 'anime') {
      cacheKey = 'animes';
      endpoint = 'animes';
    }

    try {
      // Intentar sincronizar el caché primero
      await this._syncCatalog(endpoint, cacheKey);
      
      const cache = apiCache[cacheKey];
      const isAvailable = cache.ids.has(String(identifier));

      if (isAvailable) {
        return {
          available: true,
          metadata: {
            checked_with: tmdbId ? 'tmdb_id' : 'imdb_id',
            identifier,
            provider: this.providerName,
            cached: true
          },
          error: null
        };
      } else {
        return {
          available: false,
          metadata: {
            checked_with: tmdbId ? 'tmdb_id' : 'imdb_id',
            identifier,
            provider: this.providerName,
            cached: true
          },
          error: `Contenido no encontrado en el catálogo de ${endpoint}.`
        };
      }
    } catch (err) {
      return {
        available: false,
        metadata: null,
        error: `Error al verificar disponibilidad: ${err.message}`
      };
    }
  }

  /**
   * Construye la URL de embed. Solo debe usarse internamente por el backend.
   */
  buildEmbedUrl(tmdbId, imdbId, serverConfig = {}, options = {}) {
    return this._buildRawEmbedUrl(tmdbId, imdbId, serverConfig, options);
  }

  /**
   * Prueba la conexión con Vimeus verificando que las credenciales estén configuradas
   * y realizando una petición al endpoint de movies con la API Key.
   */
  async testConnection() {
    if (!this.apiKey || this.apiKey === 'your_vimeus_key_here') {
      return { success: false, message: 'API Key no configurada o inválida.', details: null };
    }

    if (!this.viewKey || this.viewKey === 'your_vimeus_view_key_here') {
      return { success: false, message: 'View Key no configurada o inválida.', details: null };
    }

    try {
      const baseUrl = this.domain || VIMEUS_BASE_URL;
      const response = await axios.get(`${baseUrl}/api/listing/movies?page=1`, this.axiosConfig);

      if (response.status === 200 && response.data && response.data.error === false) {
        return {
          success: true,
          message: `Conexión exitosa con la API de ${this.providerName}.`,
          details: {
            status_code: response.status,
            api_key_configured: true,
            view_key_configured: true,
            domain: baseUrl,
            tested_at: new Date().toISOString()
          }
        };
      } else {
         return {
          success: false,
          message: `La API respondió con error o acceso denegado (HTTP ${response.status}). Verifica la API Key.`,
          details: { status_code: response.status }
        };
      }
    } catch (err) {
      return {
        success: false,
        message: `No se pudo conectar con la API de ${this.providerName}: ${err.message}`,
        details: { error_code: err.code || 'UNKNOWN' }
      };
    }
  }

  /**
   * Construye la URL de embed cruda según la documentación oficial:
   * /e/movie?tmdb={TMDB_ID}&view_key={VIEW_KEY}
   * /e/serie?tmdb={TMDB_ID}&view_key={VIEW_KEY} (o ?se={S}&ep={E})
   * /e/anime?tmdb={TMDB_ID}&view_key={VIEW_KEY}
   */
  _buildRawEmbedUrl(tmdbId, imdbId, serverConfig = {}, options = {}) {
    if (!this.viewKey) return null;

    const identifier = tmdbId || imdbId;
    if (!identifier) return null;

    const baseUrl = this.domain || VIMEUS_BASE_URL;
    const type = options.type || 'movie';
    const idParam = tmdbId ? `tmdb=${tmdbId}` : `imdb=${imdbId}`;

    const extraParams = '&title=CINARIS&theme=purple&font=v2&splash=v3';

    if (type === 'tv' || type === 'series') {
      // Vimeus soporta se= y ep= para especificar el episodio exacto
      if (options.season && options.episode) {
        return `${baseUrl}/e/serie?${idParam}&se=${options.season}&ep=${options.episode}&view_key=${this.viewKey}${extraParams}`;
      }
      return `${baseUrl}/e/serie?${idParam}&view_key=${this.viewKey}${extraParams}`;
    }
    
    if (type === 'anime') {
       if (options.season && options.episode) {
          return `${baseUrl}/e/anime?${idParam}&se=${options.season}&ep=${options.episode}&view_key=${this.viewKey}${extraParams}`;
       }
       return `${baseUrl}/e/anime?${idParam}&view_key=${this.viewKey}${extraParams}`;
    }

    return `${baseUrl}/e/movie?${idParam}&view_key=${this.viewKey}${extraParams}`;
  }
}

module.exports = VimeusProvider;
