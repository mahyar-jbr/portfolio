import type { ReactNode } from 'react';
import LinkOut from './LinkOut';
import TransitionLink from './TransitionLink';

/**
 * Button — the Lucent pill with the soft press (Lucent.auto wires every .lu-btn).
 *
 * is-filled: the one primary per view (accent ink fill) · is-glass: secondary,
 * over imagery · is-quiet: tertiary, text only. Labels start with a verb, in
 * sentence case. Never two filled buttons side by side.
 *
 * With `href` it renders a link (internal ones get the page swap, or the journey
 * to a section of this page; ones to other sites open in a new tab); without, a
 * <button>.
 * `external` is for a link the router can't take, such as the resume PDF.
 */
type Variant = 'filled' | 'glass' | 'quiet';

interface Props {
  variant: Variant;
  small?: boolean;
  href?: string;
  external?: boolean;
  children: ReactNode;
  'aria-label'?: string;
}

export default function Button({ variant, small, href, external, children, ...aria }: Props) {
  const className = `lu-btn is-${variant}${small ? ' is-small' : ''}`;
  if (href && external) {
    return (
      <LinkOut className={className} href={href} {...aria}>
        {children}
      </LinkOut>
    );
  }
  if (href) {
    return (
      <TransitionLink className={className} href={href} {...aria}>
        {children}
      </TransitionLink>
    );
  }
  return (
    <button type="button" className={className} {...aria}>
      {children}
    </button>
  );
}
