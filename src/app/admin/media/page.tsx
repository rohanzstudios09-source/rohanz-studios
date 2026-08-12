'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';
import { uploadStorageFile, listStorageFiles, deleteStorageFile } from '@/lib/supabase/client';
import { Upload, Copy, Trash2, CheckCircle, Loader2 } from 'lucide-react';

interface StorageAsset {
  id: string;
  name: string;
  bucket: string;
  url: string;
  size: string;
}

const INITIAL_ASSETS: StorageAsset[] = [
  { id: 'm-1', name: 'rohanz-logo.png', bucket: 'logos', url: '/images/rohanz-logo.png', size: '3.5 KB' },
  { id: 'm-2', name: 'loop-forest-cover.jpg', bucket: 'game-covers', url: 'https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1200&q=80', size: '245 KB' },
  { id: 'm-3', name: 'boulder-escape-cover.jpg', bucket: 'game-covers', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80', size: '310 KB' },
  { id: 'm-4', name: 'cyber-nexus-cover.jpg', bucket: 'game-covers', url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', size: '190 KB' },
];

export default function AdminMediaPage() {
  const [assets, setAssets] = useState<StorageAsset[]>(INITIAL_ASSETS);
  const [selectedBucket, setSelectedBucket] = useState('ALL');
  const [copiedUrl, setCopiedUrl] = useState('');
  const [notification, setNotification] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const buckets = ['ALL', 'logos', 'profile', 'game-covers', 'game-images', 'devlog-images'];

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      const realFiles = await listStorageFiles(selectedBucket);
      if (active) {
        if (realFiles.length > 0) {
          setAssets(realFiles);
        } else {
          setAssets((prev) => (prev.length > 0 ? prev : INITIAL_ASSETS));
        }
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [selectedBucket]);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(''), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetBucket = selectedBucket === 'ALL' ? 'game-covers' : selectedBucket;
    setUploading(true);
    const res = await uploadStorageFile(file, targetBucket);
    setUploading(false);

    if (res.success && res.url) {
      showToast(`File "${file.name}" uploaded successfully to Supabase Storage (${targetBucket})!`);
      const newAsset: StorageAsset = {
        id: res.path || String(Date.now()),
        name: res.name || file.name,
        bucket: targetBucket,
        url: res.url,
        size: res.size || `${(file.size / 1024).toFixed(1)} KB`,
      };
      setAssets((prev) => [newAsset, ...prev]);
    } else {
      alert(res.error || 'Failed to upload file to Supabase Storage.');
    }
  };

  const handleDelete = async (asset: StorageAsset) => {
    if (confirm(`Delete "${asset.name}" from Supabase Storage bucket "${asset.bucket}"?`)) {
      const res = await deleteStorageFile(asset.bucket, asset.name);
      if (res.success) {
        showToast(`File "${asset.name}" deleted from Supabase Storage.`);
        setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      } else {
        alert(res.error || 'Failed to delete file from Supabase Storage.');
      }
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
                SUPABASE STORAGE BUCKETS
              </span>
              <h1 className="text-3xl font-black text-white uppercase mt-1">
                MEDIA MANAGER
              </h1>
            </div>

            <label className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 text-black font-mono font-bold text-xs tracking-wider uppercase hover:bg-cyan-400 transition-all shadow-[0_0_15px_#06b6d4] cursor-pointer disabled:opacity-50">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>UPLOADING TO SUPABASE...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>UPLOAD FILE</span>
                </>
              )}
              <input type="file" className="hidden" accept="image/*" disabled={uploading} onChange={handleFileUpload} />
            </label>
          </div>

          {notification && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>{notification}</span>
            </div>
          )}

          {copiedUrl && (
            <div className="mb-6 p-4 rounded-xl bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>Copied URL to clipboard!</span>
            </div>
          )}

          {/* Buckets Filter Tabs */}
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {buckets.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBucket(b)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all ${
                  selectedBucket === b
                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_#06b6d4]'
                    : 'bg-slate-900 border border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* Media Grid */}
          {loading ? (
            <div className="p-12 text-center text-cyan-400 font-mono text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>FETCHING MEDIA ASSETS FROM SUPABASE STORAGE...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {assets.map((asset) => (
                <div key={asset.id} className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col gap-3 group">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900">
                    <Image src={asset.url} alt={asset.name} fill className="object-cover" />
                  </div>
                  <div className="flex flex-col gap-1 text-xs font-mono">
                    <span className="font-bold text-white truncate">{asset.name}</span>
                    <span className="text-[10px] text-cyan-400 uppercase">Bucket: {asset.bucket} ({asset.size})</span>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                    <button
                      onClick={() => handleCopy(asset.url)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-900 text-slate-300 hover:text-cyan-400 font-mono text-[10px] flex items-center justify-center gap-1 border border-white/10"
                    >
                      <Copy className="w-3 h-3" />
                      <span>COPY URL</span>
                    </button>
                    <button
                      onClick={() => handleDelete(asset)}
                      className="p-1.5 rounded-lg bg-slate-900 text-rose-400 hover:bg-rose-950 border border-white/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminAuthGuard>
  );
}
