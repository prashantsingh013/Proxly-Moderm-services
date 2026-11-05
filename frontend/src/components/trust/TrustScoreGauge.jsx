import React from 'react';
import { ShieldCheck, Award, TrendingUp, Info } from 'lucide-react';

export const TrustScoreGauge = ({ score = 87, level = 'Highly Trusted', factors = {} }) => {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // emerald
  if (score >= 90) strokeColor = '#f59e0b'; // amber gold
  else if (score >= 80) strokeColor = '#06b6d4'; // cyan
  else if (score < 65) strokeColor = '#94a3b8'; // slate

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-2xl glass-panel relative overflow-hidden border border-slate-800">
      <div className="relative w-44 h-44 flex items-center justify-center">
        {/* SVG Circular Meter */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-800"
            fill="transparent"
          />
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-black font-display tracking-tight text-white">
            {score}
          </span>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
            out of 100
          </span>
          <span className="text-xs font-semibold px-2 py-0.5 mt-1 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
            {level}
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
          Mathematically computed from 7 verifiable performance factors and time-decayed report penalties.
        </p>
      </div>
    </div>
  );
};
