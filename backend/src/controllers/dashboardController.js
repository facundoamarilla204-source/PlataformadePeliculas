const supabase = require('../config/supabase');

const getDashboardStats = async (req, res) => {
  try {
    // 1. Obtener cantidad de películas
    const { count: moviesCount, error: moviesError } = await supabase
      .from('movies')
      .select('*', { count: 'exact', head: true });
    if (moviesError) throw moviesError;

    // 2. Obtener cantidad de categorías
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    if (categoriesError) throw categoriesError;

    // 3. Obtener visitas de la página (Reemplaza "Banners Activos")
    const { count: siteViewsCount, error: siteViewsError } = await supabase
      .from('site_views')
      .select('*', { count: 'exact', head: true });
    
    // Si la tabla aún no existe, siteViewsError se disparará, pero no queremos romper el dashboard.
    const finalSiteViews = siteViewsError ? 0 : siteViewsCount;

    // 4. Datos Reales de Categorías
    // Obtenemos todas las categorías
    const { data: categoriesData } = await supabase.from('categories').select('id, name');
    // Obtenemos todas las relaciones de películas y categorías
    const { data: movieCategoriesData } = await supabase.from('movie_categories').select('category_id');

    let categoryChartData = [];
    if (categoriesData && movieCategoriesData) {
      // Contar ocurrencias de cada category_id
      const counts = {};
      movieCategoriesData.forEach(rel => {
        counts[rel.category_id] = (counts[rel.category_id] || 0) + 1;
      });

      categoryChartData = categoriesData.map(cat => ({
        name: cat.name,
        value: counts[cat.id] || 0
      })).filter(cat => cat.value > 0); // Solo mostrar categorías con películas
    }

    // 5. Datos Reales de Reproducciones
    // Asumimos que existirá una tabla 'movie_views'
    let viewsCount = 0;
    let viewsChartData = [];
    
    // Obtenemos la fecha de hace 6 meses
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0,0,0,0);

    const { data: viewsData, error: viewsDataError } = await supabase
      .from('movie_views')
      .select('created_at')
      .gte('created_at', sixMonthsAgo.toISOString());

    if (!viewsDataError && viewsData) {
      viewsCount = viewsData.length;
      
      // Agrupar por mes
      const monthCounts = {};
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      viewsData.forEach(view => {
        const date = new Date(view.created_at);
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`; // ej: 2024-6
        monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
      });

      // Crear el array para los últimos 6 meses en orden
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        viewsChartData.push({
          name: monthNames[d.getMonth()],
          views: monthCounts[key] || 0
        });
      }
    } else {
      // Si la tabla no existe, enviamos 0s
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        viewsChartData.push({
          name: monthNames[d.getMonth()],
          views: 0
        });
      }
      console.log("Tabla movie_views no encontrada o error:", viewsDataError);
    }

    res.json({
      stats: {
        movies: moviesCount || 0,
        categories: categoriesCount || 0,
        users: finalSiteViews, // Seguimos pasándolo como 'users' para mantener el key en el frontend
        views: viewsCount
      },
      charts: {
        views: viewsChartData,
        categories: categoryChartData
      }
    });

  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ error: error.message });
  }
};

const recordSiteView = async (req, res) => {
  try {
    const { error } = await supabase.from('site_views').insert([{}]); // Solo un registro vacío si solo tiene ID
    if (error) {
      console.error('Error registrando visita al sitio:', error);
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboardStats, recordSiteView };
