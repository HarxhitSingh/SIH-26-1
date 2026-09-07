import React from 'react';
import { Building2, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEntrepreneurProfile } from '../../context/EntrepreneurProfileContext';
import { useBusiness } from '../../context/BusinessContext';
import { useLanguage } from '../../context/LanguageContext';
import { localizeStage } from '../../i18n/schemesTranslations';
import { localizeBusinessValue } from '../../i18n/platformTranslations';

export default function WelcomeHeader() {
  const { currentUser, userProfile } = useAuth();
  const { profile } = useEntrepreneurProfile();
  const { activeBusiness } = useBusiness();
  const { language, t } = useLanguage();

  const business = activeBusiness || profile?.business || profile || {};

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greetingMorning', 'Good morning');
    if (hour < 17) return t('dashboard.greetingAfternoon', 'Good afternoon');
    return t('dashboard.greetingEvening', 'Good evening');
  };

  const displayName = userProfile?.name || currentUser?.displayName || business.personalInfo?.fullName || profile?.personalInfo?.fullName || 'Entrepreneur';
  const businessName = business.name || 'Your Enterprise';
  const stage = business.stage || 'PLANNING';
  const location = business.location || (business.personalInfo?.district
    ? `${business.personalInfo.district}, ${business.personalInfo.state}`
    : 'India');

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft-sm">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('dashboard.commandCenterBadge', 'Entrepreneur Command Center')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {getGreeting()}, {displayName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {t('dashboard.commandCenterDesc', 'Live command center for enterprise parameters, roadmap progression, and capital linkages.')}
        </p>
      </div>

      {/* Business & Stage Badge Card (Clickable to My Business) */}
      <Link
        to="/business"
        title="Manage in Business Center"
        className="group flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200/80 hover:border-emerald-300 transition-all shrink-0 cursor-pointer shadow-soft-xs"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center font-bold shadow-soft-sm transition-colors">
          <Building2 className="w-5 h-5" />
        </div>
        <div className="min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h2 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-800 truncate max-w-[160px] sm:max-w-[200px] transition-colors">
              {businessName}
            </h2>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
              {localizeStage(stage, t)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mt-0.5">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{localizeBusinessValue(location, language)}</span>
            </div>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
          </div>
        </div>
      </Link>
    </div>
  );
}
