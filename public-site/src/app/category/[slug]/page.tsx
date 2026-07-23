import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Film, Sparkles, Filter } from 'lucide-react';
import { MovieCard } from '@/components/shared/MovieCard';

export const dynamic = 'force-dynamic';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getCategoryData(slug: string) {
  try {
    const [catRes, moviesRes] = await Promise.all([
      fetch(`${API_URL}/categories/slug/${slug}`, { cache: 'no-store' }),
      fetch(`${API_URL}/categories/slug/${slug}/movies`, { cache: 'no-store' })
    ]);

    const category = catRes.ok ? await catRes.json() : { name: slug.replace(/-/g, ' '), slug, description: 'Catálogo de títulos cinematográficos.' };
    const movies = moviesRes.ok ? await moviesRes.json() : [];

    return { category, movies };
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
      {/* Back Link */}
      <div className="mb-6">
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-white transition-colors bg-surface/50 px-4 py-2 rounded-full border border-surface-hover backdrop-blur-md"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
      </div>

      {/* Category Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-surface border border-surface-hover p-8 md:p-12 mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/5 pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase rounded-full tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Género Cinematográfico
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-foreground capitalize tracking-tight">
            {category.name}
          </h1>

          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            {category.description || `Explora nuestro catálogo seleccionado de películas de ${category.name} en alta definición.`}
          </p>

          <div className="flex items-center gap-4 pt-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1.5 bg-background/60 px-3 py-1.5 rounded-lg border border-surface-hover font-semibold text-foreground">
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
              id={movie.id}
              title={movie.title}
              posterUrl={movie.poster_url || movie.poster_path || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
              year={movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : 2024)}
              duration={movie.duration ? `${movie.duration} min` : "2h 00m"}
            />
          ))}
        </div>
      )}
    </main>
  );
}
