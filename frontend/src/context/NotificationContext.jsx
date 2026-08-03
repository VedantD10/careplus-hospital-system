import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { api } from '../services/api';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res || []);
    } catch (err) {
      setNotifications([
        { id: 1, title: 'Appointment Reminder', message: 'Cardiology patient Aarav Verma waiting in OPD Room 302.', type: 'APPOINTMENT', is_read: 0, created_at: new Date().toISOString() },
        { id: 2, title: 'ER Trauma Alert', message: 'Level 1 Trauma patient arriving in Emergency Bay 01.', type: 'EMERGENCY', is_read: 0, created_at: new Date().toISOString() }
      ]);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const showToast = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (err) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, showToast, markAsRead, fetchNotifications }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm font-medium transition-all ${
              toast.type === 'success' ? 'bg-emerald-900 text-emerald-50 border-emerald-700' :
              toast.type === 'error' ? 'bg-rose-900 text-rose-50 border-rose-700' :
              'bg-slate-900 text-slate-100 border-slate-700'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-teal-400 shrink-0" />}
              <span>{toast.message}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-slate-400 hover:text-white p-1">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used within NotificationProvider');
  return context;
};
