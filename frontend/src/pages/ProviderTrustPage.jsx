import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, TrendingUp, Award, ArrowLeft, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { TrustScoreGauge } from '../components/trust/TrustScoreGauge';
import { TrustHistoryChart } from '../components/trust/TrustHistoryChart';
import { FactorBreakdown } from '../components/trust/FactorBreakdown';
import api from '../services/api';

export const ProviderTrustPage = () => {
  const { id } = useParams();
  const [trustData, setTrustData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [trustRes, historyRes, providerRes] = await Promise.all([
        api.get(`/trustscore/${id}`),
        api.get(`/trustscore/${id}/history`),
        api.get(`/providers/${id}`)
      ]);

      if (trustRes.data.success) setTrustData(trustRes.data.trustScore);
      if (historyRes.data.success) setHistoryData(historyRes.data.history);
      if (providerRes.data.success) setProvider(providerRes.data.provider);
    } catch (err) {
      console.error('Failed to load trust audit data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-64 rounded-3xl glass-panel animate-pulse bg-slate-900/40"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Breadcrumb */}
      <div>
        <Link
          to={`/providers/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to {provider?.businessName || 'Provider'} Profile</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-900/50 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explainable Trust Architecture Audit</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {provider?.businessName} — TrustScore Audit
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Every point in this score is audited through deterministic algorithms. TrustScores are updated dynamically with exponential decay for historical penalties.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <TrustScoreBadge
            score={trustData?.score || 85}
            level={trustData?.level || 'Highly Trusted'}
            size="lg"
          />
        </div>
      </div>

      {/* Main Grid: Gauge & History Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <TrustScoreGauge
            score={trustData?.score || 85}
            level={trustData?.level || 'Highly Trusted'}
            factors={trustData?.factors}
          />

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-white font-mono uppercase text-[11px] text-cyan-300">
              Audit Formula Specification
            </h4>
            <div className="p-3 rounded-xl bg-slate-950 font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed border border-slate-800">
              score = 0.25 * Rating<br/>
              + 0.20 * CompletionRate<br/>
              + 0.15 * (1 - CancelRate)<br/>
              + 0.15 * ResponseSpeed<br/>
              + 0.10 * VerificationTier<br/>
              + 0.10 * RepeatRate<br/>
              + 0.05 * AccountAge<br/>
              - ReportPenaltyDecayed
            </div>
          </div>
        </div>

        {/* History Chart */}
        <div className="lg:col-span-2">
          <TrustHistoryChart
            history={historyData}
            providerName={provider?.businessName}
          />
        </div>
      </div>

      {/* Factor Breakdown */}
      <div>
        <FactorBreakdown factors={trustData?.factors || {}} />
      </div>
    </div>
  );
};
