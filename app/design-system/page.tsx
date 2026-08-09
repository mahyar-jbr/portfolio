import type { Metadata } from 'next';
import Swatches from '@/components/ds/Swatches';
import Buttons from '@/components/ds/Buttons';
import TypeRamp from '@/components/ds/TypeRamp';
import Surfaces from '@/components/ds/Surfaces';
import MotionLab from '@/components/ds/MotionLab';
import Portfolio from '@/components/ds/Portfolio';
import Absent from '@/components/ds/Absent';
import { DSSection } from '@/components/ds/Kit';

export const metadata: Metadata = {
  title: 'Design System — Mahyar Jaberi',
  robots: { index: false, follow: false },
};

export default function DesignSystem() {
  return (
    <main className="mx-auto max-w-5xl px-6 pb-32 sm:px-10">
      <header className="border-b border-n-6 py-16">
        <p className="font-mono text-xs tracking-[0.2em] text-n-9 uppercase">
          v2 · light · navy + olive
        </p>
        <h1
          className="mt-4 text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-semibold text-ink"
          style={{ letterSpacing: 'var(--tracking-72)' }}
        >
          Design System
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-n-10">
          Every colour was generated in OKLCH and its contrast measured, not
          estimated. Every spring was generated from Motion&rsquo;s own
          <span className="font-mono text-[0.95em]"> visualDuration </span>
          formula and simulated to rest. The numbers on this page are the real
          ones.
        </p>
      </header>

      <DSSection
        num="01"
        title="Colour"
        note="Navy carries the accent; olive lives in the neutral ramp's hue and as one semantic tone. That split is a gamut result, not a preference — see the note under the olive swatches."
      >
        <Swatches />
      </DSSection>

      <DSSection
        num="02"
        title="Type"
        note="Inter via the opsz axis. Tracking is computed from Inter's own Dynamic Metrics curve rather than chosen by eye — which is why it turns positive below 12px."
      >
        <TypeRamp />
      </DSSection>

      <DSSection
        num="03"
        title="Buttons & controls"
        note="Every variant, every state. Press uses the jelly spring; hover uses the faster one."
      >
        <Buttons />
      </DSSection>

      <DSSection
        num="04"
        title="Surfaces, elevation & glass"
        note="Glass is chrome-only — nav and floating controls, never content. Apple's HIG is explicit about this, and it is also what keeps text contrast provable."
      >
        <Surfaces />
      </DSSection>

      <DSSection
        num="05"
        title="Motion"
        note="Click to replay. Apple's declared default bounce is 0.0; Motion's own default is 0.44, which is the difference between premium and cartoonish."
      >
        <MotionLab />
      </DSSection>

      <DSSection
        num="06"
        title="Restraint"
        note="What a system refuses is as load-bearing as what it ships."
      >
        <Absent />
      </DSSection>

      <DSSection
        num="07"
        title="Portfolio components"
        note="The pieces this system exists to render."
      >
        <Portfolio />
      </DSSection>
    </main>
  );
}
