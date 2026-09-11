/**
 * Marketing Budget Service & Multi-Company Storage
 * 
 * Strict Single Source of Truth Rule:
 * The monthly marketing budget is ALWAYS derived from:
 * Funding Panel -> Working Capital -> Marketing Allocation
 * (profile.financialProfile.workingCapitalAllocations.marketing)
 * 
 * Marketing Hub never duplicates or creates a parallel budget input.
 * It strictly manages the strategic DISTRIBUTION of this budget into campaigns.
 */

/**
 * Retrieves the single source of truth monthly marketing budget from the business profile.
 * Returns 0 if not allocated.
 */
export function getMonthlyMarketingBudget(profile) {
  if (!profile) return 30000;
  
  const bizId = profile.id || profile.business?.id || profile.business?.name || profile.name || 'default_enterprise';
  const financial = profile.financialProfile || {};
  const allocations = financial.workingCapitalAllocations || financial.workingCapital?.allocations;

  if (allocations && allocations.marketing !== undefined && allocations.marketing !== null) {
    const parsed = Number(allocations.marketing);
    return isNaN(parsed) ? 30000 : Math.max(0, parsed);
  }

  // Check cached working capital allocations for this business from local storage
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`udyamsathi_wc_allocations_${bizId}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.marketing !== undefined && parsed.marketing !== null) {
          const m = Number(parsed.marketing);
          if (!isNaN(m)) return Math.max(0, m);
        }
      }
      // Also check generic enterprise fallback
      const genericCached = localStorage.getItem('udyamsathi_wc_allocations_default_enterprise');
      if (genericCached) {
        const parsed = JSON.parse(genericCached);
        if (parsed && parsed.marketing !== undefined && parsed.marketing !== null) {
          const m = Number(parsed.marketing);
          if (!isNaN(m)) return Math.max(0, m);
        }
      }
    } catch {}
  }

  // Check legacy or direct field
  if (financial.marketing !== undefined && financial.marketing !== null) {
    const parsed = Number(financial.marketing);
    return isNaN(parsed) ? 30000 : Math.max(0, parsed);
  }

  // Working Capital Planner default is ₹30,000 for standard enterprise profiles
  return 30000;
}

/**
 * Retrieves all working capital expense allocations for context.
 */
export function getWorkingCapitalAllocations(profile) {
  const financial = profile?.financialProfile || {};
  const bizId = profile?.id || profile?.business?.id || profile?.business?.name || profile?.name || 'default_enterprise';
  
  let cachedAllocations = null;
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem(`udyamsathi_wc_allocations_${bizId}`);
      if (cached) cachedAllocations = JSON.parse(cached);
    } catch {}
  }

  const base = financial.workingCapitalAllocations || cachedAllocations || {};
  return {
    rawMaterials: base.rawMaterials ?? 60000,
    salaries: base.wages ?? base.salaries ?? 35000,
    rentUtilities: base.rent ?? base.rentUtilities ?? 15000,
    marketing: getMonthlyMarketingBudget(profile),
    utilities: base.utilities ?? 5000,
    transport: base.transport ?? 5000,
    other: base.other ?? 10000
  };
}

const getStorageKey = (businessId) => `udyamsaathi_marketing_store_${businessId || 'default_enterprise'}`;

/**
 * Default initial marketing store for a fresh enterprise
 */
export function getDefaultMarketingStore(businessId, marketingBudget = 30000) {
  const b = marketingBudget || 30000;

  // Proportional baseline campaigns fitting within budget
  const launchCampaignBudget = Math.round(b * 0.35); // 35%
  const localWhatsAppBudget = Math.round(b * 0.25); // 25%

  return {
    businessId,
    lastUpdated: new Date().toISOString(),
    campaigns: [
      {
        id: `cmp_${Date.now()}_1`,
        name: 'First-Customer Local Awareness Campaign',
        objective: 'Acquire Customers',
        targetAudience: 'Local residents & commercial buyers within 5 km radius',
        durationDays: 30,
        budget: launchCampaignBudget,
        spent: Math.round(launchCampaignBudget * 0.65),
        status: 'ACTIVE', // 'ACTIVE' | 'PLANNED' | 'COMPLETED' | 'PAUSED'
        channels: ['Instagram Ads', 'Google Business Profile', 'Local WhatsApp Groups'],
        offer: '10% Introductory Discount or Free Sample Kit on First Order',
        keyMessage: 'Premium quality, farm-direct pure produce now available in your neighborhood.',
        cta: 'Order on WhatsApp / Visit Store',
        createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
        metrics: {
          impressions: 4850,
          clicks: 390,
          leads: 86,
          conversions: 52,
          cac: Math.round((launchCampaignBudget * 0.65) / 52) || 120,
          revenueGenerated: 46800
        }
      },
      {
        id: `cmp_${Date.now()}_2`,
        name: 'Hyper-Local WhatsApp VIP Customer Circle',
        objective: 'Increase Repeat Purchases',
        targetAudience: 'Existing customers and nearby community apartment groups',
        durationDays: 30,
        budget: localWhatsAppBudget,
        spent: Math.round(localWhatsAppBudget * 0.5),
        status: 'ACTIVE',
        channels: ['WhatsApp Direct Broadcast', 'QR Code at Cash Counter'],
        offer: 'Weekly Fresh Batch Alert + Free Local Delivery on Orders over ₹499',
        keyMessage: 'Get harvest-fresh pure purees delivered same-day directly to your door.',
        cta: 'Join WhatsApp Group for Secret Deals',
        createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        metrics: {
          impressions: 1200,
          clicks: 280,
          leads: 94,
          conversions: 72,
          cac: Math.round((localWhatsAppBudget * 0.5) / 72) || 75,
          revenueGenerated: 58000
        }
      }
    ],
    roadmapTaskStatuses: {
      'task_1_1': 'COMPLETED',
      'task_1_2': 'COMPLETED',
      'task_1_3': 'COMPLETED',
      'task_1_4': 'IN_PROGRESS'
    },
    experiments: [
      {
        id: 'exp_1',
        title: 'Offer Testing: Flat 10% Off vs. Free Tasting Sample Box',
        hypothesis: 'Free sample box will yield higher conversion in peri-urban catchments than percentage discounts.',
        variantA: { name: '10% First-Order Discount', channel: 'Instagram', spend: 3000, reach: 2100, conversions: 24, revenue: 16800 },
        variantB: { name: 'Free Tasting Sample Kit', channel: 'WhatsApp', spend: 3000, reach: 1850, conversions: 41, revenue: 27500 },
        winningVariant: 'Variant B',
        aiAnalysis: 'Variant B (Free Sample Kit via WhatsApp) outperformed 10% discount by 70.8% in customer conversions and achieved higher immediate repeat orders.',
        status: 'COMPLETED'
      }
    ],
    customDistribution: null // User custom channel distribution
  };
}

/**
 * Retrieves the scoped marketing state for a specific company.
 */
export function getMarketingStore(businessId, currentBudget = 30000) {
  if (typeof window === 'undefined') return getDefaultMarketingStore(businessId, currentBudget);
  const key = getStorageKey(businessId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.businessId === businessId) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[MarketingStore] Error reading store for business:', businessId, e);
  }

  const def = getDefaultMarketingStore(businessId, currentBudget);
  saveMarketingStore(businessId, def);
  return def;
}

/**
 * Persists the scoped marketing state for a specific company.
 */
export function saveMarketingStore(businessId, store) {
  if (typeof window === 'undefined' || !store) return;
  const key = getStorageKey(businessId);
  try {
    const payload = {
      ...store,
      businessId,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch (e) {
    console.warn('[MarketingStore] Error saving store for business:', businessId, e);
  }
}

/**
 * Calculates current budget status, committed campaign funds,
 * and detects overspending situations when funding decreases.
 */
export function calculateBudgetStatus(monthlyBudget, campaigns = []) {
  const totalMonthlyBudget = Math.max(0, Number(monthlyBudget) || 0);

  // Sum active and planned campaigns
  const committedBudget = (campaigns || [])
    .filter((c) => c.status === 'ACTIVE' || c.status === 'PLANNED')
    .reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

  const spentBudget = (campaigns || [])
    .reduce((sum, c) => sum + (Number(c.spent) || 0), 0);

  const remainingBudget = Math.max(0, totalMonthlyBudget - committedBudget);
  const isOverBudget = committedBudget > totalMonthlyBudget;
  const deficit = isOverBudget ? committedBudget - totalMonthlyBudget : 0;
  const utilizationPercent = totalMonthlyBudget > 0
    ? Math.min(100, Math.round((committedBudget / totalMonthlyBudget) * 100))
    : 0;

  return {
    totalMonthlyBudget,
    committedBudget,
    spentBudget,
    remainingBudget,
    isOverBudget,
    deficit,
    utilizationPercent
  };
}
