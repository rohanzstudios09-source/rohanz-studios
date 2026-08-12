import { SiteSettings } from '@/types';

export const siteConfig: SiteSettings & { siteUrl: string } = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://rohanzstudios.com',
  studio_name: 'Rohanz Studios',
  developer_name: 'Rohan (Rohanz Studios)',
  tagline: 'Rohanz Studios is an independent game development studio creating immersive worlds, atmospheric games, and interactive experiences.',
  description: 'Rohanz Studios is an independent game development studio creating immersive worlds, atmospheric games, and interactive experiences.',
  biography: 'Rohanz Studios is an independent game development studio focused on building atmospheric interactive experiences, experimenting with mechanics, storytelling, and high-performance 3D graphics technology.',
  developer_bio: 'Passionate 3D Game Developer, Graphics Engineer, and Systems Architect specializing in Unreal Engine 5, Unity, custom shaders, and modern web interactive experiences.',
  email: 'rohanzstudios09@gmail.com',
  social_links: {
    github: 'https://github.com/rohanzstudios09-source',
    linkedin: 'https://www.linkedin.com/in/rohanz-studios-b74795429/',
    instagram: 'https://www.instagram.com/rohanz_studios/',
    youtube: 'https://youtube.com/@rohanzstudios',
    discord: '', // Configurable: Add valid direct invite/profile URL when available (Display: @rohanzstudios)
    steam: 'https://store.steampowered.com',
    itch: 'https://rohanzstudios.itch.io',
    twitter: 'https://x.com/rohanzstudios'
  },
  profile_image: '/images/rohanz-logo.png',
  resume_url: '#',
  availability: 'Available for Game Dev Collaborations & Key Projects',
  hero_title: 'ROHANZ STUDIOS',
  hero_subtitle: 'GAME DEVELOPER',
  hero_text: 'Welcome to Rohanz Studios — an independent game development studio focused on creating atmospheric, engaging, and cinematic interactive experiences.'
};

export const navLinks = [
  { name: 'HOME', href: '/' },
  { name: 'GAMES', href: '/games' },
  { name: 'ABOUT', href: '/about' },
  { name: 'DEVLOG', href: '/devlog' },
  { name: 'SKILLS', href: '/skills' },
  { name: 'CONTACT', href: '/contact' },
];
