import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Calendar, MapPin, Store } from 'lucide-react';
import type { Enquiry, Event } from '../../data/types';
import { EnquiryStatusBadge } from './StatusBadge';

interface MyEnquiriesProps {
  enquiries: Enquiry[];
  events: Event[];
  onBack: () => void;
  onBrowseEvents: () => void;
}

export function MyEnquiries({
  enquiries,
  events,
  onBack,
  onBrowseEvents,
}: MyEnquiriesProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'confirmed'>('all');

  const filtered = enquiries.filter(enq => {
    if (activeTab === 'confirmed') return enq.status === 'paid_outside';
    if (activeTab === 'active') return enq.status !== 'paid_outside';
    return true;
  });

  const getEvent = (eventId: string) => events.find(e => e.id === eventId);
  const getStall = (event: Event | undefined, stallId: string) =>
    event?.stalls.find(s => s.id === stallId);

  return (
    <div className="bg-canvas min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong text-caption font-bold text-ink shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Discovery</span>
          </button>
          <span className="text-caption-sm font-bold text-muted tabular-nums bg-surface-soft px-3 py-1 rounded-full border border-hairline">
            {enquiries.length} {enquiries.length === 1 ? 'Submission' : 'Submissions'}
          </span>
        </div>

        <div>
          <h1 className="text-display-lg font-bold text-ink">My Stall Enquiries</h1>
          <p className="text-body-sm text-muted">
            Track status updates and communication with exhibition organizers.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 border-b border-hairline pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${enquiries.length})` },
            {
              id: 'active',
              label: `Active Pipeline (${enquiries.filter(e => e.status !== 'paid_outside').length})`,
            },
            {
              id: 'confirmed',
              label: `Confirmed (${enquiries.filter(e => e.status === 'paid_outside').length})`,
            },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-caption font-bold transition-all active:scale-95 cursor-pointer border ${
                activeTab === tab.id
                  ? 'bg-ink text-white border-ink shadow-sm'
                  : 'text-muted hover:text-ink bg-surface-soft hover:bg-surface-strong border-hairline'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Enquiries List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-surface-soft/40 rounded-airbnb-card border border-dashed border-hairline p-8">
            <Store size={36} className="mx-auto text-muted-soft" />
            <h3 className="text-title-md font-bold text-ink">No enquiries in this view</h3>
            <p className="text-body-sm text-muted">
              Browse upcoming flea markets and expos to find your next exhibition opportunity.
            </p>
            <button
              type="button"
              onClick={onBrowseEvents}
              className="mt-2 px-6 py-3 rounded-airbnb-card bg-ink text-white text-button-sm font-bold shadow-sm hover:bg-black active:bg-ink transition-all active:scale-95 cursor-pointer"
            >
              Explore Exhibitions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(enq => {
              const event = getEvent(enq.eventId);
              const stall = getStall(event, enq.stallId);

              const openWhatsApp = () => {
                if (!event) return;
                const text = encodeURIComponent(
                  `Hi ${event.organizer.name}, checking in on my enquiry for Stall ${stall?.label || ''} at ${event.name} (Ref: ${enq.id}).`
                );
                window.open(`https://wa.me/${event.organizer.phone}?text=${text}`, '_blank');
              };

              return (
                <div
                  key={enq.id}
                  className="p-5 rounded-airbnb-card border border-hairline bg-canvas shadow-airbnb space-y-4 hover:shadow-airbnb-card-hover transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline-soft">
                    <div className="flex items-center gap-2">
                      <EnquiryStatusBadge status={enq.status} />
                      <span className="text-caption-sm text-muted-soft font-mono font-bold">
                        #{enq.id.slice(0, 10)}
                      </span>
                    </div>
                    <span className="text-caption-sm font-semibold text-muted">
                      Updated {new Date(enq.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-title-md font-bold text-ink">
                        {event?.name || 'Exhibition Event'}
                      </h3>
                      <p className="text-body-sm text-muted flex items-center gap-1.5 font-medium">
                        <MapPin size={13} className="text-muted-soft" />
                        {event?.venue}, {event?.city}
                      </p>
                      <p className="text-caption-sm text-muted flex items-center gap-1.5 font-medium">
                        <Calendar size={13} className="text-muted-soft" />
                        {event?.startDate} to {event?.endDate}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-title-md font-mono font-bold text-ink block">
                        Stall {stall?.label || enq.stallId}
                      </span>
                      <span className="text-caption-sm text-muted font-medium block">
                        {stall?.size || enq.preferredSize}
                      </span>
                      <strong className="text-display-sm font-bold text-ink tabular-nums mt-1 block">
                        ₹{stall?.price.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Brand snapshot */}
                  <div className="p-3.5 bg-surface-soft rounded-airbnb-card border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-caption-sm">
                    <div>
                      <span className="text-muted font-medium">Brand: </span>
                      <strong className="text-ink font-bold">{enq.vendorBrand.name}</strong>{' '}
                      <span className="text-muted">({enq.vendorBrand.category})</span>
                    </div>
                    <button
                      type="button"
                      onClick={openWhatsApp}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-caption-sm shadow-sm transition-all active:scale-95 cursor-pointer flex-shrink-0"
                    >
                      <MessageCircle size={15} />
                      <span>Chat on WhatsApp</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
