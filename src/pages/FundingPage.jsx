import React, { useState, useMemo } from 'react';
import {
  Coins,
  IndianRupee,
  ShieldCheck,
  PieChart,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEntrepreneurProfile } from '../context/EntrepreneurProfileContext';
import { useLanguage } from '../context/LanguageContext';
import {
  parseRupeeAmount,
  formatRupees,
  calculateFinancingStructure
} from '../services/financialCalculationService';
import { CENTRAL_SCHEMES } from '../data/centralSchemes';
import { evaluateSchemeEligibility } from '../services/eligibilityEngine';
import { STATUTORY_FINANCIAL_DISCLAIMER } from '../data/fundingProducts';

import FinancialProfileCard from '../components/funding/FinancialProfileCard';
import ProjectCostCalculator from '../components/funding/ProjectCostCalculator';
import FundingTierCard from '../components/funding/FundingTierCard';
import RepaymentScheduler from '../components/funding/RepaymentScheduler';
import AffordabilityIndicator from '../components/funding/AffordabilityIndicator';
import WorkingCapitalPlanner from '../components/funding/WorkingCapitalPlanner';
import ProjectCostBreakdown from '../components/funding/ProjectCostBreakdown';
import AiFundingAdvisor from '../components/funding/AiFundingAdvisor';
import ConsultExpertBanner from '../components/expert/ConsultExpertBanner';
import { FUNDING_EXPERT } from '../data/expertConsultants';

