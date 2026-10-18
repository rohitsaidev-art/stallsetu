import React, { useState, useMemo } from 'react';
import { Heart, ClipboardList, Filter } from 'lucide-react';
import { useStallSetuStore } from './store/useStore';
import type { Event, Stall, VendorBrand, Enquiry } from './data/types';
import { SearchPill } from './components/vendor/SearchPill';
import { CategoryStrip } from './components/vendor/CategoryStrip';
import { EventCard } from './components/vendor/EventCard';
import { FilterSheet } from './components/vendor/FilterSheet';
import { EventDetail } from './components/vendor/EventDetail';
import { BrandProfileForm } from './components/vendor/BrandProfileForm';
import { EnquiryReview } from './components/vendor/EnquiryReview';
import { SuccessScreen } from './components/vendor/SuccessScreen';
import { MyEnquiries } from './components/vendor/MyEnquiries';

type VendorScreen =
  | 'discovery'
  | 'event_detail'
  | 'brand_form'
  | 'enquiry_review'
  | 'success'
  | 'my_enquiries';

export default function App() {
  const store = useStallSetuStore();

  // Screen Navigation State
  const [currentScreen, setCurrentScreen] = useState<VendorScreen>('discovery');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

  // In-progress Enquiry draft state
  const [draftBrand, setDraftBrand] = useState<VendorBrand | null>(null);
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxBudget, setMaxBudget] = useState(100000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return store.events.filter(event => {
      // Wishlist filter
      if (wishlistOnly && !store.wishlistIds.includes(event.id)) {
        return false;
      }
      // City filter
      if (selectedCity !== 'all' && event.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'all') {
        const matchesCategory =
          event.category.toLowerCase() === selectedCategory.toLowerCase() ||
          event.stalls.some(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
        if (!matchesCategory) return false;
      }
      // Budget filter (minimum stall price must be <= maxBudget)
      const minPrice = Math.min(...event.stalls.map(s => s.price));
      if (minPrice > maxBudget) {
        return false;
      }
      // Only available stalls
      if (onlyAvailable) {
        const hasAvailable = event.stalls.some(s => s.status === 'available');
        if (!hasAvailable) return false;
      }
      return true;
    });
  }, [
    store.events,
    selectedCity,
    selectedCategory,
    maxBudget,
    onlyAvailable,
    wishlistOnly,
    store.wishlistIds,
  ]);

  const handleResetFilters = () => {
    setSelectedCity('all');
    setSelectedCategory('all');
    setMaxBudget(100000);
    setOnlyAvailable(false);
    setWishlistOnly(false);
  };

  // Flow Handlers
  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentScreen('event_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectStall = (stall: Stall) => {
    setSelectedStall(stall);
    setCurrentScreen('brand_form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProceedToReview = (brand: VendorBrand, message: string) => {
    setDraftBrand(brand);
    setDraftMessage(message);
    setCurrentScreen('enquiry_review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalSubmit = () => {
    if (!selectedEvent || !selectedStall || !draftBrand) return;

    const newEnquiry: Enquiry = {
      id: `ENQ-${Math.floor(100000 + Math.random() * 900000)}`,
      eventId: selectedEvent.id,
      stallId: selectedStall.id,
      vendorBrand: draftBrand,
      status: 'new',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferredSize: selectedStall.size,
      message: draftMessage,
    };

    store.addEnquiry(newEnquiry);
    setLastSubmittedId(newEnquiry.id);
    setCurrentScreen('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================================
  // SCREEN ROUTING
  // =========================================================================

  if (currentScreen === 'event_detail' && selectedEvent) {
    return (
      <EventDetail
        event={selectedEvent}
        isWishlisted={store.wishlistIds.includes(selectedEvent.id)}
        onToggleWishlist={store.toggleWishlist}
        onBack={() => setCurrentScreen('discovery')}
        onSelectStall={handleSelectStall}
      />
    );
  }

  if (currentScreen === 'brand_form' && selectedEvent && selectedStall) {
    return (
      <BrandProfileForm
        event={selectedEvent}
        stall={selectedStall}
        savedProfile={store.savedBrandProfile}
        onClearSavedProfile={store.clearSavedBrandProfile}
        onBack={() => setCurrentScreen('event_detail')}
        onProceedToReview={handleProceedToReview}
      />
    );
  }

  if (currentScreen === 'enquiry_review' && selectedEvent && selectedStall && draftBrand) {
    return (
      <EnquiryReview
        event={selectedEvent}
        stall={selectedStall}
        brand={draftBrand}
        message={draftMessage}
        onBack={() => setCurrentScreen('brand_form')}
        onSubmit={handleFinalSubmit}
      />
    );
  }

  if (currentScreen === 'success' && selectedEvent && selectedStall && draftBrand) {
    return (
      <SuccessScreen
        enquiryId={lastSubmittedId}
        event={selectedEvent}
        stall={selectedStall}
        brand={draftBrand}
        onViewMyEnquiries={() => setCurrentScreen('my_enquiries')}
        onBrowseEvents={() => {
          setSelectedEvent(null);
          setSelectedStall(null);
          setCurrentScreen('discovery');
        }}
      />
    );
  }

  if (currentScreen === 'my_enquiries') {
    return (
      <MyEnquiries
        enquiries={store.enquiries}
        events={store.events}
        onBack={() => setCurrentScreen('discovery')}
        onBrowseEvents={() => setCurrentScreen('discovery')}
      />
    );
  }

  // DEFAULT: DISCOVERY SCREEN
  return (
    <div className="bg-canvas min-h-screen text-ink flex flex-col">
      {/* =========================================================================
          AIRBNB TOP HEADER WITH 3-SEGMENT PILL SEARCH
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-canvas/95 backdrop-blur-md border-b border-hairline py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo / Brand Name */}
          <button
            onClick={() => {
              handleResetFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 flex-shrink-0 text-left group cursor-pointer active:scale-95 transition-transform"
          >
            <div className="w-8 h-8 rounded-xl bg-rausch flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <span className="font-bold text-sm tracking-tight">S</span>
            </div>
            <div>
              <span className="text-title-md font-bold text-ink tracking-tight block leading-none">
                StallSetu
              </span>
              <span className="text-[10px] text-muted tracking-wide uppercase font-semibold">
                Exhibitions India
              </span>
            </div>
          </button>

          {/* Airbnb 3-Segment Search Pill */}
          <div className="flex-1 max-w-lg hidden sm:block">
            <SearchPill
              selectedCity={selectedCity}
              selectedCategory={selectedCategory}
              maxBudget={maxBudget}
              onOpenFilter={() => setIsFilterOpen(true)}
            />
          </div>

          {/* Action Utilities (Wishlist & My Enquiries) */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Wishlist filter toggle */}
            <button
              onClick={() => setWishlistOnly(prev => !prev)}
              className={`h-9 px-3.5 rounded-full border text-caption flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm ${
                wishlistOnly
                  ? 'border-rausch bg-rausch/10 text-rausch font-bold'
                  : 'border-hairline bg-white hover:border-ink hover:bg-surface-soft text-ink font-semibold'
              }`}
              title="Saved Events"
            >
              <Heart
                size={14}
                className={wishlistOnly ? 'fill-rausch text-rausch' : 'text-zinc-700'}
              />
              <span className="hidden sm:inline">Saved</span>
              {store.wishlistIds.length > 0 && (
                <span className="text-[11px] font-bold">({store.wishlistIds.length})</span>
              )}
            </button>

            {/* My Enquiries Button */}
            <button
              onClick={() => setCurrentScreen('my_enquiries')}
              className="h-9 px-4 rounded-full bg-ink text-white hover:bg-black font-bold text-caption flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <ClipboardList size={14} />
              <span>My Enquiries</span>
              {store.enquiries.length > 0 && (
                <span className="bg-rausch text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {store.enquiries.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Pill (Below logo on small screens) */}
        <div className="sm:hidden pt-3">
          <SearchPill
            selectedCity={selectedCity}
            selectedCategory={selectedCategory}
            maxBudget={maxBudget}
            onOpenFilter={() => setIsFilterOpen(true)}
          />
        </div>
      </header>

      {/* Category Strip */}
      <CategoryStrip
        activeCategory={selectedCategory}
        onSelectCategory={cat => setSelectedCategory(cat)}
      />

      {/* =========================================================================
          EVENT CARDS FEED
         ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        {/* Feed Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-display-sm font-bold text-ink">
              {wishlistOnly
                ? 'Your Saved Events'
                : selectedCity === 'all'
                ? 'Curated Exhibitions & Flea Markets'
                : `Exhibitions in ${selectedCity}`}
            </h2>
            <p className="text-body-sm text-muted">
              {filteredEvents.length}{' '}
              {filteredEvents.length === 1 ? 'event opportunity' : 'event opportunities'}{' '}
              available across India
            </p>
          </div>

          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-hairline bg-white hover:border-ink hover:bg-surface-soft text-caption font-bold text-ink transition-all active:scale-95 cursor-pointer shadow-sm ${
              selectedCity !== 'all' || selectedCategory !== 'all' || maxBudget < 100000 || onlyAvailable
                ? 'border-ink bg-surface-soft ring-1 ring-ink'
                : ''
            }`}
          >
            <Filter size={14} />
            <span>Filters</span>
            {(selectedCity !== 'all' || selectedCategory !== 'all' || maxBudget < 100000 || onlyAvailable) && (
              <span className="w-2 h-2 rounded-full bg-rausch" />
            )}
          </button>
        </div>

        {/* Event Cards Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-surface-soft/60 rounded-2xl border-2 border-dashed border-hairline p-8 space-y-3">
            <h3 className="text-title-md font-bold text-ink">
              {wishlistOnly ? 'No saved exhibitions yet' : 'No exhibitions match your criteria'}
            </h3>
            <p className="text-body-sm text-muted max-w-md mx-auto">
              {wishlistOnly
                ? 'Tap the heart icon on any exhibition card to save it for quick reference.'
                : 'Try adjusting your city, raising your budget threshold, or clearing selected categories.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-2 px-6 py-3 rounded-xl bg-ink text-white text-body-sm font-bold shadow-sm hover:bg-black transition-all active:scale-95 cursor-pointer"
            >
              {wishlistOnly ? 'Explore All Exhibitions' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isWishlisted={store.wishlistIds.includes(event.id)}
                onToggleWishlist={store.toggleWishlist}
                onSelectEvent={handleSelectEvent}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-hairline bg-surface-soft/40 py-8 px-4 sm:px-8 mt-12 text-caption-sm text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 StallSetu · Adaptive Intellect Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span>·</span>
            <span className="hover:underline cursor-pointer">Exhibitor Guidelines</span>
          </div>
        </div>
      </footer>

      {/* Filter Bottom Sheet */}
      <FilterSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCity={selectedCity}
        onSelectCity={city => setSelectedCity(city)}
        selectedCategory={selectedCategory}
        onSelectCategory={cat => setSelectedCategory(cat)}
        maxBudget={maxBudget}
        onSelectMaxBudget={b => setMaxBudget(b)}
        onlyAvailable={onlyAvailable}
        onToggleOnlyAvailable={() => setOnlyAvailable(prev => !prev)}
        totalFilteredCount={filteredEvents.length}
        onReset={handleResetFilters}
      />
    </div>
  );
}
