import { Shield, Globe, Smartphone, Cloud, Code, Target, ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const SERVICES = [
  {
    icon: Globe,
    title: 'Web Application Pentest',
    tagline: 'OWASP Top 10 + Business Logic',
    color: 'cyan',
    accentText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/30',
    accentGlow: 'hover:shadow-neon-blue',
    accentBg: 'bg-cyan-500/10',
    features: [
      'Authentication & Session Testing',
      'Injection Flaws (SQLi, XSS, XXE)',
      'IDOR & Access Control Bypass',
      'Business Logic Vulnerabilities',
    ],
    badge: 'Most Popular',
    badgeClass: 'bg-cyan-900/60 text-cyan-300',
  },
  {
    icon: Code,
    title: 'API Security Testing',
    tagline: 'REST / GraphQL / gRPC',
    color: 'green',
    accentText: 'text-cyber-green',
    accentBorder: 'border-green-500/30',
    accentGlow: 'hover:shadow-neon-green',
    accentBg: 'bg-green-500/10',
    features: [
      'API Enumeration & Fuzzing',
      'Broken Object-Level Auth (BOLA)',
      'Mass Assignment Attacks',
      'Rate Limiting & Token Analysis',
    ],
  },
  {
    icon: Smartphone,
    title: 'Mobile App Testing',
    tagline: 'Android & iOS',
    color: 'violet',
    accentText: 'text-violet-400',
    accentBorder: 'border-violet-500/30',
    accentGlow: 'hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]',
    accentBg: 'bg-violet-500/10',
    features: [
      'Static & Dynamic Analysis (SAST/DAST)',
      'Insecure Data Storage Testing',
      'Traffic Interception & SSL Pinning',
      'Reverse Engineering Assessment',
    ],
  },
  {
    icon: Cloud,
    title: 'Cloud Configuration Review',
    tagline: 'AWS · GCP · Azure',
    color: 'orange',
    accentText: 'text-orange-400',
    accentBorder: 'border-orange-500/30',
    accentGlow: 'hover:shadow-neon-orange',
    accentBg: 'bg-orange-500/10',
    features: [
      'IAM Policies & Privilege Escalation',
      'Exposed S3 Buckets / Blob Storage',
      'Security Group Misconfiguration',
      'Secrets in Environment Variables',
    ],
  },
  {
    icon: Shield,
    title: 'Source Code Review',
    tagline: 'Manual + Automated',
    color: 'red',
    accentText: 'text-cyber-red',
    accentBorder: 'border-red-500/30',
    accentGlow: 'hover:shadow-neon-red',
    accentBg: 'bg-red-500/10',
    features: [
      'Hardcoded Secrets & Credentials',
      'Vulnerable Dependencies (SCA)',
      'Insecure Cryptography Patterns',
      'Input Validation & Output Encoding',
    ],
  },
  {
    icon: Target,
    title: 'Red Team Exercise',
    tagline: 'Full Adversary Simulation',
    color: 'pink',
    accentText: 'text-pink-400',
    accentBorder: 'border-pink-500/30',
    accentGlow: 'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    accentBg: 'bg-pink-500/10',
    features: [
      'Phishing & Social Engineering',
      'Lateral Movement Simulation',
      'Persistence & Exfiltration Chains',
      'Detailed Attack Narrative Report',
    ],
    badge: 'Enterprise',
    badgeClass: 'bg-pink-900/60 text-pink-300',
  },
];

export default function Services() {
  const { isDark } = useTheme();

  const sectionBg = isDark
    ? 'bg-obsidian-950'
    : 'bg-gray-50';

  const cardBg = isDark
    ? 'bg-obsidian-900/60 border-gray-700/40'
    : 'bg-white border-gray-200';

  const titleColor = isDark ? 'text-white' : 'text-gray-900';
  const bodyColor  = isDark ? 'text-gray-400' : 'text-gray-500';
  const featColor  = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <section
      id="services"
      className={`section-padding relative ${sectionBg}`}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: isDark ? 'var(--tw-gradient-grid)' : 'none' }}
      />

      <div className="container-max relative z-10">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold tracking-widest uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-4">
            What We Do
          </span>
          <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${titleColor}`}>
            End-to-End{' '}
            <span className="gradient-text-blue">Security Testing</span>
            {' '}Services
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg ${bodyColor}`}>
            Every assessment is performed manually by certified security engineers — no automated
            scanner dumps. You get real-world attack simulation and actionable remediation steps.
          </p>
        </div>

        {/* ── Service Cards Grid ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className={`
                  group relative rounded-2xl border p-6 transition-all duration-300
                  ${cardBg} ${svc.accentGlow} ${svc.accentBorder}
                `}
                style={{ backdropFilter: 'blur(8px)' }}
              >
                {/* Badge */}
                {svc.badge && (
                  <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full ${svc.badgeClass}`}>
                    {svc.badge}
                  </span>
                )}

                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl mb-4 ${svc.accentBg}`}>
                  <Icon size={22} className={svc.accentText} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className={`text-lg font-bold mb-1 ${titleColor}`}>{svc.title}</h3>
                <p className={`text-xs font-mono mb-4 ${svc.accentText}`}>{svc.tagline}</p>

                {/* Feature list */}
                <ul className="space-y-2">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <CheckCircle
                        size={14}
                        className={`flex-shrink-0 mt-0.5 ${svc.accentText}`}
                        strokeWidth={2}
                      />
                      <span className={`text-sm ${featColor}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`
                    inline-flex items-center gap-1.5 mt-5 text-sm font-semibold
                    ${svc.accentText} opacity-0 group-hover:opacity-100
                    translate-y-1 group-hover:translate-y-0 transition-all duration-300
                  `}
                >
                  Get a Quote <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>

        {/* ── Bottom trust line ───────────────────────────────── */}
        <p className={`text-center mt-12 text-sm ${bodyColor}`}>
          All engagements conducted under{' '}
          <span className={isDark ? 'text-white font-semibold' : 'text-gray-900 font-semibold'}>
            written authorization
          </span>{' '}
          only · Deliverables include executive summary + technical findings + PoC screenshots
        </p>
      </div>
    </section>
  );
}
