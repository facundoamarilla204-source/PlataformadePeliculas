import { Header } from "@/components/layout/Header";
import type { Metadata } from "next";
import { fetchMovieBySlug, recordMovieView, fetchMovieStreamingUrl, fetchTMDBDetails } from "@/lib/api";
import { Play, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CastCarousel } from "@/components/shared/CastCarousel";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const movie = await fetchMovieBySlug(resolvedParams.slug);
  
  if (!movie) {
    return {
      title: "Película no encontrada",
    };
  }

  const title = `${movie.title} - Ver Online`;
  const description = movie.overview || `Disfruta de ${movie.title} y muchas más películas en nuestra plataforma.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [movie.poster_url || movie.backdrop_url],
      type: 'video.movie',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [movie.backdrop_url || movie.poster_url],
    }
  };
}

export const dynamic = 'force-dynamic';

export default async function MoviePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const movie = await fetchMovieBySlug(resolvedParams.slug);
  
  let streamingUrl = null;
  let tmdbDetails = null;

  if (movie) {
    streamingUrl = await fetchMovieStreamingUrl(movie.id);
    recordMovieView(movie.id);
    
    if (movie.tmdb_id) {
      tmdbDetails = await fetchTMDBDetails(movie.tmdb_id);
    }
  }

  if (!movie) {
    return (
      <main className="w-full flex flex-col min-h-screen items-center justify-center">
        <h1 className="text-3xl text-white">Película no encontrada</h1>
        <Link href="/" className="mt-4 text-red-500 hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  // Fallbacks if TMDB details are missing
  const originalTitle = tmdbDetails?.original_title || movie.title;
  const tagline = tmdbDetails?.tagline || "";
  const genres = tmdbDetails?.genres?.map((g: any) => g.name).join(", ") || movie.categories.join(", ");
  const rating = tmdbDetails?.vote_average ? tmdbDetails.vote_average.toFixed(1) : "N/A";
  const votes = tmdbDetails?.vote_count || 0;
  const runtime = tmdbDetails?.runtime ? `${tmdbDetails.runtime} min` : movie.duration;
  const releaseDate = tmdbDetails?.release_date || movie.release_year;
  const countries = tmdbDetails?.production_countries?.map((c: any) => c.iso_3166_1).join(", ") || "N/A";
  const cast = tmdbDetails?.credits?.cast?.slice(0, 20) || [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "image": movie.poster_url || movie.backdrop_url,
    "description": movie.overview,
    "dateCreated": releaseDate,
    "director": movie.director ? {
      "@type": "Person",
      "name": movie.director
    } : undefined,
  };

  return (
    <main className="w-full flex flex-col min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* SECCIÓN 1: Datos de la película (Hero) */}
      <div className="relative w-full min-h-[85vh] flex items-center mt-0 sm:mt-4 rounded-b-3xl sm:rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_url || "https://via.placeholder.com/1920x1080?text=No+Background"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 flex flex-col md:flex-row items-start gap-8 p-6 sm:p-12 md:p-16 w-full max-w-7xl mx-auto">
          {/* Poster */}
          <div className="hidden md:block shrink-0 w-72 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-neutral-800">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-auto object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 text-white pt-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-2 drop-shadow-lg text-white">
              {movie.title}
            </h1>
            
            {tagline && (
              <p className="text-xl text-neutral-400 italic mb-4 font-medium">
                "{tagline}"
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300 mb-6 font-medium">
              <span>{releaseDate}</span>
              <span>•</span>
              <span>{genres}</span>
              <span>•</span>
              <span>{runtime}</span>
              <span>•</span>
              <span>{countries}</span>
              {movie.classification && (
                <>
                  <span>•</span>
                  <span className="border border-neutral-600 px-1.5 py-0.5 rounded text-xs font-bold">
                    {movie.classification}
                  </span>
                </>
              )}
            </div>
            
            {/* Score Badges */}
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 bg-black/50 border border-neutral-700 rounded-lg px-4 py-2">
                <div className="bg-yellow-500 text-black text-xs font-bold px-1.5 rounded">TMDB</div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-lg">{rating}</span>
                </div>
                <div className="text-xs text-neutral-400 ml-1">({votes} votos)</div>
              </div>
              
              {/* IMDB Simulado con el mismo rating como se acordó en el plan */}
              <div className="flex items-center gap-2 bg-black/50 border border-neutral-700 rounded-lg px-4 py-2">
                <div className="bg-yellow-500 text-black text-xs font-bold px-1.5 rounded">IMDb</div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="font-bold text-lg">{rating}</span>
                </div>
              </div>
            </div>

            <p className="text-base sm:text-lg text-neutral-200 mb-8 max-w-3xl leading-relaxed">
              {tmdbDetails?.overview || movie.overview}
            </p>

            <div className="flex flex-col gap-2 text-sm mb-8 text-neutral-400">
              {originalTitle && originalTitle !== movie.title && (
                <div>
                  <span className="text-white font-semibold">Título original: </span> {originalTitle}
                </div>
              )}
              {movie.director && (
                <div>
                  <span className="text-white font-semibold">Director: </span> {movie.director}
                </div>
              )}
            </div>

            {/* Anchor button to scroll to video */}
            <a href="#video-player">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-full shadow-[0_0_20px_var(--primary)] hover:shadow-[0_0_30px_var(--primary)]">
                <Play className="h-6 w-6 fill-current" />
                Ver Película
              </Button>
            </a>
          </div>
        </div>
      </div>
      
      {/* SECCIÓN: ELENCO */}
      {cast && cast.length > 0 && (
        <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-8">
          <h2 className="text-2xl font-bold text-white mb-6">Elenco Principal</h2>
          <CastCarousel cast={cast} />
        </div>
      )}

      {/* SECCIÓN: Reproductor de Video */}
      <div id="video-player" className="w-full flex flex-col items-center py-12 px-4 sm:px-8 mb-24">
        <h2 className="text-2xl font-bold text-white mb-6 self-start max-w-6xl mx-auto w-full">
          Reproductor
        </h2>
        
        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center relative">
          {streamingUrl ? (
            <iframe 
              src={streamingUrl} 
              className="w-full h-full border-0 absolute top-0 left-0" 
              allowFullScreen 
              allow="autoplay; fullscreen"
              referrerPolicy="origin"
            ></iframe>
          ) : (
            <div className="text-neutral-500 flex flex-col items-center">
              <Play className="h-16 w-16 mb-4 opacity-20" />
              <p>El video no está disponible por el momento.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
