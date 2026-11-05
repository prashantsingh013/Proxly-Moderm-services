import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  Sparkles,
  Search,
  CheckCircle,
  Clock,
  Award,
  Users,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Cpu,
  MapPin
} from 'lucide-react';
import { VoiceInput } from '../components/common/VoiceInput';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';

export const Home = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [problemQuery, setProblemQuery] = useState('');
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState(null);

  const handleVoiceTranscription = (transcript) => {
    setProblemQuery(transcript);
    handleDiagnose(transcript);
  };

  const handleDiagnose = async (overrideText) => {
    const textToAnalyze = overrideText || problemQuery;
    if (!textToAnalyze.trim()) return;

    setIsDiagnosing(true);
    try {
      const res = await api.post('/classify', { problemText: textToAnalyze });
      if (res.data.success) {
        setDiagnosticResult(res.data.classification);
      }
    } catch (err) {
      console.error('Diagnosis error:', err);
    } finally {
      setIsDiagnosing(false);
    }
  };

  const featuredCategories = [
    { name: 'Electrician', icon: '⚡', desc: 'Wiring, MCBs, lighting & switchboards', urgent: true },
    { name: 'Plumber', icon: '💧', desc: 'Pipe leaks, taps, geysers & clogs', urgent: true },
    { name: 'Air Conditioner', icon: '❄️', desc: 'Deep jet clean, gas refill & PCB repairs', urgent: false },
    { name: 'Appliance Technician', icon: '🛠️', desc: 'Washing machines, fridge & RO purifiers', urgent: false },
    { name: 'Carpenter', icon: '🪚', desc: 'Door locks, hinges & furniture assembly', urgent: false },
    { name: 'Home Cleaning', icon: '✨', desc: 'Deep bathroom, kitchen & sofa shampooing', urgent: false }
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-medium mb-6 shadow-glow-brand">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Trust is Computed • Matching is Reasoned</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
          {t('hero.titlePrefix')}{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            {t('hero.titleHighlight')}
          </span>{' '}
          {t('hero.titleSuffix')}
        </h1>

        <p className="mt-6 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero.subtitle')}
        </p>

        {/* AI & VOICE PROBLEM DIAGNOSIS BOX */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="p-2 sm:p-3 rounded-2xl glass-panel border border-slate-700/80 shadow-2xl space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={problemQuery}
                  onChange={(e) => setProblemQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleDiagnose()}
                  placeholder={t('hero.searchPlaceholder')}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Web Speech Voice Input */}
              <VoiceInput onTranscription={handleVoiceTranscription} />

              <button
                type="button"
                onClick={() => handleDiagnose()}
                disabled={isDiagnosing || !problemQuery.trim()}
                className="px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand transition-all shrink-0 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isDiagnosing ? 'Analyzing...' : t('hero.diagnoseBtn')}</span>
              </button>
            </div>

            {/* Quick Suggestions Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 px-1 text-xs text-slate-400">
              <span className="text-[11px] font-mono text-slate-400">Popular Queries:</span>
              <button
                onClick={() => { setProblemQuery('Switchboard sparking with burning smell'); handleDiagnose('Switchboard sparking with burning smell'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-colors"
              >
                ⚡ Sparking switchboard
              </button>
              <button
                onClick={() => { setProblemQuery('Kitchen sink drain pipe burst and flooding'); handleDiagnose('Kitchen sink drain pipe burst and flooding'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-colors"
              >
                💧 Pipe burst leak
              </button>
              <button
                onClick={() => { setProblemQuery('AC not cooling properly needs gas topup'); handleDiagnose('AC not cooling properly needs gas topup'); }}
                className="px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 text-[11px] transition-colors"
              >
                ❄️ AC cooling issue
              </button>
            </div>
          </div>

          {/* DIAGNOSTIC AI RESULT PREVIEW DRAWER */}
          {diagnosticResult && (
            <div className="mt-4 p-5 rounded-2xl glass-panel border border-emerald-500/50 bg-gradient-to-b from-slate-900/95 to-slate-950 text-left space-y-3 animate-fade-in shadow-glow-brand">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    AI Diagnosis Complete ({diagnosticResult.category})
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    Engine: {diagnosticResult.classifiedBy.toUpperCase()}
                  </span>
                </div>

                <span className={`text-xs font-mono px-2.5 py-0.5 rounded-full font-bold ${
                  diagnosticResult.isEmergency
                    ? 'bg-rose-950/90 text-rose-300 border border-rose-700/60'
                    : 'bg-emerald-950/90 text-emerald-300 border border-emerald-700/60'
                }`}>
                  Urgency: Level {diagnosticResult.urgencyLevel}/5 {diagnosticResult.isEmergency ? '• EMERGENCY' : '• STANDARD'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px]">Identified Category & Service:</span>
                  <p className="font-semibold text-white">{diagnosticResult.subCategory}</p>
                  <p className="text-slate-400 text-[11px]">{diagnosticResult.urgencyReason}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 text-[11px]">Transparent Market Price Band:</span>
                  <p className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{diagnosticResult.estimatedCost?.min} – ₹{diagnosticResult.estimatedCost?.max}
                  </p>
                  <p className="text-slate-400 text-[11px]">Recommended Skills: {diagnosticResult.suggestedSkills?.join(', ')}</p>
                </div>
              </div>

              {diagnosticResult.recommendedAction && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-amber-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Safety Guidance:</strong> {diagnosticResult.recommendedAction}</span>
                </div>
              )}

              <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                <button
                  onClick={() => setDiagnosticResult(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Dismiss
                </button>
                <Link
                  to={`/providers?category=${encodeURIComponent(diagnosticResult.category)}&emergency=${diagnosticResult.isEmergency}`}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand flex items-center gap-1.5"
                >
                  <span>Find Best SmartMatches for {diagnosticResult.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Rapid Emergency Callout Bar */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/emergency"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-950/80 to-slate-900 border border-rose-600/40 text-rose-300 text-xs font-semibold hover:border-rose-500 hover:scale-105 transition-all shadow-glow-emergency"
          >
            <Zap className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>{t('hero.emergencyBtn')}</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
      </section>

      {/* THREE UNIQUE PILLARS EXPLAINER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Computed TrustScore */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 shadow-glow-brand">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              1. Trust is Computed, Not Averaged
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No generic 5-star ratings or fake review spam. SkillBridge runs a 7-factor mathematical TrustScore factoring completion discipline, response speeds, verified tiers, and decaying report penalties.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-400 flex items-center gap-1">
              <span>View Audit Math & Breakdown →</span>
            </div>
          </div>

          {/* Pillar 2: Reasoned SmartMatch */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-glow-trust">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              2. Reasoned Matching, Zero Ad Bidding
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Providers cannot pay for top spots. Every match provides an explainable checklist ("Why recommended") and a transparent "Why NOT ranked higher" penalty inspection drawer.
            </p>
            <div className="pt-2 text-xs font-mono text-cyan-400 flex items-center gap-1">
              <span>SmartMatch Proximity Ranking →</span>
            </div>
          </div>

          {/* Pillar 3: Trust Circles & Escrow */}
          <div className="p-6 rounded-3xl glass-panel border border-slate-800 hover:border-indigo-500/40 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/80 border border-indigo-700/60 flex items-center justify-center text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-lg text-white">
              3. Provider Dignity & Fair Escrow
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Providers are empowered through hyperlocal peer endorsements (Trust Circles) and payment security: funds are held in escrow and released upon verification, with mutual reporting protection.
            </p>
            <div className="pt-2 text-xs font-mono text-indigo-400 flex items-center gap-1">
              <span>Explore Neighborhood Circles →</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CATEGORIES CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Verified Service Verticals
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Guaranteed transparent price bands, warranty certificates, and background-verified technicians
            </p>
          </div>
          <Link to="/services" className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Explore All 15 Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/providers?category=${encodeURIComponent(cat.name)}`}
              className="p-5 rounded-2xl glass-panel border border-slate-800 hover:border-emerald-500/40 hover:-translate-y-1 transition-all group flex items-start gap-4"
            >
              <div className="text-3xl p-3 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>
                  {cat.urgent && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60">
                      24/7 Rapid
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-snug">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* LIVE PLATFORM METRICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 rounded-3xl glass-panel border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black font-display text-white">32+</span>
              <p className="text-xs text-slate-400">Verified Specialists</p>
              <span className="text-[10px] font-mono text-emerald-400">Bangalore Metros</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black font-display text-emerald-400">12 min</span>
              <p className="text-xs text-slate-400">Avg Response Time</p>
              <span className="text-[10px] font-mono text-cyan-400">Real-time GPS dispatch</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black font-display text-cyan-400">100%</span>
              <p className="text-xs text-slate-400">Escrow Protected</p>
              <span className="text-[10px] font-mono text-emerald-400">Zero advance risk</span>
            </div>
            <div className="space-y-1">
              <span className="text-3xl sm:text-4xl font-black font-display text-indigo-400">97.4%</span>
              <p className="text-xs text-slate-400">Dispute-Free Rate</p>
              <span className="text-[10px] font-mono text-indigo-300">Trust Circle verified</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
