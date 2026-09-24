'use client';

import { getImageProps } from 'next/image';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import type { ArtPiece } from '@/content/art';
import { loadLucent, prefersReducedMotion } from '@/lib/lucent';
import { clock, type Series } from './shared';
import Timelapse, { type TimelapseHandle, type TimelapseState } from './Timelapse';

/**
 * The paper room: a drawing opened from the wall (the kit's ArtGallery
 * lightbox, grown). The drawing rises out of its place on the wall on the
 * kit's spring and settles on its mat in a quiet paper room, with its wall
 * label beside it (below it on narrow screens). Glass controls float at the
 * top: previous, where you are, next, close. Closing sends it back to its
 * place on the wall.
 *
 * Two sets open here, one at a time:
 * - pieces: the standalone drawings, each with its own label, carried with it
 *   as you move along; a piece with a time-lapse offers to show it being made
 *   (Timelapse).
 * - story: Godfall, one work in five panels, read in order. Its label hangs
 *   once, beside the story; the position ("2 of 5") and the row of panels
 *   under the label say where you are.
 *
 * Moving on is a pager on the kit's lens spring: it follows a finger or the
 * pointer 1:1 while dragged and, let go, settles on the next drawing with the
 * speed it was thrown at. The arrow keys, the glass arrows, a sideways swipe
 * on a trackpad and, in the story, a tap on either half of the panel do the
 * same. The ends hold, with a small give, rather than wrapping round: a story
 * has a first and a last page.
 *
 * It is a native modal <dialog>, so the page behind is inert; Tab stays
 * inside, Esc closes, and focus goes back to the drawing on show when it
 * closes. Reduced motion: the springs jump to rest and a change is a fade of
 * 150ms.
 */

type SetName = 'pieces' | 'story';

/** The kit's spring and the position it is at (the runtime has it; its published types leave it out). */
type Spring = Lucent.Spring & { x: number };

interface Slide {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** The largest image the room asks for: about 2000px, whatever the screen. */
const MAX_FULL = 2048;

const ICON_X = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
const ICON_L = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);
const ICON_R = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 5l7 7-7 7" />
  </svg>
);
/* time-lapse: a play mark inside a ring of ticks, a clock face running */
const ICON_WATCH = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 2.8v1.6M12 19.6v1.6M2.8 12h1.6M19.6 12h1.6M5.5 5.5l1.1 1.1M17.4 17.4l1.1 1.1M5.5 18.5l1.1-1.1M17.4 6.6l1.1-1.1" />
    <path d="M10 8.6v6.8l5.4-3.4z" fill="currentColor" stroke="none" />
  </svg>
);

