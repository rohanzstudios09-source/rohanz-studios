'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from '@/lib/mock-data';
import { Cpu, Code2, Box, Wrench } from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'GAME ENGINES': Cpu,
  'PROGRAMMING & SYSTEMS': Code2,
  '3D ART & ANIMATION': Box,
  'TOOLS & PIPELINES': Wrench,
};

export const SkillMatrix: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {SKILL_CATEGORIES.map((cat, idx) => {
        const CategoryIcon = CATEGORY_ICONS[cat.title] || Cpu;
        return (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 rounded-2xl glass-panel border border-white/10 flex flex-col gap-6"
          >
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <CategoryIcon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-mono tracking-widest text-white uppercase font-bold">
                {cat.title}
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              {cat.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold text-white font-mono">
                      {skill.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold uppercase bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                      {skill.level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
