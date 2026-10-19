import React, { useState, useMemo } from 'react';
import { Heart, ClipboardList, Filter, LayoutGrid, List } from 'lucide-react';
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
import { PolicyModal, type PolicyType } from './components/vendor/PolicyModal';
import { SortDropdown, type SortOption } from './components/vendor/SortDropdown';
import { ProfileMenu } from './components/vendor/ProfileMenu';

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

  // Policy Modal state
  const [activePolicy, setActivePolicy] = useState<PolicyType>(null);

  // In-progress Enquiry draft state
  const [draftBrand, setDraftBrand] = useState<VendorBrand | null>(null);
  const [draftMessage, setDraftMessage] = useState<string>('');
  const [lastSubmittedId, setLastSubmittedId] = useState<string>('');

  // View Mode: Grid vs List
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Sorting State
  const [currentSort, setCurrentSort] = useState<SortOption>('recommended');

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [maxBudget, setMaxBudget] = useState(100000);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);

  // Filtered & Sorted Events
  const filteredEvents = useMemo(() => {
    const list = store.events.filter(event => {
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

    // Apply Sorting
    return [...list].sort((a, b) => {
      const minPriceA = Math.min(...a.stalls.map(s => s.price));
      const minPriceB = Math.min(...b.stalls.map(s => s.price));
      const availA = a.stalls.filter(s => s.status === 'available').length;
      const availB = b.stalls.filter(s => s.status === 'available').length;

      switch (currentSort) {
        case 'price_asc':
          return minPriceA - minPriceB;
        case 'price_desc':
          return minPriceB - minPriceA;
        case 'date_asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'stalls_avail':
          return availB - availA;
        case 'footfall': {
          const footA = parseInt(a.footfall.replace(/[^0-9]/g, '')) || 0;
          const footB = parseInt(b.footfall.replace(/[^0-9]/g, '')) || 0;
          return footB - footA;
        }
        case 'recommended':
        default:
          return 0;
      }
    });
  }, [
    store.events,
    selectedCity,
    selectedCategory,
    maxBudget,
    onlyAvailable,
    wishlistOnly,
    store.wishlistIds,
    currentSort,
  ]);

  const handleResetFilters = () => {
    setSelectedCity('all');
    setSelectedCategory('all');
    setMaxBudget(100000);
    setOnlyAvailable(false);
    setWishlistOnly(false);
    setCurrentSort('recommended');
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
          UNIFIED AIRBNB STICKY HEADER
          Combines logo, search pill, action bar and category strip with solid white
          background to prevent seams, jagged scrolling, and card bleed-throughs.
         ========================================================================= */}
      <div className="sticky top-0 z-30 bg-white border-b border-hairline shadow-[0_2px_10px_rgba(0,0,0,0.04)]">
        {/* Top Navbar */}
        <header className="py-3 px-4 sm:px-8 border-b border-zinc-100">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Left Column: Brand Logo (Anchored width prevents shift) */}
            <div className="w-44 sm:w-56 flex-shrink-0 flex items-center">
              <button
                type="button"
                onClick={() => {
                  handleResetFilters();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2.5 text-left group cursor-pointer active:scale-95 transition-transform"
                aria-label="StallSetu Home"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 flex-shrink-0"
                  style={{ backgroundColor: '#FF385C', color: '#FFFFFF' }}
                >
                  <span className="font-extrabold text-sm tracking-tight text-white">S</span>
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
            </div>

            {/* Center Column: Airbnb 3-Segment Search Pill */}
            <div className="flex-1 max-w-lg hidden sm:flex justify-center">
              <SearchPill
                selectedCity={selectedCity}
                selectedCategory={selectedCategory}
                maxBudget={maxBudget}
                onOpenFilter={() => setIsFilterOpen(true)}
              />
            </div>

            {/* Right Column: Airbnb Utilities (Saved, My Enquiries, Profile Menu) */}
            <div className="w-44 sm:w-56 flex-shrink-0 flex items-center justify-end gap-2">
              {/* Wishlist filter toggle */}
              <button
                type="button"
                onClick={() => setWishlistOnly(prev => !prev)}
                className={`h-9 px-3 rounded-full border text-caption flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-sm ${
                  wishlistOnly
                    ? 'border-rausch bg-rausch/10 text-rausch font-bold'
                    : 'border-hairline bg-white hover:border-ink hover:bg-surface-soft text-ink font-semibold'
                }`}
                title="Saved Events"
                aria-label="View Saved Events"
              >
                <Heart
                  size={14}
                  className={`transition-colors ${
                    wishlistOnly
                      ? 'fill-rausch text-rausch scale-110'
                      : store.wishlistIds.length > 0
                      ? 'fill-rausch text-rausch'
                      : 'text-zinc-700'
                  }`}
                />
                <span className="hidden sm:inline">Saved</span>
                {store.wishlistIds.length > 0 && (
                  <span className="text-[11px] font-bold text-rausch tabular-nums">
                    ({store.wishlistIds.length})
                  </span>
                )}
              </button>

              {/* My Enquiries Button (Unsquished, perfectly proportioned circular badge) */}
              <button
                type="button"
                onClick={() => setCurrentScreen('my_enquiries')}
                className="h-9 px-3.5 rounded-full font-bold text-caption flex items-center gap-2 shadow-sm transition-all duration-150 active:scale-95 cursor-pointer hover:bg-black"
                style={{ backgroundColor: '#222222', color: '#FFFFFF' }}
                aria-label="View My Enquiries"
              >
                <ClipboardList size={14} className="text-white flex-shrink-0" />
                <span className="text-white hidden lg:inline">My Enquiries</span>
                {store.enquiries.length > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 tabular-nums shadow-sm"
                    style={{ backgroundColor: '#FF385C' }}
                  >
                    {store.enquiries.length}
                  </span>
                )}
              </button>

              {/* Airbnb User Menu Pill */}
              <ProfileMenu
                enquiryCount={store.enquiries.length}
                wishlistCount={store.wishlistIds.length}
                onOpenMyEnquiries={() => setCurrentScreen('my_enquiries')}
                onOpenWishlist={() => setWishlistOnly(true)}
                onOpenGuidelines={() => setActivePolicy('guidelines')}
              />
            </div>
          </div>

          {/* Mobile Search Pill */}
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
      </div>

      {/* =========================================================================
          EVENT CARDS FEED
         ========================================================================= */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8">
        {/* Feed Header with Clean Typography, Sort Dropdown, Filters and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2">
          <div>
            <h2 className="text-display-sm font-bold text-ink">
              {wishlistOnly
                ? 'Your Saved Events'
                : selectedCity === 'all'
                ? 'Curated Exhibitions & Flea Markets'
                : `Exhibitions in ${selectedCity}`}
            </h2>
            <p className="text-body-sm text-muted mt-0.5">
              Explore{' '}
              <span className="font-semibold text-ink">{filteredEvents.length}</span>{' '}
              {filteredEvents.length === 1 ? 'curated opportunity' : 'curated opportunities'}{' '}
              across India
            </p>
          </div>

          {/* Controls Bar: Sort + Filter + Extended View Toggle */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Sort Dropdown */}
            <SortDropdown
              currentSort={currentSort}
              onSelectSort={sort => setCurrentSort(sort)}
            />

            {/* Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setIsFilterOpen(true)}
              className={`flex items-center gap-2 h-9 px-3.5 rounded-full border border-hairline bg-white hover:border-ink hover:bg-surface-soft text-caption font-bold text-ink transition-all active:scale-95 cursor-pointer shadow-sm ${
                selectedCity !== 'all' || selectedCategory !== 'all' || maxBudget < 100000 || onlyAvailable
                  ? 'border-ink bg-surface-soft ring-1 ring-ink'
                  : ''
              }`}
            >
              <Filter size={14} />
              <span>Filters</span>
              {(selectedCity !== 'all' || selectedCategory !== 'all' || maxBudget < 100000 || onlyAvailable) && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#FF385C' }}
                />
              )}
            </button>

            {/* Extended View Mode Toggle (Grid vs List with Icons + Labels) */}
            <div className="flex items-center rounded-full border border-hairline bg-surface-soft p-0.5 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-all duration-150 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
                title="Grid View"
                aria-label="Switch to Grid View"
              >
                <LayoutGrid size={15} />
                <span className="text-[12px] hidden md:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-caption font-semibold transition-all duration-150 cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white text-ink shadow-sm'
                    : 'text-muted hover:text-ink'
                }`}
                title="List View"
                aria-label="Switch to List View"
              >
                <List size={15} />
                <span className="text-[12px] hidden md:inline">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Event Cards Display (Grid vs List) */}
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
              type="button"
              onClick={handleResetFilters}
              className="mt-2 px-6 py-3 rounded-xl bg-ink text-white text-body-sm font-bold shadow-sm hover:bg-black transition-all active:scale-95 cursor-pointer"
            >
              {wishlistOnly ? 'Explore All Exhibitions' : 'Reset All Filters'}
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isWishlisted={store.wishlistIds.includes(event.id)}
                onToggleWishlist={store.toggleWishlist}
                onSelectEvent={handleSelectEvent}
                variant="grid"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                isWishlisted={store.wishlistIds.includes(event.id)}
                onToggleWishlist={store.toggleWishlist}
                onSelectEvent={handleSelectEvent}
                variant="list"
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
            <button
              type="button"
              onClick={() => setActivePolicy('privacy')}
              className="hover:underline hover:text-ink cursor-pointer transition-colors active:scale-95"
            >
              Privacy
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('terms')}
              className="hover:underline hover:text-ink cursor-pointer transition-colors active:scale-95"
            >
              Terms & Conditions
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setActivePolicy('guidelines')}
              className="hover:underline hover:text-ink cursor-pointer transition-colors active:scale-95"
            >
              Exhibitor Guidelines
            </button>
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

      {/* Informational Policy Modal */}
      <PolicyModal
        type={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
}
