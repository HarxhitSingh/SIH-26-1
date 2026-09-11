import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Landmark,
  Coins,
  Compass,
  Megaphone,
  MapPin,
  Users2,
  Bot,
  FileText,
  User,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Check,
  Plus,
  Building
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../context/AuthContext';
import { useBusiness } from '../../context/BusinessContext';
import { useLanguage } from '../../context/LanguageContext';
import { localizeStage } from '../../i18n/schemesTranslations';
import { localizeBusinessValue } from '../../i18n/platformTranslations';
import AddBusinessModal from '../business/AddBusinessModal';

export default function Sidebar({ onCloseMobile }) {
  const { logout, currentUser, userProfile } = useAuth();
  const { businesses, activeBusiness, activeBusinessId, setActiveBusiness } = useBusiness();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const switcherRef = useRef(null);

  // Close switcher on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (switcherRef.current && !switcherRef.current.contains(event.target)) {
        setIsSwitcherOpen(false);
      }
    }
    if (isSwitcherOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSwitcherOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navSections = [
    {
      label: t('nav.main', 'MAIN'),
      items: [
        { name: t('nav.dashboard', 'Dashboard'), path: '/dashboard', icon: LayoutDashboard },
        { name: t('nav.business', 'My Business'), path: '/business', icon: Building2 },
        { name: t('nav.schemes', 'Government Schemes'), path: '/schemes', icon: Landmark },
        { name: t('nav.funding', 'Funding'), path: '/funding', icon: Coins },
        { name: t('nav.strategy', 'Business Strategy'), path: '/strategy', icon: Compass },
        { name: t('nav.marketing', 'Marketing Hub'), path: '/marketing', icon: Megaphone, isAi: true },
        { name: t('nav.roadmap', 'Roadmap'), path: '/roadmap', icon: MapPin },
        { name: t('nav.professionals', 'Professionals'), path: '/professionals', icon: Users2 },
        { name: t('nav.advisor', 'AI Business Advisor'), path: '/advisor', icon: Bot, isAi: true }
      ]
    },
    {
      label: t('nav.workspace', 'WORKSPACE'),
      items: [
        { name: t('nav.documents', 'Documents'), path: '/documents', icon: FileText }
      ]
    },
    {
      label: t('nav.account', 'ACCOUNT'),
      items: [
        { name: t('nav.profile', 'Profile'), path: '/profile', icon: User },
        { name: t('nav.settings', 'Settings'), path: '/settings', icon: Settings }
      ]
    }
  ];

  const displayName = userProfile?.name || currentUser?.displayName || activeBusiness?.personalInfo?.fullName || 'Entrepreneur';
  const businessName = activeBusiness?.name || 'My Enterprise';
  const stage = activeBusiness?.stage || 'PLANNING';
  const sector = activeBusiness?.sector || 'Services';
  const location = activeBusiness?.location || 'India';

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-full flex flex-col justify-between select-none relative">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between">
          <NavLink
            to="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg"
          >
            <Logo variant="dark" size="sm" showTagline={false} />
          </NavLink>
        </div>

        {/* Interactive Business Switcher (Entity Stage Popover) */}
        <div className="mx-3 mt-3.5 relative" ref={switcherRef}>
          <button
            type="button"
            onClick={() => setIsSwitcherOpen((prev) => !prev)}
            aria-expanded={isSwitcherOpen}
            className={`w-full p-2.5 rounded-xl border text-left transition-all duration-150 group cursor-pointer focus:outline-none ${
              isSwitcherOpen
                ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {t('nav.entityStage', 'Entity Stage')}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                  {localizeStage(stage, t)}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                    isSwitcherOpen ? 'rotate-180 text-emerald-600' : 'group-hover:text-slate-600'
                  }`}
                />
              </div>
            </div>

            <div className="mt-1">
              <p className="text-xs font-black text-slate-900 truncate">
                {businessName}
              </p>
              <p className="text-[10px] text-slate-500 truncate mt-0.5">
                {localizeBusinessValue(sector, language)} • {localizeBusinessValue(location, language)}
              </p>
            </div>
          </button>

          {/* Switcher Dropdown Popover */}
          {isSwitcherOpen && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-2 py-1.5 flex items-center justify-between border-b border-slate-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                  {t('nav.yourBusinesses', 'Your Businesses')}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                  {businesses.length} {t('common.total', 'Total')}
                </span>
              </div>

              {/* Businesses List */}
              <div className="max-h-56 overflow-y-auto space-y-1 py-1 scrollbar-none">
                {businesses.map((biz) => {
                  const isSelected = biz.id === activeBusinessId;
                  return (
                    <button
                      key={biz.id}
                      type="button"
                      onClick={() => {
                        setActiveBusiness(biz.id);
                        setIsSwitcherOpen(false);
                      }}
                      className={`w-full p-2 rounded-xl text-left transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-50 border border-emerald-200/90 text-emerald-950 font-bold shadow-soft-xs'
                          : 'hover:bg-slate-50 border border-transparent text-slate-700 font-medium'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-black text-slate-900 truncate">
                            {biz.name}
                          </p>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              isSelected
                                ? 'bg-emerald-200/80 text-emerald-900'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {localizeStage(biz.stage, t)}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">
                          {biz.sector} • {biz.location}
                        </p>
                      </div>

                      {isSelected && (
                        <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Add New Business Trigger */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsSwitcherOpen(false);
                    setIsAddModalOpen(true);
                  }}
                  className="w-full p-2 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-all flex items-center justify-center gap-1.5 border border-dashed border-emerald-300 hover:border-emerald-400"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('nav.registerNewBusiness', 'Add New Business')}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Global Add Business Modal */}
        <AddBusinessModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />

        {/* Navigation Links */}
        <nav className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-230px)] scrollbar-none">
          {navSections.map((section) => (
            <div key={section.label}>
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                {section.label}
              </span>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.name}>
                      <NavLink
                        to={item.path}
                        onClick={onCloseMobile}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-soft-sm'
                              : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50 border border-transparent'
                          }`
                        }
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              item.isAi ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-800'
                            }`}
                          />
                          <span className="truncate">{item.name}</span>
                        </div>
                        {item.isAi && (
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-emerald-500 text-white shrink-0">
                            AI
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer User Widget */}
      <div className="p-3 border-t border-slate-100">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0 shadow-sm">
              {displayName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate leading-tight">{displayName}</p>
              <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={t('nav.logout', 'Log Out')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
