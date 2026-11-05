import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Layers, Zap, Clock, Shield, ArrowRight, Filter } from 'lucide-react';
import api from '../services/api';

export const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || '';
  const emergencyParam = searchParams.get('emergency') === 'true';

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEmergencyOnly, setIsEmergencyOnly] = useState(emergencyParam);
  const [isLoading, setIsLoading] = useState(true);

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
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (isEmergencyOnly) params.emergency = 'true';
        if (searchTerm) params.search = searchTerm;

        const res = await api.get('/services', { params });
        if (res.data.success) {
          setServices(res.data.services);
        }
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [activeCategory, isEmergencyOnly, searchTerm]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-800">
          Verified Service Catalog
        </h1>
        <p className="text-xs text-slate-500">
          Transparent pricing bands, defined scope of tasks, and warranty-backed repairs.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services (e.g. MCB tripping, AC gas, sink leak)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 shadow-2xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsEmergencyOnly(!isEmergencyOnly)}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all w-full sm:w-auto justify-center ${
            isEmergencyOnly
              ? 'bg-rose-50 border-rose-300 text-rose-600'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-rose-500" />
          <span>24/7 Rapid Emergency Only</span>
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
            !activeCategory
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => { searchParams.set('category', cat.name); setSearchParams(searchParams); }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
              activeCategory === cat.name
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.name} ({cat.serviceCount || 0})
          </button>
        ))}
      </div>

      {/* Services Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-44 rounded-2xl bg-white border border-slate-100 animate-pulse"></div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-400">
          <Layers className="w-8 h-8 mx-auto text-slate-400 mb-2" />
          <p className="text-sm">No services found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service._id}
              className="p-5 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold">
                    {service.category}
                  </span>
                  {service.isEmergencyEligible && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-0.5 font-medium">
                      <Zap className="w-2.5 h-2.5" /> 24/7 Rapid
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-base text-slate-800">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {service.description || `Professional diagnostic and on-site repair service for ${service.category}.`}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Market Rate:</span>
                  <span className="font-mono font-bold text-indigo-600 text-sm">
                    ₹{service.basePriceRange?.min} – ₹{service.basePriceRange?.max}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/providers?category=${encodeURIComponent(service.category)}`}
                  className="text-xs text-slate-500 hover:text-indigo-600 font-medium"
                >
                  View Specialists
                </Link>
                <Link
                  to={`/book?serviceId=${service._id}&category=${encodeURIComponent(service.category)}&serviceName=${encodeURIComponent(service.name)}`}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs flex items-center gap-1 transition-colors"
                >
                  <span>Book Now</span>
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
