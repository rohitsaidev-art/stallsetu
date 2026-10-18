import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-hairline flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer shadow-sm"
          aria-label="Close photo gallery"
        >
          <X size={18} />
        </button>
        <p className="text-title-sm font-bold text-ink line-clamp-1 max-w-md">{eventName}</p>
        <span className="text-caption-sm font-bold text-muted tabular-nums bg-surface-soft px-3.5 py-1 rounded-full border border-hairline">
          {photos.length} photos
        </span>
      </div>

      {/* Photo Stream */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        {photos.map((url, i) => (
          <div
            key={i}
            className="w-full rounded-airbnb-card overflow-hidden bg-surface-soft border border-hairline shadow-sm"
          >
            <img
              src={url}
              alt={`${eventName} photo ${i + 1}`}
              className="w-full h-auto object-cover max-h-[85vh]"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
