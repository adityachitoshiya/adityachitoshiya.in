import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const Footer = () => {
  const { portfolioData } = usePortfolio();
  const { thankYou } = portfolioData;

  return (
    <footer className="relative w-full bg-background pt-32 pb-12 overflow-hidden border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col items-center">
        
        {/* Main Huge Typography (Similar to Hero) */}
        <div className="relative z-10 w-full text-center mb-16">
          
          {/* Accent Cursive Word */}
          <motion.div 
            initial={{ opacity: 0, y: 20, rotate: -5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -5 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="absolute -top-8 md:-top-16 lg:-top-24 left-1/2 -translate-x-1/2 text-accent font-script text-4xl md:text-7xl lg:text-[100px] z-20 whitespace-nowrap"
          >
            {thankYou.accentWord}
          </motion.div>

          {/* Huge Headline */}
          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-[12vw] leading-none tracking-tighter text-primary/10 select-none pointer-events-none"
            style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)', color: 'transparent' }}
          >
            {thankYou.headline}
          </motion.h2>

          <motion.h2 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute top-0 left-0 w-full font-heading text-[12vw] leading-none tracking-tighter text-primary select-none pointer-events-none drop-shadow-2xl z-0"
          >
            {thankYou.headline}
          </motion.h2>
        </div>

        {/* Small Image (Anchored) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-48 h-64 md:w-64 md:h-80 relative z-20 -mt-12 md:-mt-24 mb-16"
        >
            <img src={thankYou.image} alt="Closing Portrait" className="w-full h-full object-cover pill-shape grayscale shadow-2xl" />
        </motion.div>

        {/* Copyright / Closing Text */}
        <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-muted text-sm uppercase tracking-widest text-center px-4"
        >
            {thankYou.text}
        </motion.p>

      </div>
    </footer>
  );
};

export default Footer;
