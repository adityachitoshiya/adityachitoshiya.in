import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

const defaultBrands = [
  { name: "REGRIP", logo: "" },
  { name: "BIEDX (SINGAPORE)", logo: "" },
  { name: "MITTSURE TECHNOLOGY", logo: "" },
  { name: "SUNIEL SHETTY", logo: "" },
  { name: "DHRUV RATHEE", logo: "" },
  { name: "GETSETFLY", logo: "" },
  { name: "THINK TRAIL", logo: "" },
  { name: "LUMALEARN", logo: "" },
  { name: "PINAKA", logo: "" },
  { name: "ANAND ICE", logo: "" }
];

const BrandMarquee = () => {
  const { portfolioData } = usePortfolio();

  // Custom brands array uploaded/edited via Admin (or fallback to defaults)
  const adminBrands = portfolioData?.brands || [];
  
  const rawBrandsList = adminBrands.length > 0 ? adminBrands : defaultBrands;

  // Normalize array items into objects { name, logo }
  const normalizedBrands = rawBrandsList.map(item => {
    if (typeof item === 'string') {
      return { name: item, logo: '' };
    }
    return { name: item?.name || item?.title || '', logo: item?.logo || item?.image || '' };
  });

  // Duplicate for smooth seamless looping
  const duplicatedBrands = [
    ...normalizedBrands,
    ...normalizedBrands,
    ...normalizedBrands,
    ...normalizedBrands
  ];

  return (
    <div className="w-full py-6 bg-black/60 border-y border-white/10 backdrop-blur-md overflow-hidden relative z-30 my-8">
      {/* Subtle Gradient Overlays for smooth edge fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />

      {/* Infinite Auto Scroll Container */}
      <motion.div
        className="flex whitespace-nowrap gap-12 items-center cursor-pointer"
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 30,
        }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {duplicatedBrands.map((brand, index) => (
          <div key={index} className="flex items-center gap-12 group">
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name || `Brand ${index}`}
                className="h-8 md:h-12 w-auto max-w-[160px] object-contain opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300 filter brightness-110"
              />
            ) : (
              <span className="font-heading text-xl md:text-2xl uppercase tracking-[0.2em] text-white/50 group-hover:text-[#f5a623] transition-colors duration-300 font-bold">
                {brand.name}
              </span>
            )}
            <span className="text-[#f5a623]/60 text-sm">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default BrandMarquee;
