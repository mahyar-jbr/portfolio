import type { series as seriesContent } from '@/content/art';

export type Series = typeof seriesContent;

/** "0:30" */
export function clock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
