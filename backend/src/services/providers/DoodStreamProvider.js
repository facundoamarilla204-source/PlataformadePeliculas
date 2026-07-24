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
    if (!serverConfig || !serverConfig.file_code) {
      return { available: false, metadata: null, error: 'No file_code provided' };
    }

    try {
      if (!this.apiKey) {
        // Sin API key, el código de archivo podría funcionar pero no podemos verificarlo remotamente.
        // Lo marcamos como no validado por seguridad
        return { available: false, metadata: null, error: 'Falta API Key para validación remota en DoodStream' };
      }

      const response = await axios.get(`https://doodapi.com/api/file/info?key=${this.apiKey}&file_code=${serverConfig.file_code}`);
      const data = response.data;
      
      if (data && data.status === 200 && Array.isArray(data.result) && data.result.length > 0) {
        const fileInfo = data.result[0];
        return { available: true, metadata: fileInfo, error: null };
      }
      
      return { available: false, metadata: data, error: 'El archivo no existe en DoodStream' };
    } catch (error) {
      return { available: false, metadata: null, error: `DoodStream API error: ${error.message}` };
    }
  }

  buildEmbedUrl(tmdbId, imdbId, serverConfig, options = {}) {
    if (serverConfig?.file_code) {
      return `https://playmogo.com/e/${serverConfig.file_code}`;
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
