import React, { useEffect } from 'react';
import { X, ShieldCheck, FileText, CheckCircle } from 'lucide-react';

export type PolicyType = 'privacy' | 'terms' | 'guidelines' | null;

interface PolicyModalProps {
  type: PolicyType;
  onClose: () => void;
}

export function PolicyModal({ type, onClose }: PolicyModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (type) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [type, onClose]);

  if (!type) return null;

  const content = (() => {
    switch (type) {
      case 'privacy':
        return {
          title: 'Vendor Privacy Policy',
          subtitle: 'How StallSetu protects your brand data and contact details',
          sections: [
            {
              heading: 'Direct Communication Only',
              body: 'Your WhatsApp number and email are exclusively delivered to the verified organizer of the specific exhibition you enquire for. We never sell or share vendor leads with third-party telemarketers.',
            },
            {
              heading: 'Brand Catalog Security',
              body: 'Product images and brand bios submitted through StallSetu remain 100% intellectual property of your brand. They are used only for curation and stall layout planning.',
            },
            {
              heading: 'Opt-Out & Reset',
              body: 'At any point, you can clear your cached brand profile using the "Clear & Start Fresh" button in the enquiry form.',
            },
          ],
        };
      case 'terms':
        return {
          title: 'Terms of Stall Enquiry',
          subtitle: 'Platform fee structure and booking commitment',
          sections: [
            {
              heading: 'Zero Advance Platform Fee',
              body: 'StallSetu does not charge vendors any booking commission or advance platform convenience fee. All stall fee payments occur directly between the vendor and the exhibition organizer outside the platform.',
            },
            {
              heading: '48-Hour Pipeline Stall Hold',
              body: 'When you submit a stall enquiry, the selected stall is placed on "Held" status in the organizer’s pipeline. The organizer has 48 hours to connect with you via WhatsApp.',
            },
            {
              heading: 'Allotment Finalization',
              body: 'Stall allotment is confirmed once you and the organizer agree on stall amenities and complete payment directly. The organizer marks the stall as "Booked / Confirmed" in their management dashboard.',
            },
          ],
        };
      case 'guidelines':
        return {
          title: 'Exhibitor Code & Guidelines',
          subtitle: 'Standard rules for exhibitions and flea markets in India',
          sections: [
            {
              heading: 'Setup & Tear-Down Timings',
              body: 'Stall setup begins 3 hours prior to venue gates opening. All display structures and inventory must be loaded out within 2 hours after event closure.',
            },
            {
              heading: 'Power & Electrical Safety',
              body: 'Standard 5A plugs are intended for phone/POS charging and LED clip lights. High-wattage equipment (steam irons, induction heaters, ovens) strictly requires prior booking of a 16A heavy power line.',
            },
            {
              heading: 'Zero Single-Use Plastic Policy',
              body: 'All packaging, carry bags, and food containers must be paper, fabric, or compostable. Single-use plastic bags are prohibited by civic municipal bylaws.',
            },
          ],
        };
      default:
        return null;
    }
  })();

  if (!content) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-hairline shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface-soft border border-hairline flex items-center justify-center text-ink">
              <FileText size={16} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-ink leading-tight">{content.title}</h2>
              <p className="text-[11px] text-muted">{content.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-hairline hover:border-ink hover:bg-surface-soft flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer"
            aria-label="Close modal"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 divide-y divide-hairline">
          {content.sections.map((sec, i) => (
            <div key={i} className={i > 0 ? 'pt-4 space-y-1.5' : 'space-y-1.5'}>
              <div className="flex items-center gap-2">
                <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                <h4 className="text-[14px] font-bold text-ink">{sec.heading}</h4>
              </div>
              <p className="text-[13px] text-body leading-relaxed pl-6">{sec.body}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-hairline bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>StallSetu Fair Play Guarantee</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-ink hover:bg-black text-white text-[13px] font-bold shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
