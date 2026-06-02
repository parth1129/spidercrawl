import { useEffect, useState } from 'react';
import axios from 'axios';
import { ExternalLink, RefreshCw, Clock, Tag, Rss } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(mins  / 60);
  const days  = Math.floor(hours / 24);
  if (days  > 0)  return `${days}d ago`;
  if (hours > 0)  return `${hours}h ago`;
  if (mins  > 0)  return `${mins}m ago`;
  return 'Just now';
}

const SOURCE_COLORS = {
  'BleepingComputer':       'bg-blue-900/50 text-blue-300 border-blue-700/50',
  'The Hacker News':        'bg-red-900/50 text-red-300 border-red-700/50',
  'SecurityWeek':           'bg-orange-900/50 text-orange-300 border-orange-700/50',
  'Krebs on Security':      'bg-purple-900/50 text-purple-300 border-purple-700/50',
  'SANS Internet Stormcast':'bg-teal-900/50 text-teal-300 border-teal-700/50',
  default:                  'bg-gray-800/50 text-gray-300 border-gray-600/50',
};

const SOURCE_COLORS_LIGHT = {
  'BleepingComputer':       'bg-blue-100 text-blue-700 border-blue-200',
  'The Hacker News':        'bg-red-100 text-red-700 border-red-200',
  'SecurityWeek':           'bg-orange-100 text-orange-700 border-orange-200',
  'Krebs on Security':      'bg-purple-100 text-purple-700 border-purple-200',
  'SANS Internet Stormcast':'bg-teal-100 text-teal-700 border-teal-200',
  default:                  'bg-gray-100 text-gray-700 border-gray-200',
};

const TAG_COLOR_DARK  = 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/30';
const TAG_COLOR_LIGHT = 'bg-cyan-50 text-cyan-700 border border-cyan-200';

function NewsCard({ article, isDark }) {
  const srcPalette = isDark ? SOURCE_COLORS : SOURCE_COLORS_LIGHT;
  const srcClass   = srcPalette[article.source] || srcPalette.default;

  return (
    <div className={`flex flex-col rounded-xl border p-5 transition-all duration-300 group h-full
      ${isDark
        ? 'bg-gray-900/70 border-gray-800 hover:border-cyan-700/50 hover:shadow-neon-blue'
        : 'bg-white border-gray-200 hover:border-cyan-300 hover:shadow-card-light'
      }`}
    >
      {/* Source + time */}
      <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded border font-mono ${srcClass}`}>
          {article.source}
        </span>
        <span className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <Clock size={11} />
          {timeAgo(article.pubDate)}
        </span>
      </div>

      {/* Title */}
      <h3 className={`text-sm font-semibold leading-snug mb-2 flex-1 group-hover:text-cyan-400 transition-colors
        ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {article.title}
      </h3>

      {/* Summary */}
      <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {article.summary}
      </p>

      {/* Tags + link */}
      <div className="flex items-center justify-between mt-auto flex-wrap gap-2">
        <div className="flex flex-wrap gap-1">
          {(article.tags || []).map((tag) => (
            <span key={tag} className={`text-xs px-1.5 py-0.5 rounded font-mono ${isDark ? TAG_COLOR_DARK : TAG_COLOR_LIGHT}`}>
              {tag}
            </span>
          ))}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-1 text-xs font-medium transition-colors
            ${isDark ? 'text-gray-500 hover:text-cyan-400' : 'text-gray-400 hover:text-cyan-600'}`}
          aria-label={`Read: ${article.title}`}
        >
          Read <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const { isDark } = useTheme();
  const [articles, setArticles] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [source,   setSource]   = useState('');
  const [error,    setError]    = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await axios.get('/api/news?limit=5', { timeout: 15000 });
      setArticles(data.articles || []);
      setSource(data.source);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(); }, []);

  return (
    <section id="news" className={`relative z-10 section-padding ${isDark ? 'bg-obsidian-900/30' : 'bg-gray-50/80'}`}>
      <div className="container-max">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-cyan-400 tracking-widest uppercase mb-3">
              <Rss size={13} />
              Live Feed
            </span>
            <h2 className={`text-3xl sm:text-4xl font-extrabold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Weekly <span className="gradient-text">Hacking News</span>
            </h2>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Aggregated from OWASP, BleepingComputer, Krebs on Security, SecurityWeek &amp; SANS.
              {source === 'cache' && <span className="ml-2 text-xs text-amber-400">(cached)</span>}
              {source === 'mock'  && <span className="ml-2 text-xs text-orange-400">(demo data)</span>}
            </p>
          </div>
          <button
            onClick={fetchNews}
            aria-label="Refresh news"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 self-start sm:self-auto
              ${isDark
                ? 'border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                : 'border-gray-300 text-gray-600 hover:border-cyan-500 hover:text-cyan-600'
              }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`rounded-xl border p-5 animate-pulse h-48 ${isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className={`h-3 rounded mb-3 w-1/3 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded mb-2 w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded mb-2 w-5/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-3 rounded w-2/3 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`} />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className={`rounded-xl border p-8 text-center ${isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200'}`}>
            <p className={`mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Failed to fetch news. Backend may not be running.
            </p>
            <button onClick={fetchNews} className="text-sm text-cyan-400 hover:text-cyan-300 underline">
              Try again
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <NewsCard key={i} article={article} isDark={isDark} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
