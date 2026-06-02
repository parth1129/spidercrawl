import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  collection, getDocs, doc, updateDoc, query, orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Shield, LogOut, RefreshCw, Mail, Clock, ChevronDown, ChevronUp,
  CheckCheck, MessageSquare, Inbox,
} from 'lucide-react';

const STATUS_CONFIG = {
  unread:     { label: 'Unread',     bg: 'bg-red-900/40 text-red-300 border-red-700/50'     },
  read:       { label: 'Read',       bg: 'bg-blue-900/40 text-blue-300 border-blue-700/50'  },
  responded:  { label: 'Responded',  bg: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50' },
};

const STATUS_CONFIG_LIGHT = {
  unread:     { label: 'Unread',     bg: 'bg-red-100 text-red-700 border-red-200'          },
  read:       { label: 'Read',       bg: 'bg-blue-100 text-blue-700 border-blue-200'        },
  responded:  { label: 'Responded',  bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

function formatDate(ts) {
  if (!ts) return 'N/A';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function MessageRow({ msg, onStatusChange, isDark }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);

  const cfg = isDark
    ? STATUS_CONFIG[msg.status]      || STATUS_CONFIG.unread
    : STATUS_CONFIG_LIGHT[msg.status] || STATUS_CONFIG_LIGHT.unread;

  const changeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      await updateDoc(doc(db, 'contact_requests', msg.id), { status: newStatus });
      onStatusChange(msg.id, newStatus);
    } catch (e) {
      console.error('[Admin Update]', e.message);
    } finally {
      setUpdating(false);
    }
  };

  const trBase = `border-b transition-colors ${isDark ? 'border-gray-800 hover:bg-gray-800/30' : 'border-gray-100 hover:bg-gray-50'}`;
  const tdBase = `px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`;

  return (
    <>
      <tr className={trBase}>
        <td className={tdBase}>
          <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{msg.name}</div>
          {msg.company && <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{msg.company}</div>}
        </td>
        <td className={`${tdBase} hidden sm:table-cell`}>
          <a
            href={`mailto:${msg.email}`}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs"
          >
            <Mail size={11} /> {msg.email}
          </a>
        </td>
        <td className={`${tdBase} hidden md:table-cell`}>
          <span className={`text-xs px-2 py-0.5 rounded border font-mono ${isDark ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-600'}`}>
            {msg.subject}
          </span>
        </td>
        <td className={`${tdBase} hidden lg:table-cell`}>
          <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Clock size={11} /> {formatDate(msg.createdAt)}
          </div>
        </td>
        <td className={tdBase}>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${cfg.bg}`}>
            {cfg.label}
          </span>
        </td>
        <td className={`${tdBase} text-right`}>
          <div className="flex items-center justify-end gap-1">
            {/* Status actions */}
            {msg.status !== 'read' && (
              <button
                onClick={() => changeStatus('read')}
                disabled={updating}
                aria-label="Mark as read"
                data-tooltip="Mark Read"
                className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-500 hover:border-blue-500 hover:text-blue-400' : 'border-gray-200 text-gray-400 hover:border-blue-400 hover:text-blue-600'}`}
              >
                <CheckCheck size={13} />
              </button>
            )}
            {msg.status !== 'responded' && (
              <button
                onClick={() => changeStatus('responded')}
                disabled={updating}
                aria-label="Mark as responded"
                data-tooltip="Mark Responded"
                className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-500 hover:border-emerald-500 hover:text-emerald-400' : 'border-gray-200 text-gray-400 hover:border-emerald-400 hover:text-emerald-600'}`}
              >
                <MessageSquare size={13} />
              </button>
            )}
            {/* Expand message */}
            <button
              onClick={() => setExpanded((p) => !p)}
              aria-label={expanded ? 'Collapse message' : 'Expand message'}
              className={`p-1.5 rounded-lg border transition-colors ${isDark ? 'border-gray-700 text-gray-500 hover:border-cyan-500 hover:text-cyan-400' : 'border-gray-200 text-gray-400 hover:border-cyan-400 hover:text-cyan-600'}`}
            >
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded message row */}
      {expanded && (
        <tr className={isDark ? 'bg-gray-900/40' : 'bg-gray-50/80'}>
          <td colSpan={6} className="px-6 py-4">
            <div className={`text-sm leading-relaxed p-3 rounded-lg border whitespace-pre-wrap
              ${isDark ? 'bg-gray-800/50 border-gray-700 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
              {msg.message}
            </div>
            {/* Mobile-only supplementary details */}
            <div className={`mt-3 flex flex-wrap gap-3 text-xs sm:hidden ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <span><Mail size={10} className="inline mr-1" />{msg.email}</span>
              <span><Clock size={10} className="inline mr-1" />{formatDate(msg.createdAt)}</span>
              <span>{msg.subject}</span>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { isDark }       = useTheme();
  const [messages,  setMessages]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [filter,    setFilter]    = useState('all');

  if (!user) return <Navigate to="/admin-portal" replace />;

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const q    = query(collection(db, 'contact_requests'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error('[Admin Fetch]', e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMessages(); }, []);

  const updateLocal = (id, status) =>
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));

  const filtered = filter === 'all'
    ? messages
    : messages.filter((m) => m.status === filter);

  const counts = {
    total:     messages.length,
    unread:    messages.filter((m) => m.status === 'unread').length,
    responded: messages.filter((m) => m.status === 'responded').length,
  };

  const thBase = `px-4 py-3 text-xs font-semibold uppercase tracking-wider text-left
    ${isDark ? 'bg-gray-800/70 text-gray-400 border-b border-gray-700' : 'bg-gray-50 text-gray-500 border-b border-gray-200'}`;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-obsidian-950' : 'bg-gray-50'}`}>
      {/* Background grid */}
      <div className={`fixed inset-0 ${isDark ? 'bg-grid-dark' : 'bg-grid-light'} pointer-events-none`} />

      {/* Header bar */}
      <header className={`sticky top-0 z-40 border-b ${isDark ? 'bg-obsidian-950/90 border-gray-800' : 'bg-white/90 border-gray-200'}`}
        style={{ backdropFilter: 'blur(12px)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield size={22} className="text-cyan-400" strokeWidth={1.5} />
            <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Spider Crawl</span>
            <span className={`text-xs px-2 py-0.5 rounded font-mono ml-2 ${isDark ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-700/40' : 'bg-cyan-100 text-cyan-700 border border-cyan-300'}`}>
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-xs hidden sm:block ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {user.email}
            </span>
            <button
              onClick={logout}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
                ${isDark
                  ? 'border-gray-700 text-gray-400 hover:border-red-500 hover:text-red-400'
                  : 'border-gray-300 text-gray-500 hover:border-red-400 hover:text-red-600'
                }`}
            >
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">

        {/* Page title + stats */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Contact Requests
            </h1>
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Submissions from the website contact form stored in Firestore.
            </p>
          </div>
          <button
            onClick={fetchMessages}
            aria-label="Refresh messages"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all self-start sm:self-auto
              ${isDark
                ? 'border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400'
                : 'border-gray-300 text-gray-600 hover:border-cyan-500 hover:text-cyan-600'
              }`}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stat chips */}
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: 'Total',     count: counts.total,     icon: Inbox,        color: 'text-cyan-400'   },
            { label: 'Unread',    count: counts.unread,    icon: Mail,         color: 'text-red-400'    },
            { label: 'Responded', count: counts.responded, icon: MessageSquare, color: 'text-emerald-400' },
          ].map(({ label, count, icon: Icon, color }) => (
            <div key={label} className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm
              ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200 shadow-sm'}`}>
              <Icon size={14} className={color} />
              <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{count}</span>
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{label}</span>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className={`flex gap-2 mb-4`}>
          {['all', 'unread', 'read', 'responded'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-all
                ${filter === f
                  ? isDark
                    ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-400'
                    : 'bg-cyan-100 border-cyan-400 text-cyan-700'
                  : isDark
                    ? 'bg-transparent border-gray-700 text-gray-400 hover:border-gray-500'
                    : 'bg-transparent border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
            >
              {f === 'all' ? `All (${counts.total})` : f}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-gray-900/80 border-gray-800' : 'bg-white border-gray-200 shadow-card-light'}`}>
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw size={28} className="text-cyan-400 animate-spin mx-auto mb-3" />
              <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Loading messages…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center">
              <Inbox size={36} className={`mx-auto mb-3 ${isDark ? 'text-gray-700' : 'text-gray-300'}`} />
              <p className={`font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>No messages found</p>
              <p className={`text-sm ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                {filter !== 'all' ? `No messages with status "${filter}".` : 'Contact form submissions will appear here.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className={thBase}>Name</th>
                    <th className={`${thBase} hidden sm:table-cell`}>Email</th>
                    <th className={`${thBase} hidden md:table-cell`}>Subject</th>
                    <th className={`${thBase} hidden lg:table-cell`}>Date</th>
                    <th className={thBase}>Status</th>
                    <th className={`${thBase} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((msg) => (
                    <MessageRow
                      key={msg.id}
                      msg={msg}
                      onStatusChange={updateLocal}
                      isDark={isDark}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
