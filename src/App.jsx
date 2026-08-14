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
import BrandMarquee from './components/BrandMarquee';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Admin from './pages/Admin';
import CreativesPage from './pages/CreativesPage';
import ProjectDetail from './pages/ProjectDetail';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GigsPage from './components/GigsPage';

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

import GigList from './components/GigList';

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
        <div ref={heroRef} className="sticky top-0 z-10 w-full min-h-screen">
          <Hero 
            photoRef={photoRefs} 
            headlineRef={headlineRefs} 
            accentRef={accentRefs} 
          />
        </div>
        <div 
          ref={welcomeRef} 
          className="relative z-20 bg-[#0a0a0a] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-30px_80px_rgba(0,0,0,0.9)] border-t border-white/10"
        >
          <WelcomeBanner />
          <BrandMarquee />
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

import OnboardingScreen from './components/OnboardingScreen';

const OnboardingGuard = ({ pageKey, pageName, children }) => {
  const { portfolioData } = usePortfolio();
  const location = useLocation();

  const hostname = window.location.hostname;
  const isLocalhost = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') ||
    hostname.endsWith('.local');

  const searchParams = new URLSearchParams(location.search);
  const isPreview = searchParams.get('preview') === 'true';
  const isAdminLoggedIn = !!localStorage.getItem('adminToken');

  // Check overall onboarding mode AND per-page visibility
  const masterOnboarding = portfolioData?.global?.onboardingMode;
  const pageVisibility = portfolioData?.global?.pageVisibility || {};
  
  // Page is live if master switch is NOT false AND specific pageKey is NOT false
  const isPageLive = masterOnboarding === false || pageVisibility[pageKey] !== false;

  // On localhost, or if logged in as admin, or if URL has ?preview=true, or if page is live -> allow access!
  if (isLocalhost || isAdminLoggedIn || isPreview || isPageLive) {
    return children;
  }

  // Otherwise show sleek onboarding maintenance screen for locked page
  return <OnboardingScreen global={portfolioData?.global} pageName={pageName} />;
};

function App() {
  const [isLoading, setIsLoading] = useState(() => {
    // Show preloader only if it hasn't been loaded in this browser session
    return !sessionStorage.getItem('hasLoadedPreloader');
  });

  const handlePreloaderComplete = () => {
    sessionStorage.setItem('hasLoadedPreloader', 'true');
    setIsLoading(false);
  };

  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-background overflow-x-hidden">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      <PortfolioProvider>
        <ThemeProvider>
          <Router>
            <ScrollEffectsRunner />
            <Routes>
              <Route path="/" element={<OnboardingGuard pageKey="homepage" pageName="Homepage"><Portfolio /></OnboardingGuard>} />
              <Route path="/about" element={<OnboardingGuard pageKey="about" pageName="About Section"><AboutPage /></OnboardingGuard>} />
              <Route path="/gigs" element={<OnboardingGuard pageKey="gigs" pageName="Services & Gigs"><GigsPage /></OnboardingGuard>} />
              <Route path="/contact" element={<OnboardingGuard pageKey="contact" pageName="Contact Page"><ContactPage /></OnboardingGuard>} />
              <Route path="/creatives" element={<OnboardingGuard pageKey="creatives" pageName="Creatives & Projects"><CreativesRoute /></OnboardingGuard>} />
              <Route path="/work/:slug" element={<OnboardingGuard pageKey="creatives" pageName="Creatives & Projects"><ProjectRoute /></OnboardingGuard>} />
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
