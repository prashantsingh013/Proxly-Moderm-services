import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Lock,
  Clock,
  AlertCircle,
  CreditCard,
  IndianRupee
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const WalletPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(1280.00);
  const [inEscrow, setInEscrow] = useState(450.00);

  const transactions = [
    {
      id: 'TXN-9021',
      title: 'Water Pipe Leakage Repair Escrow Release',
      type: 'credit',
      amount: '+₹450.00',
      date: 'Today, 11:20 AM',
      status: 'Completed',
      provider: 'Reddy Plumbing Solutions'
    },
    {
      id: 'TXN-8842',
      title: 'Split AC Deep Cleaning Booking Lock',
      type: 'debit',
      amount: '-₹550.00',
      date: 'Yesterday, 04:15 PM',
      status: 'In Escrow',
      provider: 'Bangalore Cool AC'
    },
    {
      id: 'TXN-8120',
      title: 'Switchboard Replacement & Surge Protection',
      type: 'credit',
      amount: '+₹280.00',
      date: '26 Oct 2026',
      status: 'Completed',
      provider: 'Suresh Quick Electricals'
    }
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">Fair-Split Escrow Wallet</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Funds are locked securely in ₹ until job completion verification with 48h arbitration protection.
          </p>
        </div>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5">
          <CreditCard className="w-3.5 h-3.5" />
          <span>Add Funds (₹)</span>
        </button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Available Balance</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">₹{balance.toFixed(2)}</p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Ready for instant payout</span>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Locked in Escrow</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">₹{inEscrow.toFixed(2)}</p>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">Protected by SkillBridge Escrow</span>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Protection Standing</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-2">100%</p>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Zero disputed claims</span>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Recent Wallet Activity</h2>
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center justify-between p-3.5 bg-slate-50/70 dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-colors border border-slate-100/60 dark:border-slate-800"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    tx.type === 'credit'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {tx.type === 'credit' ? (
                    <ArrowDownLeft className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{tx.title}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{tx.provider} • {tx.date}</p>
                </div>
              </div>

              <div className="text-right">
                <p
                  className={`text-sm font-bold ${
                    tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'
                  }`}
                >
                  {tx.amount}
                </p>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === 'Completed'
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300'
                      : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300'
                  }`}
                >
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
