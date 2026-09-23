import katex from 'katex';
import 'katex/dist/katex.min.css';
import { enterStyle } from '@/components/lucent/Hero';

/**
 * The opening formula, y = σ(Σ wᵢxᵢ + b): the neuron the mark comes from.
 *
 * Typeset the way it appears in a paper — TeX's Computer Modern, via KaTeX,
 * rendered once on the server. Every term is tagged with \htmlData:
 * `k` is its distance from the Σ (on scroll the farthest terms leave first, so
 * the Σ is the last thing standing), and `sigma` marks the Σ itself, which
 * SigmaMorph lifts out of the formula and turns into the M of the name.
 */
const TEX = String.raw`
  \htmlData{k=4}{y}
  \mathrel{\htmlData{k=3}{=}}
  \htmlData{k=2}{\sigma}
  \mathopen{\htmlData{k=1}{\Bigl(}}
  \mathop{\htmlData{sigma=from}{\sum}}
  \htmlData{k=1}{w_i}
  \htmlData{k=2}{x_i}
  \mathbin{\htmlData{k=3}{+}}
  \htmlData{k=4}{b}
  \mathclose{\htmlData{k=5}{\Bigr)}}
`;

const html = katex.renderToString(TEX, {
  displayMode: true,
  output: 'html',
  throwOnError: true,
  trust: (ctx) => ctx.command === '\\htmlData',
  strict: false,
});

/** The Σ glyph as TeX draws it in display style (KaTeX_Size2), for the M of the name. */
export const SIGMA = '∑';

export default function Formula({ spoken }: { spoken: string }) {
  return (
    <div
      className="hero-eq"
      role="img"
      aria-label={spoken}
      data-enter=""
      style={enterStyle(0)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
