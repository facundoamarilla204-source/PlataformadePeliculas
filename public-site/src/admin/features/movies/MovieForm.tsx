'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Search, Save, X, Image as ImageIcon, Check, Loader2, Tv, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import { ServerManager } from './ServerManager';
import type { MovieServer } from './ServerManager';



export const MovieForm = () => {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const navigate = (path: string) => router.push(`/admi${path.startsWith('/') ? path : '/' + path}`);
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    overview: '',
    release_date: '',
    poster_path: '',
    backdrop_path: '',
    rating: 0,
    video_url: '',
    duration: 0,
    tmdb_id: null as number | null,
    imdb_id: '' as string,
    type: 'movie' as 'movie' | 'tv',
    season: '' as string | number,
    episode: '' as string | number,
    category_ids: [] as string[],
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [servers, setServers] = useState<MovieServer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStreaming, setIsCheckingStreaming] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadMovie();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.list({ status: 'active', limit: 100 });
      setCategories(res.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    }
  };

  const loadMovie = async () => {
    try {
      const { data } = await api.get(`/movies/${id}`);
      setFormData(prev => ({
        ...prev,
        ...data,
        title: data.title || '',
        overview: data.overview || '',
        release_date: data.release_date || '',
        poster_path: data.poster_path || '',
        backdrop_path: data.backdrop_path || '',
        rating: data.rating || 0,
        video_url: data.video_url || '',
        duration: data.duration || 0,
        tmdb_id: data.tmdb_id || null,
        imdb_id: data.imdb_id || '',
        type: data.type || 'movie',
        season: data.season || '',
        episode: data.episode || '',
        category_ids: data.category_ids || [],
      }));
      
      const { data: serversData } = await api.get(`/movies/${id}/servers`);
      setServers(serversData || []);
    } catch (error) {
      console.error('Error cargando película:', error);
    }
  };

  const handleSearchTMDB = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const { data } = await api.get(`/tmdb/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(data);
    } catch (error) {
      console.error('Error buscando en TMDb', error);
      alert('Error al buscar en TMDb');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTMDBResult = async (tmdbMovie: any) => {
    // Obtener detalles completos para conseguir el IMDb ID
    let imdbId = '';
    try {
      const { data: details } = await api.get(`/tmdb/details/${tmdbMovie.id}`);
      imdbId = details.imdb_id || '';
    } catch { /* ignorar */ }

    setFormData(prev => ({
      ...prev,
      title: tmdbMovie.title || '',
      overview: tmdbMovie.overview || '',
      release_date: tmdbMovie.release_date || '',
      poster_path: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '',
      backdrop_path: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}` : '',
      rating: tmdbMovie.vote_average || 0,
      tmdb_id: tmdbMovie.id || null,
      imdb_id: imdbId || '',
    }));
    setSearchResults([]);
    setSearchQuery('');
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => {
      const exists = prev.category_ids.includes(categoryId);
      if (exists) {
        return { ...prev, category_ids: prev.category_ids.filter(id => id !== categoryId) };
      } else {
        return { ...prev, category_ids: [...prev.category_ids, categoryId] };
      }
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (servers.length === 0) {
      const confirmSave = window.confirm('Esta película no tiene un servidor configurado. ¿Deseas guardarla igual?');
      if (!confirmSave) return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await api.put(`/movies/${id}`, formData);
        await api.put(`/movies/${id}/servers`, servers);
      } else {
        const { data } = await api.post('/movies', formData);
        await api.put(`/movies/${data.id}/servers`, servers);
      }
      navigate('/movies');
    } catch (error) {
      console.error('Error guardando película:', error);
      alert('Error al guardar la película');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">{isEditing ? 'Editar Película' : 'Nueva Película'}</h1>
        </div>
        <button 
          onClick={() => navigate('/movies')}
          className="text-text-secondary hover:text-white transition-colors p-2"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {!isEditing && (
        <div className="bg-bg-secondary rounded-xl border border-gray-800 p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Importar desde TMDb</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Buscar por título..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchTMDB()}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
            <button
              onClick={handleSearchTMDB}
              disabled={isSearching}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Search className="w-5 h-5" />
              {isSearching ? 'Buscando...' : 'Buscar'}
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="mt-4 border border-gray-800 rounded-lg overflow-hidden bg-bg-tertiary max-h-60 overflow-y-auto">
              {searchResults.map((result) => (
                <div 
                  key={result.id} 
                  onClick={() => handleSelectTMDBResult(result)}
                  className="flex items-center gap-4 p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer transition-colors"
                >
                  {result.poster_path ? (
                    <img src={`https://image.tmdb.org/t/p/w92${result.poster_path}`} alt="" className="w-10 h-14 object-cover rounded" />
                  ) : (
                    <div className="w-10 h-14 bg-gray-900 rounded flex items-center justify-center"><ImageIcon className="w-4 h-4 text-gray-600" /></div>
                  )}
                  <div>
                    <h4 className="text-white font-medium">{result.title}</h4>
                    <p className="text-sm text-text-secondary">{result.release_date ? result.release_date.split('-')[0] : 'S/N'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-bg-secondary rounded-xl border border-gray-800 p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Título</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Tipo de Contenido</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as 'movie' | 'tv'})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            >
              <option value="movie">Película</option>
              <option value="tv">Serie / Anime</option>
            </select>
          </div>

          {formData.type === 'tv' && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Temporada (Season)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Episodio (Episode)</label>
                <input
                  type="number"
                  min="1"
                  value={formData.episode}
                  onChange={(e) => setFormData({...formData, episode: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Fecha de Estreno</label>
            <input
              type="date"
              value={formData.release_date}
              onChange={(e) => setFormData({...formData, release_date: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Sinopsis</label>
            <textarea
              rows={4}
              value={formData.overview}
              onChange={(e) => setFormData({...formData, overview: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red resize-none"
            />
          </div>

          {/* Selector Múltiple de Categorías */}
          <div className="space-y-3 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Géneros / Categorías</label>
            {categories.length === 0 ? (
              <p className="text-sm text-gray-500">No hay categorías activas creadas.</p>
            ) : (
              <div className="flex flex-wrap gap-3 p-4 bg-bg-tertiary border border-gray-800 rounded-xl">
                {categories.map(cat => {
                  const isSelected = formData.category_ids.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected 
                          ? 'bg-brand-red text-white border-brand-red shadow-lg shadow-brand-red/20' 
                          : 'bg-bg-secondary text-text-secondary border-gray-700 hover:border-gray-500 hover:text-white'
                      } border`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">URL del Póster</label>
            <input
              type="url"
              value={formData.poster_path}
              onChange={(e) => setFormData({...formData, poster_path: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">URL del Fondo (Backdrop)</label>
            <input
              type="url"
              value={formData.backdrop_path}
              onChange={(e) => setFormData({...formData, backdrop_path: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Calificación (1-10)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Duración (minutos)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">URL de Video / Trailer</label>
            <input
              type="url"
              value={formData.video_url}
              onChange={(e) => setFormData({...formData, video_url: e.target.value})}
              className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              placeholder="https://..."
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* SECCIÓN: STREAMING                                     */}
        {/* ══════════════════════════════════════════════════════ */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <Tv className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Servidores de Reproducción</h3>
              <p className="text-xs text-text-secondary">Configuración multi-servidor y proveedores independientes</p>
            </div>
          </div>

          <div className="mt-8">
            <ServerManager servers={servers} onChange={setServers} movieData={formData} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-800">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isLoading ? 'Guardando...' : 'Guardar Película'}
          </button>
        </div>
      </form>
    </div>
  );
};
