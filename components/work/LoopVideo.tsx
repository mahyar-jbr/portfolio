'use client';

import { useEffect, useRef } from 'react';
import type { CardVideo } from '@/content/types';

/**
 * A soon card's banner: a short silent loop filling the card's art. It plays
 * only while the card is on screen and the tab is showing, and never under
 * reduced motion, where the poster (the loop's first frame) stands in. The
 * server markup has no autoplay, and without scripts the poster shows as a
 * plain image, so nothing moves. Below the fold, the file waits (preload none)
 * until the card is a screen away, so the loop is ready by the time it arrives.
 *
 * Decorative: the caption beside it names the project. So it is hidden from
 * screen readers, has no controls, and takes neither focus nor the pointer
 * (site.css .art-video).
 */
export default function LoopVideo({ video }: { video: CardVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const still = matchMedia('(prefers-reduced-motion: reduce)');
    let onScreen = false;

    const sync = () => {
      if (onScreen && !document.hidden && !still.matches) {
        /* refused (Low Power Mode, a blocked autoplay): the poster just stays */
        v.play().catch(() => {});
        return;
      }
      v.pause();
      /* back to the first frame, which is the poster, once motion is turned off */
      if (still.matches && v.readyState > 0) v.currentTime = 0;
    };

    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || still.matches) return;
        v.preload = 'auto';
        near.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    const seen = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      sync();
    });
    near.observe(v);
    seen.observe(v);
    document.addEventListener('visibilitychange', sync);
    still.addEventListener('change', sync);
    return () => {
      near.disconnect();
      seen.disconnect();
      document.removeEventListener('visibilitychange', sync);
      still.removeEventListener('change', sync);
      v.pause();
    };
  }, []);

  return (
    <>
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        width={video.width}
        height={video.height}
        muted
        loop
        playsInline
        preload="none"
        disablePictureInPicture
        aria-hidden="true"
      />
      {/* Without scripts a browser may hand the video its own controls (Chrome
          does), so there the video steps aside for its poster (site.css). */}
      <noscript>
        <img src={video.poster} alt="" width={video.width} height={video.height} />
      </noscript>
    </>
  );
}