export default function FundingPage() {
  const { profile, loading, error, updateProfileData } = useEntrepreneurProfile();
  const { language, t } = useLanguage();

  // Local state for interactive project cost / margin simulation
  const [interactiveMargin, setInteractiveMargin] = useState(null);
  const [customProjectCost, setCustomProjectCost] = useState(0);
  const [latestRepayment, setLatestRepayment] = useState(null);
  const [workingCapitalState, setWorkingCapitalState] = useState(null);

  const financials = profile?.financialProfile || {};

  // Base margin from profile or default demo
  const profileMargin = parseRupeeAmount(financials.availableMarginCapital || financials.availableCapital || 100000);
  const effectiveMargin = interactiveMargin !== null ? interactiveMargin : profileMargin;

  // Compute live financing structure
  const structure = useMemo(() => {
    return calculateFinancingStructure(effectiveMargin, customProjectCost);
  }, [effectiveMargin, customProjectCost]);

  // Find matched government subsidy schemes for capital stacking
  const matchedSchemes = useMemo(() => {
    if (!profile) return [];
    try {
      return (CENTRAL_SCHEMES || [])
        .map((s) => ({
          ...s,
          eligibility: evaluateSchemeEligibility(profile, s)
        }))
        .filter((s) => s.eligibility?.status !== 'NOT_ELIGIBLE')
        .slice(0, 3);
    } catch (e) {
      console.warn('Scheme match error', e);
      return [];
    }
  }, [profile]);

  // Handle financial updates from Profile Card
  const handleUpdateFinancials = async (newFinancials) => {
    if (updateProfileData) {
      await updateProfileData('financialProfile', newFinancials);
      if (newFinancials.availableMarginCapital) {
        setInteractiveMargin(parseRupeeAmount(newFinancials.availableMarginCapital));
      }
    }
  };

  // Preparation for AI Advisor calculation context
  const calculationContext = useMemo(() => {
    return {
      margin: structure.margin,
      effectiveProjectCost: structure.effectiveProjectCost,
      potentialLoan: structure.potentialLoan,
      product: structure.product,
      repayment: latestRepayment,
      affordability: latestRepayment
        ? {
            monthlySurplus: parseRupeeAmount(financials.monthlyRevenue || financials.expectedMonthlyRevenue || 120000) -
              parseRupeeAmount(financials.monthlyOperatingExpenses || financials.expectedMonthlyOperatingCost || 65000) -
              parseRupeeAmount(financials.existingMonthlyObligation || financials.existingEmi || 0),
            coverageRatio: latestRepayment?.monthlyEquivalent > 0
              ? parseFloat(((parseRupeeAmount(financials.monthlyRevenue || financials.expectedMonthlyRevenue || 120000) -
                  parseRupeeAmount(financials.monthlyOperatingExpenses || financials.expectedMonthlyOperatingCost || 65000) -
                  parseRupeeAmount(financials.existingMonthlyObligation || financials.existingEmi || 0)) / latestRepayment.monthlyEquivalent).toFixed(2))
              : 0,
            label: 'Comfortable'
          }
        : null,
      workingCapital: workingCapitalState,
      business: profile?.business || {},
      personal: profile?.personalInfo || {}
    };
  }, [structure, latestRepayment, workingCapitalState, profile, financials]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-slate-500">
          {t('funding.loading', 'Loading Smart Financial Planner...')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-12">
      {/* Page Header (Section 6) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold mb-2">
            <Coins className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('funding.capitalStackBadge', 'Enterprise Financial Structuring Assistant')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('funding.fundingTitle', 'Smart Funding Planner')}
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {t('funding.fundingSubtitle', 'Understand how much you may be able to structure, which funding option fits your project, and what repayment could look like.')}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left shrink-0 flex items-center gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {t('funding.feasibleOutlay', 'Indicative Feasible Outlay')}
            </span>
            <strong className="text-xl font-black text-slate-900">
              {formatRupees(structure.effectiveProjectCost)}
            </strong>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 block">
              {t('funding.potentialFinancing', 'Potential Financing')}
            </span>
            <strong className="text-xl font-black text-emerald-700">
              {formatRupees(structure.potentialLoan)}
            </strong>
          </div>
        </div>
      </div>

      {/* SECTION 1: Your Financial Profile (Section 7) */}
      <FinancialProfileCard
        profile={profile}
        onUpdateFinancials={handleUpdateFinancials}
      />

      {/* SECTION 2: Smart Project Cost Calculator (Section 8, 26, 27) */}
      <ProjectCostCalculator
        marginCapital={effectiveMargin}
        onMarginChange={(newMargin) => setInteractiveMargin(newMargin)}
        customProjectCost={customProjectCost}
        onProjectCostChange={(newCost) => setCustomProjectCost(newCost)}
        structure={structure}
      />

      {/* SECTION 3: Funding Tier Structure & Scheme Matcher (Section 10, 11, 12, 13, 14, 31, 32) */}
      <FundingTierCard
        structure={structure}
        matchedSchemes={matchedSchemes}
      />

      {/* SECTION 4: Project Cost Breakdown (Section 24) */}
      <ProjectCostBreakdown
        totalProjectCost={structure.effectiveProjectCost}
        onBreakdownChange={() => {}}
      />

      {/* SECTION 5: Repayment Calculator & Schedule (Section 15, 16, 17, 18, 19, 20) */}
      <RepaymentScheduler
        structure={structure}
        onRepaymentCalculated={(rep) => setLatestRepayment(rep)}
      />

      {/* SECTION 6: Business Affordability & Cash Flow Comfort (Section 21, 22) */}
      <AffordabilityIndicator
        profile={profile}
        monthlyRepayment={latestRepayment?.monthlyEquivalent || 0}
      />

      {/* SECTION 7: Working Capital Planner (Section 23) */}
      <WorkingCapitalPlanner
        profile={profile}
        defaultExpenses={parseRupeeAmount(financials.monthlyOperatingExpenses || financials.expectedMonthlyOperatingCost || 65000)}
        onWorkingCapitalChange={(wc) => setWorkingCapitalState(wc)}
        onSaveExpenses={async (newAllocations) => {
          if (updateProfileData) {
            await updateProfileData('financialProfile', {
              ...financials,
              workingCapitalAllocations: newAllocations
            });
          }
        }}
      />

      {/* SECTION 8: 🧠 Ask About Your Funding Plan (Section 28, 29, 30) */}
      <AiFundingAdvisor
        calculationContext={calculationContext}
      />

      {/* SECTION 9: Next Financial Action (Roadmap Integration Section 34) */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-soft-md flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
            <Target className="w-3.5 h-3.5" />
            <span>🎯 {t('funding.nextFinancialMilestone', 'Next Financial Milestone')}</span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            {t('funding.dprActionTitle', 'Prepare your Detailed Project Report (DPR) & Quotations')}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('funding.dprActionDesc', 'Your funding requirement has been calculated at')} <strong>{formatRupees(structure.potentialLoan)}</strong> {t('funding.underTier', 'under the')} {structure.product?.name || 'Scheme Tier'}. {t('funding.dprActionAdvice', 'The next recommended action is consolidating vendor machinery quotations and registering on the official Udyam portal to unlock bank appraisal.')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Link
            to="/roadmap"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-soft-sm text-center flex items-center justify-center gap-1.5"
          >
            <span>{t('funding.viewRoadmap', 'View Financial Roadmap')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/documents"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition-all text-center"
          >
            <span>{t('funding.documentChecklist', 'Document Checklist')}</span>
          </Link>
        </div>
      </div>

      {/* SECTION 10: 💼 Consult an Expert (Chartered Accountant / Finance Expert) */}
      <ConsultExpertBanner expert={FUNDING_EXPERT} />

      {/* Bottom Concise Statutory Financial Disclaimer (Section 41) */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 leading-relaxed max-w-4xl mx-auto">
        <strong>Important Notice: </strong>
        {STATUTORY_FINANCIAL_DISCLAIMER}
      </div>
    </div>
  );
}
