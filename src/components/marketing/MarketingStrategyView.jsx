import React from 'react';
import {
  Compass,
  Target,
  Sparkles,
  Users,
  MapPin,
  CheckCircle2,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingStrategyView({ strategy, budgetStatus, onNavigateTab }) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Executive Strategy Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI Enterprise Strategy</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {strategy.businessName} • Marketing Strategy
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Sector: <strong>{strategy.sector}</strong> • Location: <strong>{strategy.location}</strong> • Monthly Budget: <strong>{formatRupees(budgetStatus.totalMonthlyBudget)}</strong>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shrink-0 text-left sm:text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Monthly Budget Constraint</span>
            <strong className="text-xl font-black text-emerald-400 block mt-0.5">
              {formatRupees(budgetStatus.totalMonthlyBudget)}
            </strong>
            <span className="text-[10px] text-slate-400">Strictly enforced ceiling</span>
          </div>
        </div>

        {/* 3 Pillar Strategic Core */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider block">
              PRIMARY MARKETING OBJECTIVE
            </span>
            <p className="text-white font-bold leading-relaxed text-xs sm:text-sm">
              {strategy.objective}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider block">
              TARGET CUSTOMER SEGMENT
            </span>
            <p className="text-white font-bold leading-relaxed text-xs sm:text-sm">
              {strategy.targetSegment}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider block">
              COMPETITIVE POSITIONING
            </span>
            <p className="text-white font-bold leading-relaxed text-xs sm:text-sm">
              {strategy.positioning}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Ranked Recommended Channels with Rationales (Section 6) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Channel Prioritization Model</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Ranked Marketing Channels for Your Enterprise
            </h3>
            <p className="text-xs text-slate-500">
              Ranked strictly by cost-efficiency, local customer habituation, and conversion speed.
            </p>
          </div>

          <span className="text-xs font-bold text-slate-500">
            5 Channels Evaluated
          </span>
        </div>

        <div className="space-y-3">
          {strategy.channels.map((ch, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:bg-slate-50/90 hover:border-slate-300"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-black text-slate-900">{ch.name}</h4>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${ch.badgeColor}`}>
                    {ch.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-8 leading-relaxed">
                  <strong>Why recommended:</strong> {ch.reason}
                </p>
              </div>

              <div className="sm:text-right shrink-0 pl-8 sm:pl-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Suggested Budget Share</span>
                <span className="text-sm font-black text-slate-900 block mt-0.5">{ch.suggestedShare}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hyperlocal Catchment Breakdown (Section 14) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold mb-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Hyperlocal Geographic Delivery Radius</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Concentric 0–10 km Catchment Strategy
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated specifically for {strategy.location} consumer purchasing behavior.
            </p>
          </div>

          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            AI-Estimated Catchment Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {strategy.catchment.map((cat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{cat.radius}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Key Channels</span>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.channels.map((c, i) => (
                      <span key={i} className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-800">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Strategic Focus</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{cat.focus}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100 text-[11px] text-emerald-950">
                <strong>Conversion Pattern:</strong> {cat.conversionExpectation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Banner */}
      <div className="p-6 rounded-3xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-slate-900">Ready to execute this strategy?</h4>
          <p className="text-xs text-slate-600 mt-0.5">
            Explore your 100-Day Step-by-Step Execution Plan or set up your first live campaign.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('roadmap')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <span>View 100-Day Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <span>Launch Campaign</span>
          </button>
        </div>
      </div>

    </div>
  );
}
