import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import SimpleFooter from '../components/SimpleFooter';
import BackToTop from '../components/BackToTop';
import Contact from '../components/Contact';

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-white font-body relative overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12 relative z-10">
        <Contact />
      </main>

      <SimpleFooter />
      <BackToTop />
    </div>
  );
}
