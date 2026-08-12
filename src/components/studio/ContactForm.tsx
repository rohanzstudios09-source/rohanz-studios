'use client';

import React, { useState } from 'react';
import { submitContactMessage } from '@/lib/supabase/client';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [submissionInfo, setSubmissionInfo] = useState<{ dbSaved?: boolean; emailSent?: boolean }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please fill out all required fields.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await submitContactMessage(formData.name, formData.email, formData.message);
      if (res.success) {
        setStatus('success');
        setSubmissionInfo({ dbSaved: res.dbSaved, emailSent: res.emailSent });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
        setErrorMessage(res.error || 'Failed to send message. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-5 sm:p-8 rounded-2xl glass-panel border border-white/10 relative overflow-hidden">
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2 uppercase">
        SEND A DIRECT TRANSMISSION
      </h3>
      <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
        Have a project proposal, game design inquiry, or collaboration idea? We&apos;d love to hear from you.
      </p>

      {status === 'success' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <span className="font-bold">Transmission Received!</span>
            <p className="text-xs text-emerald-400/90 mt-0.5">
              {submissionInfo.emailSent === false
                ? 'Your message was saved to our database. Email dispatch notification pending.'
                : 'Thank you for reaching out to Rohanz Studios. We will get back to you shortly.'}
            </p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mb-6 p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 font-mono text-xs">
        <div>
          <label htmlFor="contact-name" className="block text-slate-300 uppercase mb-2 font-bold">
            YOUR NAME *
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Commander / Developer / Partner"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-cyan-500/60 transition-colors min-h-[48px]"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-slate-300 uppercase mb-2 font-bold">
            EMAIL ADDRESS *
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="name@organization.com"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-cyan-500/60 transition-colors min-h-[48px]"
          />
        </div>

        <div>
          <label htmlFor="contact-message" className="block text-slate-300 uppercase mb-2 font-bold">
            TRANSMISSION MESSAGE *
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Share details about your game project, inquiry, or proposal..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white focus:outline-none focus:border-cyan-500/60 transition-colors resize-none min-h-[120px]"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="mt-2 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold text-xs tracking-widest uppercase hover:from-cyan-400 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(6,182,212,0.35)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>DISPATCHING TRANSMISSION...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>SEND TRANSMISSION</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
