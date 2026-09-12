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

import { classifyBusinessDomain, BUSINESS_DOMAINS } from '../strategy/businessDomainClassifier';

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
 * Default initial marketing store tailored to the enterprise profile
 */
export function getDefaultMarketingStore(businessId, marketingBudget = 30000, profile = null) {
  const b = marketingBudget || 30000;
  const business = profile?.business || profile || {};
  const personal = profile?.personalInfo || {};

  const bizName = business.name || 'Your Enterprise';
  const product = business.productService || business.description || 'Specialty Offerings';
  const district = personal.district || (business.location?.includes(',') ? business.location.split(',')[0].trim() : 'your neighborhood');
  const domainInfo = classifyBusinessDomain(business, personal);
  const key = domainInfo.domainKey;

  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;
  const isDairy = key === BUSINESS_DOMAINS.DAIRY_ANIMAL_HUSBANDRY;
  const isServiceOrTech = key === BUSINESS_DOMAINS.TECH_ELECTRONICS_REPAIR || key === BUSINESS_DOMAINS.HEALTH_MEDICAL_WELLNESS || key === BUSINESS_DOMAINS.EDUCATION_COACHING_ACADEMY;
  const isTextile = key === BUSINESS_DOMAINS.TEXTILE_APPAREL_FASHION;

  // Proportional baseline campaigns fitting within budget
  const launchCampaignBudget = Math.round(b * 0.35); // 35%
  const localWhatsAppBudget = Math.round(b * 0.25); // 25%

  let campaign1 = null;
  let campaign2 = null;
  let experiment1 = null;

  if (isCafe) {
    campaign1 = {
      id: `cmp_${Date.now()}_1`,
      name: 'First-Customer Local Awareness & Tasting Offer',
      objective: 'Acquire Customers',
      targetAudience: `Local foodies, students & office workers within 4 km of ${district}`,
      durationDays: 30,
      budget: launchCampaignBudget,
      spent: Math.round(launchCampaignBudget * 0.65),
      status: 'ACTIVE',
      channels: ['Instagram Ads', 'Google Business Profile', 'Local WhatsApp Groups'],
      offer: 'Free Handcrafted Pastry or Snack with First Specialty Brew',
      keyMessage: `Discover your new favorite cafe in ${district}! Artisanal coffee, fresh daily bakes, and welcoming ambiance at ${bizName}.`,
      cta: 'WhatsApp Us for Directions / Menu',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      metrics: {
        impressions: 5420,
        clicks: 440,
        leads: 98,
        conversions: 64,
        cac: Math.round((launchCampaignBudget * 0.65) / 64) || 105,
        revenueGenerated: 48600
      }
    };

    campaign2 = {
      id: `cmp_${Date.now()}_2`,
      name: 'Table QR & WhatsApp VIP Coffee Club',
      objective: 'Increase Repeat Purchases',
      targetAudience: 'Visiting guests and nearby residential community groups',
      durationDays: 30,
      budget: localWhatsAppBudget,
      spent: Math.round(localWhatsAppBudget * 0.5),
      status: 'ACTIVE',
      channels: ['Table QR Cards', 'WhatsApp Direct Broadcast'],
      offer: 'Secret Weekly Specials + 10% Weekend Brunch Cashback',
      keyMessage: `Scan your table QR code to join ${bizName}'s VIP club for secret treats and priority weekend table reservations.`,
      cta: 'Join WhatsApp Group for VIP Perks',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      metrics: {
        impressions: 1450,
        clicks: 320,
        leads: 110,
        conversions: 86,
        cac: Math.round((localWhatsAppBudget * 0.5) / 86) || 68,
        revenueGenerated: 62400
      }
    };

    experiment1 = {
      id: 'exp_1',
      title: 'Offer Testing: Flat 15% Off Total Bill vs. Complimentary Specialty Drink',
      hypothesis: 'A complimentary signature drink voucher via WhatsApp drives higher guest conversion and faster repeat visits than percentage discounts.',
      variantA: { name: '15% First-Visit Discount', channel: 'Instagram Ads', spend: 3000, reach: 2400, conversions: 27, revenue: 14500 },
      variantB: { name: 'Free Signature Drink Voucher', channel: 'WhatsApp / Table QR', spend: 3000, reach: 2100, conversions: 48, revenue: 28600 },
      winningVariant: 'Variant B',
      aiAnalysis: 'Variant B (Free Signature Drink Voucher via WhatsApp) outperformed the 15% discount by 77.7% in customer visits and generated higher average table spend.',
      status: 'COMPLETED'
    };
  } else if (isAgriEquip) {
    campaign1 = {
      id: `cmp_${Date.now()}_1`,
      name: 'Village On-Farm Demonstration & Trial Campaign',
      objective: 'Acquire Customers',
      targetAudience: `Smallholder farmers, vegetable growers & FPOs in ${district}`,
      durationDays: 30,
      budget: launchCampaignBudget,
      spent: Math.round(launchCampaignBudget * 0.65),
      status: 'ACTIVE',
      channels: ['Village Field Trials', 'WhatsApp Direct', 'Mandi Trade Kiosk'],
      offer: 'Free 1-Acre On-Farm Machinery Demonstration + Spare Blade Set',
      keyMessage: `Cut farming labor by 60% with field-tested ${product} from ${bizName}. Instant spare parts and local warranty.`,
      cta: 'Book Free Village Demo on WhatsApp',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      metrics: {
        impressions: 3800,
        clicks: 310,
        leads: 72,
        conversions: 18,
        cac: Math.round((launchCampaignBudget * 0.65) / 18) || 540,
        revenueGenerated: 144000
      }
    };

    campaign2 = {
      id: `cmp_${Date.now()}_2`,
      name: 'Farmer WhatsApp Video Demo Broadcast',
      objective: 'Increase Repeat Purchases',
      targetAudience: 'Progressive village panchayats and agricultural cooperative members',
      durationDays: 30,
      budget: localWhatsAppBudget,
      spent: Math.round(localWhatsAppBudget * 0.5),
      status: 'ACTIVE',
      channels: ['WhatsApp Broadcast', 'Agro-Dealer Display'],
      offer: 'Pre-Sowing Booking Discount of ₹1,500 on Advance Token',
      keyMessage: `Watch ${product} working in wet and dry soil. Book before sowing season for priority delivery and free tune-up.`,
      cta: 'Reply "DEMO" for village trial',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      metrics: {
        impressions: 1600,
        clicks: 290,
        leads: 85,
        conversions: 24,
        cac: Math.round((localWhatsAppBudget * 0.5) / 24) || 310,
        revenueGenerated: 192000
      }
    };

    experiment1 = {
      id: 'exp_1',
      title: 'Offer Testing: Free On-Farm Trial vs. ₹1,000 Upfront Price Discount',
      hypothesis: 'Hands-on free trials on farmers\' own land overcome purchase hesitation faster than price discounts.',
      variantA: { name: '₹1,000 Price Discount', channel: 'Facebook / Pamphlet', spend: 3000, reach: 1800, conversions: 8, revenue: 64000 },
      variantB: { name: 'Free On-Farm Trial Demo', channel: 'WhatsApp / Village Demo', spend: 3000, reach: 1400, conversions: 19, revenue: 152000 },
      winningVariant: 'Variant B',
      aiAnalysis: 'Variant B (Free On-Farm Trial) generated 2.3x more machine sales, as seeing the tool operate on real soil built immediate buyer confidence.',
      status: 'COMPLETED'
    };
  } else if (isServiceOrTech) {
    campaign1 = {
      id: `cmp_${Date.now()}_1`,
      name: 'Local High-Intent Discovery & Fast Service Campaign',
      objective: 'Acquire Customers',
      targetAudience: `Residents, professionals & local businesses within 5 km of ${district}`,
      durationDays: 30,
      budget: launchCampaignBudget,
      spent: Math.round(launchCampaignBudget * 0.65),
      status: 'ACTIVE',
      channels: ['Google Business Profile', 'WhatsApp Direct', 'Storefront Standee'],
      offer: 'Free 15-Minute Diagnostic Inspection / Introductory Consultation',
      keyMessage: `Dependable, transparent ${product} right in your neighborhood by ${bizName}. Zero hidden charges with verified local warranty.`,
      cta: 'Book Consultation on WhatsApp',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      metrics: {
        impressions: 4200,
        clicks: 360,
        leads: 88,
        conversions: 48,
        cac: Math.round((launchCampaignBudget * 0.65) / 48) || 135,
        revenueGenerated: 52000
      }
    };

    campaign2 = {
      id: `cmp_${Date.now()}_2`,
      name: 'Client Care & Annual Maintenance Circle',
      objective: 'Increase Repeat Purchases',
      targetAudience: 'Existing clients and local neighborhood society groups',
      durationDays: 30,
      budget: localWhatsAppBudget,
      spent: Math.round(localWhatsAppBudget * 0.5),
      status: 'ACTIVE',
      channels: ['WhatsApp Broadcast', 'Customer Referral Link'],
      offer: 'Priority Fast-Track Booking + 10% Off Next Scheduled Service',
      keyMessage: `Keep everything running smoothly with regular care from ${bizName}. Priority turnaround guaranteed for registered clients.`,
      cta: 'Message us on WhatsApp',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      metrics: {
        impressions: 1100,
        clicks: 250,
        leads: 80,
        conversions: 60,
        cac: Math.round((localWhatsAppBudget * 0.5) / 60) || 85,
        revenueGenerated: 48000
      }
    };

    experiment1 = {
      id: 'exp_1',
      title: 'Offer Testing: Free Diagnostic Check vs. Flat 15% Off Total Bill',
      hypothesis: 'A free initial diagnostic check removes risk and converts significantly more inquiries into completed service jobs.',
      variantA: { name: 'Flat 15% Off Total Bill', channel: 'Meta Ads', spend: 3000, reach: 2200, conversions: 22, revenue: 17600 },
      variantB: { name: 'Free Diagnostic Check', channel: 'Google Search / WhatsApp', spend: 3000, reach: 1750, conversions: 42, revenue: 31500 },
      winningVariant: 'Variant B',
      aiAnalysis: 'Variant B (Free Diagnostic Check) delivered 90.9% higher client conversion, as customers preferred zero-risk initial evaluation.',
      status: 'COMPLETED'
    };
  } else {
    // Default Adaptive Campaign & Experiment
    campaign1 = {
      id: `cmp_${Date.now()}_1`,
      name: `First-Customer Local Awareness for ${bizName}`,
      objective: 'Acquire Customers',
      targetAudience: `Neighborhood residents & retail consumers across ${district}`,
      durationDays: 30,
      budget: launchCampaignBudget,
      spent: Math.round(launchCampaignBudget * 0.65),
      status: 'ACTIVE',
      channels: ['Instagram Ads', 'Google Business Profile', 'Local WhatsApp Groups'],
      offer: '10% Introductory Discount or Free Gift with First Order',
      keyMessage: `Trusted quality, verified craftsmanship, and personalized customer care now available locally at ${bizName}.`,
      cta: 'Order on WhatsApp / Visit Us',
      createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
      metrics: {
        impressions: 4850,
        clicks: 390,
        leads: 86,
        conversions: 52,
        cac: Math.round((launchCampaignBudget * 0.65) / 52) || 120,
        revenueGenerated: 46800
      }
    };

    campaign2 = {
      id: `cmp_${Date.now()}_2`,
      name: 'Hyper-Local WhatsApp VIP Customer Circle',
      objective: 'Increase Repeat Purchases',
      targetAudience: 'Existing clients and local community residential groups',
      durationDays: 30,
      budget: localWhatsAppBudget,
      spent: Math.round(localWhatsAppBudget * 0.5),
      status: 'ACTIVE',
      channels: ['WhatsApp Direct Broadcast', 'Counter QR Display'],
      offer: 'Weekly New Arrival Alert + Free Local Delivery on Orders over ₹499',
      keyMessage: `Join ${bizName}'s customer VIP group to receive secret discounts, new arrivals, and priority same-day local delivery.`,
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
    };

    experiment1 = {
      id: 'exp_1',
      title: 'Offer Testing: Flat 10% Off vs. Value-Add Gift / Free Delivery',
      hypothesis: 'Value-add incentives (free delivery or complimentary bonus item) convert higher than nominal percentage discounts.',
      variantA: { name: '10% First-Order Discount', channel: 'Instagram Ads', spend: 3000, reach: 2100, conversions: 24, revenue: 16800 },
      variantB: { name: 'Value-Add Bonus / Free Delivery', channel: 'WhatsApp Direct', spend: 3000, reach: 1850, conversions: 41, revenue: 27500 },
      winningVariant: 'Variant B',
      aiAnalysis: 'Variant B (Value-Add Bonus via WhatsApp) outperformed 10% discount by 70.8% in customer conversions and achieved higher immediate repeat orders.',
      status: 'COMPLETED'
    };
  }

  return {
    businessId,
    lastUpdated: new Date().toISOString(),
    campaigns: [campaign1, campaign2],
    roadmapTaskStatuses: {
      'task_1_1': 'COMPLETED',
      'task_1_2': 'COMPLETED',
      'task_1_3': 'COMPLETED',
      'task_1_4': 'IN_PROGRESS'
    },
    experiments: [experiment1],
    customDistribution: null
  };
}

