import React, { useEffect, useState } from 'react';
import { Settings, Save, Layout, Search, Palette, Plug, Database, Info } from 'lucide-react';
import api from '../../services/api';
import { Toast, type ToastType } from '../../components/ui/Toast';
import { GeneralTab } from './tabs/GeneralTab';
import { SEOTab } from './tabs/SEOTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { IntegrationsTab } from './tabs/IntegrationsTab';
import { DatabaseTab } from './tabs/DatabaseTab';
import { SystemTab } from './tabs/SystemTab';

export interface SettingsData {
  platform_name: string;
  platform_description: string;
  platform_url: string;
  logo_url: string;
  logo_dark_url: string;
  favicon_url: string;
  language: string;
  timezone: string;
  maintenance_mode: boolean;
  maintenance_message: string;
  
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  seo_og_image: string;
  seo_robots: string;
  seo_canonical_url: string;
  google_analytics_id: string;
  google_search_console_id: string;
  auto_sitemap: boolean;
  
  social_twitter: string;
  social_instagram: string;
  social_youtube: string;
  social_discord: string;

  theme_mode: string;
  color_primary: string;
  color_secondary: string;
  color_button: string;
  color_background: string;
  home_bg_image: string;
  tmdb_api_key: string;
}

export const SettingsForm = () => {
  const [formData, setFormData] = useState<SettingsData>({
    platform_name: 'CineMatch',
    platform_description: '',
    platform_url: '',
    logo_url: '',
    logo_dark_url: '',
    favicon_url: '',
    language: 'es-ES',
    timezone: 'America/Argentina/Buenos_Aires',
    maintenance_mode: false,
    maintenance_message: '',
    
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    seo_og_image: '',
    seo_robots: '',
    seo_canonical_url: '',
    google_analytics_id: '',
    google_search_console_id: '',
    auto_sitemap: true,
    
    social_twitter: '',
    social_instagram: '',
    social_youtube: '',
    social_discord: '',
    
    theme_mode: 'dark',
    color_primary: '#e50914',
    color_secondary: '#1f2937',
    color_button: '#e50914',
    color_background: '#030712',
    home_bg_image: '',
    tmdb_api_key: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await api.get('/settings');
      if (data) {
        setFormData({ ...formData, ...data, maintenance_mode: Boolean(data.maintenance_mode), auto_sitemap: Boolean(data.auto_sitemap) });
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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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

  const tabs = [
    { id: 'general', label: 'General', icon: Layout },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'integrations', label: 'Integraciones', icon: Plug },
    { id: 'database', label: 'Base de Datos', icon: Database },
    { id: 'system', label: 'Sistema', icon: Info },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sticky top-0 bg-bg-primary/90 backdrop-blur-md z-10 py-4 border-b border-gray-800">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="w-8 h-8 text-brand-red" />
            Configuración Global
          </h1>
          <p className="text-text-secondary mt-1">
            Gestión centralizada de todos los parámetros del sistema
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

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="lg:w-64 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                    isActive 
                      ? 'bg-brand-red/10 text-brand-red' 
                      : 'text-text-secondary hover:bg-bg-secondary hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'general' && <GeneralTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'seo' && <SEOTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'appearance' && <AppearanceTab formData={formData} setFormData={setFormData} />}
          {activeTab === 'integrations' && <IntegrationsTab formData={formData} setFormData={setFormData} showToast={showToast} />}
          {activeTab === 'database' && <DatabaseTab showToast={showToast} />}
          {activeTab === 'system' && <SystemTab />}
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
