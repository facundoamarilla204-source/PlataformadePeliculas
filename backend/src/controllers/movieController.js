const supabase = require('../config/supabase');

const getAllMovies = async (req, res) => {
  const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  const { data: movie, error } = await supabase.from('movies').select('*').eq('id', id).single();
  
  if (error) return res.status(500).json({ error: error.message });
  if (!movie) return res.status(404).json({ error: 'Película no encontrada' });

  // Buscar categorías asociadas
  const { data: categories } = await supabase.from('movie_categories').select('category_id').eq('movie_id', id);
  movie.category_ids = categories ? categories.map(c => c.category_id) : [];

  res.json(movie);
};

const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const getMovieBySlug = async (req, res) => {
  const { slug } = req.params;
  
  // Buscar películas cuyo título empiece con la primera palabra del slug para optimizar.
  // Si el título empieza con un caracter especial que fue removido, fallaría el LIKE, 
  // por lo que buscamos usando un patrón más amplio si es posible.
  const firstWord = slug.split('-')[0];
  
  const { data, error } = await supabase.from('movies')
    .select('*')
    .ilike('title', `${firstWord}%`);
  
  if (error) return res.status(500).json({ error: error.message });
  
  // Buscar coincidencia exacta del slug
  const movie = data ? data.find(m => generateSlug(m.title) === slug) : null;
  
  if (!movie) {
    // Fallback: el título original puede tener acentos en la primera palabra (ej. "Posesión") 
    // y el firstWord del slug ("posesion") no coincidirá en el ilike de Postgres.
    // Hacemos un fetch ligero de id y title de TODAS las películas y filtramos en JS.
    const { data: allData } = await supabase.from('movies').select('id, title');
    const match = allData ? allData.find(m => generateSlug(m.title) === slug) : null;
    
    if (!match) {
      return res.status(404).json({ error: 'Película no encontrada' });
    }
    
    const { data: fallbackMovie } = await supabase.from('movies').select('*').eq('id', match.id).single();
    
    const { data: categories } = await supabase.from('movie_categories').select('category_id').eq('movie_id', fallbackMovie.id);
    fallbackMovie.category_ids = categories ? categories.map(c => c.category_id) : [];
    return res.json(fallbackMovie);
  }

  // Buscar categorías asociadas
  const { data: categories } = await supabase.from('movie_categories').select('category_id').eq('movie_id', movie.id);
  movie.category_ids = categories ? categories.map(c => c.category_id) : [];

  res.json(movie);
};

const mapMoviePayload = (body) => {
  const payload = {};
  if (body.title) payload.title = body.title;
  if (body.overview !== undefined) payload.overview = body.overview;
  
  const poster = body.poster_url || body.poster_path;
  if (poster) payload.poster_url = poster;

  const backdrop = body.backdrop_url || body.backdrop_path;
  if (backdrop) payload.backdrop_url = backdrop;

  const trailer = body.trailer_url || body.video_url;
  if (trailer) payload.trailer_url = trailer;

  if (body.release_year) {
    payload.release_year = parseInt(body.release_year, 10);
  } else if (body.release_date) {
    const year = new Date(body.release_date).getFullYear();
    if (!isNaN(year)) payload.release_year = year;
  }

  if (body.duration) {
    payload.duration = parseInt(body.duration, 10);
  }

  if (body.status) payload.status = body.status;
  if (body.is_featured !== undefined) payload.is_featured = body.is_featured;

  // Streaming fields
  if (body.tmdb_id !== undefined) payload.tmdb_id = body.tmdb_id ? parseInt(body.tmdb_id, 10) : null;
  if (body.imdb_id !== undefined) payload.imdb_id = body.imdb_id || null;
  if (body.streaming_provider !== undefined) payload.streaming_provider = body.streaming_provider;

  if (body.type !== undefined) payload.type = body.type;
  if (body.season !== undefined) payload.season = body.season ? parseInt(body.season, 10) : null;
  if (body.episode !== undefined) payload.episode = body.episode ? parseInt(body.episode, 10) : null;

  if (body.streaming_mode !== undefined) payload.streaming_mode = body.streaming_mode;
  if (body.streaming_manual_url !== undefined) payload.streaming_manual_url = body.streaming_manual_url;

  return payload;
};

const createMovie = async (req, res) => {
  const payload = mapMoviePayload(req.body);
  const { data, error } = await supabase.from('movies').insert([payload]).select().single();
  
  if (error) return res.status(500).json({ error: error.message });

  // Asociar categorías
  if (req.body.category_ids && Array.isArray(req.body.category_ids)) {
    const categoryLinks = req.body.category_ids.map(catId => ({
      movie_id: data.id,
      category_id: catId
    }));
    
    if (categoryLinks.length > 0) {
      await supabase.from('movie_categories').insert(categoryLinks);
    }
  }

  res.status(201).json(data);
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const payload = mapMoviePayload(req.body);
  
  const { data, error } = await supabase.from('movies').update(payload).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });

  // Actualizar categorías
  if (req.body.category_ids && Array.isArray(req.body.category_ids)) {
    // 1. Eliminar relaciones existentes
    await supabase.from('movie_categories').delete().eq('movie_id', id);
    
    // 2. Insertar nuevas relaciones
    const categoryLinks = req.body.category_ids.map(catId => ({
      movie_id: id,
      category_id: catId
    }));
    
    if (categoryLinks.length > 0) {
      await supabase.from('movie_categories').insert(categoryLinks);
    }
  }

  res.json(data);
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  
  // Eliminar referencias previas (aunque Supabase con ON DELETE CASCADE podría hacerlo solo)
  await supabase.from('movie_categories').delete().eq('movie_id', id);
  
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  
  res.status(204).send();
};

const recordMovieView = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('movie_views').insert([{ movie_id: id }]);
    if (error) {
      console.error('Error registrando vista:', error);
      // No fallamos la petición para el frontend público
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllMovies, getMovieById, getMovieBySlug, createMovie, updateMovie, deleteMovie, recordMovieView };
