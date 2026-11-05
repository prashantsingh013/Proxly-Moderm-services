import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap, Radio, Clock, ShieldCheck, MapPin, ArrowRight, AlertTriangle } from 'lucide-react';
import { EscalationRadar } from '../components/emergency/EscalationRadar';
import { SurchargeBreakdown } from '../components/emergency/SurchargeBreakdown';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { useAuth } from '../context/AuthContext';
import { BANGALORE_LOCALITIES } from '../translations/localities';
import api from '../services/api';

export const EmergencyPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState('Electrician');
  const [tier, setTier] = useState(1);
  const [locality, setLocality] = useState('Indiranagar');
  const [description, setDescription] = useState('Immediate hazard / breakdown emergency');
  const [nearbyResults, setNearbyResults] = useState(null);
  const [surchargeData, setSurchargeData] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  // Selected coordinate
  const selectedLoc = BANGALORE_LOCALITIES.find(l => l.name === locality) || BANGALORE_LOCALITIES[0];

  const searchEmergencyNet = async (currentTier = 1) => {
    setIsSearching(true);
    try {
      const res = await api.get('/emergency/nearby', {
        params: {
          category,
          lng: selectedLoc.coordinates[0],
          lat: selectedLoc.coordinates[1],
          tier: currentTier
        }
      });

      if (res.data.success) {
        setNearbyResults(res.data);
        setSurchargeData(res.data.surchargeBreakdown);
      }
    } catch (err) {
      console.error('Emergency search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    searchEmergencyNet(tier);
  }, [category, locality, tier]);

  const handleEscalate = (nextTier) => {
    setTier(nextTier);
    searchEmergencyNet(nextTier);
  };

  const handleInstantDispatch = async (targetProvider = null) => {
    if (!isAuthenticated) {
      alert('Please log in or select a demo account before placing an emergency dispatch.');
      navigate('/login');
      return;
    }

    setIsDispatching(true);
    try {
      const res = await api.post('/emergency/request', {
        category,
        description: `🚨 Emergency 24/7 Request: ${description} at ${locality}`,
        locality,
        addressText: `100ft Road, ${locality}, Bangalore`,
        location: { coordinates: selectedLoc.coordinates },
        baseEstimatedCost: 450,
        targetProviderId: targetProvider?._id || null
      });

      if (res.data.success) {
        navigate(`/bookings/${res.data.booking._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Emergency dispatch failed');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-rose-900/60 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-glow-emergency">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/90 border border-rose-700/60 text-rose-300 text-xs font-mono font-medium animate-pulse">
            <Zap className="w-3.5 h-3.5 text-rose-400" />
            <span>24/7 Rapid Emergency Net Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Emergency Service Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
            Geospatial radar tracking with transparent surcharge locks and auto-expanding net fallback.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white font-semibold focus:border-rose-500"
          >
            <option value="Electrician">⚡ Electrician (Sparks / MCB)</option>
            <option value="Plumber">💧 Plumber (Pipe Burst / Flooding)</option>
            <option value="Air Conditioner">❄️ AC (Severe Gas Leak)</option>
            <option value="Locksmith">🔑 Locksmith (Locked Out)</option>
            <option value="Appliance Technician">🛠️ Appliance Emergency</option>
          </select>
        </div>
      </div>

      {/* Grid: Radar Search + Surcharge Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Radar Search */}
        <div className="lg:col-span-2 space-y-6">
          <EscalationRadar
            currentTier={tier}
            totalFound={nearbyResults?.totalFound || 0}
            onEscalate={handleEscalate}
            isSearching={isSearching}
          />

          {/* Emergency Specialists Available */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Nearby Emergency Specialists on Standby ({nearbyResults?.providers?.length || 0})</span>
              <span className="text-xs font-mono text-rose-400">ETA: ~15-25m</span>
            </h3>

            {(!nearbyResults?.providers || nearbyResults.providers.length === 0) ? (
              <div className="p-8 rounded-2xl glass-panel text-center text-slate-400 border border-slate-800 space-y-3">
                <AlertTriangle className="w-6 h-6 mx-auto text-amber-400" />
                <p className="text-xs">No providers found in Tier {tier} radius ({tier === 1 ? '5km' : '10km'}).</p>
                {tier < 3 && (
                  <button
                    onClick={() => handleEscalate(tier + 1)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 text-white shadow-glow-emergency"
                  >
                    Widen Radar Search Net to Tier {tier + 1}
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {nearbyResults.providers.map((p) => (
                  <div
                    key={p._id}
                    className="p-4 rounded-2xl glass-panel border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{p.businessName}</span>
                        <TrustScoreBadge
                          score={p.trustScoreCache?.score || 85}
                          level={p.trustScoreCache?.level || 'Trusted'}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400">
                          <MapPin className="w-3.5 h-3.5" />
                          {p.distanceKm} km away
                        </span>
                        <span className="flex items-center gap-1 text-cyan-400 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          ETA: {p.etaDisplay}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleInstantDispatch(p)}
                      disabled={isDispatching}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-glow-emergency transition-all flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{isDispatching ? 'Dispatching...' : 'Dispatch Specialist Now'}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Surcharge Breakdown & Broadcast */}
        <div className="space-y-6">
          <SurchargeBreakdown surchargeData={surchargeData} />

          <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-4">
            <h4 className="text-xs font-mono font-semibold uppercase text-slate-300">
              Broadband Sector Dispatch
            </h4>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400">Your Locality in Bangalore:</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              >
                {BANGALORE_LOCALITIES.map((loc) => (
                  <option key={loc.name} value={loc.name}>{loc.name} ({loc.pincode})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 text-xs">
              <label className="text-slate-400">Urgent Symptoms Note:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>

            <button
              onClick={() => handleInstantDispatch(null)}
              disabled={isDispatching}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-bold text-xs shadow-glow-emergency flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>Broadcast Emergency Net (Top Standby Pros)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
