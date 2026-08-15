'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/ui/Logo';
import {
  LayoutDashboard,
  Gamepad2,
  BookOpen,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';
import { signOutAdmin } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const ADMIN_LINKS = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Games', href: '/admin/games', icon: Gamepad2 },
  { name: 'Devlogs', href: '/admin/devlogs', icon: BookOpen },
  { name: 'Media', href: '/admin/media', icon: ImageIcon },
  { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<{ onLogout?: () => void }> = ({ onLogout }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogoutClick = async () => {
    if (onLogout) {
      onLogout();
    } else {
      await signOutAdmin();
      router.push('/admin');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        {/* Studio Admin Header */}
        <div className="flex flex-col gap-1.5 pb-4 border-b border-white/10">
          <Logo size="md" href="/admin" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase pl-1">
            STUDIO CONTROL PANEL
          </span>
        </div>

        {/* Links Navigation */}
        <nav className="flex flex-col gap-1.5">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-mono tracking-wider transition-all',
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-white/10 mt-6">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors"
        >
          <span>VIEW MAIN SITE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={handleLogoutClick}
          className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-xs font-mono text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>LOGOUT</span>
          </div>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#080b11]/95 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="sm" href="/admin" />
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 font-bold uppercase">
            CMS
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-300 hover:text-white"
          aria-label="Toggle Admin Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          'md:hidden fixed top-[57px] left-0 bottom-0 z-40 w-64 bg-[#080b11] border-r border-white/10 p-5 transition-transform duration-300 overflow-y-auto',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sidebar (Persistent) */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#080b11] border-r border-white/10 flex-col h-screen sticky top-0 p-6 overflow-y-auto">
        {sidebarContent}
      </aside>
    </>
  );
};
