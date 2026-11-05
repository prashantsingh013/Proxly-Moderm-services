import React, { useState, useEffect } from 'react';
import {
  Shield,
  BarChart2,
  AlertTriangle,
  Users,
  CheckCircle,
  FileCheck,
  TrendingUp,
  DollarSign,
  Layers,
  Lock,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import api from '../services/api';

export const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [reports, setReports] = useState([]);
  const [providers, setProviders] = useState([]);
  const [activeTab, setActiveTab] = useState('analytics');
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [anaRes, repRes, provRes] = await Promise.all([
        api.get('/analytics/admin'),
        api.get('/reports'),
        api.get('/providers?limit=40')
      ]);

      if (anaRes.data.success) setAnalytics(anaRes.data);
      if (repRes.data.success) setReports(repRes.data.reports || []);
      if (provRes.data.success) setProviders(provRes.data.providers || []);
    } catch (err) {
      console.error('Failed to load admin dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResolveReport = async (reportId, status, penaltyScore = 15) => {
    const adminNotes = window.prompt('Enter arbitration notes for this resolution:');
    if (!adminNotes) return;

    try {
      const res = await api.patch(`/reports/${reportId}/resolve`, {
        status,
        adminNotes,
        penaltyScore
      });

      if (res.data.success) {
        alert(`Report resolved: ${status}`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Resolution failed');
    }
  };

  const handleVerifyProvider = async (providerId, tier) => {
    try {
      const res = await api.post('/providers/verify-docs', {
        providerId,
        verificationTier: tier
      });

      if (res.data.success) {
        alert(`Provider elevated to ${tier}! TrustScore updated.`);
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Verification update failed');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-64 rounded-3xl glass-panel animate-pulse bg-slate-900/40"></div>
      </div>
    );
  }

  const summary = analytics?.summary || {};
  const histogramData = analytics?.trustScoreHistogram || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-purple-900/50 bg-gradient-to-r from-purple-950/30 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-[0_0_30px_rgba(168,85,247,0.15)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-700/60 text-purple-300 text-xs font-mono font-medium">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>Platform Governance & Trust Audit Desk</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Admin Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Monitor TrustScore distribution, arbitrate mutual disputes, and audit document verification workflows.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Stats</span>
        </button>
      </div>

      {/* Summary Stats Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-white">{summary.totalUsers || 0}</span>
          <p className="text-[11px] text-slate-400">Total Accounts</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-emerald-400">{summary.totalProviders || 0}</span>
          <p className="text-[11px] text-slate-400">Active Specialists</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-cyan-400">{summary.totalBookings || 0}</span>
          <p className="text-[11px] text-slate-400">Bookings Handled</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-indigo-400">{summary.totalEndorsements || 0}</span>
          <p className="text-[11px] text-slate-400">Trust Circle Links</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-amber-400">{summary.pendingReports || 0}</span>
          <p className="text-[11px] text-slate-400">Pending Reports</p>
        </div>
        <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <span className="text-2xl font-bold font-mono text-rose-400">{summary.resolvedReports || 0}</span>
          <p className="text-[11px] text-slate-400">Resolved Disputes</p>
        </div>
      </div>

      {/* Tabs: Analytics vs Dispute Desk vs Verification */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'analytics'
              ? 'bg-purple-600 border-purple-500 text-white shadow-glow-trust'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5 inline mr-1" />
          TrustScore Distribution & Metrics
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'reports'
              ? 'bg-purple-600 border-purple-500 text-white shadow-glow-trust'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
          Dispute & Report Arbitration ({reports.length})
        </button>
        <button
          onClick={() => setActiveTab('verification')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'verification'
              ? 'bg-purple-600 border-purple-500 text-white shadow-glow-trust'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 inline mr-1" />
          Provider Verification Queue ({providers.length})
        </button>
      </div>

      {/* Tab 1: TrustScore Distribution Histogram */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                TrustScore Discrimination Histogram
              </h3>
              <p className="text-xs text-slate-400">
                Audits that TrustScores cleanly discriminate high performers from low performers rather than clustering everyone at 80-90.
              </p>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="range" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs">
                            <p className="font-semibold text-white">{label}</p>
                            <p className="text-purple-400 font-mono font-bold">
                              Provider Count: {payload[0].value}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Mutual Reports & Dispute Arbitration */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
              <p>No reports currently pending review.</p>
            </div>
          ) : (
            reports.map((rep) => (
              <div
                key={rep._id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'upheld'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : (rep.status === 'dismissed' ? 'bg-slate-800 text-slate-400' : 'bg-amber-950 text-amber-300 border border-amber-800')
                    }`}>
                      {rep.status.toUpperCase()}
                    </span>
                    <span className="font-bold text-sm text-white">{rep.reportType.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="text-xs text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reported By:</span>
                    <span className="font-semibold text-white">{rep.reportedBy?.name} ({rep.reportedBy?.role})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Reported Against:</span>
                    <span className="font-semibold text-white">{rep.reportedAgainst?.name} ({rep.reportedAgainst?.role})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 italic">"{rep.reason}"</p>

                {rep.status === 'pending' && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => handleResolveReport(rep._id, 'dismissed')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      Dismiss Report
                    </button>
                    <button
                      onClick={() => handleResolveReport(rep._id, 'upheld', 15)}
                      className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-glow-emergency"
                    >
                      Uphold Report & Apply TrustScore Penalty (-15 pts)
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Provider Verification Queue */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((p) => (
              <div
                key={p._id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-white">{p.businessName}</h4>
                    <p className="text-xs text-slate-400">{p.categories?.join(', ')} • {p.address?.locality}</p>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {p.verificationTier}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-mono">
                    TrustScore: {p.trustScoreCache?.score || 80}/100
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleVerifyProvider(p._id, 'Document Verified')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 text-[11px]"
                    >
                      Verify Docs
                    </button>
                    <button
                      onClick={() => handleVerifyProvider(p._id, 'Community Verified')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px]"
                    >
                      Verify Community
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
