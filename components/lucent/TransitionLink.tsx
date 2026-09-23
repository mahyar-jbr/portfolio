'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AnchorHTMLAttributes, MouseEvent } from 'react';
import { navigate, scrollToTarget } from '@/lib/lucent';
import LinkOut, { isOffsite } from './LinkOut';

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

/**
 * Every internal link on the site. Two behaviours the kit asks for:
 *
 * - In-page anchors (#work) scroll smoothly instead of jumping, and leave the URL
 *   alone — the kit's data-scroll-to behaviour.
 * - Route changes play the Lucent page swap (Lucent.transition): old view out in
 *   dur-exit, new view up 8px in dur-enter.
 *
 * Modified clicks, other origins and explicit targets fall through to the browser.
 * An href to another site is handed to LinkOut, so it opens in a new tab even
 * when it comes through here (a Button, a card).
 */
export default function TransitionLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  if (isOffsite(href)) return <LinkOut href={href} onClick={onClick} {...rest} />;

  function handle(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (rest.target && rest.target !== '_self') return;

    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return;

    if (url.pathname === window.location.pathname) {
      if (!url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      return;
    }

    e.preventDefault();
    navigate((to) => router.push(to), href);
  }

  return <Link href={href} onClick={handle} {...rest} />;
}
