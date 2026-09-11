/**
 * Master Business Strategy Engine
 * Orchestrates:
 * - Entrepreneur Profile Snapshot
 * - Business Domain Classifier (Accurately reflects company description & trade)
 * - Market Reach (Geographic Catchment)
 * - Opportunity Analysis (Unserved Niches)
 * - SWOT Analysis (Contextual Matrix)
 * - Risk & Threat Identification (Mitigation Plan)
 * - Competitor Mapping & Positioning
 * - Product Value & Pricing Strategy
 * - Financial Feasibility & Unit Economics
 * - Government Scheme Matcher Integration
 * - Next Best Actions (Connecting to Roadmap)
 * - Data Sources & Confidence Matrix
 */

import { classifyBusinessDomain, BUSINESS_DOMAINS } from './businessDomainClassifier';
import { analyzeMarketReach } from './marketReachService';
import { analyzeLocalOpportunities } from './opportunityAnalysisService';
import { analyzeCompetitors } from './competitorAnalysisService';
import { analyzeProductPricing } from './pricingAnalysisService';
import { analyzeLocalRisks } from './riskAnalysisService';
import { analyzeSwot } from './swotAnalysisService';
import { evaluateFeasibility } from './feasibilityService';
import { GOVERNMENT_SCHEMES } from '../../data/schemesData';
import { evaluateSchemeEligibility } from '../eligibilityEngine';

export async function generateBusinessStrategy(profile, localOverrides = {}) {
  const business = {
    ...(profile || {}),
    ...(profile?.business || {})
  };
  const personal = profile?.personalInfo || {};
  const finances = profile?.financialProfile || {};

  // 1. Identify True Business Domain
  const domainInfo = classifyBusinessDomain(business, personal);

  // 2. Analytical Engine Runs
  const marketReach = analyzeMarketReach(profile, localOverrides);
  const opportunities = analyzeLocalOpportunities(profile, marketReach);
  const competitors = analyzeCompetitors(profile, localOverrides);
  const pricingAnalysis = analyzeProductPricing(profile, localOverrides);
  const risks = analyzeLocalRisks(profile, localOverrides);
  const swot = analyzeSwot(profile, marketReach, opportunities, risks);
  const feasibility = evaluateFeasibility(profile, pricingAnalysis, localOverrides);

  // 3. Scheme Matcher Integration
  // Filter top schemes with sector and manufacturing/engineering awareness
  const matchedSchemes = GOVERNMENT_SCHEMES
    .map(scheme => {
      const evalResult = evaluateSchemeEligibility(profile, scheme);
      return {
        id: scheme.id,
        name: scheme.name,
        shortName: scheme.shortName,
        ministry: scheme.ministry || scheme.department,
        supportType: scheme.supportType,
        maxAssistance: scheme.maxAssistance,
        status: evalResult.status,
        matchedPillars: evalResult.matchedPillars
      };
    })
    .filter(s => s.status === 'ELIGIBLE' || s.status === 'POTENTIALLY_ELIGIBLE')
    .slice(0, 3);

  // 4. Strategic Recommendations
  const recommendations = generateStrategicRecommendations(domainInfo, business, marketReach, competitors, pricingAnalysis, risks, finances);

  // 5. Next Best Actions (Top 5 practical actions based on discovered gaps)
  const nextActions = generateNextBestActions(domainInfo, business, competitors, pricingAnalysis, risks, matchedSchemes);

  // 6. Data Sources & Confidence Table
  const dataSources = [
    {
      domain: 'Local Demographics & Market Catchment',
      source: marketReach.source,
      dataYear: marketReach.dataYear,
      confidence: marketReach.confidence,
      methodology: 'District statistical yearbook projections & NSSO 79th Round sample distribution.'
    },
    {
      domain: 'Competitor Density & Categories',
      source: competitors.source,
      dataYear: 2024,
      confidence: competitors.confidence,
      methodology: 'District MSME cluster benchmarks and machinery trade registry ratios.'
    },
    {
      domain: 'Purchasing Power & Indicative Pricing',
      source: pricingAnalysis.source,
      dataYear: pricingAnalysis.dataYear,
      confidence: pricingAnalysis.confidence,
      methodology: 'Prevailing manufacturing input costs and agricultural machinery price indices.'
    },
    {
      domain: 'Government Scheme Eligibility Rules',
      source: 'Official Ministry Operational Guidelines (MSME, MoA&FW, MoFPI, SIDBI)',
      dataYear: 2025,
      confidence: 'HIGH',
      methodology: 'Deterministic parameter matching against gazetted scheme notifications.'
    }
  ];

  // 7. Structured Business Strategy Object
  const strategy = {
    id: `strategy_${Date.now()}`,
    userId: profile?.userId || 'user_demo',
    generatedAt: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
    
    // Business Profile Snapshot
    businessProfileSnapshot: {
      name: business.name || 'Your Enterprise',
      sector: business.sector || domainInfo.tradeCategory,
      type: business.type || 'Proprietorship',
      stage: business.stage || 'PLANNING',
      location: `${personal.district || 'District'}, ${personal.state || 'State'}`,
      isRural: (personal.ruralUrban || '').toUpperCase() === 'RURAL',
      targetCustomerText: business.targetCustomers || domainInfo.primaryTargetAudience,
      domainTitle: domainInfo.domainTitle,
      domainKey: domainInfo.domainKey
    },

    // Executive Summary
    executiveSummary: {
      businessName: business.name || 'Your Enterprise',
      location: `${personal.district || 'District'}, ${personal.state || 'State'}`,
      domainTitle: domainInfo.domainTitle,
      estimatedInvestment: finances.estimatedProjectCost || (domainInfo.isMachinery ? '₹12,00,000' : '₹5,00,000'),
      marketAreaRadius: '5–10 km Catchment',
      overallOutlook: feasibility.snapshot.overallOutlook,
      outlookReason: feasibility.snapshot.outlookReason,
      indicativeStrategyScore: feasibility.strategyScore.score,
      keyAdvantage: competitors.positioning.coreAdvantage
    },

    // Core Strategy Datasets
    marketReach,
    opportunities,
    competitors,
    pricingAnalysis,
    swot,
    risks,

    // Feasibility & Financial Projections
    feasibility,

    // Integrated Ecosystem Connectors
    matchedSchemes,
    fundingSummary: {
      estimatedProjectCost: finances.estimatedProjectCost || (domainInfo.isMachinery ? '₹12,00,000' : '₹5,00,000'),
      availableCapital: finances.availableCapital || (domainInfo.isMachinery ? '₹2,50,000' : '₹1,00,000'),
      fundingRequired: finances.fundingRequired || (domainInfo.isMachinery ? '₹9,50,000' : '₹4,00,000'),
      indicativeLoanEmi: feasibility.financialProjections.displayLoanEmi,
      indicativeMonthlySurplus: feasibility.financialProjections.displaySurplus
    },

    recommendations,
    nextActions,
    dataSources,

    // Advisory Trust Disclaimer
    disclaimer: 'Important: Business Compass provides estimates and planning guidance based on available profile, market, geographic, and financial information. Market size, competitor counts, pricing recommendations, and feasibility assessments are indicative estimates and should be validated locally before committing capital. This analysis does not guarantee commercial success, profit margins, loan sanctions, or government subsidy approval.'
  };

  return strategy;
}

