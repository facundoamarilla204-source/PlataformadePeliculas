"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlaySquare } from "lucide-react";

const Instagram = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
);

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const pathname = usePathname();

  if (pathname?.startsWith('/admi')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#040608] border-t border-neutral-800 py-12 px-4 md:px-8 mt-auto z-10 relative">
      <div className="mx-auto w-full max-w-[1600px]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 mb-12">
          {/* Brand & Socials */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary-hover transition-colors mb-2">
              {logoUrl || '/logo.png' ? (
                <img src={logoUrl && logoUrl.startsWith('http') ? logoUrl : '/logo.png'} alt="Logo" className="h-12 w-auto object-contain" />
              ) : (
                <>
                  <PlaySquare className="h-8 w-8" />
                  <span className="text-xl font-black tracking-tight">MOVIES</span>
                </>
              )}
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-xs">
              La plataforma definitiva para explorar tus películas y series favoritas con la mejor calidad y experiencia.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://www.instagram.com/cinarisok/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors bg-neutral-900 p-2 rounded-full hover:bg-neutral-800">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links: Soporte */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-base mb-2">Soporte</h3>
            <Link href="/solicitar" className="text-sm text-neutral-400 hover:text-white transition-colors">Solicitar película</Link>
          </div>

          {/* Links: Legal */}
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-white text-base mb-2">Legal</h3>
            <Link href="/terminos" className="text-sm text-neutral-400 hover:text-white transition-colors">Términos de Servicio</Link>
            <Link href="/privacidad" className="text-sm text-neutral-400 hover:text-white transition-colors">Política de Privacidad</Link>
            <Link href="/dmca" className="text-sm text-neutral-400 hover:text-white transition-colors">Política de Derechos de Autor (DMCA)</Link>
          </div>
        </div>

        <div className="w-full h-px bg-neutral-800 mb-6"></div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} CINARIS. Todos los derechos reservados.</p>
          <p>Hecho por <Link href="https://playcomun.com" target="_blank" rel="noopener noreferrer">@playcomun</Link> para amantes del cine.</p>
        </div>
      </div>
    </footer>
  );
}
