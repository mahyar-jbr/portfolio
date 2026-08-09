'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/* Motion ships reducedMotion: 'never' by default, so honouring the OS setting
   is opt-in — without this, every transform and layout animation on the site
   ignores prefers-reduced-motion entirely.

   Note what 'user' does and does not cover: transform and layout animations
   are disabled, but opacity and backgroundColor still run (Motion's docs are
   explicit about this). filter / backdrop-filter are NOT covered either, so
   anything animating those needs its own useReducedMotion() branch. */
export default function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
