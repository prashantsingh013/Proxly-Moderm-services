import React, { useState } from 'react';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

export const DisputeModal = ({ isOpen, onClose, onSubmit, bookingId }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    setIsSubmitting(true);
    await onSubmit(reason);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-rose-900/60 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-400 font-display font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Raise Dispute & Freeze Escrow</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Opening a formal dispute immediately freezes all escrow funds for this booking. Neither party can withdraw funds until our Trust & Arbitration team inspects the case.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Detailed Reason for Dispute:</label>
            <textarea
              required
              rows={4}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe what went wrong (e.g. unfinished wiring, equipment left damaged, unaddressed leakage)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Both the customer and provider will have 24 hours to submit photos or evidence before administrative settlement.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-300 hover:text-white rounded-xl bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-glow-emergency disabled:opacity-50"
            >
              {isSubmitting ? 'Freezing Escrow...' : 'Freeze Payment & Submit Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
