import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  MapPin,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Award,
  Users,
  Heart,
  ArrowRight
} from 'lucide-react';
import { TrustScoreBadge } from '../trust/TrustScoreBadge';

export const SmartMatchCard = ({ match, rank = 1, onSelect }) => {
  const [whyNotOpen, setWhyNotOpen] = useState(false);
  const provider = match.provider;
  const matchScore = match.matchScore || 85;
  const whyRecommended = match.whyRecommended || [];
  const dragFactors = match.dragFactors || [];

  return (
    <div className={`p-5 rounded-2xl glass-panel border transition-all duration-300 ${
      rank === 1
        ? 'border-emerald-500/50 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 shadow-glow-brand'
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          {/* Rank Badge */}
          <div className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center shrink-0 ${
            rank === 1
              ? 'bg-emerald-500 text-slate-950 shadow-glow-brand'
              : (rank === 2 ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400')
          }`}>
            #{rank}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/providers/${provider._id}`}
                className="font-display font-bold text-base text-white hover:text-emerald-400 transition-colors"
              >
                {provider.businessName}
              </Link>
              <TrustScoreBadge
                score={provider.trustScoreCache?.score || 80}
                level={provider.trustScoreCache?.level || 'Trusted'}
                size="sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {provider.address?.locality || 'Bangalore'} ({match.distanceKm || 2.4} km)
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                ~{provider.responseTimeMinutes || 15}m response
              </span>
              <span className="font-semibold text-emerald-400">
                ₹{provider.hourlyRate || 400}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Match Compatibility Meter */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-emerald-300">{matchScore}% Match</span>
          </div>
          <Link
            to={`/providers/${provider._id}/trust`}
            className="text-[11px] text-cyan-400 hover:underline flex items-center gap-0.5 mt-0.5"
          >
            Audit Trust Score →
          </Link>
        </div>
      </div>

      {/* Categories & Verification Badges */}
      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-800/60">
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
          {provider.verificationTier || 'Document Verified'}
        </span>
        {provider.endorsementCount > 0 && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 flex items-center gap-1">
            <Users className="w-3 h-3 text-indigo-400" />
            Endorsed by {provider.endorsementCount} local pros
          </span>
        )}
        {provider.neighborhoodFavoriteCount > 0 && (
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 border border-rose-800/60 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
            {provider.neighborhoodFavoriteCount} local favorites
          </span>
        )}
      </div>

      {/* Why Recommended Checklist */}
      <div className="mt-3.5 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 space-y-1.5">
        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Why Recommended for You:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-slate-300">
          {whyRecommended.map((reason, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="text-emerald-400 text-xs">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* "Why NOT this provider" Expandable Drawer */}
      <div className="mt-3 pt-2">
        <button
          type="button"
          onClick={() => setWhyNotOpen(!whyNotOpen)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-mono transition-colors"
        >
          <span>Why not ranked higher? (Match Reasoning Audit)</span>
          {whyNotOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {whyNotOpen && (
          <div className="mt-2 p-3 rounded-xl bg-slate-950/90 border border-amber-900/30 text-xs text-slate-300 space-y-1.5 transition-all">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Score Drag Factors:
            </span>
            <ul className="space-y-1 text-slate-400 text-xs">
              {dragFactors.map((factor, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-400">›</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <Link
          to={`/providers/${provider._id}`}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          View Full Profile & Reviews
        </Link>
        <Link
          to={`/book?providerId=${provider._id}&category=${provider.categories[0]}`}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand transition-all flex items-center gap-1.5"
        >
          <span>Request Quotation / Book</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
