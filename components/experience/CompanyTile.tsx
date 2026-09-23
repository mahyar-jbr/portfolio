import type { Role } from '@/content/types';

/**
 * The company as an iOS app icon: every company in the same squircle tile, its
 * own logo on its own ground (styles/site.css, "Experience"). A company with no
 * supplied logo shows its letters in a matching tile.
 *
 * The tile is decorative: the company's name is always in text beside it. The
 * letters also sit under a logo, and a logo that fails to load gives way to
 * them (ExperienceMotion). Each logo gets its own optical size in the tile,
 * keyed by its file name (`data-logo`), so no mark looks bigger than the rest.
 *
 * A plain sized <img>, not next/image: each mark is already cut at 3x for its
 * tile (public/experience/), and the optimizer would only offer 1x and 2x.
 */
export default function CompanyTile({ role }: { role: Pick<Role, 'monogram' | 'logo'> }) {
  const { logo, monogram } = role;
  const key = logo?.src.split('/').pop()?.replace(/\.\w+$/, '');
  return (
    <span className="xp-tile" data-logo={key} aria-hidden="true">
      <span className="xp-tile-letters">{monogram}</span>
      {logo && (
        <img
          src={logo.src}
          width={logo.width}
          height={logo.height}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      )}
    </span>
  );
}
