import React from 'react';
import { Tv, Plus, Trash2, GripVertical } from 'lucide-react';

export interface MovieServer {
  id?: number;
  provider: string;
  is_active: boolean;
  priority: number;
  config: Record<string, any>;
}

interface ServerManagerProps {
  servers: MovieServer[];
  onChange: (servers: MovieServer[]) => void;
}

const PROVIDERS = [
  { id: 'vimeus', name: 'Vimeus' },
  { id: 'goodstream', name: 'GoodStream' },
  { id: 'doodstream', name: 'DoodStream' },
  { id: 'filemoon', name: 'FileMoon' },
  { id: 'streamtape', name: 'StreamTape' },
];

export const ServerManager: React.FC<ServerManagerProps> = ({ servers, onChange }) => {
  const addServer = () => {
    onChange([...servers, { provider: 'vimeus', is_active: true, priority: servers.length, config: {} }]);
  };

  const removeServer = (index: number) => {
    onChange(servers.filter((_, i) => i !== index));
  };

  const updateServer = (index: number, field: keyof MovieServer, value: any) => {
    const newServers = [...servers];
    newServers[index] = { ...newServers[index], [field]: value };
    onChange(newServers);
  };

  const updateConfig = (index: number, key: string, value: any) => {
    const newServers = [...servers];
    newServers[index].config = { ...newServers[index].config, [key]: value };
    onChange(newServers);
  };

  const renderConfigFields = (server: MovieServer, index: number) => {
    switch (server.provider) {
      case 'vimeus':
        return (
          <>
            <div className="space-y-1 mb-2">
              <label className="text-xs text-text-secondary">Modo</label>
              <select
                value={server.config.mode || 'auto'}
                onChange={(e) => updateConfig(index, 'mode', e.target.value)}
                className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
              >
                <option value="auto">Automático (Usa TMDb/IMDb)</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            {server.config.mode === 'manual' && (
              <div className="space-y-1">
                <label className="text-xs text-text-secondary">URL Manual</label>
                <input
                  type="text"
                  value={server.config.manualUrl || ''}
                  onChange={(e) => updateConfig(index, 'manualUrl', e.target.value)}
                  className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
                  placeholder="Ej: https://..."
                />
              </div>
            )}
          </>
        );
      case 'goodstream':
        return (
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">File Code</label>
            <input
              type="text"
              value={server.config.fileCode || ''}
              onChange={(e) => updateConfig(index, 'fileCode', e.target.value)}
              className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
              placeholder="Ej: u9k2j4m3"
            />
          </div>
        );
      case 'doodstream':
        return (
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">File Code</label>
            <input
              type="text"
              value={server.config.fileCode || ''}
              onChange={(e) => updateConfig(index, 'fileCode', e.target.value)}
              className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
              placeholder="Ej: abc123def"
            />
          </div>
        );
      default:
        return (
          <div className="space-y-1">
            <label className="text-xs text-text-secondary">URL / Configuración</label>
            <input
              type="text"
              value={server.config.url || ''}
              onChange={(e) => updateConfig(index, 'url', e.target.value)}
              className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
              placeholder="URL u opciones"
            />
          </div>
        );
    }
  };

  return (
    <div className="border-t border-gray-800 pt-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Servidores de Reproducción</h3>
            <p className="text-xs text-text-secondary">Gestiona múltiples fuentes de video para esta película</p>
          </div>
        </div>
        <button
          type="button"
          onClick={addServer}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Añadir Servidor
        </button>
      </div>

      <div className="space-y-3">
        {servers.map((server, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-700 rounded-lg bg-bg-secondary items-start md:items-center transition-all hover:border-gray-600">
            <div className="cursor-move text-gray-500 hidden md:block">
              <GripVertical className="w-5 h-5" />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <div className="space-y-1">
                <label className="text-xs text-text-secondary">Proveedor</label>
                <select
                  value={server.provider}
                  onChange={(e) => updateServer(index, 'provider', e.target.value)}
                  className="w-full px-2 py-1 bg-bg-tertiary border border-gray-700 rounded text-sm text-white"
                >
                  {PROVIDERS.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 flex flex-col justify-center">
                {renderConfigFields(server, index)}
              </div>
              
              <div className="flex items-center justify-end gap-4">
                <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={server.is_active}
                    onChange={(e) => updateServer(index, 'is_active', e.target.checked)}
                    className="rounded bg-bg-tertiary border-gray-700 text-brand-red focus:ring-brand-red w-4 h-4"
                  />
                  Activo
                </label>
                <button
                  type="button"
                  onClick={() => removeServer(index)}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Eliminar servidor"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {servers.length === 0 && (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-700 rounded-lg">
            No hay servidores configurados. Añade uno para que la película pueda ser reproducida.
          </div>
        )}
      </div>
    </div>
  );
};
