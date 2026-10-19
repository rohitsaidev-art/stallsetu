import React, { useEffect } from 'react';
import { X, Star, ShieldCheck, CheckCircle2 } from 'lucide-react';
import type { Event } from '../../data/types';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function ReviewsModal({ isOpen, onClose, event }: ReviewsModalProps) {
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

  const sampleReviews = [
    {
      author: 'Meera Pillai',
      brand: 'Indigo Threads Co. (Apparel)',
      rating: 5,
      date: 'September 2026',
      content:
        'Fantastic footfall across both days. The power outlets were ready on time, and security overnight was very prompt. We cleared over ₹1.8L in sales!',
    },
    {
      author: 'Priya Sharma',
      brand: 'Zevar Jewellery',
      rating: 5,
      date: 'August 2026',
      content:
        'One of the best managed fleas in Bengaluru. High-intent buyers who appreciate handmade artisan crafts. Looking forward to the next edition!',
    },
    {
      author: 'Arjun Nair',
      brand: 'Canvas & Chai (Art & Decor)',
      rating: 4.8,
      date: 'July 2026',
      content:
        'Corner position provided great natural lighting for our art prints. Organizer team was easily accessible on WhatsApp throughout the exhibition.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-hairline shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <Star size={18} className="fill-amber-400 text-amber-500" />
            <h2 className="text-[17px] font-bold text-ink">
              {event.organizer.rating} · {event.organizer.reviewCount} Verified Reviews
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-hairline hover:border-ink hover:bg-surface-soft flex items-center justify-center text-ink transition-colors cursor-pointer active:scale-90"
            aria-label="Close reviews"
          >
            <X size={17} />
          </button>
        </div>

        {/* Organizer Verification Summary */}
        <div className="p-6 bg-surface-soft/60 border-b border-hairline flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={event.organizer.avatar}
              alt={event.organizer.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-hairline"
            />
            <div>
              <p className="text-[14px] font-bold text-ink">{event.organizer.name}</p>
              <p className="text-[12px] text-muted">
                {event.organizer.organization} · {event.organizer.eventsHosted} events hosted
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck size={14} className="text-emerald-600" />
            Verified
          </span>
        </div>

        {/* Reviews List */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-hairline">
          {sampleReviews.map((rev, i) => (
            <div key={i} className={i > 0 ? 'pt-4 space-y-2' : 'space-y-2'}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[14px] font-bold text-ink">{rev.author}</h4>
                  <p className="text-[11px] text-muted font-medium">{rev.brand}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-[12px] font-bold text-ink">
                    <Star size={12} className="fill-amber-400 text-amber-500" />
                    <span>{rev.rating}</span>
                  </div>
                  <span className="text-[10px] text-muted-soft">{rev.date}</span>
                </div>
              </div>
              <p className="text-[13px] text-body leading-relaxed">{rev.content}</p>
              <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 size={12} />
                <span>Verified Exhibitor Booking</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-hairline bg-white flex justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-ink hover:bg-black text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
