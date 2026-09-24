'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { prefersReducedMotion } from '@/lib/lucent';
import { clock } from './shared';

/**
 * The recording of a piece being drawn, played on the piece itself: the video
 * lies over the drawing in its mat, and a glass capsule floats on it with play,
 * a scrubber and the time (glass is for controls over content).
 *
 * It is only ever asked for: nothing loads until "Watch it being made" is
 * pressed (the video has no src before that), and it plays once. Its poster is
 * the drawing already on screen, so it costs nothing extra. The recordings open
 * on the finished drawing before the canvas clears, but that opening frame is
 * the drawing app's export, not the scan: close for The Pilgrim and Fracture,
 * a little off for What Remains, and for Coronation heavier in line and a
 * touch narrower. So the video dissolves in over the drawing when it starts
 * playing (site.css, .room-video) rather than cutting to it, and dissolves out
 * again when it ends and gives way to the finished drawing. It pauses while
 * the tab is hidden and stops (and stops downloading) when the piece is left
 * or the room closes.
 *
 * While it plays, the capsule steps aside after a moment, so the drawing
 * being made shows whole (on a phone the capsule covers a good part of it); a
 * move of the pointer over the drawing or a tap on it brings the capsule back,
 * and so does a pause. It stays while the pointer is on it or it holds
 * keyboard focus, and always under reduced motion, where nothing goes on its
 * own.
 */
export type TimelapseState = 'idle' | 'loading' | 'playing' | 'paused';

export interface TimelapseHandle {
  /** Starts it. Called inside the press, so browsers treat it as asked for. */
  start(): void;
  /** Back to the drawing. */
  stop(): void;
}

/** How long the capsule stays over a playing recording that nobody is touching, in ms. */
const REST_AFTER = 2500;

const ICON_PLAY = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
  </svg>
);
const ICON_PAUSE = (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8 5.5h2.8v13H8zM13.2 5.5H16v13h-2.8z" fill="currentColor" />
  </svg>
);

