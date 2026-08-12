import React from 'react';
import { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { DevlogCard } from '@/components/devlog/DevlogCard';
import { getDevlogs } from '@/lib/supabase/client';

import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Devlog',
  description: 'Behind the scenes game development articles, shader math, engine architecture, and mechanics by Rohanz Studios.',
  alternates: {
    canonical: `${siteConfig.siteUrl}/devlog`,
  },
  openGraph: {
    title: 'Devlog & Articles | Rohanz Studios',
    description: 'Behind the scenes game development articles, shader math, engine architecture, and mechanics by Rohanz Studios.',
    url: `${siteConfig.siteUrl}/devlog`,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Devlog & Articles | Rohanz Studios',
    description: 'Behind the scenes game development articles, shader math, engine architecture, and mechanics by Rohanz Studios.',
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export const revalidate = 60;

export default async function DevlogPage() {
  const devlogs = await getDevlogs();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <SectionHeading
        badge="BEHIND THE SCENES"
        title="DEVLOG & ENGINE ARTICLES"
        subtitle="In-depth breakdowns on non-Euclidean portals, Lumen lighting optimization, physics curves, and game architecture."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {devlogs.map((devlog) => (
          <DevlogCard key={devlog.id} devlog={devlog} />
        ))}
      </div>
    </div>
  );
}
