"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play } from "lucide-react";

interface MovieCardProps {
  id: string;
  title: string;
  posterUrl: string;
  year?: number;
}

export function MovieCard({ id, title, posterUrl, year }: MovieCardProps) {
  return (
    <Link href={`/movie/${id}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="group relative aspect-[2/3] w-full overflow-hidden rounded-md bg-neutral-900 cursor-pointer"
      >
        {/* Poster Image */}
        <img
          src={posterUrl}
          alt={title}
          className="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-60"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40">
          <div className="rounded-full bg-red-600 p-3 shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            <Play className="h-6 w-6 text-white ml-1" />
          </div>
          <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-black to-transparent text-center">
            <h3 className="text-sm font-bold text-white line-clamp-1">{title}</h3>
            {year && <p className="text-xs text-neutral-300 mt-1">{year}</p>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