function cssNumber(name: string, fallback: number): number {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
  return Number.isNaN(v) ? fallback : v;
}
function cssValue(name: string, fallback: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

/** The large image for a slide, as wide as it is shown (through Next's optimiser), never past MAX_FULL. */
function fullImage(s: Slide, shownWidth: number) {
  const { props } = getImageProps({
    src: s.src,
    width: s.width,
    height: s.height,
    alt: '',
    quality: 85,
    sizes: `${Math.ceil(shownWidth)}px`,
  });
  const srcSet = props.srcSet
    ?.split(', ')
    .filter((c) => parseInt(c.slice(c.lastIndexOf(' ') + 1), 10) <= MAX_FULL)
    .join(', ');
  return { src: props.src, srcSet, sizes: props.sizes };
}

/**
 * The transform that puts the room's mat where the drawing hangs on the wall.
 * A piece lines up mat to mat; a story panel lines up its art with the panel
 * in the strip, so the paper grows out around it.
 */
function placeOnWall(from: Element, mat: HTMLElement, artOnly: boolean): string | null {
  const a = from.getBoundingClientRect();
  const b = (artOnly ? (mat.querySelector('.room-art') ?? mat) : mat).getBoundingClientRect();
  const m = mat.getBoundingClientRect();
  if (!a.width || !b.width) return null;
  const s = a.width / b.width;
  /* scaled about the mat's centre, which is also the art's */
  const dx = a.left + a.width / 2 - (m.left + m.width / 2);
  const dy = a.top + a.height / 2 - (m.top + m.height / 2);
  return `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
}

export default function Room({ pieces, series, wall }: { pieces: ArtPiece[]; series: Series; wall: string }) {
  const [view, setView] = useState<{ set: SetName; index: number } | null>(null);
  /** each slide's art width as laid out, so its large image is fetched at that size */
  const [widths, setWidths] = useState<number[]>([]);
  /** the slides whose large image is wanted: each one shown, and the next one along */
  const [wanted, setWanted] = useState<Set<number>>(() => new Set());
  /** which way the viewer is going, so the drawing after this one is ready (forwards, to begin with) */
  const heading = useRef(1);
  /** what each slide's large image resolved to: the time-lapse's poster */
  const [loaded, setLoaded] = useState<Record<number, string>>({});
  const [tl, setTl] = useState<TimelapseState>('idle');
  const [watched, setWatched] = useState(false);

  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const mats = useRef<(HTMLDivElement | null)[]>([]);
  /** what each slide shows until its large image arrives: the wall's own thumbnail, already loaded */
  const thumbs = useRef<string[]>([]);
  const origin = useRef<HTMLButtonElement | null>(null);
  const lifted = useRef<Element | null>(null);
  const pos = useRef<Spring | null>(null);
  const step = useRef(0);
  const closing = useRef(false);
  /** the room is up, from showModal until it is tidied away */
  const live = useRef(false);
  const tlHandle = useRef<TimelapseHandle | null>(null);

  const slides: Slide[] = !view
    ? []
    : view.set === 'pieces'
      ? pieces.map((p) => ({ src: p.image, width: p.width, height: p.height, alt: `${p.title}, ${p.medium.toLowerCase()}, ${p.year}` }))
      : series.panels.map((p, k) => ({
          src: p.image,
          width: p.width,
          height: p.height,
          alt: `${series.title}, panel ${k + 1} of ${series.panels.length}`,
        }));
  const count = slides.length;
  const index = view?.index ?? 0;

  /* ---------- the wall ---------- */
  const onWall = useCallback(
    (set: SetName, k: number) => {
      const root = document.getElementById(wall);
      const button =
        root?.querySelector<HTMLButtonElement>(set === 'pieces' ? `[data-open="piece"][data-index="${k}"]` : '[data-open="story"]') ??
        null;
      /* what a slide grows out of and goes back to: a piece's mat, or its panel in the strip */
      const place = set === 'pieces' ? button?.querySelector('.wall-mat') : button?.querySelector(`[data-panel="${k}"] img`);
      return { button, place: place ?? null };
    },
    [wall],
  );

  /* ---------- the pager ---------- */
  const paint = useCallback((x: number) => {
    if (track.current) track.current.style.transform = `translate3d(${(-x * step.current).toFixed(2)}px,0,0)`;
  }, []);

  const measure = useCallback(() => {
    const st = stage.current;
    const tr = track.current;
    if (!st || !tr) return;
    step.current = st.clientWidth + (parseFloat(getComputedStyle(tr).columnGap) || 0);
    /* layout widths, not the box on screen, which the opening morph is still scaling */
    setWidths(mats.current.map((m) => m?.querySelector<HTMLElement>('.room-art')?.offsetWidth ?? 0));
    paint(pos.current?.x ?? index);
  }, [paint, index]);

  const go = useCallback(
    (k: number, velocity = 0) => {
      if (!view || closing.current) return;
      const to = Math.max(0, Math.min(count - 1, k));
      const spring = pos.current;
      if (to !== view.index) {
        heading.current = to > view.index ? 1 : -1;
        tlHandle.current?.stop();
        setView({ set: view.set, index: to });
        setTl('idle');
        setWatched(false);
        if (prefersReducedMotion()) mats.current[to]?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease' });
      }
      if (!spring) {
        paint(to);
        return;
      }
      spring.to(to);
      if (velocity) spring.kick(velocity);
      /* asked past an end: a small give, then back */ else if (k !== to) spring.kick(k > to ? 2.4 : -2.4);
    },
    [view, count, paint],
  );

  /* ---------- open ---------- */
  useEffect(() => {
    const root = document.getElementById(wall);
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLButtonElement>('[data-open]');
      if (!btn || !root.contains(btn) || live.current) return;
      const set: SetName = btn.dataset.open === 'story' ? 'story' : 'pieces';
      let k = set === 'pieces' ? Number(btn.dataset.index) || 0 : 0;
      /* a tap on the strip opens the story at the panel under it; the keyboard starts at the beginning */
      if (set === 'story' && e.detail > 0) k = Number((e.target as Element).closest<HTMLElement>('[data-panel]')?.dataset.panel) || 0;
      origin.current = btn;
      closing.current = false;
      const imgs =
        set === 'pieces'
          ? pieces.map((_, i) => root.querySelector<HTMLImageElement>(`[data-open="piece"][data-index="${i}"] img`))
          : series.panels.map((_, i) => root.querySelector<HTMLImageElement>(`[data-open="story"] [data-panel="${i}"] img`));
      thumbs.current = imgs.map((im) => (im && im.complete && im.naturalWidth ? im.currentSrc : ''));
      setWanted(new Set([k]));
      heading.current = 1;
      setLoaded({});
      setWidths([]);
      setTl('idle');
      setWatched(false);
      setView({ set, index: k });
      void loadLucent().catch(() => null);
    };
    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [wall, pieces, series.panels]);

  /* the room comes up: show the dialog, place the pager, and lift the drawing off the wall into it */
  const opened = view?.set ?? null;
  useLayoutEffect(() => {
    const d = dialog.current;
    if (!opened || !d || !view) return;
    const k = view.index;
    d.showModal();
    live.current = true;
    document.documentElement.classList.add('lu-locked');
    /* the room itself takes focus: a reader hears the drawing's name, the arrows work at once, and a tap
       doesn't leave a focus ring on a button nobody pressed; Tab goes on to the controls */
    d.focus({ preventScroll: true });

    const L = window.Lucent;
    step.current = (stage.current?.clientWidth ?? 0) + (parseFloat(getComputedStyle(track.current!).columnGap) || 0);
    pos.current = L ? (L.spring(k, 'lens', paint) as Spring) : null;
    paint(k);
    measure();

    const reduced = prefersReducedMotion();
    const mat = mats.current[k];
    const { place } = onWall(view.set, k);
    const fadeIn = (el: Element | null | undefined, delay: number) =>
      el?.animate([{ opacity: 0 }, { opacity: 1 }], {
        duration: reduced ? 150 : 360,
        delay: reduced ? 0 : delay,
        easing: cssValue('--ease-settle', 'ease-out'),
        fill: 'backwards',
      });
    bg.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 150 : 420, easing: 'ease-out', fill: 'backwards' });
    fadeIn(bar.current, 180);
    d.querySelectorAll('.room-plate').forEach((p) => fadeIn(p, 240));
    const from = place && mat && !reduced ? placeOnWall(place, mat, view.set === 'story') : null;
    if (from && place && mat) {
      lifted.current = place;
      place.classList.add('is-lifted');
      mat
        .animate([{ transform: from }, { transform: 'none' }], {
          duration: cssNumber('--dur-morph', 640) + 80,
          /* the kit's spring as a curve (Lucent.ease), as its sheet opens out of its button */
          easing: (L as { ease?: string } | undefined)?.ease ?? cssValue('--ease-settle', 'ease-out'),
        })
        .finished.catch(() => {})
        .finally(() => {
          if (closing.current) return;
          lifted.current?.classList.remove('is-lifted');
          lifted.current = null;
        });
    } else fadeIn(mat, 0);

    const ro = new ResizeObserver(() => measure());
    if (stage.current) ro.observe(stage.current);
    return () => ro.disconnect();
    /* keyed to the room coming up, not to each move inside it */
  }, [opened]);

  /* the kit's soft press on the room's controls, as its own lightbox has; they come and go with the
     drawing on show, and the kit wires each one once */
  useEffect(() => {
    const L = window.Lucent;
    if (!view || !L) return;
    dialog.current?.querySelectorAll<HTMLElement>('.lu-btn').forEach((b) => L.jelly(b, { amount: 0.7 }));
  }, [view, tl]);

  /* the large image of the drawing on show; once it has arrived, the next one along too (only that
     one), so the next move finds it ready */
  const shownLoaded = view ? Boolean(loaded[view.index]) : false;
  useEffect(() => {
    if (!view) return;
    const k = view.index;
    const ahead = k + heading.current;
    setWanted((w) => {
      const next = new Set(w).add(k);
      if (shownLoaded && ahead >= 0 && ahead < count) next.add(ahead);
      return next.size === w.size ? w : next;
    });
  }, [view, shownLoaded, count]);

  /* ---------- close ---------- */
  const finish = useCallback(() => {
    if (!live.current) return;
    live.current = false;
    const d = dialog.current;
    const set = view?.set;
    const k = view?.index ?? 0;
    if (d?.open) d.close();
    document.documentElement.classList.remove('lu-locked');
    lifted.current?.classList.remove('is-lifted');
    lifted.current = null;
    pos.current = null;
    setView(null);
    (set ? (onWall(set, k).button ?? origin.current) : origin.current)?.focus({ preventScroll: true });
  }, [view, onWall]);

  const close = useCallback(() => {
    if (!view || closing.current) return;
    closing.current = true;
    tlHandle.current?.stop();
    /* a pager still settling stops where it is going, so the drawing leaves from a steady place */
    pos.current?.to(view.index, true);
    const reduced = prefersReducedMotion();
    const mat = mats.current[view.index];
    const { place } = onWall(view.set, view.index);
    /* it goes back to its own place, so that place comes into view first, behind the room */
    if (place) {
      const r = place.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) place.scrollIntoView({ block: 'center', behavior: 'instant' });
    }
    const fadeOut = (el: Element | null | undefined, duration: number) =>
      el?.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: cssValue('--ease-exit', 'ease-in'), fill: 'forwards' });
    fadeOut(bar.current, reduced ? 150 : 160);
    dialog.current?.querySelectorAll('.room-plate').forEach((p) => fadeOut(p, reduced ? 150 : 160));
    fadeOut(bg.current, reduced ? 150 : 320);
    const to = place && mat && !reduced ? placeOnWall(place, mat, view.set === 'story') : null;
    if (to && place && mat) {
      lifted.current?.classList.remove('is-lifted');
      lifted.current = place;
      place.classList.add('is-lifted');
      /* exits are quicker than entrances, and never bounce */
      mat
        .animate([{ transform: 'none' }, { transform: to }], { duration: 380, easing: cssValue('--ease-settle', 'ease-out'), fill: 'forwards' })
        .finished.catch(() => {})
        .finally(finish);
    } else {
      const f = fadeOut(mat, 150);
      if (f) f.finished.catch(() => {}).finally(finish);
      else finish();
    }
  }, [view, onWall, finish]);

  /* ---------- keys, swipes and taps ---------- */
  /* Listened for on the document while the room is up, so the keys work wherever focus is. */
  const onKey = (e: KeyboardEvent) => {
    if (!view || !dialog.current?.open) return;
    /* the scrubber keeps its own arrows */
    const own = (e.target as Element).matches('input');
    const move = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: count - 1 }[e.key];
    if (move !== undefined && !own) {
      e.preventDefault();
      go(move);
    } else if (e.key === 'Tab') {
      /* Tab goes round the room's own controls and nowhere else. Moved by hand, because a
         browser that skips buttons on Tab (Safari's default) would otherwise drop focus on
         the inert page behind. */
      const f = [...dialog.current.querySelectorAll<HTMLElement>('button, input')].filter(
        (el) => !el.closest('[inert]') && el.offsetParent !== null,
      );
      if (!f.length) return;
      e.preventDefault();
      const at = f.indexOf(document.activeElement as HTMLElement);
      const next = at < 0 ? (e.shiftKey ? f.length - 1 : 0) : (at + (e.shiftKey ? -1 : 1) + f.length) % f.length;
      f[next].focus();
    }
  };
  const keys = useRef(onKey);
  keys.current = onKey;
  useEffect(() => {
    if (!opened) return;
    const listen = (e: KeyboardEvent) => keys.current(e);
    document.addEventListener('keydown', listen);
    return () => document.removeEventListener('keydown', listen);
  }, [opened]);

  const drag = useRef<{ x: number; y: number; base: number; moving: boolean; samples: [number, number][] } | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    if (!e.isPrimary || e.button !== 0 || (e.target as Element).closest('button, input, .room-player')) return;
    drag.current = { x: e.clientX, y: e.clientY, base: pos.current?.x ?? index, moving: false, samples: [[e.timeStamp, e.clientX]] };
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d || !pos.current) return;
    const dx = e.clientX - d.x;
    if (!d.moving) {
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - d.y)) return;
      d.moving = true;
      stage.current?.setPointerCapture(e.pointerId);
    }
    let x = d.base - dx / step.current;
    /* past either end it gives, but only a little */
    if (x < 0) x *= 0.3;
    else if (x > count - 1) x = count - 1 + (x - (count - 1)) * 0.3;
    pos.current.to(x, true);
    d.samples.push([e.timeStamp, e.clientX]);
    if (d.samples.length > 5) d.samples.shift();
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (d.moving) {
      const [t0, x0] = d.samples[0];
      /* drawings per second, held to a calm throw so the spring's one overshoot stays soft */
      const v = Math.max(-3, Math.min(3, -((e.clientX - x0) / Math.max(1, e.timeStamp - t0)) * (1000 / step.current)));
      const x = pos.current?.x ?? index;
      /* where the throw would carry it, one drawing at most */
      const aim = Math.round(x + v * 0.18);
      go(Math.max(index - 1, Math.min(index + 1, aim)), v);
      return;
    }
    /* a tap beside the drawing closes the room; in the story, a tap on either half of the panel turns the page */
    const target = e.target as Element;
    const mat = mats.current[index];
    if (!mat?.contains(target)) {
      if (!target.closest('.room-plate')) close();
    } else if (view?.set === 'story') {
      const r = mat.getBoundingClientRect();
      go(index + (e.clientX < r.left + r.width / 2 ? -1 : 1));
    }
  };

  /* a sideways swipe on a trackpad turns one drawing per gesture: the gesture's
     momentum keeps sending wheel events, so it counts again only after a pause */
  const wheel = useRef({ sum: 0, last: 0, spent: false });
  const onWheel = (e: ReactWheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const w = wheel.current;
    if (e.timeStamp - w.last > 180) {
      w.sum = 0;
      w.spent = false;
    }
    w.last = e.timeStamp;
    if (w.spent) return;
    w.sum += e.deltaX;
    if (Math.abs(w.sum) > 50) {
      w.spent = true;
      go(index + (w.sum > 0 ? 1 : -1));
    }
  };

  const onTlState = useCallback((s: TimelapseState) => setTl(s), []);
  /* seen to the end, the button offers it again */
  const onTlEnd = useCallback(() => setWatched(true), []);

  /* ---------- the labels ---------- */
  const piecePlate = (p: ArtPiece, i: number): ReactNode => (
    <div className="room-plate">
      <h2 id={`room-title-${i}`}>{p.title}</h2>
      <p className="room-meta">
        {p.medium} · {p.year}
      </p>
      {p.exhibition && <p className="room-credit">{p.exhibition}</p>}
      {p.note && <p className="room-note">{p.note}</p>}
      {p.timelapse && (
        <button
          type="button"
          className={`lu-btn is-small room-watch${i === index && tl === 'loading' ? ' is-loading' : ''}`}
          data-on={i === index && tl !== 'idle' ? '' : undefined}
          onClick={() => (tl === 'idle' ? tlHandle.current?.start() : tlHandle.current?.stop())}
        >
          {/* the button says what it will do: start the recording, or go back to the drawing */}
          {i === index && tl !== 'idle' ? (
            <span>Show the drawing</span>
          ) : (
            <>
              {ICON_WATCH}
              <span>{i === index && watched ? 'Watch it again' : 'Watch it being made'}</span>
              <span className="room-watch-time" aria-hidden="true">
                {clock(p.timelapse.duration)}
              </span>
              <span className="sr-only">, {Math.round(p.timelapse.duration)} seconds</span>
            </>
          )}
          <span className="lu-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
      )}
    </div>
  );

  const storyPlate = (
    <div className="room-plate">
      <h2 id="room-title-story">{series.title}</h2>
      <p className="room-meta">
        {series.medium} · {series.year} · {series.panels.length} panels
      </p>
      <p className="room-note">{series.note}</p>
      <div className="room-panels" role="group" aria-label="Panels">
        {series.panels.map((p, k) => (
          <button
            type="button"
            key={p.image}
            className="room-panel"
            aria-label={`Panel ${k + 1}`}
            aria-current={k === index ? 'step' : undefined}
            style={{ '--ar': (p.width / p.height).toFixed(4) } as CSSProperties}
            onClick={() => go(k)}
          >
            {thumbs.current[k] ? <img src={thumbs.current[k]} alt="" /> : <span>{k + 1}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const announcement = !view
    ? ''
    : view.set === 'story'
      ? `Panel ${index + 1} of ${count}`
      : `${pieces[index].title}, ${index + 1} of ${count}`;

  return (
    <dialog
      ref={dialog}
      className="room"
      tabIndex={-1}
      data-set={view?.set}
      aria-labelledby={view ? (view.set === 'story' ? 'room-title-story' : `room-title-${index}`) : undefined}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      /* closed by the browser itself (a second Esc while the first is animating): tidy up at once */
      onClose={finish}
    >
      {view && (
        <>
          <div className="lu-lightbox-bg room-bg" ref={bg} />
          <div className="lu-lightbox-bar room-bar" ref={bar}>
            <button
              type="button"
              className="lu-btn is-quiet is-icon is-small"
              data-a="prev"
              aria-label={view.set === 'story' ? 'Previous panel' : 'Previous drawing'}
              aria-disabled={index === 0}
              onClick={() => go(index - 1)}
            >
              {ICON_L}
            </button>
            <span className="lu-lightbox-count room-count" aria-hidden="true">
              {index + 1} of {count}
            </span>
            <button
              type="button"
              className="lu-btn is-quiet is-icon is-small"
              data-a="next"
              aria-label={view.set === 'story' ? 'Next panel' : 'Next drawing'}
              aria-disabled={index === count - 1}
              onClick={() => go(index + 1)}
            >
              {ICON_R}
            </button>
            <button type="button" className="lu-btn is-quiet is-icon is-small" data-a="close" aria-label="Close" onClick={close}>
              {ICON_X}
            </button>
          </div>
          <p className="sr-only" aria-live="polite">
            {announcement}
          </p>

          <div className="room-layout">
            <div
              className="room-stage"
              ref={stage}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onWheel={onWheel}
              onPointerCancel={() => {
                drag.current = null;
                pos.current?.to(index);
              }}
            >
              <div className="room-track" ref={track}>
                {slides.map((s, i) => {
                  const w = widths[i];
                  const big = w > 0 && wanted.has(i) ? fullImage(s, w) : null;
                  const piece = view.set === 'pieces' ? pieces[i] : null;
                  const tlp = piece && i === index ? piece.timelapse : undefined;
                  return (
                    <div
                      className="room-slide"
                      key={s.src}
                      role="group"
                      aria-roledescription={view.set === 'story' ? 'panel' : 'drawing'}
                      aria-label={`${i + 1} of ${count}`}
                      aria-hidden={i !== index}
                      inert={i !== index}
                    >
                      <div className="room-frame">
                        <div
                          className="room-mat"
                          ref={(el) => {
                            mats.current[i] = el;
                          }}
                          data-video={tlp && (tl === 'playing' || tl === 'paused') ? 'on' : undefined}
                          style={{ '--ar': (s.width / s.height).toFixed(4), '--nat': `${s.width}px` } as CSSProperties}
                        >
                          <div className="room-art" role="img" aria-label={s.alt}>
                            {thumbs.current[i] && <img className="room-thumb" src={thumbs.current[i]} alt="" draggable={false} />}
                            {big && (
                              <img
                                className="room-full"
                                {...big}
                                alt=""
                                draggable={false}
                                decoding="async"
                                onLoad={(e) => {
                                  const src = e.currentTarget.currentSrc;
                                  setLoaded((l) => (l[i] === src ? l : { ...l, [i]: src }));
                                }}
                                data-loaded={loaded[i] ? '' : undefined}
                              />
                            )}
                          </div>
                          {piece && tlp && (
                            <Timelapse
                              key={tlp.src}
                              src={tlp.src}
                              width={tlp.width}
                              height={tlp.height}
                              poster={loaded[i] || thumbs.current[i] || undefined}
                              duration={tlp.duration}
                              title={piece.title}
                              handle={tlHandle}
                              onState={onTlState}
                              onEnd={onTlEnd}
                            />
                          )}
                        </div>
                      </div>
                      {piece && piecePlate(piece, i)}
                    </div>
                  );
                })}
              </div>
            </div>
            {view.set === 'story' && <div className="room-label">{storyPlate}</div>}
          </div>
        </>
      )}
    </dialog>
  );
}
