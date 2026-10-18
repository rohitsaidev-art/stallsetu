import React, { useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

interface FloorPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  floorPlanUrl: string;
}

export function FloorPlanModal({
  isOpen,
  onClose,
  eventName,
  floorPlanUrl,
}: FloorPlanModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
      {/* Dark Scrim */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-4xl bg-white rounded-airbnb-sheet border border-hairline shadow-airbnb-modal flex flex-col max-h-[92vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-title-md font-bold text-ink">Venue Floor Plan & Allocation</h2>
            <p className="text-caption-sm text-muted">{eventName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer shadow-sm"
            aria-label="Close floor plan modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Blueprint container */}
        <div className="p-4 sm:p-6 overflow-auto flex-1 flex items-center justify-center bg-surface-soft">
          <img
            src={floorPlanUrl}
            alt={`${eventName} Floor Plan`}
            className="max-w-full max-h-[70vh] object-contain rounded-airbnb-card shadow-md border border-hairline"
          />
        </div>

        <div className="px-6 py-3.5 border-t border-hairline bg-white flex items-center justify-between text-caption-sm text-muted flex-shrink-0">
          <span className="font-semibold text-ink">Direction B: Official Organizer Schematic Layout</span>
          <span className="flex items-center gap-1.5 font-bold text-ink bg-surface-soft px-3 py-1 rounded-full border border-hairline">
            <ZoomIn size={14} /> Full Resolution
          </span>
        </div>
      </div>
    </div>
  );
}
