import React, { useState, useEffect } from 'react';
import { Sparkles, Cpu, Clock, History, PlusCircle, ArrowRight } from 'lucide-react';
import { PredictiveCareCard } from '../components/predictive/PredictiveCareCard';
import { ServiceTimeline } from '../components/predictive/ServiceTimeline';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const PredictiveCarePage = () => {
  const { user, isAuthenticated } = useAuth();
  const [predictions, setPredictions] = useState([]);
  const [timelineData, setTimelineData] = useState({ timelineTree: {}, historyList: [] });
  const [isLoading, setIsLoading] = useState(true);

  const fetchPredictiveData = async () => {
    setIsLoading(true);
    try {
      const customerId = user?._id || 'any';
      const [predRes, timeRes] = await Promise.all([
        api.get(`/predictiveCare/${customerId}/predictions`),
        api.get(`/predictiveCare/${customerId}/timeline`)
      ]);

      if (predRes.data.success) {
        setPredictions(predRes.data.data.predictions || []);
      }
      if (timeRes.data.success) {
        setTimelineData({
          timelineTree: timeRes.data.timelineTree || {},
          historyList: timeRes.data.historyList || []
        });
      }
    } catch (err) {
      console.error('Failed to load predictive care data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictiveData();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-cyan-900/50 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-glow-trust">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Lifecycle Diagnostic Engine</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Predictive Appliance Care & Service Timeline
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Turn passive repair receipts into proactive health insights. Our engine monitors repair frequencies and lifecycle intervals to prevent costly breakdown emergencies.
          </p>
        </div>
      </div>

      {/* Proactive AI Care Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Proactive AI Care Recommendations ({predictions.length})
          </h2>
          <span className="text-xs font-mono text-emerald-400">Automated Interval Analysis</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-44 rounded-2xl glass-panel animate-pulse bg-slate-900/40"></div>
            <div className="h-44 rounded-2xl glass-panel animate-pulse bg-slate-900/40"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predictions.map((pred) => (
              <PredictiveCareCard key={pred.id} prediction={pred} />
            ))}
          </div>
        )}
      </div>

      {/* Tree Structured Appliance Service History */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              Verified Appliance Service History
            </h2>
            <p className="text-xs text-slate-400">
              Tree structured by property location and specific home appliance
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {timelineData.historyList?.length || 0} Total Entries
          </span>
        </div>

        <ServiceTimeline
          timelineTree={timelineData.timelineTree}
          historyList={timelineData.historyList}
        />
      </div>
    </div>
  );
};
