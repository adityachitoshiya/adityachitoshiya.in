import React from 'react';
import { Search, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroDesktop({
  hero,
  global,
  navLinks,
  isPlaying,
  toggleAudio,
  setIsSearchOpen
}) {
  return (
    <div className="relative w-full h-[100svh] flex flex-col z-20 overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f5a623] rounded-full blur-[180px] opacity-10 mix-blend-screen"></div>
      </div>

      {/* Marquee Text Background */}
      <div className="ac-marquee">
        <span>{hero.headline} {hero.headline} {hero.headline} {hero.headline} {hero.headline} {hero.headline}</span>
      </div>

      {/* Nav */}
      <nav className="relative z-30 flex items-center justify-between px-14 py-8">
        <span
          className="ac-display text-4xl tracking-wider"
          style={{ color: '#f5a623' }}
        >
          AC.
        </span>

        {/* Center Nav Links - Absolute Position for perfect centering */}
        <div className="flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          {navLinks.map((link) => (
            link.href.startsWith('/') && !link.href.includes('#') ? (
              <Link key={link.label} to={link.href} className="ac-nav-link ac-body text-sm tracking-wide">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="ac-nav-link ac-body text-sm tracking-wide">
                {link.label}
              </a>
            )
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Availability Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span 
              className={`w-2 h-2 rounded-full ${global.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'}`}
            ></span>
            <span className="ac-body text-xs text-white/80 tracking-wide uppercase">
              {global.availableForWork ? 'Available for Projects' : 'Currently Booked'}
            </span>
          </div>
        </div>
      </nav>

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

      {/* Tagline + Presented By */}
      <div className="relative z-20 flex flex-row items-end justify-between gap-2 px-14 pb-6 text-left mt-0 w-full">
        <p className="ac-body text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {hero.tagline}
        </p>
        <p className="ac-body text-base" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {hero.presentedBy}
        </p>
      </div>

      {/* Footer row: icons + website */}
      <div className="relative z-20 flex items-center justify-between px-14 pb-10 w-full">
        <div className="flex items-center gap-3">
          <button className="ac-icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <Search size={16} />
          </button>
          <button className="ac-icon-btn" aria-label="Toggle background music" onClick={toggleAudio}>
            {isPlaying ? <Pause size={14} fill="#0a0a0a" /> : <Play size={14} fill="#0a0a0a" />}
          </button>
        </div>
        <p className="ac-body text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {global.website}
        </p>
      </div>

      <img
        src={hero.heroImage}
        alt={global.name}
        className="ac-slide-up-image absolute left-1/2"
        style={{
          bottom: '-100px',
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
    </div>
  );
}
