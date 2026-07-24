const axios = require('axios');
const VideoProviderBase = require('./VideoProviderBase');
const { decrypt } = require('../../utils/encryption');

const GOODSTREAM_BASE_URL = 'https://goodstream.one';
const REQUEST_TIMEOUT_MS = 10000;

class GoodStreamProvider extends VideoProviderBase {
  constructor(config) {
    super(config);
    this.providerName = 'GoodStream';
    this.apiKey = (decrypt(config.api_key_encrypted) || process.env.GOODSTREAM_API_KEY || '').trim();
    
    let rawDomain = (config.domain || '').trim() || GOODSTREAM_BASE_URL;
    if (!/^https?:\/\//i.test(rawDomain)) {
      rawDomain = `https://${rawDomain}`;
    }
    this.domain = rawDomain;
  }

  get axiosConfig() {
    return {
      timeout: REQUEST_TIMEOUT_MS,
      validateStatus: (status) => status < 500
    };
  }

  async testConnection() {
    if (!this.apiKey) {
      return { success: false, message: 'API Key no configurada o inválida.', details: null };
    }

    try {
      const baseUrl = this.domain;
      const response = await axios.get(`${baseUrl}/api/account/info?key=${this.apiKey}`, this.axiosConfig);

      if (response.status === 200 && response.data && response.data.status === 200) {
        return {
          success: true,
          message: `Conexión exitosa con la API de ${this.providerName}.`,
          details: {
            status_code: response.status,
            api_key_configured: true,
            domain: baseUrl,
            login: response.data.result?.login,
            tested_at: new Date().toISOString()
          }
        };
      } else {
         return {
          success: false,
          message: `La API respondió con error o acceso denegado. Verifica la API Key.`,
          details: { status_code: response.status, response: response.data }
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

  async checkAvailability(tmdbId, imdbId, serverConfig, options = {}) {
    const fileCode = serverConfig?.file_code;
    
    if (!fileCode) {
      return { available: false, metadata: null, error: 'Se requiere el File Code de GoodStream para verificar disponibilidad.' };
    }

    if (!this.apiKey) {
      // Asumimos que es válido para no bloquear al usuario en producción si no tiene la Key.
      return { available: true, metadata: null, error: null, warning: 'No se configuró la API Key de GoodStream' };
    }

    try {
      const baseUrl = this.domain || GOODSTREAM_BASE_URL;
      const response = await axios.get(`${baseUrl}/api/file/info?key=${this.apiKey}&file_code=${fileCode}`, this.axiosConfig);

      if (response.status === 200 && response.data && response.data.status === 200) {
        const results = response.data.result || [];
        if (results.length > 0 && results[0].canplay === 1) {
          return {
            available: true,
            metadata: {
              provider: this.providerName,
              file_code: fileCode,
              title: results[0].file_title,
              length: results[0].file_length,
              thumbnail: results[0].player_img,
              views: results[0].file_views
            },
            error: null
          };
        } else {
          return {
            available: false,
            metadata: null,
            error: 'El archivo existe pero no está disponible para reproducción (puede estar codificándose o bloqueado).'
          };
        }
      } else {
        return {
          available: false,
          metadata: null,
          error: `Archivo no encontrado o error en la API. Código: ${response.data?.status}`
        };
      }
    } catch (err) {
      return {
        available: false,
        metadata: null,
        error: `Error al verificar disponibilidad en GoodStream: ${err.message}`
      };
    }
  }

  async syncFile(fileCode) {
    if (!fileCode || !this.apiKey) {
      throw new Error('Falta fileCode o API Key para sincronizar GoodStream.');
    }

    const baseUrl = this.domain;
    const cleanFileCode = fileCode.trim();
    
    // Obtener info básica
    const infoResponse = await axios.get(`${baseUrl}/api/file/info?key=${this.apiKey}&file_code=${cleanFileCode}`, this.axiosConfig);
    if (infoResponse.status !== 200 || infoResponse.data.status !== 200 || !infoResponse.data.result || infoResponse.data.result.length === 0) {
      throw new Error('No se pudo obtener información del archivo o no existe.');
    }
    const info = infoResponse.data.result[0];

    // Obtener direct links & hls
    const linkResponse = await axios.get(`${baseUrl}/api/file/direct_link?key=${this.apiKey}&file_code=${cleanFileCode}&hls=1`, this.axiosConfig);
    let directLinks = [];
    let hlsUrl = null;

    if (linkResponse.status === 200 && linkResponse.data.status === 200) {
      const linkResult = linkResponse.data.result;
      if (linkResult) {
        directLinks = linkResult.versions || [];
        hlsUrl = linkResult.hls_direct || null;
      }
    }

    return {
      file_code: fileCode,
      status: info.canplay === 1 ? 'available' : 'unavailable',
      thumbnail: info.player_img,
      duration: parseInt(info.file_length) || 0,
      hls_url: hlsUrl,
      direct_url: directLinks,
      title: info.file_title
    };
  }

  buildEmbedUrl(tmdbId, imdbId, serverConfig, options = {}) {
    // Para GoodStream retornamos null en este método si queremos forzar que el cliente
    // lo maneje por HLS mediante la metadata devuelta en checkAvailability, o podemos
    // devolver el embed de iframe en caso de usar el direct_url.
    
    // Como el frontend maneja HLS si recibe un objeto, esto ya no retorna un string,
    // o retorna la URL de HLS.
    if (serverConfig?.hls_url) {
      return serverConfig.hls_url;
    }
    
    // Fallback embed if direct URL
    if (serverConfig?.direct_url) {
      return serverConfig.direct_url;
    }
    
    if (serverConfig?.file_code) {
      const baseUrl = this.domain || GOODSTREAM_BASE_URL;
      return `${baseUrl}/embed-${serverConfig.file_code}.html`;
    }

    return null;
  }
}

module.exports = GoodStreamProvider;
