'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { expectArrival, journeyTo, warm } from '@/lib/journey';
import { navigate } from '@/lib/lucent';
import LinkOut, { isOffsite } from './LinkOut';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/**
 * Every internal link on the site. Two behaviours the kit asks for:
 *
 * - In-page anchors (#work) take the page to the section on a journey
 *   (lib/journey.ts) instead of jumping, and leave the URL alone — the kit's
 *   data-scroll-to behaviour.
 * - Route changes play the Lucent page swap (Lucent.transition): old view out in
 *   dur-exit, new view up 8px in dur-enter. One to a section of another page
 *   (/#work from a case study) arrives on the section inside the swap.
 *
 * Pointing at an in-page anchor (or focusing it) starts loading the images the
 * page will land among.
 *
 * Modified clicks, other origins and explicit targets fall through to the browser.
 * An href to another site is handed to LinkOut, so it opens in a new tab even
 * when it comes through here (a Button, a card).
 */
export default function TransitionLink({ href, onClick, onPointerEnter, onFocus, ...rest }: Props) {
  const router = useRouter();
  if (isOffsite(href)) {
    return <LinkOut href={href} onClick={onClick} onPointerEnter={onPointerEnter} onFocus={onFocus} {...rest} />;
  }

  /** The section an in-page anchor goes to, if this is one. */
  function section(): HTMLElement | null {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return null;
    return document.getElementById(decodeURIComponent(url.hash.slice(1)));
  }

  function intent() {
    const target = section();
    if (target) warm(target);
  }

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (url.pathname === window.location.pathname) {
      const target = section();
      if (!target) return;
      e.preventDefault();
      journeyTo(target);
      return;
    }

    e.preventDefault();
    if (url.hash) expectArrival(url.pathname, url.hash);
    navigate((to) => router.push(to), href);
  }

  return (
    <Link
      href={href}
      onClick={handle}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        intent();
      }}
      onFocus={(e) => {
        onFocus?.(e);
        intent();
      }}
      {...rest}
    />
  );
}
