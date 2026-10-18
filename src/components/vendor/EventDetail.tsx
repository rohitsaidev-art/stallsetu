import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Heart,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  MessageCircle,
  Maximize2,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import type { Event, Stall } from '../../data/types';
import { StallStatusBadge } from './StatusBadge';
import { GalleryModal } from './GalleryModal';
import { FloorPlanModal } from './FloorPlanModal';

interface EventDetailProps {
  event: Event;
  isWishlisted: boolean;
  onToggleWishlist: (eventId: string, e: React.MouseEvent) => void;
  onBack: () => void;
  onSelectStall: (stall: Stall) => void;
}

export function EventDetail({
  event,
  isWishlisted,
  onToggleWishlist,
  onBack,
  onSelectStall,
}: EventDetailProps) {
  const [showGallery, setShowGallery] = useState(false);
  const [showFloorPlan, setShowFloorPlan] = useState(false);
  const [selectedStallCategory, setSelectedStallCategory] = useState<string>('all');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const availableStalls = event.stalls.filter(s => s.status === 'available');
  const minPrice = Math.min(...event.stalls.map(s => s.price));

  const filteredStalls =
    selectedStallCategory === 'all'
      ? event.stalls
      : event.stalls.filter(s =>
          s.category.toLowerCase().includes(selectedStallCategory.toLowerCase())
        );

  const stallCategories = [
    'all',
    ...Array.from(new Set(event.stalls.map(s => s.category))),
  ];

  const formatDates = () => {
    const s = new Date(event.startDate);
    const e = new Date(event.endDate);
    return `${s.getDate()}–${e.getDate()} ${s.toLocaleString('en-IN', {
      month: 'short',
    })} 2026`;
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello ${event.organizer.name}, I am an exhibitor looking to participate in ${event.name} at ${event.venue}. Could you please share stall booking details?`
    );
    window.open(`https://wa.me/${event.organizer.phone}?text=${text}`, '_blank');
  };

  const scrollToStalls = () => {
    const el = document.getElementById('stall-inventory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white min-h-screen pb-28 text-zinc-900">
      {/* Top Breadcrumb Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-hairline px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong text-caption font-bold text-ink shadow-sm transition-all active:scale-95 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>← All Exhibitions</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={e => onToggleWishlist(event.id, e)}
            className="w-9 h-9 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer shadow-sm"
            aria-label="Save to wishlist"
          >
            <Heart
              size={17}
              className={isWishlisted ? 'fill-rausch text-rausch stroke-rausch' : 'text-ink stroke-[2.2]'}
            />
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: event.name, url: window.location.href });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Event link copied to clipboard!');
              }
            }}
            className="w-9 h-9 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer shadow-sm"
            aria-label="Share event"
          >
            <Share2 size={17} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* Title & Trust Header */}
        <div className="mb-6 space-y-1.5">
          <h1 className="text-display-lg sm:text-display-xl font-bold text-ink tracking-tight leading-tight">
            {event.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-caption-sm text-muted font-medium">
            <span className="font-bold text-ink">★ {event.organizer.rating}</span>
            <span>·</span>
            <span className="underline cursor-pointer hover:text-ink">{event.organizer.reviewCount} reviews</span>
            <span>·</span>
            <span className="text-ink font-semibold">{event.city}, India</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-badge font-bold border border-emerald-200">
              <ShieldCheck size={14} /> Verified Organizer
            </span>
          </div>
        </div>

        {/* =========================================================================
            AIRBNB 2×2 PHOTO GRID (Matching User's Uploaded Screenshot Reference)
           ========================================================================= */}
        <div className="relative mb-10">
          {/* Desktop 2×2 Grid */}
          <div className="hidden sm:grid grid-cols-2 gap-3 h-[440px] rounded-airbnb-card overflow-hidden border border-hairline shadow-sm">
            {/* Left large photo */}
            <div className="relative h-full overflow-hidden bg-surface-soft">
              <img
                src={event.photos[0] || event.coverImage}
                alt={`${event.name} photo 1`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Right 2x2 sub-grid */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
              <div className="relative overflow-hidden bg-surface-soft">
                <img
                  src={event.photos[1] || event.coverImage}
                  alt={`${event.name} photo 2`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="relative overflow-hidden bg-surface-soft">
                <img
                  src={event.photos[2] || event.coverImage}
                  alt={`${event.name} photo 3`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="relative overflow-hidden bg-surface-soft">
                <img
                  src={event.photos[3] || event.coverImage}
                  alt={`${event.name} photo 4`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              {/* 4th photo with Floating Pill "Show all photos" */}
              <div className="relative overflow-hidden bg-surface-soft">
                <img
                  src={event.photos[4] || event.coverImage}
                  alt={`${event.name} photo 5`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-3 right-3 bg-white hover:bg-surface-soft active:bg-surface-strong text-ink text-[12px] font-bold px-3.5 py-2 rounded-full shadow-airbnb-pill border border-hairline flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Maximize2 size={13} />
                  <span>Show all photos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Single Photo */}
          <div className="sm:hidden relative aspect-[4/3] rounded-airbnb-card overflow-hidden bg-surface-soft border border-hairline">
            <img
              src={event.coverImage}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="absolute bottom-3 right-3 bg-white/95 active:bg-surface-strong text-ink text-[12px] font-bold px-3 py-1.5 rounded-full shadow-md border border-hairline flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Maximize2 size={13} />
              <span>{event.photos.length} photos</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TWO-COLUMN WORKSPACE: Details (Left ~65%) + Sticky Booking Rail (Right ~35%)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-8 divide-y divide-hairline">
            {/* Quick Highlights (Icon + Text Rows) */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-4">
                <MapPin className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-title-sm font-bold text-ink">Venue & City</h4>
                  <p className="text-body-sm text-muted">{event.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-title-sm font-bold text-ink">Expected Buyer Footfall</h4>
                  <p className="text-body-sm text-muted">
                    {event.footfall} expected across 2 exhibition days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-title-sm font-bold text-ink">Event Timings</h4>
                  <p className="text-body-sm text-muted">{event.timings} daily</p>
                </div>
              </div>
            </div>

            {/* Organizer Profile Card */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-airbnb-card bg-surface-soft border border-hairline">
                <div className="flex items-center gap-3">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-13 h-13 rounded-full object-cover ring-2 ring-hairline-dark"
                    style={{ width: '52px', height: '52px' }}
                  />
                  <div>
                    <h3 className="text-title-md font-bold text-ink">
                      Hosted by {event.organizer.name}
                    </h3>
                    <p className="text-caption-sm text-muted">
                      {event.organizer.organization} · {event.organizer.eventsHosted} events organized
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-caption flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer flex-shrink-0"
                >
                  <MessageCircle size={16} />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>

            {/* About Event Description */}
            <div className="pt-8 space-y-3">
              <h3 className="text-display-sm font-bold text-ink">About this exhibition</h3>
              <p className="text-body-md text-body leading-relaxed font-normal">{event.description}</p>
            </div>

            {/* =========================================================================
                DIRECTION B: BLUEPRINT FLOOR PLAN (Tap to Zoom Lightbox)
               ========================================================================= */}
            <div className="pt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-display-sm font-bold text-ink">Venue Floor Plan</h3>
                  <p className="text-caption-sm text-muted">
                    Official layout showing zones, entrances, and stall distribution
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFloorPlan(true)}
                  className="text-caption font-bold text-rausch hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Maximize2 size={14} /> Full View
                </button>
              </div>

              <div
                onClick={() => setShowFloorPlan(true)}
                className="relative cursor-pointer group rounded-airbnb-card overflow-hidden bg-surface-soft border border-hairline shadow-sm hover:shadow-airbnb-card-hover transition-all"
              >
                <img
                  src={event.floorPlanImage}
                  alt={`${event.name} Floor Plan`}
                  className="w-full h-56 object-cover group-hover:scale-[1.01] transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                  <span className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-caption font-bold text-ink shadow-md border border-hairline flex items-center gap-2">
                    <Maximize2 size={14} /> Tap to expand floor blueprint
                  </span>
                </div>
              </div>
            </div>

            {/* =========================================================================
                STALL INVENTORY (Filterable List with Instant Select)
               ========================================================================= */}
            <div id="stall-inventory" className="pt-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-display-sm font-bold text-ink">Stall Inventory</h3>
                  <p className="text-caption-sm text-muted">
                    {availableStalls.length} of {event.stalls.length} stalls currently available
                  </p>
                </div>

                {/* Stall Category Filter Pills */}
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
                  {stallCategories.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedStallCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[12px] font-semibold capitalize whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                        selectedStallCategory === cat
                          ? 'bg-ink text-white font-bold shadow-sm'
                          : 'bg-white text-muted hover:text-ink hover:bg-surface-soft border border-hairline'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stall Cards List */}
              <div className="space-y-3">
                {filteredStalls.map(stall => {
                  const isAvail = stall.status === 'available';
                  return (
                    <div
                      key={stall.id}
                      className={`p-4 sm:p-5 rounded-airbnb-card border transition-all ${
                        isAvail
                          ? 'bg-white border-hairline hover:border-ink hover:shadow-sm'
                          : 'bg-surface-soft border-hairline opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[17px] font-mono font-bold text-ink">
                              Stall {stall.label}
                            </span>
                            <StallStatusBadge status={stall.status} />
                            <span className="text-[11px] font-bold text-ink bg-surface-soft px-2.5 py-0.5 rounded-full border border-hairline">
                              {stall.category}
                            </span>
                          </div>

                          <p className="text-body-sm text-muted">
                            Dimensions: <strong className="text-ink font-bold">{stall.size}</strong>
                          </p>

                          <div className="flex flex-wrap gap-2 pt-1 text-caption-sm text-muted">
                            {stall.amenities.map(am => (
                              <span key={am} className="inline-flex items-center gap-1 font-medium">
                                <CheckCircle size={12} className="text-emerald-600" />
                                {am}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center sm:flex-col sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-0 border-hairline-soft">
                          <p className="text-[18px] sm:text-[20px] font-bold text-ink tabular-nums">
                            ₹{stall.price.toLocaleString('en-IN')}
                          </p>
                          <button
                            type="button"
                            disabled={!isAvail}
                            onClick={() => onSelectStall(stall)}
                            className={`mt-1.5 px-6 py-2.5 rounded-airbnb-card font-bold text-button-sm transition-all ${
                              isAvail
                                ? 'bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white shadow-md active:scale-95 cursor-pointer'
                                : 'bg-surface-soft border border-hairline text-muted-soft cursor-not-allowed opacity-60'
                            }`}
                          >
                            {isAvail ? 'Select Stall' : 'Occupied'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inclusions */}
            <div className="pt-8 space-y-4">
              <h3 className="text-display-sm font-bold text-ink">What's included with every stall</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {event.includedAmenities.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-airbnb-card bg-surface-soft border border-hairline">
                    <CheckCircle size={18} className="text-emerald-600 flex-shrink-0" />
                    <span className="text-body-sm font-semibold text-ink">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="pt-8 space-y-3">
              <h3 className="text-display-sm font-bold text-ink">Frequently asked questions</h3>
              <div className="space-y-2">
                {event.faqs.map((faq, i) => {
                  const isOpen = expandedFaqIndex === i;
                  return (
                    <div
                      key={i}
                      className="border border-hairline rounded-airbnb-card overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : i)}
                        className="w-full px-5 py-4 text-left font-bold text-title-sm text-ink flex items-center justify-between hover:bg-surface-soft active:bg-surface-strong transition-colors cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          size={18}
                          className={`text-muted transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-body-sm text-muted leading-relaxed border-t border-hairline-soft bg-surface-soft/40 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Right-Rail Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-24 rounded-airbnb-sheet border border-hairline bg-white p-6 shadow-airbnb-modal space-y-5">
              <div className="flex items-baseline justify-between border-b border-hairline pb-4">
                <div>
                  <span className="text-[12px] text-muted block font-medium">Stall prices from</span>
                  <span className="text-display-lg font-bold text-ink tabular-nums">
                    ₹{minPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-caption-sm text-muted font-medium">2 days event</span>
              </div>

              <div className="space-y-3 text-body-sm text-muted font-medium">
                <div className="flex justify-between">
                  <span>Available Stalls</span>
                  <strong className="text-ink font-bold">{availableStalls.length} free</strong>
                </div>
                <div className="flex justify-between">
                  <span>Dates</span>
                  <strong className="text-ink font-bold">{formatDates()}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Expected Footfall</span>
                  <strong className="text-ink font-bold">{event.footfall.split(' ')[0]} visitors</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToStalls}
                className="w-full py-3.5 rounded-airbnb-card bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white font-bold text-button-md flex items-center justify-center transition-all shadow-md active:scale-95 cursor-pointer"
              >
                Browse & Pick a Stall
              </button>

              <p className="text-[11px] text-muted-soft text-center leading-normal">
                Stalls are held immediately upon enquiry submission. Zero upfront platform booking fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Reservation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-hairline px-6 py-3.5 flex items-center justify-between shadow-xl">
        <div>
          <span className="text-[11px] text-muted block font-medium">From</span>
          <p className="text-[17px] font-bold text-ink tabular-nums">
            ₹{minPrice.toLocaleString('en-IN')}
          </p>
        </div>
        <button
          type="button"
          onClick={scrollToStalls}
          className="px-6 py-2.5 rounded-airbnb-card bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white text-button-sm font-bold shadow-md active:scale-95 transition-all cursor-pointer"
        >
          Select Stall
        </button>
      </div>

      {/* Full Screen Lightbox Modals */}
      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        eventName={event.name}
        photos={event.photos}
      />

      <FloorPlanModal
        isOpen={showFloorPlan}
        onClose={() => setShowFloorPlan(false)}
        eventName={event.name}
        floorPlanUrl={event.floorPlanImage}
      />
    </div>
  );
}
