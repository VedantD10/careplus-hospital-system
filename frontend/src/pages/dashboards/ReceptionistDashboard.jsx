import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { BookAppointmentModal } from '../../components/appointments/BookAppointmentModal';
import { InvoiceModal } from '../../components/billing/InvoiceModal';
import { PatientProfileModal } from '../../components/patients/PatientProfileModal';
import { PrintDocumentModal } from '../../components/common/PrintDocumentModal';
import { FilterBar } from '../../components/common/FilterBar';
import { useNotification } from '../../context/NotificationContext';
import { Users, Calendar, CheckCircle2, UserPlus, Receipt, Search, Clock, Plus, Printer, User } from 'lucide-react';

export const ReceptionistDashboard = () => {
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = async () => {
    try {
      const [apptsRes, billsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/bills')
      ]);
      setAppointments(apptsRes || []);
      setBills(billsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckIn = async (apptId) => {
    try {
      await api.patch(`/appointments/${apptId}/status`, { status: 'CHECKED_IN' });
      showToast('Patient marked CHECKED-IN and added to doctor queue!', 'success');
      fetchData();
    } catch (err) {
      showToast(err.message || 'Check-in failed', 'error');
    }
  };

  const filteredAppts = appointments.filter(a => {
    if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const scheduledToday = appointments.filter(a => a.status === 'SCHEDULED');
  const checkedInToday = appointments.filter(a => a.status === 'CHECKED_IN');
  const pendingPayments = bills.filter(b => b.payment_status === 'PENDING');

  return (
    <div className="space-y-6">
      <Header
        title="Admissions & Reception Workstation"
        subtitle="Patient arrival check-in desk, appointment scheduling, and cashier billing."
      />

      <div className="px-6 space-y-6">
        {/* Reception Action Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Today Scheduled Arrivals" value={scheduledToday.length} subtext="Awaiting check-in at front desk" icon={Calendar} color="blue" />
          <StatCard title="Checked-In (Waiting Room)" value={checkedInToday.length} subtext="Patients waiting for doctor call" icon={CheckCircle2} color="amber" />
          <StatCard title="Pending Invoices" value={pendingPayments.length} subtext="Uncollected billing fees" icon={Receipt} color="rose" />
        </div>

        {/* Universal Multi-Facet Filter */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => { setSearch(''); setStatusFilter(''); }}
        />

        {/* Quick Action Command Bar */}
        <div className="saas-card flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-100">Front Desk Command Desk</h3>
            <p className="text-xs text-slate-400 font-medium">Perform instant patient check-in or schedule new consultations with conflict detection</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setShowBookModal(true)} className="saas-btn-primary text-xs flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Schedule Appointment
            </button>
          </div>
        </div>

        {/* Check-In Desk Table */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Today's Arrival Queue & Check-In Desk</h3>
          <div className="overflow-x-auto">
            <table className="w-full saas-table text-xs">
              <thead>
                <tr>
                  <th>Appt #</th>
                  <th>Patient Name</th>
                  <th>Doctor & Room</th>
                  <th>Department</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Check-In Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppts.map(appt => (
                  <tr key={appt.id}>
                    <td className="font-mono text-xs text-slate-600 font-semibold">{appt.appointment_number}</td>
                    <td>
                      <button
                        onClick={() => { setSelectedPatientId(appt.patient_id || 1); setShowProfileModal(true); }}
                        className="font-bold text-slate-900 hover:text-[#0F4C81] hover:underline text-left"
                      >
                        {appt.patient_name}
                      </button>
                    </td>
                    <td className="text-slate-700">{appt.doctor_name} ({appt.doctor_room})</td>
                    <td><span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-mono font-medium">{appt.department_code}</span></td>
                    <td className="font-semibold text-slate-800">{appt.start_time ? appt.start_time.substring(0,5) : '09:00'}</td>
                    <td><Badge status={appt.status} /></td>
                    <td>
                      {appt.status === 'SCHEDULED' && (
                        <button onClick={() => handleCheckIn(appt.id)} className="saas-btn-primary py-1 text-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Check-In Patient
                        </button>
                      )}
                      {appt.status === 'CHECKED_IN' && (
                        <span className="text-xs text-amber-800 font-semibold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">Checked-In (Waiting)</span>
                      )}
                      {appt.status === 'COMPLETED' && (
                        <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Consult Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cashier & Pending Invoices Desk */}
        <div className="saas-card space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Cashier Desk — Post-Consultation Invoices</h3>
          <div className="overflow-x-auto">
            <table className="w-full saas-table text-xs">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Patient Name</th>
                  <th>Consultation Fee</th>
                  <th>Medication Fee</th>
                  <th>Total Payable</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bills.map(bill => (
                  <tr key={bill.id}>
                    <td className="font-mono text-xs font-bold text-slate-800">{bill.bill_number}</td>
                    <td className="font-semibold text-slate-900">{bill.patient_name}</td>
                    <td className="text-slate-700">₹{Number(bill.consultation_fee).toFixed(2)}</td>
                    <td className="text-slate-700">₹{Number(bill.medication_fee).toFixed(2)}</td>
                    <td className="font-bold text-teal-800">₹{Number(bill.total_amount).toFixed(2)}</td>
                    <td><Badge status={bill.payment_status} /></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => { setSelectedBill(bill); setShowInvoiceModal(true); }}
                          className="saas-btn-secondary py-1 text-xs flex items-center gap-1"
                        >
                          <Receipt className="w-3.5 h-3.5 text-teal-700" />
                          {bill.payment_status === 'PENDING' ? 'Collect Payment' : 'View Invoice'}
                        </button>

                        <button
                          onClick={() => {
                            setPrintDoc({ ...bill, documentType: 'INVOICE' });
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="Print Official Invoice PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={fetchData}
      />

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        bill={selectedBill}
        onSuccess={fetchData}
      />

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
        documentType={printDoc?.documentType || 'INVOICE'}
        data={printDoc}
      />
    </div>
  );
};