function generateStrategicRecommendations(domainInfo, business, marketReach, competitors, pricing, risks, finances) {
  const { domainKey } = domainInfo;

  if (domainKey === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY) {
    return [
      {
        id: 'rec-1',
        title: 'Prioritize Live On-Farm Demonstrations Over Static Showrooms',
        category: 'Go-To-Market',
        text: `Focus your initial 60 days on conducting 12–15 live field demonstrations on local farms across 3–4 village clusters. Farmers buy implements when they visibly experience labor savings and easy handling on regional soil.`,
        urgency: 'Month 1'
      },
      {
        id: 'rec-2',
        title: 'Price for Fast Payback & Transparent Return on Investment (ROI)',
        category: 'Pricing',
        text: `Maintain your indicative pricing range of ${pricing.recommendedPriceRange.displayRange}. Frame price directly against laborer daily wage savings (recouped in 1–2 crop seasons) rather than competing against brittle blacksmith tools.`,
        urgency: 'Pre-Launch'
      },
      {
        id: 'rec-3',
        title: 'Mitigate Farmer Post-Harvest Credit Through Bank & PACS Financing',
        category: 'Financial Discipline',
        text: 'Do not extend unbacked manufacturer credit to individual farmers. Connect buyers with Primary Agricultural Credit Societies (PACS) or Kisan Credit Card (KCC) loans to ensure upfront payment.',
        urgency: 'Ongoing'
      },
      {
        id: 'rec-4',
        title: 'Pursue SMAM / State Farm Mechanization Subsidy Empanelment',
        category: 'Policy & Subsidy',
        text: 'Submit implement prototypes for testing certification to qualify for 40–50% direct farmer subsidies under the Sub-Mission on Agricultural Mechanization (SMAM).',
        urgency: 'Month 2–3'
      }
    ];
  }

  // Default / Other sectors
  return [
    {
      id: 'rec-1',
      title: 'Prioritize Direct Customer Relationships & Local Traction',
      category: 'Go-To-Market',
      text: `Focus your first 60 days on securing initial recurring customers through ${competitors.positioning.coreAdvantage.toLowerCase()}. Direct customer contact builds immediate feedback and avoids intermediary discounts.`,
      urgency: 'Month 1'
    },
    {
      id: 'rec-2',
      title: 'Maintain Value-Based Mid-Tier Pricing Discipline',
      category: 'Pricing',
      text: `Position product at the recommended range of ${pricing.recommendedPriceRange.displayRange}. Visibly demonstrate quality, reliability, and guaranteed service rather than starting a price war.`,
      urgency: 'Pre-Launch'
    },
    {
      id: 'rec-3',
      title: 'Cap Customer Credit to Protect Working Capital',
      category: 'Financial Discipline',
      text: 'Do not allow informal customer credit to exceed 7 days or more than 15% of your total working capital. Require regular settlement to prevent liquidity dry-outs.',
      urgency: 'Ongoing'
    },
    {
      id: 'rec-4',
      title: 'Leverage Government Capital Subsidy to Minimize Debt Service',
      category: 'Capital Structuring',
      text: 'Submit a formal Detailed Project Report (DPR) via the Scheme Matcher to apply for 15–35% capital subsidy, lowering your monthly bank EMI obligation.',
      urgency: 'Month 1–2'
    }
  ];
}

