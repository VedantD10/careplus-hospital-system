import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { EnterpriseDataTable } from '../components/common/EnterpriseDataTable';
import { PatientProfileModal } from '../components/patients/PatientProfileModal';
import { BedTransferModal } from '../components/common/BedTransferModal';
import { PrintDocumentModal } from '../components/common/PrintDocumentModal';
import { FilterBar } from '../components/common/FilterBar';
import { ContextMenu } from '../components/common/ContextMenu';
import { Users, User, HeartPulse, Bed, ArrowRightLeft, Printer, MoreVertical, ShieldAlert } from 'lucide-react';

export const PatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [selectedBed, setSelectedBed] = useState(null);
  const [showBedModal, setShowBedModal] = useState(false);

  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  const [contextMenu, setContextMenu] = useState(null);

  // Filters
  const [search, setSearch] = useState('');

  const fetchPatientsData = async () => {
    try {
      const [patsRes, bedsRes] = await Promise.all([
        api.get('/patients'),
        api.get('/beds').catch(() => [])
      ]);
      setPatients(patsRes || []);
      setBeds(bedsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientsData();
  }, []);

  const handleOpenContextMenu = (e, row) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      actions: [
        {
          label: 'Open Full Clinical Profile',
          icon: User,
          onClick: () => {
            setSelectedPatientId(row.id);
            setShowProfileModal(true);
          }
        },
        {
          label: 'Transfer Bed / Inpatient Ward',
          icon: ArrowRightLeft,
          onClick: () => {
            const currentBed = beds.find(b => b.patient_name === row.name) || beds[0];
            setSelectedBed({ ...currentBed, patient_name: row.name });
            setShowBedModal(true);
          }
        },
        { divider: true },
        {
          label: 'Print Patient Record Summary',
          icon: Printer,
          onClick: () => {
            setPrintDoc({ ...row, documentType: 'PRESCRIPTION' });
            setShowPrintModal(true);
          }
        }
      ]
    });
  };

  const filteredPatients = patients.filter(p => {
    if (search && !JSON.stringify(p).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    { label: 'MRN Number', key: 'mrn', render: val => <span className="font-mono font-bold text-[#0F4C81]">{val || 'MRN-2026-8801'}</span> },
    { label: 'Patient Full Name', key: 'name', render: (val, row) => (
      <div>
        <button
          onClick={() => { setSelectedPatientId(row.id); setShowProfileModal(true); }}
          className="font-bold text-slate-900 hover:text-[#0F4C81] hover:underline text-left"
        >
          {val}
        </button>
        <div className="text-[11px] text-slate-500">{row.email || 'patient@careplus.com'}</div>
      </div>
    )},
    { label: 'Demographics', key: 'gender', render: (val, row) => `${val || 'MALE'} • DOB: ${row.date_of_birth || '1988-04-12'}` },
    { label: 'Blood Group', key: 'blood_group', render: val => <span className="bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded text-xs border border-rose-200">{val || 'O+'}</span> },
    { label: 'Current Bed Unit', key: 'current_bed', render: val => <span className="bg-slate-100 font-mono text-xs px-2 py-0.5 rounded font-bold text-slate-800">{val || 'ICU-B04'}</span> },
    { label: 'Triage Category', key: 'triage_level', render: val => <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200">{val || 'Urgent'}</span> },
    { label: 'Actions', key: 'id', render: (val, row) => (
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setSelectedPatientId(row.id); setShowProfileModal(true); }}
          className="saas-btn-primary py-1 text-xs"
        >
          View Profile
        </button>
        <button
          onClick={(e) => handleOpenContextMenu(e, row)}
          className="p-1 text-slate-400 hover:text-slate-700"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <Header title="Patient Clinical Master Directory" subtitle="Electronic medical records, MRN tracking, bed assignments, and patient history." />

      <div className="px-6 space-y-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          onReset={() => setSearch('')}
        />

        <EnterpriseDataTable
          title="CarePlus Master Patient Directory (500-Bed Acute Care)"
          subtitle="Click patient row or view profile button for complete clinical timeline."
          columns={columns}
          data={filteredPatients}
          renderExpandedRow={(row) => (
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><strong>Emergency Contact:</strong> {row.emergency_contact_name} ({row.emergency_contact_phone})</div>
              <div><strong>Address:</strong> {row.address}</div>
              <div className="col-span-2"><strong>Executive Medical History:</strong> {row.medical_history_summary}</div>
            </div>
          )}
          exportFileName="careplus_patient_directory.csv"
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

      <BedTransferModal
        isOpen={showBedModal}
        onClose={() => setShowBedModal(false)}
        bed={selectedBed}
        onSuccess={fetchPatientsData}
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
