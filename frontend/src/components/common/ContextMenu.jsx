import React, { useEffect, useRef } from 'react';
import { 
  User, 
  Stethoscope, 
  Bed, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';

export const ContextMenu = ({ x, y, onClose, actions = [] }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Screen boundary positioning
  const adjustedX = Math.min(x, window.innerWidth - 220);
  const adjustedY = Math.min(y, window.innerHeight - (actions.length * 36 + 40));

  return (
    <div
      ref={menuRef}
      style={{ top: `${adjustedY}px`, left: `${adjustedX}px` }}
      className="fixed z-50 w-56 bg-slate-900 text-slate-100 border border-slate-700 rounded-lg shadow-2xl py-1.5 text-xs font-medium animate-in fade-in zoom-in-95 duration-100"
    >
      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1 flex items-center justify-between">
        <span>Context Actions</span>
        <span className="font-mono text-[9px] text-slate-500">ESC</span>
      </div>

      {actions.map((act, index) => {
        if (act.divider) {
          return <div key={index} className="my-1 border-t border-slate-800" />;
        }

        const Icon = act.icon || ExternalLink;

        return (
          <button
            key={index}
            onClick={() => {
              act.onClick();
              onClose();
            }}
            disabled={act.disabled}
            className={`w-full text-left px-3 py-1.5 flex items-center gap-2.5 hover:bg-slate-800 transition-colors ${
              act.danger ? 'text-rose-400 hover:bg-rose-950/40' : 'text-slate-200'
            } ${act.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};
