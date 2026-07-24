import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const WorkExperience = () => {
  const { portfolioData } = usePortfolio();
  const { workExperience } = portfolioData;

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        
        {/* Left/Main Column - Content */}
        <div className="lg:col-span-8">
            <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-heading text-6xl md:text-8xl mb-20 leading-[0.9] uppercase text-primary"
            >
                {workExperience.headline}
            </motion.h2>

            {/* Timeline Grid (Similar to Education) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                {workExperience.items?.map((item, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="border-t border-white/20 pt-6"
                    >
                        <p className="text-white mb-2 font-medium">{item.year}</p>
                        <h3 className="text-accent font-heading tracking-wide text-2xl mb-4 uppercase">{item.company}</h3>
                        <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Right Column - Stacked Images */}
        <div className="lg:col-span-4 flex flex-col gap-8 h-full justify-center">
             <motion.img 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                src={workExperience.image1} 
                alt="Work Context 1" 
                className="w-full h-[300px] object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
            />
            <motion.img 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                src={workExperience.image2} 
                alt="Work Context 2" 
                className="w-full h-[300px] object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
            />
        </div>

      </div>
    </section>
  );
};

export default WorkExperience;
