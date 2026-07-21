/**
 * VideoProviderBase — Clase base abstracta para proveedores de streaming.
 * 
 * Todos los proveedores de video (Vimeus, Bunny, Mux, etc.) deben extender
 * esta clase e implementar los métodos definidos aquí.
 * 
 * Esto garantiza que el resto del sistema nunca dependa de detalles
 * específicos de un proveedor particular (principio de inversión de dependencias).
 */
class VideoProviderBase {
  constructor(config) {
    if (new.target === VideoProviderBase) {
      throw new Error('VideoProviderBase es abstracta y no puede instanciarse directamente.');
    }
    this.config = config;
    this.providerName = 'unknown';
  }

  /**
   * Verifica si un contenido está disponible para streaming.
   * @param {number|null} tmdbId - ID de TMDb
   * @param {string|null} imdbId - ID de IMDb (formato ttXXXXXXX)
   * @param {object} options - { type: 'movie'|'tv', season: number, episode: number }
   * @returns {Promise<{ available: boolean, metadata: object|null, error: string|null }>}
   */
  async checkAvailability(tmdbId, imdbId, options = {}) {
    throw new Error('checkAvailability() debe ser implementado por el proveedor concreto.');
  }

  /**
   * Construye la URL de embed para el reproductor.
   * NUNCA debe exponerse al frontend directamente; solo a través del backend.
   * @param {number|null} tmdbId
   * @param {string|null} imdbId
   * @param {object} options - { type: 'movie'|'tv', season: number, episode: number }
   * @returns {string|null}
   */
  buildEmbedUrl(tmdbId, imdbId, options = {}) {
    throw new Error('buildEmbedUrl() debe ser implementado por el proveedor concreto.');
  }

  /**
   * Prueba la conexión con el proveedor para validar credenciales.
   * @returns {Promise<{ success: boolean, message: string, details: object|null }>}
   */
  async testConnection() {
    throw new Error('testConnection() debe ser implementado por el proveedor concreto.');
  }

  /**
   * Retorna el nombre legible del proveedor.
   * @returns {string}
   */
  getName() {
    return this.providerName;
  }
}

module.exports = VideoProviderBase;
