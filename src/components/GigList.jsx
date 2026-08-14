import React from 'react';
import { motion } from 'framer-motion';
import GigCard from './GigCard';
import { usePortfolio } from '../context/PortfolioContext';

const defaultGigs = [
  {
    id: 1,
    title: "I will design a premium brand identity and logo for your business",
    price: 150,
    rating: 5.0,
    reviews: 24,
    image: "/ai-images/gallery_1_1784234838549.png",
  },
  {
    id: 2,
    title: "I will design a modern UI/UX website or mobile app",
    price: 200,
    rating: 4.9,
    reviews: 18,
    image: "/ai-images/gallery_2_1784234862332.png",
  },
  {
    id: 3,
    title: "I will create a dynamic motion graphics promo video",
    price: 100,
    rating: 5.0,
    reviews: 32,
    image: "/ai-images/gallery_3_1784234882940.png",
  }
];

const GigList = () => {
  const { portfolioData } = usePortfolio();
  const gigs = portfolioData?.gigs && portfolioData.gigs.length > 0 ? portfolioData.gigs : defaultGigs;

  return (
    <section className="w-full pb-24 md:pb-32 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h2 className="font-heading text-4xl md:text-5xl uppercase text-primary mb-2">
              Available Services
            </h2>
            <p className="text-muted text-lg font-light">
              Ready-to-go packages tailored for your brand's success.
            </p>
          </div>
          
          {/* Filter/Sort Dropdown Mock */}
          <div className="flex items-center gap-2 text-sm text-white/60 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <span>Sort by:</span>
            <span className="font-bold text-white">Recommended</span>
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </motion.div>

        {/* Gigs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {gigs.map((gig, index) => (
            <GigCard key={gig.id || index} gig={gig} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default GigList;
