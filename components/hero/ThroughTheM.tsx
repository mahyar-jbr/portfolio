'use client';

import { useEffect } from 'react';
import { HOLD, MORPH, stageSpan, TOTAL, ZOOM } from './timeline';

/**
 * The opening's last act, from the landed hero into About:
 *
 *   ZOOM (pinned, q 0 → 1)
 *     0.00–0.18  the details and the rest of the name leave            (CSS, from --q)
 *     0.06–0.20  the M fills with the portrait: ink M → photo M        (here + CSS)
 *     0.10–0.92  the M grows, a window with the photo inside, about the
 *                point deepest in its ink                               (here)
 *     0.84–1.00  the photo fades up to fill the screen                  (here)
 *   SETTLE (released, s 0 → 1)
 *     the full-screen photo shrinks into the About portrait's frame as
 *     the section scrolls in, then hands over to the real image          (here)
 *
 * The window is an SVG clipPath made of the very same TeX Σ glyph the name's M
 * is, turned the same quarter. It grows about the point deepest inside its ink
 * — measured once from the glyph itself — so a single stroke ends up filling
 * the screen. The photo behind it never moves: the window opens onto it.
 *
 * Runs only while the pinned opening runs (html.sigma and a live hero); in any
 * resting form the overlay stays hidden and About scrolls in plainly.
 */

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const inOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const inCubic = (t: number) => t * t * t;
const SIGMA = '∑';
/**
 * The largest the glyph is ever drawn, in px. Chromium stops painting text
 * somewhere above ~9,000px (measured: fine at 9,356, gone at 12,021), so the
 * window grows to at most this and the photo fades up the rest of the way.
 */
const MAX_GLYPH_PX = 6000;

/**
 * Where the turned Σ's ink is thickest, relative to its ink centre, in em, and
 * how far that point is from the nearest edge (the stroke's half-width).
 * Found with a distance transform over the rendered glyph.
 */
function deepestPoint(): { x: number; y: number; r: number } {
  const G = 240;
  const N = 480;
  const c = document.createElement('canvas');
  c.width = c.height = N;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.translate(N / 2, N / 2);
  ctx.rotate(Math.PI / 2);
  ctx.font = `${G}px KaTeX_Size2`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  /* the Σ's ink is centred 0.25em above its baseline (measured), so this centres it */
  ctx.fillText(SIGMA, 0, 0.25 * G);
  const px = ctx.getImageData(0, 0, N, N).data;

  /* two-pass chamfer distance to the nearest non-ink pixel */
  const INF = 1e9;
  const d = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) d[i] = px[i * 4 + 3] > 127 ? INF : 0;
  const A = 1;
  const B = Math.SQRT2;
  for (let y = 1; y < N - 1; y++)
    for (let x = 1; x < N - 1; x++) {
      const i = y * N + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], d[i - 1] + A, d[i - N] + A, d[i - N - 1] + B, d[i - N + 1] + B);
    }
  let best = 0;
  let bi = 0;
  for (let y = N - 2; y > 0; y--)
    for (let x = N - 2; x > 0; x--) {
      const i = y * N + x;
      if (!d[i]) continue;
      d[i] = Math.min(d[i], d[i + 1] + A, d[i + N] + A, d[i + N + 1] + B, d[i + N - 1] + B);
      if (d[i] > best) {
        best = d[i];
        bi = i;
      }
    }
  return { x: ((bi % N) - N / 2) / G, y: (Math.floor(bi / N) - N / 2) / G, r: best / G };
}

