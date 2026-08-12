'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { siteConfig, navLinks } from '@/config/siteConfig';
import { Shield, Lock } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { InstagramIcon, GithubIcon, LinkedinIcon, YoutubeIcon, DiscordIcon } from '@/components/ui/SocialIcons';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative bg-[#040507] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-cyan-500/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/10">
          {/* Col 1: Studio Identity */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo size="lg" />
            <p className="text-slate-400 text-sm max-w-md leading-relaxed mt-2">
              Rohanz Studios is an independent game development studio dedicated to building atmospheric game worlds, fluid gameplay mechanics, and unforgettable interactive experiences.
            </p>
            
            {/* Social Icons Bar */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              {siteConfig.social_links.github && (
                <a
                  href={siteConfig.social_links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rohanz Studios GitHub"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  <GithubIcon className="w-5 h-5" />
                </a>
              )}

              {siteConfig.social_links.linkedin && (
                <a
                  href={siteConfig.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rohanz Studios LinkedIn"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  <LinkedinIcon className="w-5 h-5" />
                </a>
              )}

              {siteConfig.social_links.instagram && (
                <a
                  href={siteConfig.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rohanz Studios Instagram (@rohanz_studios)"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  <InstagramIcon className="w-5 h-5" />
                </a>
              )}

              {siteConfig.social_links.youtube && (
                <a
                  href={siteConfig.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rohanz Studios YouTube"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              )}

              {siteConfig.social_links.discord ? (
                <a
                  href={siteConfig.social_links.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Rohanz Studios Discord (@rohanzstudios)"
                  className="p-2.5 rounded-full bg-slate-900 border border-white/10 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer flex items-center justify-center min-w-[44px] min-h-[44px]"
                >
                  <DiscordIcon className="w-5 h-5" />
                </a>
              ) : (
                <div
                  title="Discord: @rohanzstudios (Direct URL Configurable)"
                  className="p-2.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-500 flex items-center justify-center relative group cursor-help min-w-[44px] min-h-[44px]"
                >
                  <DiscordIcon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                  <span className="sr-only">Discord @rohanzstudios</span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono tracking-widest text-slate-300 uppercase font-semibold">
              NAVIGATION
            </h3>
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors hover:translate-x-1 inline-block duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Studio Tech & Admin */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-mono tracking-widest text-slate-300 uppercase font-semibold">
              STUDIO PORTAL
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-500 font-mono text-xs">STATUS:</span>{' '}
                <span className="text-cyan-400 font-mono text-xs font-bold">ACTIVE DEVELOPMENT</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-xs">ENGINES:</span>{' '}
                <span className="text-slate-300">Unreal Engine 5 / Unity</span>
              </li>
              <li>
                <span className="text-slate-500 font-mono text-xs">CONTACT:</span>{' '}
                <a href={`mailto:${siteConfig.email}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
                  {siteConfig.email}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>ADMIN CMS</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-500">
          <p>© {new Date().getFullYear()} ROHANZ STUDIOS. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> INDIE GAME STUDIO
            </span>
            <span>BUILT WITH NEXT.JS & THREE.JS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
