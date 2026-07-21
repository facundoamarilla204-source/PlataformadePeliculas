const categoryService = require('../services/categoryService');

const getAllCategories = async (req, res) => {
  try {
    const { page, limit, search, status, sortBy, order } = req.query;
    const result = await categoryService.listCategories({ page, limit, search, status, sortBy, order });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryBySlug = async (req, res) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMoviesByCategorySlug = async (req, res) => {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug);
    if (!category) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    const supabase = require('../config/supabase');
    
    // Obtener las relaciones
    const { data: relations } = await supabase
      .from('movie_categories')
      .select('movie_id')
      .eq('category_id', category.id);

    if (!relations || relations.length === 0) {
      return res.json([]);
    }

    const movieIds = relations.map(r => r.movie_id);

    // Obtener las películas
    const { data: movies, error } = await supabase
      .from('movies')
      .select('*')
      .in('id', movieIds)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    
    res.json(movies || []);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const data = await categoryService.createCategory(req.body, adminId);
    res.status(201).json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message, code: error.code });
  }
};

const updateCategory = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const data = await categoryService.updateCategory(req.params.id, req.body, adminId);
    res.json(data);
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message, code: error.code });
  }
};

const toggleCategoryStatus = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const data = await categoryService.toggleStatus(req.params.id, adminId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const adminId = req.user?.id;
    await categoryService.deleteCategory(req.params.id, adminId);
    res.status(204).send();
  } catch (error) {
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message, code: error.code });
  }
};

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  getMoviesByCategorySlug,
  createCategory,
  updateCategory,
  toggleCategoryStatus,
  deleteCategory
};