export default function Timelapse({
  src,
  width,
  height,
  poster,
  duration,
  title,
  handle,
  onState,
  onEnd,
}: {
  src: string;
  width: number;
  height: number;
  poster?: string;
  duration: number;
  title: string;
  handle: RefObject<TimelapseHandle | null>;
  onState: (s: TimelapseState) => void;
  /** it played to the end */
  onEnd: () => void;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<TimelapseState>('idle');
  /* What the viewer last asked for. The video's own events arrive a task
     later, so a pause (or a play) the page asked for before "Show the
     drawing" can't bring the player back after it. */
  const want = useRef<'play' | 'idle'>('idle');
  const [time, setTime] = useState(0);
  const scrubbing = useRef(false);
  const report = useRef(onState);
  report.current = onState;
  const ended = useRef(onEnd);
  ended.current = onEnd;
  const [resting, setResting] = useState(false);
  const restTimer = useRef(0);
  const playing = useRef(false);
  /** what keeps the capsule up while it plays: the pointer on it, or keyboard focus in it */
  const held = useRef({ pointer: false, keys: false });

  /* the capsule back, and (playing, and nothing holding it) stepping aside again in a moment */
  const wake = useCallback(() => {
    clearTimeout(restTimer.current);
    setResting(false);
    if (playing.current && !held.current.pointer && !held.current.keys && !prefersReducedMotion())
      restTimer.current = window.setTimeout(() => setResting(true), REST_AFTER);
  }, []);
  useEffect(() => {
    playing.current = state === 'playing';
    wake();
  }, [state, wake]);

  const set = (s: TimelapseState) => {
    setState(s);
    report.current(s);
  };

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    let raf = 0;
    let resumeOnShow = false;

    const tick = () => {
      if (!scrubbing.current) setTime(v.currentTime);
      raf = v.paused ? 0 : requestAnimationFrame(tick);
    };
    const onPlaying = () => {
      if (want.current === 'idle') return;
      set('playing');
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      if (v.ended || !v.getAttribute('src') || want.current === 'idle') return;
      set('paused');
    };
    /* it plays once, then gives the room back to the finished drawing */
    const onEnded = () => {
      want.current = 'idle';
      setTime(v.duration || duration);
      set('idle');
      ended.current();
    };
    const onVisibility = () => {
      if (document.hidden) {
        resumeOnShow = !v.paused;
        v.pause();
      } else if (resumeOnShow) {
        resumeOnShow = false;
        if (want.current === 'play') v.play().catch(() => {});
      }
    };

    handle.current = {
      start() {
        want.current = 'play';
        if (!v.getAttribute('src')) v.src = src;
        else v.currentTime = 0;
        setTime(0);
        set('loading');
        /* refused (Low Power Mode, a blocked play): the capsule stays, paused, for a second try;
           cut short by "Show the drawing" while it loads: nothing to show */
        v.play().catch(() => {
          if (want.current !== 'idle') set('paused');
        });
      },
      /* final: whatever the video reports after this, the room shows the drawing */
      stop() {
        want.current = 'idle';
        v.pause();
        set('idle');
      },
    };

    /* The pointer moving over the drawing (moving: a cursor resting on it sends none), or a tap or click on
       it. A finger wakes it on the click, once the tap is over, so the tap that brings the capsule back
       can't also land on a control in it. */
    const mat = v.parentElement;
    let at = '';
    const onMove = (e: PointerEvent) => {
      const here = `${e.clientX},${e.clientY}`;
      if (e.pointerType === 'touch' || here === at) return;
      at = here;
      wake();
    };
    mat?.addEventListener('pointermove', onMove);
    mat?.addEventListener('click', wake);

    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(restTimer.current);
      mat?.removeEventListener('pointermove', onMove);
      mat?.removeEventListener('click', wake);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', onVisibility);
      handle.current = null;
      /* leaving the piece: stop, and stop the download with it */
      v.pause();
      v.removeAttribute('src');
      v.load();
    };
    /* wired once: a player lives for one drawing (keyed by its src) */
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      want.current = 'play';
      v.play().catch(() => {});
    } else v.pause();
  };

  const seek = (t: number) => {
    const v = video.current;
    if (!v) return;
    setTime(t);
    v.currentTime = t;
  };

  const shown = state !== 'idle';
  const total = video.current?.duration || duration;

  return (
    <>
      <video
        ref={video}
        className="room-video"
        width={width}
        height={height}
        poster={poster}
        muted
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      />
      <div
        className="room-player"
        data-shown={shown || undefined}
        data-resting={(shown && resting) || undefined}
        role="group"
        aria-label={`Time-lapse of ${title}`}
        inert={!shown}
        onPointerEnter={() => {
          held.current.pointer = true;
          wake();
        }}
        onPointerLeave={() => {
          held.current.pointer = false;
          wake();
        }}
        /* focus from the keyboard holds it up; a click (which focuses a button in some browsers) doesn't */
        onFocus={(e) => {
          held.current.keys = e.target.matches(':focus-visible');
          wake();
        }}
        onBlur={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
          held.current.keys = false;
          wake();
        }}
      >
        <button
          type="button"
          className="lu-btn is-quiet is-icon is-small"
          aria-label={state === 'playing' || state === 'loading' ? 'Pause' : 'Play'}
          onClick={toggle}
        >
          {state === 'playing' || state === 'loading' ? ICON_PAUSE : ICON_PLAY}
        </button>
        <input
          type="range"
          className="room-scrub"
          min={0}
          max={total}
          step={0.1}
          value={Math.min(time, total)}
          aria-label="Position"
          aria-valuetext={`${clock(time)} of ${clock(total)}`}
          style={{ '--p': `${(Math.min(time, total) / total) * 100}%` } as CSSProperties}
          onPointerDown={() => (scrubbing.current = true)}
          onPointerUp={() => (scrubbing.current = false)}
          onPointerCancel={() => (scrubbing.current = false)}
          onChange={(e) => seek(Number(e.currentTarget.value))}
          onKeyDown={(e) => {
            /* a second an arrow, five a page: the 0.1s steps are for the pointer */
            const by = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 5, PageDown: -5 }[e.key];
            if (by === undefined) return;
            e.preventDefault();
            seek(Math.max(0, Math.min(total, (video.current?.currentTime ?? time) + by)));
          }}
        />
        <span className="room-time" aria-hidden="true">
          {clock(time)}
        </span>
      </div>
    </>
  );
}
