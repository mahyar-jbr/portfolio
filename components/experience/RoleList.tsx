import { ToolTag } from '@/components/lucent/Tag';
import type { Role } from '@/content/types';
import CompanyTile from './CompanyTile';
import ExperienceMotion from './ExperienceMotion';

/**
 * The roles as one roll, every entry open, laid out the way Apple lists its
 * Design Award apps: the company's app icon, and beside it the role's whole
 * story. Nothing opens and nothing hides, because a skim is exactly when a
 * reader needs the lot: the left edge is the skim (five icons, five titles,
 * each with its company and dates), and the read sits right beside it.
 *
 * Each role is a real heading, so a screen reader can jump from role to role,
 * and all of it is plain selectable text. The server renders the finished
 * state; ExperienceMotion only draws Pet Valu's ladder as it arrives, and
 * stands in for a logo that fails to load.
 */
export default function RoleList({ id, roles }: { id: string; roles: Role[] }) {
  return (
    <>
      <ol className="xp-roll" id={id}>
        {roles.map((r) => {
          const slug = `xp-${r.company.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
          /* the organisation leads its line in ink; after the first " · " comes
             where it is, or, for the lab, whose it is */
          const org = r.subline ?? `${r.company} · ${r.location}`;
          const cut = org.indexOf(' · ');
          return (
            <li className="xp-entry" key={r.company} data-reveal="">
              <article className="xp-art" aria-labelledby={slug}>
                <CompanyTile role={r} />
                <header className="xp-head">
                  <h3 className="xp-role" id={slug}>
                    {r.title}
                  </h3>
                  <p className="xp-org">
                    {cut < 0 ? (
                      <span className="xp-co">{org}</span>
                    ) : (
                      <>
                        <span className="xp-co">{org.slice(0, cut)}</span>
                        {' · '}
                        <span className="xp-at">{org.slice(cut + 3)}</span>
                      </>
                    )}
                  </p>
                  <p className="xp-when">
                    {/* the current role: an ink capsule, never the kit's green status */}
                    {r.current && <span className="xp-now">Now</span>}
                    {/* a subline took the location's place on the line above, so it sits by the dates */}
                    <span>{r.subline ? `${r.period} · ${r.location}` : r.period}</span>
                  </p>
                  {/* a promotion belongs to the skim: the head, not the read */}
                  {r.positions && r.positions.length > 1 && <Ladder positions={r.positions} />}
                </header>
                <div className="xp-read">
                  <p className="xp-context">{r.context}</p>
                  {r.bullets.length > 0 && (
                    <ul className="xp-points">
                      {r.bullets.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                  {r.stack && r.stack.length > 0 && (
                    <ul className="xp-stack" aria-label="Tools">
                      {r.stack.map((t) => (
                        <li key={t}>
                          <ToolTag name={t} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>
      <ExperienceMotion root={`#${id}`} />
    </>
  );
}

/**
 * A promotion inside one role, as a climb: the titles newest first, each with
 * the month it began, on one rail, the latest node filled in ink and the
 * earlier one hollow. As it scrolls into view the rail draws upward from the
 * first title, and the top node fills once it gets there.
 */
function Ladder({ positions }: { positions: NonNullable<Role['positions']> }) {
  return (
    <ol className="xp-ladder" aria-label="Positions">
      {positions.map((p, i) => (
        <li key={p.title} className={i === 0 ? 'is-latest' : undefined}>
          <span className="xp-node" aria-hidden="true" />
          <span className="xp-step">{p.title}</span>
          <span className="xp-since">
            <span className="sr-only">, from </span>
            {p.since}
          </span>
        </li>
      ))}
    </ol>
  );
}
