import { createBrowserClient } from '@supabase/ssr';
import { Game, Devlog, SiteSettings, ContactMessage } from '@/types';
import { MOCK_GAMES, MOCK_DEVLOGS, MOCK_MESSAGES } from '@/lib/mock-data';
import { siteConfig } from '@/config/siteConfig';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const formatSupabaseError = (error: unknown): string => {
  const msg = typeof error === 'string' ? error : (error as { message?: string })?.message || String(error);
  if (!msg) return 'Database request failed.';
  if (msg.includes('<!DOCTYPE') || msg.includes('<html') || msg.includes('404')) {
    return 'Invalid Supabase API URL. Please check NEXT_PUBLIC_SUPABASE_URL in .env.local — it must be your Project API URL (e.g. https://<project-id>.supabase.co), NOT your Supabase Dashboard link.';
  }
  return msg;
};

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes('your-project') &&
    !supabaseAnonKey.includes('your-supabase-anon-key') &&
    !supabaseUrl.includes('/dashboard/') &&
    !supabaseUrl.includes('app.supabase.com')
);

export const supabase = isSupabaseConfigured
  ? createBrowserClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// 1. DATA READ SERVICES (WITH RIGOROUS CONFIG CHECKS)
// ==========================================

export const getGames = async (): Promise<Game[]> => {
  if (!supabase) return MOCK_GAMES;
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*, images:game_images(*), features:game_features(*), technologies:game_technologies(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Error] getGames failed:', formatSupabaseError(error.message));
      return [];
    }
    return (data as Game[]) || [];
  } catch (err) {
    console.error('[Supabase Exception] getGames:', formatSupabaseError(err));
    return [];
  }
};

export const getGameBySlug = async (slug: string): Promise<Game | null> => {
  if (!supabase) {
    return MOCK_GAMES.find((g) => g.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('games')
      .select('*, images:game_images(*), features:game_features(*), technologies:game_technologies(*)')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`[Supabase Error] getGameBySlug (${slug}):`, formatSupabaseError(error.message));
      return null;
    }
    return data as Game;
  } catch (err) {
    console.error(`[Supabase Exception] getGameBySlug (${slug}):`, formatSupabaseError(err));
    return null;
  }
};

export const getDevlogs = async (): Promise<Devlog[]> => {
  if (!supabase) return MOCK_DEVLOGS;
  try {
    const { data, error } = await supabase
      .from('devlogs')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (error) {
      console.error('[Supabase Error] getDevlogs failed:', formatSupabaseError(error.message));
      return MOCK_DEVLOGS;
    }
    return (data as Devlog[]) || [];
  } catch (err) {
    console.error('[Supabase Exception] getDevlogs:', formatSupabaseError(err));
    return MOCK_DEVLOGS;
  }
};

export const getDevlogBySlug = async (slug: string): Promise<Devlog | null> => {
  if (!supabase) {
    return MOCK_DEVLOGS.find((d) => d.slug === slug) || null;
  }
  try {
    const { data, error } = await supabase
      .from('devlogs')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      console.error(`[Supabase Error] getDevlogBySlug (${slug}):`, formatSupabaseError(error.message));
      return null;
    }
    return data as Devlog;
  } catch (err) {
    console.error(`[Supabase Exception] getDevlogBySlug (${slug}):`, formatSupabaseError(err));
    return null;
  }
};

export const getSiteSettings = async (): Promise<SiteSettings> => {
  if (!supabase) return siteConfig;
  try {
    const { data, error } = await supabase.from('site_settings').select('*').limit(1).single();
    if (error || !data) {
      console.warn('[Supabase Warning] site_settings fallback to siteConfig:', formatSupabaseError(error?.message));
      return siteConfig;
    }
    return {
      studio_name: data.studio_name || siteConfig.studio_name,
      developer_name: data.developer_name || siteConfig.developer_name,
      tagline: data.tagline || siteConfig.tagline,
      biography: data.biography || siteConfig.biography,
      developer_bio: data.developer_bio || siteConfig.developer_bio,
      email: data.email || siteConfig.email,
      social_links: siteConfig.social_links,
      profile_image: siteConfig.profile_image,
      resume_url: siteConfig.resume_url,
      availability: siteConfig.availability,
      hero_title: siteConfig.hero_title,
      hero_subtitle: siteConfig.hero_subtitle,
      hero_text: data.hero_text || siteConfig.hero_text,
    };
  } catch (err) {
    console.error('[Supabase Exception] getSiteSettings:', formatSupabaseError(err));
    return siteConfig;
  }
};

