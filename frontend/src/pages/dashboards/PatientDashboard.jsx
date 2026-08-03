import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal';
import { InvoiceModal } from '../../components/billing/InvoiceModal';
import { PrintDocumentModal } from '../../components/common/PrintDocumentModal';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar,
  FileText,
  CreditCard,
  Plus,
  Download,
  Stethoscope,
  CheckCircle2,
  Printer,
  HeartPulse
} from 'lucide-react';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Print Modal
  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const fetchPatientData = async () => {
    try {
      const [apptsRes, billsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/bills')
      ]);
      setAppointments(apptsRes || []);
      setBills(billsRes || []);

      if (user?.patientId || 1) {
        const recordsRes = await api.get(`/medical-records/patient/${user?.patientId || 1}`).catch(() => []);
        setMedicalRecords(recordsRes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [user]);

  const handleCancelAppt = async (apptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.patch(`/appointments/${apptId}/status`, {
        status: 'CANCELLED',
        cancellationReason: 'Cancelled by patient'
      });
      showToast('Appointment cancelled.', 'info');
      fetchPatientData();
    } catch (err) {
      showToast(err.message || 'Failed to cancel', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Header title={`Welcome back, ${user?.name || 'Aarav Verma'}`} subtitle="Your personal CarePlus healthcare portal, appointment history, and medical records." />

      <div className="px-6 space-y-6">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-xl p-6 shadow-md border border-teal-700/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs px-2.5 py-0.5 rounded-full font-semibold">
              Verified Patient Account • MRN-2026-8801
            </span>
            <h2 className="text-xl font-bold mt-2">Need to see a specialist doctor?</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-md">
              Book consultations with specialist doctors in Cardiology, Neurology, Pediatrics, and General Medicine. Real-time slot reservation.
            </p>
          </div>
          <button onClick={() => setShowBookModal(true)} className="saas-btn-primary bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold px-5 py-2.5">
            <Plus className="w-4 h-4" /> Book Appointment Now
          </button>
        </div>

        {/* Health Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="My Appointments" value={appointments.length} subtext="Total scheduled visits" icon={Calendar} color="blue" />
          <StatCard title="Medical Records" value={medicalRecords.length} subtext="Clinical consultation reports" icon={FileText} color="teal" />
          <StatCard title="Billing History" value={`₹${bills.reduce((s,b)=>s+Number(b.total_amount),0).toFixed(2)}`} subtext="Healthcare statement fees" icon={CreditCard} color="emerald" />
        </div>

        {/* My Appointments List */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">My Scheduled & Past Appointments</h3>
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No appointments booked yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full saas-table text-xs">
                <thead>
                  <tr>
                    <th>Appt #</th>
                    <th>Doctor & Room</th>
                    <th>Department</th>
                    <th>Date & Time</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id}>
                      <td className="font-mono text-xs font-bold text-slate-800">{appt.appointment_number}</td>
                      <td className="font-semibold text-slate-900">{appt.doctor_name} ({appt.doctor_room})</td>
                      <td><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono">{appt.department_code}</span></td>
                      <td className="text-slate-700">{appt.appointment_date} @ {appt.start_time ? appt.start_time.substring(0,5) : '09:00'}</td>
                      <td className="text-slate-600">{appt.reason}</td>
                      <td><Badge status={appt.status} /></td>
                      <td>
                        {['SCHEDULED', 'CHECKED_IN'].includes(appt.status) && (
                          <button onClick={() => handleCancelAppt(appt.id)} className="text-rose-600 hover:text-rose-800 text-xs font-semibold">
                            Cancel
                          </button>
                        )}
                        {appt.status === 'COMPLETED' && (
                          <button
                            onClick={() => {
                              setPrintDoc({ ...appt, documentType: 'PRESCRIPTION' });
                              setShowPrintModal(true);
                            }}
                            className="saas-btn-secondary py-1 text-xs flex items-center gap-1"
                          >
                            <Printer className="w-3.5 h-3.5 text-teal-700" /> Print Rx
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EMR Prescriptions & Diagnosis History */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-teal-700" /> My Medical Records & Prescriptions
          </h3>
          {medicalRecords.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No medical records generated yet.</div>
          ) : (
            <div className="space-y-3">
              {medicalRecords.map(rec => (
                <div key={rec.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">{rec.doctor_name || 'Dr. Vikram Malhotra'}</span>
                      <span className="text-slate-400 font-mono text-[11px] ml-2">{new Date(rec.created_at).toLocaleDateString()}</span>
                    </div>
                    <button
                      onClick={() => {
                        setPrintDoc({ ...rec, patient_name: user?.name, documentType: 'PRESCRIPTION' });
                        setShowPrintModal(true);
                      }}
                      className="saas-btn-primary py-1 text-xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Download Prescription PDF
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-700">
                    <div><strong>Vitals BP:</strong> {rec.vitals_bp || '130/84 mmHg'} | <strong>Pulse:</strong> {rec.vitals_pulse || '76 bpm'}</div>
                    <div><strong>Diagnosis:</strong> <span className="font-bold text-teal-800">{rec.diagnosis}</span></div>
                  </div>
                  <div className="bg-white p-2.5 rounded border border-slate-200 text-slate-700">
                    <strong>Treatment Plan:</strong> {rec.treatment_plan}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing Ledger */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Billing Statements & Invoices</h3>
          {bills.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">No billing records.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full saas-table text-xs">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Consultation Fee</th>
                    <th>Medication Charges</th>
                    <th>Total Payable</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map(bill => (
                    <tr key={bill.id}>
                      <td className="font-mono font-bold text-slate-800">{bill.bill_number}</td>
                      <td>₹{Number(bill.consultation_fee).toFixed(2)}</td>
                      <td>₹{Number(bill.medication_fee).toFixed(2)}</td>
                      <td className="font-bold text-teal-800">₹{Number(bill.total_amount).toFixed(2)}</td>
                      <td><Badge status={bill.payment_status} /></td>
                      <td>
                        <button
                          onClick={() => {
                            setPrintDoc({ ...bill, patient_name: user?.name, documentType: 'INVOICE' });
                            setShowPrintModal(true);
                          }}
                          className="saas-btn-secondary py-1 text-xs flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5 text-teal-700" /> View / Print PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={fetchPatientData}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        bill={selectedBill}
        onSuccess={fetchPatientData}
      />

      {/* Print Document Modal */}
      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDoc?.documentType || 'PRESCRIPTION'}
        data={printDoc}
      />
    </div>
  );
};
