import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Badge } from '../common/Badge';
import { Printer, CreditCard, CheckCircle2 } from 'lucide-react';

export const InvoiceModal = ({ isOpen, onClose, bill, onSuccess }) => {
  const { showToast } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [loading, setLoading] = useState(false);

  if (!bill) return null;

  const handleCollectPayment = async () => {
    setLoading(true);
    try {
      await api.post(`/bills/${bill.id}/pay`, { paymentMethod });
      showToast(`Payment of $${Number(bill.total_amount).toFixed(2)} received!`, 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      showToast(err.message || 'Payment processing failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.open(`/api/bills/${bill.id}/pdf`, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Invoice Details - #${bill.bill_number}`} maxWidth="max-w-md">
      <div className="space-y-4">
        {/* Status Header */}
        <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-xs text-slate-500 block">Billed To</span>
            <span className="font-bold text-slate-900 text-sm">{bill.patient_name}</span>
          </div>
          <Badge status={bill.payment_status} />
        </div>

        {/* Itemized charges table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
          <div className="bg-slate-100 p-2.5 font-semibold text-slate-700 flex justify-between border-b">
            <span>Service Item</span>
            <span>Amount (₹)</span>
          </div>
          <div className="p-2.5 flex justify-between border-b border-slate-100 text-slate-600">
            <span>Doctor Consultation Fee</span>
            <span>₹{Number(bill.consultation_fee).toFixed(2)}</span>
          </div>
          <div className="p-2.5 flex justify-between border-b border-slate-100 text-slate-600">
            <span>Pharmacy & Medication Charges</span>
            <span>₹{Number(bill.medication_fee).toFixed(2)}</span>
          </div>
          <div className="p-2.5 flex justify-between border-b border-slate-100 text-slate-600">
            <span>Hospital Facility Charges</span>
            <span>₹{Number(bill.other_charges).toFixed(2)}</span>
          </div>
          <div className="p-2.5 flex justify-between font-bold text-sm bg-teal-50 text-teal-900">
            <span>Total Payable</span>
            <span>₹{Number(bill.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Action for Pending Bills */}
        {bill.payment_status === 'PENDING' ? (
          <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Select Payment Method</label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="saas-input py-1.5 text-xs"
            >
              <option value="ONLINE">UPI / Net Banking / GPay</option>
              <option value="CREDIT_CARD">Credit / Debit Card</option>
              <option value="CASH">Cash</option>
              <option value="INSURANCE">Health Insurance (TPA)</option>
            </select>

            <button
              onClick={handleCollectPayment}
              disabled={loading}
              className="w-full saas-btn-primary justify-center mt-2"
            >
              <CreditCard className="w-4 h-4" />
              {loading ? 'Processing...' : `Collect Payment (₹${Number(bill.total_amount).toFixed(2)})`}
            </button>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Paid in full on {bill.paid_at ? new Date(bill.paid_at).toLocaleDateString() : 'Today'} via {bill.payment_method}</span>
          </div>
        )}

        <div className="pt-2 flex justify-between gap-3 border-t border-slate-200">
          <button onClick={handlePrint} className="saas-btn-secondary text-xs">
            <Printer className="w-4 h-4" /> Printable PDF
          </button>
          <button onClick={onClose} className="saas-btn-secondary text-xs">Close</button>
        </div>
      </div>
    </Modal>
  );
};
