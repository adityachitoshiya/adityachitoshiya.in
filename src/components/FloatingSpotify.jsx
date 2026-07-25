import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ChevronUp, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const FloatingSpotify = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [playerController, setPlayerController] = useState(null);
  const [isMobileHidden, setIsMobileHidden] = useState(true);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById('spotify-iframe');
      const options = {
        uri: 'spotify:playlist:37i9dQZF1DXcBWIGoYBM5M',
        width: '100%',
        height: '152',
        theme: '0'
      };
      const callback = (EmbedController) => {
        setPlayerController(EmbedController);
        EmbedController.addListener('playback_update', e => {
          setIsPlaying(!e.data.isPaused);
          if (!e.data.isPaused && !hasStarted) {
            setHasStarted(true);
          }
        });
      };
      IFrameAPI.createController(element, options, callback);
    };

    if (!window.SpotifyIframeApiInit) {
      const script = document.createElement('script');
      script.src = "https://open.spotify.com/embed/iframe-api/v1";
      script.async = true;
      document.body.appendChild(script);
      window.SpotifyIframeApiInit = true;
    }
  }, []);

  const togglePlay = () => {
    if (playerController) {
      playerController.togglePlay();
      if (!hasStarted) {
        setHasStarted(true);
      }
    }
  };

  const handleSearchClick = () => {
    window.dispatchEvent(new Event('openSearch'));
  };

  const handleToggleHide = () => {
    const nextHidden = !isMobileHidden;
    setIsMobileHidden(nextHidden);
    if (nextHidden) {
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-0 md:bottom-10 md:right-auto md:left-14 z-50 flex flex-col items-end md:items-start gap-4 pointer-events-none">
      
      {/* Expanded Spotify Player in Mirror Effect Container */}
      <motion.div
        initial={false}
        animate={isOpen ? 
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", pointerEvents: "auto" } : 
          { opacity: 0, y: 40, scale: 0.8, filter: "blur(10px)", pointerEvents: "none" }
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-[calc(100vw-48px)] max-w-[350px] p-2 rounded-3xl backdrop-blur-2xl bg-white/5 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden origin-bottom-right md:origin-bottom-left mr-6 md:mr-0"
      >
        {/* Glossy reflection highlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-3xl" />
        
        <div id="spotify-iframe" className="relative z-10" style={{ borderRadius: '20px', overflow: 'hidden' }}></div>
      </motion.div>

      {/* Control Buttons Container */}
      <div 
        className={`pointer-events-auto flex items-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:translate-x-0 ${isMobileHidden ? 'translate-x-[calc(100%-28px)]' : 'translate-x-0'} bg-white/10 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none rounded-l-2xl md:rounded-none border border-white/20 md:border-none border-r-0 md:border-transparent shadow-[0_0_15px_rgba(0,0,0,0.5)] md:shadow-none`}
      >
        {/* Mobile Toggle Handle */}
        <button
          onClick={handleToggleHide}
          className="md:hidden flex items-center justify-center w-[28px] h-full min-h-[52px] text-white/80 hover:text-white transition-colors outline-none"
          aria-label="Toggle Controls"
        >
          {isMobileHidden ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>

        {/* Buttons Panel */}
        <div className="flex items-center gap-3 py-2 pr-4 pl-1 md:p-0 md:pr-0 md:pl-0">
          
          {/* Button 1: Search Button */}
          <button
            onClick={handleSearchClick}
            className="w-[34px] h-[34px] rounded-full bg-accent flex items-center justify-center text-background hover:scale-110 transition-transform shadow-lg"
            aria-label="Open Search"
          >
            <Search size={16} strokeWidth={2.5} />
          </button>

          {/* Button 2: Play/Pause with Outer Ring */}
          <button
            onClick={togglePlay}
            className="w-[42px] h-[42px] rounded-full border-2 border-accent p-[2px] flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
            aria-label="Play or Pause Spotify"
          >
            <div className="w-full h-full rounded-full bg-accent flex items-center justify-center text-background">
              {isPlaying ? (
                <Pause size={14} fill="currentColor" />
              ) : (
                <Play size={14} fill="currentColor" className="ml-[2px]" />
              )}
            </div>
          </button>

          {/* Button 3: Toggle Widget (Mirror Effect with ^) */}
          <AnimatePresence>
            {(hasStarted || isPlaying) && (
              <motion.button
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/20 hover:scale-110 transition-transform shadow-lg"
                aria-label="Toggle Spotify Player"
              >
                {isOpen ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
              </motion.button>
            )}
          </AnimatePresence>
          
        </div>
      </div>
      
    </div>
  );
};

export default FloatingSpotify;
