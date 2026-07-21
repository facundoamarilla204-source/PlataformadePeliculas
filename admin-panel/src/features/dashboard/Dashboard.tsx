import React, { useEffect, useState } from 'react';
import { Film, Users, PlayCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    categories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moviesRes, catsRes] = await Promise.all([
          api.get('/movies'),
          api.get('/categories')
        ]);
        setStats({
          movies: moviesRes.data.length,
          categories: catsRes.data.length
        });
      } catch (error) {
        console.error('Error cargando estadísticas', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Películas', value: stats.movies, icon: Film, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Categorías', value: stats.categories, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Reproducciones', value: '---', icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Usuarios', value: '---', icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-bg-secondary rounded-xl p-6 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-bg-secondary rounded-xl border border-gray-800 p-6 min-h-[300px] flex items-center justify-center">
        <p className="text-text-secondary">Próximamente: Gráficos y analíticas de visualización</p>
      </div>
    </div>
  );
};
