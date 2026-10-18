import React from 'react';
import { Heart, MapPin, Calendar, Users } from 'lucide-react';
import type { Event } from '../../data/types';

interface EventCardProps {
  event: Event;
  isWishlisted: boolean;
  onToggleWishlist: (eventId: string, e: React.MouseEvent) => void;
  onSelectEvent: (event: Event) => void;
}

export function EventCard({
  event,
  isWishlisted,
  onToggleWishlist,
  onSelectEvent,
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

        {/* Floating Availability Badge (Top Left) */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-zinc-900 shadow-md backdrop-blur-md border border-zinc-200/60">
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
        </div>

        {/* Wishlist Heart Button (Top Right) */}
        <button
          type="button"
          onClick={e => {
            e.stopPropagation();
            onToggleWishlist(event.id, e);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-800 shadow-md flex items-center justify-center transition-all duration-150 active:scale-90 cursor-pointer border border-zinc-200/40"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isWishlisted
                ? 'fill-rausch text-rausch'
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

        {/* Pricing Row */}
        <div className="pt-2 flex items-baseline justify-between border-t border-zinc-100 mt-1">
          <p className="text-[12px] text-zinc-400">
            By <span className="font-semibold text-zinc-700">{event.organizer.name}</span>
          </p>
          <p className="text-[15px] font-bold text-zinc-900 tabular-nums">
            ₹{minPrice.toLocaleString('en-IN')}{' '}
            <span className="text-[12px] font-normal text-zinc-500">starts</span>
          </p>
        </div>
      </div>
    </div>
  );
}
