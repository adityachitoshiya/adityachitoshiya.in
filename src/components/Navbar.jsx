import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import Magnetic from './Magnetic';

const Navbar = () => {
  const { portfolioData } = usePortfolio();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home' },
    { name: 'About', href: '/about' },
    { name: 'Creatives', href: '/creatives' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background py-4 shadow-lg' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <a href="/#home" className="ac-display text-4xl tracking-wider text-accent">
          {portfolioData.global?.name?.split(' ')[0] || 'AC'}.
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-10">
          {navLinks.map((link) => (
            link.href.startsWith('/') && !link.href.includes('#') ? (
              <Magnetic key={link.name}>
                <Link
                  to={link.href}
                  className="ac-nav-link ac-body text-sm tracking-wide inline-block px-2 py-1 text-primary"
                >
                  {link.name}
                </Link>
              </Magnetic>
            ) : (
              <Magnetic key={link.name}>
                <a
                  href={link.href}
                  className="ac-nav-link ac-body text-sm tracking-wide inline-block px-2 py-1 text-primary"
                >
                  {link.name}
                </a>
              </Magnetic>
            )
          ))}
        </div>

        {/* Right side Status Badge */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5">
            <span 
              className={`w-2 h-2 rounded-full ${portfolioData.global?.availableForWork ? 'bg-[#f5a623] shadow-[0_0_8px_#f5a623]' : 'bg-gray-500'}`}
            ></span>
            <span className="ac-body text-xs text-white/80 tracking-wide uppercase">
              {portfolioData.global?.availableForWork ? 'Available for Projects' : 'Currently Booked'}
            </span>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-primary focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-background border-b border-white/10 py-6 px-6 flex flex-col space-y-6 md:hidden shadow-2xl"
          >
            {navLinks.map((link) => (
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-primary text-xl font-heading tracking-wider hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-primary text-xl font-heading tracking-wider hover:text-accent transition-colors"
                >
                  {link.name}
                </a>
              )
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
