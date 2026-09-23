import type { ReactNode } from 'react';

/**
 * Section — the kit's page frame: .lu-section inside a .lu-page column, headed by
 * a mono kicker and a title (.lu-head). `aside` sits at the head's right edge
 * (filter chips, a quiet link). `reveal` rises the section in as it scrolls into
 * view; content already on screen never hides.
 */
export default function Section({
  id,
  kicker,
  title,
  lede,
  aside,
  reveal = false,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  lede?: string;
  aside?: ReactNode;
  reveal?: boolean;
  children: ReactNode;
}) {
  return (
    <section className="lu-section" id={id} aria-labelledby={`${id}-title`} data-reveal={reveal ? '' : undefined}>
      <div className="lu-page">
        <div className="lu-head">
          <div>
            <p className="lu-kicker">{kicker}</p>
            <h2 className="lu-title" id={`${id}-title`}>
              {title}
            </h2>
            {lede && <p className="lu-lede">{lede}</p>}
          </div>
          {aside}
        </div>
        {children}
      </div>
    </section>
  );
}
