import React, { useEffect } from 'react';
import { X, SlidersHorizontal, Check } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* 1. Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 2. Modal Sheet */}
      <div
        className="relative w-full max-w-xl bg-white rounded-t-3xl sm:rounded-2xl border border-zinc-200 shadow-2xl flex flex-col max-h-[90vh] z-10 overflow-hidden"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-white flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-zinc-200 hover:border-zinc-900 hover:bg-zinc-100 flex items-center justify-center text-zinc-700 transition-all active:scale-90 cursor-pointer"
            aria-label="Close filters"
          >
            <X size={17} />
          </button>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-zinc-800" />
            <h2 className="text-[16px] font-bold text-zinc-900">Filters</h2>
          </div>
          <div className="w-8" />
        </div>

        {/* Scrollable Filter Form */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-white divide-y divide-zinc-100">
          {/* City Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-zinc-900">City / Location</h3>
              {selectedCity !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectCity('all')}
                  className="text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                >
                  Reset city
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {cities.map(c => {
                const active = selectedCity === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => onSelectCity(selectedCity === c.id ? 'all' : c.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50'
                    }`}
                    style={{
                      backgroundColor: active ? '#222222' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#222222',
                      borderColor: active ? '#222222' : '#DDDDDD',
                    }}
                  >
                    {active && <Check size={13} strokeWidth={2.5} className="text-white flex-shrink-0" />}
                    <span>{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-zinc-900">Event Category</h3>
              {selectedCategory !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="text-[12px] font-semibold text-zinc-500 hover:text-zinc-900 underline cursor-pointer"
                >
                  Reset category
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => {
                const active = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onSelectCategory(selectedCategory === cat.id ? 'all' : cat.id)}
                    className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                      active
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50'
                    }`}
                    style={{
                      backgroundColor: active ? '#222222' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#222222',
                      borderColor: active ? '#222222' : '#DDDDDD',
                    }}
                  >
                    {active && <Check size={13} strokeWidth={2.5} className="text-white flex-shrink-0" />}
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Budget Slider */}
          <div className="pt-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-bold text-zinc-900">Max Stall Budget</h3>
              <span className="text-[15px] font-bold text-zinc-900 tabular-nums bg-zinc-100 px-3 py-1 rounded-full border border-zinc-200">
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
              className="w-full accent-[#FF385C] cursor-pointer h-2 bg-zinc-200 rounded-lg"
              aria-label="Max Stall Budget Slider"
            />
            <div className="flex justify-between text-[12px] font-medium text-zinc-500">
              <span>₹15,000</span>
              <span>₹1,00,000+</span>
            </div>
            {/* Quick budget preset chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { label: 'Under ₹20k', value: 20000 },
                { label: 'Under ₹25k', value: 25000 },
                { label: 'Under ₹35k', value: 35000 },
                { label: 'Any Budget', value: 100000 },
              ].map(preset => {
                const isActive = maxBudget === preset.value;
                return (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onSelectMaxBudget(preset.value)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition-all active:scale-95 cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                        : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-50'
                    }`}
                    style={{
                      backgroundColor: isActive ? '#222222' : '#FFFFFF',
                      color: isActive ? '#FFFFFF' : '#222222',
                      borderColor: isActive ? '#222222' : '#DDDDDD',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Only Available Toggle */}
          <div className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-[14px] font-bold text-zinc-900">Available Stalls Only</p>
              <p className="text-[12px] text-zinc-500">Hide exhibitions that are completely booked</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={onlyAvailable}
              onClick={onToggleOnlyAvailable}
              className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-rausch focus:ring-offset-2 ${
                onlyAvailable ? 'bg-rausch' : 'bg-zinc-300'
              }`}
              style={{
                backgroundColor: onlyAvailable ? '#FF385C' : '#E4E4E7',
              }}
              aria-label="Toggle Available Stalls Only"
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  onlyAvailable ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer Actions (Solid White) */}
        <div className="px-6 py-4 border-t border-zinc-200 bg-white flex items-center justify-between flex-shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="text-[13px] font-bold text-zinc-500 hover:text-zinc-900 underline cursor-pointer active:scale-95 transition-colors"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-7 py-3 rounded-xl bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
            style={{
              backgroundColor: '#FF385C',
              color: '#FFFFFF',
            }}
          >
            Show {totalFilteredCount} {totalFilteredCount === 1 ? 'Exhibition' : 'Exhibitions'}
          </button>
        </div>
      </div>
    </div>
  );
}
