"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Movie {
  id: string;
  slug?: string;
  title: string;
  overview: string;
  backdropUrl: string;
  backdrop_url?: string;
  release_year?: number | string;
  duration?: string;
  categories?: string[];
  classification?: string;
  rating?: number | string;
}

interface HeroBannerProps {
  movies: Movie[];
  settings?: any;
}

export function HeroBanner({ movies, settings }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatic carousel
  useEffect(() => {
    if (movies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000); // 8 seconds per slide
    return () => clearInterval(interval);
  }, [movies.length]);

  if (!movies || movies.length === 0) {
    if (!settings?.home_bg_image) return null;
    
    // Render static hero from settings
    return (
      <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden group">
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={settings.home_bg_image}
              alt={settings.platform_name || "CineMatch"}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop";
              }}
            />
            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/20 to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 pb-16 sm:pb-20 md:pb-28">
              <div className="w-full lg:w-2/3 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-5 drop-shadow-2xl">
                    {settings.platform_name || "CineMatch"}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-lg max-w-2xl font-medium">
                    {settings.platform_description || "Explora el mejor catálogo de películas y series."}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href="/movie">
                      <Button size="lg" className="gap-2 bg-primary hover:bg-primary-hover text-white transition-all duration-300 border-0 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] px-8 py-6 text-lg font-bold">
                        <Play className="h-6 w-6 fill-current" />
                        Explorar Catálogo
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];
  const currentId = currentMovie.slug || currentMovie.id;
  const backdrop = currentMovie.backdropUrl || currentMovie.backdrop_url || settings?.home_bg_image || "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop";

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  };

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[90vh] overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={backdrop}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop";
              }}
            />
            {/* Gradients to blend with background and make text readable */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#080B12] to-transparent" />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 pb-16 sm:pb-24 md:pb-32">
              <div className="w-full lg:w-2/3 text-left">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <div className="inline-block bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.5)]">
                    Destacado
                  </div>
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-4 drop-shadow-2xl">
                    {currentMovie.title}
                  </h1>
                  
                  {/* METADATA BAR (Premium UX) */}
                  <div className="flex flex-wrap items-center gap-3 text-sm md:text-base text-gray-300 mb-6 font-semibold drop-shadow-md">
                    <span className="text-green-500 font-bold flex items-center gap-1">
                      ⭐ {currentMovie.rating || "8.6"}
                    </span>
                    <span className="opacity-50">•</span>
                    <span>{currentMovie.release_year || "2024"}</span>
                    <span className="opacity-50">•</span>
                    <span>{currentMovie.duration || "2h 15m"}</span>
                    {currentMovie.classification && (
                      <>
                        <span className="opacity-50">•</span>
                        <span className="border border-gray-500 px-1.5 py-0.5 rounded text-xs text-gray-300 bg-black/40 backdrop-blur-sm">
                          {currentMovie.classification}
                        </span>
                      </>
                    )}
                    {currentMovie.categories && currentMovie.categories.length > 0 && (
                      <>
                        <span className="opacity-50">•</span>
                        <span>{currentMovie.categories.slice(0, 3).join(" • ")}</span>
                      </>
                    )}
                  </div>

                  <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-lg max-w-2xl font-medium leading-relaxed">
                    {currentMovie.overview || "Sin sinopsis disponible."}
                  </p>
                  <div className="flex items-center gap-4">
                    <Link href={`/movie/${currentId}`}>
                      <Button size="lg" className="gap-2 bg-primary hover:bg-primary-hover text-white transition-all duration-300 border-0 shadow-[0_0_20px_var(--primary)] hover:shadow-[0_0_30px_var(--primary)] px-8 py-6 text-lg font-bold">
                        <Play className="h-6 w-6 fill-current" />
                        Ver Ahora
                      </Button>
                    </Link>
                    <Link href={`/movie/${currentId}`}>
                      <Button variant="secondary" size="lg" className="gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300 px-8 py-6 text-lg font-bold">
                        <Info className="h-6 w-6" />
                        Más Info
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {movies.length > 1 && (
        <>
          {/* Arrows (Visible on hover) */}
          <div className="absolute inset-y-0 left-4 md:left-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handlePrevious}
              className="p-3 rounded-full bg-black/30 text-white hover:bg-black/60 hover:scale-110 backdrop-blur-md transition-all"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          </div>
          <div className="absolute inset-y-0 right-4 md:right-8 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-black/30 text-white hover:bg-black/60 hover:scale-110 backdrop-blur-md transition-all"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-primary shadow-[0_0_10px_rgba(229,9,20,0.8)]"
                    : "w-2 bg-white/40 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
