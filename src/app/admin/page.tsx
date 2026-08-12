'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Logo } from '@/components/ui/Logo';
import { Gamepad2, BookOpen, MessageSquare, Image as ImageIcon, ShieldCheck, Lock, KeyRound, AlertCircle, Loader2 } from 'lucide-react';
import { signInAdmin, signOutAdmin, resetPassword, getAdminSession, getGames, getDevlogs, getContactMessages } from '@/lib/supabase/client';
import { Game, Devlog, ContactMessage } from '@/types';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('rohanzstudios09@gmail.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [resetError, setResetError] = useState('');

  const [games, setGames] = useState<Game[]>([]);
  const [devlogs, setDevlogs] = useState<Devlog[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const loadDashboardData = async () => {
    const [gList, dList, mList] = await Promise.all([
      getGames(),
      getDevlogs(),
      getContactMessages(),
    ]);
    setGames(gList);
    setDevlogs(dList);
    setMessages(mList);
  };

  useEffect(() => {
    async function checkSession() {
      const active = await getAdminSession();
      if (active) {
        setIsAuthenticated(true);
        loadDashboardData();
      }
      setLoading(false);
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please enter valid admin credentials.');
      return;
    }

    setLoginSubmitting(true);
    setError('');

    const res = await signInAdmin(email.trim(), password.trim());
    if (res.success) {
      setIsAuthenticated(true);
      loadDashboardData();
    } else {
      setError(res.error || 'Authentication failed. Please verify admin email and password.');
    }
    setLoginSubmitting(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    if (!email.trim()) {
      setResetError('Enter a valid admin email.');
      return;
    }

    const res = await resetPassword(email.trim());
    if (res.success) {
      setResetEmailSent(true);
      setTimeout(() => {
        setResetEmailSent(false);
        setResetModalOpen(false);
      }, 4000);
    } else {
      setResetError(res.error || 'Password reset request failed.');
    }
  };

  const handleLogout = async () => {
    await signOutAdmin();
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#060709] text-cyan-400 font-mono text-xs gap-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>INITIALIZING ADMIN PORTAL...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-4 bg-[#060709] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="w-full max-w-md p-8 sm:p-10 rounded-2xl glass-panel border border-white/10 relative z-10 shadow-2xl">
          <div className="flex flex-col items-center gap-4 text-center mb-8">
            <Logo size="lg" showText={false} href="" />
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase mt-2">
              ROHANZ STUDIOS CMS
            </h1>
            <p className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              Studio Management Dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 text-xs font-mono">
            <div>
              <label className="block text-slate-400 uppercase mb-2 font-bold">
                ADMIN EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rohanzstudios09@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500/60 font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-slate-400 uppercase font-bold">
                  SECURITY PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setResetModalOpen(true)}
                  className="text-[10px] text-cyan-400 hover:underline uppercase"
                >
                  FORGOT PASSWORD?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500/60 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="mt-2 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-mono font-bold text-xs tracking-widest uppercase hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loginSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>AUTHENTICATING...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>LOGIN TO CMS</span>
                </>
              )}
            </button>
          </form>

          {/* Reset Password Modal */}
          {resetModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="w-full max-w-sm p-6 rounded-2xl glass-panel border border-white/10 flex flex-col gap-4 font-mono text-xs">
                <div className="flex items-center gap-2 text-cyan-400">
                  <KeyRound className="w-5 h-5" />
                  <h3 className="text-sm font-bold uppercase text-white">RESET ADMIN PASSWORD</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Enter your admin email to receive a password reset link via Supabase Auth.
                </p>

                {resetError && (
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-[11px]">
                    {resetError}
                  </div>
                )}

                {resetEmailSent ? (
                  <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-center">
                    Reset link dispatched to {email}! Check your inbox.
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="flex flex-col gap-3">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="px-3 py-2 rounded-lg bg-slate-900 border border-white/10 text-white"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setResetModalOpen(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                      >
                        CANCEL
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-cyan-500 text-black font-bold"
                      >
                        SEND RESET LINK
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen">
      <AdminSidebar onLogout={handleLogout} />

      <main className="flex-grow p-6 pt-20 md:p-12 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-8 border-b border-white/10 mb-8">
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
              OVERVIEW DASHBOARD
            </span>
            <h1 className="text-3xl font-black text-white uppercase mt-1">
              ADMIN CONTROL CENTER
            </h1>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>SESSION AUTHORIZED ({email})</span>
          </div>
        </div>

        {/* Quick Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">TOTAL GAMES</span>
              <p className="text-3xl font-extrabold text-white font-mono mt-1">{games.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">PUBLISHED DEVLOGS</span>
              <p className="text-3xl font-extrabold text-white font-mono mt-1">{devlogs.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">INBOX MESSAGES</span>
              <p className="text-3xl font-extrabold text-white font-mono mt-1">{messages.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase">STORAGE BUCKETS</span>
              <p className="text-3xl font-extrabold text-white font-mono mt-1">5</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
              <ImageIcon className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Management Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h2 className="text-lg font-bold text-white uppercase font-mono mb-4 flex items-center justify-between">
              <span>RECENT GAMES</span>
              <a href="/admin/games" className="text-xs text-cyan-400 hover:underline">MANAGE ALL</a>
            </h2>
            <div className="flex flex-col gap-3">
              {games.slice(0, 5).map((g) => (
                <div key={g.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{g.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{g.engine} • {g.status}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400">
                    {g.featured ? 'FEATURED' : 'STANDARD'}
                  </span>
                </div>
              ))}
              {games.length === 0 && (
                <p className="text-xs font-mono text-slate-500 py-4 text-center">No games created yet.</p>
              )}
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel border border-white/10">
            <h2 className="text-lg font-bold text-white uppercase font-mono mb-4 flex items-center justify-between">
              <span>RECENT MESSAGES</span>
              <a href="/admin/messages" className="text-xs text-cyan-400 hover:underline">VIEW INBOX</a>
            </h2>
            <div className="flex flex-col gap-3">
              {messages.slice(0, 5).map((m) => (
                <div key={m.id} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{m.name}</h3>
                    <span className="text-[10px] font-mono text-slate-400">{m.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 uppercase">
                    {m.status}
                  </span>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-xs font-mono text-slate-500 py-4 text-center">Inbox empty.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
