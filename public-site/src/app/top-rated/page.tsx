import React from 'react';
import type { Metadata } from 'next';
import { Film, Trophy } from 'lucide-react';
import { MovieCard } from '@/components/shared/MovieCard';
import { fetchMoviesByCategory, fetchTMDBDetails } from '@/lib/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mejor valoradas - Plataforma de Películas',
  description: 'Descubre las películas mejor valoradas por la audiencia.',
};

export default async function TopRatedPage() {
  const movies = await fetchMoviesByCategory();
  
  // Fetch TMDB details in parallel
  const moviesWithRating = await Promise.all(
    movies.map(async (movie: any) => {
      let rating = 0;
      let voteCount = 0;
      if (movie.tmdb_id) {
        const tmdbDetails = await fetchTMDBDetails(movie.tmdb_id);
        if (tmdbDetails) {
          rating = tmdbDetails.vote_average || 0;
          voteCount = tmdbDetails.vote_count || 0;
        }
      }
      return { ...movie, rating, voteCount };
    })
  );

  // Sort by rating desc, then vote count desc, then release year desc
  const sortedMovies = moviesWithRating.sort((a, b) => {
    if (b.rating !== a.rating) return b.rating - a.rating;
    if (b.voteCount !== a.voteCount) return b.voteCount - a.voteCount;
    return (b.release_year || 0) - (a.release_year || 0);
  });

  return (
    <main className="w-full flex flex-col min-h-screen pb-24 pt-32 px-4 md:px-12 max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-surface border border-surface-hover p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
            <Trophy className="w-3.5 h-3.5" /> Ranking Global
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Mejor valoradas
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Descubre las películas mejor valoradas por la audiencia, ordenadas por su puntuación en TMDb.
          </p>
        </div>
      </div>

      {/* Movies Grid */}
      {sortedMovies.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-surface-hover space-y-4">
          <Film className="w-12 h-12 text-text-secondary mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-foreground">No hay películas disponibles</h3>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {sortedMovies.map((movie: any) => (
            <div key={movie.id} className="relative group">
              {movie.rating > 0 && (
                <div className="absolute top-2 left-2 z-20 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-xs font-bold shadow-xl">
                  <Trophy className="w-3 h-3 text-yellow-500" />
                  {movie.rating.toFixed(1)}
                </div>
              )}
              <MovieCard
                id={movie.id}
                title={movie.title}
                posterUrl={movie.poster_url}
                year={movie.release_year}
                duration={movie.duration}
              />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
