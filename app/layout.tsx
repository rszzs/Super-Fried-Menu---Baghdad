import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://ais-dev-ggjvemqp3tkw5we4bsgiuc-355491098015.europe-west2.run.app'),
  title: 'سوبر فرايد | Super Fried - الكاظمية باب المراد',
  description: 'قائمة طعام رقمية لوجبات الكنتاكي، البرغر، السندويشات، أطباق الريزو والمقبلات المقرمشة والمشروبات - سوبر فرايد الكاظمية باب المراد.',
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/logo.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: 'سوبر فرايد | Super Fried - الكاظمية باب المراد',
    description: 'قائمة طعام رقمية لوجبات الكنتاكي، البرغر، السندويشات، أطباق الريزو والمقبلات المقرمشة والمشروبات - سوبر فرايد الكاظمية.',
    type: 'website',
    locale: 'ar_IQ',
    siteName: 'Super Fried - سوبر فرايد',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'سوبر فرايد | Super Fried',
    description: 'قائمة طعام رقمية لوجبات الكنتاكي، البرغر، السندويشات، أطباق الريزو والمقبلات المقرمشة.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
