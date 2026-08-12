'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Gamepad2, Sparkles, Flame } from 'lucide-react';

const PHILOSOPHIES = [
  {
    icon: Compass,
    title: 'IMMERSION',
    tagline: 'Worlds Worth Exploring',
    description: 'We construct deep, atmospheric environments where lighting, acoustics, and non-Euclidean geometry evoke genuine mystery and curiosity.',
    color: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-400'
  },
  {
    icon: Gamepad2,
    title: 'GAMEPLAY',
    tagline: 'Tactile & Satisfying Mechanics',
    description: 'Prioritizing crisp momentum, responsive physics, coyote-time buffering, and tight movement feedback that feels exhilarating to control.',
    color: 'from-amber-500/20 to-orange-600/10 border-amber-500/30 text-amber-400'
  },
  {
    icon: Sparkles,
    title: 'ATMOSPHERE',
    tagline: 'Emotional Visuals & Sound',
    description: 'Fusing Lumen raytraced global illumination, volumetric fog HLSL shaders, and 3D spatial acoustics to command tension and mood.',
    color: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-400'
  },
  {
    icon: Flame,
    title: 'EXPERIMENTATION',
    tagline: 'Unconventional Ideas',
    description: 'Constantly testing new render techniques, stencil buffer portals, custom engine algorithms, and learning through rapid prototyping.',
    color: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-400'
  }
];

export const PhilosophySection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
      {PHILOSOPHIES.map((item, idx) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className={`p-8 rounded-2xl glass-card bg-gradient-to-br ${item.color} border backdrop-blur-xl relative overflow-hidden group`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-black/40 border border-white/10 shadow-inner">
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400">
                  {item.tagline}
                </span>
                <h3 className="text-xl font-extrabold tracking-tight text-white uppercase">
                  {item.title}
                </h3>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">
              {item.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};
