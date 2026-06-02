import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useTheme } from '../contexts/ThemeContext';

const SUBJECTS = [
  { value: '',                    label: 'Select a subject…' },
  { value: 'General Inquiry',     label: 'General Inquiry' },
  { value: 'Request Quote',       label: 'Request Quote' },
  { value: 'Report Vulnerability',label: 'Report Vulnerability' },
  { value: 'Partnership',         label: 'Partnership' },
];

const CONTACT_INFO = [
  { icon: Mail,    label: 'Email',    value: 'admin@spidercrawl.com' },
  { icon: Phone,   label: 'Phone',    value: '+91 XXXXXXXXXX' },
  { icon: MapPin,  label: 'Location', value: 'India — available remotely across Asia' },
  { icon: Clock,   label: 'Response', value: 'Within 24 hours' },
];

const INITIAL = {
  name: '', email: '', company: '', subject: '', message: '', consent: false,
};

export default function Contact() {
  const { isDark } = useTheme();
  const [form,    setForm]    = useState(INITIAL);
  const [status,  setStatus]  = useState('idle'); // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    if (!form.name.trim())    return 'Full name is required.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                              return 'A valid email address is required.';
    if (!form.subject)        return 'Please select a subject.';
    if (!form.message.trim()) return 'Message is required.';
    if (!form.consent)        return 'Please agree to be contacted.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setErrMsg(err); return; }

    setStatus('loading');
    setErrMsg('');
    try {
      await addDoc(collection(db, 'contact_requests'), {
        name:      form.name.trim(),
        email:     form.email.trim().toLowerCase(),
        company:   form.company.trim() || null,
        subject:   form.subject,
        message:   form.message.trim(),
        status:    'unread',
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      setForm(INITIAL);
    } catch (firebaseErr) {
      console.error('[Contact Form]', firebaseErr.code, firebaseErr.message);
      let msg = 'Failed to send message. Please try again.';
      if (firebaseErr.code === 'permission-denied')
        msg = 'Database not ready yet. Please try again in a moment.';
      else if (firebaseErr.code === 'unavailable' || firebaseErr.code === 'not-found')
        msg = 'Service temporarily unavailable. Please email us directly.';
      setStatus('error');
      setErrMsg(msg);
    }
  };

  const inputBase = `w-full rounded-lg px-4 py-3 text-sm border outline-none transition-all duration-200
    focus:ring-2 focus:ring-cyan-500/50
    ${isDark
      ? 'bg-gray-800/60 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-cyan-500'
    }`;

  return (
    <section id="contact" className={`relative z-10 section-padding ${isDark ? 'bg-obsidian-900/30' : 'bg-gray-50/80'}`}>
      <div className="container-max">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-mono font-semibold text-cyan-400 tracking-widest uppercase mb-3">
            Get In Touch
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Let's Talk <span className="gradient-text">Security</span>
          </h2>
          <p className={`max-w-xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Share your project details and we'll respond with a scoping questionnaire within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* ── Left: Contact info ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`rounded-2xl border p-7 space-y-5
              ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200 shadow-card-light'}`}>
              {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`mt-0.5 w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    ${isDark ? 'bg-cyan-900/30 border border-cyan-700/40' : 'bg-cyan-50 border border-cyan-200'}`}>
                    <Icon size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{label}</p>
                    <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* NDA note */}
            <div className={`rounded-xl border p-4 flex gap-3 items-start
              ${isDark ? 'bg-emerald-900/10 border-emerald-700/30' : 'bg-emerald-50 border-emerald-200'}`}>
              <CheckCircle size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
              <p className={`text-xs leading-relaxed ${isDark ? 'text-emerald-300/80' : 'text-emerald-700'}`}>
                All communications are confidential. An NDA is signed before any technical discussion begins.
              </p>
            </div>
          </div>

          {/* ── Right: Form ────────────────────────────────────── */}
          <div className={`lg:col-span-3 rounded-2xl border p-7
            ${isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-white border-gray-200 shadow-card-light'}`}>

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center h-full py-12 text-center">
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Message Sent Securely!</h3>
                <p className={`text-sm max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  We'll review your request and respond within 24 hours with a scoping questionnaire.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-sm text-cyan-400 hover:text-cyan-300 underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Smith"
                      className={inputBase}
                      required
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className={inputBase}
                      required
                    />
                  </div>
                </div>

                {/* Company + Subject */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Company <span className={`font-normal ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      placeholder="Acme Corp"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Subject <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={inputBase}
                      required
                    >
                      {SUBJECTS.map(({ value, label }) => (
                        <option key={value} value={value} disabled={value === ''}>{label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us about your application, tech stack, and testing requirements…"
                    className={`${inputBase} resize-none`}
                    required
                  />
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={form.consent}
                    onChange={handleChange}
                    className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500/40 cursor-pointer"
                  />
                  <span className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    I agree to be contacted by Spider Crawl regarding my security inquiry. We will never share your data with third parties.
                  </span>
                </label>

                {/* Error */}
                {(errMsg || status === 'error') && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-900/20 border border-red-700/40">
                    <AlertCircle size={15} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{errMsg}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm
                    bg-gradient-to-r from-cyan-500 to-cyan-400 text-obsidian-950
                    hover:from-cyan-400 hover:to-emerald-400 hover:shadow-neon-blue
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-obsidian-950/40 border-t-obsidian-950 rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Secure Message →
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
