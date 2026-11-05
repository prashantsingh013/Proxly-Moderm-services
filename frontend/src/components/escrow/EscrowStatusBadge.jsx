import React from 'react';
import { Lock, Unlock, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

export const EscrowStatusBadge = ({ status = 'held', amount = 0 }) => {
  const configs = {
    held: {
      bg: 'bg-cyan-950/80',
      border: 'border-cyan-700/60',
      text: 'text-cyan-300',
      icon: Lock,
      label: 'FUNDS HELD IN ESCROW'
    },
    released: {
      bg: 'bg-emerald-950/80',
      border: 'border-emerald-700/60',
      text: 'text-emerald-300',
      icon: Unlock,
      label: 'ESCROW RELEASED'
    },
    disputed: {
      bg: 'bg-rose-950/80',
      border: 'border-rose-700/60',
      text: 'text-rose-300',
      icon: AlertTriangle,
      label: 'FUNDS FROZEN IN DISPUTE'
    },
    refunded: {
      bg: 'bg-purple-950/80',
      border: 'border-purple-700/60',
      text: 'text-purple-300',
      icon: RefreshCw,
      label: 'REFUNDED TO CUSTOMER'
    },
    unfunded: {
      bg: 'bg-slate-900',
      border: 'border-slate-800',
      text: 'text-slate-400',
      icon: Lock,
      label: 'ESCROW PENDING QUOTE ACCEPTANCE'
    }
  };

  const cfg = configs[status] || configs.unfunded;
  const Icon = cfg.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-medium ${cfg.bg} ${cfg.border} ${cfg.text}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{cfg.label}</span>
      {amount > 0 && <span className="font-bold ml-1 font-mono">(₹{amount})</span>}
    </div>
  );
};
