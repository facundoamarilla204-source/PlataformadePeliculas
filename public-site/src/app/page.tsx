import { Header } from "@/components/layout/Header";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { MovieRow } from "@/components/shared/MovieRow";
import { fetchFeaturedMovie, fetchMoviesByCategory, fetchCategories } from "@/lib/api";

// We use dynamic data fetching for Next.js App Router
export const dynamic = 'force-dynamic';

export default async function Home() {
  const featured = await fetchFeaturedMovie();
  const categoriesList = await fetchCategories();

  // Fetch movies for each category
  const categories = await Promise.all(
    categoriesList.map(async (cat) => {
      let movies = await fetchMoviesByCategory(cat.name);
      if (cat.name === 'Estrenos') {
        movies = await fetchMoviesByCategory(); // For 'Estrenos', show all
      }
      return { ...cat, movies };
    })
  );

  return (
    <main className="w-full flex flex-col min-h-screen">
      <Header />
      
      {featured && (
        <HeroBanner
          id={featured.id}
          title={featured.title}
          overview={featured.overview || "Sin sinopsis disponible."}
          backdropUrl={featured.backdrop_url || "https://via.placeholder.com/1920x1080?text=No+Background"}
        />
      )}

      <div className="flex-1 mt-8 pb-20">
        {categories.map(cat => (
          cat.movies.length > 0 && <MovieRow key={cat.id} title={cat.name} movies={cat.movies} />
        ))}
      </div>
    </main>
  );
}
