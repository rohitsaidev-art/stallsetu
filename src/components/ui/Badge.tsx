import type { EnquiryStatus, StallStatus } from '../../data/types';

const enquiryConfig: Record<EnquiryStatus, { label: string; classes: string }> = {
  new: { label: 'New Enquiry', classes: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-600/20' },
  contacted: { label: 'Contacted', classes: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20' },
  under_review: { label: 'Under Review', classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20' },
  approved: { label: 'Approved', classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20' },
  paid_outside: { label: 'Paid Outside Platform', classes: 'bg-zinc-100 text-zinc-700 ring-1 ring-inset ring-zinc-600/20' },
};

const stallConfig: Record<StallStatus, { label: string; classes: string; dot: string }> = {
  available: { label: 'Available', classes: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20', dot: 'bg-emerald-500' },
  held: { label: 'Held', classes: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20', dot: 'bg-amber-500' },
  booked: { label: 'Booked', classes: 'bg-zinc-100 text-zinc-600 ring-1 ring-inset ring-zinc-500/20', dot: 'bg-zinc-400' },
};

export function EnquiryBadge({ status }: { status: EnquiryStatus }) {
  const config = enquiryConfig[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
      {config.label}
    </span>
  );
}

export function StallBadge({ status }: { status: StallStatus }) {
  const config = stallConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}
