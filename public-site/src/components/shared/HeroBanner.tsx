"use client";

import { motion } from "framer-motion";
import { Play, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroBannerProps {
  id: string;
  title: string;
  overview: string;
  backdropUrl: string;
}

export function HeroBanner({ id, title, overview, backdropUrl }: HeroBannerProps) {
  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] overflow-hidden rounded-b-3xl sm:rounded-3xl mt-0 sm:mt-4">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Gradients to blend with background and make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-12 md:p-16 w-full md:w-2/3 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-md">
            {overview}
          </p>
          <div className="flex items-center gap-4">
            <Link href={`/movie/${id}`}>
              <Button size="lg" className="gap-2">
                <Play className="h-5 w-5 fill-current" />
                Ver Ahora
              </Button>
            </Link>
            <Link href={`/movie/${id}`}>
              <Button variant="secondary" size="lg" className="gap-2 bg-neutral-500/40 hover:bg-neutral-500/60 backdrop-blur-sm">
                <Info className="h-5 w-5" />
                Más Info
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
