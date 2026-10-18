import { useState } from 'react';
import {
  Search, MapPin, Calendar, Users, ArrowLeft, CheckCircle,
  Zap, MessageCircle, ChevronRight, ShoppingBag, Sparkles, Star
} from 'lucide-react';
import type { Event, Stall, VendorBrand, Enquiry } from '../../data/types';
import { StallBadge } from '../ui/Badge';

interface Props {
  events: Event[];
  onSubmitEnquiry: (enquiry: Enquiry) => void;
  existingEnquiries: Enquiry[];
}

type VendorScreen = 'discovery' | 'event_detail' | 'stall_select' | 'enquiry_form' | 'success';

const MUST_HAVE_OPTIONS = [
  'Power outlet',
  'Water access',
  'Corner position',
  'Natural lighting',
  'End-of-row',
  'Front-facing',
  'High footfall area',
  'No adjacent food stalls',
];

export function VendorApp({ events, onSubmitEnquiry }: Props) {
  const [screen, setScreen] = useState<VendorScreen>('discovery');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState<Partial<VendorBrand>>({
    mustHaves: [],
    productPhotos: [
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=300&q=70',
    ],
  });
  const [message, setMessage] = useState('');
  const [submittedId, setSubmittedId] = useState('');

  const filteredEvents = events.filter(e =>
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedEvent || !selectedStall) return;
    const enquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      eventId: selectedEvent.id,
      stallId: selectedStall.id,
      status: 'new',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredSize: selectedStall.size,
      message,
      vendorBrand: {
        name: form.name ?? 'My Brand',
        category: form.category ?? 'Fashion',
        description: form.description ?? '',
        contactPerson: form.contactPerson ?? '',
        phone: form.phone ?? '',
        email: form.email ?? '',
        instagram: form.instagram,
        avgProductPrice: form.avgProductPrice ?? '₹500–₹2,000',
        stallBudget: `₹${selectedStall.price.toLocaleString('en-IN')}`,
        mustHaves: form.mustHaves ?? [],
        productPhotos: form.productPhotos ?? [],
      },
    };
    onSubmitEnquiry(enquiry);
    setSubmittedId(enquiry.id);
    setScreen('success');
  };

  const toggleMustHave = (item: string) => {
    setForm(prev => ({
      ...prev,
      mustHaves: prev.mustHaves?.includes(item)
        ? prev.mustHaves.filter(m => m !== item)
        : [...(prev.mustHaves ?? []), item],
    }));
  };

  // ── DISCOVERY SCREEN ─────────────────────────────────────────────
  if (screen === 'discovery') {
    return (
      <div className="flex flex-col h-full bg-zinc-50">
        {/* Header */}
        <div className="bg-white px-4 pt-10 pb-4 border-b border-zinc-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">StallSetu</p>
              <p className="text-[10px] text-zinc-400">Find your perfect stall</p>
            </div>
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search events, cities..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Upcoming Events ({filteredEvents.length})
          </p>
          {filteredEvents.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <ShoppingBag size={32} className="text-zinc-300" />
              <p className="text-sm text-zinc-400">No events match your search</p>
            </div>
          )}
          {filteredEvents.map(event => {
            const available = event.stalls.filter(s => s.status === 'available').length;
            const minPrice = Math.min(...event.stalls.map(s => s.price));
            return (
              <button
                key={event.id}
                onClick={() => { setSelectedEvent(event); setScreen('event_detail'); }}
                className="w-full bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm text-left active:scale-[0.98] transition-transform"
              >
                <div className="relative h-36">
                  <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      available > 5 ? 'bg-emerald-500 text-white' :
                      available > 0 ? 'bg-amber-500 text-white' :
                      'bg-zinc-600 text-white'
                    }`}>
                      {available > 0 ? `${available} stalls left` : 'Fully Booked'}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <p className="text-white font-semibold text-sm">{event.name}</p>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 mb-2">
                    <span className="flex items-center gap-1"><MapPin size={10} /> {event.city}</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                    <span className="flex items-center gap-1"><Users size={10} /> {event.footfall}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-zinc-500">Starting from</p>
                    <p className="text-sm font-bold text-zinc-900 tabular-nums">₹{minPrice.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ── EVENT DETAIL SCREEN ──────────────────────────────────────────
  if (screen === 'event_detail' && selectedEvent) {
    const available = selectedEvent.stalls.filter(s => s.status === 'available').length;
    return (
      <div className="flex flex-col h-full bg-zinc-50">
        {/* Hero image */}
        <div className="relative h-52 flex-shrink-0">
          <img src={selectedEvent.coverImage} alt={selectedEvent.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <button
            onClick={() => setScreen('discovery')}
            className="absolute top-10 left-4 h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft size={16} className="text-white" />
          </button>
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-lg font-bold leading-tight">{selectedEvent.name}</p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-white/70" />
              <p className="text-white/70 text-xs">{selectedEvent.venue}, {selectedEvent.city}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-2 p-4">
            {[
              { label: 'Footfall', value: selectedEvent.footfall, icon: Users },
              { label: 'Available', value: `${available} stalls`, icon: Star },
              { label: 'Dates', value: `${new Date(selectedEvent.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`, icon: Calendar },
            ].map(item => (
              <div key={item.label} className="bg-white rounded-xl border border-zinc-200 p-3 text-center">
                <item.icon size={14} className="text-brand-600 mx-auto mb-1" />
                <p className="text-[10px] text-zinc-400">{item.label}</p>
                <p className="text-xs font-semibold text-zinc-900 leading-tight mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="px-4 pb-4">
            <p className="text-sm text-zinc-600 leading-relaxed">{selectedEvent.description}</p>
          </div>

          {/* Stall categories preview */}
          <div className="px-4 pb-4">
            <h3 className="text-sm font-semibold text-zinc-900 mb-3">Available Stalls</h3>
            <div className="space-y-2">
              {selectedEvent.stalls.filter(s => s.status === 'available').slice(0, 4).map(stall => (
                <div key={stall.id} className="bg-white rounded-xl border border-zinc-200 p-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-zinc-700">{stall.label}</span>
                      <span className="text-xs text-zinc-500">{stall.category}</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">{stall.size}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-zinc-900 tabular-nums">₹{stall.price.toLocaleString('en-IN')}</p>
                    <StallBadge status={stall.status} />
                  </div>
                </div>
              ))}
              {selectedEvent.stalls.filter(s => s.status === 'available').length > 4 && (
                <p className="text-xs text-center text-zinc-400">
                  +{selectedEvent.stalls.filter(s => s.status === 'available').length - 4} more stalls
                </p>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4 bg-white border-t border-zinc-200">
          <button
            onClick={() => setScreen('stall_select')}
            disabled={available === 0}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <Zap size={16} />
            {available > 0 ? 'Choose a Stall & Apply' : 'No Stalls Available'}
          </button>
        </div>
      </div>
    );
  }

  // ── STALL SELECT SCREEN ──────────────────────────────────────────
  if (screen === 'stall_select' && selectedEvent) {
    return (
      <div className="flex flex-col h-full bg-zinc-50">
        {/* Header */}
        <div className="bg-white px-4 pt-10 pb-4 border-b border-zinc-100 flex-shrink-0">
          <button
            onClick={() => setScreen('event_detail')}
            className="flex items-center gap-1.5 text-sm text-brand-600 font-medium mb-3"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-base font-semibold text-zinc-900">Select a Stall</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{selectedEvent.name}</p>
        </div>

        {/* Legend */}
        <div className="flex gap-4 px-4 py-3 bg-white border-b border-zinc-100">
          {[
            { dot: 'bg-emerald-500', label: 'Available' },
            { dot: 'bg-amber-400', label: 'Held' },
            { dot: 'bg-zinc-400', label: 'Booked' },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${l.dot}`} />
              <span className="text-xs text-zinc-500">{l.label}</span>
            </div>
          ))}
        </div>

        {/* Stall list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {selectedEvent.stalls.map(stall => {
            const isAvailable = stall.status === 'available';
            const isSelected = selectedStall?.id === stall.id;
            return (
              <button
                key={stall.id}
                disabled={!isAvailable}
                onClick={() => setSelectedStall(stall)}
                className={`w-full text-left rounded-xl border p-4 transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20'
                    : isAvailable
                    ? 'border-zinc-200 bg-white hover:border-zinc-300'
                    : 'border-zinc-100 bg-zinc-50 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isSelected ? (
                      <CheckCircle size={18} className="text-brand-600 flex-shrink-0" />
                    ) : (
                      <div className={`h-4.5 w-4.5 rounded-full border-2 flex-shrink-0 ${
                        isAvailable ? 'border-zinc-300' : 'border-zinc-200'
                      }`} />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono font-semibold text-zinc-800">{stall.label}</span>
                        <span className="text-xs text-zinc-500">{stall.category}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5">{stall.size}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <p className="text-sm font-bold text-zinc-900 tabular-nums">₹{stall.price.toLocaleString('en-IN')}</p>
                    <StallBadge status={stall.status} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="p-4 bg-white border-t border-zinc-200">
          <button
            onClick={() => selectedStall && setScreen('enquiry_form')}
            disabled={!selectedStall}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
          >
            <ChevronRight size={16} />
            {selectedStall ? `Apply for ${selectedStall.label} — ₹${selectedStall.price.toLocaleString('en-IN')}` : 'Select a stall to continue'}
          </button>
        </div>
      </div>
    );
  }

  // ── ENQUIRY FORM SCREEN ──────────────────────────────────────────
  if (screen === 'enquiry_form' && selectedEvent && selectedStall) {
    return (
      <div className="flex flex-col h-full bg-zinc-50">
        {/* Header */}
        <div className="bg-white px-4 pt-10 pb-4 border-b border-zinc-100 flex-shrink-0">
          <button
            onClick={() => setScreen('stall_select')}
            className="flex items-center gap-1.5 text-sm text-brand-600 font-medium mb-3"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-base font-semibold text-zinc-900">Brand Profile & Enquiry</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {selectedEvent.name} · Stall {selectedStall.label} · ₹{selectedStall.price.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
            {/* Brand basics */}
            <section>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Brand Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    placeholder="e.g. Indigo Threads Co."
                    value={form.name ?? ''}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. Sustainable Fashion, Food & Beverage"
                    value={form.category ?? ''}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Brand Description</label>
                  <textarea
                    rows={2}
                    placeholder="Tell the organizer about your brand..."
                    value={form.description ?? ''}
                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Average Product Price</label>
                  <input
                    type="text"
                    placeholder="e.g. ₹500–₹2,500"
                    value={form.avgProductPrice ?? ''}
                    onChange={e => setForm(p => ({ ...p, avgProductPrice: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </section>

            {/* Contact */}
            <section>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Contact Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={form.contactPerson ?? ''}
                    onChange={e => setForm(p => ({ ...p, contactPerson: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={form.phone ?? ''}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Email *</label>
                  <input
                    type="email"
                    placeholder="you@yourbrand.com"
                    value={form.email ?? ''}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    placeholder="@yourbrand"
                    value={form.instagram ?? ''}
                    onChange={e => setForm(p => ({ ...p, instagram: e.target.value }))}
                    className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </section>

            {/* Must-haves */}
            <section>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Stall Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {MUST_HAVE_OPTIONS.map(opt => {
                  const selected = form.mustHaves?.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMustHave(opt)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all active:scale-[0.96] ${
                        selected
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-zinc-600 border-zinc-200 hover:border-brand-300'
                      }`}
                    >
                      {selected && <span className="mr-1">✓</span>}
                      {opt}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Message to organizer */}
            <section>
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Message to Organizer</h3>
              <textarea
                rows={4}
                placeholder="Tell the organizer why your brand is a great fit for this event. Include your past event performance, typical sales numbers, etc."
                value={message}
                onChange={e => setMessage(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-xl px-3.5 py-2.5 text-sm text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </section>

            {/* Selected stall summary */}
            <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-brand-600" />
                <p className="text-xs font-semibold text-brand-700">Your Enquiry Summary</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Event</span>
                  <span className="font-medium text-zinc-800">{selectedEvent.name}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Stall</span>
                  <span className="font-medium text-zinc-800">{selectedStall.label} · {selectedStall.size}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-zinc-500">Category</span>
                  <span className="font-medium text-zinc-800">{selectedStall.category}</span>
                </div>
                <div className="flex justify-between text-xs pt-1 border-t border-brand-200 mt-1">
                  <span className="font-semibold text-zinc-700">Stall Fee</span>
                  <span className="font-bold text-zinc-900 tabular-nums">₹{selectedStall.price.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="p-4 bg-white border-t border-zinc-200">
          <button
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-brand-600/25"
          >
            <MessageCircle size={16} />
            Submit Enquiry
          </button>
          <p className="text-[10px] text-zinc-400 text-center mt-2">
            Your stall will be held for 24 hours pending organizer response
          </p>
        </div>
      </div>
    );
  }

  // ── SUCCESS SCREEN ───────────────────────────────────────────────
  if (screen === 'success') {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8 text-center">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Enquiry Submitted!</h2>
        <p className="text-sm text-zinc-500 mb-1">
          Your enquiry for <span className="font-semibold text-zinc-700">{selectedStall?.label}</span> at
        </p>
        <p className="text-sm font-semibold text-zinc-700 mb-4">{selectedEvent?.name}</p>
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 w-full mb-6 text-left space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Stall</span>
            <span className="font-semibold text-zinc-800">{selectedStall?.label} · {selectedStall?.size}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Stall Fee</span>
            <span className="font-semibold text-zinc-800 tabular-nums">₹{selectedStall?.price.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Status</span>
            <span className="font-semibold text-amber-600">Held — awaiting organizer</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-zinc-500">Enquiry ID</span>
            <span className="font-mono text-zinc-600">{submittedId}</span>
          </div>
        </div>
        <p className="text-xs text-zinc-400 mb-8">
          The organizer will contact you within 24–48 hours on WhatsApp or email.
          Your stall is held during this period.
        </p>
        <button
          onClick={() => {
            setScreen('discovery');
            setSelectedEvent(null);
            setSelectedStall(null);
            setForm({ mustHaves: [], productPhotos: [] });
            setMessage('');
          }}
          className="w-full py-3 rounded-xl border border-zinc-200 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 active:scale-[0.98] transition-all"
        >
          Browse More Events
        </button>
      </div>
    );
  }

  return null;
}
