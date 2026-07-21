import { Header } from "@/components/layout/Header";
import { fetchMovieById } from "@/lib/api";
import { Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = 'force-dynamic';

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await fetchMovieById(params.id);

  if (!movie) {
    return (
      <main className="w-full flex flex-col min-h-screen items-center justify-center">
        <Header />
        <h1 className="text-3xl text-white">Película no encontrada</h1>
        <Link href="/" className="mt-4 text-red-500 hover:underline">
          Volver al inicio
        </Link>
      </main>
    );
  }

  return (
    <main className="w-full flex flex-col min-h-screen">
      <Header />
      
      {/* SECCIÓN 1: Datos de la película (Hero) */}
      <div className="relative w-full h-[80vh] flex items-center mt-0 sm:mt-4 rounded-b-3xl sm:rounded-3xl overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdrop_url || "https://via.placeholder.com/1920x1080?text=No+Background"}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 p-6 sm:p-12 md:p-16 w-full">
          {/* Poster */}
          <div className="hidden md:block shrink-0 w-64 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-neutral-800">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-auto object-cover" />
          </div>

          {/* Details */}
          <div className="flex-1 text-white">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-2 drop-shadow-lg text-white">
              {movie.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-300 mb-6 font-medium">
              <span>{movie.release_year}</span>
              <span>•</span>
              <span>{movie.duration} min</span>
              {movie.classification && (
                <>
                  <span>•</span>
                  <span className="border border-neutral-600 px-1.5 py-0.5 rounded text-xs">
                    {movie.classification}
                  </span>
                </>
              )}
            </div>

            <p className="text-base sm:text-lg text-neutral-300 mb-8 max-w-3xl leading-relaxed">
              {movie.overview}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-8 text-neutral-400">
              {movie.director && (
                <div>
                  <span className="text-white font-semibold">Director: </span> {movie.director}
                </div>
              )}
              {movie.cast_members && (
                <div>
                  <span className="text-white font-semibold">Reparto: </span> {movie.cast_members}
                </div>
              )}
            </div>

            {/* Anchor button to scroll to video */}
            <a href="#video-player">
              <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Play className="h-6 w-6 fill-current" />
                Ver Película
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* SECCIÓN 2: Reproductor de Video Grande (Scroll Abajo) */}
      <div id="video-player" className="w-full flex flex-col items-center py-24 px-4 sm:px-8">
        <h2 className="text-2xl font-bold text-white mb-8 self-start max-w-6xl mx-auto w-full">
          Reproductor
        </h2>
        
        <div className="w-full max-w-6xl aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex items-center justify-center relative">
          {movie.vimeus_video_id ? (
            <iframe 
              src={`https://vimeus.com/embed/${movie.vimeus_video_id}`} 
              className="w-full h-full border-0 absolute top-0 left-0" 
              allowFullScreen 
              allow="autoplay; fullscreen"
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
