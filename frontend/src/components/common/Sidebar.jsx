import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';
import {
  Activity,
  Calendar,
  Bed,
  Siren,
  Scissors,
  Truck,
  UserCheck,
  Users,
  FileText,
  Pill,
  Clock,
  FlaskConical,
  Radio,
  Droplet,
  FileBarChart,
  CreditCard,
  FileCheck,
  TrendingUp,
  Receipt,
  DollarSign,
  Building2,
  Package,
  Settings,
  ShieldCheck,
  BarChart2,
  Cpu,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({ ...prev, [groupName]: !prev[groupName] }));
  };

  const navGroups = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Command Center', path: '/admin', icon: Activity, roles: ['ADMIN'] },
        { label: 'Live OPD Queue', path: '/appointments', icon: Calendar, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
        { label: 'Bed & Ward Management', path: '/admin', icon: Bed, roles: ['ADMIN', 'RECEPTIONIST'] },
        { label: 'Emergency & Trauma', path: '/admin', icon: Siren, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
        { label: 'Operation Theatre Schedule', path: '/admin', icon: Scissors, roles: ['ADMIN', 'DOCTOR'] },
        { label: 'Ambulance Dispatch', path: '/admin', icon: Truck, roles: ['ADMIN', 'RECEPTIONIST'] }
      ]
    },
    {
      title: 'CLINICAL',
      items: [
        { label: 'Doctors & Staff', path: '/doctors', icon: UserCheck, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
        { label: 'Patients Directory', path: '/patients', icon: Users, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
        { label: 'Appointments', path: '/appointments', icon: Calendar, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
        { label: 'Electronic Medical Records', path: '/doctor-dashboard', icon: FileText, roles: ['DOCTOR', 'ADMIN'] },
        { label: 'Prescriptions', path: '/patient-dashboard', icon: Pill, roles: ['DOCTOR', 'PATIENT', 'ADMIN'] },
        { label: 'Follow-up Management', path: '/appointments', icon: Clock, roles: ['DOCTOR', 'RECEPTIONIST'] }
      ]
    },
    {
      title: 'DIAGNOSTICS',
      items: [
        { label: 'Laboratory', path: '/admin', icon: FlaskConical, roles: ['ADMIN', 'DOCTOR'] },
        { label: 'Radiology', path: '/admin', icon: Radio, roles: ['ADMIN', 'DOCTOR'] },
        { label: 'Blood Bank', path: '/admin', icon: Droplet, roles: ['ADMIN', 'DOCTOR'] },
        { label: 'Diagnostic Reports', path: '/patient-dashboard', icon: FileBarChart, roles: ['DOCTOR', 'PATIENT', 'ADMIN'] }
      ]
    },
    {
      title: 'FINANCE',
      items: [
        { label: 'Billing & Cashier', path: '/billing', icon: CreditCard, roles: ['ADMIN', 'RECEPTIONIST'] },
        { label: 'Insurance Claims (TPA)', path: '/admin', icon: FileCheck, roles: ['ADMIN', 'RECEPTIONIST'] },
        { label: 'Revenue Analytics', path: '/admin', icon: TrendingUp, roles: ['ADMIN'] },
        { label: 'Tax Invoices', path: '/billing', icon: Receipt, roles: ['ADMIN', 'RECEPTIONIST', 'PATIENT'] },
        { label: 'Payment Tracking', path: '/billing', icon: DollarSign, roles: ['ADMIN', 'RECEPTIONIST'] }
      ]
    },
    {
      title: 'ADMINISTRATION',
      items: [
        { label: 'Departments', path: '/departments', icon: Building2, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
        { label: 'Hospital Inventory', path: '/admin', icon: Package, roles: ['ADMIN'] },
        { label: 'Pharmacy Stock', path: '/admin', icon: Pill, roles: ['ADMIN', 'RECEPTIONIST'] },
        { label: 'Audit & Compliance', path: '/audit-logs', icon: ShieldCheck, roles: ['ADMIN'] }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Analytics Dashboard', path: '/admin', icon: BarChart2, roles: ['ADMIN'] },
        { label: 'Audit Logs', path: '/audit-logs', icon: ShieldCheck, roles: ['ADMIN'] },
        { label: 'System Health', path: '/admin', icon: Cpu, roles: ['ADMIN'] }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen sticky top-0 z-30 border-r border-slate-800 shadow-md">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950">
        <Logo size="normal" showSubtitle={true} />
      </div>

      {/* Navigation Groups List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navGroups.map((group, gIdx) => {
          // Filter items based on current user role
          const allowedItems = group.items.filter(item => !user || item.roles.includes(user.role));
          if (allowedItems.length === 0) return null;

          const isCollapsed = collapsedGroups[group.title];

          return (
            <div key={gIdx} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.title)}
                className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-200"
              >
                <span>{group.title}</span>
                {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {!isCollapsed && (
                <div className="space-y-0.5">
                  {allowedItems.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={idx}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 px-2.5 py-1.5 rounded text-xs transition-colors font-medium ${
                            isActive
                              ? 'bg-[#0F4C81] text-white font-semibold shadow-xs'
                              : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`
                        }
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* User Footer Card */}
      <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150'}
            alt=""
            className="w-7 h-7 rounded-full border border-slate-700 object-cover"
          />
          <div className="truncate">
            <div className="font-bold text-slate-200 text-xs truncate">{user?.name || 'User'}</div>
            <div className="text-[10px] text-[#007C91] font-mono font-semibold truncate">{user?.role || 'STAFF'}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
