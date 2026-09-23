import { ImageResponse } from 'next/og';
import { MARK_PATH } from '@/components/lucent/BrandMark';

/* The kit's app icon (assets/brand/mj-app-icon.svg) as the PNG iOS needs: the
   paper mark at 62% in an ink squircle. iOS rounds the corners itself. */

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#191918',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="112" height="112" viewBox="0 0 48 48">
          <path d={MARK_PATH} fill="#ffffff" />
        </svg>
      </div>
    ),
    size,
  );
}
