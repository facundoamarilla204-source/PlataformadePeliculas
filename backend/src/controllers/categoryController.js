const supabase = require('../config/supabase');

const getAllCategories = async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const createCategory = async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from('categories').insert([{ name }]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', id).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).send();
};

module.exports = { getAllCategories, createCategory, updateCategory, deleteCategory };
