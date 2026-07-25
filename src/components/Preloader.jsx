import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress over 2.5 seconds
    const duration = 2000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(newProgress);

      if (currentStep >= steps) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300); // Small pause at 100% before firing complete
      }
    }, intervalTime);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0a0a0a]"
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-[300px] px-6">
        
        {/* Game Style Text */}
        <div className="w-full flex justify-between items-end text-[#f5a623] ac-display tracking-widest text-2xl md:text-3xl">
          <span className="uppercase animate-pulse">Loading_</span>
          <span>{progress}%</span>
        </div>

        {/* Loading Bar Container */}
        <div className="w-full h-3 md:h-4 bg-white/10 rounded-full overflow-hidden border border-white/20 p-[2px]">
          {/* Inner Loading Fill */}
          <motion.div 
            className="h-full bg-[#f5a623] rounded-full relative"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          >
            {/* Glossy overlay on loading bar for game feel */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent"></div>
          </motion.div>
        </div>

        {/* Pixel style hint text */}
        <p className="text-white/40 text-xs md:text-sm ac-body tracking-wider uppercase mt-4 animate-pulse">
          INITIALIZING ASSETS...
        </p>
      </div>
    </motion.div>
  );
};

export default Preloader;
