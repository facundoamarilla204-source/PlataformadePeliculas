"use client";

import { MovieCard } from "@/components/shared/MovieCard";
import { MovieSkeleton } from "@/components/shared/MovieSkeleton";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { fetchMoviesByCategory } from "@/lib/api";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchMovies() {
      setLoading(true);
      // In MVP, we fetch all and filter client-side.
      const allMovies = await fetchMoviesByCategory();
      const filtered = allMovies.filter((m: any) => 
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }
    if (query) {
      searchMovies();
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">
        {query ? `Resultados para "${query}"` : "Busca una película"}
      </h1>
      
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {results.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.id}
              title={movie.title}
              posterUrl={movie.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"}
              year={movie.release_year}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-secondary text-lg">
            {query ? "No se encontraron películas que coincidan con tu búsqueda." : "Ingresa un término en el buscador para empezar."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <main className="w-full flex flex-col min-h-screen pt-24 pb-20">
      <Suspense fallback={
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8">
          <h1 className="text-3xl font-bold text-foreground mb-8">Buscando...</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <MovieSkeleton key={i} />
            ))}
          </div>
        </div>
      }>
        <SearchContent />
      </Suspense>
    </main>
  );
}
