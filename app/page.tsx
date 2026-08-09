import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';
import Experience from '@/components/sections/Experience';
import About from '@/components/sections/About';
import Skills from '@/components/sections/Skills';
import Contact from '@/components/sections/Contact';

/* Home — one scroll, five sections, per design/SECTIONS.md §1 as amended in §0.
   Depth lives on the /work routes and /art; nothing here expands in place. */

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <About />
      <Skills />
      <Contact />
    </>
  );
}
