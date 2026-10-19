import React from 'react';
import {
  Search,
  Sparkles,
  Shirt,
  Gem,
  UtensilsCrossed,
  Palette,
  Leaf,
  Smile,
  type LucideIcon,
} from 'lucide-react';

interface SearchPillProps {
  selectedCity: string;
  selectedCategory: string;
  maxBudget: number;
  onOpenFilter: () => void;
}

const categoryMeta: Record<string, { label: string; icon: LucideIcon }> = {
  all: { label: 'Any Category', icon: Sparkles },
  fashion: { label: 'Fashion', icon: Shirt },
  jewellery: { label: 'Jewellery', icon: Gem },
  food: { label: 'Food & Gourmet', icon: UtensilsCrossed },
  art: { label: 'Art & Craft', icon: Palette },
  lifestyle: { label: 'Home & Living', icon: Leaf },
  wellness: { label: 'Wellness', icon: Smile },
};

export function SearchPill({
  selectedCity,
  selectedCategory,
  maxBudget,
  onOpenFilter,
}: SearchPillProps) {
  const cityLabel = selectedCity === 'all' ? 'Anywhere in India' : selectedCity;
  const currentCat = categoryMeta[selectedCategory] || { label: selectedCategory, icon: Sparkles };
  const CategoryIcon = currentCat.icon;
  const isCustomCategory = selectedCategory !== 'all';
  const budgetLabel = maxBudget >= 100000 ? 'Any Budget' : `Under ₹${(maxBudget / 1000).toFixed(0)}k`;

  return (
    <div className="w-full flex justify-center">
      <button
        type="button"
        onClick={onOpenFilter}
        className="w-full max-w-xl h-[52px] flex items-center bg-white rounded-full border border-hairline shadow-airbnb-pill hover:shadow-airbnb-pill-hover pl-4 pr-2 text-left transition-all duration-200 active:scale-[0.99] group cursor-pointer"
        aria-label="Open event search and filters"
      >
        {/* Segment 1: Location */}
        <div className="flex-1 px-3 py-1 min-w-0">
          <p className="text-[13px] font-bold text-ink group-hover:text-rausch transition-colors truncate leading-tight">
            {cityLabel}
          </p>
          <p className="text-[11px] font-medium text-muted truncate leading-tight mt-0.5">
            Select location
          </p>
        </div>

        <div className="h-6 w-px bg-hairline flex-shrink-0" />

        {/* Segment 2: Category (Reflects active category with icon) */}
        <div className="flex-1 px-3 py-1 min-w-0 hidden sm:block">
          <div className="flex items-center gap-1.5 min-w-0">
            {isCustomCategory && (
              <CategoryIcon size={13} strokeWidth={2.2} className="text-rausch flex-shrink-0" />
            )}
            <p className="text-[13px] font-bold text-ink truncate leading-tight">
              {currentCat.label}
            </p>
          </div>
          <p className="text-[11px] font-medium text-muted truncate leading-tight mt-0.5">
            Exhibition type
          </p>
        </div>

        <div className="h-6 w-px bg-hairline flex-shrink-0 hidden sm:block" />

        {/* Segment 3: Budget */}
        <div className="flex-1 px-3 py-1 min-w-0">
          <p className="text-[13px] font-bold text-ink truncate tabular-nums leading-tight">
            {budgetLabel}
          </p>
          <p className="text-[11px] font-medium text-muted truncate leading-tight mt-0.5">
            Max stall budget
          </p>
        </div>

        {/* Signature Airbnb Rausch Search Orb */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-150 active:scale-90 shadow-sm ml-1"
          style={{ backgroundColor: '#FF385C' }}
        >
          <Search size={14} strokeWidth={2.6} className="text-white" />
        </div>
      </button>
    </div>
  );
}
