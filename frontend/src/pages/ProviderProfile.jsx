import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Shield,
  Star,
  MapPin,
  Clock,
  Award,
  Users,
  Heart,
  Zap,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { TrustScoreGauge } from '../components/trust/TrustScoreGauge';
import { EndorsementCard } from '../components/community/EndorsementCard';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProviderProfile = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [provider, setProvider] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/providers/${id}`);
        if (res.data.success) {
          setProvider(res.data.provider);
          setFavCount(res.data.provider.neighborhoodFavoriteCount || 0);
        }
      } catch (err) {
        console.error('Failed to load provider profile:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProvider();
  }, [id]);

  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      alert('Please log in as a customer to mark neighborhood favorites.');
      return;
    }
    try {
      const res = await api.post('/endorsements/favorite', {
        providerId: id,
        locality: provider?.address?.locality || 'Indiranagar'
      });
      if (res.data.success) {
        setIsFavorite(res.data.isFavorite);
        setFavCount(res.data.neighborhoodFavoriteCount);
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
        <div className="h-48 rounded-3xl glass-panel animate-pulse bg-slate-900/40"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <Shield className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p>Provider profile not found.</p>
      </div>
    );
  }

  const trustCache = provider.trustScoreCache || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-glow-brand shrink-0 flex items-center justify-center font-display font-bold text-2xl text-white">
              {provider.businessName.charAt(0)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                  {provider.businessName}
                </h1>
                <TrustScoreBadge
                  score={trustCache.score || 80}
                  level={trustCache.level || 'Trusted'}
                  size="md"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {provider.address?.street}, {provider.address?.locality}, {provider.address?.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Avg response: ~{provider.responseTimeMinutes || 15} mins
                </span>
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {provider.baseRating || 4.8} ({provider.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Tier: {provider.verificationTier}
                </span>
                {provider.isEmergencyAvailable && (
                  <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-rose-400" /> 24/7 Rapid Emergency Ready
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <button
              onClick={toggleFavorite}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                isFavorite
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-slate-400'}`} />
              <span>{isFavorite ? 'Neighborhood Favorite' : 'Add to Favorites'} ({favCount})</span>
            </button>

            <Link
              to={`/providers/${provider._id}/trust`}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 hover:bg-cyan-900 shadow-glow-trust flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>Inspect Trust Math & History</span>
            </Link>

            <Link
              to={`/book?providerId=${provider._id}&category=${encodeURIComponent(provider.categories[0])}`}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand flex items-center gap-1.5"
            >
              <span>Book / Request Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Trust Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio, Skills, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio & Skills */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Specialist Overview & Experience</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {provider.bio || 'Verified local service provider committed to transparent billing and workmanship guarantees.'}
            </p>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-mono text-slate-400 uppercase">Verified Skills & Tools</span>
              <div className="flex flex-wrap gap-1.5">
                {provider.skills?.map((skill, idx) => (
                  <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Peer Endorsements (Trust Circles) */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">
                  Trust Circles Peer Endorsements ({provider.endorsementsList?.length || 0})
                </h3>
              </div>
              <Link to="/community" className="text-xs text-indigo-400 hover:underline">
                Explore Trust Circles Feed →
              </Link>
            </div>

            {(!provider.endorsementsList || provider.endorsementsList.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No peer endorsements registered yet.</p>
            ) : (
              <div className="space-y-3">
                {provider.endorsementsList.map((end) => (
                  <EndorsementCard key={end._id} endorsement={end} />
                ))}
              </div>
            )}
          </div>

          {/* Customer Reviews */}
          <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Verified Job Reviews ({provider.recentReviews?.length || 0})
            </h3>

            {(!provider.recentReviews || provider.recentReviews.length === 0) ? (
              <p className="text-xs text-slate-400 italic">No customer reviews yet.</p>
            ) : (
              <div className="space-y-3">
                {provider.recentReviews.map((rev) => (
                  <div key={rev._id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{rev.customerId?.name || 'Customer'}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                          VERIFIED ESCROW JOB
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-slate-300 italic">"{rev.comment}"</p>
                    <span className="text-[10px] font-mono text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Trust Gauge & Quick Breakdown */}
        <div className="space-y-6">
          <TrustScoreGauge
            score={trustCache.score || 85}
            level={trustCache.level || 'Highly Trusted'}
            factors={trustCache.factors}
          />

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3 text-xs">
            <h4 className="font-semibold text-white flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-400" />
              SkillBridge Trust Guarantee
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Zero advance deposit. Payment held safely in escrow.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mandatory 30-day workmanship warranty on all quotes.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Mutual report arbitration to protect against fake bookings or malpractice.</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to={`/providers/${provider._id}/trust`}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-mono font-medium flex items-center justify-center gap-1.5"
              >
                <span>View Full Mathematical Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
