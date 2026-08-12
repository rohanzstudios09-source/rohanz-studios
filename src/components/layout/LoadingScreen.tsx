'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/ui/Logo';

export const LoadingScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if session already loaded
    const hasLoaded = typeof window !== 'undefined' ? sessionStorage.getItem('rohanz_loaded') : null;
    if (hasLoaded) {
      const timer = setTimeout(() => setLoading(false), 0);
      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem('rohanz_loaded', 'true');
          }, 300);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#060709] selection:bg-cyan-500/30 overflow-hidden"
        >
          {/* Background Grid Accent */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
          <div className="absolute w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse-glow" />

          {/* Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center gap-6"
          >
            <Logo size="xl" showText={false} href="" priority />

            <div className="flex flex-col items-center text-center mt-2">
              <span className="text-2xl font-bold tracking-[0.3em] text-white">
                ROHANZ STUDIOS
              </span>
              <span className="text-xs tracking-[0.4em] font-mono text-cyan-400 mt-1 uppercase">
                INDEPENDENT GAME STUDIO
              </span>
            </div>

            {/* Progress Bar & Counter */}
            <div className="w-56 mt-6 flex flex-col items-center gap-2">
              <div className="w-full h-1 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div
                  className="h-full bg-gradient-to-r from-slate-400 via-cyan-400 to-cyan-500 rounded-full shadow-[0_0_12px_#06b6d4]"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between w-full text-[10px] font-mono text-slate-500 uppercase tracking-widest px-1">
                <span>INITIALIZING ENGINE</span>
                <span className="text-cyan-400 font-bold">{Math.min(progress, 100)}%</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
