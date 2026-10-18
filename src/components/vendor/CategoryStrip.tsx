import React from 'react';
import {
  Sparkles,
  Shirt,
  Gem,
  UtensilsCrossed,
  Palette,
  Leaf,
  Smile,
} from 'lucide-react';

interface CategoryStripProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All Categories', icon: Sparkles },
  { id: 'fashion', label: 'Fashion & Apparel', icon: Shirt },
  { id: 'jewellery', label: 'Jewellery', icon: Gem },
  { id: 'food', label: 'Food & Gourmet', icon: UtensilsCrossed },
  { id: 'art', label: 'Art & Craft', icon: Palette },
  { id: 'lifestyle', label: 'Home & Living', icon: Leaf },
  { id: 'wellness', label: 'Wellness', icon: Smile },
];

export function CategoryStrip({ activeCategory, onSelectCategory }: CategoryStripProps) {
  return (
    <div className="border-b border-hairline bg-white sticky top-[132px] sm:top-[69px] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto no-scrollbar py-3.5">
          {categories.map(cat => {
            const isActive = activeCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`flex flex-col items-center gap-1.5 flex-shrink-0 group pb-2 relative transition-all duration-150 active:scale-95 cursor-pointer ${
                  isActive ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center transition-colors ${
                    isActive ? 'text-ink scale-105' : 'text-muted-soft group-hover:text-ink'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                </div>
                <span
                  className={`text-[12px] whitespace-nowrap transition-colors ${
                    isActive ? 'font-bold text-ink' : 'font-semibold text-muted group-hover:text-ink'
                  }`}
                >
                  {cat.label}
                </span>

                {/* Airbnb Style Active Underline Rule */}
                {isActive && (
                  <span className="absolute bottom-0 left-1 right-1 h-[2.5px] bg-ink rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
