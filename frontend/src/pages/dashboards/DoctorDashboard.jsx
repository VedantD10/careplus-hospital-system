import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { MedicalRecordModal } from '../../components/medical/MedicalRecordModal';
import { PatientProfileModal } from '../../components/patients/PatientProfileModal';
import { PrintDocumentModal } from '../../components/common/PrintDocumentModal';
import { Modal } from '../../components/common/Modal';
import { FilterBar } from '../../components/common/FilterBar';
import { useNotification } from '../../context/NotificationContext';
import { Calendar, UserCheck, Stethoscope, Clock, FileText, CheckCircle2, RefreshCcw, Printer, ArrowRightLeft, User } from 'lucide-react';

export const DoctorDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active consultation selection
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  // Profile & Print Modals
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Leave Request Modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ start_date: '', end_date: '', reason: '' });

  // Roster Swap Modal
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapForm, setSwapForm] = useState({ target_doctor: 'Dr. Ananya Iyer', shift_date: '', shift_type: 'NIGHT_DUTY', reason: '' });

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchDoctorQueue = async () => {
    try {
      const res = await api.get('/appointments');
      setAppointments(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorQueue();
  }, []);

  const handleStartConsultation = (appt) => {
    setSelectedAppt(appt);
    setShowConsultationModal(true);
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/doctors/${user?.doctorId || 1}/leave`, leaveForm);
      showToast('Leave request submitted and updated on calendar.', 'success');
      setShowLeaveModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to submit leave', 'error');
    }
  };

  const handleRequestSwap = async (e) => {
    e.preventDefault();
    try {
      await api.post('/roster-swaps', {
        requesting_doctor: user?.name || 'Dr. Vikram Malhotra',
        ...swapForm,
        status: 'PENDING'
      });
      showToast('Shift swap request sent for admin approval!', 'success');
      setShowSwapModal(false);
    } catch (err) {
      showToast(err.message || 'Failed to request swap', 'error');
    }
  };

  const filteredAppts = appointments.filter(a => {
    if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const checkedInAppts = appointments.filter(a => a.status === 'CHECKED_IN');
  const upcomingAppts = appointments.filter(a => a.status === 'SCHEDULED');
  const completedAppts = appointments.filter(a => a.status === 'COMPLETED');

  return (
    <div className="space-y-6">
      <Header
        title={`Clinical Workstation — ${user?.name || 'Dr. Vikram Malhotra'}`}
        subtitle="Patient consultation queue, electronic medical records (EMR), and digital prescription issuer."
      />

      <div className="px-6 space-y-6">
        {/* Doctor Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Patients Waiting in Queue" value={checkedInAppts.length} subtext="Checked-in & ready for consultation" icon={UserCheck} color="amber" />
          <StatCard title="Scheduled Today" value={upcomingAppts.length} subtext="Upcoming appointments" icon={Calendar} color="blue" />
          <StatCard title="Completed Consultations" value={completedAppts.length} subtext="Total patient cases resolved" icon={CheckCircle2} color="emerald" />
        </div>

        {/* Universal Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => { setSearch(''); setStatusFilter(''); }}
        />

        {/* Checked-in Patient Waiting Queue (Actionable Workspace) */}
        <div className="saas-card border-l-4 border-l-amber-500 bg-amber-50/20 space-y-4">
          <div className="flex flex-wrap justify-between items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 animate-pulse" /> Active Waiting Queue (OPD Arrived)
              </h3>
              <p className="text-xs text-slate-500 font-medium">Patients arrived at reception waiting for clinical evaluation</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSwapModal(true)} className="saas-btn-secondary text-xs flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Swap Shift
              </button>
              <button onClick={() => setShowLeaveModal(true)} className="saas-btn-secondary text-xs">
                Apply for Leave
              </button>
            </div>
          </div>

          {checkedInAppts.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed border-slate-200 text-slate-500 text-xs font-medium">
              No patients currently waiting in queue.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {checkedInAppts.map(appt => (
                <div key={appt.id} className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between shadow-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setSelectedPatientId(appt.patient_id || 1); setShowProfileModal(true); }}
                        className="font-bold text-slate-900 text-sm hover:text-[#0F4C81] hover:underline"
                      >
                        {appt.patient_name}
                      </button>
                      <Badge status={appt.status} />
                    </div>
                    <p className="text-xs text-slate-600 mt-1 font-medium">
                      <strong>Time:</strong> {appt.start_time ? appt.start_time.substring(0,5) : '09:00'} | <strong>Reason:</strong> {appt.reason}
                    </p>
                  </div>
                  <button
                    onClick={() => handleStartConsultation(appt)}
                    className="saas-btn-primary text-xs flex items-center gap-1.5"
                  >
                    <Stethoscope className="w-4 h-4" /> Begin Consult
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Master Assigned Appointments Table */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">All Assigned Patient Consultations</h3>
          <div className="overflow-x-auto">
            <table className="w-full saas-table text-xs">
              <thead>
                <tr>
                  <th>Appt #</th>
                  <th>Patient Name</th>
                  <th>Date & Time</th>
                  <th>Chief Clinical Reason</th>
                  <th>Status</th>
                  <th>Consultation Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppts.map(appt => (
                  <tr key={appt.id}>
                    <td className="font-mono font-bold text-slate-800">{appt.appointment_number}</td>
                    <td>
                      <button
                        onClick={() => { setSelectedPatientId(appt.patient_id || 1); setShowProfileModal(true); }}
                        className="font-bold text-slate-900 hover:text-[#0F4C81] hover:underline text-left"
                      >
                        {appt.patient_name}
                      </button>
                    </td>
                    <td className="text-slate-700">{appt.appointment_date} @ {appt.start_time ? appt.start_time.substring(0,5) : '09:00'}</td>
                    <td className="text-slate-600">{appt.reason}</td>
                    <td><Badge status={appt.status} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        {['CHECKED_IN', 'SCHEDULED'].includes(appt.status) && (
                          <button onClick={() => handleStartConsultation(appt)} className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1">
                            <Stethoscope className="w-3.5 h-3.5" /> Start Consult
                          </button>
                        )}
                        {appt.status === 'COMPLETED' && (
                          <button
                            onClick={() => {
                              setPrintDoc({ ...appt, documentType: 'PRESCRIPTION' });
                              setShowPrintModal(true);
                            }}
                            className="text-slate-700 hover:text-slate-900 font-bold flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-600" /> Print Rx
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Consultation EMR Modal */}
      {selectedAppt && (
        <MedicalRecordModal
          isOpen={showConsultationModal}
          onClose={() => setShowConsultationModal(false)}
          appointment={selectedAppt}
          onSuccess={fetchDoctorQueue}
        />
      )}

      {/* Patient Profile Drawer */}
      <PatientProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        patientId={selectedPatientId}
        onPrint={(data) => {
          setShowProfileModal(false);
          setPrintDoc({ ...data, documentType: 'PRESCRIPTION' });
          setShowPrintModal(true);
        }}
      />

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDoc?.documentType || 'PRESCRIPTION'}
        data={printDoc}
      />

      {/* Leave Application Modal */}
      <Modal isOpen={showLeaveModal} onClose={() => setShowLeaveModal(false)} title="Schedule Doctor Unavailability / Leave">
        <form onSubmit={handleRequestLeave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Start Date</label>
            <input type="date" required value={leaveForm.start_date} onChange={e => setLeaveForm({ ...leaveForm, start_date: e.target.value })} className="saas-input" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">End Date</label>
            <input type="date" required value={leaveForm.end_date} onChange={e => setLeaveForm({ ...leaveForm, end_date: e.target.value })} className="saas-input" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Leave</label>
            <textarea rows={2} required value={leaveForm.reason} onChange={e => setLeaveForm({ ...leaveForm, reason: e.target.value })} placeholder="Medical conference, personal leave..." className="saas-input" />
          </div>
          <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
            <button type="button" onClick={() => setShowLeaveModal(false)} className="saas-btn-secondary">Cancel</button>
            <button type="submit" className="saas-btn-primary">Submit Leave Request</button>
          </div>
        </form>
      </Modal>

      {/* Roster Swap Request Modal */}
      <Modal isOpen={showSwapModal} onClose={() => setShowSwapModal(false)} title="Request Doctor Shift Swap">
        <form onSubmit={handleRequestSwap} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Specialist Doctor for Swap</label>
            <select
              value={swapForm.target_doctor}
              onChange={e => setSwapForm({ ...swapForm, target_doctor: e.target.value })}
              className="saas-input"
            >
              <option value="Dr. Ananya Iyer">Dr. Ananya Iyer (Neurology)</option>
              <option value="Dr. Suresh Reddy">Dr. Suresh Reddy (Pediatrics)</option>
              <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (ER & Triage)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shift Date</label>
              <input type="date" required value={swapForm.shift_date} onChange={e => setSwapForm({ ...swapForm, shift_date: e.target.value })} className="saas-input" />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shift Type</label>
              <select value={swapForm.shift_type} onChange={e => setSwapForm({ ...swapForm, shift_type: e.target.value })} className="saas-input">
                <option value="MORNING_OPD">Morning OPD (08:00 - 16:00)</option>
                <option value="EVENING_OPD">Evening OPD (16:00 - 24:00)</option>
                <option value="NIGHT_DUTY">Night Duty (24:00 - 08:00)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Reason for Swap Request</label>
            <textarea rows={2} required value={swapForm.reason} onChange={e => setSwapForm({ ...swapForm, reason: e.target.value })} placeholder="Emergency surgery coverage..." className="saas-input" />
          </div>

          <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
            <button type="button" onClick={() => setShowSwapModal(false)} className="saas-btn-secondary">Cancel</button>
            <button type="submit" className="saas-btn-primary">Send Swap Request</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
