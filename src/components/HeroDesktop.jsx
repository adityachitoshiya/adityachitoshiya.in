import React, { useRef, useEffect } from 'react';
import { Search, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animateMarquee } from './gsapAnimations';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

export default function HeroDesktop({
  hero,
  global,
  navLinks,
  setIsSearchOpen,
  photoRef,
  headlineRef,
  accentRef
}) {
  const marqueeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animateMarquee(marqueeRef, { speed: 55 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="relative w-full h-[100svh] flex flex-col z-20 overflow-hidden">
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f5a623] rounded-full blur-[180px] opacity-10 mix-blend-screen"></div>
      </div>

      {/* Marquee Text Background */}
      <div 
        ref={marqueeRef} 
        className="ac-marquee"
        style={{ top: '50%', opacity: 0.04, zIndex: 0, pointerEvents: 'none' }}
      >
        <span>{hero.headline} {hero.headline} {hero.headline} {hero.headline} {hero.headline} {hero.headline}</span>
      </div>

      {/* Top Spacer for fixed global Navbar */}
      <div className="w-full pt-20"></div>

      {/* Headline block */}
      <div className="relative flex-1 flex items-center justify-center px-4">
        <h1
          ref={headlineRef}
          className="ac-display ac-fade-up w-full text-center select-none"
          style={{
            color: '#ffffff',
            fontSize: 'clamp(3.5rem, 18vw, 24rem)',
            lineHeight: 0.85,
            letterSpacing: '0.05em',
            margin: 0,
          }}
        >
          {hero.headline}
        </h1>

        <span
          ref={accentRef}
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
      <div className="relative z-20 flex items-center justify-end px-14 pb-10 w-full">
        <p className="ac-body text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {global.website}
        </p>
      </div>

      <img
        ref={photoRef}
        src={hero.heroImage}
        alt={global.name}
        className="ac-slide-up-image absolute left-1/2"
        style={{
          bottom: '-50px',
          width: 'clamp(200px, 45vw, 550px)',
          height: 'auto',
          maxHeight: '80vh',
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
