import React from 'react';
import { Users, ShieldCheck, MapPin, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TrustScoreBadge } from '../trust/TrustScoreBadge';

export const EndorsementCard = ({ endorsement }) => {
  const from = endorsement.fromProviderId || {};
  const to = endorsement.toProviderId || {};
  const relationshipLabels = {
    co_worked: '🤝 Co-worked on Joint Projects',
    referred: '⭐ Preferred Referral Partner',
    local_peer: '📍 Verified Locality Specialist',
    master_apprentice: '🎓 Master Practitioner'
  };

  return (
    <div className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all space-y-3">
      {/* Endorser Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 p-0.5 flex items-center justify-center font-bold text-white text-xs">
            {from.businessName ? from.businessName.charAt(0) : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-white">
                {from.businessName || 'Verified Specialist'}
              </span>
              <TrustScoreBadge
                score={from.trustScoreCache?.score || 85}
                size="sm"
                showLevel={false}
              />
            </div>
            <div className="text-[11px] text-slate-400">
              {from.categories?.join(', ')} • {endorsement.locality || 'Bangalore'}
            </div>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/60 shrink-0">
          {relationshipLabels[endorsement.relationship] || 'Peer Endorsement'}
        </span>
      </div>

      {/* Note */}
      <div className="relative pl-6 text-xs text-slate-300 italic">
        <Quote className="w-3.5 h-3.5 text-indigo-400 absolute left-0 top-0.5" />
        "{endorsement.note}"
      </div>

      {/* Target Recipient Link */}
      {to.businessName && (
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Vouching for:</span>
          <Link
            to={`/providers/${to._id}`}
            className="text-emerald-400 hover:underline font-medium"
          >
            {to.businessName} →
          </Link>
        </div>
      )}
    </div>
  );
};
