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
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[85vh] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1920&auto=format&fit=crop";
          }}
        />
        {/* Gradients to blend with background and make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="mx-auto w-full max-w-[1600px] p-6 sm:p-12 md:p-16 md:w-2/3 lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-text-secondary mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-md max-w-2xl">
              {overview}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/movie/${id}`}>
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary-hover text-white transition-colors border-0">
                  <Play className="h-5 w-5 fill-current" />
                  Ver Ahora
                </Button>
              </Link>
              <Link href={`/movie/${id}`}>
                <Button variant="secondary" size="lg" className="gap-2 bg-surface hover:bg-surface-hover text-foreground border border-surface-hover transition-colors">
                  <Info className="h-5 w-5" />
                  Más Info
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
