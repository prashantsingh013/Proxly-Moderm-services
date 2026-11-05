import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  MapPin,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Award,
  Zap,
  ArrowLeft,
  Lock,
  Unlock,
  Star,
  MessageSquare,
  FileText
} from 'lucide-react';
import { EscrowStatusBadge } from '../components/escrow/EscrowStatusBadge';
import { QuotationComparisonTable } from '../components/quotes/QuotationComparisonTable';
import { DisputeModal } from '../components/escrow/DisputeModal';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const BookingDetail = () => {
  const { id } = useParams();
  const { user, role } = useAuth();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [isDisputeOpen, setIsDisputeOpen] = useState(false);
  const [isReportingOpen, setIsReportingOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportType, setReportType] = useState('no_show');

  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  const fetchBooking = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/bookings/${id}`);
      if (res.data.success) {
        setBooking(res.data.booking);
        setQuotations(res.data.quotations || []);
      }
    } catch (err) {
      console.error('Failed to load booking:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleAcceptQuotation = async (quotationId) => {
    try {
      const res = await api.post(`/quotations/${id}/accept`, { quotationId });
      if (res.data.success) {
        alert('Quotation accepted! Payment is securely held in SkillBridge Escrow.');
        fetchBooking();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept quotation');
    }
  };

  const handleReleaseEscrow = async () => {
    if (!window.confirm('Confirm that the service has been completed to your satisfaction and release escrow funds?')) return;
    try {
      const res = await api.post(`/bookings/${id}/release-escrow`, {
        note: 'Customer inspected and verified workmanship.'
      });
      if (res.data.success) {
        alert('Escrow payment released successfully to the provider.');
        fetchBooking();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to release escrow');
    }
  };

  const handleDisputeSubmit = async (reason) => {
    try {
      const res = await api.post(`/bookings/${id}/dispute`, { reason });
      if (res.data.success) {
        alert('Dispute raised. Escrow funds are now frozen pending review.');
        fetchBooking();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to raise dispute');
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const targetUserId = role === 'customer'
        ? (booking.providerId?.userId?._id || booking.providerId?.userId)
        : booking.customerId?._id;

      const res = await api.post('/reports', {
        bookingId: booking._id,
        targetUserId,
        targetProviderId: booking.providerId?._id || null,
        targetRole: role === 'customer' ? 'provider' : 'customer',
        reportType,
        reason: reportReason
      });

      if (res.data.success) {
        alert('Report filed with Trust & Safety team.');
        setIsReportingOpen(false);
        setReportReason('');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to file report');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        bookingId: booking._id,
        rating: reviewRating,
        comment: reviewComment,
        subRatings: {
          timeliness: reviewRating,
          workmanship: reviewRating,
          behavior: reviewRating,
          pricingTransparency: 5
        }
      });

      if (res.data.success) {
        alert('Review published! Provider TrustScore updated.');
        fetchBooking();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const stateMachineSteps = [
    'REQUESTED',
    'QUOTATIONS_RECEIVED',
    'CONFIRMED',
    'PROVIDER_ON_THE_WAY',
    'IN_PROGRESS',
    'COMPLETED'
  ];

  const currentStepIndex = stateMachineSteps.indexOf(booking?.status);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="h-64 rounded-3xl glass-panel animate-pulse bg-slate-900/40"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-400">
        <Shield className="w-8 h-8 mx-auto text-slate-600 mb-2" />
        <p>Booking not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/bookings" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Bookings</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700">
              {booking.status}
            </span>
            <EscrowStatusBadge status={booking.escrow?.status || 'unfunded'} amount={booking.escrow?.amount || booking.finalAmount} />
            {booking.isEmergency && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 flex items-center gap-1">
                <Zap className="w-3 h-3 text-rose-400" /> Rapid Emergency
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {booking.serviceName}
          </h1>
          <p className="text-xs text-slate-400 max-w-xl">
            {booking.description}
          </p>
        </div>

        <div className="text-left md:text-right shrink-0">
          <span className="text-xs text-slate-400 block font-mono">Agreed Escrow Amount</span>
          <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ₹{booking.finalAmount || booking.escrow?.amount || '0'}
          </span>
        </div>
      </div>

      {/* State Machine Step Tracker */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
          Booking Lifecycle State Machine
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {stateMachineSteps.map((step, idx) => {
            const isPassed = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;

            return (
              <div
                key={step}
                className={`p-3 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-glow-brand font-bold'
                    : (isPassed ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-slate-950/40 border-slate-900 text-slate-600')
                }`}
              >
                <div className="text-[10px] font-mono opacity-75">Step {idx + 1}</div>
                <div className="text-[11px] mt-1 font-mono">{step.replace(/_/g, ' ')}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quotations Comparison Matrix if in Quotations Phase */}
      {(booking.status === 'REQUESTED' || booking.status === 'QUOTATIONS_RECEIVED') && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-display text-white">
            Received Specialist Quotations ({quotations.length})
          </h2>
          <QuotationComparisonTable
            quotations={quotations}
            onAccept={handleAcceptQuotation}
            isCustomer={role === 'customer'}
          />
        </div>
      )}

      {/* Escrow Action Panel (for CONFIRMED / IN_PROGRESS / COMPLETED) */}
      {booking.escrow?.status === 'held' && (
        <div className="p-6 rounded-2xl glass-panel border border-cyan-900/50 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>₹{booking.escrow?.amount} Locked Securely in Escrow</span>
            </div>
            <p className="text-xs text-slate-400 max-w-lg">
              Funds will not be transferred to the provider until you inspect and verify the workmanship on site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsDisputeOpen(true)}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60"
            >
              Raise Dispute
            </button>
            <button
              onClick={handleReleaseEscrow}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand flex items-center gap-1.5"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>Verify & Release Payment</span>
            </button>
          </div>
        </div>
      )}

      {/* Review Submission Form if COMPLETED and rating not given */}
      {booking.status === 'COMPLETED' && !booking.ratingGiven && role === 'customer' && (
        <form onSubmit={handleReviewSubmit} className="p-6 rounded-2xl glass-panel border border-emerald-500/40 space-y-4 shadow-glow-brand">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h3 className="font-display font-bold text-base text-white">
              Leave a Verified Review (Updates Provider's TrustScore)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-300">Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setReviewRating(star)}
                className="p-1 hover:scale-110 transition-transform"
              >
                <Star className={`w-6 h-6 ${star <= reviewRating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
              </button>
            ))}
          </div>

          <textarea
            required
            rows={3}
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Share your experience (punctuality, quality, transparent billing)..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
          />

          <button
            type="submit"
            disabled={isSubmittingReview || !reviewComment.trim()}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand disabled:opacity-50"
          >
            {isSubmittingReview ? 'Publishing...' : 'Submit Verified Review'}
          </button>
        </form>
      )}

      {/* Status History Timeline */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-400" />
          Audit Log & Event History ({booking.statusHistory?.length || 0})
        </h3>

        <div className="space-y-3">
          {booking.statusHistory?.map((hist, idx) => (
            <div key={idx} className="flex items-start justify-between text-xs p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-emerald-400">{hist.status}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    By: {hist.actor}
                  </span>
                </div>
                {hist.note && <p className="text-slate-300 text-xs mt-1">{hist.note}</p>}
              </div>

              <span className="text-[10px] font-mono text-slate-500 shrink-0">
                {new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                {new Date(hist.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mutual Reporting Trigger */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={() => setIsReportingOpen(true)}
          className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-mono"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>File Mutual Incident Report (Trust & Safety)</span>
        </button>
      </div>

      {/* Dispute Modal */}
      <DisputeModal
        isOpen={isDisputeOpen}
        onClose={() => setIsDisputeOpen(false)}
        onSubmit={handleDisputeSubmit}
        bookingId={booking._id}
      />

      {/* Mutual Report Modal */}
      {isReportingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl glass-panel border border-slate-700 shadow-2xl space-y-4">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              File Mutual Report ({role === 'customer' ? 'Against Provider' : 'Against Customer'})
            </h3>

            <form onSubmit={handleReportSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Incident Type:</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="no_show">No-Show / Unannounced Absence</option>
                  <option value="abusive_behavior">Abusive / Unprofessional Behavior</option>
                  <option value="fake_booking">Fake Booking / Unreachable</option>
                  <option value="poor_workmanship">Poor Workmanship / Damage</option>
                  <option value="overcharging">Attempted Unauthorized Surcharge</option>
                  <option value="other">Other Incident</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Reason & Observations:</label>
                <textarea
                  required
                  rows={3}
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Provide objective facts about what occurred..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReportingOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-glow-emergency"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
