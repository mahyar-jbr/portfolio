import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Drawings from '@/components/sections/Drawings';
import Experience from '@/components/sections/Experience';
import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';

/* Home — the Lucent PortfolioPage, in the order a reviewer needs it: who
   (hero), who as a person (about, which the hero opens into), the work, where
   he has worked, the drawings, how to reach him. */
export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Work />
      <Experience />
      <Drawings />
      <Contact />
    </>
  );
}
