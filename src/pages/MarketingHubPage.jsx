import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Compass,
  Calendar,
  Layers,
  Sparkles,
  Target,
  BarChart3,
  Bot,
  Coins,
  ExternalLink,
  ShieldCheck,
  Building2,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { useEntrepreneurProfile } from '../context/EntrepreneurProfileContext';
import { useBusiness } from '../context/BusinessContext';
import { formatRupees } from '../services/financialCalculationService';
import {
  getMonthlyMarketingBudget,
  getMarketingStore,
  saveMarketingStore,
  calculateBudgetStatus,
  getWorkingCapitalAllocations
} from '../services/marketing/marketingBudgetService';
import {
  generateMarketingStrategy,
  generate100DayRoadmap,
  calculateMarketingHealth
} from '../services/marketing/marketingEngine';

import MissingBudgetBanner from '../components/marketing/MissingBudgetBanner';
import MarketingOverview from '../components/marketing/MarketingOverview';
import MarketingStrategyView from '../components/marketing/MarketingStrategyView';
import MarketingRoadmapView from '../components/marketing/MarketingRoadmapView';
import MarketingCampaignsView from '../components/marketing/MarketingCampaignsView';
import MarketingBudgetView from '../components/marketing/MarketingBudgetView';
import MarketingContentStudio from '../components/marketing/MarketingContentStudio';
import MarketingAdsPlanner from '../components/marketing/MarketingAdsPlanner';
import MarketingAnalyticsView from '../components/marketing/MarketingAnalyticsView';
import MarketingAdvisorChat from '../components/marketing/MarketingAdvisorChat';

