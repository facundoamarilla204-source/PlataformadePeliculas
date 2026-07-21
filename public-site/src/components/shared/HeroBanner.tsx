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
        <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 pb-12 sm:pb-16 md:pb-24">
          <div className="w-full lg:w-2/3 text-left">
            <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest shadow-[0_0_20px_rgba(229,9,20,0.5)]">
              Destacado de la semana
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-5 drop-shadow-2xl">
              {title}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 line-clamp-3 md:line-clamp-4 drop-shadow-lg max-w-2xl font-medium">
              {overview}
            </p>
            <div className="flex items-center gap-4">
              <Link href={`/movie/${id}`}>
                <Button size="lg" className="gap-2 bg-primary hover:bg-primary-hover text-white transition-all duration-300 border-0 shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:shadow-[0_0_30px_rgba(229,9,20,0.6)] px-8 py-6 text-lg font-bold">
                  <Play className="h-6 w-6 fill-current" />
                  Ver Ahora
                </Button>
              </Link>
              <Link href={`/movie/${id}`}>
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
    </div>
  );
}
