'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { getDevlogs, saveDevlog, deleteDevlog } from '@/lib/supabase/client';
import { Devlog } from '@/types';
import { Plus, Edit, Trash2, CheckCircle, ExternalLink, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDevlogsPage() {
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDevlog, setCurrentDevlog] = useState<Partial<Devlog>>({});
  const [notification, setNotification] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function init() {
      const data = await getDevlogs();
      if (active) {
        setDevlogs(data);
        setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const fetchDevlogs = async () => {
    const data = await getDevlogs();
    setDevlogs(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreateNew = () => {
    setCurrentDevlog({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: 'Devlog',
      published: true,
      published_at: new Date().toISOString(),
      cover_image: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80',
    });
    setIsEditing(true);
  };

  const handleEdit = (d: Devlog) => {
    setCurrentDevlog(d);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this devlog article?')) {
      const res = await deleteDevlog(id);
      if (res.success) {
        showToast('Devlog deleted successfully.');
        fetchDevlogs();
      } else {
        alert(res.error || 'Failed to delete devlog.');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDevlog.title || !currentDevlog.slug) {
      alert('Title and Slug are required.');
      return;
    }

    setSaving(true);
    const res = await saveDevlog(currentDevlog);
    setSaving(false);

    if (res.success) {
      showToast('Devlog saved successfully.');
      setIsEditing(false);
      fetchDevlogs();
    } else {
      alert(res.error || 'Failed to save devlog.');
    }
  };

  return (
    <AdminAuthGuard>
      <div className="flex w-full min-h-screen">
        <AdminSidebar />
        <main className="flex-grow p-6 pt-20 md:p-12 overflow-y-auto">
          {/* Main content */}
          <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                CMS MANAGEMENT
              </span>
              <h1 className="text-3xl font-black text-white uppercase mt-1">
                DEVLOGS & ARTICLES MANAGER
              </h1>
            </div>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_#06b6d4] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>WRITE NEW DEVLOG</span>
            </button>
          </div>

          {notification && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>{notification}</span>
            </div>
          )}

          {isEditing ? (
            <div className="p-8 rounded-2xl glass-panel border border-white/10 max-w-3xl">
              <h2 className="text-xl font-bold text-white uppercase font-mono mb-6">
                {currentDevlog.id ? 'EDIT ARTICLE' : 'WRITE ARTICLE'}
              </h2>

              <form onSubmit={handleSave} className="flex flex-col gap-5 text-xs font-mono">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">ARTICLE TITLE *</label>
                    <input
                      type="text"
                      required
                      value={currentDevlog.title || ''}
                      onChange={(e) =>
                        setCurrentDevlog({
                          ...currentDevlog,
                          title: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-2 font-bold">CATEGORY</label>
                    <select
                      value={currentDevlog.category || 'Devlog'}
                      onChange={(e) => setCurrentDevlog({ ...currentDevlog, category: e.target.value as Devlog['category'] })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                    >
                      <option value="Devlog">Devlog</option>
                      <option value="Architecture">Architecture</option>
                      <option value="Shader">Shader</option>
                      <option value="Mechanics">Mechanics</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">EXCERPT / SUMMARY</label>
                  <input
                    type="text"
                    value={currentDevlog.excerpt || ''}
                    onChange={(e) => setCurrentDevlog({ ...currentDevlog, excerpt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2">FULL BODY CONTENT</label>
                  <textarea
                    rows={8}
                    value={currentDevlog.content || ''}
                    onChange={(e) => setCurrentDevlog({ ...currentDevlog, content: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-cyan-500 text-black font-bold uppercase hover:bg-cyan-400 flex items-center gap-2 disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>SAVE ARTICLE</span>
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
            <div className="p-6 rounded-2xl glass-panel border border-white/10 overflow-x-auto">
              {loading ? (
                <div className="p-12 text-center text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>FETCHING DEVLOGS FROM SUPABASE...</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400 uppercase">
                      <th className="py-3 px-4">TITLE</th>
                      <th className="py-3 px-4">CATEGORY</th>
                      <th className="py-3 px-4">PUBLISHED DATE</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-200">
                    {devlogs.map((d) => (
                      <tr key={d.id} className="hover:bg-slate-900/40">
                        <td className="py-4 px-4 font-bold text-white flex items-center gap-2">
                          <span>{d.title}</span>
                          <a href={`/devlog/${d.slug}`} target="_blank" className="text-cyan-400 hover:text-white">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </td>
                        <td className="py-4 px-4 text-cyan-400">{d.category}</td>
                        <td className="py-4 px-4 text-slate-400">{formatDate(d.published_at)}</td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(d)}
                              className="p-2 rounded-lg bg-slate-800 text-cyan-400 hover:bg-slate-700"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
                              className="p-2 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-950"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {devlogs.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                          No devlogs published. Click &quot;WRITE NEW DEVLOG&quot; to create your first article.
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
