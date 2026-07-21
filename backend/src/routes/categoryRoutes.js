const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { validateCategoryInput } = require('../middleware/categoryValidation');
const auth = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/slug/:slug/movies', categoryController.getMoviesByCategorySlug);

// Rutas protegidas (sólo administrador)
router.post('/', auth, validateCategoryInput, categoryController.createCategory);
router.put('/:id', auth, categoryController.updateCategory);
router.patch('/:id/toggle', auth, categoryController.toggleCategoryStatus);
router.delete('/:id', auth, categoryController.deleteCategory);

module.exports = router;
