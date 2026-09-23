/**
 * Lucent is CSS-first: every component is a class in bundle.css, and window.Lucent
 * adds the motion. Call Lucent.auto() once after the page renders.
 */
declare namespace Lucent {
  /** Damped spring behind every interactive motion. */
  class Spring {
    constructor(value: number, opts?: { stiffness?: number; damping?: number; onUpdate?: (x: number, v: number) => void; onRest?: () => void });
    to(target: number, instant?: boolean): this;
    kick(velocity: number): this;
    set(value: number): void;
  }
  /** A spring tuned by a spring-* token: "jelly" | "lens" | "lens-width" | "knob". */
  function spring(value: number, preset: string, onUpdate?: (x: number, v: number) => void, onRest?: () => void): Spring;

  /** Wire everything under root: soft press on every control, lens, switches, filter groups, sheets, toasts, reveal, nav compact, anchor scroll. */
  function auto(root?: ParentNode): ParentNode;

  // Controls
  function jelly(el: HTMLElement, opts?: { amount?: number }): HTMLElement;
  interface LensApi { select(item: HTMLElement, instant?: boolean): void; clear(): void; relayout(): void; items: HTMLElement[]; readonly current: HTMLElement | null; }
  function liquidNav(nav: HTMLElement, opts?: { spy?: boolean; onChange?: (item: HTMLElement, index: number) => void }): LensApi;
  function segmented(seg: HTMLElement): LensApi; // fires "change" with detail.value
  function switchControl(el: HTMLElement): HTMLElement; // fires "change" with detail.checked
  function busy<T>(button: HTMLElement, work: Promise<T>): Promise<T>;

  // Feedback
  function toast(message: string, opts?: { duration?: number; icon?: boolean }): { close(): void };
  function sheet(opts: { from?: HTMLElement; title?: string; content?: Node | string; onClose?: () => void }): { close(): void; panel: HTMLElement };

  // Scroll and page
  function enter(root: ParentNode): number;
  function reveal(root?: ParentNode): void;
  function navScroll(nav: HTMLElement, opts?: { threshold?: number }): void;
  function scrollTo(el: Element, opts?: { block?: ScrollLogicalPosition }): void;
  function filter(container: HTMLElement, keep: (el: HTMLElement) => boolean, opts?: { items?: string; layout?: (visible: HTMLElement[]) => void }): Promise<void>;
  function transition(update: () => void, opts?: { root?: HTMLElement }): Promise<unknown>;
  function setTheme(theme: "light" | "dark" | null): void;

  // Showcase
  function lensHero(stage: HTMLElement, opts?: { zoom?: number }): void;   // .lu-lens-stage
  function liveTime(el: HTMLTimeElement): void;                           // time[data-live][data-tz]
  function expandable(button: HTMLElement): void;                         // .lu-exp-row[aria-controls]
  function gallery(root: HTMLElement): void;                              // .lu-gallery of .lu-art
  function lightbox(items: HTMLElement[], index: number): { close(): void };
  function drawMark(svg: SVGElement): void;                               // svg.lu-mark: [data-turn] turns, [data-draw] draws

  /** Layout primitives (CSS only): lu-page, lu-section, lu-head, lu-kicker, lu-title, lu-title-sm,
   *  lu-lede, lu-prose, lu-meta, lu-case, lu-shots/lu-shot, lu-steps/lu-step, lu-points, lu-timeline, lu-footer. */

  /** Class names. */
  const GlassPanel: "lu-glass";       // is-clear | is-tinted
  const Button: "lu-btn";             // is-filled | is-glass | is-quiet, is-small | is-icon
  const Switch: "lu-switch";          // role="switch" aria-checked
  const NavBar: "lu-nav";             // .lu-nav-brand, .lu-nav-item[aria-current], data-compact
  const SegmentedControl: "lu-seg";   // .lu-seg-item[role=radio][aria-checked]
  const SkillChip: "lu-chip";         // aria-pressed, data-filter inside data-filter-group, .lu-dot
  const ProjectCard: "lu-card";       // .lu-card-art, .lu-card-label, .lu-card-caption.lu-glass, .lu-card-go, is-feature, is-stealth + .lu-card-frost
  const Toast: "lu-toast";
  const Sheet: "lu-sheet";
  const Hero: "lu-hero";              // is-page: .lu-hero-cover, .lu-hero-icon, h1, dl.lu-props, .lu-hero-actions
  const HeroLens: "lu-hero is-lens";  // .lu-lens-stage > h1.lu-lens-type + .lu-lens-glass
  const ExperienceList: "lu-exp";     // li.lu-exp-item > button.lu-exp-row + .lu-exp-detail
  const ArtGallery: "lu-gallery";     // figure.lu-art[data-title][data-note][data-full][data-process]
  const BrandMark: "lu-mark";         // inline svg, currentColor
  const CaseStudy: "lu-case";         // .lu-meta summary, sections with .lu-title-sm, .lu-shots, .lu-steps, .lu-points, .lu-timeline
  const ContactTiles: "lu-contact";   // .lu-contact-tile (is-primary), .lu-contact-glyph, .lu-contact-label, .lu-contact-value, .lu-contact-go
  const MotionLibrary: "lu-root";
  const PortfolioPage: "lu-root";
}
