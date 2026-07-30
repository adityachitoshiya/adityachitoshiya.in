import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import Magnetic from './Magnetic';

const Navbar = () => {
  const { portfolioData } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle menu state cleanly
  useEffect(() => {
    // Menu state listener if needed
  }, [isMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/about' },
    { name: 'Creatives', href: '/creatives' },
    { name: 'Contact', href: '/contact' },
  ];

  // Animation variants
  const menuVariants = {
    closed: {
      y: '-100%',
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
    open: {
      y: '0%',
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    },
  };

  const linkContainerVariants = {
    closed: {
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
    open: {
      transition: { delayChildren: 0.4, staggerChildren: 0.1 },
    },
  };

  const linkVariants = {
    closed: { y: '100%', opacity: 0 },
    open: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] },
    },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-[120] transition-all duration-300 ${
          isScrolled && !isMenuOpen ? 'bg-background/80 backdrop-blur-md py-4 shadow-lg' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
          {/* Logo */}
          <a 
            href="/#home" 
            className="ac-display text-4xl font-bold tracking-wider text-accent transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            AC.
          </a>

          {/* Right side controls */}
          <div className="flex items-center gap-6">
            {/* Status Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 transition-all duration-300">
              <span 
                className={`w-2 h-2 rounded-full ${portfolioData.global?.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'}`}
              ></span>
              <span className="ac-body text-xs tracking-wide uppercase text-white/80">
                {portfolioData.global?.availableForWork ? 'Available for Projects' : 'Currently Booked'}
              </span>
            </div>

            {/* Creative Hamburger Toggle */}
            <Magnetic>
              <button
                className="relative w-12 h-12 flex items-center justify-center rounded-full bg-accent hover:bg-[#d9901b] transition-colors focus:outline-none z-[101] shadow-[0_0_20px_rgba(245,166,35,0.3)]"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                <div className="relative w-6 h-4">
                  {/* Top Line */}
                  <motion.span
                    className="absolute left-0 w-full h-[2px] rounded-full bg-[#0a0a0a]"
                    animate={{
                      top: isMenuOpen ? '50%' : '0%',
                      rotate: isMenuOpen ? 45 : 0,
                      translateY: isMenuOpen ? '-50%' : '0%',
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                  {/* Middle Line */}
                  <motion.span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] rounded-full bg-[#0a0a0a]"
                    animate={{
                      opacity: isMenuOpen ? 0 : 1,
                      x: isMenuOpen ? 10 : 0,
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                  {/* Bottom Line */}
                  <motion.span
                    className="absolute left-0 w-full h-[2px] rounded-full bg-[#0a0a0a]"
                    animate={{
                      bottom: isMenuOpen ? '50%' : '0%',
                      rotate: isMenuOpen ? -45 : 0,
                      translateY: isMenuOpen ? '50%' : '0%',
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  />
                </div>
              </button>
            </Magnetic>
          </div>
        </div>
      </nav>

      {/* Full Screen Overlay Menu with Blur Glassmorphism Background */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 w-full h-full bg-[#0a0a0a]/95 backdrop-blur-3xl z-[110] flex flex-col justify-center px-6 md:px-24 overflow-hidden border-b border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            {/* Ambient Mirror Glow Effects */}
            <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[160px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[160px] pointer-events-none"></div>

            {/* Decorative Background Text Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.03]">
              <h1 className="ac-display text-[16vw] leading-none text-white whitespace-nowrap tracking-widest">
                MENU
              </h1>
            </div>

            <div className="max-w-[1440px] w-full mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-12 md:gap-0 mt-20">
              
              {/* Navigation Links */}
              <motion.div 
                variants={linkContainerVariants}
                className="flex flex-col gap-4 md:gap-8"
              >
                <div className="overflow-hidden mb-4">
                  <motion.p variants={linkVariants} className="text-accent ac-body text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
                    // Navigation
                  </motion.p>
                </div>
                
                {navLinks.map((link, i) => (
                  <div key={link.name} className="overflow-hidden">
                    <motion.div variants={linkVariants}>
                      {link.href.startsWith('/') && !link.href.includes('#') ? (
                        <Link
                          to={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="group relative inline-flex items-center ac-display text-5xl md:text-8xl text-white hover:text-accent transition-colors duration-300"
                        >
                          <span className="text-sm md:text-xl absolute -left-6 md:-left-12 top-2 md:top-4 text-accent/50 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 font-body">0{i + 1}</span>
                          <span className="relative overflow-hidden inline-block">
                            <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">{link.name}</span>
                            <span className="absolute top-0 left-0 inline-block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 text-accent">{link.name}</span>
                          </span>
                        </Link>
                      ) : (
                        <a
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="group relative inline-flex items-center ac-display text-5xl md:text-8xl text-white hover:text-accent transition-colors duration-300"
                        >
                          <span className="text-sm md:text-xl absolute -left-6 md:-left-12 top-2 md:top-4 text-accent/50 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 font-body">0{i + 1}</span>
                          <span className="relative overflow-hidden inline-block">
                            <span className="inline-block transition-transform duration-500 ease-out group-hover:-translate-y-full">{link.name}</span>
                            <span className="absolute top-0 left-0 inline-block transition-transform duration-500 ease-out translate-y-full group-hover:translate-y-0 text-accent">{link.name}</span>
                          </span>
                        </a>
                      )}
                    </motion.div>
                  </div>
                ))}
              </motion.div>

              {/* Contact & Social Info */}
              <motion.div 
                variants={linkContainerVariants}
                className="flex flex-col gap-8 md:text-right"
              >
                <div className="overflow-hidden">
                  <motion.div variants={linkVariants} className="flex flex-col gap-2">
                    <p className="text-accent ac-body text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
                      // Say Hello
                    </p>
                    <a href={`mailto:${portfolioData.global?.contactEmail || 'hello@adityachitoshiya.in'}`} className="ac-body text-xl md:text-2xl text-white/90 hover:text-accent transition-colors duration-300">
                      {portfolioData.global?.contactEmail || 'adityachitoshiya12@gmail.com'}
                    </a>
                  </motion.div>
                </div>

                <div className="overflow-hidden">
                  <motion.div variants={linkVariants} className="flex flex-col gap-2">
                    <p className="text-accent ac-body text-xs md:text-sm tracking-[0.25em] uppercase font-semibold">
                      // Socials
                    </p>
                    <div className="flex gap-6 md:justify-end">
                      {[
                        { name: 'LinkedIn', url: portfolioData.global?.linkedinUrl || '#' },
                        { name: 'Twitter', url: portfolioData.global?.twitterUrl || '#' },
                        { name: 'GitHub', url: portfolioData.global?.githubUrl || '#' },
                        { name: 'Instagram', url: portfolioData.global?.instagramUrl || '#' },
                      ].map((social) => (
                        <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="ac-body text-lg text-white/80 hover:text-accent relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[1px] after:bg-accent after:origin-bottom-right after:scale-x-0 hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300">
                          {social.name}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
