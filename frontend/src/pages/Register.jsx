import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { User, Mail, Lock, Phone, Calendar, Heart, Shield, ArrowRight } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    date_of_birth: '1995-05-15',
    gender: 'MALE',
    blood_group: 'O+',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    address: '',
    medical_history_summary: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      showToast('Account registered successfully!', 'success');
      navigate('/patient-dashboard');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700 my-8">
        <div className="bg-slate-950 p-6 text-white text-center border-b border-slate-800">
          <h2 className="text-xl font-bold tracking-tight">Patient Account Registration</h2>
          <p className="text-xs text-teal-400 font-medium">Join CarePlus Hospital Patient Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="saas-input" placeholder="John Doe" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
              <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="saas-input" placeholder="john@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
              <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="saas-input" placeholder="••••••••" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="saas-input" placeholder="+1 (555) 000-0000" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
              <input type="date" required value={formData.date_of_birth} onChange={e => setFormData({ ...formData, date_of_birth: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })} className="saas-input">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <select value={formData.blood_group} onChange={e => setFormData({ ...formData, blood_group: e.target.value })} className="saas-input">
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
                <option value="A-">A-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input type="text" value={formData.emergency_contact_name} onChange={e => setFormData({ ...formData, emergency_contact_name: e.target.value })} className="saas-input" placeholder="Relative Name" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone</label>
              <input type="text" value={formData.emergency_contact_phone} onChange={e => setFormData({ ...formData, emergency_contact_phone: e.target.value })} className="saas-input" placeholder="+1 (555) 111-2222" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
            <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="saas-input" placeholder="Street, City, Zip" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Pre-existing Medical Allergies / Conditions</label>
            <textarea rows={2} value={formData.medical_history_summary} onChange={e => setFormData({ ...formData, medical_history_summary: e.target.value })} className="saas-input" placeholder="e.g. Asthma, Penicillin allergy..." />
          </div>

          <button type="submit" disabled={loading} className="w-full saas-btn-primary justify-center py-2.5 text-sm">
            {loading ? 'Creating Account...' : 'Complete Registration'}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-1">
            <span className="text-xs text-slate-500">Already registered? </span>
            <Link to="/login" className="text-xs font-semibold text-teal-600 hover:text-teal-800">
              Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
