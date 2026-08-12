'use client';

import React, { useState, useMemo } from 'react';
import { Game } from '@/types';
import { GameCard } from './GameCard';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameGridProps {
  games: Game[];
  showFilters?: boolean;
}

export const GameGrid: React.FC<GameGridProps> = ({ games, showFilters = true }) => {
  const [selectedEngine, setSelectedEngine] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const engines = useMemo(() => {
    const set = new Set<string>();
    games.forEach((g) => {
      if (g.engine) set.add(g.engine);
    });
    return ['ALL', ...Array.from(set)];
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      const matchesEngine =
        selectedEngine === 'ALL' || game.engine.toLowerCase() === selectedEngine.toLowerCase();
      const matchesSearch =
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesEngine && matchesSearch;
    });
  }, [games, selectedEngine, searchQuery]);

  return (
    <div className="flex flex-col gap-8 w-full">
      {showFilters && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-panel">
          {/* Engine Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-cyan-400 shrink-0 ml-2" />
            {engines.map((engine) => (
              <button
                key={engine}
                onClick={() => setSelectedEngine(engine)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all whitespace-nowrap uppercase',
                  selectedEngine === engine
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_12px_#06b6d4]'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {engine}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Grid Display */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGames.map((game, idx) => (
            <GameCard key={game.id} game={game} priority={idx < 2} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-16 text-center glass-panel rounded-2xl">
          <p className="text-slate-400 font-mono text-sm">NO GAMES FOUND MATCHING YOUR CRITERIA.</p>
          <button
            onClick={() => {
              setSelectedEngine('ALL');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-mono"
          >
            RESET FILTERS
          </button>
        </div>
      )}
    </div>
  );
};
