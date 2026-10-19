import React, { useState, useMemo } from 'react';
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
  Armchair,
  Zap,
  Wifi,
  Sparkles,
  Layers,
  FileCheck,
  Search,
  Grid,
} from 'lucide-react';
import type { Event, Stall } from '../../data/types';
import { seedEvents } from '../../data/seed';
import { StallStatusBadge } from './StatusBadge';
import { GalleryModal } from './GalleryModal';
import { FloorPlanModal } from './FloorPlanModal';
import { ReviewsModal } from './ReviewsModal';
import { MessageOrganizerModal } from './MessageOrganizerModal';

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
  const [showReviews, setShowReviews] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  // Stall inventory controls
  const [selectedStallCategory, setSelectedStallCategory] = useState<string>('all');
  const [onlyAvailableStalls, setOnlyAvailableStalls] = useState(false);
  const [stallSearchQuery, setStallSearchQuery] = useState('');
  const [stallSort, setStallSort] = useState<'default' | 'price_asc' | 'price_desc'>('default');
  const [showAllStalls, setShowAllStalls] = useState(false);

  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const availableStalls = event.stalls.filter(s => s.status === 'available');
  const minPrice = Math.min(...event.stalls.map(s => s.price));

  const stallCategories = [
    'all',
    ...Array.from(new Set(event.stalls.map(s => s.category))),
  ];

  // Filtered & Sorted Stalls
  const processedStalls = useMemo(() => {
    let list = event.stalls.filter(s => {
      if (selectedStallCategory !== 'all' && s.category.toLowerCase() !== selectedStallCategory.toLowerCase()) {
        return false;
      }
      if (onlyAvailableStalls && s.status !== 'available') {
        return false;
      }
      if (stallSearchQuery.trim()) {
        const q = stallSearchQuery.toLowerCase();
        return s.label.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      }
      return true;
    });

    if (stallSort === 'price_asc') {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (stallSort === 'price_desc') {
      list = [...list].sort((a, b) => b.price - a.price);
    }

    return list;
  }, [event.stalls, selectedStallCategory, onlyAvailableStalls, stallSearchQuery, stallSort]);

  // Display limited stalls unless expanded
  const visibleStalls = showAllStalls ? processedStalls : processedStalls.slice(0, 6);

  // Other events in the same city or curated
  const relatedEvents = useMemo(() => {
    return seedEvents.filter(e => e.id !== event.id).slice(0, 2);
  }, [event.id]);

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
    <div className="bg-white min-h-screen pb-28 text-ink">
      {/* =========================================================================
          PERSISTENT TOP HEADER WITH STALLSETU BRANDING & BREADCRUMB
         ========================================================================= */}
      <div className="sticky top-0 z-30 bg-white border-b border-hairline shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Brand Logo & Back Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-caption font-bold text-ink hover:text-rausch transition-colors active:scale-95 cursor-pointer py-1 pr-2"
              aria-label="Back to all exhibitions"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">All Exhibitions</span>
            </button>
            <div className="h-4 w-px bg-hairline hidden sm:block" />
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0"
                style={{ backgroundColor: '#FF385C' }}
              >
                <span className="font-extrabold text-xs text-white">S</span>
              </div>
              <span className="text-title-md font-bold text-ink hidden md:inline">
                StallSetu
              </span>
            </button>
          </div>

          {/* Action buttons on right */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={e => onToggleWishlist(event.id, e)}
              className={`h-9 px-3.5 rounded-full border text-caption flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                isWishlisted
                  ? 'border-rausch bg-rausch/10 text-rausch font-bold'
                  : 'border-hairline bg-white hover:border-ink hover:bg-surface-soft text-ink font-semibold'
              }`}
              aria-label="Save exhibition"
            >
              <Heart
                size={14}
                className={isWishlisted ? 'fill-rausch text-rausch scale-110' : 'text-zinc-700'}
              />
              <span className="hidden sm:inline">{isWishlisted ? 'Saved' : 'Save'}</span>
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
              className="w-9 h-9 rounded-full border border-hairline hover:border-ink hover:bg-surface-soft flex items-center justify-center text-ink transition-all active:scale-95 cursor-pointer shadow-sm"
              aria-label="Share event"
            >
              <Share2 size={15} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        {/* Title & Trust Header */}
        <div className="mb-6 space-y-2">
          <h1 className="text-[26px] sm:text-[32px] font-bold text-ink tracking-tight leading-tight">
            {event.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2.5 text-caption-sm text-muted font-medium">
            <button
              type="button"
              onClick={() => setShowReviews(true)}
              className="flex items-center gap-1 hover:text-ink transition-colors cursor-pointer active:scale-95 text-left"
              aria-label="View verified exhibitor reviews"
            >
              <span className="font-bold text-ink">★ {event.organizer.rating}</span>
              <span>·</span>
              <span className="underline font-semibold text-ink">{event.organizer.reviewCount} reviews</span>
            </button>
            <span>·</span>
            <span className="text-ink font-semibold">{event.city}, India</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full text-[12px] font-bold border border-emerald-200">
              <ShieldCheck size={14} /> Verified Organizer
            </span>
          </div>
        </div>

        {/* =========================================================================
            AIRBNB 2×2 PHOTO GRID WITH ROUNDED CORNERS ON EVERY IMAGE (NO UGLY LINES)
           ========================================================================= */}
        <div className="relative mb-10">
          {/* Desktop 2×2 Photo Grid */}
          <div className="hidden sm:grid grid-cols-2 gap-3 h-[440px]">
            {/* Left large photo */}
            <div className="relative h-full rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm">
              <img
                src={event.photos[0] || event.coverImage}
                alt={`${event.name} photo 1`}
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>

            {/* Right 2x2 sub-grid with individually rounded images */}
            <div className="grid grid-cols-2 grid-rows-2 gap-3 h-full">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm">
                <img
                  src={event.photos[1] || event.coverImage}
                  alt={`${event.name} photo 2`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm">
                <img
                  src={event.photos[2] || event.coverImage}
                  alt={`${event.name} photo 3`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              <div className="relative rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm">
                <img
                  src={event.photos[3] || event.coverImage}
                  alt={`${event.name} photo 4`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
              </div>
              {/* 4th photo with Floating Pill "Show all photos" */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm">
                <img
                  src={event.photos[4] || event.coverImage}
                  alt={`${event.name} photo 5`}
                  className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowGallery(true)}
                  className="absolute bottom-3 right-3 bg-white hover:bg-surface-soft text-ink text-[12px] font-bold px-3.5 py-2 rounded-full shadow-md border border-hairline flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
                >
                  <Grid size={13} />
                  <span>Show all photos</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Single Photo */}
          <div className="sm:hidden relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 border border-hairline">
            <img
              src={event.coverImage}
              alt={event.name}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setShowGallery(true)}
              className="absolute bottom-3 right-3 bg-white/95 hover:bg-white text-ink text-[12px] font-bold px-3 py-1.5 rounded-full shadow-md border border-hairline flex items-center gap-1 active:scale-95 cursor-pointer transition-all"
            >
              <Grid size={13} />
              <span>{event.photos.length} photos</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TWO-COLUMN WORKSPACE: Details (Left ~65%) + Sticky Booking Rail (Right ~35%)
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8 divide-y divide-zinc-200">
            {/* Quick Highlights */}
            <div className="space-y-4 pt-1">
              <div className="flex items-start gap-4">
                <MapPin className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[15px] font-bold text-ink">Venue & City</h4>
                  <p className="text-body-sm text-muted">{event.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Users className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[15px] font-bold text-ink">Expected Buyer Footfall</h4>
                  <p className="text-body-sm text-muted">
                    {event.footfall} expected across 2 exhibition days.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-ink mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[15px] font-bold text-ink">Event Timings</h4>
                  <p className="text-body-sm text-muted">{event.timings} daily</p>
                </div>
              </div>
            </div>

            {/* Organizer Profile Card with WhatsApp & Message Actions */}
            <div className="pt-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface-soft border border-hairline">
                <div className="flex items-center gap-3.5">
                  <img
                    src={event.organizer.avatar}
                    alt={event.organizer.name}
                    className="w-13 h-13 rounded-full object-cover ring-2 ring-hairline"
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="px-4 py-2.5 rounded-xl border border-hairline bg-white hover:bg-surface-soft text-caption font-bold text-ink flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <MessageCircle size={15} className="text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMessageModal(true)}
                    className="px-4 py-2.5 rounded-xl border border-ink bg-ink text-white hover:bg-black text-caption font-bold flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Message Organizer</span>
                  </button>
                </div>
              </div>
            </div>

            {/* About Exhibition Description */}
            <div className="pt-8 space-y-3">
              <h3 className="text-display-sm font-bold text-ink">About this exhibition</h3>
              <p className="text-body-md text-body leading-relaxed">{event.description}</p>
            </div>

            {/* =========================================================================
                VENUE FLOOR PLAN (Taller Blueprint with Lightbox Zoom)
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
                className="relative cursor-pointer group rounded-2xl overflow-hidden bg-zinc-100 border border-hairline shadow-sm hover:shadow-md transition-all h-72 sm:h-96"
              >
                <img
                  src={event.floorPlanImage}
                  alt={`${event.name} Floor Plan`}
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors flex items-center justify-center">
                  <span className="bg-white/95 backdrop-blur-sm px-5 py-2.5 rounded-full text-caption font-bold text-ink shadow-md flex items-center gap-2">
                    <Maximize2 size={15} /> Tap to expand floor blueprint
                  </span>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SCALABLE STALL INVENTORY (Filterable, Sortable, Searchable)
               ========================================================================= */}
            <div id="stall-inventory" className="pt-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-display-sm font-bold text-ink">Stall Inventory</h3>
                  <p className="text-caption-sm text-muted">
                    {availableStalls.length} of {event.stalls.length} stalls currently available
                  </p>
                </div>

                {/* Search & Sort Controls Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Quick search by stall label */}
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      placeholder="Stall label..."
                      value={stallSearchQuery}
                      onChange={e => setStallSearchQuery(e.target.value)}
                      className="h-8 pl-8 pr-3 text-[12px] font-semibold rounded-full border border-hairline bg-surface-soft placeholder:text-muted focus:outline-none focus:border-ink w-32"
                    />
                  </div>

                  {/* Available stalls toggle */}
                  <button
                    type="button"
                    onClick={() => setOnlyAvailableStalls(prev => !prev)}
                    className={`h-8 px-3 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${
                      onlyAvailableStalls
                        ? 'border-rausch bg-rausch/10 text-rausch'
                        : 'border-hairline bg-white text-muted hover:text-ink'
                    }`}
                  >
                    Available Only
                  </button>

                  {/* Sort by price */}
                  <select
                    value={stallSort}
                    onChange={e => setStallSort(e.target.value as any)}
                    className="h-8 px-2 text-[12px] font-semibold rounded-full border border-hairline bg-white text-ink focus:outline-none cursor-pointer"
                  >
                    <option value="default">Default Order</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Category Pills Strip */}
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {stallCategories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedStallCategory(selectedStallCategory === cat ? 'all' : cat)}
                    className={`px-3 py-1 rounded-full text-[12px] font-semibold capitalize whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                      selectedStallCategory === cat
                        ? 'bg-ink text-white shadow-sm'
                        : 'bg-surface-soft text-muted hover:text-ink border border-hairline'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Stall Cards List */}
              {processedStalls.length === 0 ? (
                <div className="text-center py-12 bg-surface-soft rounded-2xl border border-dashed border-hairline p-6 space-y-2">
                  <p className="text-title-md font-bold text-ink">No stalls match this filter</p>
                  <p className="text-body-sm text-muted">Try clearing the category or showing occupied stalls.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleStalls.map(stall => {
                    const isAvail = stall.status === 'available';
                    return (
                      <div
                        key={stall.id}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                          isAvail
                            ? 'bg-white border-hairline hover:border-zinc-400 shadow-sm'
                            : 'bg-surface-soft border-hairline opacity-65'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[17px] font-mono font-bold text-ink">
                                Stall {stall.label}
                              </span>
                              <StallStatusBadge status={stall.status} />
                              <span className="text-[11px] font-bold text-muted bg-surface-soft px-2.5 py-0.5 rounded-full border border-hairline">
                                {stall.category}
                              </span>
                            </div>

                            <p className="text-caption text-muted">
                              Dimensions: <strong className="text-ink font-bold">{stall.size}</strong>
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1 text-[12px] text-muted">
                              {stall.amenities.map(am => (
                                <span key={am} className="inline-flex items-center gap-1 font-medium">
                                  <CheckCircle size={12} className="text-emerald-600" />
                                  {am}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center sm:flex-col sm:items-end justify-between pt-2 sm:pt-0 border-t sm:border-0 border-zinc-100">
                            <p className="text-[18px] sm:text-[20px] font-bold text-ink tabular-nums">
                              ₹{stall.price.toLocaleString('en-IN')}
                            </p>
                            <button
                              type="button"
                              disabled={!isAvail}
                              onClick={() => onSelectStall(stall)}
                              className={`mt-1.5 px-6 py-2.5 rounded-xl font-bold text-[13px] transition-all active:scale-95 ${
                                isAvail
                                  ? 'text-white shadow-md cursor-pointer hover:opacity-95'
                                  : 'bg-zinc-100 text-muted-soft border border-hairline cursor-not-allowed opacity-90'
                              }`}
                              style={isAvail ? { backgroundColor: '#FF385C' } : {}}
                            >
                              {isAvail
                                ? 'Select Stall'
                                : stall.status === 'held'
                                ? 'Held in Pipeline'
                                : 'Occupied'}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Show All Stalls Button (Pagination scalability for 40+ stalls) */}
              {processedStalls.length > 6 && (
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAllStalls(prev => !prev)}
                    className="px-6 py-2.5 rounded-full border border-hairline bg-white hover:bg-surface-soft text-caption font-bold text-ink transition-all active:scale-95 cursor-pointer shadow-sm"
                  >
                    {showAllStalls
                      ? 'Show Fewer Stalls'
                      : `Show All ${processedStalls.length} Stalls (${processedStalls.length - 6} more)`}
                  </button>
                </div>
              )}
            </div>

            {/* What's Included with Every Stall (Clean Airbnb Tailored Cards) */}
            <div className="pt-8 space-y-4">
              <h3 className="text-display-sm font-bold text-ink">What's included with every stall</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  { icon: Armchair, title: 'Furniture Inclusions', desc: '1 Display Table (6ft × 2ft) + 2 cushioned exhibitor chairs' },
                  { icon: Zap, title: 'Power Connection', desc: 'Dedicated 5A / 16A single-phase point for POS and lighting' },
                  { icon: Wifi, title: 'High-speed Wi-Fi', desc: 'Secure vendor Wi-Fi network for rapid payment processing' },
                  { icon: ShieldCheck, title: 'Venue Security & CCTV', desc: '24/7 overnight surveillance and restricted exhibitor perimeter' },
                  { icon: Sparkles, title: 'Daily Housekeeping', desc: 'Continuous waste clearing and end-of-day floor cleaning' },
                  { icon: Layers, title: 'Social Media Feature', desc: 'Brand highlight across Sunday Soul Santé official Instagram' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-hairline shadow-sm">
                    <item.icon size={20} className="text-ink mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-caption font-bold text-ink">{item.title}</h4>
                      <p className="text-[12px] text-muted mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================================
                AIRBNB "THINGS TO KNOW BEFORE YOU EXHIBIT" (4-COLUMN GRID)
               ========================================================================= */}
            <div className="pt-8 space-y-4">
              <h3 className="text-display-sm font-bold text-ink">Things to know</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                <div>
                  <Clock size={20} className="text-ink mb-2" />
                  <h4 className="text-caption font-bold text-ink">Setup & Tear-Down</h4>
                  <p className="text-[12px] text-muted mt-1 leading-relaxed">
                    Setup begins Friday 7:00 PM and completes Saturday 9:30 AM. Tear-down Sunday night.
                  </p>
                </div>
                <div>
                  <Layers size={20} className="text-ink mb-2" />
                  <h4 className="text-caption font-bold text-ink">Stall Canopy Rules</h4>
                  <p className="text-[12px] text-muted mt-1 leading-relaxed">
                    Uniform canopy structure provided. Bring your freestanding display racks & signage.
                  </p>
                </div>
                <div>
                  <Zap size={20} className="text-ink mb-2" />
                  <h4 className="text-caption font-bold text-ink">Power & Utilities</h4>
                  <p className="text-[12px] text-muted mt-1 leading-relaxed">
                    Standard 5A included. Heavy 16A equipment (ovens, irons) must be declared in advance.
                  </p>
                </div>
                <div>
                  <FileCheck size={20} className="text-ink mb-2" />
                  <h4 className="text-caption font-bold text-ink">Cancellation Policy</h4>
                  <p className="text-[12px] text-muted mt-1 leading-relaxed">
                    Full refund on offline stall deposits up to 7 days before event. Stalls held 48 hours for review.
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================================================
                AIRBNB RATINGS & EXHIBITOR REVIEWS SUMMARY (2 Reviews + Show All Modal)
               ========================================================================= */}
            <div className="pt-8 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-display-sm font-bold text-ink flex items-center gap-2">
                    <span>★ {event.organizer.rating}</span>
                    <span>·</span>
                    <span>{event.organizer.reviewCount} exhibitor reviews</span>
                  </h3>
                  <p className="text-caption-sm text-muted">
                    Verified feedback from past flea market & exhibition stallholders
                  </p>
                </div>
              </div>

              {/* 2 Featured Review Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-hairline bg-surface-soft space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80"
                      alt="Priya S."
                      className="w-10 h-10 rounded-full object-cover border border-hairline"
                    />
                    <div>
                      <h4 className="text-caption font-bold text-ink">Priya Sharma</h4>
                      <p className="text-[11px] text-muted">Zevar Jewellery · Participated Nov 2025</p>
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs">★★★★★</div>
                  <p className="text-body-sm text-body line-clamp-3">
                    "Exceptional footfall! We sold out 70% of our inventory on Day 1 itself. The 16A power connection was steady all weekend and crowd purchasing intent was top-tier."
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-hairline bg-surface-soft space-y-2.5">
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                      alt="Arjun N."
                      className="w-10 h-10 rounded-full object-cover border border-hairline"
                    />
                    <div>
                      <h4 className="text-caption font-bold text-ink">Arjun Nair</h4>
                      <p className="text-[11px] text-muted">Canvas & Chai · Participated Oct 2025</p>
                    </div>
                  </div>
                  <div className="text-amber-500 text-xs">★★★★★</div>
                  <p className="text-body-sm text-body line-clamp-3">
                    "Organizers were communicative and coordinated loading passes seamlessly. High density of weekend art buyers in UB City Atrium."
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowReviews(true)}
                className="px-6 py-2.5 rounded-xl border border-hairline bg-white hover:bg-surface-soft text-caption font-bold text-ink transition-all active:scale-95 cursor-pointer shadow-sm"
              >
                Show all {event.organizer.reviewCount} reviews
              </button>
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
                      className="border border-hairline rounded-xl overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isOpen ? null : i)}
                        className="w-full px-5 py-4 text-left font-bold text-caption text-ink flex items-center justify-between hover:bg-surface-soft transition-colors cursor-pointer"
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
                        <div className="px-5 pb-4 text-body-sm text-muted leading-relaxed border-t border-zinc-100 bg-surface-soft/40 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* =========================================================================
                "MORE EXHIBITIONS IN {CITY}" SECTION (Airbnb Horizontal Discovery)
               ========================================================================= */}
            <div className="pt-8 space-y-4">
              <h3 className="text-display-sm font-bold text-ink">
                More exhibitions you might like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedEvents.map(rel => {
                  const relMinPrice = Math.min(...rel.stalls.map(s => s.price));
                  return (
                    <div
                      key={rel.id}
                      onClick={onBack}
                      className="p-3.5 rounded-2xl border border-hairline hover:border-zinc-400 bg-white shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-3.5 items-center group"
                    >
                      <img
                        src={rel.coverImage}
                        alt={rel.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[11px] font-bold uppercase text-muted">
                          {rel.city} · {rel.category}
                        </span>
                        <h4 className="text-caption font-bold text-ink group-hover:text-rausch transition-colors line-clamp-1">
                          {rel.name}
                        </h4>
                        <p className="text-[12px] text-muted line-clamp-1">{rel.venue}</p>
                        <p className="text-[13px] font-bold text-ink tabular-nums mt-1">
                          ₹{relMinPrice.toLocaleString('en-IN')}{' '}
                          <span className="text-[11px] font-normal text-muted">starts</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sticky Right-Rail Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-20 rounded-2xl border border-hairline bg-white p-6 shadow-airbnb-modal space-y-5">
              <div className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="text-[12px] text-muted block font-medium">Stall prices from</span>
                  <span className="text-display-sm font-bold text-ink tabular-nums">
                    ₹{minPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <span className="text-caption-sm text-muted font-medium bg-surface-soft px-2.5 py-1 rounded-full border border-hairline">
                  2 days event
                </span>
              </div>

              <div className="space-y-3 text-caption text-body font-medium">
                <div className="flex justify-between">
                  <span>Available Stalls</span>
                  <strong className="text-emerald-700 font-bold">{availableStalls.length} free</strong>
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

              {/* Signature Airbnb Primary CTA Button */}
              <button
                type="button"
                onClick={scrollToStalls}
                className="w-full py-3.5 rounded-xl font-bold text-caption text-white flex items-center justify-center transition-all shadow-md active:scale-[0.98] cursor-pointer hover:opacity-95"
                style={{ backgroundColor: '#FF385C' }}
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
          className="px-6 py-2.5 rounded-xl text-white text-[14px] font-bold shadow-md active:scale-95 transition-all cursor-pointer"
          style={{ backgroundColor: '#FF385C' }}
        >
          Select Stall
        </button>
      </div>

      {/* Lightbox Modals */}
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

      <ReviewsModal
        isOpen={showReviews}
        onClose={() => setShowReviews(false)}
        event={event}
      />

      <MessageOrganizerModal
        isOpen={showMessageModal}
        onClose={() => setShowMessageModal(false)}
        organizer={event.organizer}
        eventName={event.name}
      />
    </div>
  );
}
