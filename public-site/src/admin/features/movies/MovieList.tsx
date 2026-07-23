'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, PlayCircle, Film } from 'lucide-react';
import api from '../../services/api';

export const MovieList = () => {
  const [movies, setMovies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const { data } = await api.get('/movies');
      setMovies(data);
    } catch (error) {
      console.error('Error cargando películas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta película?')) return;
    
    try {
      await api.delete(`/movies/${id}`);
      setMovies(movies.filter((m) => m.id !== id));
    } catch (error) {
      console.error('Error eliminando película:', error);
      alert('Error al eliminar');
    }
  };

  const filteredMovies = movies.filter(m => 
    (m.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Películas</h1>
          <p className="text-text-secondary mt-1">Gestiona el catálogo de películas de la plataforma</p>
        </div>
        <Link 
          href="/admi/movies/new"
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Película
        </Link>
      </div>

      <div className="bg-bg-secondary rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar película..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg leading-5 bg-bg-tertiary text-text-primary placeholder-gray-500 focus:outline-none focus:border-brand-red focus:ring-1 focus:ring-brand-red sm:text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-tertiary text-text-secondary text-sm uppercase tracking-wider border-b border-gray-800">
                <th className="px-6 py-4 font-medium">Película</th>
                <th className="px-6 py-4 font-medium">Año</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-text-secondary">
                    Cargando películas...
                  </td>
                </tr>
              ) : filteredMovies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-text-secondary">
                    No se encontraron películas
                  </td>
                </tr>
              ) : (
                filteredMovies.map((movie) => {
                  const poster = movie.poster_url || movie.poster_path;
                  const year = movie.release_year || (movie.release_date ? new Date(movie.release_date).getFullYear() : '-');

                  return (
                    <tr key={movie.id} className="hover:bg-bg-tertiary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {poster ? (
                            <img 
                              src={poster.startsWith('http') ? poster : `https://image.tmdb.org/t/p/w200${poster}`} 
                              alt={movie.title || 'Película'}
                              className="w-12 h-16 object-cover rounded shadow-md"
                            />
                          ) : (
                            <div className="w-12 h-16 bg-gray-800 rounded flex items-center justify-center">
                              <Film className="w-6 h-6 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{movie.title || 'Sin título'}</div>
                            <div className="text-sm text-text-secondary line-clamp-1 max-w-md">
                              {movie.overview || 'Sin descripción'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-secondary">
                        {year}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3">
                          <Link 
                            href={`/admi/movies/edit/${movie.id}`}
                            className="text-text-secondary hover:text-white transition-colors"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(movie.id)}
                            className="text-text-secondary hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
