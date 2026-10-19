import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check, ChevronDown } from 'lucide-react';

export type SortOption =
  | 'recommended'
  | 'price_asc'
  | 'price_desc'
  | 'footfall'
  | 'date_asc'
  | 'stalls_avail';

interface SortDropdownProps {
  currentSort: SortOption;
  onSelectSort: (sort: SortOption) => void;
}

const sortOptions: { id: SortOption; label: string; desc: string }[] = [
  { id: 'recommended', label: 'Recommended', desc: 'Curated by StallSetu' },
  { id: 'price_asc', label: 'Price: Low to High', desc: 'Least expensive stall first' },
  { id: 'price_desc', label: 'Price: High to Low', desc: 'Premium & anchor stalls' },
  { id: 'footfall', label: 'Highest Footfall', desc: 'Maximum buyer foot traffic' },
  { id: 'date_asc', label: 'Soonest First', desc: 'Upcoming exhibition dates' },
  { id: 'stalls_avail', label: 'Most Stalls Available', desc: 'Maximum booth availability' },
];

export function SortDropdown({ currentSort, onSelectSort }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeOption = sortOptions.find(o => o.id === currentSort) || sortOptions[0];

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`h-9 px-3.5 rounded-full border border-hairline bg-white hover:border-ink hover:bg-surface-soft text-caption font-semibold text-ink flex items-center gap-2 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
          currentSort !== 'recommended' ? 'border-ink ring-1 ring-ink' : ''
        }`}
        aria-label="Sort exhibitions"
      >
        <ArrowUpDown size={13} className="text-muted flex-shrink-0" />
        <span className="hidden sm:inline text-muted font-normal">Sort:</span>
        <span className="truncate max-w-[120px]">{activeOption.label}</span>
        <ChevronDown size={13} className={`text-muted transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-hairline shadow-airbnb-modal z-40 py-2 divide-y divide-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-bold text-muted uppercase tracking-wider">
            Sort Exhibitions By
          </div>
          <div className="py-1">
            {sortOptions.map(option => {
              const isSelected = currentSort === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelectSort(option.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-caption transition-colors cursor-pointer ${
                    isSelected ? 'bg-surface-soft text-ink font-bold' : 'text-body hover:bg-surface-soft'
                  }`}
                >
                  <div>
                    <p className="leading-tight">{option.label}</p>
                    <p className="text-[11px] text-muted font-normal mt-0.5">{option.desc}</p>
                  </div>
                  {isSelected && <Check size={14} strokeWidth={2.5} className="text-rausch flex-shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
