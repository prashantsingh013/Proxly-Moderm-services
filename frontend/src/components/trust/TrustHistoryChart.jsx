import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Shield } from 'lucide-react';

export const TrustHistoryChart = ({ history = [], providerName = '' }) => {
  if (!history || history.length === 0) {
    return (
      <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 border border-slate-800">
        <Shield className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p className="text-xs">No historical snapshots recorded yet. Scores are recorded periodically.</p>
      </div>
    );
  }

  const chartData = history.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    score: item.score,
    level: item.level,
    jobs: item.factorsSnapshot?.completedJobs || 0
  }));

  const initialScore = history[0]?.score || 70;
  const currentScore = history[history.length - 1]?.score || 70;
  const diff = currentScore - initialScore;

  return (
    <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            TrustScore Progression Trend
          </h3>
          <p className="text-xs text-slate-400">
            Historical audit snapshots over the past 60 days
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-mono px-2.5 py-1 rounded-lg border ${
            diff >= 0
              ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-400'
              : 'bg-rose-950/80 border-rose-700/60 text-rose-400'
          }`}>
            {diff >= 0 ? `+${diff} pts climbing` : `${diff} pts`}
          </span>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trustScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              domain={[40, 100]}
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs space-y-1">
                      <p className="font-semibold text-slate-200">{label}</p>
                      <p className="text-emerald-400 font-mono font-bold text-sm">
                        TrustScore: {payload[0].value} / 100
                      </p>
                      <p className="text-slate-400 text-[11px]">
                        Tier: {payload[0].payload.level}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#trustScoreGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-3 flex items-center justify-between">
        <span>Continuous automated validation</span>
        <span>Exponential penalty decay applied</span>
      </div>
    </div>
  );
};
