import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const Education = () => {
  const { portfolioData } = usePortfolio();
  const { education } = portfolioData;

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Top Header & Banner */}
        <div className="flex flex-col lg:flex-row gap-12 mb-20 items-center">
            <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-heading text-[clamp(3rem,8vw,5.5rem)] leading-[0.9] uppercase text-primary lg:w-1/3"
            >
                {education.headline}
            </motion.h2>
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:w-2/3 h-[250px] md:h-[400px] w-full"
            >
                <img 
                    src={education.bannerImage} 
                    alt="Education Banner" 
                    className="w-full h-full object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
                />
            </motion.div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {education.items.map((item, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="border-t border-white/20 pt-6"
                >
                    <p className="text-white mb-2 font-medium">{item.year}</p>
                    <h3 className="text-accent font-heading tracking-wide text-2xl mb-4 uppercase">{item.institution}</h3>
                    <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default Education;
