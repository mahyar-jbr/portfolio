'use client';

import { usePathname } from 'next/navigation';
import { useRef } from 'react';
import NavHover from './NavHover';
import TransitionLink from './TransitionLink';

/**
 * NavBar — the floating glass capsule. Lucent.auto() adds the liquid lens, the
 * soft press on each item, and `data-compact` (tightens scrolling down, opens
 * scrolling up). The lens follows the section in view on the home page; on other
 * pages the runtime clears it, since no item matches. Under a mouse or trackpad,
 * NavHover adds a soft pill under the item the pointer is on.
 *
 * Items keep the same <a> elements across routes (only href changes), because
 * the lens holds on to the elements it measured at wiring time.
 */
export default function NavBar({
  brand,
  items,
}: {
  brand: string;
  items: { id: string; label: string }[];
}) {
  const home = usePathname() === '/';
  const nav = useRef<HTMLElement>(null);
  return (
    <div className="site-nav">
      <nav ref={nav} className="lu-nav" data-compact="" aria-label="Main">
        {/* The name alone: the mark lives in the hero now (Mahyar, 2026-09-22). */}
        <TransitionLink className="lu-nav-brand" href={home ? '#top' : '/'}>
          {brand}
        </TransitionLink>
        {items.map((item, i) => (
          <TransitionLink
            key={item.id}
            className="lu-nav-item"
            href={home ? `#${item.id}` : `/#${item.id}`}
            aria-current={home && i === 0 ? 'page' : undefined}
            data-jelly="0.5"
          >
            {item.label}
          </TransitionLink>
        ))}
      </nav>
      <NavHover nav={nav} />
    </div>
  );
}
