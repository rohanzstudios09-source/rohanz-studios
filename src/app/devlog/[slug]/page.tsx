import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getDevlogBySlug, getDevlogs } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { ArrowLeft, Calendar, User } from 'lucide-react';

import { siteConfig } from '@/config/siteConfig';

interface DevlogDetailProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const devlogs = await getDevlogs();
  return devlogs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: DevlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const devlog = await getDevlogBySlug(slug);
  if (!devlog) return { title: 'Devlog Not Found' };

  const canonicalUrl = `${siteConfig.siteUrl}/devlog/${devlog.slug}`;
  const imageUrl = devlog.cover_image.startsWith('http')
    ? devlog.cover_image
    : `${siteConfig.siteUrl}${devlog.cover_image}`;

  return {
    title: `${devlog.title} | Rohanz Studios Devlog`,
    description: devlog.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      title: `${devlog.title} | Rohanz Studios Devlog`,
      description: devlog.excerpt,
      url: canonicalUrl,
      siteName: 'Rohanz Studios',
      images: [{ url: imageUrl, alt: devlog.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${devlog.title} | Rohanz Studios Devlog`,
      description: devlog.excerpt,
      images: [imageUrl],
    },
  };
}

export default async function DevlogDetailPage({ params }: DevlogDetailProps) {
  const { slug } = await params;
  const devlog = await getDevlogBySlug(slug);

  if (!devlog) {
    notFound();
  }

  const imageUrl = devlog.cover_image.startsWith('http')
    ? devlog.cover_image
    : `${siteConfig.siteUrl}${devlog.cover_image}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: devlog.title,
    description: devlog.excerpt,
    image: imageUrl,
    datePublished: devlog.published_at,
    dateModified: devlog.updated_at || devlog.published_at,
    author: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Rohanz Studios',
      url: siteConfig.siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.siteUrl}/images/rohanz-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.siteUrl}/devlog/${devlog.slug}`,
    },
  };

  return (
    <article className="pt-32 pb-24 min-h-screen max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Back Link */}
      <Link
        href="/devlog"
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-slate-300 hover:text-white text-xs font-mono mb-8 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>BACK TO DEVLOGS</span>
      </Link>

      {/* Header Info */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-md text-xs font-mono tracking-wider uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
            {devlog.category}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            {formatDate(devlog.published_at)}
          </span>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            Rohanz Studios
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight">
          {devlog.title}
        </h1>

        <p className="text-lg text-slate-300 leading-relaxed font-light border-l-2 border-cyan-400 pl-4 py-1 italic bg-cyan-950/20 rounded-r-lg">
          {devlog.excerpt}
        </p>
      </div>

      {/* Cover Image */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10 mb-12">
        <Image
          src={devlog.cover_image}
          alt={devlog.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Body Content */}
      <div className="glass-panel p-6 sm:p-12 rounded-2xl border border-white/10 prose prose-invert prose-cyan max-w-none text-slate-300 leading-relaxed whitespace-pre-line text-base overflow-x-auto break-words">
        {devlog.content}
      </div>
    </article>
  );
}
