'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import type { SoonProject } from '@/content/types';
import { loadLucent, prefersReducedMotion } from '@/lib/lucent';

type CameoContent = NonNullable<SoonProject['cameo']>;
type Spring = Lucent.Spring & { x: number };

/**
 * A soon card's answer to a tap, since it has no page to open: its character
 * comes up from behind the caption, the way someone rises from behind a counter,
 * and says his line in a speech bubble, then goes back down. For MoneyMind it is
 * the moose with his coffee, saying it's too early (Mahyar, 2026-09-25).
 *
 * The card stays the plain block it was, heading and all; this lays a button
 * over the whole of it, so a tap anywhere on it, Enter or Space asks him up, and
 * the button names the card ("MoneyMind, coming soon"). Focus stays on it. He
 * goes after a few seconds, on a second tap, on Esc, or on a tap anywhere else;
 * asked again, he comes back, turning round mid-way if he was on his way down.
 * His line is read out politely. He and his bubble are pictures, hidden from
 * screen readers.
 *
 * Where they go depends on the card's size, so they are placed when he is asked
 * up (and again if the card changes size while he's there): him at the caption's
 * left, the saucer resting just clear of its top edge; his bubble over his
 * antlers where the card is tall enough for both, else beside his head. The
 * status label steps out while he talks (site.css), since he is saying it.
 *
 * Motion: he rises on the kit's lens spring, whose one soft overshoot lifts him
 * a touch past his place before he settles, and the bubble grows out of its tail
 * once he is nearly up. Leaving, the bubble fades and he drops, accelerating, the
 * way the kit's exits go. Under reduced motion both only fade, in 150ms.
 *
 * Nothing renders until the page's scripts run, so without them the card is
 * exactly the inert card it was, and his picture is never fetched.
 */

/* Landmarks in the cutout, as fractions of his height (or width, for x), so he
   can stand on the caption and his bubble can point at him. */
const SAUCER = 0.56; // just under his saucer: the line that stays clear of the caption
const CROWN = 0.1; // between his antlers, over his head
const MOUTH = 0.31;
const CHEEK = 0.64; // the right side of his muzzle (x)
const EARS = 0.8; // the tip of his right ear (x): a bubble beside him starts past it

/** Tallest he stands, in px and as a share of the card: the cutout is 512px tall, and past this it goes soft. */
const TALLEST = 320;
const TALLEST_SHARE = 0.8;
/** Shorter than this, he's too small to stand under his bubble, so it goes beside him. */
const SMALLEST = 150;
/** How much higher than his place the spring's one overshoot takes him, as a share of his rise (lens: about 8%). */
const OVERSHOOT = 0.08;
/** Room between his antlers and a bubble over them, and the reach of a bubble's tail beside him. */
const GAP = 6;
const REACH = 10;

const noop = () => () => {};

