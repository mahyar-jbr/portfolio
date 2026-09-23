'use client';

import { useEffect, useState } from 'react';

/**
 * A quiet local clock whose digits roll into place when the minute changes —
 * the numeric-text transition of the iOS Clock and Lock Screen. It replaces
 * the kit's Lucent.liveTime for the hero (which swaps the text outright).
 *
 * Every character sits in the same clipped box (.clock-ch). A digit's box is a
 * window onto a 0–9 strip that slides to the new value on the kit's spring
 * easing; separators and "a.m./p.m." stay still. Under reduced motion the
 * digits change in place. Screen readers get the plain time once, not the
 * strips. Empty until mounted, so server and client markup agree.
 */
const fmt = (tz: string) =>
  new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit', timeZone: tz });

const NBSP = ' ';

export default function LiveClock({ timeZone }: { timeZone: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    let interval = 0;
    /* tick on the minute, not 60s after load, so it changes when a clock would */
    const timeout = window.setTimeout(() => {
      setNow(new Date());
      interval = window.setInterval(() => setNow(new Date()), 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  if (!now) return <time className="hero-clock" />;
  const text = fmt(timeZone).format(now);

  return (
    <time className="hero-clock" dateTime={now.toISOString()}>
      <span className="sr-only">{text}</span>
      <span className="clock-face" aria-hidden="true">
        {[...text].map((ch, i) =>
          /\d/.test(ch) ? (
            <span className="clock-ch" key={`${i}-${text.length}`}>
              <span className="clock-strip" style={{ translate: `0 calc(${-Number(ch)} * var(--clock-lh))` }}>
                0<br />1<br />2<br />3<br />4<br />5<br />6<br />7<br />8<br />9
              </span>
            </span>
          ) : (
            <span className="clock-ch" key={`${i}-${text.length}`}>
              {/\s/.test(ch) ? NBSP : ch}
            </span>
          ),
        )}
      </span>
    </time>
  );
}
