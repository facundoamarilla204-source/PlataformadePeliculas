const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const integrationsController = require('../controllers/integrationsController');
const databaseController = require('../controllers/databaseController');
const auth = require('../middleware/authMiddleware');

// Configuración general
router.get('/', settingsController.getSettings);
router.put('/', auth, settingsController.updateSettings);

// Integraciones
router.get('/test/vimeus', auth, integrationsController.testVimeus);
router.get('/test/tmdb', auth, integrationsController.testTmdb);

// Base de datos
router.get('/db-stats', auth, databaseController.getDatabaseStats);
router.post('/db-action', auth, databaseController.performDbAction);

module.exports = router;
