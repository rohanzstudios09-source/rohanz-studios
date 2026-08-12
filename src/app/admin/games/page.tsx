'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { getGames, saveGame, deleteGame } from '@/lib/supabase/client';
import { Game } from '@/types';
import { Plus, Edit, Trash2, CheckCircle, ExternalLink, Star, Loader2 } from 'lucide-react';

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGame, setCurrentGame] = useState<Partial<Game>>({});
  const [notification, setNotification] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function init() {
      const data = await getGames();
      if (active) {
        setGames(data);
        setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const fetchGames = async () => {
    const data = await getGames();
    setGames(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateNew = () => {
    setCurrentGame({
      title: '',
      slug: '',
      short_description: '',
      description: '',
      genre: 'Action',
      engine: 'Unreal Engine 5',
      status: 'In Development',
      featured: false,
      cover_image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80',
    });
    setIsEditing(true);
  };

  const handleEdit = (game: Game) => {
    setCurrentGame(game);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      const res = await deleteGame(id);
      if (res.success) {
        showToast('Game deleted successfully.');
        fetchGames();
      } else {
        alert(res.error || 'Failed to delete game.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGame.title || !currentGame.slug) {
      alert('Title and Slug are required.');
      return;
    }

    setSaving(true);
    const res = await saveGame(currentGame);
    setSaving(false);

    if (res.success) {
      showToast('Game saved successfully.');
      setIsEditing(false);
      fetchGames();
    } else {
      alert(res.error || 'Failed to save game.');
    }
  };

  return (
    <AdminAuthGuard>
      <div className="flex w-full min-h-screen">
        <AdminSidebar />

        <main className="flex-grow p-6 pt-20 md:p-12 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                CMS MANAGEMENT
              </span>
              <h1 className="text-3xl font-black text-white uppercase mt-1">
                GAMES PORTFOLIO MANAGER
              </h1>
            </div>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_#06b6d4] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE NEW GAME</span>
            </button>
          </div>

          {notification && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>{notification}</span>
            </div>
          )}

          {/* Modal / Form View */}
          {isEditing ? (
            <div className="p-8 rounded-2xl glass-panel border border-white/10 max-w-3xl">
              <h2 className="text-xl font-bold text-white uppercase font-mono mb-6">
                {currentGame.id ? 'EDIT GAME' : 'CREATE GAME'}
              </h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">GAME TITLE *</label>
                    <input
                      type="text"
                      required
                      value={currentGame.title || ''}
                      onChange={(e) =>
                        setCurrentGame({
                          ...currentGame,
                          title: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">URL SLUG *</label>
                    <input
                      type="text"
                      required
                      value={currentGame.slug || ''}
                      onChange={(e) => setCurrentGame({ ...currentGame, slug: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-2">GENRE</label>
                    <input
                      type="text"
                      value={currentGame.genre || ''}
                      onChange={(e) => setCurrentGame({ ...currentGame, genre: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2">ENGINE</label>
                    <select
                      value={currentGame.engine || 'Unreal Engine 5'}
                      onChange={(e) => setCurrentGame({ ...currentGame, engine: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="Unreal Engine 5">Unreal Engine 5</option>
                      <option value="Unity">Unity</option>
                      <option value="Custom C++ Engine">Custom C++ Engine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2">STATUS</label>
                    <select
                      value={currentGame.status || 'In Development'}
                      onChange={(e) => setCurrentGame({ ...currentGame, status: e.target.value as Game['status'] })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="In Development">In Development</option>
                      <option value="Prototype">Prototype</option>
                      <option value="Alpha">Alpha</option>
                      <option value="Released">Released</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">SHORT DESCRIPTION</label>
                  <input
                    type="text"
                    value={currentGame.short_description || ''}
                    onChange={(e) => setCurrentGame({ ...currentGame, short_description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">FULL DESCRIPTION & STORY</label>
                  <textarea
                    rows={4}
                    value={currentGame.description || ''}
                    onChange={(e) => setCurrentGame({ ...currentGame, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">COVER IMAGE URL</label>
                  <input
                    type="text"
                    value={currentGame.cover_image || ''}
                    onChange={(e) => setCurrentGame({ ...currentGame, cover_image: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={currentGame.featured || false}
                    onChange={(e) => setCurrentGame({ ...currentGame, featured: e.target.checked })}
                    className="w-4 h-4 accent-cyan-500"
                  />
                  <label htmlFor="featured" className="text-slate-300 font-bold">
                    FEATURE ON HOMEPAGE
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>SAVE GAME</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* List Table */
            <div className="p-6 rounded-2xl glass-panel border border-white/10 overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>FETCHING GAMES FROM SUPABASE...</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase">
                      <th className="py-3 px-4">GAME TITLE</th>
                      <th className="py-3 px-4">GENRE</th>
                      <th className="py-3 px-4">ENGINE</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4">FEATURED</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {games.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-900/40">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                          <span>{g.title}</span>
                          <a href={`/games/${g.slug}`} target="_blank" className="text-cyan-400 hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="py-4 px-4 text-slate-400">{g.genre}</td>
                        <td className="py-4 px-4 text-cyan-400 font-semibold">{g.engine}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-1 rounded bg-slate-900 border border-white/10 text-[10px] uppercase">
                            {g.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {g.featured ? (
                            <span className="inline-flex items-center gap-1 text-amber-400">
                              <Star className="w-3.5 h-3.5 fill-amber-400" /> YES
                            </span>
                          ) : (
                            <span className="text-slate-600">NO</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(g)}
                              className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(g.id)}
                              className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {games.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500 font-mono">
                          No games found. Click &quot;CREATE NEW GAME&quot; to add your first project.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
