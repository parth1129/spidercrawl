import { Check, ArrowRight, Zap, Shield, Star } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const PLANS = [
  {
    id:       'starter',
    name:     'Starter VA',
    price:    '₹15,000 – ₹35,000',
    icon:     Zap,
    accent:   'text-cyan-400',
    border:   'border-cyan-500/30',
    glow:     '',
    badge:    null,
    scope:    '1 small website, unauthenticated',
    timeline: '2–3 days',
    features: [
      'Automated vulnerability scan',
      'Manual verification of findings',
      'PDF report with CVSS scores',
      'Basic remediation guidance',
      'Up to 10 pages / endpoints',
    ],
    cta: 'Get Started',
  },
  {
    id:       'basic',
    name:     'Basic Web Pentest',
    price:    '₹40,000 – ₹90,000',
    icon:     Shield,
    accent:   'text-violet-400',
    border:   'border-violet-500/50',
    glow:     'shadow-[0_0_30px_rgba(139,92,246,0.2)]',
    badge:    'Most Popular',
    badgeBg:  'bg-violet-500/20 text-violet-300 border border-violet-500/40',
    scope:    '1 small web app, 1–2 user roles',
    timeline: '3–5 days',
    features: [
      'Full OWASP Top 10 coverage',
      'Authenticated & unauthenticated testing',
      'Business logic vulnerability analysis',
      'Detailed technical report',
      'Developer Q&A session (1 hour)',
      'Basic remediation follow-up',
    ],
    cta: 'Most Recommended',
  },
  {
    id:       'standard',
    name:     'Standard Web/API Pentest',
    price:    '₹90,000 – ₹2,50,000',
    icon:     Star,
    accent:   'text-emerald-400',
    border:   'border-emerald-500/30',
    glow:     '',
    badge:    null,
    scope:    'Web app + API, auth, business logic',
    timeline: '5–7 days',
    features: [
      'Full OWASP Top 10 + API Security Top 10',
      'Multi-role auth testing',
      'Business logic & payment flow testing',
      'Executive summary for management',
      'Technical report with CVSS v3.1',
      'Free retest of all findings',
      'Signed closure letter',
      'Priority developer support',
    ],
    cta: 'Full Coverage',
  },
];

export default function Pricing() {
  const { isDark } = useTheme();

  return (
    <section id="pricing" className={`relative z-10 section-padding ${isDark ? 'bg-obsidian-900/30' : 'bg-gray-50/80'}`}>
      <div className="container-max">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono font-semibold text-cyan-400 tracking-widest uppercase mb-3">
            Transparent Pricing
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Security That <span className="gradient-text">Fits Your Budget</span>
          </h2>
          <p className={`max-w-xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            All pricing is in INR and varies based on application complexity, number of roles, and scope. Contact us for a precise quote.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 h-full
                  ${isDark
                    ? `bg-gray-900/80 ${plan.border} ${plan.glow}`
                    : `bg-white border-gray-200 ${plan.id === 'basic' ? 'ring-2 ring-violet-400/30' : ''} shadow-card-light`
                  }`}
              >
                {/* Popular badge */}
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${plan.badgeBg}`}>
                      ★ {plan.badge}
                    </span>
                  </div>
                )}

                {/* Icon + name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center
                    ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <Icon size={20} className={plan.accent} />
                  </div>
                  <h3 className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                </div>

                {/* Price */}
                <div className={`text-2xl font-extrabold font-mono mb-1 ${plan.accent}`}>
                  {plan.price}
                </div>

                {/* Scope & timeline */}
                <div className={`text-xs mb-5 space-y-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <p>📋 Scope: {plan.scope}</p>
                  <p>⏱ Timeline: {plan.timeline}</p>
                </div>

                {/* Divider */}
                <div className={`border-t mb-5 ${isDark ? 'border-gray-800' : 'border-gray-100'}`} />

                {/* Features */}
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.accent}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border transition-all duration-300
                    ${plan.id === 'basic'
                      ? 'bg-gradient-to-r from-violet-500 to-violet-400 text-white border-transparent hover:from-violet-400 hover:to-purple-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]'
                      : isDark
                        ? `border ${plan.border} ${plan.accent} hover:bg-cyan-900/20`
                        : 'border border-gray-300 text-gray-700 hover:border-cyan-400 hover:text-cyan-600'
                    }`}
                >
                  {plan.cta} <ArrowRight size={15} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Footnote */}
        <p className={`text-center text-xs mt-8 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          All engagements are under NDA. Prices are indicative and subject to scope review. GST applicable as per prevailing rates.
        </p>
      </div>
    </section>
  );
}
