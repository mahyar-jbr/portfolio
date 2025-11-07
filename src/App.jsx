import { useState } from 'react';
import NavBar from './components/NavBar.jsx';
import HeroSection from './components/HeroSection.jsx';
import AboutSection from './components/AboutSection.jsx';
import WorkSection from './components/WorkSection.jsx';
import ExperienceSection from './components/ExperienceSection.jsx';
import SkillsSection from './components/SkillsSection.jsx';
import ContactSection from './components/ContactSection.jsx';
import ProjectModal from './components/ProjectModal.jsx';
import Footer from './components/Footer.jsx';

import { devProjects } from './data/projects.js';
import { developmentSkills } from './data/skills.js';

export default function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  const scrollToSection = (selector) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      <NavBar scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <AboutSection />
      <WorkSection
        projects={devProjects}
        onProjectSelect={setSelectedProject}
      />
      <ExperienceSection />
      <SkillsSection />
      <ContactSection />
      <Footer />
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
