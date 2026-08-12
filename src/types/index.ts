export type GameStatus = 'In Development' | 'Prototype' | 'Alpha' | 'Beta' | 'Released' | 'Archived';

export interface GameImage {
  id: string;
  game_id: string;
  image_url: string;
  caption?: string;
  sort_order: number;
  created_at?: string;
}

export interface GameFeature {
  id: string;
  game_id: string;
  title: string;
  description: string;
  sort_order: number;
}

export interface GameTechnology {
  id: string;
  game_id: string;
  technology: string;
  sort_order: number;
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  genre: string;
  engine: string;
  status: GameStatus;
  release_date?: string;
  featured: boolean;
  cover_image: string;
  hero_image?: string;
  trailer_url?: string;
  steam_url?: string;
  itch_url?: string;
  github_url?: string;
  created_at?: string;
  updated_at?: string;
  images?: GameImage[];
  features?: GameFeature[];
  technologies?: GameTechnology[];
}

export interface Devlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: 'Devlog' | 'Architecture' | 'Shader' | 'Mechanics' | 'Postmortem' | 'Update';
  published: boolean;
  published_at: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteSettings {
  site_url?: string;
  studio_name: string;
  developer_name: string;
  tagline: string;
  description?: string;
  biography: string;
  developer_bio: string;
  email: string;
  social_links: {
    github: string;
    linkedin: string;
    instagram?: string;
    twitter?: string;
    youtube: string;
    discord: string;
    steam?: string;
    itch?: string;
  };
  profile_image: string;
  resume_url: string;
  availability: string;
  hero_title: string;
  hero_subtitle: string;
  hero_text: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: 'unread' | 'read' | 'replied';
}

export interface SkillCategory {
  title: string;
  skills: {
    name: string;
    level: string;
    description: string;
    icon?: string;
  }[];
}

export interface TimelineMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  icon?: string;
}
