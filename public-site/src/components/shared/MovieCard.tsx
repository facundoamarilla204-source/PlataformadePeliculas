"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year?: number;
  duration?: string;
  genres?: string[];
}

export function MovieCard({ id, title, posterUrl, year, duration = "2h 10m", genres = [] }: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`} className="block w-full">
      <motion.div
        whileHover={{ scale: 1.03, y: -4 }}
        transition={{ duration: 0.2 }}
        className="group relative aspect-[2/3] w-full overflow-hidden rounded-md bg-surface shadow-md hover:shadow-xl transition-shadow"
      >
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-70"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop";
          }}
        />

        {/* Gradient Overlay for Text Legibility (Always visible slightly at bottom, stronger on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/20 to-transparent opacity-80 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          
          {/* Quick Play Button */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 sm:group-hover:opacity-100 transition-all duration-300 scale-90 sm:group-hover:scale-100">
             <div className="rounded-full bg-primary/90 p-3 shadow-lg shadow-primary/30 backdrop-blur-sm flex items-center justify-center">
              <Play className="h-6 w-6 text-white ml-1 fill-current" />
            </div>
          </div>

          <div className="transform translate-y-4 sm:group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-1 mb-1">{title}</h3>
            
            <div className="flex items-center gap-2 text-xs text-text-secondary mb-2">
              {year && <span>{year}</span>}
              {year && <span className="w-1 h-1 rounded-full bg-surface-hover" />}
              <span>{duration}</span>
            </div>
            
            <div className="flex items-center gap-2 flex-wrap hidden sm:flex">
              {genres.slice(0, 2).map((genre, idx) => (
                <span key={idx} className="text-[10px] uppercase font-semibold text-primary tracking-wider bg-primary/10 px-1.5 py-0.5 rounded">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
