import { AlertTriangle, Clock, Users, TrendingDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const STATS = [
  {
    value: '43%',
    label: 'of cyberattacks target small businesses',
    icon: Users,
    accent: 'text-cyber-red',
    border: 'border-red-500/30',
    glow:   'hover:shadow-neon-red',
  },
  {
    value: '95%',
    label: 'of breaches due to human error or misconfiguration',
    icon: AlertTriangle,
    accent: 'text-orange-400',
    border: 'border-orange-500/30',
    glow:   'hover:shadow-neon-orange',
  },
  {
    value: '200',
    unit: 'days',
    label: 'average time to detect a breach',
    icon: Clock,
    accent: 'text-yellow-400',
    border: 'border-yellow-500/30',
    glow:   'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]',
  },
  {
    value: '₹4.5 Cr',
    label: 'avg cost of a data breach in India (2024)',
    subtext: 'Source: IBM Cost of a Data Breach Report 2024, CERT-In',
    icon: TrendingDown,
    accent: 'text-purple-400',
    border: 'border-purple-500/30',
    glow:   'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  },
];

const IMPACT_CARDS = [
  {
    vuln:   'SQL Injection',
    impact: 'Full Data Dump',
    code:   "' OR '1'='1",
    color:  'from-red-500/10 to-red-900/5 border-red-500/30',
    badge:  'CRITICAL',
    badgeBg:'bg-red-900/60 text-red-300',
  },
  {
    vuln:   'Broken Auth',
    impact: 'Account Takeover',
    code:   'JWT alg: none',
    color:  'from-orange-500/10 to-orange-900/5 border-orange-500/30',
    badge:  'HIGH',
    badgeBg:'bg-orange-900/60 text-orange-300',
  },
];

export default function CostOfSecurity() {
  const { isDark } = useTheme();

  return (
    <section
      id="risk"
      className={`relative z-10 section-padding ${isDark ? 'bg-obsidian-900/40' : 'bg-gray-50/80'}`}
    >
      <div className="container-max">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono font-semibold text-cyan-400 tracking-widest uppercase mb-3">
            Risk Assessment
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Why Skipping Security Testing Is a{' '}
            <span className="gradient-text">Costly Gamble</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Startups and SMBs are prime targets. Attackers are automated. Don't risk compliance, revenue, and trust.
          </p>
        </div>

        {/* ── Stats grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {STATS.map(({ value, unit, label, subtext, icon: Icon, accent, border, glow }) => (
            <div
              key={value}
              className={`relative rounded-xl border p-6 transition-all duration-300 group cursor-default
                ${isDark
                  ? `bg-gray-900/60 ${border} ${glow}`
                  : `bg-white border-gray-200 hover:border-cyan-300 hover:shadow-card-light`
                }`}
            >
              <Icon size={20} className={`${accent} mb-4 opacity-80`} />
              <div className={`text-3xl sm:text-4xl font-extrabold font-mono mb-1 ${accent}`}>
                {value}
                {unit && <span className="text-xl ml-1">{unit}</span>}
              </div>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {label}
              </p>
              {subtext && (
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                  {subtext}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Impact cards ─────────────────────────────────────── */}
        <div className="grid sm:grid-cols-2 gap-5">
          {IMPACT_CARDS.map(({ vuln, impact, code, color, badge, badgeBg }) => (
            <div
              key={vuln}
              className={`rounded-xl border bg-gradient-to-br p-6 ${color} transition-all duration-300
                ${isDark ? '' : 'bg-white border-gray-200'}
              `}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded font-mono ${badgeBg}`}>
                    {badge}
                  </span>
                  <h3 className={`text-lg font-bold mt-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    One {vuln} ={' '}
                    <span className="text-red-400">{impact}</span>
                  </h3>
                </div>
              </div>
              <div className={`mt-3 px-3 py-2 rounded font-mono text-sm inline-block
                ${isDark ? 'bg-black/40 text-emerald-400' : 'bg-gray-100 text-emerald-700'}`}>
                {code}
              </div>
              <p className={`mt-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {vuln === 'SQL Injection'
                  ? 'A single malicious query can expose every row in your database — user records, passwords, payment data.'
                  : 'Weak session management or JWT flaws let attackers silently take over any user account, including admins.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
