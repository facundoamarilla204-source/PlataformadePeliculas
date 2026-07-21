const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

const sanitize = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>?/gm, '').trim();
};

const validateCategoryInput = (req, res, next) => {
  let { name, description, slug, is_active } = req.body;

  const errors = {};

  // Sanitización
  name = sanitize(name);
  description = sanitize(description);

  // Validación de Nombre
  if (!name) {
    errors.name = 'El nombre de la categoría es obligatorio.';
  } else if (name.length < 2) {
    errors.name = 'El nombre debe tener al menos 2 caracteres.';
  } else if (name.length > 50) {
    errors.name = 'El nombre no puede exceder los 50 caracteres.';
  }

  // Validación / Generación de Slug
  if (!slug || slug.trim() === '') {
    slug = generateSlug(name);
  } else {
    slug = generateSlug(slug);
  }

  if (slug.length > 60) {
    errors.slug = 'El slug no puede exceder los 60 caracteres.';
  }

  // Validación de Descripción
  if (description && description.length > 255) {
    errors.description = 'La descripción no puede exceder los 255 caracteres.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Error de validación de datos',
      details: errors
    });
  }

  // Inyectar datos sanitizados
  req.body = {
    name,
    slug,
    description: description || null,
    is_active: is_active !== undefined ? Boolean(is_active) : true
  };

  next();
};

module.exports = { validateCategoryInput, generateSlug };
