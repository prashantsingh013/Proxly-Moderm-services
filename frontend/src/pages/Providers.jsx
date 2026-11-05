import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Shield, Sparkles, MapPin, Filter, Layers, Zap, SlidersHorizontal } from 'lucide-react';
import { SmartMatchCard } from '../components/match/SmartMatchCard';
import api from '../services/api';

export const Providers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'Electrician';
  const emergencyParam = searchParams.get('emergency') === 'true';

  const [matches, setMatches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [isEmergency, setIsEmergency] = useState(emergencyParam);
  const [minBudget, setMinBudget] = useState(300);
  const [maxBudget, setMaxBudget] = useState(800);
  const [isLoading, setIsLoading] = useState(true);

  // Default coordinate: Indiranagar, Bangalore
  const customerLng = 77.6408;
  const customerLat = 12.9784;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/services/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/matches', {
          params: {
            category: selectedCategory,
            lng: customerLng,
            lat: customerLat,
            minBudget,
            maxBudget,
            isEmergency: isEmergency ? 'true' : 'false',
            maxDistanceKm: 25
          }
        });

        if (res.data.success) {
          setMatches(res.data.matches);
        }
      } catch (err) {
        console.error('Failed to load SmartMatches:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [selectedCategory, isEmergency, minBudget, maxBudget]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 text-xs font-mono font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>SmartMatch Multi-Factor Ranking Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
          Reasoned Provider Matching
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ranked purely by verified TrustScore (30%), Proximity (25%), Availability (20%), Budget Fit (15%), and Past Track Record (10%). Zero sponsored positions.
        </p>
      </div>

      {/* Control Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category Selector */}
          <div>
            <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Service Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-1 w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map((c) => (
                <option key={c._id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Target Budget Range</label>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Min ₹"
              />
              <span className="text-slate-500 text-xs">–</span>
              <input
                type="number"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                placeholder="Max ₹"
              />
            </div>
          </div>

          {/* Location Focus */}
          <div>
            <label className="text-[11px] font-mono font-semibold text-slate-400 uppercase">Geospatial Origin</label>
            <div className="mt-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">Indiranagar (12.978, 77.640)</span>
            </div>
          </div>

          {/* Emergency Toggle */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setIsEmergency(!isEmergency)}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all ${
                isEmergency
                  ? 'bg-rose-950/80 border-rose-600 text-rose-300 shadow-glow-emergency'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>{isEmergency ? 'Emergency Mode (Active)' : 'Standard Booking'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SmartMatch List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 rounded-2xl glass-panel animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : matches.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
          <Shield className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">No specialists found matching this exact filter combination.</p>
          <p className="text-xs text-slate-400 mt-1">Try expanding your budget ceiling or switching category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {matches.length} Reasoned Matches for {selectedCategory}</span>
            <span className="font-mono">Ranked by SmartMatch Score</span>
          </div>

          {matches.map((match, idx) => (
            <SmartMatchCard
              key={match.provider._id}
              match={match}
              rank={idx + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
