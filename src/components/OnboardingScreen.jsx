import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Lock, Sparkles, Check, ExternalLink, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const OnboardingScreen = ({ global = {} }) => {
  const [copied, setCopied] = useState(false);
  const email = global.email || 'adityachitoshiya12@gmail.com';
  const phone = global.phone || '+91 77270 88810';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a0a0a] text-white flex flex-col justify-between items-center px-6 py-12 relative overflow-hidden font-sans selection:bg-[#f5a623] selection:text-black">
      
      {/* Glowing background ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f5a623]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-white/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <header className="w-full max-w-5xl flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-heading text-lg font-bold text-[#f5a623]">
            AC
          </div>
          <div>
            <span className="font-heading tracking-wider uppercase font-bold text-sm block">ADITYA CHITOSHIYA</span>
            <span className="text-xs text-white/50 font-mono">Creative Director & Developer</span>
          </div>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-mono font-medium text-amber-400 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>DATA ONBOARDING IN PROGRESS</span>
        </div>
      </header>

      {/* Center Content */}
      <main className="max-w-3xl text-center my-auto py-12 relative z-10 flex flex-col items-center">
        
        {/* Subtitle Pill */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#f5a623]/15 border border-[#f5a623]/30 text-[#f5a623] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
        >
          <Sparkles size={14} /> System Maintenance & Updates
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-heading uppercase tracking-tight font-extrabold text-white leading-[1.08] mb-6"
        >
          WE'RE ONBOARDING <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f5a623] via-amber-200 to-white">
            FRESH CREATIVE WORK
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-white/70 text-base sm:text-xl font-light leading-relaxed max-w-2xl mb-10"
        >
          Our live portfolio domain is currently undergoing data onboarding with fresh brand campaigns, motion storytelling reels, and AI projects. We apologize for the temporary inconvenience!
        </motion.p>

        {/* Action Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-left">
            <span className="text-xs uppercase tracking-wider text-white/40 font-bold block mb-1">Direct Inquiries & Project Bookings</span>
            <p className="text-white font-medium text-lg">{email}</p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full sm:w-auto">
            <a
              href={`mailto:${email}`}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#f5a623] hover:bg-amber-400 text-black font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-[#f5a623]/20"
            >
              <Mail size={16} /> Send Email
            </a>
            
            <button
              onClick={handleCopyEmail}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3.5 rounded-xl border border-white/15 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check size={16} className="text-green-400" /> Copied!
                </>
              ) : (
                'Copy Email'
              )}
            </button>
          </div>
        </motion.div>

        {/* Phone & Direct Info */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-white/50 font-mono"
        >
          <a href={`tel:${phone}`} className="hover:text-[#f5a623] transition-colors flex items-center gap-1.5">
            <Phone size={13} /> {phone}
          </a>
          <span>•</span>
          <span>Jaipur & Remote Worldwide</span>
        </motion.div>

      </main>

      {/* Footer / Secret Admin Login link */}
      <footer className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-white/10 pt-6 text-xs text-white/40 relative z-10">
        <p>© {new Date().getFullYear()} Aditya Chitoshiya. All rights reserved.</p>
        
        <div className="flex items-center gap-4">
          <Link 
            to="/admin" 
            className="hover:text-white/80 transition-colors flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 text-white/60"
          >
            <Lock size={12} /> Admin Login & Preview
          </Link>
        </div>
      </footer>

    </div>
  );
};

export default OnboardingScreen;
