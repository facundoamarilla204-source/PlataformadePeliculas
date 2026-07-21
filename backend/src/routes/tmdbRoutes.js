const express = require('express');
const router = express.Router();
const tmdbController = require('../controllers/tmdbController');
const auth = require('../middleware/authMiddleware');

router.get('/search', auth, tmdbController.search);
router.get('/details/:id', auth, tmdbController.getDetails);

module.exports = router;
