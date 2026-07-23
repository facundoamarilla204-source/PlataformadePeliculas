import React, { useState, useEffect } from 'react';
import { Database, Film, List, PlaySquare, FileText, HardDrive, Clock, RefreshCw, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import type { ToastType } from '../../../components/ui/Toast';

interface DbStats {
  total_movies: number;
  total_categories: number;
  total_banners: number;
  total_settings: number;
  db_size: string;
  last_sync: string;
  last_backup: string;
  status: string;
}

export const DatabaseTab = ({ showToast }: { showToast: (message: string, type?: ToastType) => void }) => {
  const [stats, setStats] = useState<DbStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/settings/db-stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching db stats:', error);
      showToast('Error cargando estadísticas de base de datos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = async (actionId: string, confirmMessage: string) => {
    if (window.confirm(confirmMessage)) {
      setActionLoading(actionId);
      try {
        const { data } = await api.post('/settings/db-action', { action: actionId });
        showToast(data.message, 'success');
        if (actionId === 'update_stats') {
          loadStats();
        }
      } catch (error) {
        showToast(`Error al ejecutar la acción: ${actionId}`, 'error');
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (isLoading) {
    return <div className="text-gray-400 py-10 text-center">Cargando base de datos...</div>;
  }

  if (!stats) return null;

  const statCards = [
    { label: 'Películas Registradas', value: stats.total_movies, icon: Film, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Categorías', value: stats.total_categories, icon: List, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Banners Activos', value: stats.total_banners, icon: PlaySquare, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { label: 'Opciones de Config.', value: stats.total_settings, icon: FileText, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Estado de la Base de Datos</h3>
              <p className="text-xs text-text-secondary">Estadísticas y gestión de almacenamiento</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Saludable
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-bg-tertiary rounded-xl p-4 border border-gray-800">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <h5 className="text-xs text-text-secondary">{stat.label}</h5>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-4 bg-bg-tertiary p-4 rounded-xl border border-gray-800">
            <div className="p-3 bg-gray-800 rounded-full">
              <HardDrive className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Tamaño Estimado</p>
              <p className="text-lg font-mono font-bold text-white">{stats.db_size}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-bg-tertiary p-4 rounded-xl border border-gray-800">
            <div className="p-3 bg-gray-800 rounded-full">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Último Respaldo</p>
              <p className="text-sm font-medium text-white">{new Date(stats.last_backup).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Acciones de Mantenimiento</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <button
            onClick={(e) => { e.preventDefault(); executeAction('update_stats', '¿Deseas recalcular las estadísticas de la base de datos?'); }}
            disabled={actionLoading !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${actionLoading === 'update_stats' ? 'animate-spin' : ''}`} />
            Actualizar Stats
          </button>
          
          <button
            onClick={(e) => { e.preventDefault(); executeAction('sync_catalog', '¿Deseas sincronizar el catálogo con Vimeus?'); }}
            disabled={actionLoading !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Film className={`w-4 h-4 ${actionLoading === 'sync_catalog' ? 'animate-pulse' : ''}`} />
            Sincronizar Catálogo
          </button>
          
          <button
            onClick={(e) => { e.preventDefault(); executeAction('reindex', '¿Deseas reindexar la base de datos? Esto puede causar lentitud temporal.'); }}
            disabled={actionLoading !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-bg-tertiary hover:bg-gray-800 border border-gray-700 hover:border-gray-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Database className={`w-4 h-4 ${actionLoading === 'reindex' ? 'animate-pulse' : ''}`} />
            Optimizar/Reindexar
          </button>
          
          <button
            onClick={(e) => { e.preventDefault(); executeAction('clear_cache', '¿Estás seguro de limpiar la caché del sitio público?'); }}
            disabled={actionLoading !== null}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            Limpiar Caché
          </button>
        </div>
      </div>
    </div>
  );
};
