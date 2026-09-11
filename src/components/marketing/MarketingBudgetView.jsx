import React from 'react';
import { Link } from 'react-router-dom';
import {
  Coins,
  Sliders,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Layers,
  PieChart,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { formatRupees } from '../../services/financialCalculationService';

export default function MarketingBudgetView({
  budgetStatus,
  allocations = [],
  workingCapitalAllocations,
  onNavigateTab
}) {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      
      {/* Header & Single Source of Truth Callout */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>Single Source of Truth Architecture</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Marketing Budget Allocation Engine
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Your marketing budget is dynamically linked to your Working Capital plan in the Funding Panel.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/funding#working-capital"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
          >
            <span>Edit in Funding Panel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Critical Budget Status Card */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
              TOTAL MONTHLY MARKETING ALLOCATION
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-1">
              {formatRupees(budgetStatus.totalMonthlyBudget)}
              <span className="text-xs text-slate-400 font-semibold ml-2">/ month</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              From Working Capital plan (Operating reserve component)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="p-3 rounded-2xl bg-white/10 border border-white/10 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Committed</span>
              <strong className="text-base font-black text-indigo-300">
                {formatRupees(budgetStatus.committedBudget)}
              </strong>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-right">
              <span className="text-[10px] text-emerald-300 uppercase font-bold block">Remaining Unallocated</span>
              <strong className="text-base font-black text-emerald-300">
                {formatRupees(budgetStatus.remainingBudget)}
              </strong>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300">
            <span>Budget Utilization</span>
            <span className="font-black text-emerald-400">{budgetStatus.utilizationPercent}% Committed</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, budgetStatus.utilizationPercent)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Recommended Channel Distribution Grid (Section 8) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              AI-Recommended Channel Distribution
            </h3>
            <p className="text-xs text-slate-500">
              Mathematically balanced to stay strictly within your {formatRupees(budgetStatus.totalMonthlyBudget)} monthly allocation.
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Sum = {formatRupees(budgetStatus.totalMonthlyBudget)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allocations.map((alloc, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[10px] font-black uppercase text-emerald-700">
                    {alloc.percentage}% Share
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {formatRupees(alloc.amount)}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900">{alloc.channel}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {alloc.purpose}
                </p>
              </div>

              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${alloc.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Rule Clarification Note (Section 8) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-900 block font-bold mb-0.5">
            Strict Architecture Guarantee:
          </strong>
          Customizing your channel distribution inside the Marketing Hub manages how your existing marketing capital is deployed across platforms. It does <strong>NOT</strong> create a parallel budget or alter your master Working Capital plan in the Funding Panel.
        </div>
      </div>

    </div>
  );
}
