import React from 'react';
import { Search, Filter, RefreshCw, X, Calendar, User, Stethoscope } from 'lucide-react';

export const FilterBar = ({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  departments = [],
  doctor,
  onDoctorChange,
  doctors = [],
  shift,
  onShiftChange,
  status,
  onStatusChange,
  statuses = [],
  priority,
  onPriorityChange,
  onReset
}) => {
  const hasActiveFilters = search || department || doctor || shift || status || priority;

  return (
    <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-[#0F4C81]" /> Enterprise Operational Search & Multi-Facet Filters
        </h4>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search MRN / Name..."
            value={search || ''}
            onChange={e => onSearchChange?.(e.target.value)}
            className="saas-input pl-8 py-1.5 text-xs"
          />
        </div>

        {/* Department Filter */}
        {onDepartmentChange && (
          <select
            value={department || ''}
            onChange={e => onDepartmentChange(e.target.value)}
            className="saas-input py-1.5 text-xs"
          >
            <option value="">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.name} ({d.code})</option>
            ))}
          </select>
        )}

        {/* Doctor Filter */}
        {onDoctorChange && (
          <select
            value={doctor || ''}
            onChange={e => onDoctorChange(e.target.value)}
            className="saas-input py-1.5 text-xs"
          >
            <option value="">All Doctors</option>
            {doctors.map(doc => (
              <option key={doc.id} value={doc.name}>{doc.name}</option>
            ))}
          </select>
        )}

        {/* Shift Filter */}
        {onShiftChange && (
          <select
            value={shift || ''}
            onChange={e => onShiftChange(e.target.value)}
            className="saas-input py-1.5 text-xs"
          >
            <option value="">All Shifts</option>
            <option value="MORNING">Morning Shift (08:00 - 16:00)</option>
            <option value="EVENING">Evening Shift (16:00 - 24:00)</option>
            <option value="NIGHT">Night Duty (24:00 - 08:00)</option>
          </select>
        )}

        {/* Status Filter */}
        {onStatusChange && (
          <select
            value={status || ''}
            onChange={e => onStatusChange(e.target.value)}
            className="saas-input py-1.5 text-xs"
          >
            <option value="">All Statuses</option>
            {(statuses.length > 0 ? statuses : ['SCHEDULED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'APPROVED', 'PENDING']).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        )}

        {/* Priority Filter */}
        {onPriorityChange && (
          <select
            value={priority || ''}
            onChange={e => onPriorityChange(e.target.value)}
            className="saas-input py-1.5 text-xs"
          >
            <option value="">All Priorities</option>
            <option value="EMERGENCY">Emergency / Level 1</option>
            <option value="HIGH">Urgent / High</option>
            <option value="NORMAL">Standard / Normal</option>
          </select>
        )}
      </div>
    </div>
  );
};
