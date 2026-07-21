import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Film, FolderOpen, Image as ImageIcon, Settings, LogOut, Menu, X, Tv } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
  const { logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Películas', path: '/movies', icon: Film },
    { name: 'Categorías', path: '/categories', icon: FolderOpen },
    { name: 'Banners Home', path: '/banners', icon: ImageIcon },
    { name: 'Streaming', path: '/streaming', icon: Tv },
    { name: 'Configuración', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-bg-secondary border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          <span className="text-brand-red font-black">CM</span> Admin
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-text-secondary hover:text-white rounded-lg bg-bg-tertiary"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Backdrop for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed lg:static top-0 left-0 bottom-0 z-50
        w-64 bg-bg-secondary border-r border-gray-800 min-h-screen flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 hidden lg:block">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="text-brand-red font-black">CM</span> Admin
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-16 lg:mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-brand-red text-white shadow-lg shadow-brand-red/20 font-semibold'
                    : 'text-text-secondary hover:bg-bg-tertiary hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-text-secondary hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </>
  );
};
