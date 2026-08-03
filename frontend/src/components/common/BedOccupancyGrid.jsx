import React, { useState } from 'react';
import { Bed, UserCheck, ShieldAlert, CheckCircle2, ArrowRightLeft } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const BedOccupancyGrid = ({ beds = [], onUpdate }) => {
  const { showToast } = useNotification();
  const [selectedBed, setSelectedBed] = useState(null);
  const [transferPatientName, setTransferPatientName] = useState('');

  const handleBedStatusToggle = async (bed, newStatus) => {
    try {
      await api.patch(`/beds/${bed.id}`, {
        status: newStatus,
        patient_name: newStatus === 'AVAILABLE' ? null : (transferPatientName || bed.patient_name || 'Emergency Patient')
      });
      showToast(`Bed ${bed.id} updated to ${newStatus}`, 'success');
      setSelectedBed(null);
      onUpdate?.();
    } catch (err) {
      showToast(err.message || 'Bed update failed', 'error');
    }
  };

  const totalBeds = 500;
  const occupiedCount = beds.filter(b => b.status === 'OCCUPIED').length;
  const occupancyPercentage = Math.round((occupiedCount / (beds.length || 1)) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
      {/* Overview Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Bed className="w-4 h-4 text-teal-700" /> 500-Bed Facility Occupancy Grid
          </h3>
          <p className="text-xs text-slate-500">Live ward & ICU bed allocation tracking</p>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full">
            Available: {beds.filter(b => b.status === 'AVAILABLE').length} Beds
          </span>
          <span className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-full">
            Occupied: {occupiedCount} Beds ({occupancyPercentage}%)
          </span>
        </div>
      </div>

      {/* Bed Heatmap Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5">
        {beds.map(bed => {
          const isOccupied = bed.status === 'OCCUPIED';
          return (
            <button
              key={bed.id}
              onClick={() => setSelectedBed(bed)}
              className={`p-3 rounded-lg border text-left transition-all relative ${
                isOccupied
                  ? 'bg-amber-50/80 border-amber-300 text-amber-900 hover:bg-amber-100'
                  : 'bg-emerald-50/80 border-emerald-300 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              <div className="flex justify-between items-center text-[10px] font-mono font-bold">
                <span>{bed.bed_number}</span>
                <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-amber-600' : 'bg-emerald-600'}`}></span>
              </div>
              <p className="text-[11px] font-bold mt-1 truncate">{bed.ward}</p>
              <p className="text-[10px] text-slate-500 truncate">{isOccupied ? bed.patient_name : 'Vacant'}</p>
            </button>
          );
        })}
      </div>

      {/* Bed Transfer Modal */}
      {selectedBed && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-900 text-sm">Bed Action: {selectedBed.id} ({selectedBed.ward})</h4>
            <p className="text-xs text-slate-500">
              Current Status: <strong>{selectedBed.status}</strong> {selectedBed.patient_name ? `(${selectedBed.patient_name})` : ''}
            </p>

            {selectedBed.status === 'AVAILABLE' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assign Patient Name</label>
                <input
                  type="text"
                  placeholder="Patient Name or MRN..."
                  value={transferPatientName}
                  onChange={e => setTransferPatientName(e.target.value)}
                  className="saas-input py-1 text-xs"
                />
              </div>
            )}

            <div className="pt-2 flex flex-col gap-2">
              {selectedBed.status === 'OCCUPIED' ? (
                <button
                  onClick={() => handleBedStatusToggle(selectedBed, 'AVAILABLE')}
                  className="saas-btn-primary bg-emerald-700 hover:bg-emerald-800 text-xs justify-center"
                >
                  Discharge & Mark Vacant
                </button>
              ) : (
                <button
                  onClick={() => handleBedStatusToggle(selectedBed, 'OCCUPIED')}
                  className="saas-btn-primary text-xs justify-center"
                >
                  Admit Patient to Bed
                </button>
              )}
              <button onClick={() => setSelectedBed(null)} className="saas-btn-secondary text-xs justify-center">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
