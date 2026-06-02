import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const NAV_LINKS = [
  { label: 'Services',    href: '#services'    },
  { label: 'Methodology', href: '#methodology' },
  { label: 'Live CVEs',   href: '#cve-tracker' },
  { label: 'Pricing',     href: '#pricing'     },
  { label: 'Contact',     href: '#contact'     },
];

export default function Navbar() {
  const { isDark, toggle } = useTheme();
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navBase = scrolled
    ? isDark
      ? 'bg-obsidian-950/90 border-b border-cyan-900/30 shadow-card-dark'
      : 'bg-white/90 border-b border-gray-200 shadow-card-light'
    : 'bg-transparent border-b border-transparent';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}
      style={{ backdropFilter: scrolled ? 'blur(14px)' : 'none' }}
    >
      <div className="container-max flex items-center justify-between h-16 px-4 md:px-8">

        {/* ── Logo ─────────────────────────────────────────────── */}
        <a href="#home" className="flex items-center gap-2 group">
          <div className="relative">
            <Shield
              size={28}
              className="text-cyan-400 group-hover:text-cyber-green transition-colors duration-300"
              strokeWidth={1.5}
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="text-[8px] font-mono font-bold text-white">SC</span>
            </span>
          </div>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white dark:text-white text-gray-900">Spider</span>
            <span className="text-neon-blue glow-blue"> Crawl</span>
          </span>
        </a>

        {/* ── Desktop Links ─────────────────────────────────────── */}
        <ul className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={`text-sm font-medium transition-colors duration-200
                  ${isDark
                    ? 'text-gray-300 hover:text-cyan-400'
                    : 'text-gray-600 hover:text-cyan-600'
                  }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* ── Right controls ────────────────────────────────────── */}
        <div className="flex items-center gap-3">

          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle dark/light mode"
            className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400
              ${isDark ? 'bg-cyan-900/60 border border-cyan-700/50' : 'bg-gray-200 border border-gray-300'}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-transform duration-300 shadow-md
                ${isDark ? 'translate-x-6 bg-cyan-400' : 'translate-x-0 bg-white'}`}
            >
              {isDark
                ? <Moon size={11} className="text-obsidian-950" />
                : <Sun  size={11} className="text-amber-500" />
              }
            </span>
          </button>

          {/* CTA */}
          <a
            href="#contact"
            className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold
              bg-gradient-to-r from-cyan-500 to-cyan-400 text-obsidian-950
              hover:from-cyan-400 hover:to-emerald-400 hover:shadow-neon-blue
              transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            Talk to Expert
          </a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle navigation menu"
            className={`md:hidden p-1 rounded transition-colors ${isDark ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-cyan-600'}`}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-96' : 'max-h-0'}`}
        style={{ backdropFilter: 'blur(14px)' }}
      >
        <div className={`px-4 pb-4 ${isDark ? 'bg-obsidian-950/95' : 'bg-white/95'}`}>
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-medium border-b transition-colors
                ${isDark
                  ? 'border-gray-800 text-gray-300 hover:text-cyan-400'
                  : 'border-gray-100 text-gray-600 hover:text-cyan-600'
                }`}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-3 block text-center px-4 py-2.5 rounded-lg text-sm font-semibold
              bg-gradient-to-r from-cyan-500 to-cyan-400 text-obsidian-950
              hover:from-cyan-400 hover:to-emerald-400 transition-all duration-300"
          >
            Talk to Expert
          </a>
        </div>
      </div>
    </nav>
  );
}
