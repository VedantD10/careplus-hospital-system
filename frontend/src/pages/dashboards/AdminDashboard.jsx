import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { Badge } from '../../components/common/Badge';
import { EnterpriseDataTable } from '../../components/common/EnterpriseDataTable';
import { LiveActivityTicker } from '../../components/common/LiveActivityTicker';
import { BedOccupancyGrid } from '../../components/common/BedOccupancyGrid';
import { ContextMenu } from '../../components/common/ContextMenu';
import { PatientProfileModal } from '../../components/patients/PatientProfileModal';
import { BedTransferModal } from '../../components/common/BedTransferModal';
import { PrintDocumentModal } from '../../components/common/PrintDocumentModal';
import { Modal } from '../../components/common/Modal';
import { FilterBar } from '../../components/common/FilterBar';
import { useNotification } from '../../context/NotificationContext';
import {
  Users,
  DollarSign,
  Activity,
  UserCheck,
  Building2,
  TrendingUp,
  Plus,
  ShieldAlert,
  Bed,
  CheckCircle2,
  FileCheck,
  Stethoscope,
  Scissors,
  FlaskConical,
  Clock,
  Siren,
  Truck,
  HeartPulse,
  MoreVertical,
  Printer,
  ArrowRightLeft,
  RefreshCcw,
  Check
} from 'lucide-react';

