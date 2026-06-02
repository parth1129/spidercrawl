import { Check, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const STANDARDS = [
  { text: 'OWASP Top 10 Aligned',          checked: true  },
  { text: 'Manual Verification',            checked: true  },
  { text: 'Written Authorization Only',     checked: true  },
  { text: 'Developer-Friendly Reports',     checked: true  },
  { text: 'Free Retest Included',           checked: true  },
  { text: 'NDA on Every Engagement',        checked: true  },
  { text: 'OWASP ASVS Referenced',          checked: true  },
  { text: 'No Data Exfiltration — Ever',    checked: true  },
  { text: 'Scope-Controlled Testing',       checked: true  },
  { text: 'OWASP OTG Methodology',          checked: true  },
];

const CLIENT_SECTORS = [
  { label: 'E-Commerce',  icon: '🛒' },
  { label: 'SaaS',        icon: '☁️' },
  { label: 'FinTech',     icon: '💳' },
  { label: 'Healthcare',  icon: '🏥' },
  { label: 'EdTech',      icon: '🎓' },
  { label: 'Logistics',   icon: '🚚' },
];

export default function TrustStandards() {
  const { isDark } = useTheme();

  return (
    <section id="trust" className={`relative z-10 section-padding ${isDark ? '' : 'bg-white'}`}>
      <div className="container-max">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono font-semibold text-emerald-400 tracking-widest uppercase mb-3">
            Trust & Standards
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built on <span className="gradient-text">Verified Practices</span>
          </h2>
          <p className={`max-w-xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Every engagement follows industry standards with full transparency, ethical boundaries, and documented processes.
          </p>
        </div>

        {/* Client banner */}
        <div className={`rounded-2xl border p-7 mb-10 text-center
          ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className={`flex items-center justify-center gap-2 text-xs mb-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <Shield size={13} className="text-amber-400" />
            Client names withheld under NDA. Logos shown with permission.
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {CLIENT_SECTORS.map(({ label, icon }) => (
              <div
                key={label}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-200
                  ${isDark
                    ? 'bg-gray-800/50 border-gray-700/50 hover:border-cyan-700/50'
                    : 'bg-white border-gray-200 hover:border-cyan-300 shadow-sm'
                  }`}
              >
                <span className="text-2xl">{icon}</span>
                <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Standards grid */}
        <div className={`rounded-2xl border p-8
          ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <h3 className={`text-lg font-bold mb-6 text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Commitment to Standards
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {STANDARDS.map(({ text }) => (
              <div
                key={text}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors
                  ${isDark
                    ? 'bg-gray-800/40 border-gray-700/50 hover:border-emerald-700/50'
                    : 'bg-white border-gray-200 hover:border-emerald-300 shadow-sm'
                  }`}
              >
                <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                  <Check size={10} className="text-emerald-400" />
                </div>
                <span className={`text-xs font-medium leading-tight ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
