import React from 'react';
import { Palette, Play, Image as ImageIcon } from 'lucide-react';
import type { SettingsData } from '../SettingsForm';

export const AppearanceTab = ({ formData, setFormData }: { formData: SettingsData, setFormData: (data: SettingsData) => void }) => {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Apariencia Visual</h3>
            <p className="text-xs text-text-secondary">Colores y fondos que determinan el look and feel del sitio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Tema Base</label>
              <select
                value={formData.theme_mode}
                onChange={(e) => setFormData({ ...formData, theme_mode: e.target.value })}
                className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              >
                <option value="dark">Oscuro (Dark)</option>
                <option value="light">Claro (Light)</option>
                <option value="auto">Automático (Sistema)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Color Principal</label>
                <div className="flex items-center gap-3 bg-bg-tertiary border border-gray-700 rounded-xl px-4 py-2">
                  <input
                    type="color"
                    value={formData.color_primary}
                    onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.color_primary}
                    onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
                    className="w-full bg-transparent border-none text-white focus:outline-none uppercase font-mono text-sm"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Fondo Principal</label>
                <div className="flex items-center gap-3 bg-bg-tertiary border border-gray-700 rounded-xl px-4 py-2">
                  <input
                    type="color"
                    value={formData.color_background}
                    onChange={(e) => setFormData({ ...formData, color_background: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={formData.color_background}
                    onChange={(e) => setFormData({ ...formData, color_background: e.target.value })}
                    className="w-full bg-transparent border-none text-white focus:outline-none uppercase font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-secondary">Fondo Hero (Inicio)</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.home_bg_image}
                  onChange={(e) => setFormData({ ...formData, home_bg_image: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
                />
              </div>
              <p className="text-xs text-text-secondary mt-1">Dejar vacío para usar una película destacada al azar</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Vista Previa</h4>
            
            {/* Live Preview Card */}
            <div 
              className="rounded-2xl border border-gray-700 overflow-hidden relative shadow-2xl h-[300px]"
              style={{ backgroundColor: formData.color_background }}
            >
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `url(${formData.home_bg_image || 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t" style={{ backgroundImage: `linear-gradient(to top, ${formData.color_background}, transparent)` }} />
              
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h1 className="text-2xl font-bold text-white mb-2 shadow-sm">{formData.platform_name || 'CineMatch'}</h1>
                <p className="text-sm text-gray-300 line-clamp-2 mb-4 w-3/4">
                  {formData.platform_description || 'Disfruta de las mejores películas en calidad HD sin interrupciones.'}
                </p>
                
                <div className="flex items-center gap-3">
                  <button 
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-white transition-all hover:scale-105"
                    style={{ backgroundColor: formData.color_primary }}
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Reproducir
                  </button>
                  <button 
                    className="px-5 py-2.5 rounded-lg font-bold text-white transition-all bg-white/10 hover:bg-white/20 backdrop-blur-md"
                  >
                    Más Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
