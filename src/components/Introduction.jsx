import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import Button from './Button';

const Introduction = () => {
  const { portfolioData } = usePortfolio();
  const { introduction } = portfolioData;

  return (
    <section id="about" className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column - Capsule Images */}
        <div className="flex justify-center md:justify-start gap-4 md:gap-8 items-center h-[min(500px,60svh)] md:h-[600px] order-2 lg:order-1">
          <motion.img 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src={introduction.imageTall} 
            alt="Portrait Tall" 
            className="w-[45%] md:w-[220px] h-[90%] object-cover pill-shape grayscale hover:grayscale-0 transition-all duration-500"
          />
          <motion.img 
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={introduction.imageShort} 
            alt="Portrait Short" 
            className="w-[45%] md:w-[220px] h-[70%] object-cover pill-shape grayscale hover:grayscale-0 transition-all duration-500 mt-10"
          />
        </div>

        {/* Right Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl order-1 lg:order-2"
        >
          <h2 className="font-heading text-[clamp(2.5rem,8vw,4.5rem)] mb-8 leading-[0.9] uppercase text-primary">
            {introduction.headline}
          </h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed mb-10 font-light">
            {introduction.text}
          </p>
          <a href="/about"><Button>Learn More</Button></a>
        </motion.div>

      </div>
    </section>
  );
};

export default Introduction;
