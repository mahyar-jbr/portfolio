import type { ReactNode } from 'react';
import TransitionLink from './TransitionLink';

/**
 * Button — the Lucent pill with the soft press (Lucent.auto wires every .lu-btn).
 *
 * is-filled: the one primary per view (accent ink fill) · is-glass: secondary,
 * over imagery · is-quiet: tertiary, text only. Labels start with a verb, in
 * sentence case. Never two filled buttons side by side.
 *
 * With `href` it renders a link (internal ones get the page swap and smooth
 * in-page scroll); without, a <button>.
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
      <a className={className} href={href} {...aria}>
        {children}
      </a>
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
