'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { TIMELINE_MILESTONES } from '@/lib/mock-data';
import { Milestone } from 'lucide-react';

export const JourneyTimeline: React.FC = () => {
  return (
    <div className="relative max-w-4xl mx-auto py-8">
      {/* Central Connecting Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 via-slate-700 to-transparent -translate-x-1/2" />

      <div className="flex flex-col gap-12">
        {TIMELINE_MILESTONES.map((item, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <motion.div
              key={item.year + item.title}
              initial={{ opacity: 0, x: isEven ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className={`relative flex flex-col md:flex-row items-start ${
                isEven ? 'md:flex-row-reverse' : ''
              } gap-8 pl-12 md:pl-0`}
            >
              {/* Central Node Badge */}
              <div className="absolute left-4 md:left-1/2 top-1.5 -translate-x-1/2 w-8 h-8 rounded-full bg-[#060709] border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_15px_#06b6d4] z-10">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              {/* Card Container */}
              <div className={`w-full md:w-[calc(50%-2.5rem)] ${isEven ? 'text-left' : 'text-left'}`}>
                <div className="p-6 rounded-2xl glass-panel border border-white/10 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                      {item.year}
                    </span>
                    <span className="text-[10px] font-mono tracking-wider uppercase text-slate-500 flex items-center gap-1">
                      <Milestone className="w-3 h-3 text-cyan-400" />
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white mt-1">
                    {item.title}
                  </h3>

                  <h4 className="text-xs font-mono text-cyan-300 mt-0.5 mb-3">
                    {item.subtitle}
                  </h4>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