// ==========================================
// 2. CONTACT FORM DISPATCH SERVICE
// ==========================================

export const submitContactMessage = async (
  name: string,
  email: string,
  message: string
): Promise<{ success: boolean; dbSaved?: boolean; emailSent?: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: formatSupabaseError(data.error || 'Failed to submit contact message.'),
      };
    }

    return {
      success: true,
      dbSaved: data.dbSaved,
      emailSent: data.emailSent,
    };
  } catch (err: unknown) {
    const errorMsg = formatSupabaseError(err);
    console.error('[Contact Error] submitContactMessage exception:', err);
    return { success: false, error: errorMsg };
  }
};

// ==========================================
// 3. ADMIN AUTHENTICATION SERVICES
// ==========================================

export const signInAdmin = async (
  email: string,
  password: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: formatSupabaseError(error.message) };
    }

    if (data.session) {
      return { success: true };
    }

    return { success: false, error: 'Session authentication failed.' };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const signOutAdmin = async (): Promise<void> => {
  if (supabase) {
    await supabase.auth.signOut();
  }
};

export const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  try {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '';
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const getAdminSession = async (): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return false;

    // Verify if current user email matches admin config or role
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'rohanzstudios09@gmail.com';
    if (user.email?.toLowerCase() === adminEmail.toLowerCase()) {
      return true;
    }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    return profile?.role === 'admin';
  } catch {
    return false;
  }
};

// ==========================================
// 4. ADMIN CMS DATABASE WRITE MUTATIONS
// ==========================================

