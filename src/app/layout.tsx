import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LoadingScreen } from '@/components/layout/LoadingScreen';
import { siteConfig } from '@/config/siteConfig';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060709',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: 'Rohanz Studios | Indie Game Developer',
    template: '%s | Rohanz Studios',
  },
  description: siteConfig.description,
  keywords: [
    'Rohanz Studios',
    'Indie Game Developer',
    'Game Studio',
    'Unreal Engine 5',
    'Unity 3D',
    '3D Game Portfolio',
    'Atmospheric Games',
    'Shader Programming',
    'C++',
    'Interactive Experiences',
  ],
  authors: [{ name: 'Rohanz Studios', url: siteConfig.siteUrl }],
  creator: 'Rohanz Studios',
  publisher: 'Rohanz Studios',
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.siteUrl,
    title: 'Rohanz Studios | Indie Game Developer',
    description: siteConfig.description,
    siteName: 'Rohanz Studios',
    images: [
      {
        url: `${siteConfig.siteUrl}/images/rohanz-logo.png`,
        width: 1200,
        height: 630,
        alt: 'Rohanz Studios Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohanz Studios | Indie Game Developer',
    description: siteConfig.description,
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/images/rohanz-logo.png',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Construct sameAs social profile list dynamically (filtering out empty entries like empty discord)
  const sameAsLinks = [
    siteConfig.social_links.github,
    siteConfig.social_links.linkedin,
    siteConfig.social_links.youtube,
    siteConfig.social_links.twitter,
    siteConfig.social_links.itch,
    siteConfig.social_links.steam,
    siteConfig.social_links.discord,
  ].filter((url): url is string => Boolean(url && url.trim().length > 0 && url.startsWith('http')));

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rohanz Studios',
    url: siteConfig.siteUrl,
    logo: `${siteConfig.siteUrl}/images/rohanz-logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: sameAsLinks,
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-[#060709] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-white">
        <LoadingScreen />
        <CustomCursor />
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
