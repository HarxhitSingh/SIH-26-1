import React from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { generateAdvertisingPlans } from '../../services/marketing/marketingEngine';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingAdsPlanner({ profile, monthlyBudget = 30000, onLaunchAdPlan }) {
  const adPlans = generateAdvertisingPlans(profile, monthlyBudget);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Target className="w-3.5 h-3.5 text-emerald-600" />
            <span>Paid Campaign Media Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            AI Advertising Planner
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Optimized campaign blueprints calibrated for local platforms, daily spending pacing, and realistic customer acquisition costs.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left sm:text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Available Monthly Cap</span>
          <strong className="text-lg font-black text-slate-900 block mt-0.5">
            {formatRupees(monthlyBudget)}
          </strong>
        </div>
      </div>

      {/* Ad Blueprint Cards */}
      <div className="space-y-5">
        {adPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white inline-block mb-1.5">
                  {plan.platform}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900">{plan.objective}</h3>
                <p className="text-xs text-slate-500 mt-0.5">Targeting: {plan.targetAudience}</p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Budget Allocation</span>
                <strong className="text-xl font-black text-emerald-700 block mt-0.5">
                  {formatRupees(plan.totalCost)}
                </strong>
                <span className="text-[11px] text-slate-500 block">
                  ~₹{plan.dailyBudget}/day • {plan.campaignDuration}
                </span>
              </div>
            </div>

            {/* Estimated KPIs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Local Reach</span>
                <strong className="text-xs font-black text-slate-900 mt-1 block">{plan.estimatedReach}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Inquiries</span>
                <strong className="text-xs font-black text-slate-900 mt-1 block">{plan.estimatedClicks}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Estimated Cost / Lead</span>
                <strong className="text-xs font-black text-emerald-800 mt-1 block">{plan.estimatedCostPerInquiry}</strong>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Recommended Creative</span>
                <strong className="text-xs font-black text-slate-900 mt-1 block truncate" title={plan.creativeType}>
                  {plan.creativeType}
                </strong>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-slate-400 italic">
                * Performance figures are AI-estimated benchmarks for Tier-2/3 Indian districts, not guaranteed outcomes.
              </span>

              {onLaunchAdPlan && (
                <button
                  onClick={() => onLaunchAdPlan(plan)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all"
                >
                  Adopt as Campaign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
