import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FAF9F6',
          borderRadius: '16px',
          padding: '4px',
        }}
      >
        <svg
          viewBox="0 0 500 500"
          width="56"
          height="56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* French Fries */}
          <path d="M125 105 L165 145 L150 250 L115 155 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="12" />
          <path d="M195 100 L230 115 L215 240 L180 230 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="12" />
          <path d="M245 110 L285 130 L270 230 L235 225 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="12" />
          <path d="M290 108 L325 155 L300 230 L275 220 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="12" />
          <path d="M320 150 L345 165 L325 220 L305 215 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="12" />

          {/* Orange Box */}
          <path d="M150 245 L175 240 L188 300 L160 290 Z" fill="#EA580C" stroke="#18181B" strokeWidth="12" />
          <path d="M172 235 L362 178 L330 425 L190 425 Z" fill="#F97316" stroke="#18181B" strokeWidth="14" strokeLinejoin="round" />

          {/* Logo Text */}
          <text
            x="264"
            y="305"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="72"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="12"
          >
            Super
          </text>
          <text
            x="260"
            y="390"
            textAnchor="middle"
            fontFamily="sans-serif"
            fontWeight="900"
            fontSize="82"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth="14"
          >
            Fried
          </text>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
