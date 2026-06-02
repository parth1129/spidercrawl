import { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, ExternalLink, Shield, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function severityConfig(severity, score) {
  if (!score && !severity) return { label: 'N/A', bg: 'bg-gray-700 text-gray-300', dot: 'bg-gray-500' };
  const s = (severity || '').toUpperCase();
  if (s === 'CRITICAL' || score >= 9.0) return { label: 'CRITICAL', bg: 'bg-red-900/70 text-red-300 border border-red-700/50',    dot: 'bg-red-400'    };
  if (s === 'HIGH'     || score >= 7.0) return { label: 'HIGH',     bg: 'bg-orange-900/70 text-orange-300 border border-orange-700/50', dot: 'bg-orange-400' };
  if (s === 'MEDIUM'   || score >= 4.0) return { label: 'MEDIUM',   bg: 'bg-yellow-900/70 text-yellow-300 border border-yellow-700/50', dot: 'bg-yellow-400' };
  return                                       { label: 'LOW',      bg: 'bg-green-900/70 text-green-300 border border-green-700/50',   dot: 'bg-green-400'  };
}

function severityConfigLight(severity, score) {
  const s = (severity || '').toUpperCase();
  if (s === 'CRITICAL' || score >= 9.0) return { label: 'CRITICAL', bg: 'bg-red-100 text-red-700 border border-red-200',      dot: 'bg-red-500'    };
  if (s === 'HIGH'     || score >= 7.0) return { label: 'HIGH',     bg: 'bg-orange-100 text-orange-700 border border-orange-200', dot: 'bg-orange-500' };
  if (s === 'MEDIUM'   || score >= 4.0) return { label: 'MEDIUM',   bg: 'bg-yellow-100 text-yellow-700 border border-yellow-200', dot: 'bg-yellow-500' };
  return                                       { label: 'LOW',      bg: 'bg-green-100 text-green-700 border border-green-200',   dot: 'bg-green-500'  };
}

const SEVERITY_FILTERS = ['All', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

export default function CVETracker() {
  const { isDark } = useTheme();
  const [cves,       setCves]       = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [source,     setSource]     = useState('');
  const [error,      setError]      = useState(false);
  const [filter,     setFilter]     = useState('All');
  const [lastUpdated,setLastUpdated]= useState(null);

  const fetchCVEs = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get('/api/cves?results=20', { timeout: 18000 });
      setCves(data.vulnerabilities || []);
      setSource(data.source);
      setLastUpdated(data.fetchedAt);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCVEs(); }, []);

  const filtered = filter === 'All'
    ? cves
    : cves.filter((c) => {
        const cfg = severityConfig(c.severity, c.score);
        return cfg.label === filter;
      });

  const tableBase = isDark
    ? 'bg-gray-900/80 border border-gray-800'
    : 'bg-white border border-gray-200 shadow-card-light';

  const thBase = isDark
    ? 'bg-gray-800/70 text-gray-400 border-b border-gray-700'
    : 'bg-gray-50 text-gray-500 border-b border-gray-200';

  const trBase = isDark
    ? 'border-b border-gray-800/70 hover:bg-cyan-900/10'
    : 'border-b border-gray-100 hover:bg-gray-50';

  const tdBase = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <section id="cve-tracker" className={`relative z-10 section-padding ${isDark ? '' : 'bg-white'}`}>
      <div className="container-max">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-red-400 tracking-widest uppercase mb-3">
              <AlertTriangle size={13} />
              Live CVE Data
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Recent Vulnerabilities —{' '}
              <span className="gradient-text">Live from NVD</span>
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Real-time CVE data sourced from{' '}
              <a href="https://nvd.nist.gov" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">
                NIST National Vulnerability Database
              </a>
              . Updated every 30 minutes.
              {source === 'cache' && <span className="ml-2 text-amber-400">(cached)</span>}
              {source === 'mock'  && <span className="ml-2 text-orange-400">(demo data)</span>}
            </p>
            {lastUpdated && (
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Last fetched: {new Date(lastUpdated).toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={fetchCVEs}
            aria-label="Refresh CVEs"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all self-start sm:self-auto
              ${isDark
                ? 'border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                : 'border-gray-300 text-gray-600 hover:border-cyan-500 hover:text-cyan-600'
              }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* ── Severity filters ─────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-5">
          {SEVERITY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200
                ${filter === f
                  ? isDark
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400'
                    : 'bg-cyan-100 border-cyan-400 text-cyan-700'
                  : isDark
                    ? 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                    : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table ────────────────────────────────────────────── */}
        {loading ? (
          <div className={`rounded-xl ${tableBase} p-6`}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex gap-4 py-3 border-b ${isDark ? 'border-gray-800' : 'border-gray-100'}`}>
                <div className={`h-3 rounded w-32 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
                <div className={`h-3 rounded flex-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} animate-pulse`} />
                <div className={`h-3 rounded w-16 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`rounded-xl border p-8 text-center ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
            <Shield size={32} className="text-gray-500 mx-auto mb-3" />
            <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Could not reach CVE API. Make sure the backend server is running.
            </p>
            <button onClick={fetchCVEs} className="text-sm text-cyan-400 hover:text-cyan-300 underline">
              Retry
            </button>
          </div>
        ) : (
          <div className={`rounded-xl overflow-hidden ${tableBase}`}>
            {/* Legend */}
            <div className={`flex flex-wrap gap-3 px-4 py-3 border-b text-xs ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
              {[
                { label: 'CRITICAL (9.0–10.0)', dot: 'bg-red-400'    },
                { label: 'HIGH (7.0–8.9)',      dot: 'bg-orange-400' },
                { label: 'MEDIUM (4.0–6.9)',    dot: 'bg-yellow-400' },
                { label: 'LOW (0.1–3.9)',       dot: 'bg-green-400'  },
              ].map(({ label, dot }) => (
                <span key={label} className={`flex items-center gap-1.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  {label}
                </span>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full cve-table">
                <thead>
                  <tr className={thBase}>
                    <th className="px-4 py-3 text-left">CVE ID</th>
                    <th className="px-4 py-3 text-left hidden sm:table-cell">Description</th>
                    <th className="px-4 py-3 text-center">CVSS</th>
                    <th className="px-4 py-3 text-center hidden md:table-cell">Severity</th>
                    <th className="px-4 py-3 text-center hidden lg:table-cell">Published</th>
                    <th className="px-4 py-3 text-center">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className={`px-4 py-8 text-center text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        No CVEs match the selected filter.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((cve) => {
                      const cfg = isDark
                        ? severityConfig(cve.severity, cve.score)
                        : severityConfigLight(cve.severity, cve.score);
                      return (
                        <tr key={cve.id} className={`transition-colors duration-150 ${trBase}`}>
                          {/* ID */}
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-cyan-400 whitespace-nowrap">
                            {cve.id}
                          </td>
                          {/* Description */}
                          <td className={`px-4 py-3 text-xs max-w-sm hidden sm:table-cell ${tdBase}`}>
                            {cve.description}
                          </td>
                          {/* CVSS score */}
                          <td className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center gap-1 font-mono text-xs font-bold
                              ${cve.score >= 9 ? 'text-red-400' : cve.score >= 7 ? 'text-orange-400' : cve.score >= 4 ? 'text-yellow-400' : 'text-green-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                              {cve.score !== null ? cve.score.toFixed(1) : 'N/A'}
                            </span>
                          </td>
                          {/* Severity badge */}
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${cfg.bg}`}>
                              {cfg.label}
                            </span>
                          </td>
                          {/* Published date */}
                          <td className={`px-4 py-3 text-center text-xs font-mono hidden lg:table-cell ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                            {cve.published}
                          </td>
                          {/* External link */}
                          <td className="px-4 py-3 text-center">
                            <a
                              href={cve.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`NVD details for ${cve.id}`}
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-lg border transition-colors
                                ${isDark
                                  ? 'border-gray-700 text-gray-500 hover:border-cyan-500 hover:text-cyan-400'
                                  : 'border-gray-200 text-gray-400 hover:border-cyan-400 hover:text-cyan-600'
                                }`}
                            >
                              <ExternalLink size={12} />
                            </a>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
