import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const fallbackEmail = 'admin@ipm.local';
const fallbackPassword = 'admin123';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [storedEmail, setStoredEmail] = useState<string>(fallbackEmail);
  const [storedPassword, setStoredPassword] = useState<string>(fallbackPassword);

  const envEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  const effectiveEmail = storedEmail || envEmail || fallbackEmail;
  const effectivePassword = storedPassword || envPassword || fallbackPassword;

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const snap = await getDoc(doc(db, 'DataAdmin', 'Akun'));
        if (snap.exists()) {
          const data = snap.data() as { Email?: string; Password?: string };
          setStoredEmail(data?.Email || envEmail || fallbackEmail);
          setStoredPassword(data?.Password || envPassword || fallbackPassword);
        } else {
          setStoredEmail(envEmail || fallbackEmail);
          setStoredPassword(envPassword || fallbackPassword);
        }
      } catch (err) {
        console.error('Gagal mengambil data admin:', err);
        setError('Gagal mengambil kredensial admin. Gunakan fallback .env atau coba lagi.');
        setStoredEmail(envEmail || fallbackEmail);
        setStoredPassword(envPassword || fallbackPassword);
      } finally {
        setFetching(false);
      }
    };

    if (localStorage.getItem('ipm_admin_authed') === 'true') {
      navigate('/admin', { replace: true });
      return;
    }

    fetchAdminData();
  }, [navigate, envEmail, envPassword]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    setTimeout(() => {
      if (trimmedEmail === effectiveEmail.toLowerCase() && password === effectivePassword) {
        localStorage.setItem('ipm_admin_authed', 'true');
        navigate('/admin', { replace: true });
      } else {
        setError('Email atau password tidak sesuai.');
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-xs font-semibold uppercase tracking-wide">
            Admin Area
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Masuk Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Akses khusus pengurus. Kredensial diambil dari Firestore (<code>DataAdmin/Akun</code>) dengan fallback .env, tanpa menampilkan detail di layar.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-6 space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-slate-700 dark:text-slate-200">
            <div className="p-2 rounded-full bg-slate-900 text-white dark:bg-slate-900/80">
              <ShieldCheck size={20} />
            </div>
            <div className="text-sm">
              <p className="font-semibold">Rute: /admin/login</p>
              <p className="text-slate-500 dark:text-slate-400">Hanya untuk internal IPM.</p>
            </div>
          </div>

          {fetching ? (
            <div className="flex items-center justify-center py-8 text-slate-600 dark:text-slate-300 gap-3">
              <Loader2 className="animate-spin" size={20} />
              Memuat data admin...
            </div>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Email admin"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <Lock size={16} />
              {error}
            </div>
          )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded-lg transition-colors disabled:opacity-70"
            >
              {loading ? 'Memproses...' : (
                <>
                  <LogIn size={18} />
                  Masuk
                </>
              )}
            </button>
          </form>
          )}

          <div className="text-xs text-slate-500 dark:text-slate-400">
            Sumber kredensial: Firestore (<code>DataAdmin/Akun</code>) dengan fallback .env (nilai tidak ditampilkan).
          </div>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm font-semibold text-yellow-600 hover:text-yellow-700 dark:text-yellow-400">
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  );
};