export default function Cameo({ label, cameo }: { label: string; cameo: CameoContent }) {
  /* false on the server and through hydration, true after: the button only exists where it works */
  const live = useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
  const hitRef = useRef<HTMLButtonElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);
  const line = cameo.line;
  const ratio = cameo.image.width / cameo.image.height;

  useEffect(() => {
    const hit = hitRef.current;
    const stage = stageRef.current;
    const status = statusRef.current;
    const card = hit?.closest<HTMLElement>('.lu-card');
    const caption = card?.querySelector<HTMLElement>('.lu-card-caption');
    const moose = stage?.querySelector<HTMLImageElement>('.cameo-figure');
    const say = stage?.querySelector<HTMLElement>('.cameo-say');
    const words = say?.querySelector<HTMLElement>('.cameo-say-words');
    const shape = say?.querySelector<SVGPathElement>('path');
    if (!hit || !stage || !status || !card || !caption || !moose || !say || !words || !shape) return;

    let state: 'idle' | 'in' | 'out' = 'idle';
    /** How far below where he stands is out of sight, under the card's bottom edge. */
    let drop = 0;
    let timer = 0;
    let leaving: Animation | null = null;
    let spring: Spring | null = null;
    let cancelled = false;

    loadLucent()
      .then((L) => {
        if (cancelled) return;
        spring = L.spring(0, 'lens', (p) => {
          moose.style.transform = `translateY(${((1 - p) * drop).toFixed(2)}px)`;
        }) as Spring;
      })
      .catch(() => {
        /* without the kit's spring he still comes and goes, without the rise */
      });

    const place = () => {
      drop = layout(card, caption, stage, say, words, shape, ratio);
    };
    /* where the drop has got him to, mid-way: read off the running animation */
    const offset = () => new DOMMatrixReadOnly(getComputedStyle(moose).transform).m42;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };
    const onAway = (e: PointerEvent) => {
      if (!card.contains(e.target as Node)) hide();
    };

    const show = () => {
      clearTimeout(timer);
      /* on his way down: turn round from wherever he's got to */
      let from = 0;
      if (leaving) {
        from = drop ? Math.max(0, 1 - offset() / drop) : 0;
        leaving.cancel();
        leaving = null;
      }
      place();
      state = 'in';
      stage.dataset.state = 'in';
      status.textContent = line;
      if (spring && !prefersReducedMotion()) {
        spring.set(from);
        spring.to(1);
      } else {
        spring?.set(1);
        moose.style.transform = 'none';
      }
      timer = window.setTimeout(hide, stay());
      document.addEventListener('keydown', onKey);
      document.addEventListener('pointerdown', onAway, true);
    };

    const hide = () => {
      if (state !== 'in') return;
      state = 'out';
      clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onAway, true);
      stage.dataset.state = 'out';
      /* emptied, so asking him again reads the line out again */
      status.textContent = '';

      const gone = () => {
        state = 'idle';
        stage.removeAttribute('data-state');
        moose.style.transform = `translateY(${drop}px)`;
        spring?.set(0);
      };
      if (!spring || prefersReducedMotion()) {
        /* the CSS fade (150ms) runs its course first */
        timer = window.setTimeout(gone, 150);
        return;
      }
      /* stop the spring where he is and drop from there; the drop holds its last
         frame until he is put back out of sight, so he never flashes back up */
      const y = offset();
      spring.to(spring.x, true);
      /* his drop is most of the card's height, farther than anything else the
         kit sends out, so it takes half as long again as the kit's exits */
      const anim = moose.animate([{ transform: `translateY(${y}px)` }, { transform: `translateY(${drop}px)` }], {
        duration: cssTime('--dur-exit', 180) * 1.5,
        easing: cssValue('--ease-exit', 'ease-in'),
        fill: 'forwards',
      });
      leaving = anim;
      anim.onfinish = () => {
        if (leaving !== anim) return;
        leaving = null;
        gone();
        anim.cancel();
      };
    };

    const onTap = () => (state === 'in' ? hide() : show());
    hit.addEventListener('click', onTap);
    /* the card changing size under him (a turned phone): put him and his bubble right again */
    const resized = new ResizeObserver(() => {
      if (state === 'in') place();
    });
    resized.observe(card);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      hit.removeEventListener('click', onTap);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onAway, true);
      resized.disconnect();
      leaving?.cancel();
      spring?.to(spring.x, true);
    };
  }, [live, line, ratio]);

  if (!live) return null;
  return (
    <>
      <button ref={hitRef} type="button" className="cameo-hit" aria-label={label} />
      <div ref={stageRef} className="cameo-stage" aria-hidden="true">
        <img
          className="cameo-figure"
          src={cameo.image.src}
          width={cameo.image.width}
          height={cameo.image.height}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
        <p className="cameo-say">
          <svg className="cameo-say-shape">
            <path />
          </svg>
          <span className="cameo-say-words">{line}</span>
        </p>
      </div>
      <p ref={statusRef} className="sr-only" aria-live="polite" />
    </>
  );
}

/**
 * Places him and his bubble for the card as it is now (CSS custom properties on
 * the stage, and the bubble's outline), and returns how far below his place is
 * out of sight.
 */
