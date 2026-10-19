import { useState, useCallback } from 'react';
import { seedEvents, seedEnquiries } from '../data/seed';
import type { Event, Enquiry, EnquiryStatus, StallStatus, VendorBrand } from '../data/types';

export function useStallSetuStore() {
  const [events, setEvents] = useState<Event[]>(seedEvents);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(seedEnquiries);
  
  // BD-1: Saved profile with opt-out
  const [savedBrandProfile, setSavedBrandProfile] = useState<VendorBrand | null>({
    name: 'Chai Wali Co.',
    category: 'Food & Beverage',
    description: 'Artisan handcrafted chai bar and organic blends with zero-plastic setup.',
    contactPerson: 'Shruti Mehta',
    phone: '+919650011122',
    email: 'shruti@chaiwali.co',
    instagram: '@chaiwali.co',
    avgProductPrice: '₹500–₹2,000',
    stallBudget: '₹20,000–₹40,000',
    mustHaves: ['Power outlet (16A)', 'Water access point', 'End of aisle'],
    productPhotos: [
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=300&q=70',
      'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&q=70',
    ],
  });

  // Saved/Wishlisted events (Heart icon)
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  const toggleWishlist = useCallback((eventId: string) => {
    setWishlistIds(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  }, []);

  const clearSavedBrandProfile = useCallback(() => {
    setSavedBrandProfile(null);
  }, []);

  // Update status (e.g. for organizer or simulator)
  const updateEnquiryStatus = useCallback((enquiryId: string, newStatus: EnquiryStatus) => {
    setEnquiries(prev =>
      prev.map(e =>
        e.id === enquiryId ? { ...e, status: newStatus, updatedAt: new Date().toISOString() } : e
      )
    );

    const enquiry = enquiries.find(e => e.id === enquiryId);
    if (!enquiry) return;

    if (newStatus === 'approved' || newStatus === 'paid_outside') {
      const targetStatus: StallStatus = newStatus === 'paid_outside' ? 'booked' : 'held';
      setEvents(prev =>
        prev.map(ev => {
          if (ev.id !== enquiry.eventId) return ev;
          return {
            ...ev,
            stalls: ev.stalls.map(s =>
              s.id === enquiry.stallId ? { ...s, status: targetStatus, enquiryId } : s
            ),
          };
        })
      );
    }
  }, [enquiries]);

  // Submit new enquiry: holds stall immediately!
  const addEnquiry = useCallback((enquiry: Enquiry) => {
    setEnquiries(prev => [enquiry, ...prev]);

    // Save brand profile for future autofill
    setSavedBrandProfile(enquiry.vendorBrand);

    // Lock stall to 'held'
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== enquiry.eventId) return ev;
        return {
          ...ev,
          stalls: ev.stalls.map(s =>
            s.id === enquiry.stallId
              ? { ...s, status: 'held' as StallStatus, enquiryId: enquiry.id }
              : s
          ),
        };
      })
    );
  }, []);

  return {
    events,
    enquiries,
    savedBrandProfile,
    clearSavedBrandProfile,
    wishlistIds,
    toggleWishlist,
    addEnquiry,
    updateEnquiryStatus,
  };
}
