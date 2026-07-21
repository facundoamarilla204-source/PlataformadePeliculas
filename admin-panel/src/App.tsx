import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Login } from './features/auth/Login';
import { AdminLayout } from './components/layout/AdminLayout';
import { Dashboard } from './features/dashboard/Dashboard';
import './App.css';

import { MovieList } from './features/movies/MovieList';
import { MovieForm } from './features/movies/MovieForm';

import { CategoryList } from './features/categories/CategoryList';
import { BannerManager } from './features/banners/BannerManager';
import { SettingsForm } from './features/settings/SettingsForm';

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-bg-primary text-text-primary">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/movies" element={<MovieList />} />
              <Route path="/movies/new" element={<MovieForm />} />
              <Route path="/movies/edit/:id" element={<MovieForm />} />
              <Route path="/categories" element={<CategoryList />} />
              <Route path="/banners" element={<BannerManager />} />
              <Route path="/settings" element={<SettingsForm />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
