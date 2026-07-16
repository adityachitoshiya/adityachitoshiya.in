import React, { useState } from 'react';
import { Search, Play, Menu, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Hero() {
  const { portfolioData } = usePortfolio();
  const hero = portfolioData?.hero || {};
  const global = portfolioData?.global || {};

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section
      id="home"
      style={{ backgroundColor: '#0a0a0a' }}
      className="relative w-full h-screen flex flex-col z-20"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

        .ac-display { font-family: 'Anton', sans-serif; }
        .ac-script { font-family: 'Caveat', cursive; }
        .ac-body { font-family: 'Inter', sans-serif; }

        .ac-nav-link { position: relative; color: #ffffff; }
        .ac-nav-link::after {
          content: '';
          position: absolute;
          left: 0; bottom: -4px;
          width: 0%; height: 2px;
          background: #f5a623;
          transition: width 0.25s ease;
        }
        .ac-nav-link:hover::after,
        .ac-nav-link:focus-visible::after { width: 100%; }

        .ac-nav-link:focus-visible,
        .ac-icon-btn:focus-visible,
        .ac-toggle:focus-visible {
          outline: 2px solid #f5a623;
          outline-offset: 3px;
        }

        .ac-fade-up { animation: acFadeUp 0.8s ease both; }
        @keyframes acFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .ac-slide-up-image { animation: acSlideUpImage 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes acSlideUpImage {
          from { transform: translate(-50%, 100%); }
          to { transform: translate(-50%, 0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ac-fade-up, .ac-slide-up-image { animation: none; }
        }

        .ac-icon-btn {
          width: 34px; height: 34px;
          border-radius: 9999px;
          background: #f5a623;
          display: flex; align-items: center; justify-content: center;
          color: #0a0a0a;
          transition: transform 0.2s ease;
        }
        .ac-icon-btn:hover { transform: scale(1.08); }

        .hero-img-position {
          bottom: -191px;
        }
        @media (max-width: 768px) {
          .hero-img-position {
            bottom: -50px;
          }
        }
      `}</style>

      {/* Nav */}
      <nav className="relative z-30 flex items-center justify-between px-6 md:px-14 py-6 md:py-8">
        <span
          className="ac-display text-3xl md:text-4xl tracking-wider"
          style={{ color: '#f5a623' }}
        >
          AC.
        </span>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="ac-nav-link ac-body text-sm tracking-wide">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Availability Status Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span 
              className={`w-2 h-2 rounded-full ${global.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'}`}
            ></span>
            <span className="ac-body text-xs text-white/80 tracking-wide uppercase">
              {global.availableForWork ? 'Available for Projects' : 'Currently Booked'}
            </span>
          </div>

          <button
            aria-label="Open menu"
            className="md:hidden text-white"
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden relative z-30 flex flex-col gap-4 px-6 pb-6 ac-body">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white text-sm"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      {/* Headline block */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <h1
          className="ac-display ac-fade-up w-full text-center select-none"
          style={{
            color: '#ffffff',
            fontSize: 'clamp(3.5rem, 18vw, 24rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          {hero.headline}
        </h1>

        <span
          className="ac-script ac-fade-up absolute"
          style={{
            color: '#f5a623',
            fontSize: 'clamp(1.75rem, 5vw, 3.5rem)',
            top: '6%',
            left: '50%',
            transform: 'translateX(-46%) rotate(-6deg)',
            animationDelay: '0.15s',
          }}
        >
          {hero.accentWord}
        </span>

      </div>

      {/* --- DESKTOP Tagline + Presented By --- */}
      <div className="hidden md:flex relative z-20 flex-row items-end justify-between gap-2 px-14 pb-6 text-left mt-0 w-full">
        <p className="ac-body text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {hero.tagline}
        </p>
        <p className="ac-body text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {hero.presentedBy}
        </p>
      </div>

      {/* --- DESKTOP Footer row: icons + website --- */}
      <div className="hidden md:flex relative z-20 items-center justify-between px-14 pb-10 w-full">
        <div className="flex items-center gap-3">
          <button className="ac-icon-btn" aria-label="Search">
            <Search size={16} />
          </button>
          <button className="ac-icon-btn" aria-label="Play showreel">
            <Play size={14} fill="#0a0a0a" />
          </button>
        </div>
        <p className="ac-body text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {global.website}
        </p>
      </div>

      {/* --- MOBILE Bottom Content --- */}
      <div className="md:hidden absolute bottom-0 left-0 w-full z-40 flex flex-col items-center pb-6 pt-32 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent gap-2 px-6">
        <p className="ac-body text-sm text-center drop-shadow-md" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {hero.tagline}
        </p>
        <p className="ac-body text-sm text-center drop-shadow-md" style={{ color: '#f5a623' }}>
          {hero.presentedBy}
        </p>
        <div className="flex w-full items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button className="ac-icon-btn" aria-label="Search"><Search size={16} /></button>
            <button className="ac-icon-btn" aria-label="Play showreel"><Play size={14} fill="#0a0a0a" /></button>
          </div>
          <p className="ac-body text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {global.website}
          </p>
        </div>
      </div>

      <img
        src={hero.heroImage}
        alt={global.name}
        className="ac-slide-up-image absolute left-1/2 hero-img-position"
        style={{
          width: 'clamp(280px, 70vw, 800px)',
          height: 'auto',
          maxHeight: '95vh',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          zIndex: 33,
          animationDelay: '0.1s',
          transform: 'translateX(-50%)',
        }}
      />
    </section>
  );
}
