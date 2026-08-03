import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Logo } from '../components/common/Logo';
import { Lock, Mail, Shield, UserCheck, CalendarCheck, User, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login, switchRolePreset } = useAuth();
  const { showToast } = useNotification();
  const [email, setEmail] = useState('admin@careplus.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      redirectByRole(user.role);
    } catch (err) {
      showToast(err.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = async (role) => {
    try {
      const user = await switchRolePreset(role);
      showToast(`Logged in as ${user.name} (${role})`, 'success');
      redirectByRole(user.role);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const redirectByRole = (role) => {
    switch (role) {
      case 'ADMIN': navigate('/admin'); break;
      case 'DOCTOR': navigate('/doctor-dashboard'); break;
      case 'RECEPTIONIST': navigate('/reception-dashboard'); break;
      case 'PATIENT': navigate('/patient-dashboard'); break;
      default: navigate('/patient-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-800">
        {/* Header */}
        <div className="bg-slate-950 p-6 text-white text-center border-b border-slate-800 flex flex-col items-center">
          <Logo size="normal" showSubtitle={true} />
          <p className="text-xs text-slate-400 mt-2 font-medium">Enterprise Hospital Information System (HIS)</p>
        </div>

        {/* Demo Preset Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 text-center">
            ⚡ Quick Demo Logins (1-Click Workspace Evaluation)
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleQuickPreset('ADMIN')} className="p-2 bg-slate-100 hover:bg-slate-200 text-[#0F4C81] border border-slate-300 rounded font-semibold flex items-center gap-1.5 justify-center">
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button onClick={() => handleQuickPreset('DOCTOR')} className="p-2 bg-slate-100 hover:bg-slate-200 text-[#007C91] border border-slate-300 rounded font-semibold flex items-center gap-1.5 justify-center">
              <UserCheck className="w-3.5 h-3.5" /> Doctor
            </button>
            <button onClick={() => handleQuickPreset('RECEPTIONIST')} className="p-2 bg-slate-100 hover:bg-slate-200 text-amber-900 border border-slate-300 rounded font-semibold flex items-center gap-1.5 justify-center">
              <CalendarCheck className="w-3.5 h-3.5" /> Receptionist
            </button>
            <button onClick={() => handleQuickPreset('PATIENT')} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded font-semibold flex items-center gap-1.5 justify-center">
              <User className="w-3.5 h-3.5" /> Patient
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="saas-input pl-9"
                placeholder="name@careplus.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="saas-input pl-9"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full saas-btn-primary justify-center py-2.5 text-xs font-bold uppercase tracking-wider"
          >
            {loading ? 'Authenticating...' : 'Sign In to CarePlus HIS'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
