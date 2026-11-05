import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, Zap, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemo = async (role) => {
    await switchDemoRole(role);
    navigate(role === 'provider' ? '/provider/dashboard' : (role === 'admin' ? '/admin' : '/'));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 mx-auto shadow-glow-brand flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Shield className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
        <h1 className="text-2xl font-bold font-display text-white">Log in to SkillBridge</h1>
        <p className="text-xs text-slate-400">Access your trust-first local services platform</p>
      </div>

      {/* 1-Click Demo Personas */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2.5">
        <span className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider block text-center">
          ⚡ 1-Click Demo Login
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleDemo('customer')}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs text-center transition-all"
          >
            <div className="font-semibold">👤 Customer</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Indiranagar</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemo('provider')}
            className="p-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-xs text-center transition-all shadow-glow-brand"
          >
            <div className="font-semibold">⚡ Provider</div>
            <div className="text-[10px] text-emerald-400 mt-0.5">Electrician Pro</div>
          </button>
          <button
            type="button"
            onClick={() => handleDemo('admin')}
            className="p-2.5 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-700 text-purple-300 text-xs text-center transition-all"
          >
            <div className="font-semibold">🛡️ Admin</div>
            <div className="text-[10px] text-purple-400 mt-0.5">Moderator</div>
          </button>
        </div>
      </div>

      {/* Manual Login Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl glass-panel border border-slate-800 space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-xs text-rose-300">
            {error}
          </div>
        )}

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-glow-brand flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <span>{isSubmitting ? 'Authenticating...' : 'Sign In'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
