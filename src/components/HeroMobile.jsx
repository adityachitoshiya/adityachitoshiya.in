import React, { useRef, useEffect } from 'react';
import { Search, Play, Pause, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { animateHeroEntrance } from './gsapAnimations';

export default function HeroMobile({
  hero,
  global,
  navLinks,
  isPlaying,
  toggleAudio,
  setIsSearchOpen,
  menuOpen,
  setMenuOpen,
}) {
  const navRef = useRef(null);
  const badgeRef = useRef(null);
  const accentRef = useRef(null);
  const headlineRef = useRef(null);
  const photoRef = useRef(null);
  const taglineRef = useRef(null);
  const presentedRef = useRef(null);
  const footerRef = useRef(null);

  useEffect(() => {
    // gsap.context() scopes all animations + their cleanup to this component,
    // so nothing leaks or double-fires if HeroMobile unmounts/remounts.
    const ctx = gsap.context(() => {
      animateHeroEntrance({
        navRef,
        badgeRef,
        accentRef,
        headlineRef,
        photoRef,
        taglineRef,
        presentedRef,
        footerRef,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full min-h-[100svh] flex flex-col z-20 bg-[#0a0a0a] overflow-hidden">
      {/* Nav */}
      <nav ref={navRef} className="relative z-30 flex items-center justify-between px-6 py-6">
        <span className="ac-display text-3xl tracking-wider" style={{ color: '#f5a623' }}>
          AC.
        </span>

        <div className="flex items-center gap-4">
          <button aria-label="Open menu" className="text-white" onClick={() => setMenuOpen((o) => !o)}>
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative z-30 flex flex-col gap-4 px-6 pb-6 ac-body overflow-hidden bg-[#0a0a0a]"
          >
            {navLinks.map((link) =>
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white text-sm py-2 border-b border-white/5 last:border-0"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white text-sm py-2 border-b border-white/5 last:border-0"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Stack */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-10 pb-24 gap-8">
        {/* Availability Badge */}
        <div
          ref={badgeRef}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-fit"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              global.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'
            }`}
          ></span>
          <span className="ac-body text-xs text-white/80 tracking-wide uppercase">
            {global.availableForWork ? 'Available for Projects' : 'Currently Booked'}
          </span>
        </div>

        {/* Accent Word & Headline */}
        <div className="flex flex-col items-center text-center gap-2">
          <span
            ref={accentRef}
            className="ac-script"
            style={{ color: '#f5a623', fontSize: 'clamp(2.5rem, 10vw, 4rem)', transform: 'rotate(-6deg)' }}
          >
            {hero.accentWord}
          </span>
          <h1
            ref={headlineRef}
            className="ac-display w-full break-words"
            style={{
              color: '#ffffff',
              fontSize: 'clamp(2.8rem, 14vw, 5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.02em',
              margin: 0,
              overflowWrap: 'break-word',
            }}
          >
            {hero.headline}
          </h1>
        </div>

        {/* Hero Image (normal inline flow, no absolute positioning) */}
        <div className="w-full max-w-sm px-4 flex justify-center">
          <img
            ref={photoRef}
            src={hero.heroImage}
            alt={global.name}
            className="w-full h-auto rounded-[32px] grayscale"
          />
        </div>
      </div>

      {/* MOBILE Bottom Content */}
      <div className="w-full flex flex-col items-center pb-8 gap-3 px-6 mt-auto">
        <p ref={taglineRef} className="ac-body text-sm text-center" style={{ color: 'rgba(255,255,255,0.9)' }}>
          {hero.tagline}
        </p>
        <p ref={presentedRef} className="ac-body text-sm text-center" style={{ color: '#f5a623' }}>
          {hero.presentedBy}
        </p>

        <div
          ref={footerRef}
          className="flex w-full items-center justify-between mt-6 pt-6 border-t border-white/10"
        >
          <div className="flex items-center gap-4">
            <button className="ac-icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <Search size={16} />
            </button>
            <button className="ac-icon-btn" aria-label="Toggle background music" onClick={toggleAudio}>
              {isPlaying ? <Pause size={14} fill="#0a0a0a" /> : <Play size={14} fill="#0a0a0a" />}
            </button>
          </div>
          <p className="ac-body text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {global.website}
          </p>
        </div>
      </div>
    </div>
  );
}
