/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          green:  '#00ff41',
          blue:   '#00d4ff',
          purple: '#7b2fbe',
          red:    '#ff003c',
          orange: '#ff6b00',
        },
        obsidian: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#1e1b4b',
          900: '#12112a',
          950: '#0a0f1e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      boxShadow: {
        'neon-green':  '0 0 20px rgba(0, 255, 65,  0.4), 0 0 40px rgba(0, 255, 65,  0.2)',
        'neon-blue':   '0 0 20px rgba(0, 212, 255, 0.4), 0 0 40px rgba(0, 212, 255, 0.2)',
        'neon-red':    '0 0 20px rgba(255, 0,   60,  0.4)',
        'neon-orange': '0 0 20px rgba(255, 107, 0,   0.4)',
        'card-dark':   '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-light':  '0 4px 24px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'pulse-slow':   'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow':    'spin 30s linear infinite',
        float:          'float 6s ease-in-out infinite',
        'scan-line':    'scanLine 2.5s linear infinite',
        'blink-cursor': 'blink 1s step-end infinite',
        'fade-up':      'fadeUp 0.6s ease-out forwards',
        'glow-pulse':   'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-16px)' },
        },
        scanLine: {
          '0%':   { top: '-4px' },
          '100%': { top: '100%' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,212,255,0.3)' },
          '50%':      { boxShadow: '0 0 24px rgba(0,212,255,0.8)' },
        },
      },
      backgroundImage: {
        'grid-dark':  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(0,212,255,0.05)' stroke-width='1'/%3E%3C/svg%3E\")",
        'grid-light': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(0,100,200,0.06)' stroke-width='1'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
