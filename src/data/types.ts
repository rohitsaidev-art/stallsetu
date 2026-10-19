export type StallStatus = 'available' | 'held' | 'booked';
export type EnquiryStatus = 'new' | 'contacted' | 'under_review' | 'approved' | 'paid_outside';
export type EventCategory = 'lifestyle' | 'fashion' | 'food' | 'art' | 'jewellery' | 'wellness' | 'mixed';

export interface Stall {
  id: string;
  label: string; // e.g. "A-12"
  size: string; // e.g. "3m × 3m"
  price: number; // INR
  category: string;
  status: StallStatus;
  amenities: string[]; // e.g. ["Power 16A", "1 Table + 2 Chairs", "WiFi Access"]
  enquiryId?: string; // locked to this enquiry when held/booked
}

export interface OrganizerProfile {
  id: string;
  name: string;
  organization: string;
  avatar: string;
  phone: string;
  email: string;
  eventsHosted: number;
  verified: boolean;
  rating: number; // e.g. 4.9
  reviewCount: number;
}

export type Organizer = OrganizerProfile;

export interface EventFAQ {
  q: string;
  a: string;
}

export interface Event {
  id: string;
  name: string;
  venue: string;
  address: string;
  city: string;
  startDate: string;
  endDate: string;
  category: EventCategory;
  coverImage: string;
  photos: string[]; // 4+ photos for the 2x2 grid
  totalStalls: number;
  stalls: Stall[];
  organizer: OrganizerProfile;
  description: string;
  footfall: string; // e.g. "12,000–15,000 visitors"
  timings: string; // e.g. "11:00 AM – 10:00 PM"
  floorPlanImage: string; // Venue blueprint URL
  includedAmenities: string[]; // General venue perks
  faqs: EventFAQ[];
  badgeType?: 'trending' | 'favourite' | 'fast_filling';
}

export interface VendorBrand {
  name: string;
  category: string;
  description: string;
  contactPerson: string;
  phone: string;
  email: string;
  instagram?: string;
  avgProductPrice: string; // e.g. "₹500–₹2,500"
  stallBudget: string; // e.g. "₹20,000–₹40,000"
  mustHaves: string[]; // e.g. ["Power outlet (16A)", "Corner position"]
  productPhotos: string[]; // image URLs
}

export interface Enquiry {
  id: string;
  eventId: string;
  stallId: string;
  vendorBrand: VendorBrand;
  status: EnquiryStatus;
  submittedAt: string;
  updatedAt: string;
  notes?: string;
  preferredSize: string;
  message: string;
}
