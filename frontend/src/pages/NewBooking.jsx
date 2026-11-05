import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Shield, Sparkles, MapPin, Calendar, Clock, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BANGALORE_LOCALITIES } from '../translations/localities';
import api from '../services/api';

export const NewBooking = () => {
  const [searchParams] = useSearchParams();
  const targetProviderId = searchParams.get('providerId') || '';
  const initialCategory = searchParams.get('category') || 'Electrician';
  const initialServiceName = searchParams.get('serviceName') || `${initialCategory} Standard Service`;
  const initialDescription = searchParams.get('description') || '';
  const isEmergencyParam = searchParams.get('emergency') === 'true';

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState(initialCategory);
  const [serviceName, setServiceName] = useState(initialServiceName);
  const [description, setDescription] = useState(initialDescription);
  const [locality, setLocality] = useState('Indiranagar');
  const [addressText, setAddressText] = useState('100 Feet Road, Indiranagar, Bangalore');
  const [isEmergency, setIsEmergency] = useState(isEmergencyParam);
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('Immediate / ASAP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please sign in or select a demo persona to place a booking.');
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedLoc = BANGALORE_LOCALITIES.find(l => l.name === locality) || BANGALORE_LOCALITIES[0];

      const res = await api.post('/bookings', {
        targetProviderId: targetProviderId || null,
        category,
        serviceName,
        description,
        locality,
        city: 'Bangalore',
        addressText,
        location: { coordinates: selectedLoc.coordinates },
        isEmergency,
        preferredTimeSlot,
        emergencyDetails: isEmergency ? {
          surchargePercent: 20,
          flatFee: 150,
          baseEstimatedCost: 450,
          totalEstimatedCost: 690,
          radiusLevel: 1,
          etaMinutes: 20
        } : {}
      });

      if (res.data.success) {
        navigate(`/bookings/${res.data.booking._id}`);
      }
    } catch (err) {
      console.error('Failed to create booking:', err);
      alert(err.response?.data?.message || 'Booking submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>SkillBridge Safe Escrow Booking</span>
        </div>
        <h1 className="text-2xl font-bold font-display text-white">
          {targetProviderId ? 'Request Service from Provider' : 'Post Service Request for Quotations'}
        </h1>
        <p className="text-xs text-slate-400">
          Your request will be broadcast to top-matched verified specialists. Zero advance payment required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-5">
        {/* Category & Service */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Service Task Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        {/* Detailed Problem Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Problem Description & Symptoms</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Describe the issue (e.g. sparks near switch, low cooling in bedroom AC)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500"
          />
        </div>

        {/* Locality & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bangalore Locality</label>
            <select
              value={locality}
              onChange={(e) => {
                setLocality(e.target.value);
                setAddressText(`Main Road, ${e.target.value}, Bangalore`);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              {BANGALORE_LOCALITIES.map((loc) => (
                <option key={loc.name} value={loc.name}>{loc.name} ({loc.pincode})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Street Address</label>
            <input
              type="text"
              value={addressText}
              onChange={(e) => setAddressText(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>
        </div>

        {/* Emergency Mode Radio */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-rose-400" />
            <div>
              <span className="text-xs font-bold text-white">Emergency Mode Dispatch</span>
              <p className="text-[11px] text-slate-400">Pings high-priority rapid response net (ETA ~15-20 min)</p>
            </div>
          </div>

          <input
            type="checkbox"
            checked={isEmergency}
            onChange={(e) => setIsEmergency(e.target.checked)}
            className="w-4 h-4 accent-rose-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-brand flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Submitting...' : 'Confirm Request & Receive Transparent Quotes'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
