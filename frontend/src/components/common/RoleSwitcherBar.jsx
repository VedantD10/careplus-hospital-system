import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, UserCheck, CalendarCheck, User } from 'lucide-react';

export const RoleSwitcherBar = () => {
  const { user, switchRolePreset } = useAuth();

  const roles = [
    { role: 'ADMIN', label: 'Dr. Rajesh Sharma (Admin)', icon: Shield },
    { role: 'DOCTOR', label: 'Dr. Vikram Malhotra (Doctor)', icon: UserCheck },
    { role: 'RECEPTIONIST', label: 'Priya Deshmukh (Receptionist)', icon: CalendarCheck },
    { role: 'PATIENT', label: 'Aarav Verma (Patient)', icon: User }
  ];

  return (
    <div className="bg-[#0F4C81] text-white px-6 py-1.5 text-xs flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 border-b border-[#0c3d68]">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-200 font-semibold tracking-tight">CarePlus Workspace Evaluator:</span>
        <span className="bg-[#007C91] text-white px-2 py-0.5 rounded font-mono font-bold">
          Active: {user?.role || 'GUEST'} ({user?.name || 'Not Logged In'})
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-slate-200 mr-1 hidden sm:inline text-[11px] font-medium">1-Click Role Switch:</span>
        {roles.map(({ role, label, icon: Icon }) => {
          const isActive = user?.role === role;
          return (
            <button
              key={role}
              onClick={() => switchRolePreset(role)}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] transition-colors ${
                isActive
                  ? 'bg-white text-[#0F4C81] font-bold shadow-xs'
                  : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white border border-slate-700'
              }`}
              title={`Switch workspace to ${label}`}
            >
              <Icon className="w-3 h-3" />
              <span>{role}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
