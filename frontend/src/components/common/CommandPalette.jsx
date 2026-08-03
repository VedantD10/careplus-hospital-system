import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Activity,
  Bed,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Building2,
  ShieldCheck,
  Zap,
  Layers,
  X
} from 'lucide-react';

export const CommandPalette = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open-command-palette'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { title: 'Command Center Dashboard', group: 'OPERATIONS', route: '/admin', icon: Activity },
    { title: 'Live OPD Queue', group: 'OPERATIONS', route: '/appointments', icon: Calendar },
    { title: 'Bed & Ward Management (500 Beds)', group: 'OPERATIONS', route: '/admin', icon: Bed },
    { title: 'Patients Master Directory', group: 'CLINICAL', route: '/patients', icon: Users },
    { title: 'Doctors & Specialists Roster', group: 'CLINICAL', route: '/doctors', icon: Users },
    { title: 'Electronic Medical Records (EMR)', group: 'CLINICAL', route: '/doctor-dashboard', icon: FileText },
    { title: 'Billing & Invoices Ledger', group: 'FINANCE', route: '/billing', icon: CreditCard },
    { title: 'TPA Health Insurance Claims', group: 'FINANCE', route: '/admin', icon: CreditCard },
    { title: 'Departments & Consultation Rates', group: 'ADMINISTRATION', route: '/departments', icon: Building2 },
    { title: 'Compliance & Audit Trail', group: 'ADMINISTRATION', route: '/audit-logs', icon: ShieldCheck }
  ];

  const filtered = actions.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.group.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-xl w-full overflow-hidden animate-scale-up">
        {/* Search Header */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center gap-2">
          <Search className="w-4 h-4 text-[#0F4C81]" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command, patient MRN, or search module (Ctrl+K)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
          />
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command Items List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matching command or module found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.route)}
                  className="w-full text-left p-2.5 rounded hover:bg-slate-100 flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-slate-500 group-hover:text-[#0F4C81]" />
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-[#0F4C81]">
                      {item.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {item.group}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="p-2 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between font-mono">
          <span>Navigation Shortcuts</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
