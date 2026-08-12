import React from 'react';
import { Metadata } from 'next';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { ContactForm } from '@/components/studio/ContactForm';
import { siteConfig } from '@/config/siteConfig';
import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, InstagramIcon, YoutubeIcon, DiscordIcon } from '@/components/ui/SocialIcons';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Rohanz Studios for game proposals, contract work, collaborations, or feedback.',
  alternates: {
    canonical: `${siteConfig.siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Rohanz Studios | Game Developer Collaborations',
    description: 'Get in touch with Rohanz Studios for game proposals, contract work, collaborations, or feedback.',
    url: `${siteConfig.siteUrl}/contact`,
    siteName: 'Rohanz Studios',
    images: [{ url: `${siteConfig.siteUrl}/images/rohanz-logo.png` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Rohanz Studios | Game Developer Collaborations',
    description: 'Get in touch with Rohanz Studios for game proposals, contract work, collaborations, or feedback.',
    images: [`${siteConfig.siteUrl}/images/rohanz-logo.png`],
  },
};

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      <SectionHeading
        badge="GET IN TOUCH"
        title="CONTACT ROHANZ STUDIOS"
        subtitle="We welcome game development inquiries, publisher interest, technical collaborations, and community feedback."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Info Column */}
        <div className="flex flex-col gap-8 p-8 rounded-2xl glass-panel border border-white/10">
          <div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
              DIRECT CHANNELS
            </span>
            <h2 className="text-2xl font-black text-white uppercase mt-1">
              STUDIO CONNECTIVITY
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Feel free to send a message using the transmission form or reach out directly through our social channels.
            </p>
          </div>

          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
              <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">PRIMARY EMAIL</span>
                <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-cyan-400 transition-colors font-bold">
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Social Links Matrix */}
          <div>
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase block mb-3 font-semibold">
              COMMUNITY & CODE NETWORKS
            </span>
            <div className="grid grid-cols-2 gap-3">
              {siteConfig.social_links.github && (
                <a
                  href={siteConfig.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 cursor-pointer"
                >
                  <GithubIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">GitHub</span>
                </a>
              )}

              {siteConfig.social_links.linkedin && (
                <a
                  href={siteConfig.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 cursor-pointer"
                >
                  <LinkedinIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">LinkedIn</span>
                </a>
              )}

              {siteConfig.social_links.instagram && (
                <a
                  href={siteConfig.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">Instagram</span>
                </a>
              )}

              {siteConfig.social_links.youtube && (
                <a
                  href={siteConfig.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 cursor-pointer"
                >
                  <YoutubeIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">YouTube</span>
                </a>
              )}

              {siteConfig.social_links.discord ? (
                <a
                  href={siteConfig.social_links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-mono transition-all duration-200 cursor-pointer"
                >
                  <DiscordIcon className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="font-bold">Discord</span>
                </a>
              ) : (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-slate-400 text-xs font-mono">
                  <DiscordIcon className="w-4 h-4 text-cyan-500/60 shrink-0" />
                  <span>Discord (@rohanzstudios)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Contact Form Column */}
        <ContactForm />
      </div>
    </div>
  );
}
