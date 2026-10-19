import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Grid } from 'lucide-react';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  photos: string[];
}

export function GalleryModal({
  isOpen,
  onClose,
  eventName,
  photos,
}: GalleryModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight' && activePhotoIndex !== null) {
        setActivePhotoIndex((activePhotoIndex + 1) % photos.length);
      } else if (e.key === 'ArrowLeft' && activePhotoIndex !== null) {
        setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, activePhotoIndex, photos.length]);

  if (!isOpen) return null;

  // Single Photo Lightbox Viewer
  if (activePhotoIndex !== null) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between select-none">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 text-white z-10 bg-black/60 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setActivePhotoIndex(null)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-caption font-semibold transition-colors cursor-pointer"
          >
            <Grid size={15} />
            <span>Show all photos</span>
          </button>
          <span className="text-body-sm font-semibold tabular-nums text-white/80">
            {activePhotoIndex + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setActivePhotoIndex(null);
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Center image with Prev/Next buttons */}
        <div className="relative flex-1 flex items-center justify-center p-4">
          <button
            type="button"
            onClick={() => setActivePhotoIndex((activePhotoIndex - 1 + photos.length) % photos.length)}
            className="absolute left-6 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft size={22} />
          </button>

          <img
            src={photos[activePhotoIndex]}
            alt={`${eventName} photo ${activePhotoIndex + 1}`}
            className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl transition-all duration-200"
          />

          <button
            type="button"
            onClick={() => setActivePhotoIndex((activePhotoIndex + 1) % photos.length)}
            className="absolute right-6 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 flex items-center justify-center shadow-lg transition-all active:scale-90 cursor-pointer z-10"
            aria-label="Next photo"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Bottom Caption */}
        <div className="text-center pb-6 text-white/70 text-caption font-medium">
          {eventName} · Photo {activePhotoIndex + 1}
        </div>
      </div>
    );
  }

  // Airbnb 2-Column Responsive Masonry Grid View
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-hairline flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-hairline hover:border-ink hover:bg-surface-soft flex items-center justify-center text-ink transition-colors cursor-pointer"
          aria-label="Close photo gallery"
        >
          <X size={18} />
        </button>
        <p className="text-[14px] font-bold text-ink line-clamp-1 max-w-md">{eventName}</p>
        <span className="text-[12px] font-bold text-muted tabular-nums bg-surface-soft px-3 py-1 rounded-full border border-hairline">
          {photos.length} photos
        </span>
      </div>

      {/* Masonry Photo Grid */}
      <div className="max-w-5xl mx-auto p-4 sm:p-8">
        <div className="columns-1 sm:columns-2 gap-4 space-y-4">
          {photos.map((url, i) => (
            <div
              key={i}
              onClick={() => setActivePhotoIndex(i)}
              className="break-inside-avoid relative rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <img
                src={url}
                alt={`${eventName} photo ${i + 1}`}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-200"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
