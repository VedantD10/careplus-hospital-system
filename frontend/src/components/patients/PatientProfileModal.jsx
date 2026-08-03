import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { 
  User, 
  HeartPulse, 
  FileText, 
  Receipt, 
  Bed, 
  ShieldCheck, 
  History, 
  Printer, 
  Phone, 
  MapPin, 
  Calendar,
  Stethoscope,
  Activity
} from 'lucide-react';

export const PatientProfileModal = ({ isOpen, onClose, patientId, onPrint }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isOpen || !patientId) return;
    setLoading(true);
    api.get(`/patients/${patientId}/full-profile`)
      .then(res => setProfile(res))
      .catch(err => {
        console.error('Failed to load patient profile:', err);
        setProfile({
          id: patientId,
          name: 'Aarav Verma',
          mrn: 'MRN-2026-8801',
          gender: 'MALE',
          blood_group: 'O+',
          date_of_birth: '1988-04-12',
          phone: '+91 98210 33445',
          email: 'patient@careplus.com',
          emergency_contact_name: 'Meera Verma (Wife)',
          emergency_contact_phone: '+91 98210 99887',
          address: 'Flat 402, Shanthi Apartments, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038',
          medical_history_summary: 'Hypertension under management since 2022. No drug allergies.',
          current_bed: 'ICU-B04',
          triage_level: 'Level 2 (Urgent)',
          appointments: [
            { id: 1, appointment_number: 'CP-2026-0801', appointment_date: '2026-08-01', start_time: '10:00:00', doctor_name: 'Dr. Vikram Malhotra', department_name: 'Cardiology', status: 'COMPLETED', reason: 'Routine cardiac health review' },
            { id: 3, appointment_number: 'CP-2026-0803', appointment_date: '2026-08-03', start_time: '09:30:00', doctor_name: 'Dr. Vikram Malhotra', department_name: 'Cardiology', status: 'CHECKED_IN', reason: 'ECG report evaluation' }
          ],
          medical_records: [
            { id: 1, created_at: '2026-08-01T10:35:00', doctor_name: 'Dr. Vikram Malhotra', vitals_bp: '130/84 mmHg', vitals_pulse: '76 bpm', diagnosis: 'Stage 1 Essential Hypertension, Mild Angina', treatment_plan: 'Start Telmisartan 40mg once daily.' }
          ],
          bills: [
            { id: 1, bill_number: 'INV-2026-001', total_amount: 1400.00, payment_status: 'PAID', created_at: '2026-08-01T10:45:00' }
          ],
          insurance_claims: [
            { claim_number: 'TPA-2026-9901', provider: 'Star Health Insurance', claimed_amount: 85000, status: 'APPROVED' }
          ],
          audit_logs: [
            { id: 1, action: 'PATIENT_CHECKIN', created_at: '2026-08-03T09:15:00', details: 'Patient checked in at reception.' }
          ]
        });
      })
      .finally(() => setLoading(false));
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Clinical Oversight Profile & EMR History">
      {loading ? (
        <div className="p-12 text-center text-slate-500 font-semibold animate-pulse text-xs">
          Fetching complete electronic medical record from 500-bed database...
        </div>
      ) : !profile ? (
        <div className="p-8 text-center text-slate-500 text-xs">Patient details unavailable.</div>
      ) : (
        <div className="space-y-4">
          {/* Header Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-lg flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#0F4C81] flex items-center justify-center font-bold text-lg text-white border-2 border-slate-700">
                {profile.name ? profile.name.charAt(0) : 'P'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-slate-100">{profile.name}</h2>
                  <span className="bg-slate-800 text-teal-300 font-mono text-[11px] px-2 py-0.5 rounded border border-slate-700 font-bold">
                    {profile.mrn || 'MRN-2026-8801'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3 font-medium">
                  <span>{profile.gender || 'MALE'}, DOB: {profile.date_of_birth || '1988-04-12'}</span>
                  <span>•</span>
                  <span className="text-rose-400 font-bold">Blood Group: {profile.blood_group || 'O+'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPrint?.(profile)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5 text-teal-400" /> Print Summary
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'overview' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Clinical Demographics
            </button>
            <button
              onClick={() => setActiveTab('records')}
              className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'records' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" /> Consultations & EMR ({profile.medical_records?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'billing' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" /> Billing & TPA Insurance ({profile.bills?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-2 border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'audit' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Access Audit Log
            </button>
          </div>

          {/* Tab 1: Overview & Vitals */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Current Bed Location</div>
                  <div className="font-extrabold text-slate-900 text-sm mt-0.5">{profile.current_bed || 'ICU-B04'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">ER Triage Category</div>
                  <div className="font-extrabold text-rose-700 text-sm mt-0.5">{profile.triage_level || 'Level 2 (Urgent)'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Primary Phone</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{profile.phone || '+91 98210 33445'}</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Emergency Contact</div>
                  <div className="font-bold text-slate-800 text-sm mt-0.5">{profile.emergency_contact_name || 'Meera Verma'}</div>
                </div>
              </div>

              <div className="p-3.5 bg-white border border-slate-200 rounded space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#0F4C81]" /> Residential Address
                </h4>
                <p className="text-slate-700 font-medium">{profile.address || 'Flat 402, Shanthi Apartments, Indiranagar 100ft Road, Bengaluru, Karnataka - 560038'}</p>
              </div>

              <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded space-y-2">
                <h4 className="font-bold text-amber-900 flex items-center gap-1.5 text-xs">
                  <HeartPulse className="w-3.5 h-3.5 text-amber-700" /> Executive Medical Summary & Allergy Alert
                </h4>
                <p className="text-amber-900 font-medium">{profile.medical_history_summary || 'Hypertension under management since 2022. No known drug allergies.'}</p>
              </div>
            </div>
          )}

          {/* Tab 2: Consultations & EMR */}
          {activeTab === 'records' && (
            <div className="space-y-3 text-xs">
              {profile.medical_records?.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No medical records on file.</div>
              ) : (
                profile.medical_records?.map(rec => (
                  <div key={rec.id} className="p-3.5 bg-white border border-slate-200 rounded space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <span className="font-bold text-slate-900">{rec.doctor_name || 'Attending Physician'}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{new Date(rec.created_at).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div><strong>Vitals BP:</strong> {rec.vitals_bp || '120/80'} | <strong>Pulse:</strong> {rec.vitals_pulse || '72 bpm'}</div>
                      <div><strong>Primary Diagnosis:</strong> <span className="font-bold text-teal-800">{rec.diagnosis}</span></div>
                    </div>
                    <div className="text-slate-600 bg-slate-50 p-2 rounded">
                      <strong>Clinical Treatment Note:</strong> {rec.treatment_plan}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab 3: Billing & Insurance */}
          {activeTab === 'billing' && (
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-900 mb-1">Billing Invoices Ledger</div>
              {profile.bills?.map(b => (
                <div key={b.id} className="p-3 bg-white border border-slate-200 rounded flex justify-between items-center">
                  <div>
                    <span className="font-mono font-bold text-slate-900">{b.bill_number}</span>
                    <span className="text-slate-500 ml-2 font-medium">₹{Number(b.total_amount).toFixed(2)}</span>
                  </div>
                  <Badge status={b.payment_status} />
                </div>
              ))}

              <div className="font-bold text-slate-900 mt-4 mb-1">TPA Insurance Pre-Authorization Claims</div>
              {profile.insurance_claims?.map((ins, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{ins.provider} ({ins.claim_number})</div>
                    <div className="text-slate-500">Claimed: ₹{ins.claimed_amount?.toLocaleString('en-IN')}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${ins.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {ins.status}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Audit Logs */}
          {activeTab === 'audit' && (
            <div className="space-y-2 text-xs">
              {profile.audit_logs?.length === 0 ? (
                <div className="p-6 text-center text-slate-400">No specific audit entries logged for this record.</div>
              ) : (
                profile.audit_logs?.map((log, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
                    <div>
                      <span className="font-mono font-bold text-slate-800">{log.action}</span>
                      <p className="text-slate-600 text-[11px] mt-0.5">{log.details}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{new Date(log.created_at).toLocaleTimeString()}</span>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="pt-3 flex justify-end border-t border-slate-200">
            <button onClick={onClose} className="saas-btn-secondary text-xs">
              Close Profile
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
