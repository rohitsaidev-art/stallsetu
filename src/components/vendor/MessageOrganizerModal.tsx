import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle } from 'lucide-react';
import type { OrganizerProfile } from '../../data/types';

interface MessageOrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  organizer: OrganizerProfile;
  eventName: string;
}

export function MessageOrganizerModal({
  isOpen,
  onClose,
  organizer,
  eventName,
}: MessageOrganizerModalProps) {
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-hairline shadow-airbnb-modal z-10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={organizer.avatar}
              alt={organizer.name}
              className="w-10 h-10 rounded-full object-cover border border-hairline"
            />
            <div>
              <h3 className="text-title-md font-bold text-ink">Ask {organizer.name}</h3>
              <p className="text-[12px] text-muted">{organizer.organization}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-hairline hover:bg-surface-soft flex items-center justify-center text-ink transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        {isSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle size={28} />
            </div>
            <h4 className="text-title-md font-bold text-ink">Message Sent!</h4>
            <p className="text-body-sm text-muted">
              {organizer.name} has received your enquiry regarding {eventName} and will reach out via WhatsApp/email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSend} className="p-6 space-y-4">
            <div>
              <label htmlFor="organizer-message" className="block text-[13px] font-bold text-ink mb-1.5">
                Send a message to find out more about this exhibition
              </label>
              <textarea
                id="organizer-message"
                rows={4}
                required
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Hi Aishwarya, I have a sustainable apparel brand and wanted to ask about stall dimensions and footfall at the entrance..."
                className="w-full p-3.5 rounded-xl border border-hairline text-body-sm text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink resize-none"
              />
              <p className="text-[11px] text-muted text-right mt-1 tabular-nums">
                {message.length}/500 characters
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
              <p className="text-[12px] text-muted">
                Replies typically within 2 hours
              </p>
              <button
                type="submit"
                disabled={!message.trim()}
                className="px-6 py-2.5 rounded-xl font-bold text-caption text-white flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                style={{ backgroundColor: '#FF385C' }}
              >
                <Send size={14} />
                <span>Send Message</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
