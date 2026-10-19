import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, ClipboardList, Heart, ShieldCheck, HelpCircle } from 'lucide-react';

interface ProfileMenuProps {
  enquiryCount: number;
  wishlistCount: number;
  onOpenMyEnquiries: () => void;
  onOpenWishlist: () => void;
  onOpenGuidelines: () => void;
}

export function ProfileMenu({
  enquiryCount,
  wishlistCount,
  onOpenMyEnquiries,
  onOpenWishlist,
  onOpenGuidelines,
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Iconic Airbnb User Menu Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="h-10 px-3.5 rounded-full border border-hairline bg-white hover:shadow-md transition-all duration-150 active:scale-95 flex items-center gap-2.5 cursor-pointer shadow-sm"
        aria-label="User navigation menu"
      >
        <Menu size={16} strokeWidth={2} className="text-ink" />
        <div className="w-7 h-7 rounded-full bg-zinc-700 text-white flex items-center justify-center flex-shrink-0">
          <User size={15} strokeWidth={2.2} />
        </div>
        {enquiryCount > 0 && (
          <span
            className="w-2.5 h-2.5 rounded-full ring-2 ring-white"
            style={{ backgroundColor: '#FF385C' }}
          />
        )}
      </button>

      {/* Airbnb Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-hairline shadow-airbnb-modal z-40 py-2 divide-y divide-zinc-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onOpenMyEnquiries();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left flex items-center justify-between text-caption font-semibold text-ink hover:bg-surface-soft transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ClipboardList size={16} className="text-muted" />
                <span>My Enquiries</span>
              </div>
              {enquiryCount > 0 && (
                <span
                  className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums"
                  style={{ backgroundColor: '#FF385C' }}
                >
                  {enquiryCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                onOpenWishlist();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left flex items-center justify-between text-caption font-semibold text-ink hover:bg-surface-soft transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Heart size={16} className="text-muted" />
                <span>Saved Events</span>
              </div>
              {wishlistCount > 0 && (
                <span className="text-rausch text-[11px] font-bold tabular-nums">
                  ({wishlistCount})
                </span>
              )}
            </button>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={() => {
                onOpenGuidelines();
                setIsOpen(false);
              }}
              className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-caption text-body hover:bg-surface-soft transition-colors cursor-pointer"
            >
              <ShieldCheck size={16} className="text-muted" />
              <span>Exhibitor Guidelines</span>
            </button>

            <a
              href="https://wa.me/918106143304"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2.5 text-left flex items-center gap-2.5 text-caption text-body hover:bg-surface-soft transition-colors cursor-pointer"
            >
              <HelpCircle size={16} className="text-muted" />
              <span>Help Center & Support</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
