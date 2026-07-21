const express = require('express');
const router = express.Router();
const streamingController = require('../controllers/streamingController');
const auth = require('../middleware/authMiddleware');

// Rutas protegidas (solo administradores)
router.get('/config', auth, streamingController.getConfig);
router.put('/config', auth, streamingController.updateConfig);
router.post('/test', auth, streamingController.testConnection);
router.post('/check/:movieId', auth, streamingController.checkMovieAvailability);
router.post('/check-external', auth, streamingController.checkExternalAvailability);
router.post('/check-manual', auth, streamingController.checkManualUrl);

// Ruta pública — el reproductor necesita obtener la URL de embed
router.get('/embed/:movieId', streamingController.getEmbedUrl);

module.exports = router;
