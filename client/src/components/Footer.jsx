import { Shield, Mail, Phone, MapPin, Twitter, Linkedin, Github, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const FOOTER_LINKS = {
  Company: [
    { label: 'About',    href: '#home'      },
    { label: 'Services', href: '#services'  },
    { label: 'Pricing',  href: '#pricing'   },
    { label: 'Contact',  href: '#contact'   },
  ],
  Security: [
    { label: 'Methodology',     href: '#methodology'  },
    { label: 'Live CVE Tracker',href: '#cve-tracker'  },
    { label: 'Hacking News',    href: '#news'         },
    { label: 'Admin Portal',    href: '/admin-portal' },
  ],
  Legal: [
    { label: 'Privacy Policy',    href: '#privacy'  },
    { label: 'Terms of Service',  href: '#terms'    },
    { label: 'Responsible Disclosure', href: '#disclosure' },
  ],
};

const SOCIALS = [
  { icon: Twitter,  href: '#', label: 'Twitter'  },
  { icon: Linkedin, href: '#', label: 'LinkedIn'  },
  { icon: Github,   href: '#', label: 'GitHub'   },
];

export default function Footer() {
  const { isDark } = useTheme();

  return (
    <footer className={`relative z-10 border-t ${isDark ? 'border-gray-800 bg-obsidian-950' : 'border-gray-200 bg-gray-50'}`}>
      <div className="container-max px-4 md:px-8 pt-16 pb-8">

        {/* ── Top row ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Brand block */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={26} className="text-cyan-400" strokeWidth={1.5} />
              <span className="text-lg font-bold">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>Spider</span>
                <span className="text-neon-blue glow-blue"> Crawl</span>
              </span>
            </div>
            <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Professional web &amp; mobile security testing. OWASP-aligned, manual-first, and
              developer-friendly. We find vulnerabilities before attackers do.
            </p>

            {/* Contact snippets */}
            <div className="space-y-2">
              {[
                { icon: Mail,    text: 'hello@spidercrawlsecurity.com' },
                { icon: Phone,   text: '+91 XXXXXXXXXX' },
                { icon: MapPin,  text: 'India — remote across Asia' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Icon size={13} className="text-cyan-400 flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all duration-200
                    ${isDark
                      ? 'border-gray-700 text-gray-400 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20'
                      : 'border-gray-300 text-gray-500 hover:border-cyan-500 hover:text-cyan-600 hover:bg-cyan-50'
                    }`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className={`text-xs font-semibold uppercase tracking-widest mb-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className={`text-sm flex items-center gap-1 transition-colors ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-cyan-600'}`}
                    >
                      {label}
                      {href.startsWith('/') && <ExternalLink size={10} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Bottom row ───────────────────────────────────────── */}
        <div className={`pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs
          ${isDark ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <span>© {new Date().getFullYear()} Spider Crawl Security. All rights reserved.</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse-slow" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>All testing conducted under written authorization only.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
