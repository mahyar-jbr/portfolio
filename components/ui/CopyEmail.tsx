'use client';

import { useState } from 'react';

/**
 * Click-to-copy email.
 *
 * The address is rendered as real text rather than hidden behind an icon, so it
 * survives a screenshot — which is how a portfolio link most often gets passed
 * on. Falls back to a mailto if the clipboard API is unavailable or blocked.
 *
 * The label swaps in place with a fixed width, so the button never reflows
 * mid-interaction.
 */
export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy email address ${email}`}
      className="btn-press sq group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-pill border border-n-6 bg-n-2 px-5 text-[15px] text-n-11 shadow-e1 hover:border-n-8 hover:bg-n-1 hover:text-ink hover:shadow-e2"
    >
      <span
        className="inline-flex items-center gap-2 transition-[opacity,transform]"
        style={{
          opacity: copied ? 0 : 1,
          transform: copied ? 'translateY(-130%)' : 'none',
          transitionDuration: 'var(--dur-hover)',
          transitionTimingFunction: 'var(--spring-hover)',
        }}
      >
        <span className="font-mono text-[13px]">{email}</span>
      </span>

      <span
        aria-hidden="true"
        className="absolute inset-0 inline-flex items-center justify-center gap-2 text-olive transition-[opacity,transform]"
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? 'none' : 'translateY(130%)',
          transitionDuration: 'var(--dur-hover)',
          transitionTimingFunction: 'var(--spring-hover)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 16 16">
          <path
            d="M3.5 8.5l3 3 6-6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[15px] font-medium">Copied</span>
      </span>
    </button>
  );
}
