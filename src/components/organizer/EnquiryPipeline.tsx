import React, { useState } from 'react';
import { Phone, Mail, MessageCircle, CheckCircle, Eye, ChevronDown } from 'lucide-react';
import type { Enquiry, EnquiryStatus, Event } from '../../data/types';
import { EnquiryBadge } from '../ui/Badge';

interface Props {
  enquiries: Enquiry[];
  events: Event[];
  onUpdateStatus: (enquiryId: string, status: EnquiryStatus) => void;
}

const PIPELINE_COLUMNS: { status: EnquiryStatus; label: string }[] = [
  { status: 'new', label: 'New Enquiries' },
  { status: 'contacted', label: 'Contacted' },
  { status: 'under_review', label: 'Under Review' },
  { status: 'approved', label: 'Approved' },
  { status: 'paid_outside', label: 'Paid Outside Platform' },
];

interface CardAction {
  label: string;
  status: EnquiryStatus;
  icon: React.ElementType;
  variant: 'primary' | 'success' | 'neutral';
}

function EnquiryCard({
  enquiry,
  events,
  onUpdateStatus,
}: {
  enquiry: Enquiry;
  events: Event[];
  onUpdateStatus: (id: string, s: EnquiryStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const event = events.find(e => e.id === enquiry.eventId);
  const stall = event?.stalls.find(s => s.id === enquiry.stallId);

  const nextActions: CardAction[] = (() => {
    switch (enquiry.status) {
      case 'new':
        return [{ label: 'Mark Contacted', status: 'contacted', icon: Phone, variant: 'primary' }];
      case 'contacted':
        return [{ label: 'Move to Review', status: 'under_review', icon: Eye, variant: 'primary' }];
      case 'under_review':
        return [{ label: 'Approve', status: 'approved', icon: CheckCircle, variant: 'success' }];
      case 'approved':
        return [{ label: 'Mark Paid Outside Platform', status: 'paid_outside', icon: CheckCircle, variant: 'success' }];
      default:
        return [];
    }
  })();

  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div
        className="p-4 cursor-pointer hover:bg-zinc-50/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-zinc-900 truncate">{enquiry.vendorBrand.name}</p>
            </div>
            <p className="text-xs text-zinc-500 mb-2">{enquiry.vendorBrand.category}</p>
            <EnquiryBadge status={enquiry.status} />
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {stall && (
              <div className="text-right">
                <p className="text-xs font-mono font-semibold text-zinc-700">{stall.label}</p>
                <p className="text-xs text-zinc-400">{stall.size}</p>
                <p className="text-xs font-semibold text-zinc-900 tabular-nums">₹{stall.price.toLocaleString('en-IN')}</p>
              </div>
            )}
            <ChevronDown size={14} className={`text-zinc-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
        <p className="text-[11px] text-zinc-400 mt-2">
          {event?.name} · Submitted {new Date(enquiry.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
        </p>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-zinc-100 p-4 space-y-4">
          {/* Brand message */}
          <div>
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Vendor Message</p>
            <p className="text-xs text-zinc-600 leading-relaxed">{enquiry.message}</p>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Contact</p>
              <p className="text-xs font-medium text-zinc-800">{enquiry.vendorBrand.contactPerson}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <Phone size={10} className="text-zinc-400" />
                <p className="text-xs text-zinc-500">{enquiry.vendorBrand.phone}</p>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Mail size={10} className="text-zinc-400" />
                <p className="text-xs text-zinc-500 truncate">{enquiry.vendorBrand.email}</p>
              </div>
              {enquiry.vendorBrand.instagram && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] text-zinc-400 font-medium">IG</span>
                  <p className="text-xs text-zinc-500">{enquiry.vendorBrand.instagram}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Budget</p>
              <p className="text-xs font-medium text-zinc-800">{enquiry.vendorBrand.stallBudget}</p>
              <p className="text-[11px] text-zinc-400">Avg product: {enquiry.vendorBrand.avgProductPrice}</p>
            </div>
          </div>

          {/* Must haves */}
          {enquiry.vendorBrand.mustHaves.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Must-Haves</p>
              <div className="flex flex-wrap gap-1.5">
                {enquiry.vendorBrand.mustHaves.map(mh => (
                  <span key={mh} className="text-xs bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 rounded-full px-2 py-0.5">{mh}</span>
                ))}
              </div>
            </div>
          )}

          {/* Product photos */}
          {enquiry.vendorBrand.productPhotos.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">Product Photos</p>
              <div className="flex gap-2">
                {enquiry.vendorBrand.productPhotos.map((url, i) => (
                  <img key={i} src={url} alt={`Product ${i + 1}`} className="h-16 w-16 rounded-lg object-cover ring-1 ring-zinc-200" />
                ))}
              </div>
            </div>
          )}

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/${enquiry.vendorBrand.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
              `Hi ${enquiry.vendorBrand.contactPerson}, I'm reaching out regarding your stall enquiry for ${event?.name}. We'd love to discuss further!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors active:scale-[0.98]"
          >
            <MessageCircle size={13} />
            Chat on WhatsApp
          </a>

          {/* Pipeline Actions */}
          {nextActions.length > 0 && (
            <div className="flex gap-2">
              {nextActions.map(action => (
                <button
                  key={action.status}
                  onClick={() => onUpdateStatus(enquiry.id, action.status)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all active:scale-[0.98] ${
                    action.variant === 'success'
                      ? 'bg-brand-600 hover:bg-brand-700 text-white'
                      : action.variant === 'primary'
                      ? 'bg-zinc-900 hover:bg-zinc-800 text-white'
                      : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                  }`}
                >
                  <action.icon size={12} />
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function EnquiryPipeline({ enquiries, events, onUpdateStatus }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const eventOptions = [{ id: 'all', name: 'All Events' }, ...events];

  const filtered = selectedEvent === 'all' ? enquiries : enquiries.filter(e => e.eventId === selectedEvent);

  return (
    <div className="space-y-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Enquiry Pipeline</h2>
          <p className="text-sm text-zinc-500">{enquiries.length} total enquiries across all events</p>
        </div>
        <select
          value={selectedEvent}
          onChange={e => setSelectedEvent(e.target.value)}
          className="text-sm border border-zinc-200 rounded-lg px-3 py-2 bg-white text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          {eventOptions.map(e => (
            <option key={e.id} value={e.id}>{e.name}</option>
          ))}
        </select>
      </div>

      {/* Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ minHeight: 'calc(100vh - 230px)' }}>
        {PIPELINE_COLUMNS.map(col => {
          const colEnquiries = filtered.filter(e => e.status === col.status);
          return (
            <div key={col.status} className="flex-shrink-0 w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{col.label}</h3>
                <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 rounded-full px-2 py-0.5 tabular-nums">{colEnquiries.length}</span>
              </div>
              <div className="space-y-3">
                {colEnquiries.length === 0 ? (
                  <div className="bg-white border border-dashed border-zinc-200 rounded-xl p-6 text-center">
                    <p className="text-xs text-zinc-400">No enquiries here</p>
                  </div>
                ) : (
                  colEnquiries.map(enq => (
                    <EnquiryCard key={enq.id} enquiry={enq} events={events} onUpdateStatus={onUpdateStatus} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
