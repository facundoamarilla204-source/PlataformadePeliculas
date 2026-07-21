"use client";

import Link from "next/link";
import { Search, Menu, PlaySquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-[#080B12]/90 backdrop-blur-md shadow-md" : "bg-gradient-to-b from-[#080B12]/80 to-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary-hover transition-colors">
            <PlaySquare className="h-7 w-7" />
            <span className="text-xl font-bold tracking-tight">
              MOVIES
            </span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-text-secondary">
            <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
            <Link href="/category/accion" className="hover:text-foreground transition-colors">Acción</Link>
            <Link href="/category/ciencia-ficcion" className="hover:text-foreground transition-colors">Ciencia Ficción</Link>
            <Link href="/category/drama" className="hover:text-foreground transition-colors">Drama</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Search */}
          <div className="relative hidden sm:flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "240px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  onSubmit={handleSearch}
                  className="mr-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar películas..."
                    autoFocus
                    className="h-9 w-full rounded-full bg-surface border border-surface-hover pl-4 pr-4 text-sm text-foreground placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary transition-all"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-text-secondary hover:text-foreground hover:bg-transparent"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search Icon */}
          <Button variant="ghost" size="icon" className="sm:hidden text-text-secondary hover:text-foreground">
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Icon */}
          <Button variant="ghost" size="icon" className="md:hidden text-text-secondary hover:text-foreground">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
