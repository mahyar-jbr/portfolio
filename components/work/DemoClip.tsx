'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Clip } from '@/content/types';

/**
 * A short clip from the day a project was shown, the lead figure of its "Demo
 * day". It plays once, muted (the file has no sound), when it is half on
 * screen, and comes to rest on its last frame; a glass button in its corner
 * (glass is for controls over content) pauses it, plays it, or plays it again.
 * It pauses while it is off screen or the tab is hidden, and picks up where it
 * left off when it is back.
 *
 * Its still, that last frame, lies over it until it plays: before the file has
 * loaded (nothing loads until it is a screen away), under reduced motion, where
 * nothing starts on its own and the button is the way to watch it, and without
 * scripts, where the video and the button step aside (site.css). When it
 * starts, the still dissolves into the first frame rather than cutting to it.
 * The still carries the alt text, so the video is hidden from screen readers.
 */

type State = 'rest' | 'loading' | 'playing' | 'paused' | 'ended';

/** What happens next: 'auto' plays it once it's seen (never under reduced motion), 'play' is the visitor's ask, 'hold' waits for them. */
type Want = 'auto' | 'play' | 'hold';

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
/* Lucide rotate-ccw, the kit's icon geometry on the web */
const ICON_REPLAY = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export default function DemoClip({ clip }: { clip: Clip }) {
  const video = useRef<HTMLVideoElement>(null);
  const still = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<State>('rest');
  const want = useRef<Want>('auto');
  /* the effect's sync, for the button to call */
  const sync = useRef(() => {});

  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const calm = matchMedia('(prefers-reduced-motion: reduce)');
    /* half on screen: it may start. Wholly off it: it pauses. In between it carries on. */
    let seen = false;
    let gone = true;

    const start = () => {
      setState((s) => (s === 'paused' ? s : 'loading'));
      v.play().catch((e: DOMException) => {
        /* refused (Low Power Mode, a blocked autoplay): the still stays, with the
           button to try again. An AbortError is only a pause cutting in. */
        if (e.name !== 'NotAllowedError') return;
        want.current = 'hold';
        setState('rest');
      });
    };

    const run = () => {
      if (gone || document.hidden || want.current === 'hold' || (want.current === 'auto' && calm.matches)) {
        if (!v.paused) v.pause();
        return;
      }
      if (v.paused && (seen || want.current === 'play')) start();
    };
    sync.current = run;

    const onPlaying = () => setState('playing');
    const onPause = () => {
      if (!v.ended) setState('paused');
    };
    const onEnded = () => {
      want.current = 'hold';
      setState('ended');
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || calm.matches) return;
        v.preload = 'auto';
        near.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    const view = new IntersectionObserver(
      ([e]) => {
        seen = e.intersectionRatio >= 0.5;
        gone = !e.isIntersecting;
        run();
      },
      { threshold: [0, 0.5] },
    );
    near.observe(v);
    view.observe(v);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);
    document.addEventListener('visibilitychange', run);
    calm.addEventListener('change', run);
    return () => {
      near.disconnect();
      view.disconnect();
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      document.removeEventListener('visibilitychange', run);
      calm.removeEventListener('change', run);
      v.pause();
    };
  }, []);

  /* On a replay the video can report 'playing' before the browser has styled
     the still back in, and then there is nothing to dissolve from (Chromium,
     with the file cached): style it in now. */
  useLayoutEffect(() => {
    if (state === 'loading' && still.current) void getComputedStyle(still.current).opacity;
  }, [state]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (state === 'playing' || state === 'loading') {
      want.current = 'hold';
      v.pause();
      return;
    }
    want.current = 'play';
    /* again from the top: the still (the frame it rests on) comes back first, so the restart dissolves too */
    if (state === 'ended') {
      setState('loading');
      v.currentTime = 0;
    }
    /* inside the press, so the browser counts the play as asked for */
    sync.current();
  };

  const busy = state === 'playing' || state === 'loading';
  return (
    <figure className="lu-shot case-clip" data-state={state}>
      <div className="case-clip-frame" style={{ aspectRatio: `${clip.width} / ${clip.height}` }}>
        <video
          ref={video}
          src={clip.src}
          poster={clip.still}
          width={clip.width}
          height={clip.height}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
        />
        {/* the file is already the size it shows at, and it is the video's poster too, so it loads once */}
        <img
          ref={still}
          className="case-clip-still"
          src={clip.still}
          alt={clip.alt}
          width={clip.width}
          height={clip.height}
          loading="lazy"
          decoding="async"
        />
        <button
          type="button"
          className="lu-btn is-glass is-icon is-small case-clip-button"
          aria-label={busy ? 'Pause the clip' : state === 'ended' ? 'Play the clip again' : 'Play the clip'}
          onClick={toggle}
        >
          {busy ? ICON_PAUSE : state === 'ended' ? ICON_REPLAY : ICON_PLAY}
        </button>
      </div>
    </figure>
  );
}
