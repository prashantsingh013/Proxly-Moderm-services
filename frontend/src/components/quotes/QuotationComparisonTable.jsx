import React from 'react';
import { Shield, Clock, Award, CheckCircle, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { TrustScoreBadge } from '../trust/TrustScoreBadge';

export const QuotationComparisonTable = ({ quotations = [], onAccept, isCustomer = true }) => {
  if (!quotations || quotations.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center border border-slate-800 text-slate-400">
        <Clock className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-sm font-medium text-slate-300">Awaiting Quotations</p>
        <p className="text-xs text-slate-400 mt-1">Nearby verified specialists have been notified to review your job details.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-800/40 text-xs text-slate-300 flex items-start gap-2.5">
        <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-cyan-300">Transparent Quotation Comparison & Escrow Rule:</span>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Compare price, ETA, valid-until expiry, and guaranteed warranty days. When you accept, your funds are safely held in Escrow until you inspect the completed work.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quotations.map((quote) => {
          const provider = quote.providerId || {};
          const isExpired = new Date(quote.validUntil) < new Date();
          const isAccepted = quote.status === 'accepted';

          return (
            <div
              key={quote._id}
              className={`p-5 rounded-2xl glass-panel border flex flex-col justify-between transition-all ${
                isAccepted
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-glow-brand'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-display font-bold text-base text-white">
                      {provider.businessName || 'Local Specialist'}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <TrustScoreBadge
                        score={provider.trustScoreCache?.score || 80}
                        level={provider.trustScoreCache?.level || 'Trusted'}
                        size="sm"
                      />
                    </div>
                  </div>

                  {isAccepted && (
                    <span className="px-2 py-0.5 text-[11px] font-mono font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      ACCEPTED
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Total Fixed Quote:</span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      ₹{quote.priceRange?.exact || quote.priceRange?.min || 450}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Price Range: ₹{quote.priceRange?.min} – ₹{quote.priceRange?.max}
                  </div>
                </div>

                {/* Specs Matrix: Warranty, ETA, Expiry */}
                <div className="space-y-2 text-xs text-slate-300">
                  {/* Warranty Days */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                      Workmanship Warranty:
                    </span>
                    <span className="font-semibold text-emerald-300">
                      {quote.warrantyDays || 30} Days Guaranteed
                    </span>
                  </div>

                  {/* ETA */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Estimated Arrival ETA:
                    </span>
                    <span className="font-semibold text-slate-200 font-mono">
                      ~{quote.etaMinutes || 45} mins
                    </span>
                  </div>

                  {/* Valid Until Expiry */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/40 border border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      Quote Valid Until:
                    </span>
                    <span className={`font-mono text-[11px] ${isExpired ? 'text-rose-400' : 'text-slate-300'}`}>
                      {new Date(quote.validUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                      {new Date(quote.validUntil).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {quote.notes && (
                  <p className="text-xs text-slate-400 italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60">
                    "{quote.notes}"
                  </p>
                )}
              </div>

              {/* Action Button */}
              {isCustomer && !isAccepted && (
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => onAccept && onAccept(quote._id)}
                    disabled={isExpired}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isExpired
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand'
                    }`}
                  >
                    <span>{isExpired ? 'Quote Expired' : 'Accept & Lock Escrow'}</span>
                    {!isExpired && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
