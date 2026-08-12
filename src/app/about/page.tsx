import React from 'react';
import { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { PhilosophySection } from '@/components/studio/PhilosophySection';
import { JourneyTimeline } from '@/components/studio/JourneyTimeline';
import { siteConfig } from '@/config/siteConfig';
import { Shield, UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Rohanz Studios, an independent game development studio creating atmospheric worlds, satisfying physics mechanics, and memorable interactive games.',
  alternates: {
    canonical: `${siteConfig.siteUrl}/about`,
  },
  openGraph: {
    title: 'About Rohanz Studios | Independent Game Developer',
    description: 'Learn about Rohanz Studios, our development philosophy, technology stack, and game creation journey.',
    url: `${siteConfig.siteUrl}/about`,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Rohanz Studios | Independent Game Developer',
    description: 'Learn about Rohanz Studios, our development philosophy, technology stack, and game creation journey.',
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export default function AboutPage() {
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: 'About Rohanz Studios',
    url: `${siteConfig.siteUrl}/about`,
    description: siteConfig.description,
    mainEntity: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
      logo: `${siteConfig.siteUrl}/images/rohanz-logo.png`,
      description: siteConfig.description,
      email: siteConfig.email,
      founder: {
        '@type': 'Person',
        name: siteConfig.developer_name,
        jobTitle: 'Game Developer & Graphics Engineer',
      },
    },
  };

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <SectionHeading
        badge="STUDIO & DEVELOPER IDENTITY"
        title="ABOUT ROHANZ STUDIOS"
        subtitle="Creating atmospheric worlds, satisfying physics mechanics, and memorable interactive games."
      />

      {/* Distinction Cards: Studio Identity vs Developer Identity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
        {/* Card 1: Studio Identity */}
        <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-cyan-500/30 flex flex-col justify-between gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                  ORGANIZATION
                </span>
                <h2 className="text-2xl font-black text-white uppercase">
                  ROHANZ STUDIOS
                </h2>
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed mb-4">
              {siteConfig.biography}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">FOCUS:</span>
                <span className="text-cyan-400">Atmospheric Horror & Physics Action</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PRIMARY ENGINES:</span>
                <span className="text-slate-200">Unreal Engine 5 & Unity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Developer Identity */}
        <div className="p-8 sm:p-10 rounded-2xl glass-panel border border-amber-500/30 flex flex-col justify-between gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  FOUNDER & DEVELOPER
                </span>
                <h2 className="text-2xl font-black text-white uppercase">
                  {siteConfig.developer_name}
                </h2>
              </div>
            </div>

            <p className="text-slate-300 text-base leading-relaxed mb-4">
              {siteConfig.developer_bio}
            </p>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-white/5 font-mono text-xs text-slate-400 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">SPECIALIZATIONS:</span>
                <span className="text-amber-400">C++, Shader HLSL, R3F WebGL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">STATUS:</span>
                <span className="text-emerald-400">{siteConfig.availability}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">CONTACT:</span>
                <span className="text-slate-200">{siteConfig.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="my-20">
        <SectionHeading
          badge="OUR CORE PRINCIPLES"
          title="STUDIO PHILOSOPHY"
          subtitle="Immersion, satisfying gameplay mechanics, atmospheric lighting, and continuous experimentation."
        />
        <PhilosophySection />
      </div>

      {/* Development Journey Timeline */}
      <div className="my-20">
        <SectionHeading
          badge="HISTORICAL TIMELINE"
          title="STUDIO EVOLUTION"
          subtitle="Key milestones shaping the growth of Rohanz Studios."
        />
        <JourneyTimeline />
      </div>
    </div>
  );
}
