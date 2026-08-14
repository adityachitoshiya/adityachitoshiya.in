import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

import MediaRenderer from './MediaRenderer';

const defaultSlideshowImages = [
  {
    url: "/ai-images/gallery_1_1784234838549.png",
    title: "Creative Studio & Motion Design",
    caption: "Visual Storytelling"
  },
  {
    url: "/ai-images/gallery_2_1784234862332.png",
    title: "Brand Identity & Product Design",
    caption: "UI/UX & Systems"
  },
  {
    url: "/ai-images/gallery_3_1784234882940.png",
    title: "AI & Future Tech Exploration",
    caption: "Automations & Code"
  }
];

const ImageSlideshow = () => {
  const { portfolioData } = usePortfolio();
  
  const adminSlideshowImages = portfolioData?.aboutMe?.slideshowImages || [];
  const projects = portfolioData?.projectPortfolio?.projects || [];
  const galleryImages = portfolioData?.projectPortfolio?.images || [];

  const normalizedAdmin = adminSlideshowImages.map(item => 
    typeof item === 'string' ? { url: item, title: '', caption: '' } : item
  );

  const normalizedProjects = projects.filter(p => p.coverImage || p.image).map(p => ({
    url: p.coverImage || p.image,
    title: p.name || p.title || '',
    caption: p.type || p.category || ''
  }));

  const normalizedGallery = galleryImages.map(item => 
    typeof item === 'string' ? { url: item, title: '', caption: '' } : item
  );

  // Combine custom admin slides with project portfolio candidates (Suniel Shetty, etc.)
  const allCandidates = [
    ...normalizedAdmin,
    ...normalizedProjects,
    ...normalizedGallery,
    ...defaultSlideshowImages
  ];

  const seenUrls = new Set();
  const slideImages = allCandidates.filter(item => {
    if (!item || !item.url) return false;
    if (seenUrls.has(item.url)) return false;
    seenUrls.add(item.url);
    return true;
  });

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

  const currentSlide = slideImages[currentIndex];

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
               <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-full h-full"
               >
                  <MediaRenderer
                     src={currentSlide.url}
                     className="w-full h-full object-cover"
                     alt={currentSlide.title || `Slide ${currentIndex + 1}`}
                  />
                  
                  {/* Overlay for title and caption */}
                  {(currentSlide.title || currentSlide.caption) && (
                     <div className="absolute inset-x-0 bottom-0 pt-32 pb-24 px-8 md:px-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                        <div>
                           {currentSlide.title && (
                              <h3 className="text-3xl md:text-5xl font-heading uppercase text-white tracking-widest mb-2 drop-shadow-md">
                                 {currentSlide.title}
                              </h3>
                           )}
                           {currentSlide.caption && (
                              <p className="text-[#f5a623] text-sm md:text-base font-bold tracking-widest uppercase drop-shadow-md">
                                 {currentSlide.caption}
                              </p>
                           )}
                        </div>
                     </div>
                  )}
               </motion.div>
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
