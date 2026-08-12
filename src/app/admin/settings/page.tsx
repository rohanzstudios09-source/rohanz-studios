'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { getSiteSettings, saveSiteSettings } from '@/lib/supabase/client';
import { SiteSettings } from '@/types';
import { siteConfig } from '@/config/siteConfig';
import { CheckCircle, Save, Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(siteConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      const data = await getSiteSettings();
      setSettings(data);
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await saveSiteSettings(settings);
    setSaving(false);

    if (res.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      alert(res.error || 'Failed to save configuration.');
    }
  };

  return (
    <AdminAuthGuard>
      <div className="flex w-full min-h-screen">
        <AdminSidebar />

        <main className="flex-grow p-6 pt-20 md:p-12 overflow-y-auto">
          <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                GLOBAL CONFIGURATION
              </span>
              <h1 className="text-3xl font-black text-white uppercase mt-1">
                SITE SETTINGS MANAGER
              </h1>
            </div>
          </div>

          {saved && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Site configuration saved successfully to Supabase!</span>
            </div>
          )}

          {loading ? (
            <div className="p-12 text-center text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>LOADING CONFIGURATION FROM SUPABASE...</span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-8 rounded-2xl glass-panel border border-white/10 max-w-4xl flex flex-col gap-6 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-2 font-bold">STUDIO NAME</label>
                  <input
                    type="text"
                    value={settings.studio_name}
                    onChange={(e) => setSettings({ ...settings, studio_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-2 font-bold">DEVELOPER NAME</label>
                  <input
                    type="text"
                    value={settings.developer_name}
                    onChange={(e) => setSettings({ ...settings, developer_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-bold">CONTACT EMAIL</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-bold">STUDIO BIOGRAPHY</label>
                <textarea
                  rows={3}
                  value={settings.biography || ''}
                  onChange={(e) => setSettings({ ...settings, biography: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-bold">DEVELOPER BIO & SPECIALIZATIONS</label>
                <textarea
                  rows={3}
                  value={settings.developer_bio || ''}
                  onChange={(e) => setSettings({ ...settings, developer_bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-2 font-bold">HERO WELCOME STATEMENT</label>
                <textarea
                  rows={2}
                  value={settings.hero_text || ''}
                  onChange={(e) => setSettings({ ...settings, hero_text: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white resize-none"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex flex-col gap-4">
                <h3 className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  SOCIAL PROFILES CONFIGURATION
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1">GITHUB URL</label>
                    <input
                      type="text"
                      value={settings.social_links?.github || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, github: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">LINKEDIN URL</label>
                    <input
                      type="text"
                      value={settings.social_links?.linkedin || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, linkedin: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">INSTAGRAM URL</label>
                    <input
                      type="text"
                      value={settings.social_links?.instagram || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, instagram: e.target.value }
                      })}
                      placeholder="https://www.instagram.com/rohanz_studios/"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">DISCORD URL (Optional Invite Link)</label>
                    <input
                      type="text"
                      value={settings.social_links?.discord || ''}
                      onChange={(e) => setSettings({
                        ...settings,
                        social_links: { ...settings.social_links, discord: e.target.value }
                      })}
                      placeholder="https://discord.gg/your-invite-code"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold uppercase hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_15px_#06b6d4] flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>SAVING...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>SAVE CONFIGURATION</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
