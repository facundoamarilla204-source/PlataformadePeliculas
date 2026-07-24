import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Search, Save, X, Image as ImageIcon, Check, Loader2, Tv, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import { categoryService } from '../../services/categoryService';
import type { Category } from '../../services/categoryService';
import { ServerManager } from './ServerManager';
import type { MovieServer } from './ServerManager';

type StreamingStatus = 'pending' | 'available' | 'available_manual' | 'available_auto' | 'unavailable' | 'error' | 'auth_error' | 'invalid_url';

const statusBadgeConfig: Record<StreamingStatus, { label: string; classes: string }> = {
  available: { label: 'Disponible', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  available_manual: { label: 'Disponible (Modo Manual)', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  available_auto: { label: 'Disponible (Modo Automático)', classes: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  unavailable: { label: 'No disponible', classes: 'bg-red-500/15 text-red-400 border-red-500/30' },
  pending: { label: 'Pendiente de verificar', classes: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
  error: { label: 'Error de conexión / Reproducción', classes: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
  auth_error: { label: 'Error de autenticación', classes: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
  invalid_url: { label: 'Enlace inválido', classes: 'bg-orange-500/15 text-orange-400 border-orange-500/30' },
};

export const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
    streaming_provider: 'none',
    streaming_status: 'pending' as StreamingStatus | 'available_manual' | 'available_auto' | 'invalid_url',
    streaming_mode: 'auto' as 'auto' | 'manual',
    streaming_manual_url: '',
    streaming_last_checked: null as string | null,
    streaming_last_result: null as any,
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
        imdb_id: data.imdb_id || '',
        type: data.type || 'movie',
        season: data.season || '',
        episode: data.episode || '',
        category_ids: data.category_ids || [],
        streaming_provider: data.streaming_provider || 'none',
        streaming_status: data.streaming_status || 'pending',
        streaming_mode: data.streaming_mode || 'auto',
        streaming_manual_url: data.streaming_manual_url || '',
        streaming_last_checked: data.streaming_last_checked || null,
        streaming_last_result: data.streaming_last_result || null,
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
      title: tmdbMovie.title,
      overview: tmdbMovie.overview,
      release_date: tmdbMovie.release_date,
      poster_path: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : '',
      backdrop_path: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}` : '',
      rating: tmdbMovie.vote_average,
      tmdb_id: tmdbMovie.id,
      imdb_id: imdbId,
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

  const handleCheckStreaming = async () => {
    if (formData.streaming_mode === 'manual') {
      if (!formData.streaming_manual_url) {
        alert('Debes ingresar la URL manual para verificar.');
        return;
      }
      setIsCheckingStreaming(true);
      try {
        const { data } = await api.post(`/streaming/check-manual`, { url: formData.streaming_manual_url });
        if (data.valid) {
          setFormData(prev => ({
            ...prev,
            streaming_status: 'available_manual',
            streaming_last_checked: new Date().toISOString(),
            streaming_last_result: { message: 'URL manual válida' }
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            streaming_status: 'invalid_url',
            streaming_last_checked: new Date().toISOString(),
            streaming_last_result: { error: data.error }
          }));
          alert(`Enlace inválido: ${data.error}`);
        }
      } catch (error: any) {
        alert('Error al validar la URL manual');
      } finally {
        setIsCheckingStreaming(false);
      }
      return;
    }

    // Modo automático
    if (!formData.tmdb_id && !formData.imdb_id) {
      alert('Debes ingresar al menos el TMDb ID o IMDb ID para verificar.');
      return;
    }
    
    setIsCheckingStreaming(true);
    try {
      if (id) {
        // Película guardada: actualizar en base de datos también
        const { data } = await api.post(`/streaming/check/${id}`);
        setFormData(prev => ({
          ...prev,
          streaming_status: data.status === 'available' ? 'available_auto' : data.status,
          streaming_last_checked: data.last_checked || new Date().toISOString(),
          streaming_last_result: data,
        }));
      } else {
        // Película nueva: solo verificar al vuelo
        const payload = {
          tmdb_id: formData.tmdb_id,
          imdb_id: formData.imdb_id,
          type: formData.type,
          season: formData.season,
          episode: formData.episode,
          provider: 'vimeus' // Por ahora vimeus fijo
        };
        const { data } = await api.post(`/streaming/check-external`, payload);
        
        setFormData(prev => ({
          ...prev,
          streaming_status: data.status === 'available' ? 'available_auto' : data.status,
          streaming_last_checked: data.last_checked || new Date().toISOString(),
          streaming_last_result: data.details || data,
          streaming_provider: data.status === 'available' ? 'vimeus' : prev.streaming_provider,
        }));
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Error al verificar disponibilidad';
      setFormData(prev => ({
        ...prev,
        streaming_status: 'error',
        streaming_last_checked: new Date().toISOString(),
        streaming_last_result: { error: errorMsg },
      }));
      alert(errorMsg);
    } finally {
      setIsCheckingStreaming(false);
    }
  };

  const handleTestPlayer = () => {
    let embedUrl = '';
    
    if (formData.streaming_mode === 'manual') {
      if (!formData.streaming_manual_url || formData.streaming_status === 'invalid_url') {
        alert('Debes ingresar una URL manual válida primero.');
        return;
      }
      embedUrl = formData.streaming_manual_url;
    } else {
      // Automatic preview would require backend generating URL or trusting standard generation if available
      alert('Para probar el reproductor automático, asegúrate de haber guardado la película y usa el sitio público.');
      return;
    }

    if (embedUrl) {
      window.open(embedUrl, '_blank', 'width=800,height=600');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.streaming_status.toString().startsWith('available')) {
      const confirmSave = window.confirm('Esta película no tiene un proveedor de streaming configurado o válido (estado: ' + formData.streaming_status + '). ¿Estás seguro que deseas guardarla y publicarla?');
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

  const currentBadge = (statusBadgeConfig as any)[formData.streaming_status] || statusBadgeConfig.pending;

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
              <h3 className="text-lg font-bold text-white">Streaming</h3>
              <p className="text-xs text-text-secondary">Información del proveedor de reproducción</p>
            </div>
            {/* Badge de estado */}
            <span className={`ml-auto inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${currentBadge.classes}`}>
              {currentBadge.label}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Modo de Reproducción</label>
              <select
                value={formData.streaming_mode}
                onChange={(e) => setFormData({...formData, streaming_mode: e.target.value as 'auto' | 'manual'})}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              >
                <option value="auto">Automático</option>
                <option value="manual">Manual (Fallback)</option>
              </select>
            </div>

            {formData.streaming_mode === 'manual' ? (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">URL Manual (Embed URL oficial de Vimeus)</label>
                <input
                  type="url"
                  value={formData.streaming_manual_url}
                  onChange={(e) => setFormData({...formData, streaming_manual_url: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red font-mono"
                  placeholder="https://vimeus.com/e/movie?tmdb=...&view_key=..."
                />
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">TMDb ID</label>
              <input
                type="number"
                value={formData.tmdb_id || ''}
                onChange={(e) => setFormData({...formData, tmdb_id: e.target.value ? parseInt(e.target.value) : null})}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red font-mono disabled:opacity-50"
                placeholder="Ej: 550"
                disabled={formData.streaming_mode === 'manual'}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">IMDb ID</label>
              <input
                type="text"
                value={formData.imdb_id}
                onChange={(e) => setFormData({...formData, imdb_id: e.target.value})}
                className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red font-mono disabled:opacity-50"
                placeholder="Ej: tt0137523"
                disabled={formData.streaming_mode === 'manual'}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Proveedor</label>
              <div className="px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary">
                {formData.streaming_provider === 'none' ? 'Ninguno' : formData.streaming_provider.charAt(0).toUpperCase() + formData.streaming_provider.slice(1)}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Última verificación</label>
              <div className="px-4 py-2 border border-gray-700 rounded-lg bg-bg-tertiary text-text-primary">
                {formData.streaming_last_checked
                  ? new Date(formData.streaming_last_checked).toLocaleString('es-AR')
                  : 'Nunca'}
              </div>
            </div>

            {formData.streaming_last_result && (
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">Resultado de la última consulta</label>
                <pre className="px-4 py-3 border border-gray-700 rounded-lg bg-bg-tertiary text-xs text-text-secondary overflow-auto max-h-32 font-mono">
                  {JSON.stringify(formData.streaming_last_result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="mt-8">
            <ServerManager servers={servers} onChange={setServers} />
          </div>

          {/* Botones de acción de streaming */}
          <div className="mt-6 flex flex-wrap justify-start gap-4">
            <button
              type="button"
              onClick={handleCheckStreaming}
              disabled={isCheckingStreaming || (formData.streaming_mode === 'auto' && !formData.tmdb_id && !formData.imdb_id)}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingStreaming ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <RefreshCw className="w-5 h-5" />
              )}
              {isCheckingStreaming ? 'Verificando...' : 'Verificar enlace'}
            </button>
            <button
              type="button"
              onClick={handleTestPlayer}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Tv className="w-5 h-5" />
              Probar reproductor
            </button>
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
