import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  CalendarCheck,
  Wallet,
  MessageSquare,
  CalendarDays,
  Package,
  Globe,
  Newspaper,
  Settings,
  Headphones,
  LogOut,
  Search,
  Bell,
  ChevronDown,
  Menu as MenuIcon,
  X,
  Check,
  Shield,
  Zap,
  Users,
  Command,
  Sun,
  Moon,
  Sparkles,
  MapPin,
  Heart
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTheme } from '../../context/ThemeContext';

export const ProxlyLayout = ({ children }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentPath = location.pathname;

  const menuItems = [
    { name: 'Overview', path: '/', icon: Home },
    { name: 'Booking', path: '/bookings', icon: CalendarCheck },
    { name: 'Wallet', path: '/wallet', icon: Wallet },
    { name: 'Chat', path: '/chat', icon: MessageSquare },
    { name: 'Calendar', path: '/predictive-care', icon: CalendarDays },
    { name: 'Services', path: '/services', icon: Package }
  ];

  const supportItems = [
    { name: 'Website CMS', path: '/emergency', icon: Globe },
    { name: 'Blogs', path: '/community', icon: Newspaper },
    { name: 'Settings', path: '/provider/dashboard', icon: Settings },
    { name: 'Support & Ticket', path: '/admin', icon: Headphones }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSelect = async (newRole) => {
    await switchDemoRole(newRole);
    setProfileDropdownOpen(false);
  };

  const displayName = user?.name || 'Johne Martin';
  const displayEmail = user?.email || 'customer1@skillbridge.in';
  const avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80';

  // Warm project-related background image: A beautiful, modern, welcoming sunlit home interior
  const backgroundImage = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2200&q=80';

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-fixed text-slate-800 dark:text-slate-100 p-2 sm:p-4 lg:p-6 flex flex-col justify-center items-center transition-colors duration-500"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      {/* Humanized Atmospheric Backdrop Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f8f5ff]/92 via-[#f2eefb]/88 to-[#faf6ff]/94 dark:from-[#060a12]/92 dark:via-[#090e1a]/90 dark:to-[#080d18]/94 backdrop-blur-md transition-colors duration-500 pointer-events-none" />

      {/* Outer Dashboard Container - Floating rounded window with backdrop blur and premium shadows */}
      <div className="relative z-10 w-full max-w-[1600px] bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-xl rounded-[24px] sm:rounded-[32px] shadow-[0_25px_80px_-15px_rgba(79,70,229,0.15)] dark:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/70 dark:border-slate-800/80 flex flex-col min-h-[920px] overflow-hidden transition-all duration-300">
        <div className="flex flex-1 relative overflow-hidden">
          
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* LEFT SIDEBAR */}
          <aside
            className={`
              fixed lg:static top-0 bottom-0 left-0 z-50
              w-[220px] xl:w-[240px] bg-white/90 dark:bg-[#090e1a]/95 backdrop-blur-lg border-r border-slate-100 dark:border-slate-800/80 flex flex-col
              transition-all duration-300 ease-in-out
              ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}
          >
            {/* Logo Area */}
            <div className="h-20 px-6 flex items-center justify-between border-b border-slate-50 dark:border-slate-800/60">
              <Link to="/" className="flex items-center gap-3 group">
                {/* Purple stylized logo mark with home glow */}
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366f1] via-[#818cf8] to-[#9333ea] flex items-center justify-center shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                  <div className="w-4 h-4 border-2 border-white rounded-md flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <span className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-white font-display">
                    Proxly
                  </span>
                  <span className="block text-[9px] font-semibold text-indigo-600 dark:text-indigo-400 -mt-1 tracking-wider uppercase font-mono">
                    SkillBridge
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Lists */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7">
              {/* Menu Section */}
              <div>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Menu
                </p>
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold
                          transition-all duration-150
                          ${
                            isActive
                              ? 'text-[#4f46e5] dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-bold shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#4f46e5] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <span>{item.name}</span>

                        {/* Active vertical accent line on the right edge */}
                        {isActive && (
                          <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-[#4f46e5] dark:bg-indigo-500 rounded-l-full" />
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Support Section */}
              <div>
                <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Support
                </p>
                <nav className="space-y-1">
                  {supportItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`
                          relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold
                          transition-all duration-150
                          ${
                            isActive
                              ? 'text-[#4f46e5] dark:text-indigo-400 bg-indigo-50/80 dark:bg-indigo-950/50 font-bold shadow-xs'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }
                        `}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isActive ? 'text-[#4f46e5] dark:text-indigo-400' : 'text-slate-400 dark:text-slate-500'
                          }`}
                        />
                        <span>{item.name}</span>

                        {isActive && (
                          <span className="absolute right-0 top-1.5 bottom-1.5 w-1 bg-[#4f46e5] dark:bg-indigo-500 rounded-l-full" />
                        )}
                      </Link>
                    );
                  })}

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all text-left"
                  >
                    <LogOut className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-rose-600" />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Humanized Neighborhood Trust Card */}
            <div className="p-4 border-t border-slate-50 dark:border-slate-800/60">
              <div className="p-3 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-rose-50/40 dark:from-indigo-950/50 dark:via-purple-950/30 dark:to-slate-900/60 rounded-2xl border border-indigo-100/70 dark:border-indigo-900/40">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">
                    Indiranagar, BLR
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0 animate-pulse"></span>
                  <span>14 pros ready for on-site visits</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT WRAPPER */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#fafbfe]/90 dark:bg-[#070c17]/90 backdrop-blur-md overflow-x-hidden transition-colors duration-300">
            
            {/* TOP HEADER */}
            <header className="h-20 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 transition-colors duration-300">
              
              {/* Left Header: Mobile Toggle & Search */}
              <div className="flex items-center gap-4 flex-1 max-w-xl">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  <MenuIcon className="w-5 h-5" />
                </button>

                {/* Search Bar */}
                <div
                  onClick={() => setCommandPaletteOpen(true)}
                  className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-50/80 dark:bg-slate-900/80 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 border border-slate-200/60 dark:border-slate-800 rounded-xl w-full max-w-sm cursor-pointer transition-colors group"
                >
                  <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                  <span className="text-xs text-slate-400 dark:text-slate-400 flex-1 truncate">
                    Search or type a Command
                  </span>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                    ⌘
                  </kbd>
                </div>
              </div>

              {/* Right Header: Theme Toggle, Notification, Chat, User Profile */}
              <div className="flex items-center gap-2.5 sm:gap-3.5">
                
                {/* LIGHT / DARK THEME TOGGLE BUTTON */}
                <button
                  onClick={toggleTheme}
                  title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                  className="px-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all shadow-2xs group"
                >
                  {isDark ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45" />
                      <span className="hidden md:inline text-[11px] font-medium text-slate-300">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-indigo-600 transition-transform group-hover:-rotate-12" />
                      <span className="hidden md:inline text-[11px] font-medium text-slate-600">Dark</span>
                    </>
                  )}
                </button>

                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">Neighbourhood Activity</span>
                        <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full">
                          Live updates
                        </span>
                      </div>
                      <div className="space-y-2.5 pt-3 text-xs text-slate-600 dark:text-slate-300">
                        <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl">
                          <p className="font-semibold text-indigo-950 dark:text-indigo-200">Suresh Kumar is En Route</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ETA: 8 mins to 100ft Rd with genuine MCB spare</p>
                        </div>
                        <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl">
                          <p className="font-semibold text-emerald-950 dark:text-emerald-200">Escrow Released Automatically</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">₹450 paid to Ramesh Reddy after successful verification</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat Bubble Icon */}
                <Link
                  to="/chat"
                  className="w-10 h-10 rounded-full border border-slate-200/80 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all relative"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                </Link>

                {/* User Profile Badge with Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-200/60 dark:hover:border-slate-700"
                  >
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-200 dark:ring-indigo-900"
                    />
                    <div className="hidden sm:block text-left">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate max-w-[120px]">
                        {displayEmail}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Profile & 1-Click Role Switcher Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-bold text-slate-800 dark:text-white">{displayName}</p>
                        <p className="text-[11px] text-slate-400">{displayEmail}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold uppercase px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-md">
                          Current Persona: {role}
                        </span>
                      </div>

                      <div className="py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="px-3 pb-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                          1-Click Demo Accounts
                        </p>
                        <button
                          onClick={() => handleRoleSelect('customer')}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <span>Customer (Johne / Indiranagar)</span>
                          {role === 'customer' && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                        <button
                          onClick={() => handleRoleSelect('provider')}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <span>Provider (Suresh Electricals)</span>
                          {role === 'provider' && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                        <button
                          onClick={() => handleRoleSelect('admin')}
                          className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <span>Admin (Moderator / Disputes)</span>
                          {role === 'admin' && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />}
                        </button>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </header>

            {/* MAIN OUTLET CONTAINER */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {children}
            </main>

          </div>
        </div>
      </div>

      {/* QUICK COMMAND PALETTE MODAL */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search services, providers, bookings in ₹ or type a command..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-sm outline-none bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 max-h-72 overflow-y-auto space-y-1">
              <p className="px-3 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Quick Navigation
              </p>
              <button
                onClick={() => { navigate('/'); setCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-left"
              >
                <Home className="w-4 h-4 text-indigo-500" />
                <span>Go to Dashboard Overview</span>
              </button>
              <button
                onClick={() => { navigate('/bookings'); setCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-left"
              >
                <CalendarCheck className="w-4 h-4 text-indigo-500" />
                <span>View Bookings & Escrow (₹)</span>
              </button>
              <button
                onClick={() => { navigate('/services'); setCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl text-left"
              >
                <Package className="w-4 h-4 text-indigo-500" />
                <span>Explore Top Services (in ₹)</span>
              </button>
              <button
                onClick={() => { navigate('/emergency'); setCommandPaletteOpen(false); }}
                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl text-left"
              >
                <Zap className="w-4 h-4 text-rose-500" />
                <span>Emergency 24/7 Dispatch (+₹150 Lock)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
