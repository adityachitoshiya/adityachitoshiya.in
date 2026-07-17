import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function ProjectDetail({ project, allProjects, global, onBack, onSelectProject }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [project]);

  if (!project) return null;

  // Find 2-3 other projects for "You Might Also Like"
  const otherProjects = allProjects.filter(p => p.slug !== project.slug).slice(0, 3);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body relative overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-20 px-6 md:px-14 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-[#f5a623] transition-colors ac-body text-sm uppercase tracking-widest font-semibold mb-12"
          >
            <ArrowLeft size={16} /> Back to Creatives
          </button>

          {/* Project Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16"
          >
            <div className="lg:col-span-8">
              <span className="text-[#f5a623] ac-script text-3xl md:text-4xl mb-4 block">{project.type}</span>
              <h1 className="ac-display text-5xl md:text-7xl lg:text-8xl mb-6 text-white tracking-wider">
                {project.name}
              </h1>
            </div>
            <div className="lg:col-span-4 flex flex-col justify-end">
              <p className="ac-body text-lg text-white/70 mb-6">
                {project.description}
              </p>
              <div className="flex flex-col gap-4 border-t border-white/10 pt-6">
                {project.year && (
                  <div>
                    <span className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-1">Year</span>
                    <span className="text-white ac-body">{project.year}</span>
                  </div>
                )}
                {project.role && (
                  <div>
                    <span className="text-white/50 text-xs uppercase tracking-widest font-semibold block mb-1">Role</span>
                    <span className="text-white ac-body">{project.role}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden mb-16 border border-white/10"
          >
            <img 
              src={project.coverImage} 
              alt={`${project.name} Cover`} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Gallery */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="space-y-8 md:space-y-16 mb-24">
              {project.gallery.map((imgSrc, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full rounded-xl overflow-hidden border border-white/10"
                >
                  <img 
                    src={imgSrc} 
                    alt={`${project.name} Gallery ${idx + 1}`} 
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom Back Button */}
          <div className="flex justify-center mb-32 border-b border-white/10 pb-20">
            <button 
              onClick={onBack}
              className="px-8 py-4 bg-white/5 hover:bg-[#f5a623] hover:text-black border border-white/10 rounded-full text-white transition-all duration-300 ac-body uppercase tracking-widest font-semibold text-sm"
            >
              View All Projects
            </button>
          </div>

          {/* You Might Also Like */}
          {otherProjects.length > 0 && (
            <div>
              <h3 className="ac-display text-3xl md:text-4xl mb-8 tracking-wide">You Might Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {otherProjects.map((other, idx) => (
                  <motion.div
                    key={other.slug || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="group cursor-pointer rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-video md:aspect-[4/3] relative"
                    onClick={() => onSelectProject(other)}
                  >
                    <img 
                      src={other.coverImage} 
                      alt={other.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[#f5a623] ac-script text-xl block mb-1">{other.type}</span>
                        <h4 className="ac-display text-2xl text-white tracking-wide">{other.name}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
