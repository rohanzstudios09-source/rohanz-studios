import React from 'react';
import { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GameGrid } from '@/components/games/GameGrid';
import { getGames } from '@/lib/supabase/client';

import { siteConfig } from '@/config/siteConfig';

export const metadata: Metadata = {
  title: 'Games',
  description: 'Explore all game projects, prototypes, and interactive experiences created by Rohanz Studios.',
  alternates: {
    canonical: `${siteConfig.siteUrl}/games`,
  },
  openGraph: {
    title: 'Games & Projects | Rohanz Studios',
    description: 'Explore all game projects, prototypes, and atmospheric horror/runner titles created by Rohanz Studios.',
    url: `${siteConfig.siteUrl}/games`,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Games & Projects | Rohanz Studios',
    description: 'Explore all game projects, prototypes, and atmospheric horror/runner titles created by Rohanz Studios.',
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export const revalidate = 60;

export default async function GamesPage() {
  const games = await getGames();

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <SectionHeading
        badge="STUDIO PORTFOLIO"
        title="ALL GAMES & PROJECTS"
        subtitle="Explore our library of atmospheric horror, high-speed runners, and sci-fi prototypes built with Unreal Engine 5 & Unity."
      />
      <GameGrid games={games} showFilters={true} />
    </div>
  );
}
