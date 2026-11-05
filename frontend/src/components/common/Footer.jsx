import React from 'react';
import { Shield, Heart, Zap, Globe, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-emerald-400" />
              <span className="font-display font-bold text-lg text-white">SkillBridge</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A trust-first, AI-assisted local service marketplace platform with explainable TrustScores, transparent escrow protection, and peer-endorsed Trust Circles.
            </p>
            <div className="text-[11px] text-slate-400">
              📍 Built for Bangalore & Indian Metros
            </div>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3">Core Pillars</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services" className="hover:text-emerald-400 transition-colors">Explainable TrustScores</Link></li>
              <li><Link to="/providers" className="hover:text-emerald-400 transition-colors">Reasoned SmartMatch</Link></li>
              <li><Link to="/community" className="hover:text-emerald-400 transition-colors">Trust Circles Peer Endorsements</Link></li>
              <li><Link to="/emergency" className="hover:text-emerald-400 transition-colors">Emergency Surcharge Transparency</Link></li>
              <li><span className="text-slate-400">Fair-Split Escrow Protection</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3">Service Verticals</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link to="/services?category=Electrician" className="hover:text-emerald-400">Electricians & Wiring</Link></li>
              <li><Link to="/services?category=Plumber" className="hover:text-emerald-400">Plumbing & Leak Repairs</Link></li>
              <li><Link to="/services?category=Air%20Conditioner" className="hover:text-emerald-400">AC Deep Service & Gas</Link></li>
              <li><Link to="/services?category=Appliance%20Technician" className="hover:text-emerald-400">Washing Machines & Fridge</Link></li>
              <li><Link to="/services?category=Carpenter" className="hover:text-emerald-400">Carpentry & Locksmith</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-mono font-semibold text-slate-300 uppercase tracking-wider mb-3">Platform Guarantee</h4>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Zap className="w-3.5 h-3.5" />
                <span>Zero Hidden Fees</span>
              </div>
              <p className="text-[11px] text-slate-400">
                All quotes include warranty days, valid until timestamps, and transparent surcharge disclosures.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 SkillBridge Platform. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for Provider Dignity
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