function layout(
  card: HTMLElement,
  caption: HTMLElement,
  stage: HTMLElement,
  say: HTMLElement,
  words: HTMLElement,
  shape: SVGPathElement,
  ratio: number,
): number {
  const W = card.clientWidth;
  const H = card.clientHeight;
  /* he lines up with the caption's edge, and the bubble keeps the same margin */
  const edge = caption.offsetLeft;
  const floor = caption.offsetTop - edge / 2;
  const tallest = Math.min(TALLEST, H * TALLEST_SHARE);
  const px = (n: number) => `${n.toFixed(1)}px`;

  /* The bubble, measured at the width it may take: its lines balanced, then
     narrowed to the longest of them so it wraps its words closely. */
  const measure = (room: number) => {
    stage.style.setProperty('--cameo-room', px(room));
    say.style.width = '';
    const cs = getComputedStyle(say);
    const frame = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    /* an inline box's offsetWidth spans all its lines: the longest one (+1 for rounding) */
    say.style.width = px(words.offsetWidth + 1 + frame);
    return { bw: say.offsetWidth, bh: say.offsetHeight };
  };

  /* Over his antlers, if that leaves him tall enough. */
  let { bw, bh } = measure(W - 2 * edge);
  let h = Math.min(tallest, (floor - edge - bh - GAP) / SAUCER);
  const over = h >= SMALLEST;
  /* beside it, as tall as keeps his antlers inside the card even at the top of the overshoot */
  if (!over) h = Math.min(tallest, (floor - (edge / 2 + OVERSHOOT * H) / (1 + OVERSHOOT)) / SAUCER);
  const w = h * ratio;
  const x = edge;
  const y = floor - SAUCER * h;

  let bx: number;
  let by: number;
  let tip: [number, number];
  let d: string;
  if (over) {
    bx = edge;
    by = y - GAP - bh;
    tip = [x + w / 2 - bx, y + CROWN * h - by];
    d = outline(bw, bh, 'bottom', tip);
  } else {
    /* Beside his head, past his ear, level with his mouth where the card allows. */
    bx = x + EARS * w + REACH;
    ({ bw, bh } = measure(W - edge - bx));
    const mouth = y + MOUTH * h;
    by = Math.max(edge, Math.min(floor - bh, mouth - bh / 2));
    tip = [x + CHEEK * w - bx, mouth - by];
    d = outline(bw, bh, 'left', tip);
  }

  stage.style.setProperty('--cameo-x', px(x));
  stage.style.setProperty('--cameo-y', px(y));
  stage.style.setProperty('--cameo-h', px(h));
  stage.style.setProperty('--cameo-bx', px(bx));
  stage.style.setProperty('--cameo-by', px(by));
  stage.style.setProperty('--cameo-tip', `${px(tip[0])} ${px(tip[1])}`);
  shape.setAttribute('d', d);
  return H - y;
}

/**
 * A speech bubble's outline, w by h: a rounded box with a tail from its bottom
 * or left side to `tip` (in the box's own coordinates), its base as close under
 * the tip as the corners allow.
 */
function outline(w: number, h: number, side: 'bottom' | 'left', tip: [number, number]): string {
  const r = Math.min(16, h / 2);
  const half = 7;
  const [tx, ty] = tip.map((n) => +n.toFixed(1));
  const clamp = (n: number, max: number) => Math.min(Math.max(n, r + half), max - r - half);
  /* clockwise from the top left: across the top, down the right, along the bottom, up the left */
  const right = `M${r} 0H${w - r}A${r} ${r} 0 0 1 ${w} ${r}V${h - r}A${r} ${r} 0 0 1 ${w - r} ${h}`;
  const bottom = `H${r}A${r} ${r} 0 0 1 0 ${h - r}`;
  const left = `V${r}A${r} ${r} 0 0 1 ${r} 0Z`;
  if (side === 'bottom') {
    const b = clamp(tx, w);
    return `${right}H${b + half}L${tx} ${ty}L${b - half} ${h}${bottom}${left}`;
  }
  const b = clamp(ty, h);
  return `${right}${bottom}V${b + half}L${tx} ${ty}L0 ${b - half}${left}`;
}

/** How long he stays: a toast's stay (dur-toast) and half again, since his line is a sentence, not two words. */
function stay(): number {
  return cssTime('--dur-toast', 2800) * 1.5;
}

function cssTime(name: string, fallback: number): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isNaN(v) ? fallback : v;
}

function cssValue(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}
