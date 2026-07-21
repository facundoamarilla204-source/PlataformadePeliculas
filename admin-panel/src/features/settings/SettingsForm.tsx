import React, { useEffect, useState } from 'react';
import { Settings, Globe, Share2, BarChart2, ShieldAlert, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { Toast, type ToastType } from '../../components/ui/Toast';

interface SettingsData {
  platform_name: string;
  logo_url: string;
  favicon_url: string;
  seo_description: string;
  seo_keywords: string;
  social_twitter: string;
  social_instagram: string;
  social_youtube: string;
  social_discord: string;
  google_analytics_id: string;
  maintenance_mode: boolean;
}

export const SettingsForm = () => {
  const [formData, setFormData] = useState<SettingsData>({
    platform_name: 'CineMatch',
    logo_url: '',
    favicon_url: '',
    seo_description: '',
    seo_keywords: '',
    social_twitter: '',
    social_instagram: '',
    social_youtube: '',
    social_discord: '',
    google_analytics_id: '',
    maintenance_mode: false
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setFormData({
          platform_name: data.platform_name || 'CineMatch',
          logo_url: data.logo_url || '',
          favicon_url: data.favicon_url || '',
          seo_description: data.seo_description || '',
          seo_keywords: data.seo_keywords || '',
          social_twitter: data.social_twitter || '',
          social_instagram: data.social_instagram || '',
          social_youtube: data.social_youtube || '',
          social_discord: data.social_discord || '',
          google_analytics_id: data.google_analytics_id || '',
          maintenance_mode: Boolean(data.maintenance_mode)
        });
      }
    } catch (error) {
      console.error('Error cargando configuración:', error);
      showToast('Error al cargar configuración', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await api.put('/settings', formData);
      showToast('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      showToast('Error al guardar la configuración', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-text-secondary">
        Cargando ajustes de la plataforma...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-red" />
            Configuración General
          </h1>
          <p className="text-text-secondary mt-1">
            Personaliza los parámetros principales, SEO, enlaces sociales y estado del sitio
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 bg-brand-red hover:bg-brand-red-hover text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-red/20 transition-all disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {isSaving ? 'Guardando...' : 'Guardar Ajustes'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bloque 1: Información General */}
        <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2.5 bg-brand-red/10 text-brand-red rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Identidad de la Plataforma</h3>
              <p className="text-xs text-text-secondary">Información pública básica de la marca</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-text-secondary">Nombre de la Plataforma</label>
              <input
                type="text"
                required
                value={formData.platform_name}
                onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">URL del Logotipo</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">URL del Favicon</label>
              <input
                type="url"
                placeholder="https://..."
                value={formData.favicon_url}
                onChange={(e) => setFormData({ ...formData, favicon_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Bloque 2: SEO & Metadatos */}
        <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Posicionamiento SEO</h3>
              <p className="text-xs text-text-secondary">Optimiza cómo aparece el sitio en Google y buscadores</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Descripción Meta (SEO)</label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Palabras Clave (Separadas por comas)</label>
              <input
                type="text"
                value={formData.seo_keywords}
                onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Bloque 3: Redes Sociales */}
        <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Enlaces de Redes Sociales</h3>
              <p className="text-xs text-text-secondary">Canales oficiales en el pie de página</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Twitter / X</label>
              <input
                type="url"
                placeholder="https://twitter.com/..."
                value={formData.social_twitter}
                onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Instagram</label>
              <input
                type="url"
                placeholder="https://instagram.com/..."
                value={formData.social_instagram}
                onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">YouTube</label>
              <input
                type="url"
                placeholder="https://youtube.com/..."
                value={formData.social_youtube}
                onChange={(e) => setFormData({ ...formData, social_youtube: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Discord</label>
              <input
                type="url"
                placeholder="https://discord.gg/..."
                value={formData.social_discord}
                onChange={(e) => setFormData({ ...formData, social_discord: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>
        </div>

        {/* Bloque 4: Analytics e Integraciones */}
        <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Analítica & Tracking</h3>
              <p className="text-xs text-text-secondary">Medición de audiencia y métricas</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Google Analytics ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              value={formData.google_analytics_id}
              onChange={(e) => setFormData({ ...formData, google_analytics_id: e.target.value })}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red font-mono text-sm"
            />
          </div>
        </div>

        {/* Bloque 5: Modo Mantenimiento */}
        <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 text-red-400 rounded-xl">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Modo Mantenimiento</h3>
                <p className="text-xs text-text-secondary">Muestra una pantalla de pausa técnica en el sitio público</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maintenance_mode}
                onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-bg-tertiary border border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-red" />
            </label>
          </div>
        </div>
      </form>

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
