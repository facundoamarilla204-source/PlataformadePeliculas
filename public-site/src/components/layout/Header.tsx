"use client";

import Link from "next/link";
import { Search, Menu, PlaySquare } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

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
      className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
        isScrolled ? "bg-black/90 backdrop-blur-md shadow-md" : "bg-gradient-to-b from-black/80 to-transparent"
      }`}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-red-600 hover:text-red-500 transition">
            <PlaySquare className="h-8 w-8" />
            <span className="text-2xl font-bold hidden sm:inline-block tracking-tight">
              MOVIES
            </span>
          </Link>
          <nav className="hidden md:flex gap-4 text-sm font-medium text-neutral-300">
            <Link href="/" className="hover:text-white transition">Inicio</Link>
            <Link href="/search" className="hover:text-white transition">Explorar</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar películas..."
              className="h-9 w-64 rounded-full bg-neutral-900/50 border border-neutral-700 pl-9 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all focus:bg-neutral-800"
            />
          </form>
          <Button variant="ghost" size="icon" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
