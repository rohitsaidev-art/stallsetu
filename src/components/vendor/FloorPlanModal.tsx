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
        className="relative w-full max-w-4xl bg-white rounded-2xl border border-zinc-200 shadow-2xl flex flex-col max-h-[92vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0">
          <div>
            <h2 className="text-[16px] font-bold text-zinc-900">Venue Floor Plan & Allocation</h2>
            <p className="text-[12px] text-zinc-500">{eventName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-zinc-200 hover:bg-zinc-100 flex items-center justify-center text-zinc-900 transition-colors cursor-pointer"
            aria-label="Close floor plan modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Blueprint container */}
        <div className="p-4 sm:p-6 overflow-auto flex-1 flex items-center justify-center bg-zinc-50">
          <img
            src={floorPlanUrl}
            alt={`${eventName} Floor Plan`}
            className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-md border border-zinc-200"
          />
        </div>

        <div className="px-6 py-3 border-t border-zinc-200 bg-white flex items-center justify-between text-[12px] text-zinc-600 flex-shrink-0">
          <span className="font-medium">Direction B: Official Organizer Schematic Layout</span>
          <span className="flex items-center gap-1 font-bold text-zinc-900">
            <ZoomIn size={14} /> Full Resolution
          </span>
        </div>
      </div>
    </div>
  );
}
