import React from 'react';
import { Radio, AlertTriangle, ShieldCheck, MapPin, Search } from 'lucide-react';

export const EscalationRadar = ({ currentTier = 1, totalFound = 0, onEscalate, isSearching = true }) => {
  const tiers = [
    { tier: 1, radius: '5 km', label: 'Immediate Locality Net' },
    { tier: 2, radius: '10 km', label: 'Extended Suburban Zone' },
    { tier: 3, radius: '20 km', label: 'City-Wide Rapid Net' }
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-rose-900/40 relative overflow-hidden bg-gradient-to-b from-rose-950/20 to-slate-900/90 shadow-glow-emergency">
      {/* Radar Animation Centerpiece */}
      <div className="flex flex-col items-center justify-center my-4 relative">
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Concentric distance circles */}
          <div className={`absolute w-48 h-48 rounded-full border border-rose-500/20 transition-all ${currentTier >= 3 ? 'border-rose-500/50 scale-100' : 'opacity-40'}`}></div>
          <div className={`absolute w-32 h-32 rounded-full border border-rose-500/30 transition-all ${currentTier >= 2 ? 'border-rose-500/60' : 'opacity-60'}`}></div>
          <div className="absolute w-16 h-16 rounded-full border border-rose-500/50 bg-rose-500/10 flex items-center justify-center">
            <Radio className="w-6 h-6 text-rose-400 animate-pulse" />
          </div>

          {/* Sweeping Radar beam */}
          {isSearching && (
            <div className="absolute w-48 h-48 rounded-full pointer-events-none animate-radar-sweep opacity-75">
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-rose-500/30 to-transparent rounded-tl-full"></div>
            </div>
          )}
        </div>

        {/* Live Status Text */}
        <div className="mt-4 text-center space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
            <span className="text-sm font-mono font-bold text-rose-300 uppercase tracking-wider">
              {currentTier === 1 ? 'Broadcasting 5 km Radius' : (currentTier === 2 ? 'Escalated: 10 km Search Net' : 'Max Net: 20 km City Grid')}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            {totalFound > 0
              ? `Found ${totalFound} verified emergency specialists on standby.`
              : 'Pinging available emergency specialists in your sector...'}
          </p>
        </div>
      </div>

      {/* Tier Steps */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-slate-800">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              t.tier === currentTier
                ? 'bg-rose-950/80 border-rose-600/70 text-rose-200'
                : (t.tier < currentTier ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-950/40 border-slate-800 text-slate-400')
            }`}
          >
            <div className="text-[10px] font-mono uppercase opacity-75">Tier {t.tier}</div>
            <div className="text-xs font-bold font-mono text-white mt-0.5">{t.radius}</div>
            <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.label}</div>
          </div>
        ))}
      </div>

      {/* Manual Widen Net Button if needed */}
      {currentTier < 3 && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => onEscalate && onEscalate(currentTier + 1)}
            className="text-xs text-rose-300 hover:text-rose-200 hover:underline flex items-center justify-center gap-1 mx-auto font-mono"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Manually expand net to Tier {currentTier + 1} ({tiers[currentTier].radius})</span>
          </button>
        </div>
      )}
    </div>
  );
};
