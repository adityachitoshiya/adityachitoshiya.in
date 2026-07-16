import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const ProjectGallery = () => {
  const { portfolioData } = usePortfolio();
  const { projectPortfolio } = portfolioData;

  return (
    <section id="portfolio" className="py-24 md:py-32 w-full bg-background border-t border-white/5 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.h2 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-heading text-6xl md:text-8xl leading-[0.9] uppercase text-primary"
            >
                {projectPortfolio.headline.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                        {word}<br/>
                    </React.Fragment>
                ))}
            </motion.h2>
            <motion.p 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-muted max-w-sm text-lg md:text-xl font-light md:pb-4"
            >
                {projectPortfolio.text}
            </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {projectPortfolio.images.map((imgUrl, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="overflow-hidden rounded-[32px] h-[400px] md:h-[600px] group cursor-pointer"
                >
                    <img 
                        src={imgUrl} 
                        alt={`Gallery Item ${index + 1}`} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                </motion.div>
            ))}
        </div>

        {/* Project List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectPortfolio.projects.map((project, index) => (
                <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
                    className="border-t border-white/10 pt-6"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-heading tracking-wide text-xl uppercase">{project.name}</h3>
                        <span className="text-xs text-accent font-medium uppercase tracking-wider px-2 py-1 bg-accent/10 rounded-full">{project.type}</span>
                    </div>
                    <p className="text-muted text-sm leading-relaxed">{project.description}</p>
                </motion.div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default ProjectGallery;
