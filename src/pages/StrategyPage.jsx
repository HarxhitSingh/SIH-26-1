import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Coins,
  Landmark,
  ArrowRight,
  Sliders,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Share2,
  Printer,
  ExternalLink,
  Target,
  Store,
  Clock,
  Check,
  CheckCircle2
} from 'lucide-react';
import { useEntrepreneurProfile } from '../context/EntrepreneurProfileContext';
import { generateBusinessStrategy } from '../services/strategy/strategyEngine';
import { generateGroundedAiSummary } from '../services/strategy/strategyAdvisorService';
import MarketAreaMap from '../components/strategy/MarketAreaMap';
import FeasibilityGauge from '../components/strategy/FeasibilityGauge';
import SwotGrid from '../components/strategy/SwotGrid';
import ConsultExpertBanner from '../components/expert/ConsultExpertBanner';
import { STRATEGY_EXPERT } from '../data/expertConsultants';

const getStrategyStorageKey = (bizId) => `udyamsathi_business_strategy_cache_${bizId || 'default'}`;

const LOADING_STEPS = [
  'Understanding your business profile & industry',
  'Analyzing your geographic district & rural/urban cluster',
  'Estimating 5–10 km market population & customer reach',
  'Studying local competition density & positioning gaps',
  'Identifying unserved hyper-local opportunities',
  'Evaluating supply-chain bottlenecks & seasonal risks',
  'Building unit economics & break-even financial outlook',
  'Assembling grounded AI strategic recommendations'
];

