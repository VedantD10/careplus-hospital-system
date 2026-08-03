import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { Building2, Stethoscope, DollarSign } from 'lucide-react';

export const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    api.get('/departments').then(setDepartments).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <Header title="CarePlus Clinical Departments" subtitle="Multi-specialty department structures, head doctors, and standardized consultation rates." />

      <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className="saas-card p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md">{dept.code}</span>
              <span className="text-xs font-bold text-emerald-700">₹{dept.consultation_fee} / Consult</span>
            </div>

            <h3 className="font-bold text-slate-900 text-lg">{dept.name}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{dept.description}</p>

            <div className="border-t border-slate-100 pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <Stethoscope className="w-4 h-4 text-teal-600" />
              <span>Head of Department: {dept.head_doctor_name || 'Dr. Vikram Malhotra'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
