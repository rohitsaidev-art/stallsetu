import { Users, CheckCircle, Clock, IndianRupee, Calendar } from 'lucide-react';
import type { Event, Enquiry } from '../../data/types';

interface Props {
  events: Event[];
  enquiries: Enquiry[];
  onTabChange: (tab: string) => void;
}

export function Dashboard({ events, enquiries, onTabChange }: Props) {
  const totalStalls = events.reduce((acc, e) => acc + e.totalStalls, 0);
  const bookedStalls = events.reduce((acc, e) => acc + e.stalls.filter(s => s.status === 'booked').length, 0);
  const heldStalls = events.reduce((acc, e) => acc + e.stalls.filter(s => s.status === 'held').length, 0);
  const totalRevenue = events.reduce((acc, ev) =>
    acc + ev.stalls.filter(s => s.status === 'booked').reduce((a, s) => a + s.price, 0), 0
  );
  const newEnquiries = enquiries.filter(e => e.status === 'new').length;
  const pendingEnquiries = enquiries.filter(e => ['contacted', 'under_review'].includes(e.status)).length;

  const stats = [
    { label: 'Total Revenue', value: `₹${(totalRevenue / 100000).toFixed(1)}L`, sub: 'Paid outside platform', icon: IndianRupee, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'New Enquiries', value: String(newEnquiries), sub: 'Awaiting response', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Stalls Booked', value: `${bookedStalls}/${totalStalls}`, sub: `${heldStalls} currently held`, icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pipeline', value: String(pendingEnquiries), sub: 'Under review / Contacted', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-zinc-900">Good morning, Aishwarya 👋</h2>
        <p className="text-sm text-zinc-500 mt-0.5">Here's what's happening across your events today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-zinc-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-zinc-900 mt-1.5 tabular-nums">{stat.value}</p>
                <p className="text-xs text-zinc-400 mt-1">{stat.sub}</p>
              </div>
              <div className={`h-9 w-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={16} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Events Overview */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-zinc-900">Active Events</h3>
          <button onClick={() => onTabChange('events')} className="text-xs font-medium text-brand-600 hover:text-brand-700">View all →</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {events.map(event => {
            const booked = event.stalls.filter(s => s.status === 'booked').length;
            const held = event.stalls.filter(s => s.status === 'held').length;
            const available = event.stalls.filter(s => s.status === 'available').length;
            const pct = Math.round(((booked + held) / event.stalls.length) * 100);
            return (
              <div key={event.id} className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-sm">
                <div className="h-28 relative overflow-hidden">
                  <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <p className="text-white text-sm font-semibold">{event.name}</p>
                    <p className="text-white/70 text-xs">{event.venue}, {event.city}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} />
                      {new Date(event.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="font-medium text-zinc-700">{pct}% filled</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-3">
                    <div className="bg-brand-600 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      <span className="text-zinc-500">{available} available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      <span className="text-zinc-500">{held} held</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                      <span className="text-zinc-500">{booked} booked</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
