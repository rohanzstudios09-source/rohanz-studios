import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getGameBySlug, getGames } from '@/lib/supabase/client';
import { GameGallery } from '@/components/games/GameGallery';
import { ArrowLeft, ExternalLink, Play, Gamepad2, Cpu, Calendar, Tag, ShieldCheck } from 'lucide-react';
import { GithubIcon } from '@/components/ui/SocialIcons';

import { siteConfig } from '@/config/siteConfig';

interface GameDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const games = await getGames();
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: GameDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlug(slug);
  if (!game) return { title: 'Game Not Found' };
  const canonicalUrl = `${siteConfig.siteUrl}/games/${game.slug}`;
  const imageUrl = game.cover_image.startsWith('http')
    ? game.cover_image
    : `${siteConfig.siteUrl}${game.cover_image}`;

  return {
    title: `${game.title} | Rohanz Studios`,
    description: game.short_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      title: `${game.title} | Rohanz Studios`,
      description: game.short_description,
      url: canonicalUrl,
      siteName: 'Rohanz Studios',
      images: [{ url: imageUrl, alt: `${game.title} Cover Art` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.title} | Rohanz Studios`,
      description: game.short_description,
      images: [imageUrl],
    },
  };
}

export default async function GameDetailPage({ params }: GameDetailProps) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const gameSchema = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.title,
    description: game.short_description,
    genre: game.genre,
    gameEngine: game.engine,
    operatingSystem: 'Windows, PC',
    applicationCategory: 'Game',
    author: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
    },
    image: game.cover_image.startsWith('http')
      ? game.cover_image
      : `${siteConfig.siteUrl}${game.cover_image}`,
    url: `${siteConfig.siteUrl}/games/${game.slug}`,
  };

  return (
    <article className="pt-28 pb-24 min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(gameSchema) }}
      />
      {/* 1. Hero Header Banner */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden bg-slate-950">
        <Image
          src={game.hero_image || game.cover_image}
          alt={game.title}
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-8">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-slate-300 hover:text-white text-xs font-mono mb-6 w-fit backdrop-blur-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK TO GAMES</span>
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 backdrop-blur-md">
              {game.status}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              {game.engine}
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              {game.genre}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white uppercase text-glow">
            {game.title}
          </h1>
        </div>
      </div>

      {/* 2. Main Content & Sidebar Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Description, Features & Screenshot Gallery */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          {/* Overview / Story */}
          <section className="glass-panel p-8 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono mb-4 border-b border-white/10 pb-3 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-cyan-400" />
              PROJECT OVERVIEW
            </h2>
            <div className="prose prose-invert prose-cyan max-w-none text-slate-300 text-base leading-relaxed whitespace-pre-line">
              {game.description}
            </div>
          </section>

          {/* Screenshot Gallery */}
          {game.images && game.images.length > 0 && (
            <section className="glass-panel p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono mb-6 border-b border-white/10 pb-3">
                SCREENSHOT GALLERY
              </h2>
              <GameGallery images={game.images} title={game.title} />
            </section>
          )}

          {/* Gameplay Features */}
          {game.features && game.features.length > 0 && (
            <section className="glass-panel p-8 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold tracking-tight text-white uppercase font-mono mb-6 border-b border-white/10 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                KEY GAMEPLAY FEATURES
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {game.features.map((feat) => (
                  <div
                    key={feat.id || feat.title}
                    className="p-4 rounded-xl bg-slate-900/60 border border-white/5"
                  >
                    <h3 className="text-sm font-bold text-cyan-300 font-mono mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Game Metadata & External Links Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Action Links Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-3">
            <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold mb-2">
              PLAY & DOWNLOAD LINKS
            </h3>

            {game.steam_url && (
              <a
                href={game.steam_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-mono text-xs font-bold tracking-wider hover:from-blue-500 hover:to-indigo-600 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                <span>WISHLIST ON STEAM</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {game.itch_url && (
              <a
                href={game.itch_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-mono text-xs font-bold tracking-wider hover:from-rose-500 hover:to-red-600 transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)]"
              >
                <span>PLAY ON ITCH.IO</span>
                <Gamepad2 className="w-4 h-4" />
              </a>
            )}

            {game.github_url && (
              <a
                href={game.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 font-mono text-xs font-bold tracking-wider transition-all"
              >
                <span>VIEW GITHUB REPO</span>
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {game.trailer_url && (
              <a
                href={game.trailer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 font-mono text-xs font-bold tracking-wider transition-all"
              >
                <span>WATCH TRAILER</span>
                <Play className="w-4 h-4 text-cyan-400" />
              </a>
            )}
          </div>

          {/* Game Details Spec Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-4 text-xs font-mono">
            <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold border-b border-white/10 pb-3">
              TECHNICAL SPECIFICATIONS
            </h3>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-500">DEVELOPER</span>
              <span className="text-slate-200 font-bold">Rohanz Studios</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-500">ENGINE</span>
              <span className="text-cyan-400 font-bold">{game.engine}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-500">GENRE</span>
              <span className="text-slate-200 font-bold">{game.genre}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-slate-500">STATUS</span>
              <span className="text-amber-400 font-bold">{game.status}</span>
            </div>

            {game.release_date && (
              <div className="flex justify-between items-center py-1 border-b border-white/5">
                <span className="text-slate-500">EXPECTED RELEASE</span>
                <span className="text-slate-200 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-cyan-400" />
                  {game.release_date}
                </span>
              </div>
            )}
          </div>

          {/* Tech Stack Tags */}
          {game.technologies && game.technologies.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col gap-3">
              <h3 className="text-xs font-mono tracking-widest text-slate-400 uppercase font-semibold">
                ENGINEERING STACK
              </h3>
              <div className="flex flex-wrap gap-2">
                {game.technologies.map((t) => (
                  <span
                    key={t.id || t.technology}
                    className="px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-cyan-300"
                  >
                    {t.technology}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
