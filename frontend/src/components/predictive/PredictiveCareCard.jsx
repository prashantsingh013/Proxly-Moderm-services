import React from 'react';
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PredictiveCareCard = ({ prediction }) => {
  const isHigh = prediction.severity === 'high';

  return (
    <div className={`p-5 rounded-2xl glass-panel border relative overflow-hidden transition-all ${
      isHigh
        ? 'border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-slate-900/90 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
        : 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-slate-900/90'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isHigh ? 'bg-amber-500/20 text-amber-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
              AI Preventive Care Alert • {prediction.category}
            </span>
            <h4 className="font-display font-bold text-sm text-white mt-0.5">
              {prediction.title}
            </h4>
          </div>
        </div>

        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
          isHigh
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
        }`}>
          {isHigh ? 'ACTION DUE' : 'RECOMMENDED'}
        </span>
      </div>

      <p className="text-xs text-slate-300 mt-3 leading-relaxed">
        {prediction.description}
      </p>

      {/* Suggested Savings & Cost */}
      <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-slate-400 text-[11px]">Estimated Investment:</span>
          <span className="font-mono font-bold text-white ml-1.5">
            ₹{prediction.estimatedCost?.min} – ₹{prediction.estimatedCost?.max}
          </span>
        </div>
        {prediction.suggestedSavings && (
          <span className="text-emerald-400 text-[11px] font-medium flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" />
            {prediction.suggestedSavings}
          </span>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400">Appliance: {prediction.applianceName}</span>
        <Link
          to={`/book?category=${encodeURIComponent(prediction.actionCategory || prediction.category)}&description=${encodeURIComponent(prediction.recommendedService)}`}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand transition-all flex items-center gap-1.5"
        >
          <span>Schedule Care</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
