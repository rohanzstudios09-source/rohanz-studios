import { MetadataRoute } from 'next';
import { getGames, getDevlogs } from '@/lib/supabase/client';
import { siteConfig } from '@/config/siteConfig';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.siteUrl;

  const games = await getGames();
  const allDevlogs = await getDevlogs();
  const devlogs = allDevlogs.filter((d) => d.published !== false);

  const gameUrls = games.map((g) => ({
    url: `${baseUrl}/games/${g.slug}`,
    lastModified: new Date(g.updated_at || g.created_at || Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const devlogUrls = devlogs.map((d) => ({
    url: `${baseUrl}/devlog/${d.slug}`,
    lastModified: new Date(d.updated_at || d.published_at || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/games`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/devlog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/skills`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...gameUrls,
    ...devlogUrls,
  ];
}
