import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';
import { getCroppedImg } from '../utils/cropImage';

const ImageCropper = ({ imageSrc, onSave, onCancel, aspect = null }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || isProcessing) return;
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedBlob);
    } catch (e) {
      console.error(e);
      alert('Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!imageSrc) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 md:p-8"
      >
        <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-white/10">
            <h3 className="text-xl font-heading text-accent uppercase tracking-wider">Crop Image</h3>
            <button onClick={onCancel} className="text-muted hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
              <X size={20} />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative w-full h-[50vh] md:h-[60vh] bg-black">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect} // e.g. 16/9, 1 (for 1:1), or null for free crop
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          {/* Controls & Actions */}
          <div className="p-6 bg-[#1a1a1a] flex flex-col md:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <ZoomOut size={20} className="text-muted" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => {
                  setZoom(e.target.value);
                }}
                className="w-full accent-accent"
              />
              <ZoomIn size={20} className="text-muted" />
            </div>

            <div className="flex gap-4 w-full md:w-auto justify-end">
              <button
                onClick={onCancel}
                className="px-6 py-3 rounded-xl border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/5 transition-colors flex-1 md:flex-none"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isProcessing}
                className="px-6 py-3 rounded-xl bg-accent text-black font-bold uppercase tracking-wider hover:scale-105 transition-all flex items-center justify-center gap-2 flex-1 md:flex-none disabled:opacity-50 disabled:hover:scale-100"
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    <Check size={18} /> Apply Crop
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageCropper;