export const AdminDashboard = () => {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState('queue');
  const [loading, setLoading] = useState(true);

  // Operational Data
  const [analytics, setAnalytics] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [insuranceClaims, setInsuranceClaims] = useState([]);
  const [surgeries, setSurgeries] = useState([]);
  const [rosterSwaps, setRosterSwaps] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Modals & Action States
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [showBedModal, setShowBedModal] = useState(false);
  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptForm, setDeptForm] = useState({ name: '', code: '', description: '', consultation_fee: 1000 });

  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null);

  // Filter Bar State
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const fetchOperationalData = async () => {
    try {
      const [
        analyticsRes,
        apptsRes,
        patientsRes,
        bedsRes,
        insuranceRes,
        surgeriesRes,
        rosterRes,
        incidentsRes,
        deptRes
      ] = await Promise.all([
        api.get('/admin/analytics').catch(() => ({ summaryCards: { totalRevenue: 28000000, pendingRevenue: 450000, occupancyRate: 94, totalPatients: 1456, totalDoctors: 42 } })),
        api.get('/appointments').catch(() => []),
        api.get('/patients').catch(() => []),
        api.get('/beds').catch(() => []),
        api.get('/insurance-claims').catch(() => []),
        api.get('/surgeries').catch(() => []),
        api.get('/roster-swaps').catch(() => []),
        api.get('/incidents').catch(() => []),
        api.get('/departments').catch(() => [])
      ]);

      setAnalytics(analyticsRes);
      setAppointments(apptsRes || []);
      setPatients(patientsRes || []);
      setBeds(bedsRes || []);
      setInsuranceClaims(insuranceRes || []);
      setSurgeries(surgeriesRes || []);
      setRosterSwaps(rosterRes || []);
      setIncidents(incidentsRes || []);
      setDepartments(deptRes || []);
    } catch (err) {
      console.error('Failed to load MEDINEX operational data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalData();
    // Auto-refresh simulation ticker every 15 seconds
    const interval = setInterval(fetchOperationalData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleBulkCheckIn = async (selectedIds) => {
    try {
      await Promise.all(selectedIds.map(id => api.patch(`/appointments/${id}/status`, { status: 'CHECKED_IN' })));
      showToast(`${selectedIds.length} patient(s) marked CHECKED-IN!`, 'success');
      fetchOperationalData();
    } catch (err) {
      showToast('Bulk check-in failed', 'error');
    }
  };

  const handleApproveInsurance = async (claimId) => {
    try {
      await api.patch(`/insurance-claims/${claimId}`, { status: 'APPROVED', approved_amount: 85000 });
      showToast(`TPA Claim #${claimId} Pre-Authorization Approved!`, 'success');
      fetchOperationalData();
    } catch (err) {
      showToast('Insurance approval failed', 'error');
    }
  };

  const handleApproveRosterSwap = async (swapId) => {
    try {
      await api.patch(`/roster-swaps/${swapId}`, { status: 'APPROVED' });
      showToast(`Doctor Roster Shift Swap #${swapId} Approved!`, 'success');
      fetchOperationalData();
    } catch (err) {
      showToast('Roster swap approval failed', 'error');
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    try {
      await api.post('/departments', deptForm);
      showToast(`Department ${deptForm.name} created successfully!`, 'success');
      setShowDeptModal(false);
      fetchOperationalData();
    } catch (err) {
      showToast(err.message || 'Failed to create department', 'error');
    }
  };

  const handleOpenContextMenu = (e, row, type = 'APPOINTMENT') => {
    e.preventDefault();
    let actions = [];

    if (type === 'APPOINTMENT') {
      actions = [
        {
          label: 'Open Full Clinical Profile',
          icon: UserCheck,
          onClick: () => {
            setSelectedPatientId(row.patient_id || 1);
            setShowProfileModal(true);
          }
        },
        {
          label: 'Instant Check-In Patient',
          icon: CheckCircle2,
          onClick: async () => {
            await api.patch(`/appointments/${row.id}/status`, { status: 'CHECKED_IN' });
            showToast(`Patient ${row.patient_name} marked CHECKED-IN`, 'success');
            fetchOperationalData();
          }
        },
        {
          label: 'Transfer Bed / Ward Location',
          icon: ArrowRightLeft,
          onClick: () => {
            const targetBed = beds.find(b => b.patient_name === row.patient_name) || beds[0];
            setSelectedBed(targetBed);
            setShowBedModal(true);
          }
        },
        { divider: true },
        {
          label: 'Print Appointment Confirmation',
          icon: Printer,
          onClick: () => {
            setPrintDoc({ ...row, documentType: 'PRESCRIPTION' });
            setShowPrintModal(true);
          }
        }
      ];
    }

    setContextMenu({ x: e.clientX, y: e.clientY, actions });
  };

  // Filter logic
  const filteredAppointments = appointments.filter(a => {
    if (search && !JSON.stringify(a).toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && a.department_name !== deptFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">
        Initializing MEDINEX Command Center (Enterprise HIS 500-Bed Facility System)...
      </div>
    );
  }

  // Enterprise Table Definitions
  const queueColumns = [
    { label: 'Appt #', key: 'appointment_number', render: val => <span className="font-mono font-bold text-slate-900">{val || 'CP-2026'}</span> },
    { label: 'Patient Name', key: 'patient_name', render: (val, row) => (
      <div>
        <button
          onClick={() => { setSelectedPatientId(row.patient_id || 1); setShowProfileModal(true); }}
          className="font-bold text-slate-900 hover:text-[#0F4C81] text-left hover:underline"
        >
          {val || 'Patient'}
        </button>
        <div className="text-[11px] text-slate-500 font-mono">MRN-2026-880{row?.patient_id || '1'}</div>
      </div>
    )},
    { label: 'Specialist Doctor', key: 'doctor_name', render: (val, row) => `${val || 'Dr. Doctor'} (${row?.doctor_room || 'OPD 302'})` },
    { label: 'Department', key: 'department_name', render: val => <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium">{val || 'General'}</span> },
    { label: 'Time Slot', key: 'start_time', render: (val, row) => `${row?.appointment_date || ''} @ ${val ? String(val).substring(0,5) : '09:00'}` },
    { label: 'Status', key: 'status', render: val => <Badge status={val} /> },
    { label: 'Quick Action', key: 'id', render: (val, row) => (
      <button
        onClick={(e) => handleOpenContextMenu(e, row, 'APPOINTMENT')}
        className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
        title="Contextual Quick Actions"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    )}
  ];

  const insuranceColumns = [
    { label: 'Claim #', key: 'claim_number', render: val => <span className="font-mono font-bold text-[#0F4C81]">{val || 'TPA-000'}</span> },
    { label: 'Patient Name', key: 'patient_name', render: (val, row) => <div><div className="font-bold">{val || 'Patient'}</div><div className="text-[11px] text-slate-500 font-mono">{row?.mrn || 'MRN-2026'}</div></div> },
    { label: 'TPA Provider', key: 'provider' },
    { label: 'Policy Number', key: 'policy_number', render: val => <span className="font-mono text-xs">{val || 'N/A'}</span> },
    { label: 'Claimed (₹)', key: 'claimed_amount', render: val => `₹${Number(val || 0).toLocaleString('en-IN')}` },
    { label: 'Status', key: 'status', render: val => <span className={`px-2 py-0.5 rounded text-xs font-bold ${val === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{val || 'PENDING'}</span> },
    { label: 'Action', key: 'id', render: (val, row) => row?.status !== 'APPROVED' ? (
      <button onClick={() => handleApproveInsurance(val)} className="saas-btn-primary py-1 text-xs">
        Approve Pre-Auth
      </button>
    ) : <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Approved</span> }
  ];

  const surgeryColumns = [
    { label: 'Case #', key: 'case_number', render: val => <span className="font-mono font-bold text-slate-900">{val}</span> },
    { label: 'Patient Name', key: 'patient_name', render: (val, row) => <div><div className="font-bold">{val}</div><div className="text-[11px] text-slate-500 font-mono">{row.mrn}</div></div> },
    { label: 'Procedure', key: 'procedure', render: val => <span className="font-semibold text-slate-900">{val}</span> },
    { label: 'Surgeon & Anesthetist', key: 'primary_surgeon', render: (val, row) => <div><div>{val}</div><div className="text-[11px] text-slate-500">{row.anesthetist}</div></div> },
    { label: 'OT Suite', key: 'ot_room', render: val => <span className="bg-slate-100 font-mono text-xs px-2 py-0.5 rounded font-bold">{val}</span> },
    { label: 'Status', key: 'status', render: val => <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded text-xs font-bold border border-emerald-200">{val}</span> }
  ];

  const rosterColumns = [
    { label: 'Req Doctor', key: 'requesting_doctor', render: val => <span className="font-bold text-slate-900">{val}</span> },
    { label: 'Target Swap Doctor', key: 'target_doctor' },
    { label: 'Shift Date', key: 'shift_date', render: val => <span className="font-mono">{val}</span> },
    { label: 'Shift Type', key: 'shift_type', render: val => <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-xs font-semibold">{val}</span> },
    { label: 'Reason', key: 'reason', render: val => <span className="text-xs text-slate-600">{val}</span> },
    { label: 'Status', key: 'status', render: val => <span className={`px-2 py-0.5 rounded text-xs font-bold ${val === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{val}</span> },
    { label: 'Action', key: 'id', render: (val, row) => row.status !== 'APPROVED' ? (
      <button onClick={() => handleApproveRosterSwap(val)} className="saas-btn-primary py-1 text-xs">
        Approve Swap
      </button>
    ) : <span className="text-xs text-emerald-700 font-semibold">Approved</span> }
  ];

  return (
    <div className="space-y-6">
      <Header
        title="Hospital Command Center (500-Bed Acute Care)"
        subtitle="MEDINEX Enterprise HIS • Real-time clinical operations, bed capacity, surgery schedules, and TPA pre-authorizations."
      />

      <div className="px-6 space-y-6">
        {/* Enterprise KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</div>
            <div className="text-lg font-extrabold text-[#0F4C81] mt-0.5">94%</div>
            <div className="text-[10px] text-slate-500 font-mono">470 / 500 Beds Active</div>
          </div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Patients</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">1,456</div>
            <div className="text-[10px] text-slate-500 font-mono">1,144 Outpatient • 312 Inpatient</div>
          </div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Live OPD Queue</div>
            <div className="text-lg font-extrabold text-[#007C91] mt-0.5">{appointments.length}</div>
            <div className="text-[10px] text-slate-500 font-mono">Consultations Today</div>
          </div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Emergency Cases</div>
            <div className="text-lg font-extrabold text-rose-700 mt-0.5">48</div>
            <div className="text-[10px] text-slate-500 font-mono">12 Ambulances Available</div>
          </div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Staff On Shift</div>
            <div className="text-lg font-extrabold text-slate-900 mt-0.5">170</div>
            <div className="text-[10px] text-slate-500 font-mono">42 Doctors • 128 Nurses</div>
          </div>
          <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Monthly Revenue</div>
            <div className="text-lg font-extrabold text-emerald-800 mt-0.5">₹2.8 Cr</div>
            <div className="text-[10px] text-slate-500 font-mono">{insuranceClaims.length} Active TPA Claims</div>
          </div>
        </div>

        {/* Universal Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          department={deptFilter}
          onDepartmentChange={setDeptFilter}
          departments={departments}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          onReset={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}
        />

        {/* Live Activity Ticker & Operations Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <LiveActivityTicker incidents={incidents} />
          </div>

          <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-[#0F4C81]" /> Clinical Matrix
              </h3>
              <button onClick={fetchOperationalData} className="p-1 text-slate-400 hover:text-slate-700">
                <RefreshCcw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Active OT Surgeries Scheduled:</span>
                <span className="font-bold text-slate-900 font-mono">{surgeries.length} Cases</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Pending TPA Pre-Auth Clearance:</span>
                <span className="font-bold text-amber-800 font-mono">{insuranceClaims.filter(c => c.status !== 'APPROVED').length} Claims</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Doctor Roster Swap Requests:</span>
                <span className="font-bold text-teal-800 font-mono">{rosterSwaps.filter(r => r.status === 'PENDING').length} Pending</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-600">Average ER Triage Response:</span>
                <span className="font-bold text-slate-900 font-mono">4.2 Mins</span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Workspace Navigation Tabs */}
        <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'queue' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4" /> Live Patient Queue ({filteredAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'insurance' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileCheck className="w-4 h-4" /> TPA Pre-Auth Ledger ({insuranceClaims.length})
          </button>
          <button
            onClick={() => setActiveTab('beds')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'beds' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Bed className="w-4 h-4" /> 500-Bed Allocation Grid
          </button>
          <button
            onClick={() => setActiveTab('surgeries')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'surgeries' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Scissors className="w-4 h-4" /> Surgery & OT Schedule ({surgeries.length})
          </button>
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'roster' ? 'border-[#0F4C81] text-[#0F4C81] bg-slate-50' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" /> Doctor Roster Swaps ({rosterSwaps.length})
          </button>
        </div>

        {/* Tab 1: Live Patient Queue */}
        {activeTab === 'queue' && (
          <EnterpriseDataTable
            title="Live Admissions & OPD Consultation Directory"
            subtitle="Right click or click menu icon for contextual patient actions."
            columns={queueColumns}
            data={filteredAppointments}
            bulkActions={[
              { label: 'Bulk Check-In Selected', onClick: handleBulkCheckIn }
            ]}
            renderExpandedRow={(row) => (
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div><strong>Chief Symptoms:</strong> {row?.reason || 'Routine consultation'}</div>
                <div><strong>Assigned OPD Room:</strong> {row?.doctor_room || 'OPD 302'}</div>
                <div><strong>Consultation Fee Rate:</strong> ₹{row?.consultation_fee || 1000}</div>
              </div>
            )}
            exportFileName="medinex_patient_queue.csv"
          />
        )}

        {/* Tab 2: Insurance TPA Workspace */}
        {activeTab === 'insurance' && (
          <EnterpriseDataTable
            title="TPA Insurance & Pre-Authorization Ledger"
            subtitle="Review or approve medical insurance claims submitted by hospital TPA partners."
            columns={insuranceColumns}
            data={insuranceClaims}
            exportFileName="medinex_insurance_claims.csv"
          />
        )}

        {/* Tab 3: Bed Occupancy Grid */}
        {activeTab === 'beds' && (
          <BedOccupancyGrid beds={beds} onUpdate={fetchOperationalData} />
        )}

        {/* Tab 4: Surgery & OT Schedule */}
        {activeTab === 'surgeries' && (
          <EnterpriseDataTable
            title="Operation Theatre (OT) Surgical Suite Schedule"
            subtitle="Monitor ongoing and scheduled surgeries across OT Suites 1-6."
            columns={surgeryColumns}
            data={surgeries}
            exportFileName="medinex_ot_surgeries.csv"
          />
        )}

        {/* Tab 5: Doctor Roster Swaps */}
        {activeTab === 'roster' && (
          <EnterpriseDataTable
            title="Doctor Duty Shift & Roster Swap Approvals"
            subtitle="Review requested shift swaps submitted by medical specialists."
            columns={rosterColumns}
            data={rosterSwaps}
            exportFileName="medinex_roster_swaps.csv"
          />
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          actions={contextMenu.actions}
        />
      )}

      {/* Patient Profile Drawer */}
      <PatientProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        patientId={selectedPatientId}
        onPrint={(patientData) => {
          setShowProfileModal(false);
          setPrintDoc({ ...patientData, documentType: 'PRESCRIPTION' });
          setShowPrintModal(true);
        }}
      />

      {/* Bed Transfer Modal */}
      <BedTransferModal
        isOpen={showBedModal}
        onClose={() => setShowBedModal(false)}
        bed={selectedBed}
        onSuccess={fetchOperationalData}
      />

      {/* Print Preview Modal */}
      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDoc?.documentType || 'PRESCRIPTION'}
        data={printDoc}
      />

      {/* Add Department Modal */}
      <Modal isOpen={showDeptModal} onClose={() => setShowDeptModal(false)} title="Create New Clinical Department">
        <form onSubmit={handleCreateDept} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Name</label>
            <input type="text" required value={deptForm.name} onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} className="saas-input" placeholder="e.g. Oncology" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Department Code</label>
            <input type="text" required value={deptForm.code} onChange={e => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })} className="saas-input" placeholder="e.g. ONCO" />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Standard Consultation Fee (₹)</label>
            <input type="number" required value={deptForm.consultation_fee} onChange={e => setDeptForm({ ...deptForm, consultation_fee: Number(e.target.value) })} className="saas-input" />
          </div>
          <div className="pt-3 flex justify-end gap-3 border-t border-slate-200">
            <button type="button" onClick={() => setShowDeptModal(false)} className="saas-btn-secondary">Cancel</button>
            <button type="submit" className="saas-btn-primary">Save Department</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
