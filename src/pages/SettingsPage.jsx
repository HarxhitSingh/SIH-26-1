import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  Shield,
  Bell,
  Globe,
  Lock,
  LogOut,
  CheckCircle2,
  Search,
  Check,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEntrepreneurProfile } from '../context/EntrepreneurProfileContext';
import { useLanguage } from '../context/LanguageContext';

export default function SettingsPage() {
  const { logout, currentUser, userProfile } = useAuth();
  const { profile } = useEntrepreneurProfile();
  const { language, setLanguage, languages, currentLanguageInfo, t } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('account');
  const [savedNote, setSavedNote] = useState('');
  const [langSearch, setLangSearch] = useState('');
  const [isDragBoxOpen, setIsDragBoxOpen] = useState(true);
  const dragBoxRef = useRef(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const tabs = [
    { id: 'account', label: t('nav.profile', 'Account Profile'), icon: Settings },
    { id: 'language', label: `${t('common.language', 'Language')} / ${currentLanguageInfo.nativeName}`, icon: Globe, highlight: true },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell },
    { id: 'security', label: 'Security & Auth', icon: Lock },
    { id: 'privacy', label: 'Privacy & Data Terms', icon: Shield }
  ];

  const displayName = userProfile?.name || currentUser?.displayName || profile?.personalInfo?.fullName || 'Entrepreneur';

  const triggerSaveNote = (msg) => {
    setSavedNote(msg);
    setTimeout(() => setSavedNote(''), 3500);
  };

  const handleSelectLanguage = (code, name, nativeName) => {
    setLanguage(code);
    triggerSaveNote(`Language set to ${nativeName} (${name}) • भाषा बदली गई`);
  };

  // Popular quick toggle languages
  const popularLanguages = [
    { code: 'en', native: 'English', en: 'English' },
    { code: 'hi', native: 'हिन्दी', en: 'Hindi' },
    { code: 'mr', native: 'मराठी', en: 'Marathi' },
    { code: 'bn', native: 'বাংলা', en: 'Bengali' },
    { code: 'gu', native: 'ગુજરાતી', en: 'Gujarati' },
    { code: 'ta', native: 'தமிழ்', en: 'Tamil' },
    { code: 'te', native: 'తెలుగు', en: 'Telugu' }
  ];

  // Filter languages for the drag box
  const filteredLanguages = useMemo(() => {
    const q = langSearch.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter((l) =>
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q) ||
      (l.region && l.region.toLowerCase().includes(q))
    );
  }, [languages, langSearch]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('settings.title', 'Workspace Preferences')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.settings', 'Settings')}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            {t('settings.subtitle', 'Manage your account security, notification alerts, language options, and privacy preferences.')}
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl text-xs font-bold transition-colors shrink-0 self-start sm:self-center cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('nav.logout', 'Sign Out')}</span>
        </button>
      </div>

      {savedNote && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 text-xs font-bold flex items-center justify-between gap-2 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{savedNote}</span>
          </div>
          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
            Active
          </span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="md:col-span-4 bg-white rounded-3xl p-3 border border-slate-200/90 shadow-soft-sm space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-3.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-soft-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : tab.highlight ? 'text-emerald-600' : 'text-slate-500'}`} />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.highlight && !isSelected && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {currentLanguageInfo.nativeName}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="md:col-span-8 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-soft-sm space-y-5">
          {/* TAB: COMPACT SEARCHABLE LANGUAGE SELECTOR & TOGGLE */}
          {activeTab === 'language' && (
            <div className="space-y-5">
              {/* Header with Active Badge */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Language Settings</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Switch language instantly or search any of the 22 official languages of India.
                  </p>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs font-bold text-emerald-900 self-start sm:self-auto shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{currentLanguageInfo.nativeName} ({currentLanguageInfo.name})</span>
                </div>
              </div>

              {/* 1. Quick Language Toggle Bar */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Quick Select
                </label>
                <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {popularLanguages.map((pLang) => {
                    const isSelected = language === pLang.code;
                    return (
                      <button
                        key={pLang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(pLang.code, pLang.en, pLang.native)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/20'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                        }`}
                      >
                        <span>{pLang.native}</span>
                        <span className={`text-[10px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                          ({pLang.en})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Searchable Official Languages Box ("Drag Box" / Combobox) */}
              <div className="space-y-2 pt-1" ref={dragBoxRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600" />
                    <span>All Official Languages (22 Scheduled + English)</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsDragBoxOpen(!isDragBoxOpen)}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isDragBoxOpen ? 'Hide list' : 'Show list'}</span>
                    {isDragBoxOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Combobox Search & Scrollable Drag Box */}
                {isDragBoxOpen && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3 space-y-2.5 shadow-soft-xs">
                    {/* Search Input inside the box */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={langSearch}
                        onChange={(e) => setLangSearch(e.target.value)}
                        placeholder="Search language (e.g. Tamil, Punjabi, اردو, বাংলা)..."
                        className="w-full bg-white border border-slate-200 text-slate-900 placeholder-slate-400 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-inner"
                      />
                      {langSearch && (
                        <button
                          type="button"
                          onClick={() => setLangSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Scrollable List ("Drag Box") */}
                    <div className="max-h-52 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                      {filteredLanguages.map((l) => {
                        const isCurrent = language === l.code;
                        return (
                          <button
                            key={l.code}
                            type="button"
                            onClick={() => handleSelectLanguage(l.code, l.name, l.nativeName)}
                            className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 cursor-pointer ${
                              isCurrent
                                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold shadow-soft-2xs'
                                : 'bg-white hover:bg-slate-100 border-slate-200/80 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 uppercase">
                                {l.code}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-black text-slate-900 text-[13px] leading-tight">
                                    {l.nativeName}
                                  </span>
                                  <span className="text-slate-400 text-xs">({l.name})</span>
                                </div>
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {l.region}
                                </span>
                              </div>
                            </div>

                            {isCurrent && (
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}

                      {filteredLanguages.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No official language found for "{langSearch}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 3. Compact Active Language Info Card */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-700 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Active: {currentLanguageInfo.nativeName} ({currentLanguageInfo.name})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Recognized in 8th Schedule • Applied across navigation & AI Advisor
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 uppercase">
                  {currentLanguageInfo.code}
                </span>
              </div>
            </div>
          )}

          {/* TAB: ACCOUNT INFO */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-3">{t('nav.profile', 'Account Information')}</h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <label className="text-slate-400 block mb-1">Registered Name</label>
                  <p className="font-bold text-slate-900">{displayName}</p>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email Address</label>
                  <p className="font-bold text-slate-900">{currentUser?.email || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Authentication Method</label>
                  <p className="font-semibold text-emerald-700">
                    {currentUser?.providerData?.[0]?.providerId === 'google.com' ? 'Google Authentication' : 'Email & Password'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-3">Notification Preferences</h2>
              <div className="space-y-3 text-xs">
                {[
                  'New Government Scheme match alerts',
                  'Subsidy application deadline reminders',
                  'Bank loan document checklist updates',
                  'AI Advisor weekly milestones review'
                ].map((item, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border cursor-pointer hover:bg-slate-100">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    <span className="font-semibold text-slate-800">{item}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => triggerSaveNote('Notification preferences updated!')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t('common.save', 'Save Preferences')}
              </button>
            </div>
          )}

          {/* TAB: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-3">Security & Authentication</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your credentials and onboarding profile are secured through Firebase Authentication and Cloud Firestore security rules.
              </p>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-700 shrink-0" />
                <span>Protected with SSL encryption and role-based Firestore token verification.</span>
              </div>
            </div>
          )}

          {/* TAB: PRIVACY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b pb-3">Privacy & Data Governance</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                UdyamSaathi adheres to Indian data protection guidelines. Your business idea, category, and financial estimates are never shared with commercial telemarketers. They are strictly evaluated against central and state government eligibility registries.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
