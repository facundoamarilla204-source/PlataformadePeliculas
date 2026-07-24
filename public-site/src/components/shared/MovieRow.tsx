"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MovieCard } from "./MovieCard";
import { MovieCardHorizontal } from "./MovieCardHorizontal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface MovieRowProps {
  title: string;
  movies: any[];
  isHorizontalVariant?: boolean;
  categorySlug?: string;
}

export function MovieRow({ title, movies, isHorizontalVariant = false, categorySlug }: MovieRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("resize", handleScroll);
    return () => window.removeEventListener("resize", handleScroll);
  }, [movies]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth + 100 : clientWidth - 100;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  const targetSlug = categorySlug || title.replace(/🔥/g, '').trim().toLowerCase().replace(/[^a-z0-9áéíóúñ -]/g, '').replace(/ /g, '-');

  return (
    <div className="py-4 relative group/row">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 mb-4 flex justify-between items-center sm:pr-12">
        <h2 className="text-xl md:text-2xl font-bold text-foreground tracking-tight">{title}</h2>
        <Link 
          href={`/category/${targetSlug}`}
          className="text-sm font-semibold text-primary/90 hover:text-primary transition-colors flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-4 py-1.5 rounded-full mr-2 sm:mr-4"
        >
          Ver todas <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="relative mx-auto w-full max-w-[1600px]">
        {/* Left Fade & Arrow */}
        {showLeftArrow && (
          <div className="absolute left-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-r from-background to-transparent z-10 flex items-center justify-start px-2 sm:px-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden sm:flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-surface/50 backdrop-blur-md text-foreground hover:bg-surface hover:text-primary border border-surface-hover shadow-lg"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
        )}

        {/* Scroll Container */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-6 pt-2 px-4 md:px-8 snap-x snap-mandatory hide-scrollbar"
        >
          {movies.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`snap-start shrink-0 ${isHorizontalVariant ? 'w-64 sm:w-80 md:w-96' : 'w-36 sm:w-44 md:w-52 lg:w-60'}`}
            >
              {isHorizontalVariant ? (
                <MovieCardHorizontal
                  id={movie.slug || movie.id}
                  title={movie.title}
                  backdropUrl={movie.backdrop_url || "https://via.placeholder.com/600x338?text=No+Background"}
                  year={movie.release_year}
                  duration={movie.duration}
                  genres={movie.categories}
                />
              ) : (
                <MovieCard
                  id={movie.slug || movie.id}
                  title={movie.title}
                  posterUrl={movie.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"}
                  year={movie.release_year}
                  duration={movie.duration}
                  genres={movie.categories}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Fade & Arrow */}
        {showRightArrow && (
          <div className="absolute right-0 top-0 bottom-4 w-12 sm:w-24 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end px-2 sm:px-4 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 hidden sm:flex">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full bg-surface/50 backdrop-blur-md text-foreground hover:bg-surface hover:text-primary border border-surface-hover shadow-lg"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
