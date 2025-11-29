import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogOut, Home } from 'lucide-react';
import { AdminDashboard } from '../components/AdminDashboard';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('ipm_admin_authed');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <header className="bg-slate-900 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-yellow-400 text-slate-900">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Dashboard Admin IPM</h1>
              <p className="text-sm text-slate-200/80">Ringkasan fitur prioritas untuk pengelolaan ranting.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <Home size={18} />
              Halaman Utama
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white text-slate-900 hover:bg-yellow-100 transition-colors font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AdminDashboard />
      </main>
    </div>
  );
};
