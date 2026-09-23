import Contact from '@/components/sections/Contact';
import Drawings from '@/components/sections/Drawings';
import Experience from '@/components/sections/Experience';
import Hero from '@/components/sections/Hero';
import Work from '@/components/sections/Work';

/* Home — the Lucent PortfolioPage, in the order a reviewer needs it: who
   (hero), the work, where he has worked, the drawings, how to reach him. */
export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Experience />
      <Drawings />
      <Contact />
    </>
  );
}
