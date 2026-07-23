"use client";

import Link from "next/link";
import { Search, Menu, PlaySquare, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header({ logoUrl, categories = [] }: { logoUrl?: string, categories?: any[] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const router = useRouter();
  const pathname = usePathname();

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
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  // Do not show header on admin routes
  if (pathname?.startsWith('/admi')) {
    return null;
  }

  const navLinks = [
    { name: "Inicio", href: "/" },
    { name: "Tendencias", href: "/category/tendencias" },
    { name: "Mejor valoradas", href: "/top-rated" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-[#080B12]/80 backdrop-blur-md shadow-lg border-b border-white/5 py-2" 
          : "bg-gradient-to-b from-[#080B12]/90 to-transparent py-4"
      }`}
    >
      <div className="mx-auto w-full max-w-[1600px] flex items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 text-primary hover:text-primary-hover transition-colors shrink-0">
            {logoUrl || '/logo.png' ? (
              <img src={logoUrl && logoUrl.startsWith('http') ? logoUrl : '/logo.png'} alt="Logo" className="h-10 md:h-12 w-auto object-contain" />
            ) : (
              <>
                <PlaySquare className="h-8 w-8" />
                <span className="text-xl font-black tracking-tight hidden sm:block">MOVIES</span>
              </>
            )}
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`transition-colors hover:text-white ${
                  pathname === link.href ? "text-white font-semibold" : "text-text-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Dropdown Géneros */}
            <div 
              className="relative group"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button 
                className={`flex items-center gap-1 transition-colors hover:text-white ${
                  pathname?.includes('/category/') && pathname !== '/category/tendencias' ? "text-white font-semibold" : "text-text-secondary"
                }`}
              >
                Géneros <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 pt-4"
                  >
                    <div className="bg-[#121826] border border-white/10 rounded-xl shadow-2xl p-2 w-48 max-h-[60vh] overflow-y-auto custom-scrollbar">
                      {categories?.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="block px-4 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop Search */}
          <div className="relative hidden sm:flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "260px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onSubmit={handleSearch}
                  className="mr-2 overflow-hidden"
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar películas..."
                    autoFocus
                    className="h-10 w-full rounded-full bg-black/40 border border-white/10 backdrop-blur-sm pl-5 pr-4 text-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                  />
                </motion.form>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full transition-colors ${isSearchOpen ? "bg-white/10 text-white" : "text-text-secondary hover:text-white hover:bg-white/5"}`}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Search Icon */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden text-text-secondary hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Mobile Menu Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden text-text-secondary hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#080B12]/95 backdrop-blur-xl border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar películas..."
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 pl-11 pr-4 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                />
              </form>

              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${
                      pathname === link.href ? "text-white" : "text-text-secondary"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-white/5">
                  <h3 className="text-white font-semibold mb-3">Géneros</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {categories?.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-text-secondary hover:text-white text-sm"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
