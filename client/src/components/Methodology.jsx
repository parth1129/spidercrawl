import { useTheme } from '../contexts/ThemeContext';

const STEPS = [
  {
    num: '01',
    title: 'Pre-Engagement',
    color: 'text-cyan-400',
    dotColor: 'bg-cyan-400',
    lineColor: 'bg-cyan-400/30',
    details: [
      'NDA signing before any discussion',
      'Scope definition and written authorization',
      'Test account setup and credentials handover',
      'Testing window agreement (off-peak hours)',
      'Emergency contact protocols established',
    ],
  },
  {
    num: '02',
    title: 'Reconnaissance',
    color: 'text-blue-400',
    dotColor: 'bg-blue-400',
    lineColor: 'bg-blue-400/30',
    details: [
      'Passive OSINT within agreed scope only',
      'Technology fingerprinting (Wappalyzer, headers)',
      'Subdomain enumeration and asset mapping',
      'Public exposure audit (leaked credentials, repos)',
    ],
  },
  {
    num: '03',
    title: 'Threat Modeling',
    color: 'text-violet-400',
    dotColor: 'bg-violet-400',
    lineColor: 'bg-violet-400/30',
    details: [
      'Identify high-risk attack surfaces',
      'Focus areas: login, payments, admin panels',
      'File uploads, APIs, third-party integrations',
      'STRIDE-based threat classification',
    ],
  },
  {
    num: '04',
    title: 'Vulnerability Analysis',
    color: 'text-yellow-400',
    dotColor: 'bg-yellow-400',
    lineColor: 'bg-yellow-400/30',
    details: [
      'Manual testing — primary methodology',
      'Automated scanning as a supplement only',
      'OWASP Testing Guide (OTG) aligned',
      'OWASP ASVS referenced for verification',
      'API testing per OWASP API Security Top 10',
    ],
  },
  {
    num: '05',
    title: 'Controlled Exploitation',
    color: 'text-orange-400',
    dotColor: 'bg-orange-400',
    lineColor: 'bg-orange-400/30',
    details: [
      'Proof-of-concept only — minimum necessary',
      'No data exfiltration — ever',
      'No persistent backdoors or damage',
      'All actions are logged and time-stamped',
      'Immediate notification if critical found',
    ],
  },
  {
    num: '06',
    title: 'Reporting',
    color: 'text-emerald-400',
    dotColor: 'bg-emerald-400',
    lineColor: 'bg-emerald-400/30',
    details: [
      'Executive summary for management',
      'Technical findings with CVSS v3.1 scores',
      'Step-by-step remediation per vulnerability',
      'Priority matrix (Risk × Exploitability)',
      'Developer Q&A session included',
    ],
  },
  {
    num: '07',
    title: 'Retest & Closure',
    color: 'text-teal-400',
    dotColor: 'bg-teal-400',
    lineColor: 'bg-teal-400/30',
    details: [
      'Free retest of all reported vulnerabilities',
      'Verify each remediation is effective',
      'Issue signed closure letter',
      'Confirmation of remediation on record',
    ],
  },
];

export default function Methodology() {
  const { isDark } = useTheme();

  return (
    <section id="methodology" className={`relative z-10 section-padding ${isDark ? '' : 'bg-white'}`}>
      <div className="container-max">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono font-semibold text-cyan-400 tracking-widest uppercase mb-3">
            How We Work
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Methodology —{' '}
            <span className="gradient-text">Structured, Authorized, Thorough</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Every engagement follows a disciplined, legally-compliant process. No surprises, no collateral damage.
          </p>
        </div>

        {/* ── Timeline ─────────────────────────────────────────── */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div className="hidden lg:block absolute left-[3.25rem] top-6 bottom-6 w-px bg-gradient-to-b from-cyan-400/60 via-violet-400/40 to-teal-400/60" />

          <div className="space-y-6 lg:space-y-0">
            {STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="relative flex flex-col lg:flex-row gap-4 lg:gap-8 items-start lg:pl-24"
                style={{ paddingBottom: idx < STEPS.length - 1 ? '2rem' : '0' }}
              >
                {/* Step dot + number (desktop absolute) */}
                <div className="hidden lg:flex absolute left-0 top-0 flex-col items-center">
                  <div className={`w-[6.5rem] h-[6.5rem] flex flex-col items-center justify-center rounded-xl border
                    ${isDark
                      ? 'bg-gray-900 border-gray-700 group-hover:border-cyan-500/60'
                      : 'bg-white border-gray-200 shadow-card-light'
                    }`}>
                    <span className={`text-xs font-mono font-bold ${step.color} opacity-70`}>{step.num}</span>
                    <span className={`w-2 h-2 rounded-full mt-1 ${step.dotColor}`} />
                  </div>
                </div>

                {/* Mobile step indicator */}
                <div className={`lg:hidden flex items-center gap-3 mb-1`}>
                  <span className={`text-lg font-mono font-extrabold ${step.color}`}>{step.num}</span>
                  <div className={`h-px flex-1 ${step.lineColor}`} />
                </div>

                {/* Content card */}
                <div
                  className={`w-full rounded-xl border p-5 transition-all duration-300 group
                    ${isDark
                      ? 'bg-gray-900/70 border-gray-800 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-cyan-300 shadow-card-light'
                    }`}
                >
                  <h3 className={`text-base font-bold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span className={`hidden lg:inline text-sm font-mono ${step.color} opacity-60`}>{step.num}</span>
                    {step.title}
                  </h3>
                  <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5">
                    {step.details.map((d) => (
                      <li key={d} className={`flex items-start gap-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className={`mt-0.5 flex-shrink-0 text-xs ${step.color}`}>▸</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
