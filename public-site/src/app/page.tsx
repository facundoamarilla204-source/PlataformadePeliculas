import { HeroBanner } from "@/components/shared/HeroBanner";
import { MovieRow } from "@/components/shared/MovieRow";
import { fetchFeaturedMovie, fetchMoviesByCategory, fetchCategories, recordSiteView } from "@/lib/api";

export const dynamic = 'force-dynamic';

export default async function Home() {
  recordSiteView();
  const featured = await fetchFeaturedMovie();
  const rawCategories = await fetchCategories();
  const categoriesList = Array.isArray(rawCategories) ? rawCategories : (rawCategories?.data || []);
  const allMovies = await fetchMoviesByCategory();

  // Process categories and ensure movies are attached
  let categories = await Promise.all(
    categoriesList.map(async (cat: any, index: number) => {
      const catName = typeof cat === 'string' ? cat : cat.name;
      const catSlug = typeof cat === 'string' ? cat.toLowerCase().replace(/ /g, '-') : (cat.slug || catName.toLowerCase().replace(/ /g, '-'));
      const catId = typeof cat === 'string' ? `cat-${index}` : cat.id || `cat-${index}`;
      
      let movies = await fetchMoviesByCategory(catSlug);
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

  return (
    <main className="w-full flex flex-col min-h-screen pb-20">
      {featured && (
        <HeroBanner
          id={featured.slug || featured.id}
          title={featured.title}
          overview={featured.overview || "Sin sinopsis disponible."}
          backdropUrl={featured.backdrop_url || "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop"}
        />
      )}

      <div className="flex-1 mt-0 sm:-mt-12 z-10 relative space-y-4">
        {categories.map((cat, index) => (
          cat.movies && cat.movies.length > 0 && (
            <MovieRow 
              key={cat.id || index} 
              title={cat.name} 
              movies={cat.movies} 
              isHorizontalVariant={index === 0 || cat.name === 'Estrenos Destacados'} 
            />
          )
        ))}
      </div>
    </main>
  );
}
