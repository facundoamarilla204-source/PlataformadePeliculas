const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
// Generamos una clave de 32 bytes usando un hash sha256 del MASTER_ENCRYPTION_KEY (o fallback si no hay para no crashear, aunque no es seguro sin ella)
const getEncryptionKey = () => {
  const secret = process.env.MASTER_ENCRYPTION_KEY || 'default_insecure_secret_do_not_use_in_prod_cine_match';
  return crypto.createHash('sha256').update(String(secret)).digest('base64').substring(0, 32);
};

/**
 * Encripta un texto
 * @param {string} text - El texto a encriptar (ej: la API key)
 * @returns {string} - Texto encriptado en formato iv:authTag:encryptedText
 */
const encrypt = (text) => {
  if (!text) return text;
  try {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag().toString('hex');
    
    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
  } catch (error) {
    console.error('Error al encriptar:', error.message);
    return null;
  }
};

/**
 * Desencripta un texto
 * @param {string} text - El texto en formato iv:authTag:encryptedText
 * @returns {string} - Texto original
 */
const decrypt = (text) => {
  if (!text || !text.includes(':')) return text; // If it's not encrypted format, just return it
  
  try {
    const parts = text.split(':');
    if (parts.length !== 3) return text; // formato inválido
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    
    const decipher = crypto.createDecipheriv(ALGORITHM, Buffer.from(getEncryptionKey()), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Error al desencriptar:', error.message);
    return null;
  }
};

module.exports = {
  encrypt,
  decrypt
};
