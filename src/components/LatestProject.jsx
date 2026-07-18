import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const LatestProject = () => {
  const { portfolioData } = usePortfolio();
  const { latestProject } = portfolioData;

  const projects = [latestProject.project1, latestProject.project2];

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
        
        {/* Left - Hero Image */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 h-[500px] md:h-[700px] w-full"
        >
            <img 
                src={latestProject.mainImage} 
                alt="Latest Project Main" 
                className="w-full h-full object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
            />
        </motion.div>

        {/* Center - Headline & Smaller Images */}
        <div className="lg:col-span-4 flex flex-col justify-between h-full">
             <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-heading text-5xl md:text-7xl leading-[0.9] uppercase text-primary mb-12"
            >
                {latestProject.headline}
            </motion.h2>

            <div className="flex gap-4">
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-1/2 h-[200px] md:h-[250px]"
                >
                    <img src={latestProject.image1} alt="Detail 1" className="w-full h-full object-cover rounded-[24px] grayscale hover:grayscale-0 transition-all duration-500" />
                </motion.div>
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="w-1/2 h-[200px] md:h-[250px]"
                >
                    <img src={latestProject.image2} alt="Detail 2" className="w-full h-full object-cover rounded-[24px] grayscale hover:grayscale-0 transition-all duration-500" />
                </motion.div>
            </div>
        </div>

        {/* Right - Text Writeups */}
        <div className="lg:col-span-3 flex flex-col justify-end h-full gap-12 pt-12 lg:pt-0">
            {projects.map((project, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="border-t border-white/20 pt-6"
                >
                    <h3 className="text-accent font-heading tracking-wide text-2xl mb-4 uppercase">{project.title}</h3>
                    <p className="text-muted text-sm leading-relaxed">{project.description}</p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default LatestProject;
