import React, { useState, useRef, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import HeroDesktop from './HeroDesktop';
import HeroMobile from './HeroMobile';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'About', href: '/about' },
  { label: 'Creatives', href: '/creatives' },
  { label: 'Contact', href: '/contact' },
];

export default function Hero({ photoRef, headlineRef, accentRef }) {
  const { portfolioData } = usePortfolio();
  const hero = portfolioData?.hero || {};
  const global = portfolioData?.global || {};

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section id="home" style={{ backgroundColor: '#0a0a0a' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Caveat:wght@600;700&family=Inter:wght@400;500;600;700&display=swap');

        .ac-display { font-family: 'Anton', sans-serif; font-weight: 700; }
        .ac-script { font-family: 'Dancing Script', cursive; }
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

        .bg-grid-pattern {
          background-size: 40px 40px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
        }

        .ac-marquee {
          white-space: nowrap;
          overflow: hidden;
          position: absolute;
          top: 45%;
          left: 0;
          width: 100vw;
          transform: translateY(-50%) rotate(-2deg);
          pointer-events: none;
          z-index: 0;
          opacity: 0.03;
        }

        .ac-marquee span {
          display: inline-block;
          padding-left: 2rem;
          font-family: 'Anton', sans-serif;
          font-size: clamp(8rem, 25vw, 30rem);
          color: transparent;
          -webkit-text-stroke: 2px #ffffff;
        }
      `}</style>

      {/* Layout Split: Desktop (md and above) */}
      <div className="hidden md:block">
        <HeroDesktop 
          hero={hero}
          global={global}
          navLinks={navLinks}
          photoRef={photoRef}
          headlineRef={headlineRef}
          accentRef={accentRef}
        />
      </div>

      {/* Layout Split: Mobile (below md) */}
      <div className="block md:hidden">
        <HeroMobile 
          hero={hero}
          global={global}
          navLinks={navLinks}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          photoRef={photoRef}
          headlineRef={headlineRef}
          accentRef={accentRef}
        />
      </div>
    </section>
  );
}
