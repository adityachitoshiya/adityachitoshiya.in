import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

const ThemeProvider = ({ children }) => {
  const { portfolioData } = usePortfolio();
  
  if (!portfolioData) return <>{children}</>;

  const theme = portfolioData.global?.theme || {};
  
  // Provide sensible defaults if not set in DB yet
  const colors = {
    background: theme.colors?.background || '#0A0A0A',
    primary: theme.colors?.primary || '#FFFFFF',
    muted: theme.colors?.muted || '#B3B3B3',
    accent: theme.colors?.accent || '#F5A623',
  };

  const fonts = {
    heading: theme.fonts?.heading || 'Anton',
    body: theme.fonts?.body || 'Inter',
    script: theme.fonts?.script || 'Dancing Script',
  };

  return (
    <>
      <style>{`
        :root {
          --color-background: ${colors.background};
          --color-primary: ${colors.primary};
          --color-muted: ${colors.muted};
          --color-accent: ${colors.accent};
          
          --font-heading: '${fonts.heading}', sans-serif;
          --font-body: '${fonts.body}', sans-serif;
          --font-script: '${fonts.script}', cursive;
        }
      `}</style>
      {children}
    </>
  );
};

export default ThemeProvider;
