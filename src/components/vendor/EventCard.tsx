import React from 'react';
import { Heart, MapPin, Calendar, Users, ChevronRight } from 'lucide-react';
import type { Event } from '../../data/types';

interface EventCardProps {
  event: Event;
  isWishlisted: boolean;
  onToggleWishlist: (eventId: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: Event) => void;
  variant?: 'grid' | 'list';
}

export function EventCard({
  event,
  isWishlisted,
  onToggleWishlist,
  onSelectEvent,
  variant = 'grid',
}: EventCardProps) {
  const availableStalls = event.stalls.filter(s => s.status === 'available').length;
  const minPrice = Math.min(...event.stalls.map(s => s.price));

  const formatDates = () => {
    const s = new Date(event.startDate);
    const e = new Date(event.endDate);
    const startDay = s.getDate();
    const endDay = e.getDate();
    const month = s.toLocaleString('en-IN', { month: 'short' });
    return `${startDay}–${endDay} ${month} 2026`;
  };

  const renderBadge = () => {
    if (event.badgeType === 'trending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-white/95 text-ink shadow-sm backdrop-blur-md border border-black/5">
          <span className="text-sm">🔥</span>
          <span>Trending</span>
        </span>
      );
    }
    if (event.badgeType === 'favourite') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-white/95 text-ink shadow-sm backdrop-blur-md border border-black/5">
          <span className="text-sm">🏆</span>
          <span>Vendor Favourite</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-white/95 text-ink shadow-sm backdrop-blur-md border border-black/5">
        <span
          className={`w-2 h-2 rounded-full ${
            availableStalls > 4
              ? 'bg-emerald-500'
              : availableStalls > 0
              ? 'bg-amber-500'
              : 'bg-zinc-400'
          }`}
        />
        {availableStalls > 0 ? `${availableStalls} stalls left` : 'Sold Out'}
      </span>
    );
  };

  // =========================================================================
  // LIST VIEW LAYOUT
  // =========================================================================
  if (variant === 'list') {
    return (
      <div
        onClick={() => onSelectEvent(event)}
        className="group cursor-pointer bg-white rounded-2xl border border-hairline hover:border-zinc-400 p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch"
      >
        {/* Thumbnail Plate */}
        <div className="relative w-full sm:w-64 sm:h-44 aspect-[16/10] sm:aspect-auto flex-shrink-0 rounded-xl overflow-hidden bg-zinc-100">
          <img
            src={event.coverImage}
            alt={event.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
            loading="lazy"
          />

          {/* Airbnb Floating Pill Badge */}
          <div className="absolute top-2.5 left-2.5">
            {renderBadge()}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={e => {
              e.stopPropagation();
              onToggleWishlist(event.id, e);
            }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition-all duration-150 active:scale-75 cursor-pointer border border-zinc-200/40"
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart
              size={16}
              className={`transition-colors ${
                isWishlisted
                  ? 'fill-rausch text-rausch scale-110'
                  : 'text-zinc-700 hover:text-black stroke-[2.2]'
              }`}
            />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface-soft text-muted border border-hairline">
                {event.category}
              </span>
              <span className="text-[12px] text-muted flex items-center gap-1">
                <MapPin size={12} className="text-zinc-400" />
                {event.city}
              </span>
            </div>

            <h3 className="text-title-md font-bold text-ink group-hover:text-rausch transition-colors line-clamp-1">
              {event.name}
            </h3>

            <p className="text-body-sm text-muted line-clamp-1">
              {event.venue}
            </p>

            <div className="flex items-center gap-4 text-caption-sm text-muted pt-1 flex-wrap">
              <span className="flex items-center gap-1.5">
                <Calendar size={13} className="text-zinc-400 flex-shrink-0" />
                {formatDates()}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Users size={13} className="text-zinc-400 flex-shrink-0" />
                {event.footfall}
              </span>
            </div>

            {/* Airbnb Style "Book Early" Perk Line */}
            <p className="text-[12px] font-semibold text-emerald-700 pt-0.5">
              Book early to secure corner positions
            </p>
          </div>

          {/* Bottom Meta & Action */}
          <div className="pt-3 border-t border-zinc-100 flex items-center justify-between mt-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-5 h-5 rounded-full object-cover border border-hairline flex-shrink-0"
              />
              <p className="text-[12px] text-muted-soft">
                Curated by <span className="font-semibold text-ink">{event.organizer.name}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[11px] text-muted uppercase tracking-wider font-semibold">Starting from</p>
                <p className="text-display-sm font-bold text-ink tabular-nums">
                  ₹{minPrice.toLocaleString('en-IN')}
                </p>
              </div>

              <span className="px-4 py-2 rounded-xl bg-surface-soft group-hover:bg-ink group-hover:text-white text-ink text-caption font-bold border border-hairline transition-all duration-150 flex items-center gap-1">
                View Stalls
                <ChevronRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // GRID VIEW LAYOUT (DEFAULT)
  // =========================================================================
  return (
    <div
      onClick={() => onSelectEvent(event)}
      className="group cursor-pointer flex flex-col transition-all duration-200"
    >
      {/* 4:3 Aspect Ratio Photo Plate (Airbnb rounded-2xl / 16px) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-zinc-100 mb-3 border border-zinc-200/60 shadow-sm group-hover:shadow-md transition-all duration-300">
        <img
          src={event.coverImage}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Floating Airbnb Pill Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          {renderBadge()}
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleWishlist(event.id, e);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition-all duration-150 active:scale-75 cursor-pointer border border-zinc-200/40"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isWishlisted
                ? 'fill-rausch text-rausch scale-110'
                : 'text-zinc-700 hover:text-black stroke-[2.2]'
            }`}
          />
        </button>
      </div>

      {/* Meta Text Stack */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] sm:text-[16px] font-bold text-zinc-900 group-hover:text-rausch transition-colors line-clamp-1 leading-snug">
            {event.name}
          </h3>
        </div>

        <p className="text-[13px] text-zinc-500 line-clamp-1 flex items-center gap-1 font-medium">
          <MapPin size={13} className="text-zinc-400 flex-shrink-0" />
          {event.venue}, {event.city}
        </p>

        <div className="flex items-center gap-2.5 text-[12px] text-zinc-500 pt-0.5 font-medium">
          <span className="flex items-center gap-1">
            <Calendar size={12} className="text-zinc-400 flex-shrink-0" />
            {formatDates()}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Users size={12} className="text-zinc-400 flex-shrink-0" />
            {event.footfall.split(' ')[0]} visitors
          </span>
        </div>

        {/* Airbnb Style "Book Early" Green Perk */}
        <p className="text-[12px] font-semibold text-emerald-700 pt-0.5">
          Book early to secure corner position
        </p>

        {/* Pricing & Organizer Row */}
        <div className="pt-2 flex items-center justify-between border-t border-zinc-100 mt-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <img
              src={event.organizer.avatar}
              alt={event.organizer.name}
              className="w-4 h-4 rounded-full object-cover border border-hairline flex-shrink-0"
            />
            <p className="text-[12px] text-zinc-500 truncate">
              By <span className="font-semibold text-zinc-700">{event.organizer.name}</span>
            </p>
          </div>

          <p className="text-[15px] font-bold text-zinc-900 tabular-nums flex-shrink-0">
            ₹{minPrice.toLocaleString('en-IN')}{' '}
            <span className="text-[12px] font-normal text-zinc-500">starts</span>
          </p>
        </div>
      </div>
    </div>
  );
}
