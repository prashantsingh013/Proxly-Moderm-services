import React, { useState, useEffect } from 'react';
import { Users, Shield, Heart, MapPin, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { EndorsementCard } from '../components/community/EndorsementCard';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { Link } from 'react-router-dom';
import { BANGALORE_LOCALITIES } from '../translations/localities';
import api from '../services/api';

export const CommunityPage = () => {
  const [feed, setFeed] = useState([]);
  const [topEndorsed, setTopEndorsed] = useState([]);
  const [selectedLocality, setSelectedLocality] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchCommunityData = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/endorsements/community-feed', {
        params: selectedLocality ? { locality: selectedLocality } : {}
      });

      if (res.data.success) {
        setFeed(res.data.feed || []);
        setTopEndorsed(res.data.topEndorsedProviders || []);
      }
    } catch (err) {
      console.error('Failed to load community feed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [selectedLocality]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-indigo-900/50 bg-gradient-to-r from-indigo-950/30 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-mono font-medium">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Hyperlocal Trust Circles Network</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Neighborhood Endorsement Feed
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Local service specialists endorsing trusted peers they have co-worked with or referred. Real local accountability over anonymous internet reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedLocality}
            onChange={(e) => setSelectedLocality(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
          >
            <option value="">All Bangalore Localities</option>
            {BANGALORE_LOCALITIES.map((loc) => (
              <option key={loc.name} value={loc.name}>{loc.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Feed + Top Endorsed Specialists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Endorsement Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Latest Peer Endorsements ({feed.length})
            </h2>
            <span className="text-xs font-mono text-slate-400">Verified Provider Network</span>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 rounded-2xl glass-panel animate-pulse bg-slate-900/40"></div>
              ))}
            </div>
          ) : feed.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 border border-slate-800">
              <Users className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No peer endorsements in this locality yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {feed.map((end) => (
                <EndorsementCard key={end._id} endorsement={end} />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Top Locally Endorsed Leaders */}
        <div className="space-y-4">
          <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            Top Locally Endorsed Pros
          </h2>

          <div className="space-y-3">
            {topEndorsed.map((p) => (
              <div
                key={p._id}
                className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <Link
                      to={`/providers/${p._id}`}
                      className="font-bold text-sm text-white hover:text-emerald-400 transition-colors"
                    >
                      {p.businessName}
                    </Link>
                    <p className="text-xs text-slate-400">{p.categories?.join(', ')}</p>
                  </div>
                  <TrustScoreBadge
                    score={p.trustScoreCache?.score || 85}
                    size="sm"
                    showLevel={false}
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
                  <span className="text-indigo-300 font-mono text-[11px] flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {p.endorsementCount || 0} Peer Endorsement{p.endorsementCount > 1 ? 's' : ''}
                  </span>
                  <Link
                    to={`/providers/${p._id}`}
                    className="text-emerald-400 hover:underline text-[11px] font-medium"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl glass-panel border border-slate-800 text-xs text-slate-300 space-y-2">
            <h4 className="font-semibold text-white">How Trust Circles Work:</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              When a verified electrician vouches for a plumber they partner with, both specialists put their reputation on the line. Providers reaching 3+ verified endorsements graduate to the coveted <strong>Locally Endorsed</strong> tier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
