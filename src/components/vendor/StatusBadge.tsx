import React from 'react';
import type { EnquiryStatus, StallStatus } from '../../data/types';

interface EnquiryConfig {
  label: string;
  dot: string;
  bg: string;
  text: string;
  border: string;
}

const enquiryConfig: Record<EnquiryStatus, EnquiryConfig> = {
  new: {
    label: 'Awaiting Review',
    dot: 'bg-indigo-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-900',
    border: 'border-indigo-200',
  },
  contacted: {
    label: 'Organizer Contacted',
    dot: 'bg-blue-600',
    bg: 'bg-blue-50',
    text: 'text-blue-900',
    border: 'border-blue-200',
  },
  under_review: {
    label: 'Under Review',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
    border: 'border-amber-200',
  },
  approved: {
    label: 'Approved (Payment Pending)',
    dot: 'bg-emerald-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-900',
    border: 'border-emerald-200',
  },
  paid_outside: {
    label: 'Booking Confirmed ✓',
    dot: 'bg-ink',
    bg: 'bg-surface-soft',
    text: 'text-ink',
    border: 'border-hairline',
  },
};

const stallConfig: Record<StallStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  available: {
    label: 'Available',
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
  },
  held: {
    label: 'Held',
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  booked: {
    label: 'Occupied',
    dot: 'bg-muted-soft',
    bg: 'bg-surface-soft',
    text: 'text-muted',
    border: 'border-hairline',
  },
};

export function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  const cfg = enquiryConfig[status] || enquiryConfig.new;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-sm tracking-tight`}
    >
      <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export function StallStatusBadge({ status }: { status: StallStatus }) {
  const cfg = stallConfig[status] || stallConfig.available;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border} tracking-tight`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
