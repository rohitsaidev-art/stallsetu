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
            onClick={onBack}
            className="flex items-center gap-1.5 text-body-sm font-bold text-ink hover:text-muted transition-colors cursor-pointer active:scale-95"
          >
            <ArrowLeft size={16} />
            <span>Back to Discovery</span>
          </button>
          <span className="text-caption-sm text-muted">
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
        <div className="flex gap-2 border-b border-hairline pb-2">
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
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-caption font-semibold transition-all active:scale-95 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-ink text-white shadow-sm'
                  : 'text-muted hover:text-ink bg-surface-soft hover:bg-zinc-200/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Enquiries List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 space-y-3 bg-surface-soft/60 rounded-2xl border-2 border-dashed border-hairline p-8">
            <Store size={36} className="mx-auto text-muted-soft" />
            <h3 className="text-title-md font-bold text-ink">No enquiries in this view</h3>
            <p className="text-body-sm text-muted">
              Browse upcoming flea markets and expos to find your next exhibition opportunity.
            </p>
            <button
              onClick={onBrowseEvents}
              className="mt-2 px-6 py-3 rounded-xl bg-ink text-white text-body-sm font-bold shadow-sm hover:bg-black transition-all active:scale-95 cursor-pointer"
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
                  className="p-6 rounded-2xl border border-hairline bg-white shadow-airbnb-card hover:shadow-airbnb-card-hover transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-hairline-soft">
                    <div className="flex items-center gap-2">
                      <EnquiryStatusBadge status={enq.status} />
                      <span className="text-caption-sm text-muted-soft font-mono">
                        #{enq.id.slice(0, 10)}
                      </span>
                    </div>
                    <span className="text-caption-sm text-muted">
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
                      <p className="text-body-sm text-muted flex items-center gap-1.5">
                        <MapPin size={13} className="text-muted-soft" />
                        {event?.venue}, {event?.city}
                      </p>
                      <p className="text-caption-sm text-muted flex items-center gap-1.5">
                        <Calendar size={13} className="text-muted-soft" />
                        {event?.startDate} to {event?.endDate}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <span className="text-title-md font-mono font-bold text-ink block">
                        Stall {stall?.label || enq.stallId}
                      </span>
                      <span className="text-caption-sm text-muted block">
                        {stall?.size || enq.preferredSize}
                      </span>
                      <strong className="text-display-sm font-bold text-ink tabular-nums mt-1 block">
                        ₹{stall?.price.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Brand snapshot */}
                  <div className="p-3.5 bg-surface-soft rounded-xl border border-hairline/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-caption-sm">
                    <div>
                      <span className="text-muted">Brand: </span>
                      <strong className="text-ink font-bold">{enq.vendorBrand.name}</strong> ({enq.vendorBrand.category})
                    </div>
                    <button
                      onClick={openWhatsApp}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-caption border border-emerald-200 shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      <MessageCircle size={15} className="text-emerald-600" />
                      <span>Message Organizer</span>
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
