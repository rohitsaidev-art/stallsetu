import React, { useState } from 'react';
import { ArrowLeft, Check, Sparkles, Trash2, Upload } from 'lucide-react';
import type { Event, Stall, VendorBrand } from '../../data/types';

interface BrandProfileFormProps {
  event: Event;
  stall: Stall;
  savedProfile: VendorBrand | null;
  onClearSavedProfile: () => void;
  onBack: () => void;
  onProceedToReview: (brand: VendorBrand, message: string) => void;
}

const MUST_HAVES_OPTIONS = [
  'Power Outlet (16A Heavy)',
  'Power Outlet (5A Standard)',
  'Corner / High-Footfall Position',
  'Near Main Entrance',
  'Water Access Point',
  'Natural Daylighting',
  'No Adjacent Competing Brands',
  'End of Aisle',
];

export function BrandProfileForm({
  event,
  stall,
  savedProfile,
  onClearSavedProfile,
  onBack,
  onProceedToReview,
}: BrandProfileFormProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [wasAutofilled, setWasAutofilled] = useState<boolean>(Boolean(savedProfile));

  // Form state initialized with savedProfile or empty
  const [name, setName] = useState(savedProfile?.name || '');
  const [category, setCategory] = useState(savedProfile?.category || 'Fashion');
  const [description, setDescription] = useState(savedProfile?.description || '');
  const [contactPerson, setContactPerson] = useState(savedProfile?.contactPerson || '');
  const [phone, setPhone] = useState(savedProfile?.phone || '+91');
  const [email, setEmail] = useState(savedProfile?.email || '');
  const [instagram, setInstagram] = useState(savedProfile?.instagram || '');
  const [avgProductPrice, setAvgProductPrice] = useState(
    savedProfile?.avgProductPrice || '₹500–₹2,500'
  );
  const [mustHaves, setMustHaves] = useState<string[]>(
    savedProfile?.mustHaves || ['Power Outlet (5A Standard)']
  );
  const [message, setMessage] = useState(
    `We would love to participate in ${event.name} with Stall ${stall.label}. Our brand has participated in 3 flea markets in South India and we cater directly to your visitor demographic.`
  );
  const [photos] = useState<string[]>(
    savedProfile?.productPhotos?.length
      ? savedProfile.productPhotos
      : [
          'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80',
          'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80',
        ]
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClear = () => {
    onClearSavedProfile();
    setWasAutofilled(false);
    setName('');
    setDescription('');
    setContactPerson('');
    setPhone('+91');
    setEmail('');
    setInstagram('');
    setMustHaves([]);
  };

  const toggleMustHave = (item: string) => {
    setMustHaves(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!name.trim()) errs.name = 'Brand name is required';
      if (!description.trim()) errs.description = 'Please provide a brief brand description';
    } else if (step === 2) {
      if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required';
      if (!phone.trim() || phone === '+91') errs.phone = 'WhatsApp number is required';
      if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateAll = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Brand name is required';
    if (!description.trim()) errs.description = 'Please provide a brief brand description';
    if (!contactPerson.trim()) errs.contactPerson = 'Contact person is required';
    if (!phone.trim() || phone === '+91') errs.phone = 'WhatsApp number is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email is required';
    setErrors(errs);
    if (errs.name || errs.description) {
      setCurrentStep(1);
      return false;
    }
    if (errs.contactPerson || errs.phone || errs.email) {
      setCurrentStep(2);
      return false;
    }
    return true;
  };

  const handleFinish = () => {
    if (validateAll()) {
      const brand: VendorBrand = {
        name,
        category,
        description,
        contactPerson,
        phone,
        email,
        instagram,
        avgProductPrice,
        stallBudget: `₹${stall.price.toLocaleString('en-IN')}`,
        mustHaves,
        productPhotos: photos,
      };
      onProceedToReview(brand, message);
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong text-caption font-bold text-ink shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Cancel & Exit</span>
          </button>
          <div className="text-right">
            <p className="text-title-sm font-bold text-ink">
              Stall {stall.label} · ₹{stall.price.toLocaleString('en-IN')}
            </p>
            <p className="text-caption-sm text-muted font-medium">{event.name}</p>
          </div>
        </div>

        {/* BD-1: Autofill Banner with Opt-Out Clear Button */}
        {wasAutofilled && (
          <div className="bg-blue-50 border border-blue-200 rounded-airbnb-card p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <Sparkles size={18} className="text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-caption font-bold text-blue-950">
                  Autofilled from your saved brand profile
                </p>
                <p className="text-caption-sm text-blue-800 font-medium">
                  You can edit any details or clear to start with a blank form
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-caption font-bold text-blue-700 hover:text-blue-950 underline flex items-center gap-1.5 flex-shrink-0 cursor-pointer transition-colors active:scale-95"
            >
              <Trash2 size={13} /> Clear & Start Fresh
            </button>
          </div>
        )}

        {/* Stepper Progress & Label */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-caption-sm font-semibold text-muted">
              Step {currentStep} of 4: {['Brand Basics', 'Contact Details', 'Must-Haves & Budget', 'Photos & Notes'][currentStep - 1]}
            </span>
            <span className="text-caption-sm font-bold text-ink tabular-nums">
              {Math.round((currentStep / 4) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-surface-soft h-2 rounded-full overflow-hidden border border-hairline-soft">
            <div
              className="bg-rausch h-full transition-all duration-300 ease-out"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Body Cards */}
        <div className="bg-white border border-hairline rounded-airbnb-sheet p-6 sm:p-8 shadow-airbnb space-y-6">
          {/* STEP 1: Brand Basics */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-display-sm font-bold text-ink">Brand Identity</h3>
                <p className="text-body-sm text-muted">
                  How should your brand appear to the exhibition organizer?
                </p>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Brand Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Indigo Threads Co."
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className={`w-full h-12 px-4 rounded-airbnb-md border bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors ${
                    errors.name ? 'border-error-text' : 'border-hairline hover:border-hairline-dark'
                  }`}
                />
                {errors.name && (
                  <p className="text-caption-sm text-error-text mt-1 font-medium">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full h-12 px-4 rounded-airbnb-md border border-hairline hover:border-hairline-dark bg-white text-body-md text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors cursor-pointer"
                >
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Jewellery">Contemporary & Traditional Jewellery</option>
                  <option value="Food & Beverage">Food, Beverages & Bakery</option>
                  <option value="Art & Craft">Art, Craft & Prints</option>
                  <option value="Lifestyle">Home Decor & Lifestyle</option>
                  <option value="Wellness">Beauty & Organic Wellness</option>
                </select>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Short Brand Bio *
                </label>
                <textarea
                  rows={3}
                  placeholder="What products do you make? What materials or craft techniques do you use?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className={`w-full p-4 rounded-airbnb-md border bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors resize-none ${
                    errors.description ? 'border-error-text' : 'border-hairline hover:border-hairline-dark'
                  }`}
                />
                {errors.description && (
                  <p className="text-caption-sm text-error-text mt-1 font-medium">{errors.description}</p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Contact Details */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-display-sm font-bold text-ink">Contact Details</h3>
                <p className="text-body-sm text-muted">
                  The organizer will follow up directly on WhatsApp regarding payment and allotment.
                </p>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Contact Person *
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  className={`w-full h-12 px-4 rounded-airbnb-md border bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors ${
                    errors.contactPerson ? 'border-error-text' : 'border-hairline hover:border-hairline-dark'
                  }`}
                />
                {errors.contactPerson && (
                  <p className="text-caption-sm text-error-text mt-1 font-medium">{errors.contactPerson}</p>
                )}
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  WhatsApp Number *
                </label>
                <input
                  type="text"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className={`w-full h-12 px-4 rounded-airbnb-md border bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors ${
                    errors.phone ? 'border-error-text' : 'border-hairline hover:border-hairline-dark'
                  }`}
                />
                {errors.phone && (
                  <p className="text-caption-sm text-error-text mt-1 font-medium">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-caption-sm font-bold text-ink block mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="brand@domain.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={`w-full h-12 px-4 rounded-airbnb-md border bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors ${
                      errors.email ? 'border-error-text' : 'border-hairline hover:border-hairline-dark'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-caption-sm text-error-text mt-1 font-medium">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-caption-sm font-bold text-ink block mb-1.5">
                    Instagram Handle (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="@yourbrand"
                    value={instagram}
                    onChange={e => setInstagram(e.target.value)}
                    className="w-full h-12 px-4 rounded-airbnb-md border border-hairline hover:border-hairline-dark bg-white text-body-md text-ink placeholder:text-muted-soft focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Must Haves & Pricing */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-display-sm font-bold text-ink">Pricing & Stall Must-Haves</h3>
                <p className="text-body-sm text-muted">
                  Helps the organizer determine whether your products fit their audience.
                </p>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Average Product Price Range
                </label>
                <select
                  value={avgProductPrice}
                  onChange={e => setAvgProductPrice(e.target.value)}
                  className="w-full h-12 px-4 rounded-airbnb-md border border-hairline hover:border-hairline-dark bg-white text-body-md text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors cursor-pointer"
                >
                  <option value="Under ₹500">Under ₹500 (Affordable)</option>
                  <option value="₹500–₹2,500">₹500–₹2,500 (Mid-Range Premium)</option>
                  <option value="₹2,500–₹6,000">₹2,500–₹6,000 (Designer / High Ticket)</option>
                  <option value="₹6,000+">₹6,000+ (Luxury / Bespoke)</option>
                </select>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-2">
                  Select Your Stall Must-Haves
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {MUST_HAVES_OPTIONS.map(opt => {
                    const isChecked = mustHaves.includes(opt);
                    return (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => toggleMustHave(opt)}
                        className={`flex items-center gap-3 p-3.5 rounded-airbnb-card border text-left text-body-sm transition-all active:scale-[0.98] cursor-pointer ${
                          isChecked
                            ? 'border-ink bg-surface-soft font-bold text-ink shadow-sm'
                            : 'border-hairline hover:bg-surface-soft hover:border-hairline-dark text-ink font-semibold'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-airbnb-xs border flex items-center justify-center transition-colors flex-shrink-0 ${
                            isChecked ? 'bg-ink border-ink text-white' : 'border-hairline-dark bg-white'
                          }`}
                        >
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span className="text-[13px]">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Product Photos & Note */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-display-sm font-bold text-ink">Photos & Message</h3>
                <p className="text-body-sm text-muted">
                  Show your past stall setup or best-selling product samples.
                </p>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-2">
                  Product / Stall Photos ({photos.length} uploaded)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-airbnb-card overflow-hidden bg-surface-soft border border-hairline relative group shadow-sm"
                    >
                      <img src={url} alt="Product" className="w-full h-full object-cover" />
                    </div>
                  ))}
                  <div className="aspect-square rounded-airbnb-card border border-dashed border-hairline-dark bg-surface-soft hover:bg-surface-strong hover:border-ink flex flex-col items-center justify-center text-muted hover:text-ink cursor-pointer transition-all active:scale-95">
                    <Upload size={20} className="mb-1 text-ink" />
                    <span className="text-caption-sm font-bold text-ink">+ Add Photo</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-caption-sm font-bold text-ink block mb-1.5">
                  Message to Organizer
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  className="w-full p-4 rounded-airbnb-md border border-hairline hover:border-hairline-dark bg-white text-body-md text-ink focus:outline-none focus:border-ink focus:ring-1 focus:ring-ink transition-colors resize-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-5 border-t border-hairline flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-airbnb-card border border-hairline bg-white hover:bg-surface-soft active:bg-surface-strong text-button-sm font-bold text-ink transition-all active:scale-[0.98] cursor-pointer shadow-sm"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-8 py-3 rounded-airbnb-card bg-ink hover:bg-black active:bg-ink text-white text-button-sm font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-8 py-3 rounded-airbnb-card bg-rausch hover:bg-rausch-hover active:bg-rausch-active text-white text-button-sm font-bold shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                Review Enquiry →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
