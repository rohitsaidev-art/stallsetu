import React from 'react';
import { Search } from 'lucide-react';

interface SearchPillProps {
  selectedCity: string;
  selectedCategory: string;
  maxBudget: number;
  onOpenFilter: () => void;
}

export function SearchPill({
  selectedCity,
  selectedCategory,
  maxBudget,
  onOpenFilter,
}: SearchPillProps) {
  const cityLabel = selectedCity === 'all' ? 'Anywhere in India' : selectedCity;
  const categoryLabel = selectedCategory === 'all' ? 'Any Category' : selectedCategory;
  const budgetLabel = maxBudget >= 100000 ? 'Any Budget' : `Under ₹${(maxBudget / 1000).toFixed(0)}k`;

  return (
    <div className="w-full flex justify-center">
      <button
        type="button"
        onClick={onOpenFilter}
        className="w-full max-w-xl flex items-center bg-white rounded-full border border-zinc-200/90 shadow-airbnb-pill hover:shadow-airbnb-pill-hover px-4 py-2 text-left transition-all duration-200 active:scale-[0.99] group cursor-pointer"
        aria-label="Open event search and filters"
      >
        {/* Segment 1: City */}
        <div className="flex-1 px-3 py-0.5 min-w-0">
          <p className="text-[13px] font-bold text-zinc-900 group-hover:text-rausch transition-colors truncate">
            {cityLabel}
          </p>
          <p className="text-[11px] font-medium text-zinc-500 truncate">Select location</p>
        </div>

        <div className="h-6 w-px bg-zinc-200 flex-shrink-0" />

        {/* Segment 2: Category (Hidden on small mobile) */}
        <div className="flex-1 px-3 py-0.5 min-w-0 hidden sm:block">
          <p className="text-[13px] font-bold text-zinc-900 truncate">{categoryLabel}</p>
          <p className="text-[11px] font-medium text-zinc-500 truncate">Exhibition type</p>
        </div>

        <div className="h-6 w-px bg-zinc-200 flex-shrink-0 hidden sm:block" />

        {/* Segment 3: Budget */}
        <div className="flex-1 px-3 py-0.5 min-w-0">
          <p className="text-[13px] font-bold text-zinc-900 truncate tabular-nums">{budgetLabel}</p>
          <p className="text-[11px] font-medium text-zinc-500 truncate">Max stall budget</p>
        </div>

        {/* The Rausch Search Orb */}
        <div className="ml-2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rausch hover:bg-rausch-hover text-white flex items-center justify-center flex-shrink-0 transition-transform duration-150 active:scale-90 shadow-sm">
          <Search size={16} strokeWidth={2.6} />
        </div>
      </button>
    </div>
  );
}
