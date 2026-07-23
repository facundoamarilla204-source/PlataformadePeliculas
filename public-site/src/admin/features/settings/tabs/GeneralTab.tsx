import React from 'react';
import { Globe, ShieldAlert, Type, Link, MessageSquare } from 'lucide-react';
import type { SettingsData } from '../SettingsForm';

export const GeneralTab = ({ formData, setFormData }: { formData: SettingsData, setFormData: (data: SettingsData) => void }) => {
  return (
    <div className="space-y-6">
      {/* Información Pública */}
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-brand-red/10 text-brand-red rounded-xl">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Identidad de la Plataforma</h3>
            <p className="text-xs text-text-secondary">Información básica y pública de la marca</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Nombre de la Plataforma</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                required
                value={formData.platform_name}
                onChange={(e) => setFormData({ ...formData, platform_name: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-medium text-text-secondary">Descripción de la Plataforma</label>
            <textarea
              rows={2}
              value={formData.platform_description}
              onChange={(e) => setFormData({ ...formData, platform_description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">URL Principal</label>
            <div className="relative">
              <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="url"
                placeholder="https://..."
                value={formData.platform_url}
                onChange={(e) => setFormData({ ...formData, platform_url: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-text-secondary">Idioma</label>
            <select
              value={formData.language}
              onChange={(e) => setFormData({ ...formData, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-700 rounded-xl bg-bg-tertiary text-text-primary focus:outline-none focus:border-brand-red"
            >
              <option value="es-ES">Español (España)</option>
              <option value="es-AR">Español (Argentina)</option>
              <option value="es-MX">Español (México)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Redes Sociales */}
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Redes Sociales</h3>
            <p className="text-xs text-text-secondary">Enlaces oficiales que aparecerán en el sitio</p>
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

      {/* Modo Mantenimiento */}
      <div className={`bg-bg-secondary rounded-2xl border p-6 shadow-xl transition-all ${formData.maintenance_mode ? 'border-red-500/50 bg-red-900/10' : 'border-gray-800'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${formData.maintenance_mode ? 'bg-red-500/20 text-red-500' : 'bg-gray-800 text-gray-400'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Modo Mantenimiento</h3>
              <p className="text-xs text-text-secondary">Bloquea el acceso público y muestra un mensaje</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.maintenance_mode}
              onChange={(e) => setFormData({ ...formData, maintenance_mode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-bg-tertiary border border-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-600" />
          </label>
        </div>

        {formData.maintenance_mode && (
          <div className="mt-4 pt-4 border-t border-red-500/20 animate-fade-in">
            <label className="block text-sm font-medium text-red-400 mb-2">Mensaje para los usuarios</label>
            <textarea
              rows={2}
              value={formData.maintenance_message}
              onChange={(e) => setFormData({ ...formData, maintenance_message: e.target.value })}
              placeholder="Estamos realizando tareas de mantenimiento..."
              className="w-full px-4 py-3 border border-red-500/30 rounded-xl bg-bg-primary text-text-primary focus:outline-none focus:border-red-500 resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
