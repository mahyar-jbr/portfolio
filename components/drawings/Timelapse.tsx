'use client';

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { clock } from './shared';

/**
 * The recording of a piece being drawn, played on the piece itself: the video
 * lies over the drawing in its mat, and a glass capsule floats on it with play,
 * a scrubber and the time (glass is for controls over content).
 *
 * It is only ever asked for: nothing loads until "Watch it being made" is
 * pressed (the video has no src before that), and it plays once. Its poster is
 * the drawing already on screen, which is also its first frame, so it arrives
 * without a flash and costs nothing extra. When it ends it gives way to the
 * finished drawing again. It pauses while the tab is hidden and stops (and
 * stops downloading) when the piece is left or the room closes.
 */
export type TimelapseState = 'idle' | 'loading' | 'playing' | 'paused';

export interface TimelapseHandle {
  /** Starts it. Called inside the press, so browsers treat it as asked for. */
  start(): void;
  /** Back to the drawing. */
  stop(): void;
}

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
  const [time, setTime] = useState(0);
  const scrubbing = useRef(false);
  const report = useRef(onState);
  report.current = onState;
  const ended = useRef(onEnd);
  ended.current = onEnd;

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
      set('playing');
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const onPause = () => {
      if (v.ended || !v.getAttribute('src')) return;
      set('paused');
    };
    /* it plays once, then gives the room back to the finished drawing */
    const onEnded = () => {
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
        v.play().catch(() => {});
      }
    };

    handle.current = {
      start() {
        if (!v.getAttribute('src')) v.src = src;
        else v.currentTime = 0;
        setTime(0);
        set('loading');
        /* refused (Low Power Mode, a blocked play): the capsule stays, paused, for a second try */
        v.play().catch(() => set('paused'));
      },
      stop() {
        v.pause();
        set('idle');
      },
    };

    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
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
    if (v.paused) v.play().catch(() => {});
    else v.pause();
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
      <div className="room-player" data-shown={shown || undefined} role="group" aria-label={`Time-lapse of ${title}`} inert={!shown}>
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
