// Shared motion vocabulary — named easings + reusable variants.
// Mirrors the design tokens (tailwind transitionTimingFunction) so JS-driven
// (Framer Motion) and CSS-driven animation share one feel.

export const easeBrandOut = [0.6, 0.01, 0.05, 0.95]; // section / letter reveals
export const easeBrandSoft = [0.4, 0, 0.2, 1];
export const easeBrandSnap = [0.76, 0, 0.24, 1]; // underlines

// Fade + rise, the canonical entrance for eyebrow / tagline / CTAs.
export const riseIn = {
  hidden: { opacity: 0, y: 20 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeBrandOut, delay },
  }),
};

// Per-letter headline entrance: up + 3D tilt settle.
export const letterIn = {
  hidden: { opacity: 0, y: 100, rotateX: -90 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.8, ease: easeBrandOut, delay: i * 0.05 },
  }),
};

// Reduced-motion equivalent: a plain cross-fade, no transform.
export const fadeIn = {
  hidden: { opacity: 0 },
  show: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, ease: 'easeOut', delay },
  }),
};
