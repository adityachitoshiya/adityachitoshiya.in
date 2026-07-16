import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Button = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, filter: 'brightness(1.1)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`group flex items-center justify-between bg-accent text-background uppercase font-bold text-sm tracking-wider pl-6 pr-2 py-2 rounded-full transition-all ${className}`}
    >
      <span className="mr-4">{children}</span>
      <div className="bg-background rounded-full p-2 group-hover:translate-x-1 transition-transform">
        <ArrowRight size={16} className="text-primary" />
      </div>
    </motion.button>
  );
};

export default Button;
