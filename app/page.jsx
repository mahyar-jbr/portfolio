import HeroSection from '@/components/sections/HeroSection';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink text-paper">
      <HeroSection />
      {/* Remaining sections (Work, Experience, About, Skills, Gallery, Contact)
          are ported in subsequent steps. */}
    </main>
  );
}
