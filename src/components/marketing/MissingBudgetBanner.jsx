import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Coins, ArrowRight, Sparkles } from 'lucide-react';

export default function MissingBudgetBanner() {
  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-soft-sm space-y-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 shadow-sm">
          <Coins className="w-6 h-6 text-amber-800" />
        </div>

        <div className="space-y-1.5 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Marketing budget not allocated</span>
          </div>
          <h3 className="text-xl font-black text-amber-950 tracking-tight">
            You currently have ₹0 allocated for marketing in your working capital plan.
          </h3>
          <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed max-w-2xl">
            The AI Marketing Hub strictly respects your real working capital allocations. Allocate a marketing budget in the Funding Panel under Working Capital to unlock personalized campaign planning, budget distributions, and paid advertising workflows.
          </p>
        </div>
      </div>

      <div className="pt-2 flex flex-wrap items-center gap-3">
        <Link
          to="/funding#working-capital"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-900 hover:bg-amber-800 text-white text-xs font-black transition-all shadow-md hover:scale-[1.02]"
        >
          <Coins className="w-4 h-4" />
          <span>Allocate Marketing Budget in Funding Panel</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <span className="text-xs text-amber-800/80 font-medium">
          (Single source of truth: Funding Panel → Working Capital → Marketing)
        </span>
      </div>
    </div>
  );
}
