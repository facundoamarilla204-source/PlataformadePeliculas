import React from 'react';
import { Info, Server, Activity, GitBranch, Cpu, Calendar } from 'lucide-react';

export const SystemTab = () => {
  return (
    <div className="space-y-6">
      <div className="bg-bg-secondary rounded-2xl border border-gray-800 p-6 shadow-xl">
        <div className="flex items-center gap-3 border-b border-gray-800 pb-4 mb-6">
          <div className="p-2.5 bg-gray-500/10 text-gray-400 rounded-xl">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Acerca del Sistema</h3>
            <p className="text-xs text-text-secondary">Información técnica y estado de los servicios</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <GitBranch className="w-4 h-4 text-brand-red" />
              <h4 className="font-semibold text-white">Versión Actual</h4>
            </div>
            <p className="text-2xl font-mono text-gray-300">v1.2.4</p>
            <p className="text-xs text-gray-500 mt-1">Release Estable</p>
          </div>

          <div className="bg-bg-tertiary rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <h4 className="font-semibold text-white">Último Despliegue</h4>
            </div>
            <p className="text-lg font-medium text-gray-300">22 de Julio, 2026</p>
            <p className="text-xs text-gray-500 mt-1">Hace 2 días</p>
          </div>

          <div className="bg-bg-tertiary rounded-xl p-5 border border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              <Server className="w-4 h-4 text-purple-400" />
              <h4 className="font-semibold text-white">Entorno</h4>
            </div>
            <p className="text-lg font-medium text-gray-300 capitalize">Producción</p>
            <p className="text-xs text-gray-500 mt-1">Node.js (Express)</p>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Salud de Servicios</h4>
          <div className="bg-bg-tertiary rounded-xl border border-gray-800 divide-y divide-gray-800">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-white">API Principal (Backend)</span>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operativo
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-white">Base de Datos (Supabase)</span>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operativo
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-white">Servidor Frontend (Next.js)</span>
              </div>
              <div className="flex items-center gap-2 text-green-500 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                Operativo
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Necesario importar Database arriba
import { Database } from 'lucide-react';
