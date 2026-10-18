import { type ReactNode } from 'react';
import { LayoutDashboard, CalendarDays, ClipboardList, Bell, ChevronDown } from 'lucide-react';
import type { Organizer } from '../../data/types';

interface Props {
  organizer: Organizer;
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'events', label: 'My Events', icon: CalendarDays },
  { id: 'enquiries', label: 'Enquiries', icon: ClipboardList },
];

export function OrganizerLayout({ organizer, children, activeTab, onTabChange }: Props) {
  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">StallSetu</p>
              <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Organizer</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-100 active:scale-[0.98] ${
                activeTab === item.id
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
              }`}
            >
              <item.icon size={16} className={activeTab === item.id ? 'text-brand-600' : 'text-zinc-400'} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-zinc-200">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-zinc-50 cursor-pointer">
            <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-brand-700">
                {organizer.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-zinc-900 truncate">{organizer.name}</p>
              <p className="text-[10px] text-zinc-400 truncate">{organizer.organization}</p>
            </div>
            <ChevronDown size={12} className="text-zinc-400 flex-shrink-0" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-zinc-900">
              {navItems.find(n => n.id === activeTab)?.label ?? 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-8 w-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 transition-colors">
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
