"use client";

import { motion } from "framer-motion";
import { MovieCard } from "./MovieCard";

interface MovieRowProps {
  title: string;
  movies: any[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="py-6 px-4 md:px-8">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      {/* We use a simple horizontal scroll container instead of a complex carousel for MVP */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {movies.map((movie, i) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="snap-start shrink-0 w-32 sm:w-40 md:w-48 lg:w-56"
          >
            <MovieCard
              id={movie.id}
              title={movie.title}
              posterUrl={movie.poster_url || "https://via.placeholder.com/300x450?text=No+Poster"}
              year={movie.release_year}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