export default function StrategyPage() {
  const { profile, loading: profileLoading } = useEntrepreneurProfile();

  const [strategy, setStrategy] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);

  // Reload strategy when active profile changes
  useEffect(() => {
    try {
      localStorage.removeItem('udyamsathi_business_strategy_cache');
    } catch {}

    if (!profile?.id) {
      setStrategy(null);
      setAiSummary(null);
      return;
    }

    const key = getStrategyStorageKey(profile.id);
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const parsed = JSON.parse(cached);
        setStrategy(parsed);
        setAiSummary(parsed.aiSummary || null);
      } else {
        setStrategy(null);
        setAiSummary(null);
      }
    } catch {
      setStrategy(null);
      setAiSummary(null);
    }
  }, [profile?.id]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showOverrides, setShowOverrides] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Local Parameter Fine-tuning State
  const [overrides, setOverrides] = useState({
    unitSellingPrice: '',
    unitVariableCost: '',
    fixedMonthlyCosts: '',
    monthlyTargetVolume: ''
  });

  // Execution flow with realistic multi-step loading experience
  const handleGenerateStrategy = async () => {
    if (!profile) return;

    setIsGenerating(true);
    setActiveStepIndex(0);

    // Progressive step simulation for user transparency
    const stepInterval = setInterval(() => {
      setActiveStepIndex((prev) => {
        if (prev < LOADING_STEPS.length - 2) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      // Build clean overrides object
      const cleanOverrides = {};
      if (overrides.unitSellingPrice) cleanOverrides.unitSellingPrice = parseFloat(overrides.unitSellingPrice);
      if (overrides.unitVariableCost) cleanOverrides.unitVariableCost = parseFloat(overrides.unitVariableCost);
      if (overrides.fixedMonthlyCosts) cleanOverrides.fixedMonthlyCosts = parseFloat(overrides.fixedMonthlyCosts);
      if (overrides.monthlyTargetVolume) cleanOverrides.monthlyTargetVolume = parseFloat(overrides.monthlyTargetVolume);

      // Deterministic analytical run
      const generated = await generateBusinessStrategy(profile, cleanOverrides);

      // AI plain-language summary run
      const aiResult = await generateGroundedAiSummary(generated);

      generated.aiSummary = aiResult;

      clearInterval(stepInterval);
      setActiveStepIndex(LOADING_STEPS.length - 1);

      // Cache locally for offline availability scoped to this business
      localStorage.setItem(getStrategyStorageKey(profile?.id), JSON.stringify(generated));

      setStrategy(generated);
      setAiSummary(aiResult);
    } catch (err) {
      console.error('Failed to generate business strategy:', err);
    } finally {
      clearInterval(stepInterval);
      setTimeout(() => {
        setIsGenerating(false);
      }, 500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  if (profileLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading your enterprise profile...</p>
      </div>
    );
  }

  const businessName = profile?.business?.name || 'My Enterprise';
  const locationText = `${profile?.personalInfo?.district || 'Your District'}, ${profile?.personalInfo?.state || 'India'}`;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hyper-Local Feasibility & Strategic Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Business Strategy
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Understand your local market, identify unserved opportunities, evaluate supply-chain risks, and plan your business with grounded regional intelligence.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {strategy && (
            <>
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                title="Print or Export DPR"
              >
                <Printer className="w-4 h-4" />
                <span>Export Report</span>
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedNotification ? 'Link Copied!' : 'Share'}</span>
              </button>
            </>
          )}

          <button
            onClick={handleGenerateStrategy}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{strategy ? 'Refresh Strategy' : 'Generate Strategy'}</span>
          </button>
        </div>
      </div>

      {/* 2. Generation Loading Experience with Progressive Stepper */}
      {isGenerating && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-soft-sm space-y-6 animate-in fade-in">
          <div className="text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900">
              BUILDING YOUR HYPER-LOCAL STRATEGY
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Analyzing your location, competitor density, and unit economics without hallucinated figures...
            </p>
          </div>

          {/* Stepper Checklist */}
          <div className="max-w-lg mx-auto space-y-2.5">
            {LOADING_STEPS.map((step, idx) => {
              const isCompleted = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/80 text-emerald-900 border border-emerald-200/60'
                      : isCurrent
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0">
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 font-black" />
                    ) : isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <span className="truncate">{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Empty State (Prompting Generation) */}
      {!strategy && !isGenerating && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-soft-sm text-center max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
            <Compass className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Generate Hyper-Local Feasibility Report
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Business Compass uses your registered enterprise profile in <strong>{locationText}</strong> to analyze 5–10 km market reach, estimate local competitor clusters, calculate unit break-even points, and structure actionable next steps.
            </p>
          </div>

          {/* Quick Profile Summary Badge Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Business</span>
              <strong className="text-xs text-slate-900 truncate block">{businessName}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">District</span>
              <strong className="text-xs text-slate-900 truncate block">{profile?.personalInfo?.district || 'Not set'}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Capital</span>
              <strong className="text-xs text-slate-900 truncate block">{profile?.financialProfile?.availableCapital || 'Not set'}</strong>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Project Cost</span>
              <strong className="text-xs text-slate-900 truncate block">{profile?.financialProfile?.estimatedProjectCost || 'Not set'}</strong>
            </div>
          </div>

          <button
            onClick={handleGenerateStrategy}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Business Strategy Now</span>
          </button>
        </div>
      )}

      {/* Consult Expert Banner in Empty State */}
      {!strategy && !isGenerating && (
        <div className="max-w-4xl mx-auto">
          <ConsultExpertBanner expert={STRATEGY_EXPERT} />
        </div>
      )}

      {/* 4. Full Strategy Report Display */}
      {strategy && !isGenerating && (
        <div className="space-y-8">
          {/* Last Updated Timestamp & Parameter Tuning Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Report generated on <strong>{strategy.displayDate}</strong> for <strong>{strategy.businessProfileSnapshot.name}</strong>.
              </span>
            </div>

            <button
              onClick={() => setShowOverrides(!showOverrides)}
              className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:text-emerald-800 transition-colors self-start sm:self-auto"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showOverrides ? 'Hide Local Parameters' : 'Refine Local Parameters'}</span>
              {showOverrides ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Non-Intrusive Parameter Refinement Accordion */}
          {showOverrides && (
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft-sm space-y-4 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Fine-Tune Local Strategy Parameters</h4>
                  <p className="text-xs text-slate-500">Optional: Adjust unit price or fixed monthly rent to recalculate break-even.</p>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  Optional Inputs
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selling Price per Unit (₹)</label>
                  <input
                    type="number"
                    value={overrides.unitSellingPrice}
                    onChange={(e) => setOverrides({ ...overrides, unitSellingPrice: e.target.value })}
                    placeholder={`e.g. ₹${strategy.pricingAnalysis.unitEconomics.sellingPrice}`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Variable Cost per Unit (₹)</label>
                  <input
                    type="number"
                    value={overrides.unitVariableCost}
                    onChange={(e) => setOverrides({ ...overrides, unitVariableCost: e.target.value })}
                    placeholder={`e.g. ₹${strategy.pricingAnalysis.unitEconomics.variableCost}`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Fixed Monthly Overheads (₹)</label>
                  <input
                    type="number"
                    value={overrides.fixedMonthlyCosts}
                    onChange={(e) => setOverrides({ ...overrides, fixedMonthlyCosts: e.target.value })}
                    placeholder={`e.g. ₹${strategy.feasibility.breakEvenAnalysis.fixedMonthlyCosts}`}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleGenerateStrategy}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Recalculate Strategy</span>
                </button>
              </div>
            </div>
          )}

          {/* 1. EXECUTIVE SUMMARY & AI STRATEGIC SUMMARY */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-800/40 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">
                  EXECUTIVE SUMMARY
                </span>
                <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                  {strategy.executiveSummary.businessName}
                </h2>
                <p className="text-xs text-emerald-200/80">
                  {strategy.executiveSummary.location} • Catchment Area: {strategy.executiveSummary.marketAreaRadius}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-white/10 border border-white/15 text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Est. Investment</span>
                  <strong className="text-base font-black text-white">{strategy.executiveSummary.estimatedInvestment}</strong>
                </div>

                <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-right">
                  <span className="text-[10px] text-emerald-300 uppercase font-bold block">Feasibility Score</span>
                  <strong className="text-base font-black text-emerald-300">
                    {strategy.executiveSummary.indicativeStrategyScore} / 100
                  </strong>
                </div>
              </div>
            </div>

            {/* AI Grounded Plain-Language Strategic Summary */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>AI Strategic Synthesis ({aiSummary?.provider || 'Grounded Intelligence'})</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {aiSummary?.summaryText || 'Your strongest competitive opportunity appears to be serving nearby residential customers through direct delivery rather than competing directly with established market retailers.'}
              </p>
            </div>
          </div>

          {/* 2. FEASIBILITY SNAPSHOT & GAUGE */}
          <FeasibilityGauge feasibility={strategy.feasibility} />

          {/* 3. LOCAL MARKET REACH (5–10 KM CATCHMENT) */}
          <div className="space-y-6">
            <MarketAreaMap
              marketReach={strategy.marketReach}
              competitors={strategy.competitors}
            />

            {/* Sector-Tailored Customer Segments */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Local Customer Segment Profiles
                  </h3>
                  <p className="text-xs text-slate-500">
                    Target customer demographics calibrated specifically for {strategy.businessProfileSnapshot.name}.
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {strategy.marketReach.customerSegments.length} Segments Identified
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategy.marketReach.customerSegments.map((segment, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-slate-900">{segment.name}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {segment.shareEstimate} Share
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{segment.profile}</p>
                    <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50/60 p-2 rounded-xl border border-emerald-100">
                      <strong>Core Demand Driver:</strong> {segment.keyDemandDriver}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribution Channels */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900">
                  Recommended Distribution Channels
                </h3>
                <p className="text-xs text-slate-500">
                  Channel recommendations based on geographic distribution and margin retention.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {strategy.marketReach.distributionChannels.map((channel, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] font-black uppercase text-emerald-700">{channel.priority}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {channel.reachRadius}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{channel.channel}</h4>
                      <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">{channel.whyItWorks}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 text-[10px] font-bold text-slate-500">
                      Margin Retention: <span className="text-emerald-700">{channel.marginRetention}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 4. LOCAL OPPORTUNITY & GAP ANALYSIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Strategic Opportunity — Underserved Local Niches</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Local Market Opportunities
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {strategy.opportunities.summary}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {strategy.opportunities.opportunities.map((opp) => (
                <div key={opp.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                        {opp.classification}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Confidence: {opp.confidence.replace('_', ' ')}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">{opp.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{opp.reason}</p>
                  </div>

                  <div className="space-y-2 text-xs pt-3 border-t border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Customer</span>
                      <p className="text-slate-800 font-semibold">{opp.targetCustomer}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Potential Advantage</span>
                      <p className="text-slate-800 font-semibold">{opp.potentialAdvantage}</p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                      <strong>Uncertainty:</strong> {opp.uncertainty}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. COMPETITOR LANDSCAPE & DIFFERENTIATION */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <Store className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Competitive Landscape & Positioning</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Local Competitor Landscape
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Competition Density:</span>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {strategy.competitors.overallCompetitionLevel.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Density 5km vs 10km */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Similar Businesses (0–5 km)</span>
                <p className="text-xl font-black text-slate-900 mt-1">{strategy.competitors.competitorDensity.innerRadiusCount}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Local direct competitors within immediate neighborhood</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Estimated Similar Businesses (5–10 km)</span>
                <p className="text-xl font-black text-slate-900 mt-1">{strategy.competitors.competitorDensity.outerRadiusCount}</p>
                <span className="text-[10px] text-slate-500 mt-1 block">Extended competitors in regional mandis and town centers</span>
              </div>
            </div>

            {/* Competitor Categories Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Competitor Categories</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {strategy.competitors.competitorCategories.map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{cat.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200">{cat.share}</span>
                    </div>
                    <p className="text-[11px] text-emerald-800">
                      <strong>Strength:</strong> {cat.strength}
                    </p>
                    <p className="text-[11px] text-rose-800">
                      <strong>Weakness:</strong> {cat.weakness}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Competitive Positioning Box */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-900 uppercase tracking-wider">
                <Target className="w-4 h-4 text-emerald-600" />
                <span>Suggested Differentiation Strategy</span>
              </div>

              <blockquote className="text-base font-black text-slate-900 border-l-4 border-emerald-500 pl-3 italic">
                "{strategy.competitors.positioning.positioningHeadline}"
              </blockquote>

              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Why this works:</strong> {strategy.competitors.positioning.whyThisBeatsCompetitors}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {strategy.competitors.positioning.actionableTactics.map((tactic, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white border border-emerald-100 text-[11px] text-slate-700">
                    <span className="font-bold text-emerald-800 block mb-0.5">Tactic {idx + 1}:</span>
                    {tactic}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. PRODUCT & PRICING STRATEGY */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Economic Dynamics — Local Purchasing Power & Pricing</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Product & Pricing Strategy
                </h3>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                Indicative Guidance
              </span>
            </div>

            {/* Pricing Snapshot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Recommended Price Range</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-900 mt-1">
                  {strategy.pricingAnalysis.recommendedPriceRange.displayRange}
                </p>
                <span className="text-[11px] text-emerald-800 font-semibold block mt-1.5">
                  Suggested Target: ₹{strategy.pricingAnalysis.unitEconomics.sellingPrice} / {strategy.pricingAnalysis.unitType}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Regional Price Sensitivity</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">
                  {strategy.pricingAnalysis.purchasingPower.priceSensitivity}
                </p>
                <span className="text-[11px] text-slate-500 block mt-1.5">
                  Index: {strategy.pricingAnalysis.purchasingPower.regionalIndex.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Unit Gross Contribution</span>
                <p className="text-base font-extrabold text-slate-900 mt-1">
                  {strategy.pricingAnalysis.unitEconomics.displayGrossContribution}
                </p>
                <span className="text-[11px] text-slate-500 block mt-1.5">
                  Est. Variable Cost: {strategy.pricingAnalysis.unitEconomics.displayVariableCost}
                </span>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider">Unit Cost Allocation Estimates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {strategy.pricingAnalysis.unitEconomics.costBreakdown.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-700">{item.item}</span>
                    <strong className="text-slate-900 font-bold">{item.cost}</strong>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 italic">
              {strategy.pricingAnalysis.disclaimer}
            </p>
          </div>

          {/* 7. SWOT ANALYSIS */}
          <SwotGrid swot={strategy.swot} />

          {/* 8. LOCAL BUSINESS RISKS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Risk Assessment — Threat Identification & Mitigation</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Local Business Risks & Mitigation Plan
                </h3>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                Risk Level: {strategy.risks.overallRiskLevel.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strategy.risks.risks.map((risk) => (
                <div key={risk.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400">{risk.category}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        risk.level === 'HIGH' ? 'bg-rose-100 text-rose-900' :
                        risk.level === 'MEDIUM' ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {risk.level} RISK
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900">{risk.title}</h4>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{risk.whyItMatters}</p>

                    {risk.peakPeriod && (
                      <div className="mt-2 text-[11px] bg-slate-100 p-2 rounded-lg text-slate-700">
                        <strong>Peak Demand:</strong> {risk.peakPeriod} <br />
                        <strong>Lean Months:</strong> {risk.leanPeriod}
                      </div>
                    )}
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950">
                    <strong className="font-bold text-emerald-900 block mb-0.5">Practical Mitigation:</strong>
                    {risk.possibleMitigation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 9. FINANCIAL FEASIBILITY & BREAK-EVEN ANALYSIS */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Funding Integration — Capital Stack & Break-Even</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Financial Projections & Break-Even Analysis
                </h3>
              </div>

              <Link
                to="/funding"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>View Full Funding Planner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Financial Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Project Outlay</span>
                <p className="text-base font-black text-slate-900 mt-1">{strategy.feasibility.financialProjections.displayProjectCost}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Available Capital</span>
                <p className="text-base font-black text-emerald-700 mt-1">{strategy.feasibility.financialProjections.displayAvailableCapital}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Indicative Monthly Surplus</span>
                <p className="text-base font-black text-slate-900 mt-1">{strategy.feasibility.financialProjections.displaySurplus}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Est. Loan Obligation</span>
                <p className="text-base font-black text-slate-900 mt-1">{strategy.feasibility.financialProjections.displayLoanEmi}</p>
              </div>
            </div>

            {/* Break-Even Callout Box */}
            <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wider">
                  Break-Even Threshold Analysis
                </h4>
                <span className="text-xs font-black text-emerald-800">
                  {strategy.feasibility.breakEvenAnalysis.displayBreakEvenUnits}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">
                {strategy.feasibility.breakEvenAnalysis.statusText}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white border border-emerald-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Fixed Monthly Overheads</span>
                  <strong className="text-slate-900 text-xs">{strategy.feasibility.breakEvenAnalysis.displayFixedCosts}</strong>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Monthly Break-Even Turnover</span>
                  <strong className="text-slate-900 text-xs">{strategy.feasibility.breakEvenAnalysis.displayBreakEvenRevenue}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* 10. GOVERNMENT SCHEME MATCHES */}
          {strategy.matchedSchemes?.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <Landmark className="w-5 h-5 text-emerald-600" />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Aligned Government Schemes</h3>
                    <p className="text-xs text-slate-500">Government schemes matched from the Scheme Matcher to lower your capital burden.</p>
                  </div>
                </div>

                <Link
                  to="/schemes"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
                >
                  <span>Explore All Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {strategy.matchedSchemes.map((scheme) => (
                  <div key={scheme.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] font-black uppercase text-emerald-700">{scheme.supportType}</span>
                      <h4 className="text-xs font-extrabold text-slate-900 mt-1">{scheme.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1">{scheme.ministry}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                      <span className="text-[10px] font-bold text-slate-600">Assistance: {scheme.maxAssistance}</span>
                      <Link
                        to={`/schemes/${scheme.id}`}
                        className="text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. NEXT BEST 5 ACTIONS (CONNECTING TO ROADMAP) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Roadmap Connection — Grounded Next Steps</span>
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Your Next 5 Strategic Actions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Concrete operational actions addressing the specific gaps discovered by the feasibility engine.
                </p>
              </div>

              <Link
                to="/roadmap"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 transition-colors"
              >
                <span>Go to Business Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {strategy.nextActions.map((action) => (
                <div key={action.step} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {action.step}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900">{action.action}</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{action.description}</p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Deliverable</span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg inline-block mt-0.5">
                      {action.output}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 12. DATA SOURCES & CONFIDENCE MATRIX */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-soft-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900">
                Data Sources & Statistical Confidence
              </h3>
              <p className="text-xs text-slate-500">
                Full transparency into every external benchmark and economic survey utilized in this report.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold text-[10px] uppercase">
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Official Source</th>
                    <th className="py-2.5 px-3">Data Year</th>
                    <th className="py-2.5 px-3">Confidence</th>
                    <th className="py-2.5 px-3">Methodology</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {strategy.dataSources.map((ds, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">{ds.domain}</td>
                      <td className="py-3 px-3 text-slate-700">{ds.source}</td>
                      <td className="py-3 px-3 text-slate-600 font-semibold">{ds.dataYear}</td>
                      <td className="py-3 px-3">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          ds.confidence === 'HIGH' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {ds.confidence}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">{ds.methodology}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 13. 💼 CONSULT AN EXPERT (BUSINESS ANALYST / STRATEGY CONSULTANT) */}
          <ConsultExpertBanner expert={STRATEGY_EXPERT} />

          {/* 14. OFFICIAL TRUST & ADVISORY DISCLAIMER */}
          <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-bold mb-0.5">Statutory Planning Notice:</strong>
              {strategy.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
