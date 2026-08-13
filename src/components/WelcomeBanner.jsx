import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import Button from './Button';

const isVideo = (url) => {
  if (typeof url !== 'string' || !url) return false;
  return (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) ||
    url.includes('/video/upload/') ||
    url.startsWith('data:video/')
  );
};

const WelcomeBanner = () => {
  const { portfolioData } = usePortfolio();
  const welcome = portfolioData?.welcome || {};

  // Support welcome.mediaItems array if available, or fall back to image1 & image2
  const rawItems = Array.isArray(welcome.mediaItems) && welcome.mediaItems.length > 0
    ? welcome.mediaItems
    : [welcome.image1, welcome.image2];

  const slides = rawItems.filter(Boolean);
  const displaySlides = slides.length > 0 ? slides : ['/ai-images/welcome_1_1784234605245.png'];

  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMedia = displaySlides[currentIndex] || displaySlides[0];

  return (
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        {/* Left Column - Text */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <span className="text-accent text-xs md:text-sm uppercase tracking-[0.3em] font-semibold mb-4 inline-block">
            // Brand Overview
          </span>
          <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] uppercase text-primary">
            {welcome.headline ? (
              welcome.headline.split(' ').map((word, i, arr) => (
                <React.Fragment key={i}>
                  {i === arr.length - 1 ? <span className="text-accent">{word}</span> : word}
                  {i !== arr.length - 1 && ' '}
                </React.Fragment>
              ))
            ) : (
              <>WELCOME TO MY <span className="text-accent">BRAND</span></>
            )}
          </h2>
          <p data-text-highlight className="text-muted text-lg md:text-xl leading-relaxed mb-10 font-light">
            {welcome.introText}
          </p>
          <a href="/about"><Button>Learn More</Button></a>
        </motion.div>

        {/* Right Column - 1:1 Aspect Ratio Media Container (Video & Image Support) */}
        <div className="w-full flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[550px] aspect-square rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-white/5 group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full aspect-square relative"
              >
                {isVideo(currentMedia) ? (
                  <video
                    src={currentMedia}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover rounded-[32px] aspect-square"
                  />
                ) : (
                  <img 
                    src={currentMedia} 
                    alt={`Welcome Banner Slide ${currentIndex + 1}`} 
                    className="w-full h-full object-cover rounded-[32px] aspect-square"
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls (If > 1 slide) */}
            {displaySlides.length > 1 && (
              <div className="absolute inset-x-0 bottom-6 px-6 flex justify-between items-center z-20">
                {/* Slide Indicator Dots */}
                <div className="flex gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                  {displaySlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-accent' : 'w-2 bg-white/40'}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrows */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev - 1 + displaySlides.length) % displaySlides.length)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-colors"
                    aria-label="Previous Media"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % displaySlides.length)}
                    className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-accent hover:text-black hover:border-accent transition-colors"
                    aria-label="Next Media"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Slide Count Badge */}
            {displaySlides.length > 1 && (
              <div className="absolute top-6 right-6 z-20 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/80 font-mono">
                0{currentIndex + 1} / 0{displaySlides.length}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default WelcomeBanner;
