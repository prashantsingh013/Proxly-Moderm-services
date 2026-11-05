import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  FileText,
  Users,
  ChevronDown,
  Star,
  CheckCircle2,
  Package,
  ArrowUpRight,
  Sparkles,
  Zap,
  Shield,
  Layers,
  IndianRupee,
  MapPin,
  Heart,
  Award,
  CheckCircle,
  ThumbsUp,
  Clock,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useTheme } from '../context/ThemeContext';

export const ProxlyOverview = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [timeRange, setTimeRange] = useState('This Week');
  const [ticketMonth, setTicketMonth] = useState('This Month');
  const [selectedService, setSelectedService] = useState(null);

  // 1. Humanized Metric Cards Data
  const metrics = [
    {
      id: 1,
      label: 'Completed Home Visits',
      value: '2,233',
      trend: '4.85%',
      subtext: 'Verified 5-star services',
      bgColor: 'bg-[#eeedfc] dark:bg-[#1e1b4b]',
      textColor: 'text-[#6366f1] dark:text-[#818cf8]',
      icon: Calendar
    },
    {
      id: 2,
      label: 'Homeowner Savings',
      value: '₹1,280',
      trend: '4.85%',
      subtext: 'Saved from surge locks',
      bgColor: 'bg-[#e7f8f0] dark:bg-[#064e3b]/40',
      textColor: 'text-[#10b981] dark:text-[#34d399]',
      icon: IndianRupee
    },
    {
      id: 3,
      label: 'Active Neighborhood Jobs',
      value: '43',
      trend: '4.85%',
      subtext: 'Technicians on the road',
      bgColor: 'bg-[#fef6e7] dark:bg-[#78350f]/30',
      textColor: 'text-[#f59e0b] dark:text-[#fbbf24]',
      icon: FileText
    },
    {
      id: 4,
      label: 'Vetted Community Pros',
      value: '545',
      trend: '4.85%',
      subtext: 'Police & license checked',
      bgColor: 'bg-[#f4edfd] dark:bg-[#581c87]/30',
      textColor: 'text-[#9333ea] dark:text-[#c084fc]',
      icon: Users
    }
  ];

  // 2. Bookings Spline Data (X-axis matching image: Jan, Feb, Mar, Apr, May, Jun, July, Aug, Sep, Oct, Num, Dec)
  const bookingChartData = [
    { month: 'Jan', orders: 18, amount: 1200 },
    { month: 'Feb', orders: 18, amount: 1400 },
    { month: 'Mar', orders: 28, amount: 2600 },
    { month: 'Apr', orders: 38, amount: 3900 },
    { month: 'May', orders: 22, amount: 2100 },
    { month: 'Jun', orders: 32, amount: 3100 },
    { month: 'July', orders: 26, amount: 2800 },
    { month: 'Aug', orders: 55, amount: 5600 },
    { month: 'Sep', orders: 48, amount: 4900 },
    { month: 'Oct', orders: 30, amount: 3200 },
    { month: 'Num', orders: 35, amount: 3700 },
    { month: 'Dec', orders: 50, amount: 5200 }
  ];

  // 3. Support Ticket Donut Data (exact 4 colors and legend items from screenshot)
  const ticketData = [
    { name: 'In Progress', value: 45, color: '#6366f1' },  // Purple/Indigo
    { name: 'Finished', value: 32, color: '#fbbf24' },     // Amber/Yellow
    { name: 'Unfinished', value: 15, color: '#ec4899' },   // Magenta/Pink
    { name: 'Not Started', value: 8, color: isDark ? '#475569' : '#cbd5e1' } // Slate/Gray
  ];

  // 4. Humanized Real Specialists with Diverse Personas & Local Bangalore Details
  const topServices = [
    {
      id: 1,
      tag: 'Locally Endorsed',
      price: '₹450',
      unit: '/visit',
      rating: '4.9',
      reviews: '184',
      title: 'Emergency Switchboard Spark & MCB Tripping Troubleshooting',
      author: 'Suresh Kumar',
      authorTitle: 'Master Electrician (14 yrs exp)',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      activeOrders: '12 Active Today',
      status: '10m ETA • Indiranagar',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
      category: 'Electrical & Surge Diagnostics',
      trustScore: 94,
      experience: '14 Years in Indiranagar',
      bio: 'Government licensed wireman. Always carries genuine Schneider & Havells MCBs. 98% first-visit fix rate.',
      languages: 'Kannada, English, Hindi'
    },
    {
      id: 2,
      tag: 'Zero Disputes',
      price: '₹499',
      unit: '/visit',
      rating: '4.8',
      reviews: '142',
      title: 'High-Pressure Heavy-Duty Drain Snake & Leak Sealing',
      author: 'Ramesh Reddy',
      authorTitle: 'Licensed Plumbing Specialist',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      activeOrders: '8 Active Today',
      status: 'Online • Domlur',
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      category: 'Plumbing & Sanitary Tech',
      trustScore: 91,
      experience: '11 Years in Domlur & Indiranagar',
      bio: 'Specialist in concealed bathroom leaks, pressure boosters, and unclogging without breaking tiles.',
      languages: 'Telugu, Kannada, English'
    },
    {
      id: 3,
      tag: 'Top Rated',
      price: '₹699',
      unit: '/service',
      rating: '4.9',
      reviews: '210',
      title: 'Split AC Deep Foam Jet Wash & Coil Anti-Bacterial Sanitization',
      author: 'Manjunath Gowda',
      authorTitle: 'Climate & AC Technologist',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      activeOrders: '19 Active Today',
      status: 'Online • Koramangala',
      image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80',
      category: 'Air Conditioner & Cooling Care',
      trustScore: 93,
      experience: '9 Years across Bangalore',
      bio: 'Uses high-pressure German water jets, anti-microbial foam wash, and genuine R32/R410 gas refills.',
      languages: 'Kannada, Hindi, English'
    },
    {
      id: 4,
      tag: 'Eco-Friendly',
      price: '₹1,299',
      unit: '/service',
      rating: '4.9',
      reviews: '96',
      title: 'Complete Kitchen Anti-Grease Revival & Tile Grout Wash',
      author: 'Priya & Vinay',
      authorTitle: 'CleanNest Pro Founders',
      authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      activeOrders: '6 Active Today',
      status: 'Online • HSR Layout',
      image: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=600&q=80',
      category: 'Deep Home Sanitization',
      trustScore: 89,
      experience: '7 Years in Home Sanitization',
      bio: 'Non-toxic biodegradable degreasers safe for kids and pets. Restores stained kitchen backsplashes to factory finish.',
      languages: 'English, Hindi, Kannada'
    },
    {
      id: 5,
      tag: 'Police Verified',
      price: '₹450',
      unit: '/visit',
      rating: '4.9',
      reviews: '118',
      title: 'High-Security WiFi Smart Deadbolt & Door Latch Replacement',
      author: 'Kishore Hegde',
      authorTitle: 'Security & Locksmith Specialist',
      authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80',
      activeOrders: '7 Active Today',
      status: 'Online • Malleshwaram',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80',
      category: 'Smart Locks & Carpentry',
      trustScore: 92,
      experience: '16 Years Master Locksmith',
      bio: 'Emergency locked door assistance without frame damage. Installs Yale, Godrej, and Tuya biometric smart locks.',
      languages: 'Kannada, Konkani, English'
    }
  ];

  // Custom Chart Tooltip
  const CustomBookingsTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-sm border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg p-2.5 text-xs">
          <div className="flex items-center gap-3 font-semibold mb-1">
            <span className="flex items-center gap-1 text-[#3b82f6]">
              <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
              245 Visits
            </span>
            <span className="flex items-center gap-1 text-[#10b981]">
              <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
              ₹22,347 Protected
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">23 June, 2025 • Indiranagar Hub</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-full animate-in fade-in duration-300">
      
      {/* HUMANIZED WARM WELCOME BANNER */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/40 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-slate-900/40 rounded-2xl p-4 sm:p-5 border border-indigo-100/80 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl shadow-md shadow-indigo-500/20 shrink-0">
            👋
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">
                Namaskara, Johne! Welcome to your neighborhood network
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                14 Verified Pros Nearby
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Indiranagar, Bangalore
              </span>
              <span>•</span>
              <span>Fair-Split Escrow Protection Active in ₹</span>
              <span>•</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-medium">Zero hidden callout fees</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/emergency')}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Rapid Emergency (15m ETA)</span>
          </button>
        </div>
      </div>

      {/* ROW 1: FOUR STAT METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {metrics.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                {/* Rounded Icon Square */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.bgColor} ${card.textColor}`}
                >
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>

                {/* Values & Labels */}
                <div>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-400 leading-tight">
                    {card.label}
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
                      {card.value}
                    </span>
                    <span className="text-xs font-semibold text-emerald-500 flex items-center gap-0.5">
                      ↑ {card.trend}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {card.subtext}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ROW 2: TWO ANALYTICS CHARTS (BOOKINGS & SUPPORT TICKET) */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* LEFT CHART: BOOKINGS AREA SPLINE (~68% width) */}
        <div className="col-span-12 xl:col-span-8 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors duration-300">
          
          {/* Header & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">
                Bookings & Protection Trend
              </h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Monthly verified visits and total escrow payments locked in ₹
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Legend Dots */}
              <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3b82f6]"></span>
                  Home Visits
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10b981]"></span>
                  Escrow Volume (₹)
                </span>
              </div>

              {/* Time Range Selector */}
              <button
                onClick={() => setTimeRange(timeRange === 'This Week' ? 'This Month' : 'This Week')}
                className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{timeRange}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Area Chart Container */}
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={isDark ? 0.35 : 0.18} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke={isDark ? '#1e293b' : '#f1f5f9'}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 11 }}
                  ticks={[0, 20, 40, 60, 80]}
                  domain={[0, 80]}
                />

                <Tooltip content={<CustomBookingsTooltip />} />

                {/* Spline Area matching the image */}
                <Area
                  type="monotone"
                  dataKey="orders"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#orderGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RIGHT CHART: SUPPORT TICKET DONUT (~32% width) */}
        <div className="col-span-12 xl:col-span-4 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 shadow-xs flex flex-col justify-between transition-colors duration-300">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white">Job Resolution Status</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Active and completed work orders</p>
            </div>

            <button
              onClick={() => setTicketMonth(ticketMonth === 'This Month' ? 'Last Month' : 'This Month')}
              className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <span>{ticketMonth}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {/* Donut Chart */}
          <div className="w-full h-52 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketData}
                  cx="50%"
                  cy="50%"
                  innerRadius={0}
                  outerRadius={80}
                  paddingAngle={0}
                  dataKey="value"
                  stroke={isDark ? '#0f172a' : '#ffffff'}
                  strokeWidth={2}
                >
                  {ticketData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 4-Item Legend at Bottom */}
          <div className="grid grid-cols-2 gap-y-2 gap-x-4 pt-3 border-t border-slate-50 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
            {ticketData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ROW 3: HUMANIZED TOP SERVICES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-white">
              Trusted Neighbourhood Specialists
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              Locally endorsed pros with verified police records and transparent ₹ rate locks
            </p>
          </div>

          <button
            onClick={() => navigate('/services')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Services</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5-Column Responsive Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {topServices.map((service) => (
            <div
              key={service.id}
              onClick={() => setSelectedService(service)}
              className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-32 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Purple Pill Badge on top left */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-[#6366f1] text-white text-[10px] font-bold tracking-wide shadow-sm">
                    {service.tag}
                  </span>
                  {/* TrustScore Mini Badge on top right */}
                  <span className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-emerald-900/80 backdrop-blur-xs text-emerald-300 text-[10px] font-bold font-mono border border-emerald-500/40">
                    Trust {service.trustScore}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2">
                  {/* Price & Rating Row */}
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-bold text-[#4f46e5] dark:text-indigo-400">
                      {service.price}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal ml-0.5">
                        {service.unit}
                      </span>
                    </p>
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{service.rating}</span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">
                        ({service.reviews})
                      </span>
                    </div>
                  </div>

                  {/* Title / Description */}
                  <h3 className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-snug line-clamp-2">
                    {service.title}
                  </h3>

                  {/* Real Specialist Author Persona */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-50 dark:border-slate-800/60">
                    <img
                      src={service.authorAvatar}
                      alt={service.author}
                      className="w-5 h-5 rounded-full object-cover ring-1 ring-indigo-200 dark:ring-indigo-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-700 dark:text-slate-300 font-bold truncate">
                          {service.author}
                        </span>
                        <CheckCircle2 className="w-3 h-3 text-[#3b82f6] shrink-0" />
                      </div>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                        {service.authorTitle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="border-t border-slate-100 dark:border-slate-800 px-3.5 py-2.5 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  {service.activeOrders}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium truncate max-w-[90px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HUMANIZED NEIGHBORHOOD TRUST STRIP */}
      <div className="bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-white">
                Hyperlocal Trust Guarantee & Dispute Escrow
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Payments in ₹ are locked in automated escrow and only released after your digital confirmation.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 dark:text-slate-300">
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              🤝 3+ Verified Peer Endorsements
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              ⏱️ 15m Emergency Dispatch Radar
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800">
              🛡️ 48-Hour Arbitration Window
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SERVICE BOOKING MODAL WITH DETAILED HUMAN PERSONA */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="relative h-44 w-full">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#6366f1] text-white text-xs font-bold">
                {selectedService.tag}
              </span>
              <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-xs font-bold font-mono border border-emerald-600/40">
                TrustScore: {selectedService.trustScore}/100
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Specialist Bio Header */}
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <img
                  src={selectedService.authorAvatar}
                  alt={selectedService.author}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-800"
                />
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <span>{selectedService.author}</span>
                    <CheckCircle2 className="w-4 h-4 text-[#3b82f6]" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedService.authorTitle} • {selectedService.experience}
                  </p>
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                    Languages: {selectedService.languages}
                  </p>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {selectedService.category}
                </span>
                <h4 className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                  {selectedService.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {selectedService.bio}
                </p>
              </div>

              {/* Price Breakdown in ₹ */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <p className="text-slate-400 dark:text-slate-500">Transparent Upfront Rate</p>
                  <p className="text-lg font-bold text-[#4f46e5] dark:text-indigo-400">
                    {selectedService.price}
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-normal ml-1">
                      {selectedService.unit}
                    </span>
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Protected in Escrow
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 dark:text-slate-500">Community Standing</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    ⭐ {selectedService.rating} ({selectedService.reviews} reviews)
                  </p>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    0 Unresolved Disputes
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setSelectedService(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedService(null);
                    navigate(`/book?serviceName=${encodeURIComponent(selectedService.title)}&price=${selectedService.price.replace('₹', '')}`);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#4f46e5] hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
                >
                  Book with Suresh / Specialist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
