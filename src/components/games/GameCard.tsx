'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Game } from '@/types';
import { ArrowRight, Cpu, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  priority?: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, priority = false }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Tilt calculations
    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;
    setRotateX(rX);
    setRotateY(rY);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const statusColors: Record<string, string> = {
    'In Development': 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    'Prototype': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    'Released': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    'Alpha': 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative rounded-2xl overflow-hidden glass-card flex flex-col h-full border border-white/10 hover:border-cyan-500/40"
    >
      {/* Cover Image Container */}
      <div className="relative w-full aspect-video overflow-hidden bg-slate-900">
        <Image
          src={game.cover_image}
          alt={`${game.title} Cover Art`}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/40 to-transparent" />

        {/* Status & Engine Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className={cn('px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase border backdrop-blur-md font-semibold', statusColors[game.status] || 'bg-slate-800 text-slate-300 border-white/10')}>
            {game.status}
          </span>
          <span className="px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase bg-black/60 text-slate-200 border border-white/10 backdrop-blur-md flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-cyan-400" />
            {game.engine}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow justify-between gap-4 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
            <Tag className="w-3.5 h-3.5" />
            <span>{game.genre}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
            {game.title}
          </h3>

          <p className="text-slate-400 text-sm mt-2.5 leading-relaxed line-clamp-3">
            {game.short_description}
          </p>
        </div>

        {/* Technologies preview */}
        {game.technologies && game.technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
            {game.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech.id || tech.technology}
                className="px-2 py-0.5 rounded bg-slate-900/80 border border-white/5 text-[10px] font-mono text-slate-400"
              >
                {tech.technology}
              </span>
            ))}
          </div>
        )}

        {/* Action Link */}
        <div className="pt-3">
          <Link
            href={`/games/${game.slug}`}
            className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-mono font-bold tracking-wider text-slate-200 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-400 transition-all duration-300"
          >
            <span>VIEW PROJECT</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
