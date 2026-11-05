import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Phone, Briefcase, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BANGALORE_LOCALITIES } from '../translations/localities';

export const Register = () => {
  const [role, setRole] = useState('customer');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Indiranagar');
  const [category, setCategory] = useState('Electrician');
  const [hourlyRate, setHourlyRate] = useState(350);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const selectedLoc = BANGALORE_LOCALITIES.find(l => l.name === locality) || BANGALORE_LOCALITIES[0];

      await register({
        name,
        email,
        password,
        role,
        phone,
        locality,
        city: 'Bangalore',
        coordinates: selectedLoc.coordinates,
        categories: role === 'provider' ? [category] : [],
        hourlyRate: role === 'provider' ? Number(hourlyRate) : 350
      });

      navigate(role === 'provider' ? '/provider/dashboard' : '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto shadow-glow-brand flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display text-white">Join SkillBridge</h1>
        <p className="text-xs text-slate-400">Register as a customer or verified local specialist</p>
      </div>

      {/* Role Picker */}
      <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setRole('customer')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all ${
            role === 'customer'
              ? 'bg-emerald-600 text-white shadow-glow-brand'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          👤 I need services (Customer)
        </button>
        <button
          type="button"
          onClick={() => setRole('provider')}
          className={`py-2 rounded-xl text-xs font-semibold transition-all ${
            role === 'provider'
              ? 'bg-emerald-600 text-white shadow-glow-brand'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚡ I offer services (Provider)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Full Name / Business Name</label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98000 00000"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Bangalore Locality</label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
            >
              {BANGALORE_LOCALITIES.map((loc) => (
                <option key={loc.name} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Provider Specific Fields */}
        {role === 'provider' && (
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Air Conditioner">Air Conditioner</option>
                  <option value="Appliance Technician">Appliance Technician</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Home Cleaning">Home Cleaning</option>
                  <option value="Painter">Painter</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Base Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-brand flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Creating Account...' : 'Complete Registration'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
