import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Hero from './components/Hero';
import WelcomeBanner from './components/WelcomeBanner';
import Introduction from './components/Introduction';
import AboutMe from './components/AboutMe';
import CurrentFocus from './components/CurrentFocus';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import ProjectGallery from './components/ProjectGallery';
import LatestProject from './components/LatestProject';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ThemeProvider from './components/ThemeProvider';
import { initHeroParallax, initTextHighlight, initFadeUp, initStaggerList } from './components/gsapAnimations';
import FloatingSpotify from './components/FloatingSpotify';
import Preloader from './components/Preloader';
import SearchOverlay from './components/SearchOverlay';
import Navbar from './components/Navbar';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Admin from './pages/Admin';
import CreativesPage from './pages/CreativesPage';
import ProjectDetail from './pages/ProjectDetail';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

const CreativesRoute = () => {
  const { portfolioData } = usePortfolio();
  const navigate = useNavigate();
  if (!portfolioData) return null;
  return (
    <CreativesPage
      projects={portfolioData.projectPortfolio?.projects || []}
      global={portfolioData.global}
      onSelectProject={(p) => navigate(`/work/${p.slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
    />
  );
};

const ProjectRoute = () => {
  const { portfolioData } = usePortfolio();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  if (!portfolioData) return null;

  const projects = portfolioData.projectPortfolio?.projects || [];
  const project = projects.find(p => 
    p.slug === slug || 
    p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug
  );

  if (!project) {
    return <Navigate to="/creatives" replace />;
  }

  return (
    <ProjectDetail
      project={project}
      allProjects={projects}
      global={portfolioData.global}
      onBack={() => navigate('/creatives')}
      onSelectProject={(p) => navigate(`/work/${p.slug || p.name?.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
    />
  );
};

const useMultiRef = () => {
  const elements = useRef([]);
  const callbackRef = useRef((el) => {
    if (el && !elements.current.includes(el)) {
      elements.current.push(el);
    }
  });
  // Always expose the live array via .current
  Object.defineProperty(callbackRef.current, 'current', {
    get: () => elements.current,
    configurable: true,
  });
  return callbackRef.current;
};

const Portfolio = () => {
  const heroRef = useRef(null);
  const welcomeRef = useRef(null);
  
  const photoRefs = useMultiRef();
  const headlineRefs = useMultiRef();
  const accentRefs = useMultiRef();

  useEffect(() => {
    const ctx = initHeroParallax(
      {
        heroRef,
        nextSectionRef: welcomeRef,
        layers: [
          { ref: photoRefs, speed: 0.3 },              
          { ref: headlineRefs, speed: 0.6, fade: true }, 
          { ref: accentRefs, speed: 1, fade: true },     
        ],
      },
      window.innerHeight
    );
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <div ref={heroRef}>
          <Hero 
            photoRef={photoRefs} 
            headlineRef={headlineRefs} 
            accentRef={accentRefs} 
          />
        </div>
        <div ref={welcomeRef} style={{ background: '#0a0a0a', position: 'relative', zIndex: 30 }}>
          <WelcomeBanner />
          <Introduction />
          <AboutMe />
          <CurrentFocus />
          <WorkExperience />
          <Education />
          <ProjectGallery />
          <LatestProject />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

const ScrollEffectsRunner = () => {
  const location = useLocation();

  useEffect(() => {
    let ctx;
    // Small timeout to allow DOM to paint on route change
    const timeoutId = setTimeout(() => {
      ctx = gsap.context(() => {
        initTextHighlight();
        initFadeUp();
        initStaggerList();
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      ctx?.revert();
    };
  }, [location.pathname]);

  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <PortfolioProvider>
        <ThemeProvider>
          <Router>
            <ScrollEffectsRunner />
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/creatives" element={<CreativesRoute />} />
              <Route path="/work/:slug" element={<ProjectRoute />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
            <SearchOverlay />
          </Router>
        </ThemeProvider>
      </PortfolioProvider>
      
      {!isLoading && <FloatingSpotify />}
    </div>
  );
}

export default App;
