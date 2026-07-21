const supabase = require('../config/supabase');

// Obtener todas las películas destacadas (Banners)
const getBanners = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Alternar estado de destacado para una película
const toggleBanner = async (req, res) => {
  const { id } = req.params;
  const { is_featured } = req.body;

  try {
    const { data, error } = await supabase
      .from('movies')
      .update({ is_featured })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBanners, toggleBanner };
