import type { Metadata } from 'next';
import { Fraunces, Work_Sans, IBM_Plex_Mono } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { AnalyticsProvider } from '@/lib/analytics/tracker';
import './globals.css';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site-config';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['400', '500', '600'],
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-plex-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${workSans.variable} ${plexMono.variable}`}
    >
      <body>
        <AppRouterCacheProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
