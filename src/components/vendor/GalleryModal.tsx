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
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-zinc-200 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-900 transition-colors cursor-pointer"
          aria-label="Close photo gallery"
        >
          <X size={18} />
        </button>
        <p className="text-[14px] font-bold text-zinc-900 line-clamp-1 max-w-md">{eventName}</p>
        <span className="text-[12px] font-semibold text-zinc-500 tabular-nums bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
          {photos.length} photos
        </span>
      </div>

      {/* Photo Stream */}
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        {photos.map((url, i) => (
          <div
            key={i}
            className="w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-md"
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
