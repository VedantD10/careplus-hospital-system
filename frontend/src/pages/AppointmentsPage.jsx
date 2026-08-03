import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { EnterpriseDataTable } from '../components/common/EnterpriseDataTable';
import { BookAppointmentModal } from '../components/appointments/BookAppointmentModal';
import { MedicalRecordModal } from '../components/medical/MedicalRecordModal';
import { PatientProfileModal } from '../components/patients/PatientProfileModal';
import { PrintDocumentModal } from '../components/common/PrintDocumentModal';
import { FilterBar } from '../components/common/FilterBar';
import { ContextMenu } from '../components/common/ContextMenu';
import { useNotification } from '../context/NotificationContext';
import { Calendar, Plus, Stethoscope, CheckCircle2, Printer, MoreVertical, UserCheck } from 'lucide-react';

export const AppointmentsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();
  const [appointments, setAppointments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showBookModal, setShowBookModal] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [showConsultModal, setShowConsultModal] = useState(false);

  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [contextMenu, setContextMenu] = useState(null);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [doctorFilter, setDoctorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAppointments = async () => {
    try {
      const [apptsRes, deptsRes, docsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/departments').catch(() => []),
        api.get('/doctors').catch(() => [])
      ]);
      setAppointments(apptsRes || []);
      setDepartments(deptsRes || []);
      setDoctors(docsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (apptId, status) => {
    try {
      await api.patch(`/appointments/${apptId}/status`, { status });
      showToast(`Appointment status updated to ${status}`, 'success');
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Status update failed', 'error');
    }
  };

  const handleBulkCheckIn = async (selectedIds) => {
    try {
      await Promise.all(selectedIds.map(id => api.patch(`/appointments/${id}/status`, { status: 'CHECKED_IN' })));
      showToast(`${selectedIds.length} appointment(s) checked-in!`, 'success');
      fetchAppointments();
    } catch (err) {
      showToast('Bulk action failed', 'error');
    }
  };

  const handleContextMenu = (e, row) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        {
          label: 'Open Patient Profile',
          icon: UserCheck,
          onClick: () => {
            setSelectedPatientId(row.patient_id || 1);
            setShowProfileModal(true);
          }
        },
        {
          label: 'Check-In Patient',
          icon: CheckCircle2,
          onClick: () => handleUpdateStatus(row.id, 'CHECKED_IN')
        },
        {
          label: 'Start Consultation',
          icon: Stethoscope,
          onClick: () => {
            setSelectedAppt(row);
            setShowConsultModal(true);
          }
        },
        { divider: true },
        {
          label: 'Print Confirmation PDF',
          icon: Printer,
          onClick: () => {
            setPrintDoc({ ...row, documentType: 'PRESCRIPTION' });
            setShowPrintModal(true);
          }
        }
      ]
    });
  };

  const filteredData = appointments.filter(a => {
    if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && a.department_name !== deptFilter) return false;
    if (doctorFilter && a.doctor_name !== doctorFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const appointmentColumns = [
    { label: 'Appt #', key: 'appointment_number', render: val => <span className="font-mono font-bold text-slate-800 text-xs">{val}</span> },
    { label: 'Patient Name', key: 'patient_name', render: (val, row) => (
      <div>
        <button
          onClick={() => { setSelectedPatientId(row.patient_id || 1); setShowProfileModal(true); }}
          className="font-bold text-slate-900 hover:text-[#0F4C81] hover:underline text-left"
        >
          {val}
        </button>
        <div className="text-[11px] text-slate-500 font-mono">MRN-2026-880{row.patient_id}</div>
      </div>
    )},
    { label: 'Doctor & Room', key: 'doctor_name', render: (val, row) => `${val} (${row.doctor_room})` },
    { label: 'Department', key: 'department_name', render: val => <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded text-xs">{val}</span> },
    { label: 'Date & Time', key: 'start_time', render: (val, row) => `${row.appointment_date} @ ${val.substring(0,5)}` },
    { label: 'Status', key: 'status', render: val => <Badge status={val} /> },
    { label: 'Operational Actions', key: 'id', render: (val, appt) => (
      <div className="flex items-center gap-2">
        {appt.status === 'SCHEDULED' && (
          <button onClick={() => handleUpdateStatus(appt.id, 'CHECKED_IN')} className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Check-In
          </button>
        )}
        {['SCHEDULED', 'CHECKED_IN'].includes(appt.status) && (
          <button onClick={() => { setSelectedAppt(appt); setShowConsultModal(true); }} className="text-teal-700 hover:text-teal-900 font-bold text-xs flex items-center gap-1">
            <Stethoscope className="w-3.5 h-3.5" /> Consult
          </button>
        )}
        <button
          onClick={(e) => handleContextMenu(e, appt)}
          className="p-1 rounded text-slate-400 hover:text-slate-700"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <Header title="Master Appointment Operations" subtitle="Schedule, triage, check-in, and manage consultation queues across all departments." />

      <div className="px-6 space-y-4">
        {/* Multi-Facet Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          department={deptFilter}
          onDepartmentChange={setDeptFilter}
          departments={departments}
          doctor={doctorFilter}
          onDoctorChange={setDoctorFilter}
          doctors={doctors}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => { setSearch(''); setDeptFilter(''); setDoctorFilter(''); setStatusFilter(''); }}
        />

        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-500 font-mono">Showing {filteredData.length} of {appointments.length} appointments</span>
          <button onClick={() => setShowBookModal(true)} className="saas-btn-primary text-xs flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Book New Appointment
          </button>
        </div>

        <EnterpriseDataTable
          title="CarePlus Master Appointment Directory"
          subtitle="Support sorting, multi-facet filter, pagination, bulk check-in, and expandable row details."
          columns={appointmentColumns}
          data={filteredData}
          bulkActions={[
            { label: 'Bulk Check-In Selected', onClick: handleBulkCheckIn }
          ]}
          renderExpandedRow={(row) => (
            <div className="grid grid-cols-3 gap-4 text-xs">
              <div><strong>Chief Complaint / Reason:</strong> {row.reason}</div>
              <div><strong>Contact Email:</strong> {row.patient_email}</div>
              <div><strong>Specialization:</strong> {row.doctor_specialization}</div>
            </div>
          )}
          exportFileName="careplus_appointments.csv"
        />
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          actions={contextMenu.actions}
        />
      )}

      <BookAppointmentModal
        isOpen={showBookModal}
        onClose={() => setShowBookModal(false)}
        onSuccess={fetchAppointments}
      />

      {selectedAppt && (
        <MedicalRecordModal
          isOpen={showConsultModal}
          onClose={() => setShowConsultModal(false)}
          appointment={selectedAppt}
          onSuccess={fetchAppointments}
        />
      )}

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

      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDoc?.documentType || 'PRESCRIPTION'}
        data={printDoc}
      />
    </div>
  );
};
