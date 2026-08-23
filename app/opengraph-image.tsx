import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'مطعم سوبر فرايد | Super Fried - المنيو الرقمي';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1C2513',
          backgroundImage: 'radial-gradient(circle at 50% 30%, #2E3E1A 0%, #151D0E 100%)',
          padding: '48px 56px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '64px',
                height: '64px',
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '3px solid #E8E5DF',
                padding: '4px',
              }}
            >
              <svg viewBox="0 0 500 500" width="54" height="54" fill="none">
                <path d="M125 105 L165 145 L150 250 L115 155 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="16" />
                <path d="M195 100 L230 115 L215 240 L180 230 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="16" />
                <path d="M245 110 L285 130 L270 230 L235 225 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="16" />
                <path d="M290 108 L325 155 L300 230 L275 220 Z" fill="#F59E0B" stroke="#18181B" strokeWidth="16" />
                <path d="M320 150 L345 165 L325 220 L305 215 Z" fill="#FBBF24" stroke="#18181B" strokeWidth="16" />
                <path d="M150 245 L175 240 L188 300 L160 290 Z" fill="#EA580C" stroke="#18181B" strokeWidth="16" />
                <path d="M172 235 L362 178 L330 425 L190 425 Z" fill="#F97316" stroke="#18181B" strokeWidth="18" strokeLinejoin="round" />
                <text x="264" y="305" textAnchor="middle" fontWeight="900" fontSize="72" fill="#FFFFFF" stroke="#18181B" strokeWidth="14">Super</text>
                <text x="260" y="390" textAnchor="middle" fontWeight="900" fontSize="82" fill="#FFFFFF" stroke="#18181B" strokeWidth="16">Fried</text>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#FFFFFF', fontSize: '26px', fontWeight: 'bold' }}>SUPER FRIED</span>
              <span style={{ color: '#DDA15E', fontSize: '16px' }}>الكاظمية - شارع باب المراد</span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#BC6C25',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '999px',
              fontSize: '20px',
              fontWeight: 'bold',
              border: '2px solid rgba(255,255,255,0.2)',
            }}
          >
            🍟 المنيو الرقمي التفاعلي
          </div>
        </div>

        {/* Center Card Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: '900px',
            gap: '14px',
          }}
        >
          <div
            style={{
              fontSize: '50px',
              fontWeight: '900',
              color: '#FEFAE0',
              lineHeight: 1.2,
            }}
          >
            مطعم سوبر فرايد | Super Fried
          </div>

          <div
            style={{
              fontSize: '22px',
              color: '#E8E5DF',
              fontWeight: '400',
              lineHeight: 1.4,
            }}
          >
            أشهى وجبات الكنتاكي، البركر، الستربس، الريزو والمقبلات المقرمشة في الكاظمية
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '20px',
          }}
        >
          <div style={{ color: '#DDA15E', fontSize: '18px' }}>
            📍 بغداد، الكاظمية، شارع باب المراد
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#283618',
              color: '#FEFAE0',
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: 'bold',
            }}
          >
            تصفح القائمة واطلب الآن ➔
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
