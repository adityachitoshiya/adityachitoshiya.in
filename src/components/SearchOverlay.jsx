import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const SearchOverlay = ({ isOpen, onClose }) => {
  const { portfolioData } = usePortfolio();
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Get project suggestions
  const projects = portfolioData?.projectPortfolio?.projects || [];
  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Limit to 5 results

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-start bg-[#0a0a0a]/95 backdrop-blur-md pt-[20vh] px-6"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 md:top-12 md:right-12 text-white/50 hover:text-white transition-colors p-2"
          >
            <X size={32} strokeWidth={1.5} />
          </button>

          {/* Search Container */}
          <motion.div 
            initial={{ y: -40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -20, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            <div className="relative w-full flex items-center">
              <Search className="absolute left-6 text-accent" size={28} strokeWidth={2} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search projects, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder-white/30 text-2xl md:text-4xl font-light ac-body rounded-full py-6 pl-20 pr-8 focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all shadow-2xl"
              />
            </div>

            {/* Results Area */}
            <motion.div 
              className="w-full mt-8 flex flex-col gap-2"
              initial={false}
              animate={{ opacity: searchQuery ? 1 : 0 }}
            >
              {searchQuery && filteredProjects.length > 0 && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-2 overflow-hidden shadow-xl">
                  {filteredProjects.map((project, idx) => (
                    <motion.a
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={idx}
                      href={`/creatives`} // Normally would route to specific project
                      onClick={onClose}
                      className="flex items-center gap-4 p-4 hover:bg-white/10 rounded-xl transition-colors cursor-pointer group"
                    >
                      <img src={project.coverImage} alt={project.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex flex-col">
                        <span className="text-white font-medium ac-body text-lg group-hover:text-accent transition-colors">{project.name}</span>
                        <span className="text-white/50 text-sm ac-body">{project.type}</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              )}

              {searchQuery && filteredProjects.length === 0 && (
                <div className="text-center text-white/50 py-12 ac-body text-lg">
                  No projects found for "{searchQuery}"
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
