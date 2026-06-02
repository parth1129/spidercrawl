import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function AdminPortal() {
  const { user, login } = useAuth();
  const { isDark }       = useTheme();
  const navigate         = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Already logged in — redirect to dashboard
  if (user) return <Navigate to="/admin-dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate('/admin-dashboard', { replace: true });
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password'
        ? 'Invalid email or password.'
        : err.code === 'auth/too-many-requests'
          ? 'Too many failed attempts. Please try again later.'
          : 'Authentication failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBase = `w-full rounded-lg px-4 py-3 text-sm border outline-none transition-all duration-200 focus:ring-2 focus:ring-cyan-500/50
    ${isDark
      ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
    }`;

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative
      ${isDark ? 'bg-obsidian-950' : 'bg-gray-50'}`}>

      {/* Background grid */}
      <div className={`fixed inset-0 ${isDark ? 'bg-grid-dark' : 'bg-grid-light'} pointer-events-none`} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield size={32} className="text-cyan-400" strokeWidth={1.5} />
          <span className="text-2xl font-bold">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>Spider</span>
            <span className="text-neon-blue glow-blue"> Crawl</span>
          </span>
        </div>

        {/* Card */}
        <div className={`rounded-2xl border p-8
          ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-card-light'}`}>

          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4
              ${isDark ? 'bg-cyan-900/30 border border-cyan-700/40' : 'bg-cyan-50 border border-cyan-200'}`}>
              <Shield size={22} className="text-cyan-400" />
            </div>
            <h1 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Admin Portal
            </h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              Restricted access — authorized personnel only
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Email */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@spidercrawl.com"
                className={inputBase}
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`${inputBase} pr-11`}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-700/40">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-cyan-500 to-cyan-400 text-obsidian-950
                hover:from-cyan-400 hover:to-emerald-400 hover:shadow-neon-blue
                disabled:opacity-60 disabled:cursor-not-allowed
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-obsidian-950/40 border-t-obsidian-950 rounded-full animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <Shield size={15} />
                  Sign In Securely
                </>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <p className={`text-center text-sm mt-6 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          <a href="/" className={`hover:underline ${isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}>
            ← Back to website
          </a>
        </p>
      </div>
    </div>
  );
}
