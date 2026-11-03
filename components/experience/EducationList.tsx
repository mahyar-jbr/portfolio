import type { Credential, Education } from '@/content/types';

/**
 * Education — a small group after the roles (2026-11-02, for the COOP 2100
 * ePortfolio): the degree under way, the diploma, and the two certificates, in
 * the roll's own terms (styles/site.css, "Experience"). Each row is the
 * credential in ink, where it is from under it, and when, in the reading path.
 * No icons: only York has a logo, and the other rows would wear empty tiles.
 */
export default function EducationList({
  schools,
  credentials,
}: {
  schools: Education[];
  credentials: Credential[];
}) {
  const rows = [
    ...schools.map((s) => ({ name: s.credential, org: s.institution, when: schoolDates(s) })),
    ...credentials.map((c) => ({ name: c.name, org: c.issuer, when: c.inProgress ? 'In progress' : (c.earned ?? '') })),
  ];
  return (
    <div className="xp-edu" data-reveal="">
      <h3 className="lu-kicker xp-edu-title" id="xp-edu-title">
        Education
      </h3>
      <ul className="xp-edu-list" aria-labelledby="xp-edu-title">
        {rows.map((r) => (
          <li className="xp-edu-row" key={r.name}>
            <p className="xp-edu-name">{r.name}</p>
            <p className="xp-edu-org">{r.org}</p>
            {r.when && <p className="xp-edu-when">{r.when}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** "Sep 2023 to April 2028 (expected)", or the year it finished. */
function schoolDates(s: Education): string {
  if (s.expected) return s.started ? `${s.started} to ${s.expected} (expected)` : `Expected ${s.expected}`;
  if (s.finished) return s.started ? `${s.started} to ${s.finished}` : s.finished;
  return s.started ?? '';
}
