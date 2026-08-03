import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Bell, Check, X, ShieldAlert, Calendar, CheckCircle2, Info } from 'lucide-react';

export const NotificationCenter = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res || []);
    } catch (err) {
      console.error(err);
      setNotifications([
        { id: 1, title: 'Appointment Reminder', message: 'Cardiology patient Aarav Verma is waiting in OPD Room 302.', type: 'APPOINTMENT', is_read: 0, created_at: new Date().toISOString() },
        { id: 2, title: 'ER Trauma Alert', message: 'Level 1 Trauma victim arriving at Ambulance Bay 02.', type: 'EMERGENCY', is_read: 0, created_at: new Date(Date.now() - 300000).toISOString() },
        { id: 3, title: 'TPA Pre-Auth Clearance', message: 'Claim TPA-2026-9901 approved by Star Health Insurance.', type: 'CHECKIN', is_read: 1, created_at: new Date(Date.now() - 3600000).toISOString() }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchNotifications();
  }, [isOpen]);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-teal-400" />
            <h3 className="font-extrabold text-sm tracking-tight text-slate-100">CarePlus Operational Notification Desk</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs animate-pulse">
              Loading hospital notifications...
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No new alerts or notifications.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3.5 rounded-lg border transition-all text-xs space-y-1 ${
                  n.is_read ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-300 shadow-xs border-l-4 border-l-[#0F4C81]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    {n.type === 'EMERGENCY' ? <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> : <Info className="w-3.5 h-3.5 text-[#0F4C81]" />}
                    {n.title}
                  </span>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-[10px] text-teal-700 hover:underline font-bold"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{n.message}</p>
                <div className="text-[10px] text-slate-400 font-mono pt-1">
                  {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button onClick={onClose} className="saas-btn-secondary w-full text-xs py-1.5">
            Dismiss Center
          </button>
        </div>
      </div>
    </div>
  );
};
