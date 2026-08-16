import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateHeroEntrance } from './gsapAnimations';

gsap.registerPlugin(ScrollTrigger);

import MediaRenderer from './MediaRenderer';

export default function HeroMobile({
  hero,
  global,
  navLinks,
  setIsSearchOpen,
  menuOpen,
  setMenuOpen,
  photoRef,
  headlineRef,
  accentRef
}) {
  const navRef = useRef(null);
  const badgeRef = useRef(null);
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
  }, [accentRef, headlineRef, photoRef]);

  return (
    <div className="relative w-full min-h-[100svh] flex flex-col z-20 bg-[#0a0a0a] overflow-hidden pt-20">
      {/* Spacer for fixed global Navbar */}

      {/* Main Content Stack */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-10 pb-24 gap-8">
        {/* Availability Badge */}
        <Link
          to="/contact"
          ref={badgeRef}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 w-fit hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              global.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'
            }`}
          ></span>
          <span className="ac-body text-xs text-white/80 tracking-wide uppercase">
            {global.availableForWork ? 'Available for Projects' : 'Currently Booked'}
          </span>
        </Link>

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
              letterSpacing: '0.05em',
              margin: 0,
              overflowWrap: 'break-word',
            }}
          >
            {hero.headline}
          </h1>
        </div>

        {/* Hero Image (normal inline flow, no absolute positioning) */}
        <div className="w-full max-w-[280px] h-[350px] px-2 flex justify-center overflow-hidden rounded-[32px] border border-white/10 shadow-2xl">
          <MediaRenderer
            ref={photoRef}
            src={hero.heroImage}
            alt={global.name}
            className="w-full h-full object-cover rounded-[32px]"
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
          className="flex w-full items-center justify-end mt-6 pt-6 border-t border-white/10"
        >
          <p className="ac-body text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
            {global.website}
          </p>
        </div>
      </div>
    </div>
  );
}
