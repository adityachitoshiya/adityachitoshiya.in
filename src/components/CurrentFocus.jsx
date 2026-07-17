import React from 'react';
import { motion } from 'framer-motion';

const CurrentFocus = () => {
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
    <section className="py-24 md:py-32 w-full bg-background border-t border-white/5 relative z-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
            <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-heading text-6xl md:text-8xl mb-20 leading-[0.9] uppercase text-primary"
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
                        <h3 className="text-accent font-heading text-3xl tracking-wide mb-4 uppercase">{item.title}</h3>
                        <p className="text-white/70 ac-body text-base leading-relaxed">{item.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default CurrentFocus;
