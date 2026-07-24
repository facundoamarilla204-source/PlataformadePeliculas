const axios = require('axios');
const VideoProviderBase = require('./VideoProviderBase');

/**
 * DoodStreamProvider — Implementación del proveedor DoodStream.
 */
class DoodStreamProvider extends VideoProviderBase {
  constructor(config) {
    super(config);
    this.providerName = 'DoodStream';
    this.apiKey = config.api_key || process.env.DOODSTREAM_API_KEY;
  }

  async checkAvailability(tmdbId, imdbId, serverConfig, options = {}) {
    if (serverConfig?.file_code) {
      return { available: true, metadata: { file_code: serverConfig.file_code }, error: null };
    }
    return { available: false, metadata: null, error: 'No file_code provided' };
  }

  buildEmbedUrl(tmdbId, imdbId, serverConfig, options = {}) {
    if (serverConfig?.file_code) {
      return `https://dood.so/e/${serverConfig.file_code}`;
    }
    if (serverConfig?.manual_url) {
      return serverConfig.manual_url;
    }
    return null;
  }

  async testConnection() {
    try {
      if (!this.apiKey) {
        return { success: false, message: 'API Key no configurada para DoodStream', details: null };
      }
      const response = await axios.get(`https://doodapi.com/api/account/info?key=${this.apiKey}`);
      if (response.data && response.data.status === 200) {
        return { success: true, message: 'Conexión exitosa', details: response.data.result };
      }
      return { success: false, message: 'Respuesta inválida', details: response.data };
    } catch (error) {
      return { success: false, message: error.message, details: null };
    }
  }
}

module.exports = DoodStreamProvider;
