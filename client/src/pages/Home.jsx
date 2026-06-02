import SpiderBackground from '../components/SpiderBackground';
import Navbar           from '../components/Navbar';
import Hero             from '../components/Hero';
import Services         from '../components/Services';
import CostOfSecurity   from '../components/CostOfSecurity';
import Methodology      from '../components/Methodology';
import ROICalculator    from '../components/ROICalculator';
import NewsSection      from '../components/NewsSection';
import CVETracker       from '../components/CVETracker';
import Pricing          from '../components/Pricing';
import TrustStandards   from '../components/TrustStandards';
import Contact          from '../components/Contact';
import Footer           from '../components/Footer';

export default function Home() {
  return (
    <>
      {/* Animated spider-web canvas (sits behind everything) */}
      <SpiderBackground />

      {/* Fixed navigation */}
      <Navbar />

      {/* ── Page sections ─────────────────────────────────────── */}
      <main>
        {/* 1 · Hero */}
        <Hero />

        {/* 2 · Services */}
        <Services />

        {/* 3 · Cost of Skipping Security */}
        <CostOfSecurity />

        {/* 3 · Methodology */}
        <Methodology />

        {/* 4 · Security ROI Calculator */}
        <ROICalculator />

        {/* 5 · Weekly Hacking News */}
        <NewsSection />

        {/* 6 · Live CVE Tracker */}
        <CVETracker />

        {/* 7 · Pricing */}
        <Pricing />

        {/* 8 · Trust & Standards */}
        <TrustStandards />

        {/* 9 · Contact */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
