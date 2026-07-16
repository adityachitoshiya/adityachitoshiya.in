import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, Phone, User } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

const Contact = () => {
  const { portfolioData } = usePortfolio();
  const { contact, global } = portfolioData;

  const contactMethods = [
    { icon: <Mail />, label: "Email", value: global.email },
    { icon: <User />, label: "Social Media", value: global.social },
    { icon: <Globe />, label: "Website", value: global.website },
    { icon: <Phone />, label: "Phone Number", value: global.phone },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 w-full bg-background border-t border-white/5">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column - Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="font-heading text-5xl md:text-7xl mb-8 leading-[0.9] uppercase text-primary">
            {contact.headline}
          </h2>
          <p className="text-muted text-lg md:text-xl leading-relaxed mb-12 font-light">
            {contact.text}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
             {contactMethods.map((method, idx) => (
                <div key={idx} className="flex flex-col gap-3 group">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-background group-hover:scale-110 transition-transform">
                        {method.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-primary mb-1 uppercase tracking-wider text-sm">{method.label}</h4>
                        <p className="text-muted">{method.value}</p>
                    </div>
                </div>
             ))}
          </div>
        </motion.div>

        {/* Right Column - Large Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full h-[500px] md:h-[700px]"
        >
          <img 
            src={contact.image} 
            alt="Contact Portrait" 
            className="w-full h-full object-cover rounded-[32px] grayscale hover:grayscale-0 transition-all duration-500"
          />
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
