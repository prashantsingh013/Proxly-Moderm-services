import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield,
  Zap,
  Users,
  Clock,
  Sparkles,
  Calendar,
  Layers,
  Activity,
  LogOut,
  User as UserIcon,
  Globe,
  Menu,
  X,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const Navbar = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-glow-brand flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold font-display bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                SkillBridge
              </span>
              <span className="hidden sm:inline-block text-[10px] ml-2 px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 font-mono">
                TRUST-FIRST
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link to="/services" className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              {t('nav.services')}
            </Link>
            <Link to="/providers" className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-teal-400" />
              {t('nav.providers')}
            </Link>
            <Link to="/community" className="px-3 py-1.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              {t('nav.community')}
            </Link>
            <Link to="/emergency" className="px-3 py-1.5 rounded-lg text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 border border-rose-900/30 transition-colors flex items-center gap-1.5 font-medium animate-pulse-slow">
              <Zap className="w-4 h-4 text-rose-400" />
              {t('nav.emergency')}
            </Link>
          </div>

          {/* Right Actions: Language, Demo Switcher, Auth */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-700 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-500 transition-all flex items-center gap-1.5"
              title="Toggle Language (English / Hindi)"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* 1-Click Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium border border-cyan-800/60 bg-cyan-950/40 text-cyan-300 hover:bg-cyan-900/50 transition-all flex items-center gap-1"
              >
                <span>Demo: {role.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {demoMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl glass-panel border border-slate-700 shadow-2xl py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] text-slate-400 uppercase font-mono border-b border-slate-800">
                    Switch Test Persona
                  </div>
                  <button
                    onClick={() => { switchDemoRole('customer'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>👤 Customer (Indiranagar)</span>
                    {role === 'customer' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('provider'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>⚡ Provider (Electrician Pro)</span>
                    {role === 'provider' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                  <button
                    onClick={() => { switchDemoRole('admin'); setDemoMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between"
                  >
                    <span>🛡️ Admin (Moderator)</span>
                    {role === 'admin' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                  </button>
                </div>
              )}
            </div>

            {/* Role-Specific Dashboards */}
            {user ? (
              <div className="flex items-center gap-2">
                {role === 'customer' && (
                  <>
                    <Link to="/bookings" className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 border border-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      {t('nav.myBookings')}
                    </Link>
                  </>
                )}

                {role === 'provider' && (
                  <Link to="/provider/dashboard" className="px-3 py-1.5 text-xs rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700/60 text-emerald-300 flex items-center gap-1.5 font-medium shadow-glow-brand">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    {t('nav.providerDashboard')}
                  </Link>
                )}

                {role === 'admin' && (
                  <Link to="/admin" className="px-3 py-1.5 text-xs rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 text-purple-300 flex items-center gap-1.5 font-medium">
                    <Shield className="w-3.5 h-3.5 text-purple-400" />
                    {t('nav.admin')}
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 text-xs text-slate-300 hover:text-white">
                  {t('nav.login')}
                </Link>
                <Link to="/register" className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow-brand transition-all">
                  {t('nav.register')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-emerald-400" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-t border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link to="/services" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base text-slate-200 hover:bg-slate-800">
            {t('nav.services')}
          </Link>
          <Link to="/providers" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base text-slate-200 hover:bg-slate-800">
            {t('nav.providers')}
          </Link>
          <Link to="/community" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base text-slate-200 hover:bg-slate-800">
            {t('nav.community')}
          </Link>
          <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base text-rose-400 font-semibold hover:bg-rose-950/40">
            🚨 {t('nav.emergency')}
          </Link>
          {user && (
            <Link to={role === 'provider' ? '/provider/dashboard' : (role === 'admin' ? '/admin' : '/bookings')} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2 rounded-lg text-base text-emerald-400 hover:bg-slate-800">
              {role === 'provider' ? t('nav.providerDashboard') : (role === 'admin' ? t('nav.admin') : t('nav.myBookings'))}
            </Link>
          )}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="text-xs text-slate-300">
              🌐 {language === 'en' ? 'Switch to हिंदी' : 'Switch to English'}
            </button>
            {user ? (
              <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-xs text-rose-400">
                Log Out
              </button>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="text-xs text-emerald-400">
                Log In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
