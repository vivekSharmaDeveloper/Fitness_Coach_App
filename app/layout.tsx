import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { Metadata, Viewport } from 'next';
import { OrganizationSchema, WebApplicationSchema, FAQSchema } from '@/components/seo/structured-data';
import { PerformanceTracker } from '@/components/seo/web-vitals';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Routine Tracker - Your Personal AI Fitness & Wellness Coach',
    template: '%s | Routine Tracker - AI Fitness Coach'
  },
  description: 'Transform your health with Routine Tracker - an AI-powered personal fitness and wellness coach. Get personalized workout plans, nutrition guidance, and achieve your fitness goals with smart recommendations.',
  keywords: [
    'fitness coach',
    'AI fitness',
    'personal trainer',
    'workout plans',
    'nutrition guidance',
    'wellness coach',
    'fitness goals',
    'health tracking',
    'smart fitness',
    'personalized fitness'
  ],
  authors: [{ name: 'Routine Tracker Team' }],
  creator: 'Routine Tracker',
  publisher: 'Routine Tracker',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://routine-tracker.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://routine-tracker.app',
    title: 'Routine Tracker - Your Personal AI Fitness & Wellness Coach',
    description: 'Transform your health with AI-powered personal fitness coaching. Get customized workout plans, nutrition guidance, and achieve your wellness goals.',
    siteName: 'Routine Tracker',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Routine Tracker - AI Fitness Coach',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Routine Tracker - Your Personal AI Fitness & Wellness Coach',
    description: 'Transform your health with AI-powered personal fitness coaching. Get customized workout plans and achieve your wellness goals.',
    images: ['/twitter-image.jpg'],
    creator: '@routinetracker',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <WebApplicationSchema />
        <FAQSchema />
      </head>
      <body>
        <Providers>
          <div id="main-content" className="relative min-h-screen">
            {children}
          </div>
          <Toaster />
          <PerformanceTracker />
        </Providers>
      </body>
    </html>
  )
}
