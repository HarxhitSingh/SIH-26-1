import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  X,
  Globe,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEntrepreneurProfile } from '../../context/EntrepreneurProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import Logo from '../common/Logo';

export default function TopHeader({ onToggleMobile }) {
  const { logout, currentUser, userProfile } = useAuth();
  const { profile } = useEntrepreneurProfile();
  const { language, setLanguage, languages, currentLanguageInfo, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Map route pathname to translated title
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/dashboard': return t('nav.dashboard', 'Dashboard');
      case '/business': return t('nav.business', 'My Business');
      case '/schemes': return t('nav.schemes', 'Government Schemes');
      case '/funding': return t('nav.funding', 'Funding Intelligence');
      case '/roadmap': return t('nav.roadmap', 'Business Roadmap');
      case '/professionals': return t('nav.professionals', 'Professional Directory');
      case '/advisor': return t('nav.advisor', 'AI Business Advisor');
      case '/documents': return t('nav.documents', 'Document Vault');
      case '/profile': return t('nav.profile', 'Account Profile');
      case '/settings': return t('nav.settings', 'Settings');
      default: return 'UdyamSaathi';
    }
  };

  const pageTitle = getPageTitle(location.pathname);
  const displayName = userProfile?.name || currentUser?.displayName || profile?.personalInfo?.fullName || 'Entrepreneur';

  // Popular languages for quick header switcher
  const quickLanguages = [
    { code: 'en', native: 'English', en: 'English' },
    { code: 'hi', native: 'हिन्दी', en: 'Hindi' },
    { code: 'mr', native: 'मराठी', en: 'Marathi' },
    { code: 'bn', native: 'বাংলা', en: 'Bengali' },
    { code: 'gu', native: 'ગુજરાતી', en: 'Gujarati' },
    { code: 'ta', native: 'தமிழ்', en: 'Tamil' },
    { code: 'te', native: 'తెలుగు', en: 'Telugu' },
    { code: 'kn', native: 'ಕನ್ನಡ', en: 'Kannada' }
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Drawer Trigger + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleMobile}
            className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs sm:text-sm truncate">
            <span className="text-slate-400 font-medium hidden md:inline">UdyamSaathi</span>
            <span className="text-slate-300 hidden md:inline">/</span>
            <h1 className="font-bold text-slate-900 truncate">{pageTitle}</h1>
            {profile?.name && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold ml-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[120px]">{profile.name}</span>
                <span className="text-[10px] text-emerald-600 uppercase font-black">({(profile.stage || 'IDEA').replace('_', ' ')})</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Language Switcher, Notifications & User Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Language Switcher Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/80 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Change Language / भाषा बदलें"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate max-w-[80px]">{currentLanguageInfo.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-soft-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Official Languages</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">22 Scheduled</span>
                </div>

                <div className="py-1.5 space-y-0.5 max-h-56 overflow-y-auto custom-scrollbar">
                  {quickLanguages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-900 font-black'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{l.native}</span>
                          <span className="text-[11px] text-slate-400">({l.en})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-100 px-1">
                  <Link
                    to="/settings"
                    onClick={() => setLangDropdownOpen(false)}
                    className="block text-center py-1.5 rounded-xl bg-slate-50 hover:bg-emerald-50 text-[11px] font-bold text-emerald-700 transition-colors"
                  >
                    All 22 Languages in Settings →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Trigger */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {/* Notifications Dropdown Modal */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-slate-200 shadow-soft-xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 px-1">
                  <span className="text-xs font-bold text-slate-900">Notifications</span>
                  <button
                    onClick={() => setNotificationsOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="py-2 space-y-2">
                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-semibold">Udyam Registration Alert</strong>
                      <span>Official verification portal ready with zero statutory fee.</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-semibold">Next Stage Ready</strong>
                      <span>Explore schemes and funding modules tailored to your business sector.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar & Menu Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {displayName.charAt(0)}
              </div>
              <span className="hidden sm:inline font-bold text-xs text-slate-800 max-w-[130px] truncate">
                {displayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl border border-slate-200 shadow-soft-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{displayName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>{t('nav.profile', 'View Profile')}</span>
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>{t('nav.settings', 'Settings')}</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('nav.logout', 'Log Out')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
