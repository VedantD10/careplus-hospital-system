import React from 'react';
import { Modal } from './Modal';
import { Logo } from './Logo';
import { Printer, Download, CheckCircle2 } from 'lucide-react';

export const PrintDocumentModal = ({ isOpen, onClose, documentType = 'PRESCRIPTION', data }) => {
  if (!isOpen || !data) return null;

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Print Preview — Official CarePlus ${documentType}`}>
      <div className="space-y-4">
        {/* Action Header */}
        <div className="flex justify-end gap-2 border-b border-slate-200 pb-3 print:hidden">
          <button onClick={handleTriggerPrint} className="saas-btn-primary text-xs flex items-center gap-1.5">
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        {/* Printable Document Container */}
        <div className="bg-white border border-slate-300 p-6 rounded-lg shadow-xs space-y-6 text-slate-900 text-xs font-sans print:border-none print:shadow-none print:p-0">
          {/* Official Letterhead */}
          <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
            <div className="flex items-center gap-3">
              <Logo />
              <div>
                <h1 className="font-extrabold text-lg text-slate-900 uppercase tracking-tight">CarePlus Multi-Specialty Hospital</h1>
                <p className="text-[11px] text-slate-600 font-medium">NABH Accredited 500-Bed Acute Care & Clinical Research Center</p>
                <p className="text-[10px] text-slate-500 font-mono">100ft Road, Indiranagar, Bengaluru - 560038 • Tel: +91 (80) 4000-8800</p>
              </div>
            </div>
            <div className="text-right font-mono text-[11px]">
              <div className="font-extrabold text-sm text-[#0F4C81]">OFFICIAL {documentType}</div>
              <div className="text-slate-500">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-slate-500">Doc ID: CP-{Math.floor(100000 + Math.random() * 900000)}</div>
            </div>
          </div>

          {/* Patient Info Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded border border-slate-200 text-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500">Patient Name</div>
              <div className="font-bold text-sm text-slate-900">{data.patient_name || data.name || 'Aarav Verma'}</div>
              <div className="text-[11px] font-mono text-slate-600">MRN: {data.mrn || 'MRN-2026-8801'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-500">Attending Doctor / Department</div>
              <div className="font-bold text-sm text-slate-900">{data.doctor_name || 'Dr. Vikram Malhotra'}</div>
              <div className="text-[11px] text-slate-600">{data.department_name || 'Cardiology OPD'}</div>
            </div>
          </div>

          {/* PRESCRIPTION Content */}
          {documentType === 'PRESCRIPTION' && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-slate-100/70 p-2 rounded text-[11px]">
                <div><strong>Blood Pressure:</strong> {data.vitals_bp || '130/84 mmHg'}</div>
                <div><strong>Pulse:</strong> {data.vitals_pulse || '76 bpm'}</div>
                <div><strong>Temperature:</strong> {data.vitals_temp || '98.4 °F'}</div>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 mb-1">Clinical Diagnosis</h3>
                <p className="text-slate-800 font-semibold">{data.diagnosis || 'Stage 1 Essential Hypertension'}</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-xs border-b border-slate-200 pb-1 mb-2 flex items-center justify-between">
                  <span>Rx — Prescribed Medications</span>
                  <span className="font-mono text-[10px] text-slate-500">Formulation / Dose / Frequency / Duration</span>
                </h3>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 text-[11px]">
                      <th className="py-1.5 px-2">Medication Name</th>
                      <th className="py-1.5 px-2">Dosage</th>
                      <th className="py-1.5 px-2">Frequency</th>
                      <th className="py-1.5 px-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.prescription?.medications || [
                      { name: 'Telmisartan 40mg', dosage: '1 Tablet', frequency: 'Once Daily (Morning)', duration: '30 Days' },
                      { name: 'Aspirin 75mg', dosage: '1 Tablet', frequency: 'Once Daily (Night)', duration: '30 Days' }
                    ]).map((med, idx) => (
                      <tr key={idx} className="border-b border-slate-200 font-medium">
                        <td className="py-2 px-2 font-bold text-slate-900">{med.name}</td>
                        <td className="py-2 px-2">{med.dosage}</td>
                        <td className="py-2 px-2 text-teal-800">{med.frequency}</td>
                        <td className="py-2 px-2 font-mono">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-amber-50/60 p-2.5 rounded border border-amber-200 text-amber-900">
                <strong>Doctor Advice / Special Instructions:</strong> {data.prescription?.instructions || 'Take medication with water after meals. Avoid extra salt.'}
              </div>
            </div>
          )}

          {/* INVOICE Content */}
          {documentType === 'INVOICE' && (
            <div className="space-y-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300 bg-slate-50 text-slate-700 text-[11px]">
                    <th className="py-2 px-2">Item Description</th>
                    <th className="py-2 px-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  <tr>
                    <td className="py-2 px-2">OPD Specialist Consultation Fee</td>
                    <td className="py-2 px-2 text-right font-mono">₹{Number(data.consultation_fee || 1000).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">Pharmacy & Prescribed Medication Charges</td>
                    <td className="py-2 px-2 text-right font-mono">₹{Number(data.medication_fee || 350).toFixed(2)}</td>
                  </tr>
                  {data.other_charges > 0 && (
                    <tr>
                      <td className="py-2 px-2">Diagnostics / Nursing Fee</td>
                      <td className="py-2 px-2 text-right font-mono">₹{Number(data.other_charges).toFixed(2)}</td>
                    </tr>
                  )}
                  {data.discount > 0 && (
                    <tr className="text-emerald-700">
                      <td className="py-2 px-2">Concession / TPA Pre-Auth Discount</td>
                      <td className="py-2 px-2 text-right font-mono">-₹{Number(data.discount).toFixed(2)}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex justify-between items-center bg-slate-900 text-white p-3.5 rounded font-bold">
                <span>Total Amount Paid / Outstanding:</span>
                <span className="text-lg font-mono text-teal-300">₹{Number(data.total_amount || 1350).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-10 flex justify-between items-end text-[11px] text-slate-600 font-medium">
            <div>
              <div className="border-t border-slate-400 w-40 pt-1 font-bold text-slate-900">Hospital Desk Stamp</div>
              <div>CarePlus Medical Records Unit</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-[10px] text-teal-800 font-bold mb-1">DIGITALLY VERIFIED SIGNATURE</div>
              <div className="border-t border-slate-400 w-48 pt-1 font-bold text-slate-900">{data.doctor_name || 'Dr. Vikram Malhotra'}</div>
              <div>Consultant & Attending Physician</div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