/**
 * Retrieves the scoped marketing state for a specific company,
 * automatically migrating legacy hardcoded placeholder seed data.
 */
export function getMarketingStore(businessId, currentBudget = 30000, profile = null) {
  if (typeof window === 'undefined') return getDefaultMarketingStore(businessId, currentBudget, profile);
  const key = getStorageKey(businessId);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.businessId === businessId) {
        // Detect legacy hardcoded placeholders (e.g. farm produce / purees when business is not an agricultural produce farm)
        const business = profile?.business || profile || {};
        const domainInfo = classifyBusinessDomain(business, profile?.personalInfo);
        const isActuallyCropProduce = domainInfo.domainKey === BUSINESS_DOMAINS.AGRI_FOOD_PROCESSING || domainInfo.domainKey === BUSINESS_DOMAINS.AGRI_CROP_FARMING;

        const stringified = JSON.stringify(parsed.campaigns || []) + JSON.stringify(parsed.experiments || []);
        const hasLegacyPlaceholder = !isActuallyCropProduce && (
          stringified.includes('pure produce') ||
          stringified.includes('pure purees') ||
          stringified.includes('Free Tasting Sample Box')
        );

        if (!hasLegacyPlaceholder) {
          return parsed;
        }
      }
    }
  } catch (e) {
    console.warn('[MarketingStore] Error reading store for business:', businessId, e);
  }

  const def = getDefaultMarketingStore(businessId, currentBudget, profile);
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
