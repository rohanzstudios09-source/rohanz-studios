import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-[#040507] overflow-hidden">
      {/* Background Sci-Fi Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-rose-500/5 blur-[150px] pointer-events-none animate-pulse-glow" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center flex flex-col items-center gap-6">
        <Logo size="xl" showText={false} href="" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/60 border border-rose-500/40 text-rose-400 text-xs font-mono tracking-widest uppercase">
          <Compass className="w-3.5 h-3.5 animate-spin" />
          <span>OUT OF BOUNDS</span>
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white uppercase text-glow">
          404 — WORLD NOT FOUND
        </h1>

        <p className="text-slate-400 text-base sm:text-lg max-w-md leading-relaxed font-light">
          The requested coordinate or game level scene does not exist in the current space-time matrix.
        </p>

        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs tracking-widest uppercase hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.4)]"
        >
          <Home className="w-4 h-4" />
          <span>RETURN HOME</span>
        </Link>
      </div>
    </div>
  );
}
