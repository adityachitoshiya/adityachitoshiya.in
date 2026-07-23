import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut, RefreshCw, Loader2 } from 'lucide-react';

const ImageCropModal = ({ imageSrc, aspectRatio, outputWidth, outputHeight, frameLabel, onConfirm, onCancel }) => {
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const [imageSize, setImageSize] = useState({ width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image to get natural dimensions
  useEffect(() => {
    if (imageSrc) {
      const img = new Image();
      img.onload = () => {
        setImageSize({
          width: 0, // calculated later based on container
          height: 0,
          naturalWidth: img.width,
          naturalHeight: img.height,
        });
        resetCrop();
      };
      img.crossOrigin = 'anonymous'; // Added for CORS
      img.src = imageSrc;
    }
  }, [imageSrc]);

  const resetCrop = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    // Calculate new position
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleSave = () => {
    if (!imageRef.current || !containerRef.current || isProcessing) return;
    setIsProcessing(true);

    try {
      const containerRect = containerRef.current.getBoundingClientRect();
      const imageRect = imageRef.current.getBoundingClientRect();

      // Calculate how much the image is scaled relative to its natural size
      // The image fills the container using object-fit: contain/cover logic initially
      // We need the exact mapping from screen pixels to natural pixels
      
      const naturalScaleX = imageSize.naturalWidth / imageRect.width;
      const naturalScaleY = imageSize.naturalHeight / imageRect.height;
      
      // Calculate crop box coordinates relative to the image
      const cropX = (containerRect.left - imageRect.left) * naturalScaleX;
      const cropY = (containerRect.top - imageRect.top) * naturalScaleY;
      const cropWidth = containerRect.width * naturalScaleX;
      const cropHeight = containerRect.height * naturalScaleY;

      // Create an offscreen canvas with exact target output dimensions
      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.onload = () => {
        // Draw the cropped portion onto the canvas, scaling to target width/height
        ctx.drawImage(
          img,
          cropX, cropY, cropWidth, cropHeight, // Source Rect
          0, 0, outputWidth, outputHeight       // Dest Rect
        );

        canvas.toBlob((blob) => {
          setIsProcessing(false);
          onConfirm(blob);
        }, 'image/webp', 0.95);
      };
      img.crossOrigin = 'anonymous'; // Added for CORS
      img.src = imageSrc;
    } catch (e) {
      console.error(e);
      alert('Failed to crop image.');
      setIsProcessing(false);
    }
  };

  // Fixed container size to visualize aspect ratio. It limits max width/height.
  const maxWidth = Math.min(window.innerWidth * 0.9, 800);
  const maxHeight = Math.min(window.innerHeight * 0.6, 600);
  
  let frameWidth = maxWidth;
  let frameHeight = frameWidth / aspectRatio;

  if (frameHeight > maxHeight) {
    frameHeight = maxHeight;
    frameWidth = frameHeight * aspectRatio;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <div>
              <h3 className="text-xl font-heading text-accent uppercase tracking-wider">Crop Image</h3>
              <p className="text-muted text-xs uppercase tracking-widest">{frameLabel} — {outputWidth} × {outputHeight}px</p>
            </div>
            <button onClick={onCancel} className="text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
              <X size={20} />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative w-full bg-black flex items-center justify-center overflow-hidden" style={{ height: '60vh' }}>
            
            {/* The crop frame window */}
            <div 
              ref={containerRef}
              className="relative z-10 border-2 border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.7)] pointer-events-none"
              style={{
                width: frameWidth,
                height: frameHeight,
              }}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-30">
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-r border-b border-white"></div>
                <div className="border-b border-white"></div>
                <div className="border-r border-white"></div>
                <div className="border-r border-white"></div>
                <div></div>
              </div>
            </div>

            {/* The draggable, scalable image */}
            <div 
              className="absolute inset-0 flex items-center justify-center"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop source"
                crossOrigin="anonymous"
                draggable={false}
                className="max-w-none origin-center cursor-move select-none"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  minWidth: frameWidth,   // ensure it at least covers the frame initially
                  minHeight: frameHeight,
                  objectFit: 'cover'
                }}
              />
            </div>

          </div>

          {/* Controls & Actions */}
          <div className="p-6 bg-[#1a1a1a] flex flex-col md:flex-row items-center gap-6 justify-between border-t border-white/10">
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <ZoomOut size={20} className="text-muted" />
              <input
                type="range"
                value={scale}
                min={0.5}
                max={4}
                step={0.05}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-accent"
              />
              <ZoomIn size={20} className="text-muted" />
              
              <button onClick={resetCrop} className="ml-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors" title="Reset">
                <RefreshCw size={16} />
              </button>
            </div>

            <div className="flex gap-4 w-full md:w-auto justify-end">
              <button
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors flex-1 md:flex-none text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-accent text-black font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none disabled:opacity-50 disabled:hover:scale-100 text-sm"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={18} /> : <Check size={18} />}
                {isProcessing ? 'Processing...' : 'Apply Crop'}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropModal;
