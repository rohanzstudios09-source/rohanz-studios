'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { getContactMessages, updateContactMessageStatus, deleteContactMessage } from '@/lib/supabase/client';
import { ContactMessage } from '@/types';
import { formatDate } from '@/lib/utils';
import { Trash2, Loader2 } from 'lucide-react';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  useEffect(() => {
    let active = true;
    async function init() {
      const data = await getContactMessages();
      if (active) {
        setMessages(data);
        if (data.length > 0) {
          setSelectedMessage(data[0]);
        }
        setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'read' ? 'unread' : 'read';
    const res = await updateContactMessageStatus(id, nextStatus);
    if (res.success) {
      setMessages(messages.map((m) => (m.id === id ? { ...m, status: nextStatus } : m)));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status: nextStatus });
      }
    } else {
      alert(res.error || 'Failed to update message status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete message from inbox?')) {
      const res = await deleteContactMessage(id);
      if (res.success) {
        setMessages(messages.filter((m) => m.id !== id));
        if (selectedMessage?.id === id) setSelectedMessage(null);
      } else {
        alert(res.error || 'Failed to delete message.');
      }
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
                TRANSMISSIONS INBOX
              </span>
              <h1 className="text-3xl font-black text-white uppercase mt-1">
                CONTACT MESSAGES ({messages.length})
              </h1>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>FETCHING MESSAGES FROM SUPABASE...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* List Column */}
              <div className="lg:col-span-1 flex flex-col gap-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setSelectedMessage(m)}
                    className={`p-4 rounded-2xl glass-card cursor-pointer border transition-all ${
                      selectedMessage?.id === m.id
                        ? 'border-cyan-400 bg-cyan-950/20'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-sm font-bold text-white truncate">{m.name}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono uppercase ${
                        m.status === 'unread' ? 'bg-amber-500/20 text-amber-400 font-bold' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 block truncate mb-1">{m.email}</span>
                    <p className="text-xs text-slate-400 line-clamp-2">{m.message}</p>
                    <span className="text-[10px] font-mono text-slate-500 block mt-2">{formatDate(m.created_at)}</span>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-8 text-center text-slate-500 font-mono text-xs glass-panel rounded-2xl">
                    No contact messages received yet.
                  </div>
                )}
              </div>

              {/* Detail Reading View */}
              <div className="lg:col-span-2">
                {selectedMessage ? (
                  <div className="p-8 rounded-2xl glass-panel border border-white/10 flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-white/10 pb-6">
                      <div>
                        <h2 className="text-xl font-bold text-white">{selectedMessage.name}</h2>
                        <a href={`mailto:${selectedMessage.email}`} className="text-xs font-mono text-cyan-400">
                          {selectedMessage.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleReadStatus(selectedMessage.id, selectedMessage.status)}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 hover:text-cyan-400"
                        >
                          MARK AS {selectedMessage.status === 'read' ? 'UNREAD' : 'READ'}
                        </button>
                        <button
                          onClick={() => handleDelete(selectedMessage.id)}
                          className="p-2 rounded-lg bg-slate-900 border border-white/10 text-rose-400 hover:bg-rose-950"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-mono text-slate-300 whitespace-pre-line leading-relaxed p-4 rounded-xl bg-slate-900/60 border border-white/5">
                      {selectedMessage.message}
                    </div>

                    <div className="text-xs font-mono text-slate-500">
                      RECEIVED AT: {formatDate(selectedMessage.created_at)}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center text-slate-500 font-mono text-xs">
                    SELECT A MESSAGE TO READ TRANSMISSION DETAILS
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
