'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Devlog } from '@/types';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';

interface DevlogCardProps {
  devlog: Devlog;
}

export const DevlogCard: React.FC<DevlogCardProps> = ({ devlog }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex flex-col rounded-2xl overflow-hidden glass-card border border-white/10 hover:border-cyan-500/40 h-full"
    >
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-900">
        <Image
          src={devlog.cover_image}
          alt={`${devlog.title} Cover Image`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80" />

        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 backdrop-blur-md">
            {devlog.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>{formatDate(devlog.published_at)}</span>
          </div>

          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            {devlog.title}
          </h3>

          <p className="text-slate-400 text-sm mt-2.5 leading-relaxed line-clamp-3">
            {devlog.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-white/5">
          <Link
            href={`/devlog/${devlog.slug}`}
            className="inline-flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-cyan-400 hover:text-cyan-300 transition-colors group/link"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>READ FULL ARTICLE</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
};
