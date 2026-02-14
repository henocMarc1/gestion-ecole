import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'École Management - Système de Gestion Scolaire',
  description: 'Plateforme complète de gestion d\'école maternelle et primaire',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-96x96.svg', sizes: '96x96', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
    shortcut: '/icons/icon-96x96.svg',
    apple: [
      { url: '/icons/icon-152x152.svg', sizes: '152x152', type: 'image/svg+xml' },
      { url: '/icons/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#f0701d',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/icons/icon-96x96.svg" type="image/svg+xml" />
      </head>
      <body className={inter.variable}>
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
