import React from 'react';
import { Zap, ShieldCheck, AlertCircle, Clock, Check } from 'lucide-react';

export const SurchargeBreakdown = ({ surchargeData }) => {
  if (!surchargeData) return null;

  const {
    baseAmount = 450,
    flatFee = 150,
    totalPercentMultiplier = 0,
    surchargeAmount = 150,
    totalEstimatedCost = 600,
    breakdowns = []
  } = surchargeData;

  return (
    <div className="p-5 rounded-2xl glass-panel border border-amber-900/40 bg-gradient-to-b from-amber-950/10 to-slate-900/90 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400" />
          Transparent Emergency Price Lock
        </h4>
        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
          Upfront Guaranteed
        </span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Base Cost */}
        <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
          <span className="text-slate-300">Base Technical Diagnostic Rate</span>
          <span className="font-mono font-semibold text-slate-200">₹{baseAmount}</span>
        </div>

        {/* Breakdown Items */}
        {breakdowns.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between py-1.5 border-b border-slate-800 text-amber-300">
            <div>
              <span className="font-medium">{item.name}</span>
              <p className="text-[10px] text-slate-400">{item.reason}</p>
            </div>
            <span className="font-mono font-semibold text-amber-400">+₹{item.amount}</span>
          </div>
        ))}

        {/* Total Cost */}
        <div className="flex items-center justify-between pt-2 text-sm font-bold">
          <span className="text-white">Total Estimated Emergency Charge</span>
          <span className="font-mono text-lg text-emerald-400">₹{totalEstimatedCost}</span>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>SkillBridge Trust Pledge:</strong> All surcharges are locked upfront prior to dispatch. Zero hidden technician surcharges allowed on site.
        </span>
      </div>
    </div>
  );
};
