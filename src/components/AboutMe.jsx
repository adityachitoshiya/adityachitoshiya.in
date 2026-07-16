import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import Button from './Button';

const AboutMe = () => {
  const { portfolioData } = usePortfolio();
  const { aboutMe } = portfolioData;

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] uppercase text-primary">
            {aboutMe.headline}
          </h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed mb-10 font-light">
            {aboutMe.text}
          </p>
          <Button>Learn More</Button>
        </motion.div>

        {/* Right Column - Large Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-[500px] md:h-[700px]"
        >
          <img 
            src={aboutMe.image} 
            alt="About Me Portrait" 
            className="w-full h-full object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default AboutMe;
