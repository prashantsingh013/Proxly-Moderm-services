import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Shield, Zap, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { EscrowStatusBadge } from '../components/escrow/EscrowStatusBadge';
import { TrustScoreBadge } from '../components/trust/TrustScoreBadge';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'ACTIVE') return ['REQUESTED', 'QUOTATIONS_RECEIVED', 'CONFIRMED', 'PROVIDER_ON_THE_WAY', 'IN_PROGRESS'].includes(b.status);
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    if (activeTab === 'DISPUTED') return b.status === 'DISPUTED';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'IN_PROGRESS':
      case 'PROVIDER_ON_THE_WAY':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'CONFIRMED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'QUOTATIONS_RECEIVED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DISPUTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-500 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-800">
            My Service Bookings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track quote submissions, live provider dispatch, and escrow release status.
          </p>
        </div>

        <Link
          to="/book"
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <span>+ New Service Request</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        {['ALL', 'ACTIVE', 'COMPLETED', 'DISPUTED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeTab === tab
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'bg-white border-slate-200/80 text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-32 rounded-2xl glass-panel animate-pulse bg-slate-900/40"></div>
          ))}
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-12 rounded-2xl glass-panel border border-slate-800 text-center text-slate-400">
          <Calendar className="w-8 h-8 mx-auto text-slate-600 mb-2" />
          <p className="text-sm">No bookings found in this view.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => (
            <div
              key={b._id}
              className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-slate-200 shadow-xs hover:shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${getStatusColor(b.status)}`}>
                    {b.status}
                  </span>
                  <EscrowStatusBadge status={b.escrow?.status || 'unfunded'} amount={b.escrow?.amount || b.finalAmount} />
                  {b.isEmergency && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-rose-500" /> Rapid Emergency
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-display font-bold text-base text-slate-800">
                    {b.serviceName}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">{b.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                    {b.locality || 'Indiranagar'}, Bangalore
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {new Date(b.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  {b.providerId && (
                    <span className="text-slate-700 font-medium">
                      Specialist: {b.providerId.businessName}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Link */}
              <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Agreed Amount</span>
                  <span className="font-mono font-bold text-indigo-600 text-base">
                    ₹{b.finalAmount || b.escrow?.amount || 'Quote Pending'}
                  </span>
                </div>

                <Link
                  to={`/bookings/${b._id}`}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <span>Track & Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
