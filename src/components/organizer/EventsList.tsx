import { useState } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import type { Event, Enquiry } from '../../data/types';
import { StallBadge } from '../ui/Badge';

interface Props {
  events: Event[];
  enquiries: Enquiry[];
  onViewEnquiries: () => void;
}

export function EventsList({ events, enquiries }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  if (selectedEvent) {
    const eventEnquiries = enquiries.filter(e => e.eventId === selectedEvent.id);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedEvent(null)}
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            ← My Events
          </button>
          <span className="text-zinc-300">/</span>
          <span className="text-sm text-zinc-700 font-medium">{selectedEvent.name}</span>
        </div>

        {/* Event hero */}
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
          <div className="h-40 relative overflow-hidden">
            <img src={selectedEvent.coverImage} alt={selectedEvent.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-5">
              <p className="text-white text-lg font-semibold">{selectedEvent.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-white/70 text-xs">
                  <MapPin size={10} /> {selectedEvent.venue}, {selectedEvent.city}
                </span>
                <span className="flex items-center gap-1 text-white/70 text-xs">
                  <Calendar size={10} />
                  {new Date(selectedEvent.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –
                  {new Date(selectedEvent.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-zinc-600 leading-relaxed">{selectedEvent.description}</p>
            <div className="flex items-center gap-1 mt-2 text-xs text-zinc-500">
              <Users size={11} /> Expected footfall: <span className="font-medium text-zinc-700">{selectedEvent.footfall}</span>
            </div>
          </div>
        </div>

        {/* Stall status summary */}
        <div className="grid grid-cols-3 gap-4">
          {(['available', 'held', 'booked'] as const).map(status => {
            const count = selectedEvent.stalls.filter(s => s.status === status).length;
            return (
              <div key={status} className="bg-white rounded-xl border border-zinc-200 p-4 shadow-sm">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider capitalize">{status}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1 tabular-nums">{count}</p>
                <p className="text-xs text-zinc-400">of {selectedEvent.stalls.length} stalls</p>
              </div>
            );
          })}
        </div>

        {/* Stall list */}
        <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">Stall Availability</h3>
            <p className="text-xs text-zinc-400">{selectedEvent.stalls.length} stalls total</p>
          </div>
          <div className="divide-y divide-zinc-100">
            {selectedEvent.stalls.map(stall => {
              const stEnq = eventEnquiries.find(e => e.stallId === stall.id);
              return (
                <div key={stall.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-mono font-semibold text-zinc-700 w-10">{stall.label}</span>
                    <div>
                      <p className="text-xs font-medium text-zinc-800">{stall.category}</p>
                      <p className="text-xs text-zinc-400">{stall.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {stEnq && <p className="text-xs text-zinc-500">{stEnq.vendorBrand.name}</p>}
                    <p className="text-sm font-semibold text-zinc-900 tabular-nums w-24 text-right">
                      ₹{stall.price.toLocaleString('en-IN')}
                    </p>
                    <StallBadge status={stall.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">My Events</h2>
          <p className="text-sm text-zinc-500">{events.length} events managed</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        {events.map(event => {
          const booked = event.stalls.filter(s => s.status === 'booked').length;
          const held = event.stalls.filter(s => s.status === 'held').length;
          const revenue = event.stalls.filter(s => s.status === 'booked').reduce((a, s) => a + s.price, 0);
          const pct = Math.round(((booked + held) / event.stalls.length) * 100);
          return (
            <div
              key={event.id}
              onClick={() => setSelectedEvent(event)}
              className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md hover:border-zinc-300 transition-all group"
            >
              <div className="h-36 relative overflow-hidden">
                <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-semibold">{event.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={10} className="text-white/60" />
                    <p className="text-white/70 text-xs">{event.venue}, {event.city}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="bg-white/90 backdrop-blur-sm text-xs font-semibold text-zinc-700 px-2 py-1 rounded-full">{pct}% filled</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} />
                    {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} –{' '}
                    {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={11} /> {event.footfall}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-3">
                  <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />{booked} booked
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />{held} held
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 tabular-nums">₹{(revenue / 100000).toFixed(1)}L</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
