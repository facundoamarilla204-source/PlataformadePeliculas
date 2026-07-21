const axios = require('axios');

const VIMEUS_API_URL = 'https://api.vimeo.com'; // Usamos la de Vimeo como referencia por "Vimeus"
const VIMEUS_API_KEY = process.env.VIMEUS_API_KEY;

/**
 * Inicializa la subida de un video, indicando el tamaño para obtener el enlace de subida.
 * (Esta es una estructura base, la implementación exacta dependerá de la API real de Vimeus).
 */
const initializeUpload = async (fileSize, title, description) => {
  if (!VIMEUS_API_KEY) throw new Error('VIMEUS_API_KEY no configurada');

  try {
    const response = await axios.post(
      `${VIMEUS_API_URL}/me/videos`,
      {
        upload: {
          approach: 'tus',
          size: fileSize
        },
        name: title,
        description: description
      },
      {
        headers: {
          Authorization: `Bearer ${VIMEUS_API_KEY}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.vimeo.*+json;version=3.4'
        }
      }
    );
    
    // Retorna el enlace donde el cliente deberá subir físicamente el archivo
    return response.data.upload.upload_link;
  } catch (error) {
    console.error('Error inicializando subida en Vimeus:', error.message);
    throw error;
  }
};

/**
 * Consulta el estado de procesamiento de un video por su ID
 */
const checkVideoStatus = async (videoId) => {
  if (!VIMEUS_API_KEY) throw new Error('VIMEUS_API_KEY no configurada');

  try {
    const response = await axios.get(`${VIMEUS_API_URL}/videos/${videoId}`, {
      headers: {
        Authorization: `Bearer ${VIMEUS_API_KEY}`
      }
    });
    
    return response.data.status; // ej: 'available', 'transcoding', 'error'
  } catch (error) {
    console.error(`Error verificando estado del video ${videoId}:`, error.message);
    throw error;
  }
};

module.exports = {
  initializeUpload,
  checkVideoStatus
};
