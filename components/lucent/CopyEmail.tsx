'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * CopyEmail — the email tile's Copy button (components/lucent/ContactTiles.tsx).
 *
 * It does what the kit's data-copy/data-toast wiring does (copy, then the
 * "Email copied" toast, or the address itself in a toast if the clipboard is
 * refused), and it also says "Copied" on the button for as long as the toast
 * stays. On a phone the eye and thumb are on the button, and the toast lands
 * well above it; iOS shows nothing of its own when a page copies.
 *
 * It stays a .lu-btn, so Lucent.auto() still gives it the soft press and the
 * .lu-jelly class that lets it show (styles/site.css): no Copy without the
 * kit's runtime, whose toast it uses.
 */
export default function CopyEmail({ address }: { address: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  function refused() {
    window.Lucent?.toast(address, { icon: false, duration: 6000 });
  }

  function copy() {
    if (!navigator.clipboard?.writeText) return refused();
    navigator.clipboard.writeText(address).then(() => {
      window.Lucent?.toast('Email copied');
      setCopied(true);
      clearTimeout(timer.current);
      const hold = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--dur-toast')) || 2800;
      timer.current = setTimeout(() => setCopied(false), hold);
    }, refused);
  }

  return (
    <button
      type="button"
      className="lu-btn is-small contact-copy"
      data-copied={copied || undefined}
      aria-label="Copy email address"
      onClick={copy}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g className="copy-glyph">
          <rect x="8" y="8" width="13" height="13" rx="3" />
          <path d="M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2" />
        </g>
        <path className="copy-done" d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
      {/* both words share one cell, so the pill keeps the wider one's width */}
      <span className="copy-words" aria-hidden="true">
        <span className="copy-word">Copy</span>
        <span className="copy-done">Copied</span>
      </span>
    </button>
  );
}
