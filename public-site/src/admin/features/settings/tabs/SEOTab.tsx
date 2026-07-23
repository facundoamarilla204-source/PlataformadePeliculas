import React from 'react';
import { Search, Globe, Image as ImageIcon } from 'lucide-react';
import type { SettingsData } from '../SettingsForm';

export const SEOTab = ({ formData, setFormData }: { formData: SettingsData, setFormData: (data: SettingsData) => void }) => {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Configuración SEO</h3>
            <p className="text-xs text-text-secondary">Mejora tu posicionamiento en motores de búsqueda</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Título por Defecto</label>
              <input
                type="text"
                value={formData.seo_title}
                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Descripción Meta</label>
              <textarea
                rows={3}
                value={formData.seo_description}
                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Palabras Clave (Keywords)</label>
              <input
                type="text"
                placeholder="películas, series, streaming..."
                value={formData.seo_keywords}
                onChange={(e) => setFormData({ ...formData, seo_keywords: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Imagen Open Graph (Redes Sociales)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.seo_og_image}
                  onChange={(e) => setFormData({ ...formData, seo_og_image: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
                />
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

          <div className="space-y-6">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Vista Previa (Google)</h4>
            
            {/* Snippet de Google */}
            <div className="bg-white p-6 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                  <Globe className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="text-sm text-[#202124]">{formData.platform_name || 'CineMatch'}</div>
                  <div className="text-xs text-[#4d5156]">{formData.seo_canonical_url || 'https://tusitio.com'}</div>
                </div>
              </div>
              <div className="text-xl text-[#1a0dab] font-medium hover:underline cursor-pointer truncate">
                {formData.seo_title || 'Título de tu página principal'}
              </div>
              <div className="text-sm text-[#4d5156] line-clamp-2">
                {formData.seo_description || 'Descripción que aparecerá en los resultados de búsqueda. Asegúrate de que sea atractiva e incluya palabras clave.'}
              </div>
            </div>

            <div className="space-y-2 mt-8">
              <label className="block text-sm font-medium text-text-secondary">URL Canónica</label>
              <input
                type="url"
                value={formData.seo_canonical_url}
                onChange={(e) => setFormData({ ...formData, seo_canonical_url: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-xl border border-gray-700 mt-4">
              <div>
                <div className="text-sm font-medium text-white">Sitemap Dinámico</div>
                <div className="text-xs text-text-secondary">Generar sitemap.xml automáticamente</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.auto_sitemap}
                  onChange={(e) => setFormData({ ...formData, auto_sitemap: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red" />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
