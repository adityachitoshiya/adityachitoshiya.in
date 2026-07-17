import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import SimpleFooter from '../components/SimpleFooter';
import BackToTop from '../components/BackToTop';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
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

  const currentFocusItems = [
    { title: "Product Design", desc: "Crafting intuitive product designs tailored for new startups and emerging brands." },
    { title: "Brand Guidelines", desc: "Developing cohesive and impactful brand identity and guideline designs." },
    { title: "Typography Making", desc: "Designing custom typography and expressive letterforms." },
    { title: "Influencer Marketing", desc: "Managing influencer campaigns and handling celebrity communications." },
    { title: "Film & Short Movies", desc: "Contributing to creative direction and production in filmmaking." },
    { title: "Storytelling", desc: "Weaving compelling narratives that connect brands with their audiences." },
    { title: "Content Writing", desc: "Drafting engaging, purposeful copy across digital platforms." }
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
            >
                <div>
                    <h1 className="ac-display text-5xl md:text-7xl lg:text-8xl mb-4 text-white tracking-wider">
                        ABOUT ME
                    </h1>
                    <p className="text-[#f5a623] ac-script text-3xl">Curriculum Vitae</p>
                </div>
                
                {/* Dummy Download CV button - can be hooked up to a real PDF later */}
                <button onClick={() => alert('Add your PDF link here in the future!')} className="flex items-center gap-2 bg-[#f5a623] text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-white transition-colors ac-body text-sm">
                    <Download size={18} />
                    Download CV
                </button>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
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

        {/* What I Do Currently Section */}
        <section className="px-6 md:px-14 mb-20 max-w-[1440px] mx-auto border-t border-white/10 pt-20 mt-20">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-heading uppercase tracking-wider mb-12 text-white"
            >
                What I Do Currently
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentFocusItems.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-white/30 transition-colors"
                    >
                        <h3 className="text-[#f5a623] font-heading text-2xl tracking-wide mb-4 uppercase">{item.title}</h3>
                        <p className="text-white/70 ac-body text-sm leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </section>

      </main>

      <SimpleFooter />
      <BackToTop />
    </div>
  );
}