export default function MarketingHubPage() {
  const { profile } = useEntrepreneurProfile();
  const { activeBusiness, activeBusinessId } = useBusiness();

  // Active company profile is the single source of truth
  const currentEnterprise = activeBusiness || profile;
  const companyId = activeBusinessId || currentEnterprise?.id || 'default_enterprise';
  const companyName = currentEnterprise?.business?.name || currentEnterprise?.name || 'My Enterprise';

  // Reactive sync state for immediate cross-tab or cross-component working capital updates
  const [wcVersion, setWcVersion] = useState(0);

  useEffect(() => {
    const handleWcUpdate = () => {
      setWcVersion((v) => v + 1);
    };
    window.addEventListener('udyamsathi_wc_updated', handleWcUpdate);
    window.addEventListener('storage', handleWcUpdate);
    return () => {
      window.removeEventListener('udyamsathi_wc_updated', handleWcUpdate);
      window.removeEventListener('storage', handleWcUpdate);
    };
  }, []);

  // Single source of truth budget derived strictly from Working Capital in Funding Panel
  const monthlyMarketingBudget = useMemo(() => {
    return getMonthlyMarketingBudget(currentEnterprise);
  }, [currentEnterprise, wcVersion]);

  // Scoped multi-company marketing store
  const [marketingStore, setMarketingStore] = useState(() => {
    return getMarketingStore(companyId, monthlyMarketingBudget);
  });

  // Reload store when active company changes
  useEffect(() => {
    const store = getMarketingStore(companyId, monthlyMarketingBudget);
    setMarketingStore(store);
  }, [companyId, monthlyMarketingBudget]);

  const [activeTab, setActiveTab] = useState('overview');

  // Compute live budget status & validation
  const budgetStatus = useMemo(() => {
    return calculateBudgetStatus(monthlyMarketingBudget, marketingStore.campaigns);
  }, [monthlyMarketingBudget, marketingStore.campaigns]);

  // Compute marketing health score
  const marketingHealth = useMemo(() => {
    return calculateMarketingHealth(
      currentEnterprise,
      budgetStatus,
      marketingStore.campaigns,
      marketingStore.roadmapTaskStatuses
    );
  }, [currentEnterprise, budgetStatus, marketingStore.campaigns, marketingStore.roadmapTaskStatuses]);

  // Compute live strategy
  const strategy = useMemo(() => {
    return generateMarketingStrategy(currentEnterprise, monthlyMarketingBudget);
  }, [currentEnterprise, monthlyMarketingBudget]);

  // Compute live roadmap
  const roadmap = useMemo(() => {
    return generate100DayRoadmap(currentEnterprise, monthlyMarketingBudget);
  }, [currentEnterprise, monthlyMarketingBudget]);

  // Handlers for store persistence
  const handleCreateCampaign = (newCampaign) => {
    const updated = {
      ...marketingStore,
      campaigns: [newCampaign, ...marketingStore.campaigns]
    };
    setMarketingStore(updated);
    saveMarketingStore(companyId, updated);
  };

  const handleDeleteCampaign = (campaignId) => {
    const updated = {
      ...marketingStore,
      campaigns: marketingStore.campaigns.filter((c) => c.id !== campaignId)
    };
    setMarketingStore(updated);
    saveMarketingStore(companyId, updated);
  };

  const handleCampaignStatusChange = (campaignId, nextStatus) => {
    const updated = {
      ...marketingStore,
      campaigns: marketingStore.campaigns.map((c) =>
        c.id === campaignId ? { ...c, status: nextStatus } : c
      )
    };
    setMarketingStore(updated);
    saveMarketingStore(companyId, updated);
  };

  const handleToggleTaskStatus = (taskId, newStatus) => {
    const updatedStatuses = {
      ...marketingStore.roadmapTaskStatuses,
      [taskId]: newStatus
    };
    const updated = {
      ...marketingStore,
      roadmapTaskStatuses: updatedStatuses
    };
    setMarketingStore(updated);
    saveMarketingStore(companyId, updated);
  };

  const handleAdoptAdPlan = (adPlan) => {
    const maxBudget = Math.min(adPlan.totalCost, budgetStatus.remainingBudget);
    if (maxBudget <= 0) return;

    const newCampaign = {
      id: `cmp_${Date.now()}`,
      name: `${adPlan.platform.split(' ')[0]} - ${adPlan.objective}`,
      objective: adPlan.objective,
      targetAudience: adPlan.targetAudience,
      durationDays: 20,
      budget: maxBudget,
      spent: 0,
      status: 'ACTIVE',
      channels: [adPlan.platform],
      offer: 'Introductory Customer Offer',
      keyMessage: adPlan.creativeType,
      cta: 'Contact on WhatsApp',
      createdAt: new Date().toISOString(),
      metrics: { impressions: 0, clicks: 0, leads: 0, conversions: 0, cac: 0, revenueGenerated: 0 }
    };

    handleCreateCampaign(newCampaign);
    setActiveTab('campaigns');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'strategy', label: 'AI Strategy', icon: Compass },
    { id: 'roadmap', label: '100-Day Roadmap', icon: Calendar },
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone, count: marketingStore.campaigns.length },
    { id: 'content', label: 'Content Studio', icon: Sparkles },
    { id: 'ads', label: 'Ad Planner', icon: Target },
    { id: 'budget', label: 'Budget', icon: Coins },
    { id: 'analytics', label: 'Analytics', icon: Layers },
    { id: 'advisor', label: 'AI Advisor', icon: Bot, isAi: true }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200 pb-12">
      
      {/* 1. Page Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2">
            <Megaphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI-Powered Customer Growth & Strategy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Marketing Hub
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            From zero marketing knowledge to complete strategy, campaign execution, and local customer acquisition for <strong>{companyName}</strong>.
          </p>
        </div>

        {/* Dynamic Working Capital Budget Indicator */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left shrink-0 space-y-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Monthly Marketing Budget
            </span>
            <Link
              to="/funding#working-capital"
              className="text-[10px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-0.5"
              title="Edit in Funding Panel"
            >
              <span>Edit</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </Link>
          </div>

          <strong className="text-xl font-black text-slate-900 block">
            {formatRupees(monthlyMarketingBudget)}
            <span className="text-xs text-slate-400 font-normal"> / mo</span>
          </strong>

          <span className="text-[10px] text-emerald-800 font-semibold block">
            from Working Capital
          </span>
        </div>
      </div>

      {/* 2. Missing Budget Callout (Section 3: If marketing allocation is ₹0) */}
      {monthlyMarketingBudget === 0 && (
        <MissingBudgetBanner />
      )}

      {/* 3. Tab Navigation Bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
              {tab.isAi && (
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white text-[9px] font-black uppercase">
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Views Content */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <MarketingOverview
            profile={currentEnterprise}
            strategy={strategy}
            budgetStatus={budgetStatus}
            marketingHealth={marketingHealth}
            campaigns={marketingStore.campaigns}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'strategy' && (
          <MarketingStrategyView
            strategy={strategy}
            budgetStatus={budgetStatus}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'roadmap' && (
          <MarketingRoadmapView
            roadmap={roadmap}
            taskStatuses={marketingStore.roadmapTaskStatuses}
            onToggleTaskStatus={handleToggleTaskStatus}
          />
        )}

        {activeTab === 'campaigns' && (
          <MarketingCampaignsView
            profile={currentEnterprise}
            campaigns={marketingStore.campaigns}
            budgetStatus={budgetStatus}
            onCreateCampaign={handleCreateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onStatusChange={handleCampaignStatusChange}
          />
        )}

        {activeTab === 'content' && (
          <MarketingContentStudio
            profile={currentEnterprise}
          />
        )}

        {activeTab === 'ads' && (
          <MarketingAdsPlanner
            profile={currentEnterprise}
            monthlyBudget={monthlyMarketingBudget}
            onLaunchAdPlan={handleAdoptAdPlan}
          />
        )}

        {activeTab === 'budget' && (
          <MarketingBudgetView
            budgetStatus={budgetStatus}
            allocations={strategy.allocations}
            workingCapitalAllocations={getWorkingCapitalAllocations(currentEnterprise)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'analytics' && (
          <MarketingAnalyticsView
            campaigns={marketingStore.campaigns}
            experiments={marketingStore.experiments}
          />
        )}

        {activeTab === 'advisor' && (
          <MarketingAdvisorChat
            profile={currentEnterprise}
            strategy={strategy}
            budgetStatus={budgetStatus}
            campaigns={marketingStore.campaigns}
          />
        )}
      </div>

    </div>
  );
}
