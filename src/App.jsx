import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import { PortfolioProvider } from './context/PortfolioContext';
import Admin from './pages/Admin';

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
    </>
);

function App() {
  return (
    <div className="bg-background min-h-screen text-primary selection:bg-accent selection:text-background overflow-x-hidden">
      <PortfolioProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </PortfolioProvider>
    </div>
  );
}

export default App;
