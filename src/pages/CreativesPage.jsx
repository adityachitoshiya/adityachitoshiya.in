import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SimpleFooter from '../components/SimpleFooter';
import BackToTop from '../components/BackToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CreativesPage({ projects, global, onSelectProject }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ['All', 'Logos', 'Motion Graphic', 'Graphics', 'Post', 'Video Edit', 'Thumbnails', '3D'];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.type && project.type.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body relative overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-14 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-16"
          >
            <h1 className="ac-display text-5xl md:text-7xl lg:text-8xl mb-6 text-white tracking-wider">
              CREATIVES
            </h1>
            <p className="ac-body text-lg md:text-xl text-white/70 max-w-2xl">
              A curated selection of my latest work across brand campaigns, UI/UX, and motion storytelling.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            className="flex flex-wrap items-center gap-3 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full border transition-all ac-body text-sm font-medium tracking-wide ${
                  selectedCategory === category
                    ? 'border-[#f5a623] bg-[#f5a623] text-black'
                    : 'border-white/20 bg-transparent text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Masonry-style Grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects && filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => (
                  <motion.div
                    key={project.slug || idx}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className="group relative cursor-pointer overflow-hidden rounded-lg bg-white/5 border border-white/10 aspect-[4/5] md:aspect-[3/4]"
                    onClick={() => onSelectProject(project)}
                  >
                    {/* Image */}
                    <img
                      src={project.coverImage}
                      alt={project.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    
                    {/* Hover Reveal Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6 md:p-8">
                      <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <span className="text-[#f5a623] ac-script text-2xl md:text-3xl mb-2 block">{project.type}</span>
                        <h3 className="ac-display text-3xl md:text-4xl text-white tracking-wide mb-4">{project.name}</h3>
                        <div className="flex items-center gap-2 text-white/80 ac-body text-sm uppercase tracking-widest font-semibold hover:text-[#f5a623] transition-colors">
                          View Project <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="col-span-full py-20 text-center text-white/50 ac-body"
                >
                  No projects found in this category yet.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <SimpleFooter />
      <BackToTop />
    </div>
  );
}
