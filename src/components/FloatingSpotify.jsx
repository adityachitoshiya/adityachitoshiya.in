import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ChevronDown, Music } from 'lucide-react';

const FloatingSpotify = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 flex flex-col items-end gap-4">
      
      {/* Expanded Spotify Player in Mirror Effect Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-[300px] sm:w-[350px] p-2 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
          >
            {/* Glossy reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-3xl" />
            
            <iframe 
              style={{ borderRadius: '20px' }} 
              src="https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M?utm_source=generator&theme=0" 
              width="100%" 
              height="152" 
              frameBorder="0" 
              allowFullScreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy"
              className="relative z-10"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Buttons */}
      <div className="flex items-center gap-3">
        <AnimatePresence>
          {isOpen && (
            <motion.button
              initial={{ opacity: 0, scale: 0, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0, x: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onClick={() => setIsOpen(false)}
              className="w-12 h-12 flex items-center justify-center rounded-full backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all shadow-lg"
            >
              <ChevronDown size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 flex items-center justify-center rounded-full transition-all duration-500 shadow-xl ${
            isOpen 
              ? "backdrop-blur-xl bg-accent text-background scale-90" 
              : "backdrop-blur-xl bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:scale-110"
          }`}
        >
          {isOpen ? <Music size={24} /> : <Play size={24} className="ml-1" />}
        </button>
      </div>

    </div>
  );
};

export default FloatingSpotify;
