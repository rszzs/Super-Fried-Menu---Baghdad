import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const type = searchParams.get('type') || 'menu'; // 'dinein' | 'delivery' | 'takeaway' | 'menu'
    const table = searchParams.get('table') || '';
    const itemName = searchParams.get('item') || '';
    const price = searchParams.get('price') || '';
    const lang = searchParams.get('lang') || 'ar';

    let orderTypeBadge = '🍟 المنيو الرقمي الرسمي';
    let orderTypeColor = '#BC6C25';
    let headline = 'مطعم سوبر فرايد | Super Fried';
    let subheadline = 'أشهى وجبات الكنتاكي، البركر، الستربس، الريزو والمقبلات المقرمشة';
    let detailNote = 'بغداد، الكاظمية - شارع باب المراد • خدمة سريعة وجودة عالية';

    if (type === 'dinein' || table) {
      orderTypeBadge = table ? `🍽️ طلب داخل الصالة - طاولة رقم #${table}` : '🍽️ طلب داخل الصالة (Dine-in)';
      orderTypeColor = '#283618';
      headline = table ? `قائمة طعام طاولة رقم ${table}` : 'طلب مباشر داخل الصالة';
      subheadline = 'تصفح الأصناف واطلب مباشرة إلى طاولتك بدون انتظار';
      detailNote = `سوبر فرايد الكاظمية • طاولة ${table || 'مخصصة'}`;
    } else if (type === 'delivery') {
      orderTypeBadge = '🛵 طلب توصيل دليفري سريع';
      orderTypeColor = '#C1121F';
      headline = 'خدمة التوصيل السريع للمنازل';
      subheadline = 'وجبات ساخنة ومقرمشة تصلك أينما كنت في أسرع وقت';
      detailNote = 'واتساب وهاتف الطلبات: 07703309000 • الكاظمية';
    } else if (type === 'takeaway') {
      orderTypeBadge = '🛍️ طلب سفري واستلام من الفرع';
      orderTypeColor = '#78350F';
      headline = 'طلب مسبق واستلام سفري (Takeaway)';
      subheadline = 'حدد طلبك واستلمه جاهزاً وساخناً فور وصولك للفرع';
      detailNote = 'الكاظمية - شارع باب المراد';
    }

    if (itemName) {
      headline = itemName;
      if (price) {
        subheadline = `السعر: ${price} د.ع • سوبر فرايد الكاظمية`;
      }
    }

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
          {/* Top Header Bar with Badge & Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            {/* Logo and Name */}
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

            {/* Dynamic Order Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: orderTypeColor,
                color: '#FFFFFF',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '20px',
                fontWeight: 'bold',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              {orderTypeBadge}
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
                fontSize: headline.length > 30 ? '42px' : '52px',
                fontWeight: '900',
                color: '#FEFAE0',
                lineHeight: 1.2,
                textShadow: '0 4px 12px rgba(0,0,0,0.5)',
              }}
            >
              {headline}
            </div>

            <div
              style={{
                fontSize: '22px',
                color: '#E8E5DF',
                fontWeight: '400',
                lineHeight: 1.4,
                maxWidth: '800px',
              }}
            >
              {subheadline}
            </div>
          </div>

          {/* Bottom Bar with Footer and Call to Action */}
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
            <div style={{ color: '#DDA15E', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📍 {detailNote}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#BC6C25',
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '12px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              اضغط لفتح المنيو والطلب ➔
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image: ${e.message}`, {
      status: 500,
    });
  }
}
