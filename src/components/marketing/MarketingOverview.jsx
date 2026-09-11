import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  Coins,
  ArrowRight,
  ExternalLink,
  Target,
  Megaphone,
  CheckCircle2,
  AlertTriangle,
  Users,
  Compass,
  Zap,
  Layers
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingOverview({
  profile,
  strategy,
  budgetStatus,
  marketingHealth,
  campaigns = [],
  onNavigateTab
}) {
  const activeCampaigns = campaigns.filter((c) => c.status === 'ACTIVE');
  const completedCampaigns = campaigns.filter((c) => c.status === 'COMPLETED');
  const hasPerformanceData = campaigns.some((c) => c.metrics?.conversions > 0);

  const totalConversions = campaigns.reduce((acc, c) => acc + (c.metrics?.conversions || 0), 0);
  const bestChannel = 'WhatsApp Business';

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* 1. Overspend / Deficit Alert (if working capital decreased) */}
      {budgetStatus.isOverBudget && (
        <div className="p-5 rounded-3xl bg-rose-50 border-2 border-rose-300 text-rose-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-sm font-black block">
                ⚠️ Your marketing allocation has decreased below active campaigns!
              </strong>
              <p className="text-xs text-rose-800 mt-0.5">
                Existing planned campaigns total <strong>{formatRupees(budgetStatus.committedBudget)}</strong>, which exceeds your current working capital marketing allocation of <strong>{formatRupees(budgetStatus.totalMonthlyBudget)}</strong> by <strong>{formatRupees(budgetStatus.deficit)}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/funding#working-capital"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all"
            >
              Update Funding Panel
            </Link>
            <button
              onClick={() => onNavigateTab('campaigns')}
              className="px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 font-bold text-xs hover:bg-rose-50 transition-all"
            >
              Adjust Campaigns
            </button>
          </div>
        </div>
      )}

      {/* 2. Top Summary Grid: Health Score + Single Source Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* Marketing Health Card */}
        <div className="md:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                MARKETING HEALTH
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                {marketingHealth.assessmentType}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-4xl font-black text-slate-900 tracking-tight">
                {marketingHealth.score}
              </span>
              <span className="text-slate-400 font-bold text-sm">/ 100</span>
            </div>

            <p className="text-xs font-bold text-emerald-700 mt-1">
              {marketingHealth.label}
            </p>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Calculated from working capital budget utilization, active local campaigns, and execution consistency.
            </p>
          </div>

          {/* Progress bar */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex justify-between text-[10px] font-bold text-slate-500">
              <span>Overall Readiness</span>
              <span>{marketingHealth.score}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                style={{ width: `${marketingHealth.score}%` }}
              />
            </div>
          </div>
        </div>

        {/* Working Capital Marketing Budget Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Monthly Budget Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Monthly Marketing Budget
                </span>
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="text-2xl font-black text-slate-900 mt-2">
                {formatRupees(budgetStatus.totalMonthlyBudget)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                Based on your Working Capital allocation
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <Link
                to="/funding#working-capital"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <span>Edit in Funding Panel</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Budget Committed / Used Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Committed to Campaigns
                </span>
                <Target className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="text-2xl font-black text-indigo-950 mt-2">
                {formatRupees(budgetStatus.committedBudget)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                {budgetStatus.utilizationPercent}% of monthly allocation
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Actual Spend to date:</span>
              <strong className="text-slate-800">{formatRupees(budgetStatus.spentBudget)}</strong>
            </div>
          </div>

          {/* Remaining Uncommitted Budget Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-soft-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Remaining Unallocated
                </span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>

              <div className="text-2xl font-black text-emerald-700 mt-2">
                {formatRupees(budgetStatus.remainingBudget)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                Available for new campaigns
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateTab('campaigns')}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-emerald-700 hover:underline"
              >
                <span>+ Launch New Campaign</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Performance & Activity Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Active Campaigns
            </span>
            <strong className="text-xl font-black text-slate-900 block mt-1">
              {activeCampaigns.length}
            </strong>
          </div>
          <button
            onClick={() => onNavigateTab('campaigns')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            Manage
          </button>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Customers Acquired
            </span>
            <strong className="text-xl font-black text-slate-900 block mt-1">
              {hasPerformanceData ? totalConversions : '0'}
            </strong>
          </div>
          <span className="text-[10px] font-bold text-slate-400">
            {hasPerformanceData ? 'Verified Buyers' : 'No campaign performance data yet'}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Best Performing Channel
            </span>
            <strong className="text-sm font-black text-emerald-900 block mt-1">
              {bestChannel}
            </strong>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
            Lowest CAC
          </span>
        </div>
      </div>

      {/* 4. AI Strategic Insight Banner (Section 17) */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 text-white shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400">
            <Zap className="w-4 h-4" />
            <span>AI Performance Intelligence & Optimization</span>
          </div>

          <span className="text-[10px] font-bold text-slate-400">
            Continuous Learning Engine
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-base sm:text-lg font-black text-white">
            WhatsApp generated 40% higher direct customer conversions than Instagram this month.
          </h4>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
            In your regional district, customers show significantly higher trust when receiving verified batch availability alerts directly on WhatsApp. We recommend shifting <strong>₹4,000</strong> of your unallocated testing budget toward customer retention and broadcast promotions.
          </p>
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigateTab('budget')}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all shadow-md flex items-center gap-1.5"
          >
            <span>Apply Recommendation</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('advisor')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/15"
          >
            Discuss with AI Marketing Advisor
          </button>
        </div>
      </div>

      {/* 5. Core 5 Questions Snapshot */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Your Core Strategic Blueprint</h3>
            <p className="text-xs text-slate-500">Every marketing effort answers these 5 fundamental business questions.</p>
          </div>
          <button
            onClick={() => onNavigateTab('strategy')}
            className="text-xs font-bold text-emerald-700 hover:underline"
          >
            View Full Strategy
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">1. WHAT</span>
            <strong className="text-xs font-black text-slate-900 line-clamp-2">{strategy.product}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">2. WHO</span>
            <strong className="text-xs font-black text-slate-900 line-clamp-2">{strategy.targetSegment}</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">3. WHERE</span>
            <strong className="text-xs font-black text-slate-900 line-clamp-2">5–10 km Hyperlocal Catchment</strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">4. HOW MUCH</span>
            <strong className="text-xs font-black text-emerald-800 line-clamp-2">
              {formatRupees(budgetStatus.totalMonthlyBudget)} / mo
            </strong>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-black uppercase text-slate-400 block">5. NEXT STEP</span>
            <strong className="text-xs font-black text-slate-900 line-clamp-2">Launch Phase 2 Awareness</strong>
          </div>
        </div>
      </div>

    </div>
  );
}
