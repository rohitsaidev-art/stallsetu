import React from 'react';
import { CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import type { Event, Stall, VendorBrand } from '../../data/types';

interface SuccessScreenProps {
  enquiryId: string;
  event: Event;
  stall: Stall;
  brand: VendorBrand;
  onViewMyEnquiries: () => void;
  onBrowseEvents: () => void;
}

export function SuccessScreen({
  enquiryId,
  event,
  stall,
  brand,
  onViewMyEnquiries,
  onBrowseEvents,
}: SuccessScreenProps) {
  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${event.organizer.name}, I have just submitted Stall Enquiry #${enquiryId} for Stall ${stall.label} at ${event.name} on behalf of ${brand.name}. Looking forward to connecting!`
    );
    window.open(`https://wa.me/${event.organizer.phone}?text=${text}`, '_blank');
  };

  return (
    <div className="bg-canvas min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Animated Check Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
          <CheckCircle2 size={36} strokeWidth={2.5} />
        </div>

        <div className="space-y-1">
          <h2 className="text-display-lg font-bold text-ink">Enquiry Submitted!</h2>
          <p className="text-body-sm text-muted">
            Your proposal for <strong className="text-ink font-semibold">Stall {stall.label}</strong> at{' '}
            <strong className="text-ink font-semibold">{event.name}</strong> is now under review.
          </p>
        </div>

        {/* Reference Ticket Card */}
        <div className="p-5 rounded-airbnb-card border border-hairline bg-surface-soft text-left space-y-3 text-body-sm shadow-sm">
          <div className="flex justify-between items-center">
            <span className="text-caption-sm text-muted font-medium">Enquiry Reference ID</span>
            <span className="font-mono font-bold text-ink">{enquiryId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-caption-sm text-muted font-medium">Stall Status</span>
            <span className="inline-flex items-center gap-1.5 text-badge font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Held (Lock Applied)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-caption-sm text-muted font-medium">Stall Fee</span>
            <span className="text-title-md font-bold text-ink tabular-nums">
              ₹{stall.price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <p className="text-caption-sm text-muted leading-relaxed">
          Organizer <strong className="text-ink font-bold">{event.organizer.name}</strong> has received your brand profile and will message you on WhatsApp (<strong className="text-ink font-bold">{brand.phone}</strong>) within 48 hours.
        </p>

        {/* CTAs */}
        <div className="space-y-3 pt-2">
          <button
            type="button"
            onClick={openWhatsApp}
            className="w-full py-3.5 rounded-airbnb-card bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-button-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <MessageCircle size={17} />
            <span>Chat on WhatsApp Directly</span>
          </button>

          <button
            type="button"
            onClick={onViewMyEnquiries}
            className="w-full py-3.5 rounded-airbnb-card border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong text-ink font-bold text-button-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Track in My Enquiries</span>
            <ArrowRight size={15} />
          </button>

          <button
            type="button"
            onClick={onBrowseEvents}
            className="w-full py-2.5 text-caption font-bold text-ink hover:text-rausch active:text-rausch-active block mx-auto pt-1 cursor-pointer transition-colors"
          >
            ← Browse More Exhibitions
          </button>
        </div>
      </div>
    </div>
  );
}
