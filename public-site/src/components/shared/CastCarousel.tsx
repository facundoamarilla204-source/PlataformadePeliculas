"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CastCarousel({ cast }: { cast: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -400, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <div className="relative group">
      {/* Botones de navegación (ocultos en móvil, se muestran en hover en desktop) */}
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        aria-label="Scroll left"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Contenedor con scroll horizontal */}
      <div 
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {cast.map((actor: any) => (
          <div 
            key={actor.id} 
            className="flex-none w-32 sm:w-36 md:w-40 snap-start bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800"
          >
            {/* Foto del actor */}
            <div className="w-full aspect-[2/3] bg-neutral-800 relative">
              {actor.profile_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`} 
                  alt={actor.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-600">
                  Sin Foto
                </div>
              )}
            </div>
            
            {/* Nombres */}
            <div className="p-3">
              <h3 className="text-white text-sm font-bold truncate" title={actor.name}>
                {actor.name}
              </h3>
              <p className="text-neutral-400 text-xs mt-1 line-clamp-2" title={actor.character}>
                {actor.character}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
        aria-label="Scroll right"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}