function generateNextBestActions(domainInfo, business, competitors, pricing, risks, matchedSchemes) {
  const { domainKey } = domainInfo;
  const topSchemeName = matchedSchemes?.[0]?.shortName || 'PMEGP / SMAM';

  if (domainKey === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY) {
    return [
      {
        step: 1,
        action: 'Validate Equipment Needs with 15 Local Farmers & FPOs',
        description: 'Conduct on-farm interviews with 15 cultivators in your area. Record their top 3 manual labor drudgery tasks (e.g. weeding, sowing, spraying) and their acceptable purchase budget.',
        status: 'PENDING',
        connectedPillar: 'Market Reach & Opportunity',
        output: '15 Farmer Feedback Logs'
      },
      {
        step: 2,
        action: 'Benchmark Specs & Prices of 3 Competing Machinery Brands',
        description: 'Personally inspect commercial corporate machinery and local blacksmith tools in the tehsil market. Document weights, pricing, and failure points under regional soil conditions.',
        status: 'PENDING',
        connectedPillar: 'Competitor Landscape',
        output: 'Machine Benchmark Matrix'
      },
      {
        step: 3,
        action: 'Lock in 2 Verified Structural Steel & Motor Component Suppliers',
        description: 'Contact structural steel stockists and motor/engine distributors within 30 km. Compare landed material prices and parts replacement warranty terms.',
        status: 'PENDING',
        connectedPillar: 'Supply Chain Risk',
        output: '2 Raw Material Quotations'
      },
      {
        step: 4,
        action: `Align Implement Prototype with ${topSchemeName} Guidelines`,
        description: 'Collect formal machinery quotations and specifications to match the subsidy criteria of your matched government scheme (PMEGP / SMAM / AIF).',
        status: 'PENDING',
        connectedPillar: 'Government Scheme Matcher',
        output: 'Machinery Quotation Document'
      },
      {
        step: 5,
        action: 'Set Up 60-Day Emergency Working Capital & Spare Parts Pool',
        description: `Ensure at least ₹${Math.round((pricing.unitEconomics.variableCost || 9000) * 3).toLocaleString('en-IN')} is set aside for fast-moving wear parts (blades, tines, belts) to guarantee zero downtime for early farmer buyers.`,
        status: 'PENDING',
        connectedPillar: 'Financial Feasibility',
        output: 'Spare Parts Inventory Log'
      }
    ];
  }

  // Default / Other sectors
  return [
    {
      step: 1,
      action: 'Validate Local Demand with 20 Target Customers',
      description: 'Visit 20 potential customers in your immediate 0–5 km radius. Record current purchase habits, dissatisfaction with existing suppliers, and willingness to buy from you.',
      status: 'PENDING',
      connectedPillar: 'Market Reach & Opportunity',
      output: '20 Customer Interview Notes'
    },
    {
      step: 2,
      action: 'Benchmark Prices & Service Terms of 3 Local Competitors',
      description: 'Personally inspect or purchase from 3 nearby competitors. Record their exact pricing, quality, delivery speed, and customer complaints.',
      status: 'PENDING',
      connectedPillar: 'Competitor Landscape',
      output: 'Competitor Price Matrix'
    },
    {
      step: 3,
      action: 'Lock in 2 Alternate Raw Material Suppliers',
      description: 'Contact at least 2 vetted suppliers within 25 km. Compare landed material prices, minimum order quantities, and payment credit terms.',
      status: 'PENDING',
      connectedPillar: 'Supply Chain Risk',
      output: '2 Supplier Quotations'
    },
    {
      step: 4,
      action: `Align Quotations with ${topSchemeName} Guidelines`,
      description: 'Collect formal equipment quotations with GST numbers to match the eligibility requirements of your matched government scheme.',
      status: 'PENDING',
      connectedPillar: 'Government Scheme Matcher',
      output: 'Formal Quotation Document'
    },
    {
      step: 5,
      action: 'Establish 60-Day Emergency Working Capital Reserve',
      description: `Ensure a 60-day operational buffer is set aside in liquid balance before initiating full commercial operations.`,
      status: 'PENDING',
      connectedPillar: 'Financial Feasibility',
      output: 'Operating Reserve Setup'
    }
  ];
}
