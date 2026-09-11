import React, { useState, useMemo } from 'react';
import { Layers, IndianRupee, ShieldCheck, Check, Sparkles, Sliders } from 'lucide-react';
import { formatRupees, calculateWorkingCapital } from '../../services/financialCalculationService';

export default function WorkingCapitalPlanner({
  profile = null,
  defaultExpenses = 65000,
  onWorkingCapitalChange,
  onSaveExpenses
}) {
  // Configurable reserve period (1, 2, or 3 months)
  const [reserveMonths, setReserveMonths] = useState(2);

  // Initialize from active business profile workingCapitalAllocations if present
  const bizId = profile?.id || profile?.name || 'default_enterprise';
  const profileAllocations = profile?.financialProfile?.workingCapitalAllocations;

  // Itemized monthly operating expense state (Single source of truth for marketing budget)
  const [expenses, setExpenses] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(`udyamsathi_wc_allocations_${bizId}`);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && typeof parsed === 'object') {
            return {
              rawMaterials: parsed.rawMaterials ?? 60000,
              wages: parsed.wages ?? 35000,
              rent: parsed.rent ?? 15000,
              utilities: parsed.utilities ?? 5000,
              transport: parsed.transport ?? 5000,
              marketing: parsed.marketing ?? 30000
            };
          }
        }
      } catch {}
    }

    return {
      rawMaterials: profileAllocations?.rawMaterials ?? 60000,
      wages: profileAllocations?.wages ?? profileAllocations?.salaries ?? 35000,
      rent: profileAllocations?.rent ?? profileAllocations?.rentUtilities ?? 15000,
      utilities: profileAllocations?.utilities ?? 5000,
      transport: profileAllocations?.transport ?? 5000,
      marketing: profileAllocations?.marketing ?? 30000
    };
  });

  // Ensure initial allocations are immediately cached and persisted
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`udyamsathi_wc_allocations_${bizId}`, JSON.stringify(expenses));
        window.dispatchEvent(new CustomEvent('udyamsathi_wc_updated', { detail: { bizId, expenses } }));
      } catch {}
    }
    if (onSaveExpenses && (!profileAllocations || profileAllocations.marketing === undefined)) {
      onSaveExpenses(expenses);
    }
  }, [bizId]);

  // Keep state in sync if profile updates from another tab/action
  React.useEffect(() => {
    if (profileAllocations) {
      const synced = {
        rawMaterials: profileAllocations.rawMaterials ?? 60000,
        wages: profileAllocations.wages ?? profileAllocations.salaries ?? 35000,
        rent: profileAllocations.rent ?? profileAllocations.rentUtilities ?? 15000,
        utilities: profileAllocations.utilities ?? 5000,
        transport: profileAllocations.transport ?? 5000,
        marketing: profileAllocations.marketing ?? 30000
      };
      setExpenses(synced);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`udyamsathi_wc_allocations_${bizId}`, JSON.stringify(synced));
        } catch {}
      }
    }
  }, [profileAllocations, bizId]);

  // Calculate total monthly operating cost
  const totalMonthlyCost = useMemo(() => {
    return Object.values(expenses).reduce((acc, val) => acc + (Number(val) || 0), 0);
  }, [expenses]);

  const workingCapitalResult = useMemo(() => {
    const res = calculateWorkingCapital(totalMonthlyCost, reserveMonths);
    return {
      ...res,
      expenses,
      allocations: expenses,
      marketingAllocation: Number(expenses.marketing) || 0
    };
  }, [totalMonthlyCost, reserveMonths, expenses]);

  React.useEffect(() => {
    if (onWorkingCapitalChange) {
      onWorkingCapitalChange(workingCapitalResult);
    }
  }, [workingCapitalResult, onWorkingCapitalChange]);

  const handleExpenseChange = (key, val) => {
    const updated = { ...expenses, [key]: Math.max(0, Number(val)) };
    setExpenses(updated);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`udyamsathi_wc_allocations_${bizId}`, JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent('udyamsathi_wc_updated', { detail: { bizId, expenses: updated } }));
      } catch {}
    }
    if (onSaveExpenses) {
      onSaveExpenses(updated);
    }
  };

  return (
    <div id="working-capital" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold mb-1">
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Operational Liquidity Planning</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Working Capital & Reserve Planning
          </h3>
          <p className="text-xs text-slate-500">
            Ensure your project structure reserves sufficient operational liquidity to buffer supplier terms and receivables.
          </p>
        </div>

        {/* Reserve Months Selector (1, 2, 3 months) */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto text-xs font-bold shrink-0">
          {[1, 2, 3].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setReserveMonths(m)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                reserveMonths === m
                  ? 'bg-white text-slate-900 shadow-soft-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {m} {m === 1 ? 'Month' : 'Months'} Reserve
            </button>
          ))}
        </div>
      </div>

      {/* Itemized Cost Breakdown Inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Raw Materials / Inventory
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={expenses.rawMaterials}
              onChange={(e) => handleExpenseChange('rawMaterials', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Wages & Employee Labor
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="1000"
              value={expenses.wages}
              onChange={(e) => handleExpenseChange('wages', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Premises Rent / Lease
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="500"
              value={expenses.rent}
              onChange={(e) => handleExpenseChange('rent', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Electricity & Utilities
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="500"
              value={expenses.utilities}
              onChange={(e) => handleExpenseChange('utilities', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Transport & Freight
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="500"
              value={expenses.transport}
              onChange={(e) => handleExpenseChange('transport', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
            Marketing & Other Ops
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
            <input
              type="number"
              min="0"
              step="500"
              value={expenses.marketing}
              onChange={(e) => handleExpenseChange('marketing', e.target.value)}
              className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Result Card: Monthly Operating Cost & Recommended Reserve */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50/60 to-orange-50/60 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Estimated Monthly Operating Cost
          </span>
          <strong className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 block">
            {formatRupees(totalMonthlyCost)} / month
          </strong>
          <span className="text-xs text-slate-600 mt-1 block">
            Sum of direct monthly raw materials, payroll, utilities, and transport.
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-200/80 shrink-0 text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-amber-800 block">
            Illustrative Working-Capital Reserve ({reserveMonths} Mo)
          </span>
          <strong className="text-xl sm:text-2xl font-black text-amber-950 block">
            {formatRupees(workingCapitalResult.recommendedReserve)}
          </strong>
          <span className="text-[11px] text-slate-500 block">
            {formatRupees(totalMonthlyCost)} × {reserveMonths} months reserve
          </span>
        </div>
      </div>

      <p className="text-[11px] text-slate-400 leading-relaxed">
        * <strong>Important: </strong> This is an illustrative working-capital guideline to safeguard your venture against invoice settlement delays, not an official government statutory requirement.
      </p>
    </div>
  );
}
