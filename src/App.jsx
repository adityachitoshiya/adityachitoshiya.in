import React, { useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
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
import { initHeroParallax } from './components/gsapAnimations';

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
      projects={portfolioData.projectPortfolio.projects}
      global={portfolioData.global}
      onSelectProject={(p) => navigate(`/work/${p.slug}`)}
    />
  );
};

const ProjectRoute = () => {
  const { portfolioData } = usePortfolio();
  const { slug } = useParams();
  const navigate = useNavigate();
  
  if (!portfolioData) return null;

  const projects = portfolioData.projectPortfolio.projects || [];
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <Navigate to="/creatives" replace />;
  }

  return (
    <ProjectDetail
      project={project}
      allProjects={projects}
      global={portfolioData.global}
      onBack={() => navigate('/creatives')}
      onSelectProject={(p) => navigate(`/work/${p.slug}`)}
    />
  );
};

const useMultiRef = () => {
  const elements = useRef([]);
  const callbackRef = (el) => {
    if (el && !elements.current.includes(el)) {
      elements.current.push(el);
    }
  };
  // Expose current for GSAP
  callbackRef.current = elements.current;
  return callbackRef;
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
      600
    );
    return () => ctx?.revert();
  }, []);

  return (
    <>
      <main>
        <div ref={heroRef}>
          <Hero 
            photoRef={photoRefs} 
            headlineRef={headlineRefs} 
            accentRef={accentRefs} 
          />
        </div>
        <div ref={welcomeRef} style={{ background: '#0a0a0a' }}>
          <WelcomeBanner />
        </div>
        <Introduction />
        <AboutMe />
        <CurrentFocus />
        <WorkExperience />
        <Education />
        <ProjectGallery />
        <LatestProject />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
};

function App() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-background overflow-x-hidden">
      <PortfolioProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/creatives" element={<CreativesRoute />} />
              <Route path="/work/:slug" element={<ProjectRoute />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </PortfolioProvider>
    </div>
  );
}

export default App;
