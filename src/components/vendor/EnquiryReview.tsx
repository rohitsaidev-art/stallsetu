import React from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import type { Event, Stall, VendorBrand } from '../../data/types';

interface EnquiryReviewProps {
  event: Event;
  stall: Stall;
  brand: VendorBrand;
  message: string;
  onBack: () => void;
  onSubmit: () => void;
}

export function EnquiryReview({
  event,
  stall,
  brand,
  message,
  onBack,
  onSubmit,
}: EnquiryReviewProps) {
  return (
    <div className="bg-canvas min-h-screen py-10 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-body-sm font-bold text-ink hover:text-muted transition-colors cursor-pointer active:scale-95"
        >
          <ArrowLeft size={16} />
          <span>Edit Details</span>
        </button>

        <div>
          <h2 className="text-display-lg font-bold text-ink">Review Your Stall Enquiry</h2>
          <p className="text-body-sm text-muted">
            Double-check your brand proposal before it is delivered to {event.organizer.name}.
          </p>
        </div>

        {/* Review Card */}
        <div className="border border-hairline rounded-2xl p-6 sm:p-8 bg-white shadow-airbnb-card space-y-6 divide-y divide-hairline">
          {/* Section 1: Event & Stall */}
          <div className="space-y-3 pb-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Event & Stall Selection
            </span>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-title-md font-bold text-ink">{event.name}</h3>
                <p className="text-body-sm text-muted">{event.venue}, {event.city}</p>
              </div>
              <div className="text-right">
                <span className="text-title-md font-mono font-bold text-ink block">
                  Stall {stall.label}
                </span>
                <span className="text-caption-sm text-muted">{stall.size}</span>
              </div>
            </div>
            <div className="p-4 bg-surface-soft rounded-xl border border-hairline/80 flex justify-between items-center text-body-sm">
              <span className="text-muted font-medium">Total Stall Fee</span>
              <strong className="text-display-sm font-bold text-ink tabular-nums">
                ₹{stall.price.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          {/* Section 2: Brand Information */}
          <div className="pt-6 space-y-3 pb-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Your Brand Proposal
            </span>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-title-sm font-bold text-ink">{brand.name}</h4>
                <p className="text-caption-sm text-muted">{brand.category} · {brand.instagram || 'No Instagram'}</p>
              </div>
              <span className="text-caption-sm text-muted">{brand.avgProductPrice}</span>
            </div>
            <p className="text-body-sm text-body italic">"{brand.description}"</p>

            {brand.mustHaves.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-medium text-muted block mb-1.5">
                  Requested Amenities / Must-Haves:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {brand.mustHaves.map(m => (
                    <span
                      key={m}
                      className="text-[11px] font-medium bg-surface-soft px-2.5 py-0.5 rounded-full text-ink border border-hairline/80"
                    >
                      ✓ {m}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Message to Organizer */}
          <div className="pt-6 space-y-2 pb-6">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Personal Note to Organizer
            </span>
            <p className="text-body-sm text-ink leading-relaxed bg-surface-soft p-4 rounded-xl border border-hairline/80">
              {message}
            </p>
          </div>

          {/* Section 4: Contact Recipient */}
          <div className="pt-6 space-y-1">
            <span className="text-[11px] font-semibold text-muted uppercase tracking-wider block">
              Follow-Up Channel
            </span>
            <p className="text-body-sm text-ink font-medium">
              {brand.contactPerson} ({brand.phone}) · {brand.email}
            </p>
            <p className="text-caption-sm text-muted">
              The organizer will reach out on WhatsApp within 48 hours to confirm stall availability.
            </p>
          </div>
        </div>

        {/* Submit Action */}
        <div className="space-y-3 pt-2">
          <button
            onClick={onSubmit}
            className="w-full py-4 rounded-xl bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white text-body-md font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            Submit Stall Enquiry
          </button>
          <div className="flex items-center justify-center gap-1.5 text-caption-sm text-muted">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Zero advance platform charges. Stall held upon submission.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
