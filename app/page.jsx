import HeroSection from '@/components/sections/HeroSection';
import WorkSection from '@/components/sections/WorkSection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink text-paper">
      <HeroSection />
      <WorkSection />
      {/* Remaining sections (Experience, About, Skills, Gallery, Contact)
          are ported in subsequent steps. */}
    </main>
  );
}
