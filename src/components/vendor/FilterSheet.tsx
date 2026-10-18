import React, { useEffect } from 'react';
import { X, SlidersHorizontal } from 'lucide-react';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string;
  onSelectCity: (city: string) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  maxBudget: number;
  onSelectMaxBudget: (budget: number) => void;
  onlyAvailable: boolean;
  onToggleOnlyAvailable: () => void;
  totalFilteredCount: number;
  onReset: () => void;
}

const cities = [
  { id: 'all', label: 'All Cities' },
  { id: 'Bengaluru', label: 'Bengaluru' },
  { id: 'Hyderabad', label: 'Hyderabad' },
  { id: 'Mumbai', label: 'Mumbai' },
  { id: 'Delhi NCR', label: 'Delhi NCR' },
  { id: 'Pune', label: 'Pune' },
];

const categories = [
  { id: 'all', label: 'All Categories' },
  { id: 'lifestyle', label: 'Lifestyle & Home' },
  { id: 'fashion', label: 'Fashion & Apparel' },
  { id: 'jewellery', label: 'Jewellery' },
  { id: 'food', label: 'Food & Gourmet' },
  { id: 'art', label: 'Art & Craft' },
  { id: 'wellness', label: 'Wellness' },
];

export function FilterSheet({
  isOpen,
  onClose,
  selectedCity,
  onSelectCity,
  selectedCategory,
  onSelectCategory,
  maxBudget,
  onSelectMaxBudget,
  onlyAvailable,
  onToggleOnlyAvailable,
  totalFilteredCount,
  onReset,
}: FilterSheetProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* 1. Backdrop (Click to dismiss) */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Modal Sheet (SOLID 100% OPAQUE WHITE CONTAINER - NO TRANSPARENCY) */}
      <div
        className="relative w-full max-w-xl bg-white rounded-t-airbnb-sheet sm:rounded-airbnb-sheet border border-hairline shadow-airbnb-modal flex flex-col max-h-[90vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-hairline flex items-center justify-between bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong flex items-center justify-center text-ink transition-all active:scale-90 cursor-pointer shadow-sm"
            aria-label="Close filters"
          >
            <X size={17} />
          </button>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-ink" />
            <h2 className="text-title-md font-bold text-ink">Filters</h2>
          </div>
          <div className="w-9" />
        </div>

        {/* Scrollable Filter Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white divide-y divide-hairline-soft">
          {/* City Selection */}
          <div className="space-y-3">
            <h3 className="text-title-sm font-bold text-ink">City / Location</h3>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => {
                const active = selectedCity === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectCity(c.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-95 cursor-pointer ${
                      active
                        ? 'bg-ink text-white border-ink shadow-sm font-bold'
                        : 'bg-white text-ink border-hairline hover:border-ink hover:bg-surface-soft'
                    }`}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-6 space-y-3">
            <h3 className="text-title-sm font-bold text-ink">Event Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(cat.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-95 cursor-pointer ${
                      active
                        ? 'bg-ink text-white border-ink shadow-sm font-bold'
                        : 'bg-white text-ink border-hairline hover:border-ink hover:bg-surface-soft'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-title-sm font-bold text-ink">Max Stall Budget</h3>
              <span className="text-title-sm font-bold text-ink tabular-nums bg-surface-soft px-3.5 py-1 rounded-full border border-hairline">
                ₹{maxBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={15000}
              max={100000}
              step={5000}
              value={maxBudget}
              onChange={e => onSelectMaxBudget(Number(e.target.value))}
              className="w-full accent-rausch cursor-pointer h-2 bg-hairline rounded-lg"
            />
            <div className="flex justify-between text-[12px] font-medium text-muted">
              <span>₹15,000</span>
              <span>₹1,00,000+</span>
            </div>
          </div>

          {/* Only Available Toggle */}
          <div className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-title-sm font-bold text-ink">Available Stalls Only</p>
              <p className="text-caption-sm text-muted">Hide exhibitions that are completely booked</p>
            </div>
            <button
              type="button"
              onClick={onToggleOnlyAvailable}
              className={`w-13 h-7 rounded-full p-1 transition-colors duration-200 flex items-center cursor-pointer border ${
                onlyAvailable
                  ? 'bg-ink border-ink justify-end'
                  : 'bg-hairline border-border-strong justify-start'
              }`}
              style={{ width: '52px' }}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-md" />
            </button>
          </div>
        </div>

        {/* Footer Actions (Solid White) */}
        <div className="px-6 py-4 border-t border-hairline bg-white flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="text-caption font-bold text-ink hover:text-black active:text-muted underline cursor-pointer transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-airbnb-card bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white font-bold text-button-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Show {totalFilteredCount} {totalFilteredCount === 1 ? 'Exhibition' : 'Exhibitions'}
          </button>
        </div>
      </div>
    </div>
  );
}
