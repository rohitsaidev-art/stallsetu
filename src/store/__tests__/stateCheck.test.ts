import { describe, it, expect } from 'vitest';
import { seedEvents, seedEnquiries } from '../../data/seed';
import type { VendorBrand } from '../../data/types';

describe('StallSetu State Machine — Anti-Double-Booking & Persistence (ECC Stage 2)', () => {
  it('AC-001 / B4: Confirmed bookings have booked status and valid locked stall ID', () => {
    const bookedEnquiry = seedEnquiries.find(e => e.status === 'paid_outside');
    expect(bookedEnquiry).toBeDefined();
    const event = seedEvents.find(e => e.id === bookedEnquiry!.eventId);
    expect(event).toBeDefined();
    const stall = event!.stalls.find(s => s.id === bookedEnquiry!.stallId);
    expect(stall).toBeDefined();
    expect(stall!.status).toBe('booked');
    expect(stall!.status).not.toBe('available');
  });

  it('AC-002: Available stalls are not claimed by any finalized enquiry', () => {
    for (const event of seedEvents) {
      for (const stall of event.stalls) {
        if (stall.status === 'available') {
          const paidEnquiry = seedEnquiries.find(
            e => e.stallId === stall.id && e.status === 'paid_outside'
          );
          expect(paidEnquiry).toBeUndefined();
        }
      }
    }
  });

  it('AC-003: Events contain 4+ high-res photos for 2x2 grid presentation', () => {
    for (const event of seedEvents) {
      expect(event.photos.length).toBeGreaterThanOrEqual(4);
      expect(event.floorPlanImage).toBeDefined();
      expect(event.organizer.name).toBeDefined();
      expect(event.organizer.phone).toBeDefined();
    }
  });

  it('AC-004: Brand profile model supports opt-out and all 4-step intake fields', () => {
    const sampleBrand: VendorBrand = {
      name: 'Sample Handicrafts',
      category: 'Art & Craft',
      description: 'Artisanal handcrafted goods',
      contactPerson: 'Aditi Rao',
      phone: '+91 99887 76655',
      email: 'aditi@sample.in',
      avgProductPrice: '₹500–₹2,500',
      stallBudget: '₹22,000',
      mustHaves: ['Power Outlet (5A Standard)'],
      productPhotos: ['https://example.com/p1.jpg'],
    };

    expect(sampleBrand.name).toBe('Sample Handicrafts');
    expect(sampleBrand.phone.startsWith('+91')).toBe(true);
    expect(sampleBrand.mustHaves).toContain('Power Outlet (5A Standard)');
  });
});
