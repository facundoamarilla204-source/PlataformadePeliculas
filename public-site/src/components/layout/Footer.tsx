import Link from "next/link";
import { PlaySquare } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-footer border-t border-surface-hover mt-auto">
      <div className="mx-auto w-full max-w-[1600px] px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
              <PlaySquare className="h-6 w-6" />
              <span className="text-lg font-bold tracking-tight">MOVIES</span>
            </Link>
            <p className="text-text-secondary text-sm max-w-sm text-center md:text-left">
              Tu plataforma de entretenimiento premium. Disfruta de las mejores películas con una experiencia cinematográfica diseñada para ti.
            </p>
          </div>
          
          <nav className="flex gap-6 text-sm text-text-secondary">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <Link href="/search" className="hover:text-foreground transition-colors">Películas</Link>
            <span className="hover:text-foreground transition-colors cursor-pointer">Términos</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacidad</span>
          </nav>
        </div>
        
        <div className="mt-12 pt-8 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} Movies. Todos los derechos reservados.</p>
          <p>Diseñado para amantes del cine.</p>
        </div>
      </div>
    </footer>
  );
}
