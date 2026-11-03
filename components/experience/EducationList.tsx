import type { Credential, Education } from '@/content/types';
import CompanyTile from './CompanyTile';
import ExperienceMotion from './ExperienceMotion';

/**
 * Education — a small group after the roles (2026-11-02, for the COOP 2100
 * ePortfolio): the degree under way, the diploma, and the two certificates, in
 * the roll's own terms (styles/site.css, "Experience"). Each row leads with the
 * institution's mark in the same app-icon tile as a company's, a size down,
 * then the credential in ink, where it is from under it, and when, in the
 * reading path. A row with no mark yet shows its letters in the tile, as does
 * one whose logo fails to load (ExperienceMotion, the roll's own repair).
 */
export default function EducationList({
  schools,
  credentials,
}: {
  schools: Education[];
  credentials: Credential[];
}) {
  const rows = [
    ...schools.map((s) => ({ ...s, name: s.credential, org: s.institution, when: schoolDates(s) })),
    ...credentials.map((c) => ({ ...c, org: c.issuer, when: c.inProgress ? 'In progress' : (c.earned ?? '') })),
  ];
  return (
    <div className="xp-edu" id="xp-edu" data-reveal="">
      <h3 className="lu-kicker xp-edu-title" id="xp-edu-title">
        Education
      </h3>
      <ul className="xp-edu-list" aria-labelledby="xp-edu-title">
        {rows.map((r) => (
          <li className="xp-edu-row" key={r.name}>
            {r.monogram && <CompanyTile role={{ monogram: r.monogram, logo: r.logo }} />}
            <p className="xp-edu-name">{r.name}</p>
            <p className="xp-edu-org">{r.org}</p>
            {r.when && <p className="xp-edu-when">{r.when}</p>}
          </li>
        ))}
      </ul>
      <ExperienceMotion root="#xp-edu" />
    </div>
  );
}

/** "Sep 2023 to April 2028 (expected)", or the year it finished. */
function schoolDates(s: Education): string {
  if (s.expected) return s.started ? `${s.started} to ${s.expected} (expected)` : `Expected ${s.expected}`;
  if (s.finished) return s.started ? `${s.started} to ${s.finished}` : s.finished;
  return s.started ?? '';
}
