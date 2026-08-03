import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Header } from '../components/common/Header';
import { Badge } from '../components/common/Badge';
import { EnterpriseDataTable } from '../components/common/EnterpriseDataTable';
import { InvoiceModal } from '../components/billing/InvoiceModal';
import { PrintDocumentModal } from '../components/common/PrintDocumentModal';
import { FilterBar } from '../components/common/FilterBar';
import { Receipt, DollarSign, Printer, CreditCard, CheckCircle2 } from 'lucide-react';

export const BillingPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedBill, setSelectedBill] = useState(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const [printDoc, setPrintDoc] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBills = async () => {
    try {
      const res = await api.get('/bills');
      setBills(res || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const filteredBills = bills.filter(b => {
    if (search && !JSON.stringify(b).toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && b.payment_status !== statusFilter) return false;
    return true;
  });

  const columns = [
    { label: 'Invoice #', key: 'bill_number', render: val => <span className="font-mono font-bold text-slate-800">{val}</span> },
    { label: 'Patient Name', key: 'patient_name', render: (val, row) => (
      <div>
        <div className="font-bold text-slate-900">{val}</div>
        <div className="text-[11px] text-slate-500 font-mono">{row.patient_email}</div>
      </div>
    )},
    { label: 'Consultation Fee', key: 'consultation_fee', render: val => `₹${Number(val || 0).toFixed(2)}` },
    { label: 'Pharmacy Fee', key: 'medication_fee', render: val => `₹${Number(val || 0).toFixed(2)}` },
    { label: 'Total Payable', key: 'total_amount', render: val => <span className="font-bold text-teal-800 font-mono">₹{Number(val || 0).toFixed(2)}</span> },
    { label: 'Payment Status', key: 'payment_status', render: val => <Badge status={val} /> },
    { label: 'Actions', key: 'id', render: (val, bill) => (
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
          title="Print Invoice PDF"
        >
          <Printer className="w-3.5 h-3.5" />
        </button>
      </div>
    )}
  ];

  return (
    <div className="space-y-6">
      <Header title="Hospital Financial & Billing Ledger" subtitle="Invoice management, post-consultation fee receipts, and TPA payments." />

      <div className="px-6 space-y-4">
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          status={statusFilter}
          onStatusChange={setStatusFilter}
          statuses={['PAID', 'PENDING', 'CANCELLED']}
          onReset={() => { setSearch(''); setStatusFilter(''); }}
        />

        <EnterpriseDataTable
          title="CarePlus Master Financial & Cashier Ledger"
          subtitle="Generate invoices after consultation completion. Cancelled appointments cannot be billed."
          columns={columns}
          data={filteredBills}
          exportFileName="careplus_billing_ledger.csv"
        />
      </div>

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        bill={selectedBill}
        onSuccess={fetchBills}
      />

      <PrintDocumentModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        documentType={printDoc?.documentType || 'INVOICE'}
        data={printDoc}
      />
    </div>
  );
};
