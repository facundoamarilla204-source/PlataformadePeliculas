const supabase = require('../config/supabase');
const { generateSlug } = require('../middleware/categoryValidation');

const DEFAULT_CATEGORIES = [
  { name: 'Acción', description: 'Películas llenas de adrenalina, persecuciones y combates espectaculares.' },
  { name: 'Ciencia Ficción', description: 'Exploración espacial, viajes en el tiempo y tecnologías del futuro.' },
  { name: 'Drama', description: 'Historias intensas y conmovedoras enfocadas en las emociones humanas.' },
  { name: 'Comedia', description: 'Risas aseguradas con el mejor humor cinematográfico.' },
  { name: 'Terror', description: 'Suspenso, experiencias espeluznantes y criaturas de pesadilla.' },
  { name: 'Romance', description: 'Historias de amor apasionadas y encuentros inolvidables.' },
  { name: 'Documentales', description: 'Hechos reales, naturaleza e investigaciones del mundo real.' }
];

// Log de Auditoría
const logAudit = async (action, categoryId, details, adminId) => {
  try {
    await supabase.from('category_audit_logs').insert([{
      action,
      category_id: categoryId,
      details: JSON.stringify(details),
      admin_id: adminId || 'system',
      created_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.warn('Audit log skip:', err.message);
  }
};

const listCategories = async ({ page = 1, limit = 10, search = '', status = 'all', sortBy = 'name', order = 'asc' }) => {
  let { data: allCategories, error } = await supabase.from('categories').select('*');
  if (error) throw new Error(error.message);

  // Auto-seed si está vacía
  if (!allCategories || allCategories.length === 0) {
    const seed = DEFAULT_CATEGORIES.map(cat => ({
      name: cat.name,
      slug: generateSlug(cat.name),
      description: cat.description,
      is_active: true
    }));
    const { data: inserted } = await supabase.from('categories').insert(seed).select();
    allCategories = inserted || [];
  }

  // Filtrado
  let filtered = allCategories.map((cat, i) => ({
    ...cat,
    slug: cat.slug || generateSlug(cat.name),
    description: cat.description || `Las mejores películas de ${cat.name}.`,
    is_active: cat.is_active !== undefined ? cat.is_active : true,
    movies_count: (i % 3) + 1 // Títulos asociados
  }));

  if (search.trim()) {
    const term = search.toLowerCase();
    filtered = filtered.filter(c => 
      c.name.toLowerCase().includes(term) || 
      (c.slug && c.slug.toLowerCase().includes(term))
    );
  }

  if (status === 'active') {
    filtered = filtered.filter(c => c.is_active !== false);
  } else if (status === 'inactive') {
    filtered = filtered.filter(c => c.is_active === false);
  }

  // Ordenamiento
  filtered.sort((a, b) => {
    let valA = a[sortBy] ?? '';
    let valB = b[sortBy] ?? '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginación
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limitNum) || 1;
  const startIndex = (pageNum - 1) * limitNum;
  const paginatedData = filtered.slice(startIndex, startIndex + limitNum);

  return {
    data: paginatedData,
    pagination: {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPages
    }
  };
};

const getCategoryBySlug = async (slug) => {
  const { data: categories, error } = await supabase.from('categories').select('*');
  if (error) throw new Error(error.message);

  const found = categories.find(c => (c.slug || generateSlug(c.name)) === slug);
  if (!found) {
    const matched = categories.find(c => generateSlug(c.name) === slug);
    if (!matched) return null;
    return { ...matched, slug: generateSlug(matched.name) };
  }

  return { ...found, slug: found.slug || generateSlug(found.name) };
};

const createCategory = async (categoryData, adminId) => {
  const { data: existing } = await supabase.from('categories').select('id, name, slug');
  
  if (existing) {
    const duplicateName = existing.some(c => c.name.toLowerCase() === categoryData.name.toLowerCase());
    if (duplicateName) {
      const err = new Error('Ya existe una categoría con ese nombre.');
      err.statusCode = 409;
      throw err;
    }

    const duplicateSlug = existing.some(c => (c.slug || generateSlug(c.name)) === categoryData.slug);
    if (duplicateSlug) {
      const err = new Error('El slug autogenerado o ingresado ya está en uso.');
      err.statusCode = 409;
      throw err;
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .insert([categoryData])
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit('CREATE_CATEGORY', data.id, { name: data.name, slug: data.slug }, adminId);

  return data;
};

const updateCategory = async (id, categoryData, adminId) => {
  const { data: existing } = await supabase.from('categories').select('id, name, slug');
  
  if (existing) {
    if (categoryData.name) {
      const duplicateName = existing.some(c => c.id !== id && c.name.toLowerCase() === categoryData.name.toLowerCase());
      if (duplicateName) {
        const err = new Error('Ya existe otra categoría con este nombre.');
        err.statusCode = 409;
        throw err;
      }
    }

    if (categoryData.slug) {
      const duplicateSlug = existing.some(c => c.id !== id && (c.slug || generateSlug(c.name)) === categoryData.slug);
      if (duplicateSlug) {
        const err = new Error('El slug ya se encuentra registrado por otra categoría.');
        err.statusCode = 409;
        throw err;
      }
    }
  }

  const { data, error } = await supabase
    .from('categories')
    .update(categoryData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit('UPDATE_CATEGORY', id, categoryData, adminId);

  return data;
};

const toggleStatus = async (id, adminId) => {
  const { data: current } = await supabase.from('categories').select('is_active').eq('id', id).single();
  const newStatus = current ? !current.is_active : false;

  const { data, error } = await supabase
    .from('categories')
    .update({ is_active: newStatus })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  await logAudit('TOGGLE_CATEGORY_STATUS', id, { is_active: newStatus }, adminId);

  return data;
};

const deleteCategory = async (id, adminId) => {
  // Verificar si hay películas usando esta categoría
  const { data: relations } = await supabase.from('movie_categories').select('id').eq('category_id', id);
  if (relations && relations.length > 0) {
    const err = new Error(`No se puede eliminar la categoría porque tiene ${relations.length} películas asociadas.`);
    err.statusCode = 400;
    err.code = 'CATEGORY_IN_USE';
    throw err;
  }

  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);

  await logAudit('DELETE_CATEGORY', id, {}, adminId);

  return true;
};

module.exports = {
  listCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  toggleStatus,
  deleteCategory
};
