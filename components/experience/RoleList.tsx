import type { CSSProperties } from 'react';
import Glyph from '@/components/lucent/Glyph';
import { ToolTag } from '@/components/lucent/Tag';
import type { Role } from '@/content/types';
import CompanyTile from './CompanyTile';
import ExperienceMotion from './ExperienceMotion';

/**
 * The roles as one iOS inset grouped list, the sibling of the hero's details
 * card: a solid card of rows split by inset hairlines, each row led by its
 * company's app icon. The closed list is the skim (logo, role, company,
 * dates); each row opens in place to the read.
 *
 * Every row is a native <details>, so with scripts blocked each still opens,
 * by itself, and the whole list reads. ExperienceMotion adds the spring.
 */
export default function RoleList({ id, roles }: { id: string; roles: Role[] }) {
  return (
    <>
      <ol className="xp-group" id={id}>
        {roles.map((r) => (
          <li className="xp-li" key={r.company} data-reveal="">
            <details className="xp-item">
              <summary className="xp-row">
                <CompanyTile role={r} />
                <span className="xp-main">
                  <span className="xp-role">{r.title}</span>
                  <span className="xp-org">{r.subline ?? `${r.company} · ${r.location}`}</span>
                </span>
                <span className="xp-when">
                  {/* the current role: a quiet grey tag, not the kit's green status */}
                  {r.current && <span className="lu-tag xp-now">Now</span>}
                  {r.period}
                </span>
                <span className="xp-chev">
                  <Glyph name="chevron-down" />
                </span>
              </summary>
              <div className="xp-body">
                <div className="xp-body-inner">
                  <RoleBody role={r} />
                </div>
              </div>
            </details>
          </li>
        ))}
      </ol>
      <ExperienceMotion root={`#${id}`} />
    </>
  );
}

/**
 * The read: a promotion first when the role had one, then what he did (verb
 * first), then up to four of the tools, each with its real mark. A role with no
 * bullets yet opens to its one line of context rather than to invented
 * responsibilities.
 */
function RoleBody({ role }: { role: Role }) {
  const lines = role.bullets.length ? role.bullets : [role.context];
  return (
    <>
      {role.positions && role.positions.length > 1 && <Promotion positions={role.positions} />}
      <ul className="xp-points">
        {lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {role.stack && role.stack.length > 0 && (
        <div className="xp-stack">
          {role.stack.slice(0, 4).map((t) => (
            <ToolTag key={t} name={t} />
          ))}
        </div>
      )}
    </>
  );
}

/**
 * A promotion inside one role, told in the order it happened: each title with
 * the month it began, on one track that ends at the latest title. When the row
 * opens, the track draws from the first title to the next.
 */
function Promotion({ positions }: { positions: NonNullable<Role['positions']> }) {
  const steps = [...positions].reverse();
  return (
    <ol className="xp-promo" style={{ '--n': steps.length } as CSSProperties}>
      {steps.map((p, i) => (
        <li key={p.title} className={i === steps.length - 1 ? 'xp-promo-step is-latest' : 'xp-promo-step'}>
          <span className="xp-promo-node" aria-hidden="true" />
          <span className="xp-promo-title">{p.title}</span>
          <span className="xp-promo-when">
            <span className="sr-only">from </span>
            {p.since}
          </span>
        </li>
      ))}
    </ol>
  );
}
