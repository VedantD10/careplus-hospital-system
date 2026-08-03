import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { EnterpriseDataTable } from '../components/common/EnterpriseDataTable';
import { FilterBar } from '../components/common/FilterBar';
import { ShieldCheck, History, User, Lock, Activity } from 'lucide-react';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');

  const fetchAuditLogs = async () => {
    try {
      const res = await api.get('/admin/audit-logs');
      setLogs(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const filteredLogs = logs.filter(l => {
    if (search && !JSON.stringify(l).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    { label: 'Log ID', key: 'id', render: val => <span className="font-mono text-xs font-bold text-slate-800">#LOG-{val}</span> },
    { label: 'User & Role', key: 'user_name', render: (val, row) => (
      <div>
        <div className="font-bold text-slate-900">{val}</div>
        <div className="text-[11px] text-teal-700 font-mono font-semibold">{row.user_role}</div>
      </div>
    )},
    { label: 'Action Event', key: 'action', render: val => <span className="bg-slate-900 text-teal-300 px-2 py-0.5 rounded font-mono text-xs font-bold">{val}</span> },
    { label: 'Target Resource', key: 'resource', render: (val, row) => `${val} (ID: ${row.resource_id})` },
    { label: 'IP Address', key: 'ip_address', render: val => <span className="font-mono text-xs text-slate-600">{val || '192.168.1.45'}</span> },
    { label: 'Details', key: 'details', render: val => <span className="text-xs text-slate-700 leading-relaxed font-medium">{val}</span> },
    { label: 'Timestamp', key: 'created_at', render: val => <span className="font-mono text-[11px] text-slate-500">{new Date(val).toLocaleString()}</span> }
  ];

  return (
    <div className="space-y-6">
      <Header title="HIPAA & Hospital System Security Audit Logs" subtitle="Immutable activity ledger tracking medical record modifications, bed transfers, and billing events." />

      <div className="px-6 space-y-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          onReset={() => setSearch('')}
        />

        <EnterpriseDataTable
          title="CarePlus Enterprise Security & Access Audit Trail"
          subtitle="All patient record accesses and administrative state changes are recorded for compliance."
          columns={columns}
          data={filteredLogs}
          exportFileName="careplus_audit_trail.csv"
        />
      </div>
    </div>
  );
};
