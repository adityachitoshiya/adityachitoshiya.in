import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import CurrentFocus from '../components/CurrentFocus';
import ImageSlideshow from '../components/ImageSlideshow';
import Magnetic from '../components/Magnetic';
export default function AboutPage() {
  const { portfolioData } = usePortfolio();
  const { aboutMe, global } = portfolioData;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skills = [
    'Brand Identity', 'Motion Graphics', 'UI/UX Design', 'Video Editing', 
    'Post Production', '3D Design', 'Thumbnails', 'Generative AI'
  ];

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body relative overflow-hidden">
      <Navbar />

      <main className="pt-32 pb-20 relative z-10">
        
        {/* Intro Section */}
        <section className="px-6 md:px-14 mb-20 max-w-[1440px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
                data-fade-up
            >
                <div>
                    <h1 className="font-heading text-[12vw] leading-none tracking-tighter text-primary uppercase select-none drop-shadow-2xl mb-2">
                        ABOUT ME
                    </h1>
                    <p className="text-[#f5a623] ac-script text-3xl">Curriculum Vitae</p>
                </div>
                
                {/* Dummy Download CV button */}
                <Magnetic strength={20}>
                    <button onClick={() => alert('Add your PDF link here in the future!')} className="flex items-center gap-2 bg-[#f5a623] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors ac-body text-sm mb-4 md:mb-8">
                        <Download size={18} />
                        Download CV
                    </button>
                </Magnetic>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center" data-fade-up>
                <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="lg:col-span-5 w-full h-[500px] md:h-[600px] relative rounded-3xl overflow-hidden"
                >
                    <img 
                        src={aboutMe.image} 
                        alt="Aditya Chitoshiya" 
                        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                    />
                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none"></div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="lg:col-span-7"
                >
                    <h2 className="text-3xl md:text-4xl font-heading uppercase tracking-wider mb-6 text-[#f5a623]">
                        {aboutMe.headline}
                    </h2>
                    <p className="text-white/70 text-lg leading-relaxed mb-8 ac-body">
                        {aboutMe.text}
                    </p>
                    
                    {/* Skills Tags */}
                    <div>
                        <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 font-semibold">Core Expertise</h3>
                        <div className="flex flex-wrap gap-3">
                            {skills.map((skill, idx) => (
                                <span key={idx} className="px-4 py-2 border border-white/20 rounded-full text-sm ac-body text-white/80 hover:border-[#f5a623] hover:text-[#f5a623] transition-colors cursor-default">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* What I Do Currently Section via Component */}
        <CurrentFocus />

        {/* Slideshow Gallery */}
        <ImageSlideshow />

      </main>

      <Footer />
      <BackToTop />
    </div>
  );
}
