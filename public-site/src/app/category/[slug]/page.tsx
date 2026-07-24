import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Film, Sparkles, Filter } from 'lucide-react';
import { MovieCard } from '@/components/shared/MovieCard';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

import { fetchMoviesByCategory } from '@/lib/api';

async function getCategoryData(slug: string) {
  try {
    const [catRes, mappedMovies] = await Promise.all([
      fetch(`${API_URL}/categories/slug/${slug}`, { cache: 'no-store' }),
      fetchMoviesByCategory(slug)
    ]);

    const category = catRes.ok ? await catRes.json() : { name: slug.replace(/-/g, ' '), slug, description: 'Catálogo de títulos cinematográficos.' };

    return { category, movies: mappedMovies };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      category: { name: slug.replace(/-/g, ' '), slug, description: 'Catálogo de películas.' },
      movies: []
    };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { category } = await getCategoryData(slug);
  const title = `Películas de ${category.name} - Ver Online`;
  const description = category.description || `Explora nuestro catálogo seleccionado de películas de ${category.name} en alta definición.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    }
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { category, movies } = await getCategoryData(slug);

  return (
    <main className="w-full flex flex-col min-h-screen pb-24 pt-20 px-4 md:px-12 max-w-[1600px] mx-auto">
      {/* Navigation Breadcrumbs */}
      <div className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-text-secondary">
        <Link 
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Inicio
        </Link>
        <span>/</span>
        <span className="text-white font-medium capitalize">{category.name}</span>
      </div>

      {/* Category Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-surface/80 via-surface to-background border border-surface-hover p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-primary rounded-full shrink-0" />
            <h1 className="text-3xl md:text-5xl font-black text-foreground capitalize tracking-tight">
              {category.name}
            </h1>
          </div>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed pl-4">
            {category.description || `Explora nuestra selección completa de películas en la categoría de ${category.name}.`}
          </p>

          <div className="flex items-center gap-4 pt-2 pl-4 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 bg-background/80 px-3 py-1.5 rounded-lg border border-surface-hover font-semibold text-foreground">
              <Film className="w-4 h-4 text-primary" /> {movies.length} {movies.length === 1 ? 'Título disponible' : 'Títulos disponibles'}
            </span>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {movies.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-3xl border border-surface-hover space-y-4">
          <Film className="w-12 h-12 text-text-secondary mx-auto opacity-50" />
          <h3 className="text-xl font-bold text-foreground">No hay películas en esta categoría</h3>
          <p className="text-sm text-text-secondary">Pronto agregaremos más estrenos y clásicos a esta sección.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {movies.map((movie: any) => (
            <MovieCard
              key={movie.id}
              id={movie.slug || movie.id}
              title={movie.title}
              posterUrl={movie.poster_url || movie.poster_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
              year={movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 2024)}
              duration={movie.duration ? `${movie.duration}` : "2h 00m"}
            />
          ))}
        </div>
      )}
    </main>
  );
}
