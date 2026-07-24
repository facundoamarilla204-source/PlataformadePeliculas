import { HeroBanner } from "@/components/shared/HeroBanner";
import { MovieRow } from "@/components/shared/MovieRow";
import { fetchFeaturedMovies, fetchMoviesByCategory, fetchCategories, recordSiteView, fetchGlobalSettings } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function Home() {
  recordSiteView();
  const featuredMovies = await fetchFeaturedMovies();
  const rawCategories = await fetchCategories();
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : (rawCategories?.data || []);
  const allMovies = await fetchMoviesByCategory();
  const settings = await fetchGlobalSettings();

  // Process categories and ensure movies are attached
  let categories = await Promise.all(
    categoriesList.map(async (cat: any, index: number) => {
      const catName = typeof cat === 'string' ? cat : cat.name;
      const catSlug = typeof cat === 'string' ? cat.toLowerCase().replace(/ /g, '-') : (cat.slug || catName.toLowerCase().replace(/ /g, '-'));
      const catId = typeof cat === 'string' ? `cat-${index}` : cat.id || `cat-${index}`;
      
      const movies = await fetchMoviesByCategory(catSlug);
      // Removed the fallback to `allMovies` so empty categories won't show all movies
      return { id: catId, name: catName, movies: movies || [] };
    })
  );

  // If no categories were returned from backend, create default rows from all movies
  if (categories.length === 0 && allMovies.length > 0) {
    categories = [
      { id: '1', name: 'Estrenos Destacados', movies: allMovies },
      { id: '2', name: 'Películas Más Vistas', movies: allMovies },
      { id: '3', name: 'Recomendadas Para Ti', movies: allMovies }
    ];
  }

  // Extract 'Tendencia' or 'Tendencias' to display it first with a fire emoji
  const tendenciaCatIndex = categories.findIndex(c => c.name.toLowerCase() === 'tendencia' || c.name.toLowerCase() === 'tendencias');
  let tendenciaCategory = null;
  if (tendenciaCatIndex !== -1) {
    tendenciaCategory = categories.splice(tendenciaCatIndex, 1)[0];
    if (!tendenciaCategory.name.includes('🔥')) {
      tendenciaCategory.name = "🔥 " + tendenciaCategory.name;
    }
  }

  return (
    <main className="w-full flex flex-col min-h-screen pb-20">
      <h1 className="sr-only">Plataforma de Películas - Ver Online</h1>
      
      {((featuredMovies && featuredMovies.length > 0) || settings?.home_bg_image) && (
        <HeroBanner movies={featuredMovies || []} settings={settings} />
      )}

      <div className="flex-1 mt-0 sm:-mt-12 z-10 relative space-y-4">
        {tendenciaCategory && tendenciaCategory.movies && tendenciaCategory.movies.length > 0 && (
          <MovieRow 
            key={tendenciaCategory.id} 
            title={tendenciaCategory.name} 
            movies={tendenciaCategory.movies} 
            isHorizontalVariant={true} 
          />
        )}
        
        {categories.map((cat, index) => (
          cat.movies && cat.movies.length > 0 && (
            <MovieRow 
              key={cat.id || index} 
              title={cat.name} 
              movies={cat.movies} 
              isHorizontalVariant={!tendenciaCategory && (index === 0 || cat.name === 'Estrenos Destacados')} 
            />
          )
        ))}
      </div>
    </main>
  );
}
