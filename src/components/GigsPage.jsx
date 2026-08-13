import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import GigList from './GigList';
import BackToTop from './BackToTop';
import { motion } from 'framer-motion';

export default function GigsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 relative z-10">
        {/* Page Header */}
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-accent text-sm uppercase tracking-[0.3em] font-semibold mb-4 inline-block">
              // Premium Offerings
            </span>
            <h1 className="ac-display text-5xl md:text-7xl font-bold uppercase tracking-wide text-primary mb-6">
              Services & Gigs
            </h1>
            <p className="text-muted text-lg md:text-xl font-light leading-relaxed">
              Tailored high-impact solutions for brands, creators, and founders — from custom UI/UX design to motion graphics & AI automation.
            </p>
          </motion.div>
        </div>

        {/* Gig List Component */}
        <GigList />
      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
