-- =========================================================
-- ROHANZ STUDIOS - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- =========================================================

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  genre TEXT NOT NULL,
  engine TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'In Development',
  release_date TEXT,
  featured BOOLEAN DEFAULT false,
  cover_image TEXT NOT NULL,
  hero_image TEXT,
  trailer_url TEXT,
  steam_url TEXT,
  itch_url TEXT,
  github_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.game_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.game_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.game_technologies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID REFERENCES public.games(id) ON DELETE CASCADE NOT NULL,
  technology TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.devlogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Devlog',
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  studio_name TEXT NOT NULL DEFAULT 'ROHANZ STUDIOS',
  developer_name TEXT NOT NULL DEFAULT 'Rohan (Rohanz Studios)',
  tagline TEXT NOT NULL DEFAULT 'Building immersive worlds, meaningful gameplay, and unforgettable experiences.',
  biography TEXT,
  developer_bio TEXT,
  email TEXT NOT NULL DEFAULT 'rohanzstudios09@gmail.com',
  social_links JSONB DEFAULT '{}'::jsonb,
  profile_image TEXT,
  resume_url TEXT,
  availability TEXT DEFAULT 'Available for Game Dev Collaborations',
  hero_title TEXT DEFAULT 'ROHANZ STUDIOS',
  hero_subtitle TEXT DEFAULT 'GAME DEVELOPER',
  hero_text TEXT DEFAULT 'Building immersive worlds, meaningful gameplay, and unforgettable experiences.',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Performance Indexes
CREATE INDEX IF NOT EXISTS games_slug_idx ON public.games(slug);
CREATE INDEX IF NOT EXISTS games_featured_idx ON public.games(featured);
CREATE INDEX IF NOT EXISTS devlogs_slug_idx ON public.devlogs(slug);
CREATE INDEX IF NOT EXISTS devlogs_published_idx ON public.devlogs(published);
CREATE INDEX IF NOT EXISTS contact_messages_status_idx ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx ON public.contact_messages(created_at DESC);

-- 3. Admin Verification Helper Function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.role() = 'authenticated' AND (
      EXISTS (
        SELECT 1 FROM public.admin_profiles
        WHERE user_id = auth.uid() AND role = 'admin'
      ) OR EXISTS (
        SELECT 1 FROM auth.users
        WHERE id = auth.uid() AND lower(email) = lower(current_setting('app.settings.admin_email', true))
      )
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devlogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Public Read Access Policies
CREATE POLICY "Public read for games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public read for game_images" ON public.game_images FOR SELECT USING (true);
CREATE POLICY "Public read for game_features" ON public.game_features FOR SELECT USING (true);
CREATE POLICY "Public read for game_technologies" ON public.game_technologies FOR SELECT USING (true);
CREATE POLICY "Public read for published devlogs" ON public.devlogs FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "Public read for site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Authenticated Admin Policies (Checked against admin_profiles / admin email)
CREATE POLICY "Admin write for games" ON public.games FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write for game_images" ON public.game_images FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write for game_features" ON public.game_features FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write for game_technologies" ON public.game_technologies FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin write for devlogs" ON public.devlogs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site_settings" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin select contact_messages" ON public.contact_messages FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin manage contact_messages" ON public.contact_messages FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Admin Profiles Hardening: Self read for authenticated users, modification strictly restricted to existing admins
CREATE POLICY "Admin profiles read" ON public.admin_profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin profiles write restricted" ON public.admin_profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 6. Storage Buckets Setup (Run in SQL editor)
INSERT INTO storage.buckets (id, name, public) VALUES ('logos', 'logos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('profile', 'profile', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('game-covers', 'game-covers', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('game-images', 'game-images', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('devlog-images', 'devlog-images', true) ON CONFLICT DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Public Read Storage" ON storage.objects FOR SELECT USING (bucket_id IN ('logos', 'profile', 'game-covers', 'game-images', 'devlog-images'));
CREATE POLICY "Admin Upload Storage" ON storage.objects FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admin Modify Storage" ON storage.objects FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin Delete Storage" ON storage.objects FOR DELETE USING (public.is_admin());