export const saveGame = async (game: Partial<Game>): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const payload = {
      title: game.title,
      slug: game.slug,
      short_description: game.short_description,
      description: game.description,
      genre: game.genre,
      engine: game.engine,
      status: game.status || 'In Development',
      release_date: game.release_date,
      featured: game.featured || false,
      cover_image: game.cover_image,
      hero_image: game.hero_image,
      trailer_url: game.trailer_url,
      steam_url: game.steam_url,
      itch_url: game.itch_url,
      github_url: game.github_url,
      updated_at: new Date().toISOString(),
    };

    if (game.id && !game.id.startsWith('game-')) {
      const { error } = await supabase.from('games').update(payload).eq('id', game.id);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    } else {
      const { error } = await supabase.from('games').insert([payload]);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const deleteGame = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const saveDevlog = async (devlog: Partial<Devlog>): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const payload = {
      title: devlog.title,
      slug: devlog.slug,
      excerpt: devlog.excerpt,
      content: devlog.content,
      cover_image: devlog.cover_image || '/images/rohanz-logo.png',
      category: devlog.category || 'Devlog',
      published: devlog.published ?? true,
      updated_at: new Date().toISOString(),
    };

    if (devlog.id && !devlog.id.startsWith('devlog-')) {
      const { error } = await supabase.from('devlogs').update(payload).eq('id', devlog.id);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    } else {
      const { error } = await supabase.from('devlogs').insert([payload]);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const deleteDevlog = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('devlogs').delete().eq('id', id);
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const saveSiteSettings = async (settings: SiteSettings): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const payload = {
      studio_name: settings.studio_name,
      developer_name: settings.developer_name,
      tagline: settings.tagline,
      biography: settings.biography,
      developer_bio: settings.developer_bio,
      email: settings.email,
      hero_text: settings.hero_text,
      updated_at: new Date().toISOString(),
    };

    const { data: existingRows } = await supabase.from('site_settings').select('id').limit(1);

    if (existingRows && existingRows.length > 0) {
      const { error } = await supabase.from('site_settings').update(payload).eq('id', existingRows[0].id);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    } else {
      const { error } = await supabase.from('site_settings').insert([{ id: 1, ...payload }]);
      if (error) return { success: false, error: formatSupabaseError(error.message) };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

// ==========================================
// 5. REAL SUPABASE STORAGE SERVICES
// ==========================================

export const uploadStorageFile = async (
  file: File,
  bucket: string = 'game-covers'
): Promise<{ success: boolean; url?: string; name?: string; path?: string; size?: string; error?: string }> => {
  if (!supabase) {
    return { success: false, error: 'Supabase client is not configured.' };
  }

  // Defensive Upload Hardening: Allowed MIME types & max size limit (5 MB)
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
  if (!allowedMimeTypes.includes(file.type.toLowerCase())) {
    return { success: false, error: 'Invalid file type. Only JPEG, PNG, WEBP, GIF, and SVG images are permitted.' };
  }

  const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { success: false, error: 'File size exceeds maximum permitted limit of 5 MB.' };
  }

  try {
    const rawExt = file.name.split('.').pop() || 'png';
    const fileExt = rawExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanBaseName = file.name.substring(0, file.name.lastIndexOf('.')).replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${Date.now()}_${cleanBaseName}.${fileExt}`;

    const { data, error } = await supabase.storage.from(bucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (error) {
      return { success: false, error: formatSupabaseError(error.message) };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;

    return {
      success: true,
      url: publicUrlData.publicUrl,
      name: file.name,
      path: data.path,
      size: sizeStr,
    };
  } catch (err: unknown) {
    return { success: false, error: formatSupabaseError(err) };
  }
};

export const listStorageFiles = async (
  targetBucket?: string
): Promise<{ id: string; name: string; bucket: string; url: string; size: string }[]> => {
  if (!supabase) return [];
  const bucketsToList = targetBucket && targetBucket !== 'ALL'
    ? [targetBucket]
    : ['logos', 'profile', 'game-covers', 'game-images', 'devlog-images'];

  try {
    const allFiles: { id: string; name: string; bucket: string; url: string; size: string }[] = [];

    for (const b of bucketsToList) {
      const { data, error } = await supabase.storage.from(b).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (!error && data) {
        data.forEach((item) => {
          if (item.name !== '.emptyFolderPlaceholder') {
            const { data: publicUrlData } = supabase.storage.from(b).getPublicUrl(item.name);
            allFiles.push({
              id: item.id || `${b}-${item.name}`,
              name: item.name,
              bucket: b,
              url: publicUrlData.publicUrl,
              size: item.metadata?.size ? `${(item.metadata.size / 1024).toFixed(1)} KB` : 'Unknown',
            });
          }
        });
      }
    }

    return allFiles;
  } catch {
    return [];
  }
};

export const deleteStorageFile = async (
  bucket: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.storage.from(bucket).remove([fileName]);
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: formatSupabaseError(err) };
  }
};

export const getContactMessages = async (): Promise<ContactMessage[]> => {
  if (!supabase) return MOCK_MESSAGES;
  try {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Supabase Error] getContactMessages:', formatSupabaseError(error.message));
      return MOCK_MESSAGES;
    }
    return (data as ContactMessage[]) || [];
  } catch (err) {
    console.error('[Supabase Exception] getContactMessages:', formatSupabaseError(err));
    return MOCK_MESSAGES;
  }
};

export const updateContactMessageStatus = async (
  id: string,
  status: 'read' | 'unread' | 'replied'
): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id);
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};

export const deleteContactMessage = async (id: string): Promise<{ success: boolean; error?: string }> => {
  if (!supabase) return { success: true };
  try {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) return { success: false, error: formatSupabaseError(error.message) };
    return { success: true };
  } catch (err: unknown) {
    const msg = formatSupabaseError(err);
    return { success: false, error: msg };
  }
};
