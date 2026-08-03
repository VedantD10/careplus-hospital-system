import React, { useState } from 'react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Bed, ArrowRightLeft, ShieldAlert } from 'lucide-react';

export const BedTransferModal = ({ isOpen, onClose, bed, onSuccess }) => {
  const { showToast } = useNotification();
  const [patientName, setPatientName] = useState(bed?.patient_name || '');
  const [doctorName, setDoctorName] = useState(bed?.doctor_name || 'Dr. Vikram Malhotra');
  const [targetWard, setTargetWard] = useState(bed?.ward || 'General Ward 3A');
  const [targetBedNo, setTargetBedNo] = useState(bed?.bed_number || 'A14');
  const [newStatus, setNewStatus] = useState(bed?.status || 'OCCUPIED');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !bed) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.patch(`/beds/${bed.id}`, {
        status: newStatus,
        patient_name: newStatus === 'AVAILABLE' ? null : patientName,
        doctor_name: newStatus === 'AVAILABLE' ? null : doctorName,
        ward: targetWard,
        bed_number: targetBedNo,
        admitted_at: newStatus === 'OCCUPIED' ? new Date().toISOString().replace('T', ' ').substring(0,16) : null
      });

      showToast(`Bed ${bed.id} updated! Patient location set to ${targetWard} (${targetBedNo}).`, 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Bed transfer update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inpatient Bed Transfer & Allocation — Bed #${bed.id}`}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-slate-50 border border-slate-200 p-3 rounded flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Unit / Bed</div>
            <div className="font-extrabold text-slate-900 text-sm mt-0.5">{bed.ward} ({bed.bed_number})</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-slate-500">Current Status</div>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${bed.status === 'OCCUPIED' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
              {bed.status}
            </span>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1">Bed Occupancy Action</label>
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="saas-input"
          >
            <option value="OCCUPIED">Transfer / Admit Patient to Bed</option>
            <option value="AVAILABLE">Discharge Patient & Mark Bed Clean / Available</option>
            <option value="MAINTENANCE">Mark Bed under Sanitization / Maintenance</option>
          </select>
        </div>

        {newStatus === 'OCCUPIED' && (
          <>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Admitted Patient Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="saas-input"
                placeholder="e.g. Aarav Verma"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attending Specialist Doctor</label>
                <select
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="saas-input"
                >
                  <option value="Dr. Vikram Malhotra">Dr. Vikram Malhotra (Cardiology)</option>
                  <option value="Dr. Ananya Iyer">Dr. Ananya Iyer (Neurology)</option>
                  <option value="Dr. Suresh Reddy">Dr. Suresh Reddy (Pediatrics)</option>
                  <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Emergency & ER)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Ward / ICU Unit</label>
                <select
                  value={targetWard}
                  onChange={e => setTargetWard(e.target.value)}
                  className="saas-input"
                >
                  <option value="Cardiac ICU">Cardiac ICU</option>
                  <option value="Neuro ICU">Neuro ICU</option>
                  <option value="General Ward 3A">General Ward 3A</option>
                  <option value="General Ward 3B">General Ward 3B</option>
                  <option value="Trauma ER">Trauma ER Bay</option>
                  <option value="VIP Suite 4th Floor">VIP Suite 4th Floor</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
          <button type="button" onClick={onClose} className="saas-btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={submitting} className="saas-btn-primary flex items-center gap-1.5">
            <ArrowRightLeft className="w-3.5 h-3.5" /> {submitting ? 'Updating Location...' : 'Confirm Bed Transfer'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
