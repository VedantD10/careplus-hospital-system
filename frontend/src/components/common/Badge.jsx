import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Stethoscope, XCircle } from 'lucide-react';

export const Badge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'SCHEDULED': return 'badge-scheduled';
      case 'CHECKED_IN': return 'badge-checked-in';
      case 'IN_CONSULTATION': return 'badge-in-consultation';
      case 'COMPLETED': return 'badge-completed';
      case 'CANCELLED': return 'badge-cancelled';
      case 'PAID': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full text-xs';
      case 'PENDING': return 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold px-3 py-1 rounded-full text-xs';
      default: return 'bg-slate-800 text-slate-300 border border-slate-700 font-medium px-3 py-1 rounded-full text-xs';
    }
  };

  const getIcon = (s) => {
    switch (s) {
      case 'SCHEDULED': return <Clock className="w-3 h-3 text-sky-400" />;
      case 'CHECKED_IN': return <Clock className="w-3 h-3 text-amber-400" />;
      case 'IN_CONSULTATION': return <Stethoscope className="w-3 h-3 text-indigo-400" />;
      case 'COMPLETED': return <CheckCircle2 className="w-3 h-3 text-emerald-400" />;
      case 'CANCELLED': return <XCircle className="w-3 h-3 text-rose-400" />;
      default: return null;
    }
  };

  const formatText = (s) => {
    if (!s) return 'N/A';
    return s.replace(/_/g, ' ');
  };

  return (
    <span className={getBadgeClass(status)}>
      {getIcon(status)}
      <span>{formatText(status)}</span>
    </span>
  );
};
