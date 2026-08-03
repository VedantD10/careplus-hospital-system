import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Plus, Trash2, Stethoscope, Pill } from 'lucide-react';

export const MedicalRecordModal = ({ isOpen, onClose, appointment, onSuccess }) => {
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    vitals_bp: '120/80 mmHg',
    vitals_pulse: '72 bpm',
    vitals_temp: '98.6 °F',
    vitals_weight: '70 kg',
    symptoms: appointment?.reason || '',
    diagnosis: '',
    treatment_plan: '',
    confidential_notes: '',
    instructions: 'Take medications as prescribed after meals.',
    follow_up_date: ''
  });

  const [medications, setMedications] = useState([
    { name: '', dosage: '1 Tablet', frequency: 'Twice Daily', duration: '7 Days', instructions: 'After food' }
  ]);
  const [loading, setLoading] = useState(false);

  const handleAddMedication = () => {
    setMedications([...medications, { name: '', dosage: '1 Tablet', frequency: 'Once Daily', duration: '5 Days', instructions: '' }]);
  };

  const handleRemoveMedication = (idx) => {
    setMedications(medications.filter((_, i) => i !== idx));
  };

  const handleMedChange = (idx, field, value) => {
    const updated = [...medications];
    updated[idx][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.diagnosis) {
      showToast('Diagnosis is required to complete consultation', 'error');
      return;
    }

    setLoading(true);
    try {
      const validMeds = medications.filter(m => m.name.trim() !== '');
      await api.post('/medical-records', {
        appointment_id: appointment.id,
        ...formData,
        medications: validMeds
      });

      showToast('Consultation completed, prescription issued & invoice generated!', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Failed to submit medical record', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Clinical Consultation - ${appointment?.patient_name}`} maxWidth="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
        {/* Patient Info Header */}
        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex justify-between items-center text-xs">
          <div>
            <span className="font-semibold text-slate-800">{appointment?.patient_name}</span>
            <span className="text-slate-500 ml-2">Appt #{appointment?.appointment_number}</span>
          </div>
          <span className="text-teal-700 bg-teal-100 px-2 py-0.5 rounded font-medium">{appointment?.department_name}</span>
        </div>

        {/* Vitals Grid */}
        <div className="grid grid-cols-4 gap-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">BP (mmHg)</label>
            <input type="text" value={formData.vitals_bp} onChange={e => setFormData({ ...formData, vitals_bp: e.target.value })} className="saas-input py-1 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Pulse (bpm)</label>
            <input type="text" value={formData.vitals_pulse} onChange={e => setFormData({ ...formData, vitals_pulse: e.target.value })} className="saas-input py-1 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Temp (°F)</label>
            <input type="text" value={formData.vitals_temp} onChange={e => setFormData({ ...formData, vitals_temp: e.target.value })} className="saas-input py-1 text-xs" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600">Weight (kg)</label>
            <input type="text" value={formData.vitals_weight} onChange={e => setFormData({ ...formData, vitals_weight: e.target.value })} className="saas-input py-1 text-xs" />
          </div>
        </div>

        {/* Symptoms & Diagnosis */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Chief Symptoms & Presentation</label>
          <input type="text" required value={formData.symptoms} onChange={e => setFormData({ ...formData, symptoms: e.target.value })} className="saas-input" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Diagnosis *</label>
          <input type="text" required value={formData.diagnosis} onChange={e => setFormData({ ...formData, diagnosis: e.target.value })} placeholder="e.g. Acute Bronchitis, Stage 1 Hypertension..." className="saas-input font-medium" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Treatment Plan & Advice</label>
          <textarea rows={2} value={formData.treatment_plan} onChange={e => setFormData({ ...formData, treatment_plan: e.target.value })} className="saas-input" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Confidential Clinical Notes (Doctor eyes only)</label>
          <input type="text" value={formData.confidential_notes} onChange={e => setFormData({ ...formData, confidential_notes: e.target.value })} placeholder="Internal notes not printed on prescription" className="saas-input bg-amber-50/30" />
        </div>

        {/* Prescription Section */}
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-teal-600" /> Prescribed Medications (Rx)
            </h4>
            <button type="button" onClick={handleAddMedication} className="text-teal-700 hover:text-teal-900 text-xs font-semibold flex items-center gap-1">
              <Plus className="w-3.5 h-3.5" /> Add Drug
            </button>
          </div>

          <div className="space-y-2">
            {medications.map((med, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                <input
                  type="text"
                  placeholder="Medicine Name (e.g. Amoxicillin 500mg)"
                  value={med.name}
                  onChange={e => handleMedChange(idx, 'name', e.target.value)}
                  className="saas-input text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={med.dosage}
                  onChange={e => handleMedChange(idx, 'dosage', e.target.value)}
                  className="saas-input text-xs w-24"
                />
                <input
                  type="text"
                  placeholder="Frequency"
                  value={med.frequency}
                  onChange={e => handleMedChange(idx, 'frequency', e.target.value)}
                  className="saas-input text-xs w-28"
                />
                <button type="button" onClick={() => handleRemoveMedication(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
          <button type="button" onClick={onClose} className="saas-btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="saas-btn-primary">
            {loading ? 'Submitting...' : 'Complete Consultation & Issue Rx'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
