import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const ImageSlideshow = () => {
  const { portfolioData } = usePortfolio();
  
  // Use project cover images for the slideshow, or fallback to the generic gallery images
  const projects = portfolioData?.projectPortfolio?.projects || [];
  const projectImages = projects.filter(p => p.coverImage).map(p => p.coverImage);
  const fallbackImages = portfolioData?.projectPortfolio?.images || [];
  
  const slideImages = projectImages.length > 0 ? projectImages.slice(0, 8) : fallbackImages;

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  // Auto-play slideshow every 4 seconds
  useEffect(() => {
    if (slideImages.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [slideImages.length]);

  if (!slideImages || slideImages.length === 0) return null;

  return (
    <section className="py-20 w-full relative border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
         
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-heading uppercase tracking-wider text-white"
            >
                Visual Gallery
            </motion.h2>
            
            {/* Navigation Arrows */}
            <div className="flex gap-4">
               <button 
                  onClick={prevSlide} 
                  className="p-3 rounded-full border border-white/20 hover:bg-[#f5a623] hover:text-black hover:border-[#f5a623] transition-colors text-white"
                  aria-label="Previous slide"
               >
                  <ChevronLeft size={24} />
               </button>
               <button 
                  onClick={nextSlide} 
                  className="p-3 rounded-full border border-white/20 hover:bg-[#f5a623] hover:text-black hover:border-[#f5a623] transition-colors text-white"
                  aria-label="Next slide"
               >
                  <ChevronRight size={24} />
               </button>
            </div>
         </div>

         {/* Slideshow Container */}
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-[400px] md:h-[600px] rounded-3xl overflow-hidden group bg-white/5 border border-white/10"
         >
            <AnimatePresence mode="wait">
               <motion.img
                  key={currentIndex}
                  src={slideImages[currentIndex]}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`Slide ${currentIndex + 1}`}
               />
            </AnimatePresence>
            
            {/* Progress Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10 bg-black/50 px-5 py-3 rounded-full backdrop-blur-md border border-white/10">
                {slideImages.map((_, idx) => (
                    <button 
                        key={idx} 
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#f5a623] w-8' : 'bg-white/40 hover:bg-white w-2'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
         </motion.div>

      </div>
    </section>
  );
};

export default ImageSlideshow;
