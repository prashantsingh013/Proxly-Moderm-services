import React from 'react';
import { Star, CheckCircle, Clock, Shield, Repeat, Calendar, AlertOctagon } from 'lucide-react';

export const FactorBreakdown = ({ factors = {} }) => {
  const factorRows = [
    {
      name: 'Customer Review Quality',
      weight: '25%',
      value: `${factors.rating || 4.5} ★ (${factors.normalizedRating || 90}/100)`,
      progress: factors.normalizedRating || 90,
      icon: Star,
      color: 'from-amber-500 to-yellow-400'
    },
    {
      name: 'Job Completion Rate',
      weight: '20%',
      value: `${factors.completionRate || 95}% (${factors.completedJobs || 0} jobs done)`,
      progress: factors.completionRate || 95,
      icon: CheckCircle,
      color: 'from-emerald-500 to-teal-400'
    },
    {
      name: 'Low Cancellation Discipline',
      weight: '15%',
      value: `${100 - (factors.cancellationRate || 2)}% score (${factors.cancellationRate || 2}% cancelled)`,
      progress: 100 - (factors.cancellationRate || 2),
      icon: CheckCircle,
      color: 'from-cyan-500 to-blue-400'
    },
    {
      name: 'Rapid Response Speed',
      weight: '15%',
      value: `~${factors.responseTimeMinutes || 15}m response (${factors.responseTimeScore || 85}/100)`,
      progress: factors.responseTimeScore || 85,
      icon: Clock,
      color: 'from-blue-500 to-indigo-400'
    },
    {
      name: 'Verification Tier Bonus',
      weight: '10%',
      value: `${factors.verificationTier || 'Unverified'} (${factors.verificationBonus || 20}/100)`,
      progress: factors.verificationBonus || 20,
      icon: Shield,
      color: 'from-purple-500 to-violet-400'
    },
    {
      name: 'Repeat Client Loyalty',
      weight: '10%',
      value: `${factors.repeatCustomerRate || 20}% repeat customer rate`,
      progress: Math.min(100, (factors.repeatCustomerRate || 20) * 2),
      icon: Repeat,
      color: 'from-indigo-500 to-purple-400'
    },
    {
      name: 'Platform Longevity & Experience',
      weight: '5%',
      value: `${factors.accountAgeScore || 60}/100 active standing`,
      progress: factors.accountAgeScore || 60,
      icon: Calendar,
      color: 'from-teal-500 to-emerald-400'
    }
  ];

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
      <div>
        <h3 className="text-sm font-semibold text-white">Explainable Weighted Factors</h3>
        <p className="text-xs text-slate-400 mt-0.5">
          Every point in the TrustScore is mathematical, verifiable, and free of advertising bias.
        </p>
      </div>

      <div className="space-y-4">
        {factorRows.map((factor, idx) => {
          const Icon = factor.icon;
          return (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <Icon className="w-4 h-4 text-slate-400" />
                  <span className="font-medium">{factor.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {factor.weight}
                  </span>
                </div>
                <span className="font-mono text-slate-300 text-[11px]">{factor.value}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${factor.color} transition-all duration-700`}
                  style={{ width: `${Math.min(100, Math.max(5, factor.progress))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Exponential Penalty Decay Callout */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-3 text-xs">
        <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-200">
            Report Penalty: -{factors.reportPenalty || 0} pts ({factors.reportCount || 0} upheld reports)
          </span>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            SkillBridge utilizes exponential time decay (halving every 90 days). Past resolved issues lose impact over time so providers have a clear, dignified path to rehabilitate their standing.
          </p>
        </div>
      </div>
    </div>
  );
};
