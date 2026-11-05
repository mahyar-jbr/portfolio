import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import LinkOut from '@/components/lucent/LinkOut';
import Tag from '@/components/lucent/Tag';
import TransitionLink from '@/components/lucent/TransitionLink';
import {
  coop,
  type CoopArtifact,
  type CoopEntry,
  type CoopLabelled,
  type CoopLink,
  type CoopText,
} from '@/content/coop';
import { identity } from '@/content/site';

/**
 * /coop: his COOP 2100 ePortfolio (content/coop.ts), read the way a case
 * study is (components/work/CaseStudy.tsx): the title and its purpose as the
 * hero, then sections whose labels stick to the left while you read, the
 * contents first. Each piece of evidence is a reading card (the kit's
 * .lu-prose) that ends in its competency tags, each the kit's tag followed by
 * why. Headings: h1 the title; h2 the goal, Course Projects and the
 * Self-Assessment; h3 the four portfolios (and each course project); h4 each
 * portfolio's artifacts. The contents' anchors are the headings' ids, and
 * each lands clear of the nav (styles/site.css, "Co-op ePortfolio").
 *
 * The cards and the closing paragraph rise in as they arrive (the kit's
 * reveal), never a section: a section waiting on its reveal is drawn 12px
 * low, and a shared link to its heading (/coop#course-projects) landed 12px
 * off when the browser's jump measured it then. The headings never move.
 */

export const metadata: Metadata = {
  title: `${coop.title} · ${identity.fullName}`,
  description: coop.purpose[0],
  openGraph: { title: coop.title, description: coop.purpose[0] },
};

const { contents, goal, courseProjects, selfAssessment } = coop;

/** A link in the copy: a file to keep downloads (LinkOut); the rest go through the site's own links. */
function Anchor({ link, children }: { link: Omit<CoopLink, 'label'>; children: ReactNode }) {
  if (link.download) {
    return (
      <LinkOut className="lu-link" href={link.href} download={link.download}>
        {children}
      </LinkOut>
    );
  }
  return (
    <TransitionLink className="lu-link" href={link.href}>
      {children}
    </TransitionLink>
  );
}

function Text({ text }: { text: CoopText }) {
  if (typeof text === 'string') return text;
  return text.map((part, i) =>
    typeof part === 'string' ? (
      part
    ) : (
      <Anchor key={i} link={part}>
        {part.label}
      </Anchor>
    ),
  );
}

const isLabelled = (line: CoopArtifact['lines'][number]): line is CoopLabelled =>
  typeof line === 'object' && !Array.isArray(line);

/**
 * An artifact's lines, in order: a line with a label is a paragraph led by
 * it in bold; plain lines read as paragraphs, or as a list where several
 * stand together (separate facts, as in Recognition).
 */
function Lines({ lines }: { lines: CoopArtifact['lines'] }) {
  const out: ReactNode[] = [];
  let run: CoopText[] = [];
  const flush = () => {
    if (run.length > 1) {
      out.push(
        <ul className="coop-points" key={out.length}>
          {run.map((t, i) => (
            <li key={i}>
              <Text text={t} />
            </li>
          ))}
        </ul>,
      );
    } else if (run.length === 1) {
      out.push(
        <p key={out.length}>
          <Text text={run[0]} />
        </p>,
      );
    }
    run = [];
  };
  for (const line of lines) {
    if (isLabelled(line)) {
      flush();
      out.push(
        <p key={out.length}>
          <b>{line.label}:</b> {line.text}
        </p>,
      );
    } else {
      run.push(line);
    }
  }
  flush();
  return out;
}

/** The evidence, as a reading card: its title (a link where the work has a page or a file), its lines, then its tags. */
function Artifact({ artifact: a, heading: H }: { artifact: CoopArtifact; heading: 'h3' | 'h4' }) {
  return (
    <article className="lu-prose coop-artifact" data-reveal="">
      <H className="coop-artifact-title">{a.link ? <Anchor link={a.link}>{a.title}</Anchor> : a.title}</H>
      <Lines lines={a.lines} />
      {a.tags.length > 0 && (
        <div className="coop-tags">
          <p className="coop-tags-label">{coop.tagsLabel}</p>
          <ul>
            {a.tags.map((t) => (
              <li key={t.name}>
                <Tag>{t.name}</Tag> <span>({t.why}).</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}

function Entries({ entries }: { entries: CoopEntry[] }) {
  return (
    <ul>
      {entries.map((e) => (
        <li key={e.href}>
          <TransitionLink className="lu-link" href={e.href}>
            {e.label}
          </TransitionLink>
          {e.note && <span className="coop-note">: {e.note}</span>}
          {e.entries && <Entries entries={e.entries} />}
        </li>
      ))}
    </ul>
  );
}

export default function CoopPage() {
  return (
    <>
      <section className="case-hero lu-wall coop-hero">
        <div className="lu-page">
          <h1>{coop.title}</h1>
          <p className="lu-lede">{coop.purpose.join(' ')}</p>
        </div>
      </section>
      <div className="lu-page lu-case coop">
        {/* The label is for the eye: the nav's own name says it to a screen reader. */}
        <section className="coop-contents">
          <div className="lu-title-sm" aria-hidden="true">
            {contents.label}
          </div>
          <nav aria-label={contents.label}>
            <Entries entries={contents.entries} />
          </nav>
        </section>

        <section>
          <h2 className="lu-title-sm" id={goal.id}>
            {goal.title}
          </h2>
          <div>
            <p>{goal.intro}</p>
            {goal.portfolios.map((p) => (
              <section className="coop-portfolio" key={p.id}>
                <h3 className="lu-title-sm" id={p.id}>
                  {p.title}
                </h3>
                <p className="coop-intro">{p.intro}</p>
                <div className="coop-artifacts">
                  {p.artifacts.map((a) => (
                    <Artifact key={a.title} artifact={a} heading="h4" />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section>
          <h2 className="lu-title-sm" id={courseProjects.id}>
            {courseProjects.title}
          </h2>
          <div>
            <p>{courseProjects.intro}</p>
            <div className="coop-artifacts">
              {courseProjects.projects.map((a) => (
                <Artifact key={a.title} artifact={a} heading="h3" />
              ))}
            </div>
          </div>
        </section>

        <section>
          <h2 className="lu-title-sm" id={selfAssessment.id}>
            {selfAssessment.title}
          </h2>
          <div data-reveal="">
            <p>{selfAssessment.body}</p>
          </div>
        </section>
      </div>
    </>
  );
}