export default function ThroughTheM() {
  useEffect(() => {
    const root = document.documentElement;
    const hero = document.querySelector<HTMLElement>('[data-sigma-hero]');
    const stage = hero?.querySelector<HTMLElement>('.hero-stage');
    const sticky = hero?.querySelector<HTMLElement>('.hero-sticky');
    const mBox = hero?.querySelector<HTMLElement>('[data-sigma-to]');
    const mGlyph = mBox?.firstElementChild as HTMLElement | null | undefined;
    const win = document.querySelector<HTMLElement>('[data-mwin]');
    const svg = win?.querySelector<SVGSVGElement>('[data-mwin-svg]');
    const glyph = win?.querySelector<SVGTextElement>('[data-mwin-glyph]');
    const image = win?.querySelector<SVGImageElement>('[data-mwin-image]');
    const img = win?.querySelector<HTMLImageElement>('[data-mwin-img]');
    const frame = document.querySelector<HTMLElement>('[data-about-portrait]');
    if (!hero || !stage || !sticky || !mBox || !mGlyph || !win || !svg || !glyph || !image || !img || !frame) return;

    let focal: { x: number; y: number; r: number } | null = null;
    let raf = 0;

    const off = () => {
      win.dataset.mode = '';
      hero.style.removeProperty('--q');
      frame.classList.remove('is-covered');
    };

    function frameTick() {
      raf = 0;
      if (!root.classList.contains('sigma') || !hero!.classList.contains('is-live')) {
        off();
        return;
      }
      focal ??= deepestPoint();

      const W = window.innerWidth;
      const H = window.innerHeight;
      const span = stageSpan(hero!, stage!, sticky!);
      const zoomStart = span.top + (span.dist * (MORPH + HOLD)) / TOTAL;
      const q = clamp((window.scrollY - zoomStart) / ((span.dist * ZOOM) / TOTAL));
      hero!.style.setProperty('--q', q.toFixed(4));

      /* after the pin: the photo settles into the portrait as About scrolls in */
      const stageEnd = span.top + span.dist;
      const fr = frame!.getBoundingClientRect();
      const settleDist = Math.max(1, frame!.getBoundingClientRect().top + window.scrollY - stageEnd - H * 0.12);
      const s = clamp((window.scrollY - stageEnd) / settleDist);

      if (q <= 0.06) {
        off();
        return;
      }

      if (q < 1) {
        /* the window: the M, in place, growing about its deepest point */
        win!.dataset.mode = 'window';
        frame!.classList.add('is-covered');
        svg!.setAttribute('width', `${W}`);
        svg!.setAttribute('height', `${H}`);
        image!.setAttribute('width', `${W}`);
        image!.setAttribute('height', `${H}`);

        const mb = mBox!.getBoundingClientRect();
        const F = parseFloat(getComputedStyle(mGlyph!).fontSize);
        const cx = mb.left + mb.width / 2;
        const cy = mb.top + mb.height / 2;
        glyph!.setAttribute('font-size', `${F}`);

        const fx = cx + focal!.x * F;
        const fy = cy + focal!.y * F;
        const reach = Math.max(Math.hypot(fx, fy), Math.hypot(W - fx, fy), Math.hypot(fx, H - fy), Math.hypot(W - fx, H - fy));
        /* the scale at which the deepest stroke alone covers the screen, capped at
           what browsers will paint; the photo fades up over whatever remains */
        const full = Math.min((reach / (focal!.r * F)) * 1.04, MAX_GLYPH_PX / F);
        const g = Math.exp(Math.log(full) * inCubic(clamp((q - 0.1) / 0.82)));
        /* right to left: centre the ink on (cx, cy) turned a quarter clockwise like
           the name's M, then grow it by g about the deepest point (fx, fy) */
        glyph!.setAttribute(
          'transform',
          `translate(${fx} ${fy}) scale(${g}) translate(${-fx} ${-fy}) translate(${cx} ${cy}) rotate(90) translate(0 ${0.25 * F})`,
        );
        win!.style.setProperty('--win-in', clamp((q - 0.06) / 0.14).toFixed(3));
        win!.style.setProperty('--full', clamp((q - 0.84) / 0.16).toFixed(3));
        img!.style.left = img!.style.top = '0px';
        img!.style.width = `${W}px`;
        img!.style.height = `${H}px`;
        img!.style.borderRadius = '0px';
        return;
      }

      if (s < 1) {
        /* the photo, full screen, settling into the portrait's live position */
        win!.dataset.mode = 'settle';
        win!.style.setProperty('--full', '1');
        frame!.classList.add('is-covered');
        const t = inOutCubic(s);
        img!.style.left = `${lerp(0, fr.left, t)}px`;
        img!.style.top = `${lerp(0, fr.top, t)}px`;
        img!.style.width = `${lerp(W, fr.width, t)}px`;
        img!.style.height = `${lerp(H, fr.height, t)}px`;
        img!.style.borderRadius = `${lerp(0, parseFloat(getComputedStyle(frame!).borderTopLeftRadius), t)}px`;
        return;
      }

      /* arrived: the real portrait takes over */
      win!.dataset.mode = '';
      frame!.classList.remove('is-covered');
    }

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(frameTick);
    };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    /* the glyph's shape comes from the web font: measure once it has loaded */
    void document.fonts?.load('240px KaTeX_Size2').then(() => {
      focal = null;
      schedule();
    });
    const mo = new MutationObserver(schedule);
    mo.observe(hero, { attributes: true, attributeFilter: ['class'] });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    schedule();

    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mo.disconnect();
      if (raf) cancelAnimationFrame(raf);
      off();
    };
  }, []);

  return null;
}
