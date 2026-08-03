import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Calendar, Clock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const BookAppointmentModal = ({ isOpen, onClose, onSuccess, initialDoctorId = null }) => {
  const { showToast } = useNotification();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: initialDoctorId || '',
    appointment_date: new Date().toISOString().split('T')[0],
    start_time: '10:00',
    reason: ''
  });
  const [conflictChecking, setConflictChecking] = useState(false);
  const [conflictStatus, setConflictStatus] = useState(null); // null, 'available', 'conflict'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/doctors').then(setDoctors).catch(console.error);
      api.get('/patients').then(setPatients).catch(() => {});
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialDoctorId) {
      setFormData(prev => ({ ...prev, doctor_id: initialDoctorId }));
    }
  }, [initialDoctorId]);

  // Real-time conflict check
  useEffect(() => {
    if (formData.doctor_id && formData.appointment_date && formData.start_time) {
      setConflictChecking(true);
      const [h, m] = formData.start_time.split(':').map(Number);
      const endM = m + 30;
      const endH = h + Math.floor(endM / 60);
      const endTimeStr = `${String(endH).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}:00`;

      api.get(`/appointments/check-conflict?doctorId=${formData.doctor_id}&date=${formData.appointment_date}&startTime=${formData.start_time}:00&endTime=${endTimeStr}`)
        .then(res => {
          if (res.hasConflict) {
            setConflictStatus({ available: false, message: res.reason });
          } else {
            setConflictStatus({ available: true, message: 'Time slot is available!' });
          }
        })
        .catch(() => setConflictStatus(null))
        .finally(() => setConflictChecking(false));
    }
  }, [formData.doctor_id, formData.appointment_date, formData.start_time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (conflictStatus && !conflictStatus.available) {
      showToast(conflictStatus.message, 'error');
      return;
    }

    setLoading(true);
    try {
      await api.post('/appointments', formData);
      showToast('Appointment successfully booked!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to book appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book New Appointment" maxWidth="max-w-lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {patients.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Patient</label>
            <select
              required
              value={formData.patient_id}
              onChange={e => setFormData({ ...formData, patient_id: e.target.value })}
              className="saas-input"
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.email})</option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Doctor & Department</label>
          <select
            required
            value={formData.doctor_id}
            onChange={e => setFormData({ ...formData, doctor_id: e.target.value })}
            className="saas-input"
          >
            <option value="">-- Choose Doctor --</option>
            {doctors.map(d => (
              <option key={d.id} value={d.id}>
                {d.name} — {d.specialization} ({d.department_name} - ₹{d.consultation_fee})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Appointment Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={formData.appointment_date}
              onChange={e => setFormData({ ...formData, appointment_date: e.target.value })}
              className="saas-input"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Time Slot</label>
            <select
              required
              value={formData.start_time}
              onChange={e => setFormData({ ...formData, start_time: e.target.value })}
              className="saas-input"
            >
              <option value="09:00">09:00 AM</option>
              <option value="09:30">09:30 AM</option>
              <option value="10:00">10:00 AM</option>
              <option value="10:30">10:30 AM</option>
              <option value="11:00">11:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="14:30">02:30 PM</option>
              <option value="15:00">03:00 PM</option>
              <option value="15:30">03:30 PM</option>
            </select>
          </div>
        </div>

        {/* Conflict Indicator */}
        {formData.doctor_id && (
          <div className="text-xs">
            {conflictChecking ? (
              <span className="text-slate-500 animate-pulse">Checking slot availability...</span>
            ) : conflictStatus ? (
              <div className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                conflictStatus.available ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}>
                {conflictStatus.available ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{conflictStatus.message}</span>
              </div>
            ) : null}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit</label>
          <textarea
            rows={2}
            value={formData.reason}
            onChange={e => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Describe symptoms or purpose of checkup..."
            className="saas-input"
          />
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-slate-200">
          <button type="button" onClick={onClose} className="saas-btn-secondary">Cancel</button>
          <button
            type="submit"
            disabled={loading || (conflictStatus && !conflictStatus.available)}
            className="saas-btn-primary"
          >
            {loading ? 'Confirming...' : 'Confirm Booking'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
