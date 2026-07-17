import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom';
import Hero from './components/Hero';
import WelcomeBanner from './components/WelcomeBanner';
import Introduction from './components/Introduction';
import AboutMe from './components/AboutMe';
import Education from './components/Education';
import WorkExperience from './components/WorkExperience';
import ProjectGallery from './components/ProjectGallery';
import LatestProject from './components/LatestProject';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';

import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import Admin from './pages/Admin';
import CreativesPage from './pages/CreativesPage';
import ProjectDetail from './pages/ProjectDetail';
import AboutPage from './pages/AboutPage';

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

const Portfolio = () => (
    <>
      <main>
        <Hero />
        <WelcomeBanner />
        <Introduction />
        <AboutMe />
        <Education />
        <WorkExperience />
        <ProjectGallery />
        <LatestProject />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
);

function App() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-background overflow-x-hidden">
      <PortfolioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/creatives" element={<CreativesRoute />} />
            <Route path="/work/:slug" element={<ProjectRoute />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </div>
  );
}

export default App;
