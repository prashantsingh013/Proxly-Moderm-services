import React, { useState, useEffect } from 'react';
import {
  Activity,
  Shield,
  Zap,
  Lock,
  Unlock,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Send,
  Users,
  Star,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { EscrowStatusBadge } from '../components/escrow/EscrowStatusBadge';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const ProviderDashboard = () => {
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [openRequests, setOpenRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

  // Quotation Submission Modal
  const [selectedBookingForQuote, setSelectedBookingForQuote] = useState(null);
  const [quotePrice, setQuotePrice] = useState(450);
  const [quoteEta, setQuoteEta] = useState(30);
  const [quoteWarranty, setQuoteWarranty] = useState(30);
  const [quoteNotes, setQuoteNotes] = useState('Includes genuine parts & on-site inspection guarantee.');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  // Endorsement Modal
  const [isEndorsingOpen, setIsEndorsingOpen] = useState(false);
  const [endorseTargetId, setEndorseTargetId] = useState('');
  const [endorseRelationship, setEndorseRelationship] = useState('co_worked');
  const [endorseNote, setEndorseNote] = useState('');
  const [allProviders, setAllProviders] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchProviderData = async () => {
    setIsLoading(true);
    try {
      const [provRes, bookRes, allProvRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/bookings'),
        api.get('/providers?limit=50')
      ]);

      if (provRes.data.success && provRes.data.user?.providerDetails) {
        setProvider(provRes.data.user.providerDetails);
      }
      if (bookRes.data.success) {
        const all = bookRes.data.bookings || [];
        setBookings(all.filter(b => b.status !== 'REQUESTED'));
        setOpenRequests(all.filter(b => b.status === 'REQUESTED'));
      }
      if (allProvRes.data.success) {
        setAllProviders(allProvRes.data.providers || []);
      }
    } catch (err) {
      console.error('Failed to load provider dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviderData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        note: `Provider updated status to ${newStatus}`
      });

      if (res.data.success) {
        alert(`Status updated to ${newStatus}`);
        fetchProviderData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleSendQuotation = async (e) => {
    e.preventDefault();
    if (!selectedBookingForQuote) return;
    setIsSubmittingQuote(true);
    try {
      const res = await api.post('/quotations', {
        bookingId: selectedBookingForQuote._id,
        priceMin: quotePrice - 50,
        priceMax: quotePrice + 100,
        priceExact: quotePrice,
        etaMinutes: quoteEta,
        warrantyDays: quoteWarranty,
        validHours: 24,
        notes: quoteNotes
      });

      if (res.data.success) {
        alert('Quotation submitted successfully with warranty lock!');
        setSelectedBookingForQuote(null);
        fetchProviderData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit quotation');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleSendEndorsement = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/endorsements', {
        toProviderId: endorseTargetId,
        relationship: endorseRelationship,
        note: endorseNote
      });

      if (res.data.success) {
        alert('Trust Circle peer endorsement recorded!');
        setIsEndorsingOpen(false);
        setEndorseNote('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create endorsement');
    }
  };

  // Escrow Calculations
  const escrowPending = bookings
    .filter(b => b.escrow?.status === 'held')
    .reduce((sum, b) => sum + (b.escrow?.amount || b.finalAmount || 0), 0);

  const escrowReleased = bookings
    .filter(b => b.escrow?.status === 'released')
    .reduce((sum, b) => sum + (b.escrow?.amount || b.finalAmount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-900/50 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-glow-brand">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-300">
              PROVIDER PORTAL
            </span>
            <span className="text-xs font-mono text-slate-400">
              Tier: {provider?.verificationTier || 'Document Verified'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {provider?.businessName || user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Track confirmed jobs, send warranty-backed quotations, monitor escrow earnings, and build peer trust.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsEndorsingOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>Endorse a Peer (Trust Circles)</span>
          </button>

          {provider && (
            <Link
              to={`/providers/${provider._id}/trust`}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 flex items-center gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span>TrustScore: {provider.trustScoreCache?.score || 85}/100</span>
            </Link>
          )}
        </div>
      </div>

      {/* Escrow & Performance Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pending Escrow */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-900/40 bg-gradient-to-b from-cyan-950/20 to-slate-900/90 space-y-1">
          <div className="flex items-center justify-between text-cyan-400">
            <span className="text-xs font-mono uppercase">Pending in Escrow</span>
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">₹{escrowPending}</span>
          <p className="text-[11px] text-slate-400">Locked safely; auto-releases upon job completion</p>
        </div>

        {/* Released Earnings */}
        <div className="p-5 rounded-2xl glass-panel border border-emerald-900/40 bg-gradient-to-b from-emerald-950/20 to-slate-900/90 space-y-1">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-xs font-mono uppercase">Released Earnings</span>
            <Unlock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">₹{escrowReleased}</span>
          <p className="text-[11px] text-slate-400">Verified & available for payout</p>
        </div>

        {/* Completed Jobs */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Total Jobs Done</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {provider?.completedJobsCount || bookings.length}
          </span>
          <p className="text-[11px] text-slate-400">Zero upheld disputes</p>
        </div>

        {/* Peer Endorsements */}
        <div className="p-5 rounded-2xl glass-panel border border-indigo-900/40 space-y-1">
          <div className="flex items-center justify-between text-indigo-400">
            <span className="text-xs font-mono uppercase">Trust Circles</span>
            <Users className="w-4 h-4" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {provider?.endorsementCount || 4} Endorsements
          </span>
          <p className="text-[11px] text-slate-400">By verified local peers</p>
        </div>
      </div>

      {/* Tabs: Active Jobs vs Open Quote Requests */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'active'
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-glow-brand'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          My Confirmed Jobs ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
            activeTab === 'requests'
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-glow-brand'
              : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          Open Job Quotation Requests ({openRequests.length})
        </button>
      </div>

      {/* Content for Active Tab */}
      {activeTab === 'active' ? (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
              <p>No confirmed jobs currently active.</p>
            </div>
          ) : (
            bookings.map((b) => (
              <div
                key={b._id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">{b.serviceName}</span>
                      <EscrowStatusBadge status={b.escrow?.status || 'held'} amount={b.escrow?.amount || b.finalAmount} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{b.description}</p>
                    <div className="text-xs text-slate-400 mt-1">
                      Customer: {b.customerId?.name} • 📍 {b.addressText}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'PROVIDER_ON_THE_WAY')}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                      >
                        Start Transit (On The Way)
                      </button>
                    )}
                    {b.status === 'PROVIDER_ON_THE_WAY' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'IN_PROGRESS')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        Arrived & Start Work
                      </button>
                    )}
                    {b.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => handleUpdateStatus(b._id, 'COMPLETED')}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-glow-brand"
                      >
                        Mark Completed (Request Escrow Release)
                      </button>
                    )}

                    <Link
                      to={`/bookings/${b._id}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {openRequests.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl border border-slate-800 text-slate-400">
              <p>No new quotation requests in your categories right now.</p>
            </div>
          ) : (
            openRequests.map((req) => (
              <div
                key={req._id}
                className="p-5 rounded-2xl glass-panel border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      QUOTATION NEEDED
                    </span>
                    <span className="font-bold text-base text-white">{req.serviceName}</span>
                  </div>
                  <p className="text-xs text-slate-300">{req.description}</p>
                  <p className="text-xs text-slate-400">📍 Locality: {req.locality}, Bangalore</p>
                </div>

                <button
                  onClick={() => setSelectedBookingForQuote(req)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-brand shrink-0"
                >
                  Send Quotation & Warranty
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal: Submit Quotation */}
      {selectedBookingForQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-emerald-500/50 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              Send Fixed Quotation for {selectedBookingForQuote.serviceName}
            </h3>

            <form onSubmit={handleSendQuotation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Fixed Quote Amount (₹):</label>
                  <input
                    type="number"
                    value={quotePrice}
                    onChange={(e) => setQuotePrice(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Arrival ETA (Mins):</label>
                  <input
                    type="number"
                    value={quoteEta}
                    onChange={(e) => setQuoteEta(Number(e.target.value))}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Guaranteed Warranty Period (Days):</label>
                <select
                  value={quoteWarranty}
                  onChange={(e) => setQuoteWarranty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value={15}>15 Days Guarantee</option>
                  <option value={30}>30 Days Guaranteed Warranty (Standard)</option>
                  <option value={60}>60 Days Comprehensive Warranty</option>
                  <option value={90}>90 Days Extended Coverage</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Scope & Transparency Notes:</label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBookingForQuote(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingQuote}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-glow-brand"
                >
                  {isSubmittingQuote ? 'Submitting...' : 'Submit Quotation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Endorse Peer Provider */}
      {isEndorsingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-indigo-500/50 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              Endorse a Peer Specialist (Trust Circles)
            </h3>

            <form onSubmit={handleSendEndorsement} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Select Peer Specialist:</label>
                <select
                  value={endorseTargetId}
                  onChange={(e) => setEndorseTargetId(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="">Choose a specialist...</option>
                  {allProviders.filter(p => p._id !== provider?._id).map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.businessName} ({p.categories?.join(', ')} - {p.address?.locality})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Professional Working Relationship:</label>
                <select
                  value={endorseRelationship}
                  onChange={(e) => setEndorseRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="co_worked">Co-worked on joint projects/renovations</option>
                  <option value="referred">Trusted primary referral partner</option>
                  <option value="local_peer">Verified locality peer specialist</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Endorsement Recommendation Note:</label>
                <textarea
                  required
                  rows={3}
                  value={endorseNote}
                  onChange={(e) => setEndorseNote(e.target.value)}
                  placeholder="Explain why you vouch for their workmanship and ethics..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEndorsingOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!endorseTargetId || !endorseNote.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Publish Peer Endorsement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
