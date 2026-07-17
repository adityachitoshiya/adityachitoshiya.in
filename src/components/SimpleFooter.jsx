import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const SimpleFooter = () => {
  const { portfolioData } = usePortfolio();
  const { global } = portfolioData;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background py-10 border-t border-white/10 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4">
        
        {/* Brand Name / Copyright */}
        <div className="text-white/60 text-sm ac-body font-medium">
          © {currentYear} {global.name}. All rights reserved.
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {global.social && (
            <a 
              href={`https://${global.social.replace('@', '')}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white/60 hover:text-accent transition-colors ac-body text-sm font-medium"
            >
              {global.social}
            </a>
          )}
          {global.website && (
            <a 
              href={`https://${global.website}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-white/60 hover:text-accent transition-colors ac-body text-sm font-medium"
            >
              {global.website.replace('https://', '')}
            </a>
          )}
          {global.email && (
            <a 
              href={`mailto:${global.email}`} 
              className="text-white/60 hover:text-accent transition-colors ac-body text-sm font-medium"
            >
              Email
            </a>
          )}
        </div>

      </div>
    </footer>
  );
};

export default SimpleFooter;
