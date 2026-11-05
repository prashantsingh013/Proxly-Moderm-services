import React from 'react';
import { ShieldCheck, Award, Star, ShieldAlert } from 'lucide-react';

export const TrustScoreBadge = ({ score = 75, level = 'Trusted', size = 'md', showLevel = true }) => {
  let colorStyles = {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-700/60',
    text: 'text-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.25)]',
    icon: ShieldCheck
  };

  if (score >= 90) {
    colorStyles = {
      bg: 'bg-amber-950/80',
      border: 'border-amber-600/70',
      text: 'text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]',
      icon: Award
    };
  } else if (score >= 80) {
    colorStyles = {
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-600/70',
      text: 'text-cyan-300',
      glow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      icon: ShieldCheck
    };
  } else if (score < 65) {
    colorStyles = {
      bg: 'bg-slate-900',
      border: 'border-slate-700',
      text: 'text-slate-300',
      glow: '',
      icon: Star
    };
  }

  const Icon = colorStyles.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold'
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorStyles.bg} ${colorStyles.border} ${colorStyles.text} ${colorStyles.glow} ${sizeClasses[size]} font-mono transition-all`}
    >
      <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : (size === 'lg' ? 'w-5 h-5' : 'w-4 h-4')} />
      <span className="font-bold">{score}</span>
      <span className="text-[10px] opacity-70">/100</span>
      {showLevel && (
        <span className="text-[11px] font-sans font-medium ml-1 pl-1.5 border-l border-current opacity-90 hidden sm:inline">
          {level}
        </span>
      )}
    </div>
  );
};
