const supabase = require('../config/supabase');

const getAllMovies = async (req, res) => {
  const { data, error } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const getMovieById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Película no encontrada' });
  res.json(data);
};

const createMovie = async (req, res) => {
  // TODO: Validaciones y manejo de categorías intermedio (movie_categories)
  const { data, error } = await supabase.from('movies').insert([req.body]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updateMovie = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('movies').update(req.body).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deleteMovie = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('movies').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };
