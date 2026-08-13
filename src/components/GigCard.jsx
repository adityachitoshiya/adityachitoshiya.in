import React from 'react';
import { motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const GigCard = ({ gig, index }) => {
  const { portfolioData } = usePortfolio();
  const name = portfolioData?.global?.name || 'Aditya C.';

  const handleGigClick = () => {
    // Scroll smoothly to the top of the contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-[#111111] rounded-xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 hover:-translate-y-1 shadow-lg cursor-pointer"
      onClick={handleGigClick}
    >
      {/* Gig Image/Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-[#1a1a1a]">
        <img
          src={gig.image}
          alt={gig.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="bg-accent text-background px-4 py-2 rounded-full font-bold uppercase tracking-wider text-xs shadow-xl">
            Request Quote
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Seller Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-accent/20 border border-accent/30 flex items-center justify-center">
            {portfolioData?.hero?.heroImage ? (
              <img src={portfolioData.hero.heroImage} alt={name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-accent font-bold text-sm">AC</span>
            )}
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{name}</p>
            <p className="text-white/50 text-xs">Level 2 Seller</p>
          </div>
        </div>

        {/* Gig Title */}
        <h3 className="text-white/90 font-medium text-lg leading-snug mb-3 group-hover:text-accent transition-colors line-clamp-2">
          {gig.title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-auto mb-4">
          <Star className="w-4 h-4 fill-accent text-accent" />
          <span className="text-accent font-bold text-sm">{gig.rating}</span>
          <span className="text-white/40 text-sm">({gig.reviews})</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button 
            className="text-white/40 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the card click
              // Add a heart animation here if desired
            }}
          >
            <Heart className="w-5 h-5" />
          </button>
          
          <div className="flex flex-col items-end">
            <span className="text-white/50 text-[10px] uppercase font-bold tracking-wider">Starting At</span>
            <span className="text-white font-bold text-xl">${gig.price}</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default GigCard;
