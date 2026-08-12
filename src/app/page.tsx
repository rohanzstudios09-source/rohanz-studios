import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { HeroScene } from '@/components/3d/HeroScene';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { GameCard } from '@/components/games/GameCard';
import { PhilosophySection } from '@/components/studio/PhilosophySection';
import { SkillMatrix } from '@/components/studio/SkillMatrix';
import { JourneyTimeline } from '@/components/studio/JourneyTimeline';
import { ContactForm } from '@/components/studio/ContactForm';
import { DevlogCard } from '@/components/devlog/DevlogCard';
import { getGames, getDevlogs } from '@/lib/supabase/client';
import { siteConfig } from '@/config/siteConfig';
import { ArrowDown, Gamepad2, Sparkles, BookOpen, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Rohanz Studios | Indie Game Developer',
  description: siteConfig.description,
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    title: 'Rohanz Studios | Indie Game Developer',
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohanz Studios | Indie Game Developer',
    description: siteConfig.description,
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export const revalidate = 60;

export default async function HomePage() {
  const games = await getGames();
  const devlogs = await getDevlogs();

  const featuredGames = games.filter((g) => g.featured).slice(0, 3);
  const recentDevlogs = devlogs.slice(0, 2);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rohanz Studios',
    url: siteConfig.siteUrl,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
      logo: `${siteConfig.siteUrl}/images/rohanz-logo.png`,
    },
  };

  return (
    <div className="relative w-full overflow-hidden bg-[#060709]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {/* 1. HERO SECTION (100vh) */}
      <section className="relative w-full h-screen min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* 3D R3F WebGL Hero Experience */}
        <HeroScene />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]/70 pointer-events-none z-10" />

        {/* Hero Text & CTA Container */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center gap-5 mt-12">
          {/* Studio Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-mono tracking-widest uppercase backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>INDEPENDENT GAME STUDIO</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white uppercase text-glow leading-none break-words">
            ROHANZ STUDIOS
          </h1>

          {/* Subtitle */}
          <h2 className="text-sm xs:text-lg sm:text-xl md:text-2xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.25em] text-cyan-400 uppercase">
            GAME DEVELOPER
          </h2>

          {/* Short Statement */}
          <p className="text-sm xs:text-base sm:text-xl md:text-2xl text-slate-200 max-w-3xl font-light leading-relaxed px-2">
            Building immersive worlds, meaningful gameplay, and unforgettable experiences.
          </p>

          {/* Welcome Text */}
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl font-mono leading-relaxed">
            Welcome to Rohanz Studios — an independent game development studio focused on creating atmospheric and engaging interactive experiences.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto">
            <Link
              href="/games"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-extrabold text-xs tracking-widest uppercase hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.65)] hover:scale-105 active:scale-95 w-full sm:w-auto min-h-[48px]"
            >
              <Gamepad2 className="w-4 h-4" />
              <span>EXPLORE GAMES</span>
            </Link>

            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-slate-900/90 border border-white/20 text-white font-mono font-bold text-xs tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300 backdrop-blur-md hover:scale-105 active:scale-95 w-full sm:w-auto min-h-[48px]"
            >
              <span>ABOUT ROHANZ STUDIOS</span>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-none">
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
            SCROLL TO EXPLORE
          </span>
          <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </div>
      </section>

      {/* Smooth Transition Divider */}
      <div className="w-full h-16 bg-gradient-to-b from-transparent to-[#060709] relative z-20" />

      {/* 2. FEATURED GAMES SECTION */}
      <section id="games" className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <SectionHeading
          badge="PORTFOLIO HIGHLIGHTS"
          title="FEATURED GAMES"
          subtitle="Projects we're building — atmospheric horror, high-speed runners, and tactical mechanics."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredGames.map((game, idx) => (
            <GameCard key={game.id} game={game} priority={idx < 2} />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-slate-900 border border-white/10 text-cyan-400 hover:text-white hover:border-cyan-400 text-xs font-mono tracking-wider transition-all duration-300 uppercase shadow-md"
          >
            <span>VIEW ALL PROJECTS & PROTOTYPES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. STUDIO PHILOSOPHY SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20 bg-slate-950/40 rounded-3xl border border-white/5 my-12">
        <SectionHeading
          badge="OUR PRINCIPLES"
          title="DEVELOPMENT PHILOSOPHY"
          subtitle="The core values driving our game mechanics, visual fidelity, and audio design."
        />
        <PhilosophySection />
      </section>

      {/* 4. INTERACTIVE SKILLS SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <SectionHeading
          badge="TECHNICAL CAPABILITIES"
          title="SKILLS & PROFICIENCY"
          subtitle="Game engines, systems programming, shaders, and 3D pipelines."
        />
        <SkillMatrix />
      </section>

      {/* 5. RECENT DEVLOGS SECTION */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <SectionHeading
          badge="BEHIND THE SCENES"
          title="DEVELOPMENT LOGS"
          subtitle="Deep dives into engine architecture, shader math, and game mechanics."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentDevlogs.map((log) => (
            <DevlogCard key={log.id} devlog={log} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/devlog"
            className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white transition-colors uppercase font-bold"
          >
            <BookOpen className="w-4 h-4" />
            <span>EXPLORE ALL DEVLOG ARTICLES</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 6. DEVELOPMENT JOURNEY TIMELINE */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <SectionHeading
          badge="STUDIO EVOLUTION"
          title="DEVELOPMENT JOURNEY"
          subtitle="From early C++ graphic experiments to establishing Rohanz Studios."
        />
        <JourneyTimeline />
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20">
        <SectionHeading
          badge="COLLABORATE & CONNECT"
          title="LET'S BUILD SOMETHING"
          subtitle="Reach out for game dev inquiries, studio collaborations, or feedback."
        />
        <ContactForm />
      </section>
    </div>
  );
}
