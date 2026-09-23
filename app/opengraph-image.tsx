import { ImageResponse } from 'next/og';
import { MARK_PATH } from '@/components/lucent/BrandMark';
import { identity } from '@/content/site';

/* The Open Graph image, built from the page hero cover (Lucent Handoff): paper
   ground, the dot canvas, one hairline sigmoid, the mark as the page icon, then
   the name. Light-theme Lucent values — a link preview has no theme. */

export const alt = `${identity.fullName} — ${identity.roleTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const INK = '#191918';
const INK_SECONDARY = '#6b6a66';
const BG = '#fbfbfa';
const DOT = 'rgba(55, 53, 47, 0.16)';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '0 88px 96px',
          background: BG,
          backgroundImage: `radial-gradient(${DOT} 1.5px, transparent 1.8px)`,
          backgroundSize: '24px 24px',
          position: 'relative',
          fontFamily: 'sans-serif',
        }}
      >
        <svg
          width="1200"
          height="330"
          viewBox="0 0 1200 260"
          preserveAspectRatio="none"
          style={{ position: 'absolute', top: 0, left: 0 }}
        >
          <path d="M0 214 C 420 214, 520 210, 600 130 S 780 46, 1200 46" fill="none" stroke={INK_SECONDARY} strokeWidth="2" />
        </svg>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            background: '#ffffff',
            boxShadow: '0 12px 32px rgba(15,15,15,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 36,
          }}
        >
          <svg width="60" height="60" viewBox="0 0 48 48">
            <path d={MARK_PATH} fill={INK} />
          </svg>
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '-0.035em', color: INK, lineHeight: 1.04 }}>
          {identity.fullName}
        </div>
        <div style={{ fontSize: 34, color: INK_SECONDARY, marginTop: 16 }}>{identity.roleTitle}</div>
      </div>
    ),
    size,
  );
}
