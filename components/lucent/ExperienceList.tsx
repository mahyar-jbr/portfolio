import Glyph from './Glyph';
import Tag from './Tag';

/**
 * ExperienceList — one row per role, newest first. The collapsed list is the
 * skim (monogram, role in bold, organisation, dates in mono); each row opens to
 * the read (a few result-first lines and up to four tags). Lucent.auto() wires
 * each row: height opens on ease-settle, the chevron turns.
 *
 * Rows render closed with `hidden` details, so with scripts blocked the list is
 * still a complete, scannable list of roles.
 */
export interface ExperienceRow {
  monogram: string;
  title: string;
  subline: string;
  when: string;
  now?: boolean;
  lines: string[];
  tags: string[];
}

export default function ExperienceList({ id, rows }: { id: string; rows: ExperienceRow[] }) {
  return (
    <ol className="lu-exp">
      {rows.map((row, i) => {
        const detail = `${id}-${i}`;
        return (
          <li className="lu-exp-item" key={detail}>
            <button type="button" className="lu-exp-row" aria-expanded="false" aria-controls={detail}>
              <span className="lu-exp-mark" aria-hidden="true">
                {row.monogram}
              </span>
              <span className="lu-exp-main">
                <b>
                  {row.title}
                  {row.now && <Tag tone="green">Now</Tag>}
                </b>
                <span>{row.subline}</span>
              </span>
              <span className="lu-exp-when">{row.when}</span>
              <span className="lu-exp-chev">
                <Glyph name="chevron-down" />
              </span>
            </button>
            <div className="lu-exp-detail" id={detail} hidden>
              <div className="lu-exp-detail-inner">
                <ul>
                  {row.lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                {row.tags.length > 0 && (
                  <div className="lu-exp-stack">
                    {row.tags.slice(0, 4).map((t) => (
                      <Tag key={t}>{t}</Tag>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
