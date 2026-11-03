import Glyph from '@/components/lucent/Glyph';
import LinkOut from '@/components/lucent/LinkOut';
import type { BriefNumber, ExternalLink } from '@/content/types';
import RecordLinks from './RecordLinks';

/**
 * The parts of a teaser (a BriefProject whose results are held back), for
 * BriefCase in CaseStudy.tsx: the idea as a diagram, the numbers that are no
 * result, and the credit its data asks for. Quiet on purpose: ink on paper,
 * no card behind the numbers, and the credit in small print at the foot.
 */

/**
 * The diagram under the story, framed as a screenshot is (kit .lu-shot): the
 * dot canvas the card draws it on, and one line under it. The drawing is
 * read out from its alt; the caption is there for everyone.
 */
export function TeaserDiagram({ alt, caption }: { alt: string; caption: string }) {
  return (
    <figure className="lu-shot case-diagram">
      <div className="case-diagram-canvas lu-wall">
        <RecordLinks label={alt} />
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

/**
 * The numbers, large and quiet: each figure over what it counts, read out in
 * that order ("1,489 agent runs"). A fact with no figure in it (how it was
 * tested) closes the row in words, rather than standing in a number's place.
 */
export function TeaserNumbers({ numbers }: { numbers: BriefNumber[] }) {
  const figures = numbers.filter((n) => n.value);
  const words = numbers.filter((n) => !n.value);
  return (
    <div className="case-numbers">
      <ul>
        {figures.map((n) => (
          <li key={n.label}>
            <b>{n.value}</b> <span>{n.label}</span>
          </li>
        ))}
      </ul>
      {words.map((n) => (
        <p key={n.label}>
          <Glyph name="check" />
          {n.label}
        </p>
      ))}
    </div>
  );
}

/**
 * The credit the data's licence asks for, word for word, at the foot of the
 * page: small print, aligned with the story, every source it names a link out
 * (a new tab, LinkOut). Only live links render as links; any other stays words.
 */
export function TeaserCredit({ credit }: { credit: (string | ExternalLink)[] }) {
  /* a div, not a footer: outside a section, a footer would read as a second
     contentinfo landmark beside the site's own */
  return (
    <div className="case-credit">
      <p>
        {credit.map((part, i) =>
          typeof part === 'string' ? (
            part
          ) : part.status === 'live' ? (
            <LinkOut key={i} className="lu-link" href={part.href}>
              {part.label}
            </LinkOut>
          ) : (
            part.label
          ),
        )}
      </p>
    </div>
  );
}
