import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { EnterpriseDataTable } from '../components/common/EnterpriseDataTable';
import { FilterBar } from '../components/common/FilterBar';
import { Stethoscope, Calendar, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

export const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const fetchDoctorsData = async () => {
    try {
      const [docsRes, deptsRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/departments').catch(() => [])
      ]);
      setDoctors(docsRes || []);
      setDepartments(deptsRes || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorsData();
  }, []);

  const filteredDoctors = doctors.filter(d => {
    if (search && !JSON.stringify(d).toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter && d.department_name !== deptFilter) return false;
    return true;
  });

  const columns = [
    { label: 'Doctor Name', key: 'name', render: (val, row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shrink-0">
          {val ? val.charAt(0) : 'D'}
        </div>
        <div>
          <div className="font-bold text-slate-900">{val}</div>
          <div className="text-[11px] text-slate-500 font-mono">{row.email}</div>
        </div>
      </div>
    )},
    { label: 'Department', key: 'department_name', render: val => <span className="bg-slate-100 font-semibold text-slate-800 px-2.5 py-0.5 rounded text-xs">{val}</span> },
    { label: 'Specialization & Qualification', key: 'specialization', render: (val, row) => (
      <div>
        <div className="font-bold text-slate-800">{val}</div>
        <div className="text-[11px] text-slate-500">{row.qualification}</div>
      </div>
    )},
    { label: 'Experience', key: 'experience_years', render: val => `${val} Years Exp` },
    { label: 'OPD Room', key: 'room_number', render: val => <span className="font-mono font-bold text-[#0F4C81]">{val}</span> },
    { label: 'Status', key: 'is_active', render: val => (
      <span className={`px-2 py-0.5 rounded text-xs font-bold ${val ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
        {val ? 'On Duty' : 'On Leave'}
      </span>
    )}
  ];

  return (
    <div className="space-y-6">
      <Header title="Specialist Medical Staff & Doctor Directory" subtitle="Physician schedules, OPD room allocations, qualifications, and duty rosters." />

      <div className="px-6 space-y-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          department={deptFilter}
          onDepartmentChange={setDeptFilter}
          departments={departments}
          onReset={() => { setSearch(''); setDeptFilter(''); }}
        />

        <EnterpriseDataTable
          title="CarePlus Consultant & Specialist Directory"
          subtitle="Clinical medical staff managing outpatient consultations and surgical procedures."
          columns={columns}
          data={filteredDoctors}
          renderExpandedRow={(row) => (
            <div className="p-2 space-y-2 text-xs">
              <div><strong>Physician Bio:</strong> {row.bio}</div>
              <div><strong>Consultation Fee Rate:</strong> ₹{row.consultation_fee || 1000} per visit</div>
            </div>
          )}
          exportFileName="careplus_doctor_directory.csv"
        />
      </div>
    </div>
  );
};
