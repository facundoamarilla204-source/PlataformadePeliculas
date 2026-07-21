import React, { useEffect, useState } from 'react';
import { Film, Users, PlayCircle, Clock } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../../services/api';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    movies: 0,
    categories: 0,
    users: 0,
    views: 0
  });

  const [chartData, setChartData] = useState({
    views: [],
    categories: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/dashboard/stats');
        setStats(res.data.stats);
        setChartData(res.data.charts);
      } catch (error) {
        console.error('Error cargando estadísticas', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: 'Películas', value: stats.movies, icon: Film, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Categorías', value: stats.categories, icon: Clock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Reproducciones', value: stats.views, icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Visitas', value: stats.users, icon: Users, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-bg-secondary rounded-xl p-6 border border-gray-800 flex items-center justify-between transition-transform hover:scale-105">
            <div>
              <p className="text-sm font-medium text-text-secondary mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value.toLocaleString()}</h3>
            </div>
            <div className={`p-4 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Gráfico de Reproducciones */}
        <div className="bg-bg-secondary rounded-xl border border-gray-800 p-6 min-h-[350px]">
          <h2 className="text-xl font-semibold text-white mb-6">Reproducciones (Últimos 6 Meses)</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData.views} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis stroke="#9ca3af" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#22c55e' }}
                />
                <Area type="monotone" dataKey="views" name="Vistas" stroke="#22c55e" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Categorías */}
        <div className="bg-bg-secondary rounded-xl border border-gray-800 p-6 min-h-[350px]">
          <h2 className="text-xl font-semibold text-white mb-6">Distribución por Categorías</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData.categories} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#9ca3af" axisLine={false} tickLine={false} width={80} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#fff', borderRadius: '0.5rem' }}
                  cursor={{fill: '#374151', opacity: 0.4}}
                />
                <Bar dataKey="value" name="Películas" fill="#a855f7" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};
