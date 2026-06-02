import { useState, useMemo } from 'react';
import { TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatINR(n) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return `₹${n.toLocaleString('en-IN')}`;
}

function recommendedPlan(revenue) {
  if (revenue < 5e6)  return { name: 'Starter VA',           cost: 25000,   costStr: '~₹25,000' };
  if (revenue < 5e7)  return { name: 'Basic Web Pentest',    cost: 65000,   costStr: '~₹65,000' };
  return               { name: 'Standard Web/API Pentest', cost: 170000, costStr: '~₹1,70,000' };
}

// IBM 2024 report: downtime cost ≈ revenue * 0.0014 per hour
// Plus reputational damage multiplier (1.5x)
function calcDowntimeCost(revenue) {
  const hourly    = revenue / 8760; // revenue per hour
  const downtime  = hourly * 24 * 1.5; // 24h with 1.5x impact
  return Math.round(downtime);
}

const REVENUE_MARKS = [
  { value: 1e6,   label: '₹10L'   },
  { value: 1e7,   label: '₹1 Cr'  },
  { value: 5e7,   label: '₹5 Cr'  },
  { value: 1e8,   label: '₹10 Cr' },
  { value: 5e8,   label: '₹50 Cr' },
  { value: 1e9,   label: '₹100 Cr'},
];

const MIN_LOG = Math.log10(1e6);
const MAX_LOG = Math.log10(1e9);

export default function ROICalculator() {
  const { isDark } = useTheme();
  const [sliderVal, setSliderVal] = useState(0.3); // 0–1 log scale

  // Convert slider (0–1) to actual revenue using log scale
  const revenue = useMemo(() => {
    const logVal = MIN_LOG + sliderVal * (MAX_LOG - MIN_LOG);
    return Math.round(Math.pow(10, logVal));
  }, [sliderVal]);

  const downtimeCost = calcDowntimeCost(revenue);
  const plan         = recommendedPlan(revenue);
  const roi          = downtimeCost - plan.cost;
  const roiMultiple  = plan.cost > 0 ? (downtimeCost / plan.cost).toFixed(1) : '∞';

  const barWidth = Math.min(100, Math.round((plan.cost / downtimeCost) * 100));

  return (
    <section id="roi-calculator" className={`relative z-10 section-padding ${isDark ? 'bg-obsidian-900/30' : 'bg-gray-50/80'}`}>
      <div className="container-max">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-mono font-semibold text-emerald-400 tracking-widest uppercase mb-3">
            Bonus Tool
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Security <span className="gradient-text">ROI Calculator</span>
          </h2>
          <p className={`max-w-xl mx-auto text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            See how a 24-hour breach downtime compares to the cost of a pentest — and understand the ROI instantly.
          </p>
        </div>

        <div className={`max-w-3xl mx-auto rounded-2xl border p-8
          ${isDark ? 'bg-gray-900/70 border-gray-800' : 'bg-white border-gray-200 shadow-card-light'}`}>

          {/* Revenue slider */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Annual Company Revenue
              </label>
              <span className="text-xl font-extrabold font-mono text-cyan-400">
                {formatINR(revenue)}
              </span>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer
                bg-gradient-to-r from-cyan-500 to-emerald-400
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cyan-400
                [&::-webkit-slider-thumb]:shadow-neon-blue
                [&::-webkit-slider-thumb]:cursor-pointer"
              aria-label="Annual revenue"
              aria-valuetext={formatINR(revenue)}
            />

            {/* Marks */}
            <div className="flex justify-between mt-2">
              {REVENUE_MARKS.map(({ label }) => (
                <span key={label} className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</span>
              ))}
            </div>
          </div>

          {/* Result cards */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {/* Downtime cost */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-red-900/10 border-red-700/30' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} className="text-red-400" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  24h Downtime Cost
                </span>
              </div>
              <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                {formatINR(downtimeCost)}
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Revenue loss + reputational damage
              </p>
            </div>

            {/* Pentest cost */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-cyan-900/10 border-cyan-700/30' : 'bg-cyan-50 border-cyan-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheck size={16} className="text-cyan-400" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                  Recommended Plan
                </span>
              </div>
              <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {plan.costStr}
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {plan.name}
              </p>
            </div>

            {/* ROI */}
            <div className={`rounded-xl border p-5 ${isDark ? 'bg-emerald-900/10 border-emerald-700/30' : 'bg-emerald-50 border-emerald-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign size={16} className="text-emerald-400" />
                <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  Potential Savings
                </span>
              </div>
              <div className={`text-2xl font-extrabold font-mono ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                {formatINR(roi)}
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {roiMultiple}× ROI on security spend
              </p>
            </div>
          </div>

          {/* Visual ratio bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>Pentest cost vs potential loss</span>
              <span className={`font-mono font-semibold text-emerald-400`}>{barWidth}% of risk</span>
            </div>
            <div className={`h-3 rounded-full overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${barWidth}%` }}
              />
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-cyan-400">Pentest ({plan.costStr})</span>
              <span className="text-red-400">Potential loss ({formatINR(downtimeCost)})</span>
            </div>
          </div>

          {/* Footnote */}
          <p className={`text-xs text-center ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
            Estimates based on IBM Cost of a Data Breach Report 2024. Actual costs vary. For illustration only.
          </p>

          {/* CTA */}
          <div className="mt-6 text-center">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm
                bg-gradient-to-r from-cyan-500 to-emerald-400 text-obsidian-950
                hover:shadow-neon-blue transition-all duration-300"
            >
              Protect {formatINR(revenue)} — Get a Quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
