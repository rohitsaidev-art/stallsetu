import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('StallSetu Vendor Interactive Flows & State Machine', () => {
  beforeEach(() => {
    window.localStorage?.clear();
  });

  it('1. Discovery Feed: Wishlist heart click toggles state without navigating to Event Detail', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Check we are on Discovery Screen
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();

    // Verify Saved badge starts at (1) from seed wishlist
    const savedButton = screen.getByTitle('Saved Events');
    expect(savedButton).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();

    // Find wishlist heart button for un-wishlisted card
    const saveButtons = screen.getAllByLabelText(/Save to wishlist/i);
    expect(saveButtons.length).toBeGreaterThan(0);

    // Click heart to save second event
    await user.click(saveButtons[0]);

    // Saved count should now show (2)
    expect(screen.getByText('(2)')).toBeInTheDocument();

    // Should STILL be on Discovery screen (didn't navigate to Event Detail)
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();

    // Untoggle by clicking Remove from wishlist
    const removeButtons = screen.getAllByLabelText(/Remove from wishlist/i);
    await user.click(removeButtons[removeButtons.length - 1]);
    expect(screen.getByText('(1)')).toBeInTheDocument();

    // Click saved toggle button to filter by wishlist
    await user.click(savedButton);
    expect(screen.getByText('Your Saved Events')).toBeInTheDocument();

    // Untoggle
    await user.click(savedButton);
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();
  });

  it('2. Filter Sheet: Opens, updates filters, and updates exhibition count', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Filters button in feed header
    const filtersBtns = screen.getAllByRole('button', { name: /Filters/i });
    await user.click(filtersBtns[0]);

    // Modal should be open
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();

    // Select Bengaluru city pill
    const blrBtn = screen.getByRole('button', { name: 'Bengaluru' });
    await user.click(blrBtn);

    // Click "Show X Exhibitions"
    const applyBtn = screen.getByRole('button', { name: /Show \d+ Exhibition/i });
    await user.click(applyBtn);

    // Modal should be closed and feed updated
    expect(screen.getByText('Exhibitions in Bengaluru')).toBeInTheDocument();
  });

  it('3. Event Detail & Modals: Navigation, Lightboxes (Gallery & Floor Plan), and Category Filter', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click on Sunday Soul Santé event card
    const eventCardTitle = screen.getByText('Sunday Soul Santé Bengaluru');
    await user.click(eventCardTitle);

    // We should now be on EventDetail
    expect(screen.getByText('Hosted by Aishwarya Tirumala')).toBeInTheDocument();
    expect(screen.getByText('Venue Floor Plan')).toBeInTheDocument();

    // Test Gallery Modal
    const showAllPhotosBtn = screen.getByRole('button', { name: /Show all photos/i });
    await user.click(showAllPhotosBtn);
    expect(screen.getByLabelText('Close photo gallery')).toBeInTheDocument();

    // Close Gallery Modal
    await user.click(screen.getByLabelText('Close photo gallery'));
    expect(screen.queryByLabelText('Close photo gallery')).not.toBeInTheDocument();

    // Test Floor Plan Lightbox Modal
    const fullViewBtn = screen.getByRole('button', { name: /Full View/i });
    await user.click(fullViewBtn);
    expect(screen.getByText('Venue Floor Plan & Allocation')).toBeInTheDocument();

    // Close Floor Plan Modal
    await user.click(screen.getByLabelText('Close floor plan modal'));
    expect(screen.queryByText('Venue Floor Plan & Allocation')).not.toBeInTheDocument();

    // Test Stall Category Filters
    const foodCatPill = screen.getByRole('button', { name: 'Food & Beverage' });
    await user.click(foodCatPill);
    expect(screen.getByText('Stall A-03')).toBeInTheDocument();
  });

  it('4. Complete End-to-End Flow: Stall Selection -> 4-Step Form Validation -> Review -> Success -> My Enquiries', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Navigate to Event Detail
    await user.click(screen.getByText('Sunday Soul Santé Bengaluru'));

    // Filter to available Food stall A-03
    await user.click(screen.getByRole('button', { name: 'Food & Beverage' }));
    
    // Select Stall A-03 (the first "Select Stall" button in the inventory)
    const selectStallBtns = screen.getAllByRole('button', { name: 'Select Stall' });
    await user.click(selectStallBtns[0]);

    // We should now be on BrandProfileForm Step 1 with Autofill active
    expect(screen.getByText(/Step 1 of 4: Brand Basics/i)).toBeInTheDocument();
    expect(screen.getByText(/Autofilled from your saved brand profile/i)).toBeInTheDocument();

    // Click "Clear & Start Fresh" to test BD-1 opt-out
    const clearBtn = screen.getByRole('button', { name: /Clear & Start Fresh/i });
    await user.click(clearBtn);

    // Try continuing without required fields
    const continueBtn = screen.getByRole('button', { name: /Continue/i });
    await user.click(continueBtn);
    expect(screen.getByText('Brand name is required')).toBeInTheDocument();

    // Fill Step 1
    const nameInput = screen.getByPlaceholderText('e.g. Indigo Threads Co.');
    await user.type(nameInput, 'Artisan Roasters');
    const bioInput = screen.getByPlaceholderText(/What products do you make/i);
    await user.type(bioInput, 'Specialty pour-over coffee, cold brews, and artisanal coffee beans.');

    // Proceed to Step 2
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/Step 2 of 4: Contact Details/i)).toBeInTheDocument();

    // Try continuing without contact fields
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText('Contact person is required')).toBeInTheDocument();

    // Fill Step 2
    await user.type(screen.getByPlaceholderText('Your full name'), 'Rohan Verma');
    const phoneInput = screen.getByPlaceholderText('+91 98765 43210');
    fireEvent.change(phoneInput, { target: { value: '+91 98450 11223' } });
    await user.type(screen.getByPlaceholderText('brand@domain.com'), 'rohan@artisanroasters.in');

    // Proceed to Step 3
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/Step 3 of 4: Must-Haves & Budget/i)).toBeInTheDocument();

    // Toggle Must-Haves
    const waterMustHave = screen.getByRole('button', { name: /Water Access Point/i });
    await user.click(waterMustHave);

    // Proceed to Step 4
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByText(/Step 4 of 4: Photos & Notes/i)).toBeInTheDocument();

    // Click "Review Enquiry →"
    const reviewBtn = screen.getByRole('button', { name: /Review Enquiry/i });
    await user.click(reviewBtn);

    // We should now be on EnquiryReview
    expect(screen.getByText('Review Your Stall Enquiry')).toBeInTheDocument();
    expect(screen.getByText('Artisan Roasters')).toBeInTheDocument();
    expect(screen.getByText('Stall A-03')).toBeInTheDocument();
    expect(screen.getByText('₹38,000')).toBeInTheDocument();

    // Submit Enquiry
    const submitBtn = screen.getByRole('button', { name: 'Submit Stall Enquiry' });
    await user.click(submitBtn);

    // We should now be on SuccessScreen
    expect(screen.getByText('Enquiry Submitted!')).toBeInTheDocument();
    expect(screen.getByText('Held (Lock Applied)')).toBeInTheDocument();

    // Click Track in My Enquiries
    const trackBtn = screen.getByRole('button', { name: /Track in My Enquiries/i });
    await user.click(trackBtn);

    // We should now be on MyEnquiries
    expect(screen.getByText('My Stall Enquiries')).toBeInTheDocument();
    expect(screen.getByText('Artisan Roasters')).toBeInTheDocument();
    expect(screen.getByText('Stall A-03')).toBeInTheDocument();

    // Back to Discovery
    const backToDiscBtn = screen.getByRole('button', { name: /Back to Discovery/i });
    await user.click(backToDiscBtn);
    expect(screen.getByText('Curated Exhibitions & Flea Markets')).toBeInTheDocument();
  });

  it('5. Escape Key & Backdrop dismissals for Modals (FilterSheet, GalleryModal, FloorPlanModal)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open Filter Sheet
    const filtersBtns = screen.getAllByRole('button', { name: /Filters/i });
    await user.click(filtersBtns[0]);
    expect(screen.getByRole('heading', { name: 'Filters' })).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByRole('heading', { name: 'Filters' })).not.toBeInTheDocument();

    // Navigate to Event Detail
    await user.click(screen.getByText('Sunday Soul Santé Bengaluru'));

    // Open Gallery Modal
    await user.click(screen.getByRole('button', { name: /Show all photos/i }));
    expect(screen.getByLabelText('Close photo gallery')).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByLabelText('Close photo gallery')).not.toBeInTheDocument();

    // Open Floor Plan Modal
    await user.click(screen.getByRole('button', { name: /Full View/i }));
    expect(screen.getByText('Venue Floor Plan & Allocation')).toBeInTheDocument();

    // Press Escape to dismiss
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(screen.queryByText('Venue Floor Plan & Allocation')).not.toBeInTheDocument();
  });

  it('6. My Enquiries Pipeline: Tab Filtering (All, Active Pipeline, Confirmed)', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click My Enquiries button in top header
    const myEnqBtn = screen.getByRole('button', { name: /My Enquiries/i });
    await user.click(myEnqBtn);

    expect(screen.getByText('My Stall Enquiries')).toBeInTheDocument();

    // Click Confirmed tab
    const confirmedTab = screen.getByRole('button', { name: /Confirmed/i });
    await user.click(confirmedTab);

    // Verify only confirmed booking cards appear (e.g. Indigo Threads Co. which has status paid_outside)
    expect(screen.getByText('Indigo Threads Co.')).toBeInTheDocument();

    // Click Active Pipeline tab
    const activeTab = screen.getByRole('button', { name: /Active Pipeline/i });
    await user.click(activeTab);
    expect(screen.queryByText('Indigo Threads Co.')).not.toBeInTheDocument();

    // Click All tab
    const allTab = screen.getByRole('button', { name: /^All/i });
    await user.click(allTab);
    expect(screen.getByText('Indigo Threads Co.')).toBeInTheDocument();
  });
});
