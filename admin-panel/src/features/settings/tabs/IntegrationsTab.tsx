import React, { useState, useEffect } from 'react';
import { Plug, Video, Film, CheckCircle, XCircle, RefreshCw, Save, Eye, EyeOff } from 'lucide-react';
import api from '../../../services/api';
import type { ToastType } from '../../../components/ui/Toast';
import type { SettingsData } from '../SettingsForm';

interface IntegrationsTabProps {
  formData: SettingsData;
  setFormData: (data: SettingsData) => void;
  showToast: (message: string, type?: ToastType) => void;
}

export const IntegrationsTab = ({ formData, setFormData, showToast }: IntegrationsTabProps) => {
  const [testingVimeus, setTestingVimeus] = useState(false);
  const [vimeusStatus, setVimeusStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [savingVimeus, setSavingVimeus] = useState(false);
  const [showVimeusKey, setShowVimeusKey] = useState(false);
  const [showVimeusView, setShowVimeusView] = useState(false);
  
  const [vimeusConfig, setVimeusConfig] = useState({
    api_key: '',
    view_key: '',
    domain: 'https://vimeus.com'
  });

  const [testingTmdb, setTestingTmdb] = useState(false);
  const [tmdbStatus, setTmdbStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showTmdbKey, setShowTmdbKey] = useState(false);

  useEffect(() => {
    loadVimeusConfig();
  }, []);

  const loadVimeusConfig = async () => {
    try {
      const { data } = await api.get('/streaming/config?provider=vimeus');
      if (data) {
        setVimeusConfig({
          api_key: data.api_key_hint || '',
          view_key: data.view_key_hint || '',
          domain: data.domain || 'https://vimeus.com'
        });
      }
    } catch (error) {
      console.error('Error loading Vimeus config', error);
    }
  };

  const saveVimeusConfig = async () => {
    setSavingVimeus(true);
    try {
      const { data } = await api.put('/streaming/config', {
        provider: 'vimeus',
        api_key: vimeusConfig.api_key,
        view_key: vimeusConfig.view_key,
        domain: vimeusConfig.domain,
        is_active: true
      });
      if (data.success) {
        showToast('Configuración de Vimeus guardada', 'success');
        // Actualizar con los hints si el backend los devuelve
        setVimeusConfig(prev => ({
          ...prev,
          api_key: data.api_key_hint || prev.api_key,
          view_key: data.view_key_hint || prev.view_key
        }));
      }
    } catch (error) {
      console.error('Error saving Vimeus config', error);
      showToast('Error al guardar Vimeus', 'error');
    } finally {
      setSavingVimeus(false);
    }
  };

  const testVimeus = async () => {
    setTestingVimeus(true);
    setVimeusStatus('idle');
    try {
      const { data } = await api.post('/streaming/test', { provider: 'vimeus' });
      if (data.success) {
        setVimeusStatus('success');
        showToast('Conexión con Vimeus exitosa', 'success');
      } else {
        setVimeusStatus('error');
        showToast(data.message || 'Error de conexión', 'error');
      }
    } catch (error: any) {
      setVimeusStatus('error');
      showToast(error.response?.data?.message || 'Error conectando con Vimeus', 'error');
    } finally {
      setTestingVimeus(false);
    }
  };

  const testTmdb = async () => {
    setTestingTmdb(true);
    setTmdbStatus('idle');
    try {
      const { data } = await api.get('/settings/test/tmdb');
      if (data.success) {
        setTmdbStatus('success');
        showToast('Conexión con TMDb exitosa', 'success');
      } else {
        setTmdbStatus('error');
        showToast(data.message || 'Error de conexión', 'error');
      }
    } catch (error: any) {
      setTmdbStatus('error');
      showToast(error.response?.data?.message || 'Error conectando con TMDb', 'error');
    } finally {
      setTestingTmdb(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-green-500/10 text-green-400 rounded-xl">
            <Plug className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Integraciones Externas</h3>
            <p className="text-xs text-text-secondary">Conexiones con servicios de terceros. Las credenciales se encriptan de forma segura en la base de datos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarjeta Vimeus */}
          <div className="bg-bg-tertiary rounded-xl border border-gray-700 p-5 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-red/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-red/10 text-brand-red rounded-lg">
                  <Video className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">Vimeus</h4>
                  <p className="text-xs text-text-secondary">Plataforma de Streaming Video</p>
                </div>
              </div>
              
              {vimeusStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {vimeusStatus === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              Proveedor de almacenamiento y entrega de video. Encargado de transformar y servir el contenido a los usuarios finales.
            </p>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">API Key</label>
                <div className="relative">
                  <input
                    type={showVimeusKey ? 'text' : 'password'}
                    value={vimeusConfig.api_key}
                    onChange={(e) => setVimeusConfig({ ...vimeusConfig, api_key: e.target.value })}
                    className="w-full bg-bg-primary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red pr-10"
                    placeholder="Tu Vimeus API Key"
                  />
                  <button type="button" onClick={() => setShowVimeusKey(!showVimeusKey)} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                    {showVimeusKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">View Key</label>
                <div className="relative">
                  <input
                    type={showVimeusView ? 'text' : 'password'}
                    value={vimeusConfig.view_key}
                    onChange={(e) => setVimeusConfig({ ...vimeusConfig, view_key: e.target.value })}
                    className="w-full bg-bg-primary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red pr-10"
                    placeholder="Tu Vimeus View Key"
                  />
                  <button type="button" onClick={() => setShowVimeusView(!showVimeusView)} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                    {showVimeusView ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800 flex justify-between items-center mt-auto">
              <button
                onClick={(e) => { e.preventDefault(); saveVimeusConfig(); }}
                disabled={savingVimeus}
                className="flex items-center gap-2 px-4 py-2 bg-brand-red hover:bg-brand-red-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {savingVimeus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Guardar
              </button>
              
              <button
                onClick={(e) => { e.preventDefault(); testVimeus(); }}
                disabled={testingVimeus}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {testingVimeus ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plug className="w-4 h-4" />
                )}
                Probar
              </button>
            </div>
          </div>

          {/* Tarjeta TMDb */}
          <div className="bg-bg-tertiary rounded-xl border border-gray-700 p-5 flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                  <Film className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">TMDb</h4>
                  <p className="text-xs text-text-secondary">The Movie Database API</p>
                </div>
              </div>
              
              {tmdbStatus === 'success' && <CheckCircle className="w-6 h-6 text-green-500" />}
              {tmdbStatus === 'error' && <XCircle className="w-6 h-6 text-red-500" />}
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              Fuente principal de metadatos. Permite importar sinopsis, imágenes, pósters, actores y detalles de películas automáticamente.
            </p>

            <div className="space-y-4 mb-6 flex-1">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">API Key (v3 auth)</label>
                <div className="relative">
                  <input
                    type={showTmdbKey ? 'text' : 'password'}
                    value={formData.tmdb_api_key}
                    onChange={(e) => setFormData({ ...formData, tmdb_api_key: e.target.value })}
                    className="w-full bg-bg-primary border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 pr-10"
                    placeholder="Tu TMDb API Key"
                  />
                  <button type="button" onClick={() => setShowTmdbKey(!showTmdbKey)} className="absolute right-3 top-2.5 text-gray-400 hover:text-white">
                    {showTmdbKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Haz clic en Guardar Ajustes arriba a la derecha para guardar TMDb.
                </p>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800 flex justify-end items-center mt-auto">
              <button
                onClick={(e) => { e.preventDefault(); testTmdb(); }}
                disabled={testingTmdb}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {testingTmdb ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Plug className="w-4 h-4" />
                )}
                Probar Conexión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
