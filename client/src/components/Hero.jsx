import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Terminal, Code2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const TYPING_LINES = [
  '> Initiating reconnaissance scan...',
  '> Found 3 critical vulnerabilities',
  '> Broken Auth: /admin/login [CRITICAL]',
  '> SQL Injection: /api/search [HIGH]',
  '> Generating secure report...',
  '> Remediation steps delivered ✓',
];

function TypingTerminal() {
  const [lines,     setLines]     = useState([]);
  const [lineIdx,   setLineIdx]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [done,      setDone]      = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (done) return;
    if (lineIdx >= TYPING_LINES.length) { setDone(true); return; }

    const currentLine = TYPING_LINES[lineIdx];
    if (charIdx < currentLine.length) {
      const t = setTimeout(() => setCharIdx((c) => c + 1), 32);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, currentLine]);
        setLineIdx((i) => i + 1);
        setCharIdx(0);
      }, 400);
      return () => clearTimeout(t);
    }
  }, [charIdx, lineIdx, done]);

  const currentTyping = done ? '' : (TYPING_LINES[lineIdx] || '').slice(0, charIdx);

  const bg     = isDark ? 'bg-gray-900/80 border-gray-700/60' : 'bg-gray-100/80 border-gray-300';
  const header = isDark ? 'bg-gray-800/80' : 'bg-gray-200/80';
  const text   = isDark ? 'text-emerald-400' : 'text-emerald-600';

  return (
    <div className={`rounded-xl border overflow-hidden font-mono text-sm shadow-card-dark ${bg}`}
      style={{ backdropFilter: 'blur(12px)' }}>
      {/* Terminal titlebar */}
      <div className={`flex items-center gap-2 px-4 py-2.5 ${header}`}>
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <span className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className={`ml-3 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          spider-crawl — pentest-session
        </span>
      </div>
      {/* Output */}
      <div className="p-4 space-y-1 min-h-[180px]">
        {lines.map((line, i) => (
          <p key={i} className={`${text} ${line.includes('CRITICAL') ? 'text-red-400' : line.includes('HIGH') ? 'text-orange-400' : ''}`}>
            {line}
          </p>
        ))}
        {!done && (
          <p className={text}>
            {currentTyping}
            <span className="animate-blink-cursor">|</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default function Hero() {
  const { isDark } = useTheme();

  return (
    <section
      id="home"
      className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-16 section-padding overflow-hidden"
    >
      {/* Radial glow behind headline */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse, rgba(0,212,255,0.08) 0%, transparent 70%)'
            : 'radial-gradient(ellipse, rgba(0,150,220,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="container-max w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

        {/* ── Left: Copy ───────────────────────────────────────── */}
        <div className="text-center lg:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6
            bg-cyan-500/10 border border-cyan-500/25 text-xs font-medium text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            VAPT &nbsp;|&nbsp; Web &nbsp;|&nbsp; Mobile &nbsp;|&nbsp; API Security
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            <span className={isDark ? 'text-white' : 'text-gray-900'}>
              We Break Your App
            </span>
            <br />
            <span className="gradient-text">Before Hackers Do</span>
          </h1>

          <p className={`text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manual web testing, automation testing, mobile &amp; website security for businesses —
            with clear, developer-friendly remediation reports.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm
                bg-gradient-to-r from-cyan-500 to-cyan-400 text-obsidian-950
                hover:from-cyan-400 hover:to-emerald-400 hover:shadow-neon-blue
                transition-all duration-300"
            >
              Get a Free Quote <ArrowRight size={16} />
            </a>
            <a
              href="#pricing"
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-300
                ${isDark
                  ? 'border-gray-600 text-gray-200 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/10'
                  : 'border-gray-300 text-gray-700 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                }`}
            >
              View Pricing
            </a>
          </div>

          {/* Trust micro-badges */}
          <div className={`mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {['OWASP Aligned', 'Written Auth Only', 'NDA on Every Engagement', 'Free Retest'].map((b) => (
              <span key={b} className="flex items-center gap-1">
                <span className="text-emerald-400">✓</span> {b}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right: Animated terminal ─────────────────────────── */}
        <div className="w-full max-w-lg mx-auto animate-float">
          {/* Outer glow ring */}
          <div className={`relative p-px rounded-2xl ${isDark ? 'bg-gradient-to-br from-cyan-500/30 via-transparent to-emerald-500/20' : 'bg-gradient-to-br from-cyan-300/30 via-transparent to-emerald-300/20'}`}>
            <div className={`rounded-2xl p-1 ${isDark ? 'bg-obsidian-950' : 'bg-white'}`}>
              <TypingTerminal />
            </div>
          </div>

          {/* Floating stat chips */}
          <div className="absolute -left-4 top-1/4 transform -translate-y-1/2 hidden xl:block">
            <div className={`px-3 py-2 rounded-lg border text-xs font-mono shadow-card-dark ${isDark ? 'bg-gray-900 border-emerald-500/40 text-emerald-400' : 'bg-white border-emerald-400 text-emerald-600'}`}>
              <Code2 size={12} className="inline mr-1" />
              OWASP Top 10 ✓
            </div>
          </div>
          <div className="absolute -right-4 bottom-1/4 hidden xl:block">
            <div className={`px-3 py-2 rounded-lg border text-xs font-mono shadow-card-dark ${isDark ? 'bg-gray-900 border-red-500/40 text-red-400' : 'bg-white border-red-400 text-red-500'}`}>
              <Terminal size={12} className="inline mr-1" />
              3 Critical Found
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#services"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs animate-bounce ${isDark ? 'text-gray-500' : 'text-gray-400'}`}
        aria-label="Scroll down"
      >
        <span>Scroll</span>
        <ChevronDown size={16} />
      </a>
    </section>
  );
}
