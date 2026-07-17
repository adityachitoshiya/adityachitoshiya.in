import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import Button from './Button';

const WelcomeBanner = () => {
  const { portfolioData } = usePortfolio();
  const { welcome } = portfolioData;

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
        
        {/* Left Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] uppercase text-primary">
            {welcome.headline.split(' ').map((word, i, arr) => (
                <React.Fragment key={i}>
                    {i === arr.length - 1 ? <span className="text-accent">{word}</span> : word}
                    {i !== arr.length - 1 && ' '}
                </React.Fragment>
            ))}
          </h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed mb-10 font-light">
            {welcome.introText}
          </p>
          <a href="/#contact"><Button>Learn More</Button></a>
        </motion.div>

        {/* Right Column - Images */}
        <div className="relative h-[600px] w-full hidden md:block">
          <motion.img 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            src={welcome.image1} 
            alt="Fashion Editorial 1" 
            className="absolute right-0 top-0 w-2/3 h-[400px] object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
          />
          <motion.img 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            src={welcome.image2} 
            alt="Fashion Editorial 2" 
            className="absolute left-0 bottom-0 w-1/2 h-[350px] object-cover rounded-[32px] border-8 border-background grayscale hover:grayscale-0 transition-all duration-500 z-10"
          />
        </div>
        
        {/* Mobile images fallback */}
        <div className="flex flex-col gap-4 md:hidden">
             <img src={welcome.image1} className="w-full h-[300px] object-cover rounded-[24px] grayscale" alt="Fashion 1" />
             <img src={welcome.image2} className="w-full h-[300px] object-cover rounded-[24px] grayscale" alt="Fashion 2" />
        </div>

      </div>
    </section>
  );
};

export default WelcomeBanner;
