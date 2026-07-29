import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function CreativesPage({ projects, global, onSelectProject }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Dynamic categories collected from all project types
  const defaultCategories = ['All', 'Logos', 'Motion Graphic', 'Graphics', 'Post', 'Video Edit', 'Thumbnails', '3D'];
  const projectTypes = projects ? projects.map(p => p.type).filter(Boolean) : [];
  const categories = Array.from(new Set([...defaultCategories, ...projectTypes]));

  const filteredProjects = selectedCategory === 'All' 
    ? (projects || [])
    : (projects || []).filter(project => {
        if (!project.type) return false;
        const pType = project.type.toLowerCase().trim();
        const cat = selectedCategory.toLowerCase().trim();
        return pType === cat || pType.includes(cat) || cat.includes(pType);
      });

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
            <h1 className="font-heading text-[12vw] leading-none tracking-tighter text-primary uppercase select-none drop-shadow-2xl mb-6">
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
                className={`px-5 py-2 rounded-full border transition-all ac-body text-sm font-medium tracking-wide cursor-pointer ${
                  selectedCategory.toLowerCase() === category.toLowerCase()
                    ? 'border-[#f5a623] bg-[#f5a623] text-black shadow-[0_0_15px_rgba(245,166,35,0.4)]'
                    : 'border-white/20 bg-transparent text-white/70 hover:border-white/50 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            data-stagger-container
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects && filteredProjects.length > 0 ? (
                filteredProjects.map((project, idx) => {
                  const projectSlug = project.slug || project.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `project-${idx}`;
                  
                  return (
                    <motion.div
                      key={projectSlug}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="group relative cursor-pointer overflow-hidden rounded-xl bg-white/5 border border-white/10 aspect-[4/5] md:aspect-[3/4] flex flex-col justify-end"
                      onClick={() => onSelectProject({ ...project, slug: projectSlug })}
                      data-stagger-item
                    >
                      {/* Image or Fallback */}
                      {project.coverImage ? (
                        <img
                          src={project.coverImage}
                          alt={project.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0a] flex items-center justify-center p-6 text-center">
                          <span className="ac-display text-2xl text-white/40">{project.name}</span>
                        </div>
                      )}
                      
                      {/* Gradient Overlay for Readable Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-opacity duration-300"></div>

                      {/* Content Overlay - Always visible on mobile, enhanced hover effect on desktop */}
                      <div className="relative z-10 p-6 md:p-8 flex flex-col justify-end h-full">
                        <span className="text-[#f5a623] ac-script text-2xl md:text-3xl mb-1 block">
                          {project.type || 'Creative Work'}
                        </span>
                        <h3 className="ac-display text-2xl md:text-3xl text-white tracking-wide mb-3">
                          {project.name}
                        </h3>
                        {project.description && (
                          <p className="ac-body text-xs md:text-sm text-white/70 line-clamp-2 mb-4">
                            {project.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 text-accent ac-body text-xs md:text-sm uppercase tracking-widest font-semibold group-hover:translate-x-1 transition-transform duration-300">
                          View Project <ArrowRight size={16} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })
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

      <Footer />
      <BackToTop />
    </div>
  );
}
