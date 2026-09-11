import React, { useState } from 'react';
import {
  MessageSquare,
  PhoneCall,
  Star,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Award
} from 'lucide-react';
import ConsultExpertModal from './ConsultExpertModal';

export default function ConsultExpertBanner({ expert }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState('profile');

  const openModal = (tab) => {
    setInitialTab(tab);
    setModalOpen(true);
  };

  const isFunding = expert.domain === 'funding';

  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Column: Expert Profile Teaser */}
          <div className="space-y-4 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified 1-on-1 Consultation</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{expert.rating} ({expert.reviewsCount} Reviews)</span>
              </span>
            </div>

            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className={`w-16 h-16 rounded-2xl ${expert.avatarBg} text-white font-black text-xl flex items-center justify-center shadow-lg`}>
                  {expert.avatarInitials}
                </div>
                {expert.isOnline && (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" title="Online now" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{expert.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                  {expert.role}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xl line-clamp-2">
                  {expert.bio}
                </p>
              </div>
            </div>

            {/* Specialties & Badges */}
            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {expert.badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5 text-[11px]"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>{badge}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Pricing Transparency & CTAs */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between gap-4 shrink-0 lg:w-80 backdrop-blur-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Consultation Fees
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase">
                  Zero Risk
                </span>
              </div>

              {/* Free 1st Call Highlight */}
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-emerald-300">1st Call (15 Mins)</span>
                  <span className="text-base font-black text-white">FREE (₹0)</span>
                </div>
                <p className="text-[10px] text-emerald-200/80 mt-0.5">
                  Complimentary discovery & viability review
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 px-1">
                <span className="text-slate-400">Subsequent Sessions:</span>
                <strong className="text-white font-bold">{expert.fees.standardPrice} / 30 mins</strong>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-white/10">
              <button
                onClick={() => openModal('profile')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 hover:scale-[1.02]"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Consult an Expert (1st Call Free)</span>
              </button>

              <button
                onClick={() => openModal('chat')}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 hover:border-white/30"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Chat with {expert.name.split(' ')[0]}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConsultExpertModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        expert={expert}
        initialTab={initialTab}
      />
    </>
  );
}
