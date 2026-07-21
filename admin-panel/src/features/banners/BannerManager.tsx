import React, { useEffect, useState } from 'react';
import { Sparkles, Star, CheckCircle, Eye, Play, ArrowUp, ArrowDown } from 'lucide-react';
import api from '../../services/api';
import { Toast, type ToastType } from '../../components/ui/Toast';

interface Movie {
  id: string;
  title: string;
  overview: string;
  poster_url: string;
  backdrop_url: string;
  is_featured: boolean;
  release_year: number;
}

export const BannerManager = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedPreview, setSelectedPreview] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      const { data } = await api.get('/banners');
      setMovies(data);
      if (data.length > 0) {
        const featured = data.find((m: Movie) => m.is_featured) || data[0];
        setSelectedPreview(featured);
      }
    } catch (error) {
      console.error('Error cargando banners:', error);
      showToast('Error al cargar catálogo de banners', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleToggleFeatured = async (movie: Movie) => {
    const newStatus = !movie.is_featured;
    try {
      await api.put(`/banners/${movie.id}/toggle`, { is_featured: newStatus });
      const updated = movies.map(m => m.id === movie.id ? { ...m, is_featured: newStatus } : m);
      setMovies(updated);

      if (selectedPreview?.id === movie.id) {
        setSelectedPreview({ ...selectedPreview, is_featured: newStatus });
      }

      showToast(newStatus ? `"${movie.title}" agregada a Banners Destacados` : `"${movie.title}" removida de Banners`);
    } catch (error) {
      console.error('Error cambiando banner:', error);
      showToast('Error al actualizar banner', 'error');
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= movies.length) return;

    const newMovies = [...movies];
    const temp = newMovies[index];
    newMovies[index] = newMovies[targetIndex];
    newMovies[targetIndex] = temp;
    setMovies(newMovies);
    showToast('Orden de banners actualizado');
  };

  const featuredMovies = movies.filter(m => m.is_featured);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-brand-red" />
          Banners de Portada (Home)
        </h1>
        <p className="text-text-secondary mt-1">
          Selecciona y organiza las películas destacadas que se proyectarán en la portada principal de la plataforma
        </p>
      </div>

      {/* Hero Live Preview Card */}
      {selectedPreview && (
        <div className="bg-bg-secondary rounded-3xl border border-gray-800 overflow-hidden shadow-2xl space-y-0 relative">
          <div className="px-6 py-3 bg-bg-tertiary/80 border-b border-gray-800 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-red flex items-center gap-2">
              <Eye className="w-4 h-4" /> Previsualización en Vivo (Home Hero)
            </span>
            <span className="text-xs text-text-secondary">
              {selectedPreview.is_featured ? '🟢 Activa en Banner' : '⚪ Inactiva en Banner'}
            </span>
          </div>

          <div className="relative aspect-[21/9] w-full overflow-hidden bg-gray-900">
            <img
              src={selectedPreview.backdrop_url || selectedPreview.poster_url || "https://images.unsplash.com/photo-1574267432553-4b4628081c31?q=80&w=1920&auto=format&fit=crop"}
              alt={selectedPreview.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#080B12] via-[#080B12]/60 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 md:left-12 md:bottom-12 max-w-2xl space-y-3">
              <span className="inline-block px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase rounded-full tracking-wider shadow-lg shadow-brand-red/30">
                DESTACADO DE LA SEMANA
              </span>
              <h2 className="text-2xl md:text-5xl font-black text-white tracking-tight leading-none">
                {selectedPreview.title}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 line-clamp-2 md:line-clamp-3">
                {selectedPreview.overview || 'Sin descripción disponible.'}
              </p>
              <div className="flex gap-3 pt-2">
                <button className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-xl shadow-brand-red/30">
                  <Play className="w-4 h-4 fill-current" /> Ver Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid selector of Movies */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Catálogo de Películas para Banners</h3>
        
        {isLoading ? (
          <p className="text-text-secondary">Cargando películas...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map((movie, index) => {
              const isSelected = selectedPreview?.id === movie.id;

              return (
                <div
                  key={movie.id}
                  onClick={() => setSelectedPreview(movie)}
                  className={`
                    group relative rounded-2xl border p-4 bg-bg-secondary cursor-pointer transition-all duration-200
                    ${isSelected ? 'border-brand-red ring-2 ring-brand-red/30 shadow-xl' : 'border-gray-800 hover:border-gray-700'}
                  `}
                >
                  <div className="flex gap-4 items-center">
                    <img
                      src={movie.poster_url || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop"}
                      alt={movie.title}
                      className="w-16 h-24 object-cover rounded-xl shadow-md shrink-0"
                    />
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="text-base font-bold text-white truncate">{movie.title}</h4>
                      <p className="text-xs text-text-secondary">{movie.release_year || 2024}</p>

                      <div className="pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleFeatured(movie);
                          }}
                          className={`
                            px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all
                            ${movie.is_featured
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-bg-tertiary text-text-secondary hover:text-white border border-gray-700'}
                          `}
                        >
                          <Star className={`w-3.5 h-3.5 ${movie.is_featured ? 'fill-current' : ''}`} />
                          {movie.is_featured ? 'Destacado' : 'Destacar'}
                        </button>

                        {/* Reorder Buttons if featured */}
                        {movie.is_featured && (
                          <div className="flex gap-1">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMove(index, 'up'); }}
                              className="p-1 text-text-secondary hover:text-white bg-bg-tertiary rounded hover:bg-gray-800"
                              title="Subir orden"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleMove(index, 'down'); }}
                              className="p-1 text-text-secondary hover:text-white bg-bg-tertiary rounded hover:bg-gray-800"
                              title="Bajar orden"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
