import React, { useEffect, useState } from 'react';
import { Tv, Shield, Wifi, WifiOff, Eye, EyeOff, Save, RefreshCw, Loader2, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import api from '../../services/api';
import { Toast, type ToastType } from '../../components/ui/Toast';

interface StreamingConfigData {
  provider: string;
  is_active: boolean;
  domain: string;
  api_key_hint: string;
  view_key_hint: string;
  last_test_at: string | null;
  last_test_result: {
    success: boolean;
    message: string;
    details: any;
  } | null;
  updated_at: string | null;
}

type ConnectionStatus = 'unknown' | 'connected' | 'error' | 'testing';

export const StreamingConfig = () => {
  const [config, setConfig] = useState<StreamingConfigData>({
    provider: 'vimeus',
    is_active: false,
    domain: '',
    api_key_hint: '',
    view_key_hint: '',
    last_test_at: null,
    last_test_result: null,
    updated_at: null,
  });

  // Campos editables (las keys reales, no los hints)
  const [apiKey, setApiKey] = useState('');
  const [viewKey, setViewKey] = useState('');
  const [domain, setDomain] = useState('');
  const [isActive, setIsActive] = useState(false);

  const [showApiKey, setShowApiKey] = useState(false);
  const [showViewKey, setShowViewKey] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('unknown');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { data } = await api.get('/streaming/config?provider=vimeus');
      setConfig(data);
      setDomain(data.domain || '');
      setIsActive(data.is_active || false);

      // Determinar estado de conexión basado en el último test
      if (data.last_test_result) {
        setConnectionStatus(data.last_test_result.success ? 'connected' : 'error');
      }
    } catch (error) {
      console.error('Error cargando configuración de streaming:', error);
      showToast('Error al cargar configuración de streaming', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: any = {
        provider: 'vimeus',
        domain,
        is_active: isActive,
      };

      // Solo enviar keys si el usuario escribió algo nuevo
      if (apiKey) payload.api_key = apiKey;
      if (viewKey) payload.view_key = viewKey;

      const { data } = await api.put('/streaming/config', payload);
      setConfig(data);
      setApiKey(''); // Limpiar campo después de guardar
      setViewKey('');
      showToast('Configuración de streaming guardada correctamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      showToast('Error al guardar configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setConnectionStatus('testing');
    try {
      const { data } = await api.post('/streaming/test', { provider: 'vimeus' });

      setConnectionStatus(data.success ? 'connected' : 'error');
      setConfig(prev => ({
        ...prev,
        last_test_at: data.tested_at,
        last_test_result: data,
      }));

      showToast(
        data.success ? 'Conexión exitosa con Vimeus' : `Fallo de conexión: ${data.message}`,
        data.success ? 'success' : 'error'
      );
    } catch (error: any) {
      setConnectionStatus('error');
      const msg = error.response?.data?.message || 'Error al probar conexión';
      showToast(msg, 'error');
    }
  };

  const connectionStatusConfig = {
    unknown: { icon: WifiOff, label: 'Sin probar', classes: 'text-gray-400 bg-gray-500/10 border-gray-500/30' },
    connected: { icon: Wifi, label: 'Conectado', classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    error: { icon: WifiOff, label: 'Desconectado', classes: 'text-red-400 bg-red-500/10 border-red-500/30' },
    testing: { icon: Loader2, label: 'Probando...', classes: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  };

  const currentStatusCfg = connectionStatusConfig[connectionStatus];
  const StatusIcon = currentStatusCfg.icon;

  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-secondary">
        Cargando configuración de streaming...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Tv className="w-8 h-8 text-purple-400" />
            Configuración de Streaming
          </h1>
          <p className="text-text-secondary mt-1">
            Gestiona los proveedores de reproducción de contenido
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-red/20 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Ajustes'}
        </button>
      </div>

      {/* Card Principal: Vimeus */}
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Vimeus</h3>
              <p className="text-xs text-text-secondary">Proveedor de streaming por embed basado en TMDb/IMDb</p>
            </div>
          </div>

          {/* Badge de conexión */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${currentStatusCfg.classes}`}>
            <StatusIcon className={`w-3.5 h-3.5 ${connectionStatus === 'testing' ? 'animate-spin' : ''}`} />
            {currentStatusCfg.label}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* API Key */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">API Key</label>
            <div className="relative">
              <input
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder={config.api_key_hint || 'Introduce tu API Key...'}
                className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-purple-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {config.api_key_hint && (
              <p className="text-xs text-text-secondary">Actual: {config.api_key_hint}</p>
            )}
          </div>

          {/* View Key */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">View Key</label>
            <div className="relative">
              <input
                type={showViewKey ? 'text' : 'password'}
                value={viewKey}
                onChange={(e) => setViewKey(e.target.value)}
                placeholder={config.view_key_hint || 'Introduce tu View Key...'}
                className="w-full px-4 py-3 pr-12 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-purple-500 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowViewKey(!showViewKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors"
              >
                {showViewKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {config.view_key_hint && (
              <p className="text-xs text-text-secondary">Actual: {config.view_key_hint}</p>
            )}
          </div>

          {/* Dominio */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Dominio Autorizado</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="Ej: midominio.com"
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-purple-500 text-sm"
            />
          </div>

          {/* Toggle Activo */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Estado del Proveedor</label>
            <div className="flex items-center gap-4 px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-bg-primary border border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-500" />
              </label>
              <span className={`text-sm font-medium ${isActive ? 'text-purple-400' : 'text-text-secondary'}`}>
                {isActive ? 'Activo' : 'Desactivado'}
              </span>
            </div>
          </div>
        </div>

        {/* Info de la última prueba */}
        {config.last_test_at && (
          <div className="border-t border-gray-800 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-text-secondary">Última prueba</p>
                <p className="text-sm text-text-primary">
                  {new Date(config.last_test_at).toLocaleString('es-AR')}
                </p>
              </div>
              {config.last_test_result && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-text-secondary">Resultado</p>
                  <div className="flex items-center gap-2">
                    {config.last_test_result.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    )}
                    <p className={`text-sm ${config.last_test_result.success ? 'text-emerald-400' : 'text-red-400'}`}>
                      {config.last_test_result.message}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón Probar Conexión */}
        <div className="flex justify-start pt-2">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={connectionStatus === 'testing'}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {connectionStatus === 'testing' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            {connectionStatus === 'testing' ? 'Probando...' : 'Probar Conexión'}
          </button>
        </div>
      </div>

      {/* Card informativa: Futuros proveedores */}
      <div className="bg-bg-secondary rounded-2xl border border-gray-800/50 p-6 shadow-xl opacity-60">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gray-500/10 text-gray-500 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-500">Más proveedores próximamente</h3>
            <p className="text-xs text-gray-600">
              Bunny Stream, Cloudflare Stream, Mux y proveedores propios estarán disponibles en futuras versiones.
            </p>
          </div>
        </div>
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
