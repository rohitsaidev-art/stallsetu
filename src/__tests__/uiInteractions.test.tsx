import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('StallSetu End-to-End Interactive Flow & Button Tests (ECC Stage 2)', () => {
  it('E2E-001: Discovery screen renders header, search pill, category strip, and event cards', () => {
    render(<App />);

    // Brand logo
    expect(screen.getByText('StallSetu')).toBeInTheDocument();

    // 3-Segment search pill
    expect(screen.getAllByText('Anywhere in India')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Any Category')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Any Budget')[0]).toBeInTheDocument();

    // Event cards present
    expect(screen.getByText('Sunday Soul Santé Bengaluru')).toBeInTheDocument();
    expect(screen.getByText('Hyderabad Flea Affair')).toBeInTheDocument();
  });

  it('E2E-002: FilterSheet opens, toggles cities & categories with deselection, budget presets, and resets', () => {
    render(<App />);

    // Open filter sheet via Search Pill
    const searchPills = screen.getAllByLabelText('Open event search and filters');
    fireEvent.click(searchPills[0]);

    // Modal is open
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();

    // Select Delhi NCR chip
    const delhiChip = screen.getByRole('button', { name: 'Delhi NCR' });
    fireEvent.click(delhiChip);

    // Delhi NCR is selected, Reset city button appears
    expect(screen.getByRole('button', { name: 'Reset city' })).toBeInTheDocument();

    // Clicking Delhi NCR again deselects it back to all
    fireEvent.click(delhiChip);
    expect(screen.queryByRole('button', { name: 'Reset city' })).not.toBeInTheDocument();

    // Test quick budget preset chip
    const budget25k = screen.getByRole('button', { name: 'Under ₹25k' });
    fireEvent.click(budget25k);
    expect(screen.getAllByText(/25,000/)[0]).toBeInTheDocument();

    // Test toggle switch for Available Stalls Only
    const toggleSwitch = screen.getByRole('switch');
    expect(toggleSwitch).toHaveAttribute('aria-checked', 'false');
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toHaveAttribute('aria-checked', 'true');

    // Test "Clear all" button
    const clearAll = screen.getByRole('button', { name: 'Clear all' });
    fireEvent.click(clearAll);
    expect(toggleSwitch).toHaveAttribute('aria-checked', 'false');

    // Close the filter sheet via close X button
    const closeBtn = screen.getByLabelText('Close filters');
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('heading', { name: 'Filters' })).not.toBeInTheDocument();
  });

  it('E2E-003: CategoryStrip toggles category filter and deselection back to all', () => {
    render(<App />);

    // Click 'Fashion & Apparel' in category strip
    const fashionTab = screen.getByRole('button', { name: /Fashion & Apparel/i });
    fireEvent.click(fashionTab);

    // Click it again to deselect
    fireEvent.click(fashionTab);
  });

  it('E2E-004: Wishlist toggle updates saved events count and filter', () => {
    render(<App />);

    // Find first wishlist button
    const wishlistBtns = screen.getAllByLabelText('Save to wishlist');
    expect(wishlistBtns.length).toBeGreaterThan(0);

    // Save first event
    fireEvent.click(wishlistBtns[0]);

    // Header saved button shows (1)
    expect(screen.getByText('(1)')).toBeInTheDocument();

    // Toggle saved filter
    const savedFilterBtn = screen.getByTitle('Saved Events');
    fireEvent.click(savedFilterBtn);

    expect(screen.getByText('Your Saved Events')).toBeInTheDocument();

    // Toggle saved filter off
    fireEvent.click(savedFilterBtn);
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();
  });

  it('E2E-005: EventDetail flow, modal popups (Gallery, Floor Plan, Reviews), FAQs, and stall selection', () => {
    render(<App />);

    // Click on Sunday Soul Santé Bengaluru card
    const eventCard = screen.getByText('Sunday Soul Santé Bengaluru');
    fireEvent.click(eventCard);

    // Verified event detail header
    expect(screen.getByRole('heading', { name: 'Sunday Soul Santé Bengaluru' })).toBeInTheDocument();

    // Open ReviewsModal
    const reviewsBtn = screen.getByLabelText('View verified exhibitor reviews');
    fireEvent.click(reviewsBtn);
    expect(screen.getByText(/Verified Reviews/i)).toBeInTheDocument();
    const closeReviewsBtn = screen.getByLabelText('Close reviews');
    fireEvent.click(closeReviewsBtn);

    // Open FloorPlanModal
    const floorPlanBtn = screen.getByRole('button', { name: /Full View/i });
    fireEvent.click(floorPlanBtn);
    expect(screen.getByText('Venue Floor Plan & Allocation')).toBeInTheDocument();
    const closeFloorPlanBtn = screen.getByLabelText('Close floor plan modal');
    fireEvent.click(closeFloorPlanBtn);

    // Open GalleryModal
    const showPhotosBtn = screen.getByRole('button', { name: /Show all photos/i });
    fireEvent.click(showPhotosBtn);
    expect(screen.getByLabelText('Close photo gallery')).toBeInTheDocument();
    const closeGalleryBtn = screen.getByLabelText('Close photo gallery');
    fireEvent.click(closeGalleryBtn);

    // FAQ index 0 is open by default
    expect(screen.getByText(/Stall setup begins on Friday/i)).toBeInTheDocument();
    // Clicking collapses it
    const faqQuestion = screen.getByText(/setup and tear-down window/i);
    fireEvent.click(faqQuestion);
    expect(screen.queryByText(/Stall setup begins on Friday/i)).not.toBeInTheDocument();
    // Clicking re-opens it
    fireEvent.click(faqQuestion);
    expect(screen.getByText(/Stall setup begins on Friday/i)).toBeInTheDocument();

    // Test available stall selection
    const selectStallBtns = screen.getAllByRole('button', { name: 'Select Stall' });
    expect(selectStallBtns.length).toBeGreaterThan(0);
    fireEvent.click(selectStallBtns[0]);

    // Now on Brand Profile Intake Form
    expect(screen.getByText('Brand Identity')).toBeInTheDocument();
  });

  it('E2E-006: BrandProfileForm validation, navigation, must-haves, photos, and review submission', () => {
    render(<App />);

    // Navigate to form by clicking event and selecting a stall
    fireEvent.click(screen.getByText('Sunday Soul Santé Bengaluru'));
    const selectStallBtns = screen.getAllByRole('button', { name: 'Select Stall' });
    fireEvent.click(selectStallBtns[0]);

    // Verify Step 1
    expect(screen.getByText('Step 1 of 4: Brand Basics')).toBeInTheDocument();
    const brandNameInput = screen.getByPlaceholderText('e.g. Indigo Threads Co.');
    fireEvent.change(brandNameInput, { target: { value: 'Loom & Clay Crafts' } });

    const bioInput = screen.getByPlaceholderText(/What products do you make/i);
    fireEvent.change(bioInput, { target: { value: 'Handmade ceramic tableware and natural studio pottery.' } });

    // Click Continue to Step 2
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Verify Step 2
    expect(screen.getByText('Step 2 of 4: Contact Details')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('Your full name'), { target: { value: 'Rohit Dev' } });
    fireEvent.change(screen.getByPlaceholderText('+91 98765 43210'), { target: { value: '+91 98765 43210' } });
    fireEvent.change(screen.getByPlaceholderText('brand@domain.com'), { target: { value: 'rohit@loomandclay.in' } });

    // Click Continue to Step 3
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Verify Step 3: Must-Haves
    expect(screen.getByText('Step 3 of 4: Must-Haves & Budget')).toBeInTheDocument();
    const cornerOption = screen.getByRole('button', { name: /Corner \/ High-Footfall Position/i });
    fireEvent.click(cornerOption);

    // Click Continue to Step 4
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    // Verify Step 4: Photos & Message
    expect(screen.getByText('Step 4 of 4: Photos & Notes')).toBeInTheDocument();
    const addPhotoBtn = screen.getByRole('button', { name: 'Upload photo' });
    expect(addPhotoBtn).toBeInTheDocument();

    // Click Review Enquiry
    fireEvent.click(screen.getByRole('button', { name: 'Review Enquiry →' }));

    // Now on Enquiry Review screen
    expect(screen.getByText('Review Your Stall Enquiry')).toBeInTheDocument();
    expect(screen.getByText('Loom & Clay Crafts')).toBeInTheDocument();

    // Click Final Submit
    const submitBtn = screen.getByRole('button', { name: 'Submit Stall Enquiry' });
    fireEvent.click(submitBtn);

    // Now on Success Screen
    expect(screen.getByText('Enquiry Submitted!')).toBeInTheDocument();

    // Click "Track in My Enquiries"
    fireEvent.click(screen.getByRole('button', { name: /Track in My Enquiries/i }));

    // Now on My Enquiries screen
    expect(screen.getByRole('heading', { name: 'My Stall Enquiries' })).toBeInTheDocument();
    expect(screen.getByText('Loom & Clay Crafts')).toBeInTheDocument();

    // Test Back to Discovery
    fireEvent.click(screen.getByRole('button', { name: /Back to Discovery/i }));
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();
  });

  it('E2E-007: Footer Policy Modals open and close for Privacy, Terms, and Guidelines', () => {
    render(<App />);

    // Click Privacy in footer
    fireEvent.click(screen.getByRole('button', { name: 'Privacy' }));
    expect(screen.getByText('Vendor Privacy Policy')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I Understand' }));
    expect(screen.queryByText('Vendor Privacy Policy')).not.toBeInTheDocument();

    // Click Terms in footer
    fireEvent.click(screen.getByRole('button', { name: 'Terms & Conditions' }));
    expect(screen.getByText('Terms of Stall Enquiry')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I Understand' }));
    expect(screen.queryByText('Terms of Stall Enquiry')).not.toBeInTheDocument();

    // Click Exhibitor Guidelines in footer
    fireEvent.click(screen.getByRole('button', { name: 'Exhibitor Guidelines' }));
    expect(screen.getByText('Exhibitor Code & Guidelines')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'I Understand' }));
    expect(screen.queryByText('Exhibitor Code & Guidelines')).not.toBeInTheDocument();
  });

  it('E2E-008: Grid / List view toggle switches between display modes cleanly', () => {
    render(<App />);

    // Default is Grid view
    expect(screen.getByLabelText('Switch to List View')).toBeInTheDocument();

    // Switch to List view
    fireEvent.click(screen.getByLabelText('Switch to List View'));

    // Check list view specific element (e.g. "Starting from" label or "View Stalls")
    expect(screen.getAllByText('Starting from').length).toBeGreaterThan(0);
    expect(screen.getAllByText('View Stalls').length).toBeGreaterThan(0);

    // Switch back to Grid view
    fireEvent.click(screen.getByLabelText('Switch to Grid View'));
    expect(screen.getAllByText('starts').length).toBeGreaterThan(0);
  });

  it('E2E-009: Sort dropdown selects sorting modes, and ProfileMenu opens and navigates', () => {
    render(<App />);

    // Test Sort Dropdown
    const sortBtn = screen.getByLabelText('Sort exhibitions');
    fireEvent.click(sortBtn);
    expect(screen.getByText('Sort Exhibitions By')).toBeInTheDocument();

    // Select Price: Low to High
    const priceAscOption = screen.getByRole('button', { name: /Price: Low to High/i });
    fireEvent.click(priceAscOption);
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument();

    // Test Profile Menu
    const profileBtn = screen.getByLabelText('User navigation menu');
    fireEvent.click(profileBtn);
    expect(screen.getByText('Help Center & Support')).toBeInTheDocument();
  });
});
