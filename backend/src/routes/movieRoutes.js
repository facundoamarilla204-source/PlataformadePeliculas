const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const auth = require('../middleware/authMiddleware');

router.get('/', movieController.getAllMovies);
router.get('/slug/:slug', movieController.getMovieBySlug);
router.get('/:id', movieController.getMovieById);
router.post('/:id/view', movieController.recordMovieView);

// Servidores de streaming
router.get('/:id/servers', movieController.getMovieServers);
router.put('/:id/servers', auth, movieController.updateMovieServers);

// Rutas protegidas
router.post('/', auth, movieController.createMovie);
router.put('/:id', auth, movieController.updateMovie);
router.delete('/:id', auth, movieController.deleteMovie);

module.exports = router;
