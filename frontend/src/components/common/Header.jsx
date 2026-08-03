import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { CommandPalette } from './CommandPalette';
import { NotificationCenter } from './NotificationCenter';
import { Search, Bell, Clock, RefreshCw, Shield, HelpCircle } from 'lucide-react';

export const Header = ({ title, subtitle }) => {
  const { user } = useAuth();
  const { notifications = [] } = useNotification() || {};
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const unreadCount = (notifications || []).filter(n => !n.is_read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      <div>
        <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Command Palette Trigger Button (Ctrl + K) */}
        <button
          onClick={() => setShowCommandPalette(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs text-slate-600 transition-colors shadow-xs"
          title="Open CarePlus Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#0F4C81]" />
          <span className="hidden sm:inline font-medium">Search MRN or Module...</span>
          <kbd className="bg-white border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-500 shadow-xs">
            Ctrl K
          </kbd>
        </button>

        {/* Live System Status Indicator */}
        <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-lg text-[11px] font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>500-Bed Live • Auto-Sync</span>
        </div>

        {/* Notifications Slide-Over Trigger */}
        <button
          onClick={() => setShowNotificationCenter(true)}
          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative"
          title="Notifications & Triage Alerts"
        >
          <Bell className="w-4.5 h-4.5 text-slate-700" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white"></span>
          )}
        </button>
      </div>

      <CommandPalette isOpen={showCommandPalette} onClose={() => setShowCommandPalette(false)} />
      <NotificationCenter isOpen={showNotificationCenter} onClose={() => setShowNotificationCenter(false)} />
    </header>
  );
};
