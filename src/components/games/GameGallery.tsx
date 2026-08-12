'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { GameImage } from '@/types';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameGalleryProps {
  images: GameImage[];
  title: string;
}

export const GameGallery: React.FC<GameGalleryProps> = ({ images, title }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const currentImage = images[selectedIndex] || images[0];

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, handleNext, handlePrev]);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Featured Large View */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden glass-panel border border-white/10 group cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <Image
          src={currentImage.image_url}
          alt={currentImage.caption || `${title} Screenshot`}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 80vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

        {/* Caption & Fullscreen Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between z-10">
          <p className="text-sm font-mono text-slate-200 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md max-w-lg">
            {currentImage.caption || `${title} Screenshot ${selectedIndex + 1}`}
          </p>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-white/20 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
            <Maximize2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setSelectedIndex(idx)}
              className={`relative aspect-video rounded-xl overflow-hidden border transition-all duration-200 ${
                selectedIndex === idx
                  ? 'border-cyan-400 shadow-[0_0_12px_#06b6d4] scale-105 z-10'
                  : 'border-white/10 opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={img.caption || `${title} Screenshot ${idx + 1}`}
                fill
                sizes="150px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors z-50"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Lightbox Image */}
            <div className="relative max-w-6xl w-full aspect-video rounded-2xl overflow-hidden">
              <Image
                src={currentImage.image_url}
                alt={currentImage.caption || `${title} Screenshot Full`}
                fill
                className="object-contain"
                priority
              />
              {currentImage.caption && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-4 py-2 rounded-xl text-xs font-mono text-slate-200">
                  {currentImage.caption} ({selectedIndex + 1} / {images.length})
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-2.5 sm:p-3 rounded-full bg-slate-900/80 border border-white/20 text-slate-300 hover:text-cyan-400 hover:border-cyan-400 transition-colors z-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
