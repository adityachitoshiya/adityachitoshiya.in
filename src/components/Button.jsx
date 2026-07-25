import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Button = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group flex items-center justify-between backdrop-blur-xl bg-white/10 border border-white/20 text-white uppercase font-bold text-sm tracking-wider pl-6 pr-2 py-2 rounded-full hover:bg-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all ${className}`}
    >
      <span className="mr-4">{children}</span>
      <div className="bg-white/20 rounded-full p-2 group-hover:translate-x-1 transition-transform">
        <ArrowRight size={16} className="text-white" />
      </div>
    </motion.button>
  );
};

export default Button;
