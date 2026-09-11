/**
 * AI Marketing Hub Intelligence Engine
 * 
 * Generates personalized, budget-aware strategies, 100-day roadmaps,
 * channel allocations, campaign plans, and content tailored to the entrepreneur's
 * real business context and Working Capital marketing allocation.
 */

import { formatRupees } from '../financialCalculationService';

/**
 * Calculates Marketing Health Score (0–100) based on realistic setup factors.
 */
export function calculateMarketingHealth(profile, budgetStatus, campaigns = [], roadmapStatuses = {}) {
  let score = 30; // Baseline base score for registered enterprise

  // 1. Budget allocated check (up to 25 pts)
  if (budgetStatus.totalMonthlyBudget > 0) {
    score += 15;
    if (budgetStatus.utilizationPercent >= 40 && budgetStatus.utilizationPercent <= 95) {
      score += 10;
    } else if (budgetStatus.utilizationPercent > 0) {
      score += 5;
    }
  }

  // 2. Active campaigns check (up to 25 pts)
  const activeCount = campaigns.filter((c) => c.status === 'ACTIVE').length;
  if (activeCount >= 2) {
    score += 25;
  } else if (activeCount === 1) {
    score += 15;
  }

  // 3. Roadmap progress check (up to 20 pts)
  const completedTasks = Object.values(roadmapStatuses).filter((s) => s === 'COMPLETED').length;
  score += Math.min(20, completedTasks * 5);

  return {
    score: Math.min(95, score),
    label: score >= 75 ? 'Strong Foundation' : score >= 50 ? 'Developing Activity' : 'Needs Setup',
    assessmentType: campaigns.length > 0 ? 'Based on current business activity' : 'Initial AI assessment'
  };
}

/**
 * Generates a personalized marketing strategy grounded in profile & budget.
 */
export function generateMarketingStrategy(profile, monthlyMarketingBudget = 30000) {
  const business = profile?.business || profile || {};
  const personal = profile?.personalInfo || {};
  const name = business.name || 'Your Enterprise';
  const sector = (business.sector || 'General Business').toUpperCase();
  const product = business.productService || business.description || 'Quality Products & Services';
  const location = `${personal.district || personal.location || 'Local District'}, ${personal.state || 'India'}`;
  const isRural = (personal.ruralUrban || '').toUpperCase() === 'RURAL';
  const budget = Math.max(0, Number(monthlyMarketingBudget) || 0);

  // Determine core domain focus
  const isFoodAgri = sector.includes('AGRI') || sector.includes('FOOD') || sector.includes('FARM');
  const isManufacturing = sector.includes('MANUFACTUR') || sector.includes('ENGINEER') || sector.includes('TEXTILE');
  const isServices = sector.includes('SERVICE') || sector.includes('RETAIL') || sector.includes('TECH');

  // 1. Marketing Objective
  const objective = budget >= 25000
    ? `Acquire 120–150 paying customers and establish repeat purchasing cycles within ${isRural ? 'peri-urban mandis' : 'a 5–10 km catchment'} in 45 days.`
    : budget > 0
    ? `Acquire the first 50–75 verified local customers through low-cost direct WhatsApp outreach and storefront discovery.`
    : `Allocate initial working capital in Funding Panel to unlock paid customer acquisition channels.`;

  // 2. Primary Customer Segment
  const targetSegment = isFoodAgri
    ? (isRural ? 'Local grocery retailers, institutional canteens, and health-conscious families within a 5–10 km radius' : 'Urban families, fitness communities, and premium B2B supermarket outlets')
    : isManufacturing
    ? 'Smallholder workshops, regional distributors, and cooperative purchasing federations'
    : 'Local residents, neighborhood commercial offices, and young professionals within a 3–5 km radius';

  // 3. Recommended Positioning
  const positioning = isFoodAgri
    ? `Authentic, chemical-free local farm purees & ingredients with verified origin transparency at everyday affordable prices.`
    : isManufacturing
    ? `Durable, locally serviceable engineering tools with instant spare parts availability, outperforming costly imported equipment.`
    : `Fast, friendly, locally accountable provider offering customized quality with neighborhood delivery.`;

  // 4. Ranked Channels with Rationales
  const channels = [
    {
      name: 'WhatsApp Business API & Direct Broadcasts',
      priority: 'HIGH PRIORITY',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reason: 'Achieves 90%+ open rates in local Indian clusters; enables catalog sharing, repeat order re-engagement, and zero friction UPI ordering.',
      suggestedShare: '25%'
    },
    {
      name: isManufacturing ? 'Local Trade Kiosks & Mandi Demonstrations' : 'Instagram & Meta Reels Showcase',
      priority: 'HIGH PRIORITY',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reason: isManufacturing
        ? 'Live hands-on machinery demonstrations in agricultural clusters build immediate buyer trust and overcome purchase hesitation.'
        : 'Short-form visual proof of product quality and behind-the-scenes packaging attracts young suburban households.',
      suggestedShare: '30%'
    },
    {
      name: 'Google Business Profile & Local Search Map Pins',
      priority: 'MEDIUM PRIORITY',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      reason: 'Captures high-intent nearby buyers searching "near me" on Google Maps with zero ongoing ad fees once verified.',
      suggestedShare: '15%'
    },
    {
      name: 'Community Customer Referral & Sample Gifting Circle',
      priority: 'MEDIUM PRIORITY',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      reason: 'Word-of-mouth referral incentive (e.g. ₹50 cashback or free mini-pack for introducing a neighbor) yields the lowest CAC.',
      suggestedShare: '15%'
    },
    {
      name: 'Hyper-Local Printed Flyers & Shop Counter QR Tent Cards',
      priority: 'LOW PRIORITY',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      reason: 'Low-cost tangible touchpoint for localized foot-traffic awareness in dense residential societies.',
      suggestedShare: '15%'
    }
  ];

  // 5. Hyperlocal Catchment Breakdown (Section 14)
  const catchment = [
    {
      radius: '0–2 km (Neighborhood Core)',
      channels: ['WhatsApp Broadcasts', 'Doorstep Tasting / Flyers', 'Counter QR Display'],
      focus: 'High-frequency neighborhood repeat orders, instant walk-ins, and personal relationship building.',
      conversionExpectation: 'High conversion (15–25%), minimal media spend.'
    },
    {
      radius: '2–5 km (Primary Commercial Catchment)',
      channels: ['Geo-targeted Instagram Ads', 'Google Maps Local Pins', 'Apartment Community Groups'],
      focus: 'New customer discovery, weekend shopping trips, and delivery orders over ₹499.',
      conversionExpectation: 'Moderate conversion (6–10%), moderate ad investment.'
    },
    {
      radius: '5–10 km (Extended Regional Reach)',
      channels: ['Wholesale Dealer Linkages', 'Local Mandi Kiosks', 'Regional Logistics Delivery'],
      focus: 'Bulk B2B orders, institutional accounts, and regional brand awareness.',
      conversionExpectation: 'Lower consumer impulse, high B2B transaction value.'
    }
  ];

  // 6. Recommended Monthly Allocation (Strictly <= budget)
  const allocations = generateBudgetAllocation(budget);

  return {
    businessName: name,
    sector,
    location,
    product,
    monthlyBudget: budget,
    objective,
    targetSegment,
    positioning,
    channels,
    catchment,
    allocations,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generates an itemized monthly marketing allocation strictly <= monthly budget.
 */
export function generateBudgetAllocation(totalBudget = 30000) {
  const b = Math.max(0, Number(totalBudget) || 0);

  if (b === 0) {
    return [
      { channel: 'Paid Social (Instagram / Meta)', amount: 0, percentage: 25, purpose: 'Customer acquisition' },
      { channel: 'Search & Google Maps', amount: 0, percentage: 20, purpose: 'High-intent search capture' },
      { channel: 'Local Outreach & Field Samples', amount: 0, percentage: 20, purpose: 'Physical trust building' },
      { channel: 'Content Creation & Photography', amount: 0, percentage: 15, purpose: 'Professional product assets' },
      { channel: 'Customer Referral Program', amount: 0, percentage: 10, purpose: 'Word-of-mouth incentives' },
      { channel: 'Testing Reserve & Experiments', amount: 0, percentage: 10, purpose: 'Unforeseen opportunities' }
    ];
  }

  // Exact round proportions summing precisely to totalBudget
  const pSocial = Math.round(b * 0.27);
  const pSearch = Math.round(b * 0.20);
  const pLocal = Math.round(b * 0.18);
  const pContent = Math.round(b * 0.13);
  const pReferral = Math.round(b * 0.11);
  const pTesting = b - (pSocial + pSearch + pLocal + pContent + pReferral);

  return [
    { channel: 'Paid Social (Instagram & Meta)', amount: pSocial, percentage: 27, purpose: 'High-converting local visual ads to drive message leads' },
    { channel: 'Google Business & Maps Promotion', amount: pSearch, percentage: 20, purpose: 'Capture buyers searching for your product category in your town' },
    { channel: 'Local Field Outreach & Free Samples', amount: pLocal, percentage: 18, purpose: 'Tangible tasting/demonstration kits for community hubs' },
    { channel: 'Content Creation & Professional Assets', amount: pContent, percentage: 13, purpose: 'Product photography, banners, and verified labeling' },
    { channel: 'Customer Referral & Loyalty Rewards', amount: pReferral, percentage: 11, purpose: 'Incentivize existing buyers to refer friends and colleagues' },
    { channel: 'Testing Reserve & Seasonal Experiments', amount: pTesting, percentage: 11, purpose: 'Buffer for festival surges and creative A/B testing' }
  ];
}

/**
 * Generates the 100-Day Marketing Roadmap across 4 structured phases.
 */
export function generate100DayRoadmap(profile, monthlyBudget = 30000) {
  const business = profile?.business || profile || {};
  const name = business.name || 'Your Business';
  const product = business.productService || 'products';
  const b = Math.max(0, Number(monthlyBudget) || 0);

  return [
    {
      phase: 1,
      name: 'FOUNDATION',
      days: 'Day 0–7',
      focus: 'Brand Identity, Digital Assets & Storefront Readiness',
      tasks: [
        {
          id: 'task_1_1',
          day: 'Day 1–2',
          task: `Define precise target customer persona and core value proposition for ${name}.`,
          channel: 'Internal Strategy',
          estimatedCost: 0,
          expectedOutcome: 'Clear positioning document defining who pays and why.',
          defaultStatus: 'COMPLETED'
        },
        {
          id: 'task_1_2',
          day: 'Day 3–4',
          task: 'Create verified Google Business Profile with location pins, operating hours, and photo gallery.',
          channel: 'Google Maps / Search',
          estimatedCost: 0,
          expectedOutcome: 'Searchable business on Google Maps within 48 hours.',
          defaultStatus: 'COMPLETED'
        },
        {
          id: 'task_1_3',
          day: 'Day 5',
          task: 'Set up WhatsApp Business account with automated greeting, away message, and product catalog.',
          channel: 'WhatsApp Business',
          estimatedCost: 0,
          expectedOutcome: 'Direct ordering catalog link shareable with anyone.',
          defaultStatus: 'COMPLETED'
        },
        {
          id: 'task_1_4',
          day: 'Day 6–7',
          task: `Produce 10 high-resolution photos of ${product} and prepare introductory launch offer.`,
          channel: 'Content Studio',
          estimatedCost: Math.min(2500, Math.round(b * 0.1)),
          expectedOutcome: 'Ready-to-publish image bank and 10% introductory offer coupon.',
          defaultStatus: 'IN_PROGRESS'
        }
      ]
    },
    {
      phase: 2,
      name: 'LAUNCH',
      days: 'Day 8–30',
      focus: 'First-Customer Traction & Hyperlocal Neighborhood Buzz',
      tasks: [
        {
          id: 'task_2_1',
          day: 'Day 8–10',
          task: 'Launch first-customer announcement to local WhatsApp groups and residential societies.',
          channel: 'WhatsApp Direct',
          estimatedCost: Math.min(1500, Math.round(b * 0.05)),
          expectedOutcome: 'First 20 inbound inquiries and orders from early adopters.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_2',
          day: 'Day 11–15',
          task: 'Distribute 50 sample tasting/demonstration kits to prominent local shop owners and micro-influencers.',
          channel: 'Field Outreach',
          estimatedCost: Math.min(3500, Math.round(b * 0.12)),
          expectedOutcome: 'Strong word-of-mouth endorsements and initial social proof.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_3',
          day: 'Day 16–22',
          task: 'Run 5 km radius geo-targeted Instagram / Facebook ad promoting the introductory launch offer.',
          channel: 'Meta Ads',
          estimatedCost: Math.min(5000, Math.round(b * 0.18)),
          expectedOutcome: '3,000+ local impressions and 40+ WhatsApp inquiry clicks.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_4',
          day: 'Day 23–30',
          task: 'Personally follow up with every first-time buyer to collect feedback and request a 5-star Google review.',
          channel: 'Customer Care',
          estimatedCost: 0,
          expectedOutcome: '15+ authentic 5-star Google reviews establishing credible rating.',
          defaultStatus: 'PENDING'
        }
      ]
    },
    {
      phase: 3,
      name: 'GROWTH',
      days: 'Day 31–60',
      focus: 'Repeat Purchasing, Referrals & Channel Optimization',
      tasks: [
        {
          id: 'task_3_1',
          day: 'Day 31–38',
          task: 'Launch "Introduce a Neighbor" referral rewards program offering ₹50 discount vouchers.',
          channel: 'WhatsApp / Word of Mouth',
          estimatedCost: Math.min(2500, Math.round(b * 0.08)),
          expectedOutcome: '25% of existing customers referring at least 1 new paying client.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_3_2',
          day: 'Day 39–48',
          task: 'Double ad budget on the single best-performing creative based on Phase 2 conversion metrics.',
          channel: 'Performance Ads',
          estimatedCost: Math.min(6000, Math.round(b * 0.2)),
          expectedOutcome: 'Reduced CAC by 20% by cutting non-performing channels.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_3_3',
          day: 'Day 49–60',
          task: 'Partner with 3 complementary local retail businesses for counter co-promotions.',
          channel: 'Strategic Alliances',
          estimatedCost: Math.min(1500, Math.round(b * 0.05)),
          expectedOutcome: 'Access to verified customer bases without paying advertising auction fees.',
          defaultStatus: 'PENDING'
        }
      ]
    },
    {
      phase: 4,
      name: 'SCALE',
      days: 'Day 61–100',
      focus: 'Catchment Expansion, Subscription / Retainers & New Product Lines',
      tasks: [
        {
          id: 'task_4_1',
          day: 'Day 61–75',
          task: 'Expand marketing radius from 5 km to 10 km, linking with regional delivery partners.',
          channel: 'Regional Distribution',
          estimatedCost: Math.min(7500, Math.round(b * 0.25)),
          expectedOutcome: '50% expansion in total addressable customer households.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_4_2',
          day: 'Day 76–85',
          task: 'Introduce weekly subscription or bulk recurring delivery packs for high-volume consumers.',
          channel: 'Product Packaging',
          estimatedCost: Math.min(2000, Math.round(b * 0.07)),
          expectedOutcome: 'Predictable recurring monthly revenue covering fixed overheads.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_4_3',
          day: 'Day 86–100',
          task: 'Run seasonal / festival celebration campaign capitalizing on peak regional festive purchasing.',
          channel: 'Integrated Multi-Channel',
          estimatedCost: Math.min(8000, Math.round(b * 0.25)),
          expectedOutcome: 'Highest single-month turnover since launch with established brand equity.',
          defaultStatus: 'PENDING'
        }
      ]
    }
  ];
}

/**
 * Generates tailored copy for the Content Studio across 3 categories.
 */
export function generateContentStudio(profile) {
  const business = profile?.business || profile || {};
  const personal = profile?.personalInfo || {};
  const name = business.name || 'Our Enterprise';
  const product = business.productService || business.description || 'handcrafted goods';
  const location = personal.district || 'our city';

  return {
    socialMedia: [
      {
        type: 'Instagram Post',
        headline: 'Behind The Scenes & Pure Quality',
        content: `Direct from ${location} to your family! 🌱\n\nAt ${name}, we believe in zero compromises. Every batch of our ${product} is prepared with uncompromising freshness and verified regional ingredients.\n\n✨ Why our customers choose us:\n✔️ 100% genuine quality\n✔️ Farm-direct freshness\n✔️ Supporting local livelihood\n\n📍 Available right here in ${location}. Order your first pack today and get 10% off!\n\n👉 Tap the link in bio or WhatsApp us directly to order.`,
        hashtags: `#${name.replace(/\s+/g, '')} #LocalMade #PurityMatters #${location.replace(/\s+/g, '')}Business #VocalForLocal #IndianEntrepreneurs`
      },
      {
        type: 'Instagram Reel Script Idea',
        headline: '30-Second "Day in the Life / Making Of" Reel',
        content: `🎥 **Hook (0-3s)**: "Ever wonder where real, authentic ${product} actually comes from?" (Show fast visual of raw farm ingredients).\n\n⚙️ **Body (3-15s)**: Fast cuts showing clean preparation, careful sorting, and hygienic bottling at ${name} in ${location}.\n\n💡 **Value (15-25s)**: "No artificial chemicals. No middleman storage for months. Just pure goodness."\n\n🎯 **Call to Action (25-30s)**: "Try a free sample kit this week! Comment 'TASTE' below or DM us on WhatsApp."`,
        audioTip: 'Use trending soothing acoustic or upbeat instrumental regional track.'
      },
      {
        type: 'WhatsApp Status Update',
        headline: 'Fresh Batch Today Alert',
        content: `🟢 FRESH BATCH READY TODAY!\n\nJust completed fresh processing of our ${product} at ${name}.\n\n📦 Only 25 packs available for delivery across ${location} today.\n\n💬 Reply "ORDER" to this status for priority same-day home delivery.`,
        cta: 'Reply directly to reserve'
      },
      {
        type: 'LinkedIn Post (B2B & Institutional)',
        headline: 'Building Regional Value Add & MSME Growth',
        content: `Empowering regional manufacturing from the grassroots up in ${location}.\n\nAt ${name}, our mission is solving supply-chain fragmentation for ${product}. By sourcing directly and maintaining rigorous quality standards, we provide commercial buyers and retailers with dependable, high-margin inventory.\n\nLooking to partner with regional distributors and institutional buyers across the state. Open for B2B procurement conversations!`,
        hashtags: '#MSMEIndia #SupplyChain #MakeInIndia #Entrepreneurship'
      }
    ],
    advertising: [
      {
        type: 'Meta Ad Headline & Description',
        headline: `Fresh & Pure ${product} in ${location} — 10% Off First Order`,
        primaryText: `Tired of mass-produced, stale shelf products? Experience pure, authentically sourced ${product} prepared right here in ${location}. Delivered fresh to your doorstep with guaranteed purity.`,
        cta: 'Order on WhatsApp'
      },
      {
        type: 'Local Pamphlet / Newspaper Insert Copy',
        headline: `ANNOUNCING THE LAUNCH OF ${name.toUpperCase()} IN ${location.toUpperCase()}`,
        bodyText: `Your neighborhood's trusted source for premium ${product}.\n\n• Zero artificial preservatives\n• Prepared using traditional purity standards\n• Guaranteed fresh direct delivery\n\n🎁 SPECIAL INTRODUCTORY OFFER: Present this coupon code "FIRST10" or message us on WhatsApp to claim a FREE sample kit with your first order!`,
        contactDetails: `Visit our center in ${location} or call / WhatsApp: +91 98765 43210.`
      },
      {
        type: 'Shop Counter Display Tent Card Copy',
        headline: 'Scan to Join our VIP WhatsApp Club',
        bodyText: `Love our ${product}? Scan the QR code below to receive secret weekly discounts, free tasting alerts, and same-day priority delivery.`,
        cta: 'Scan QR with Phone Camera'
      }
    ],
    customerCommunication: [
      {
        type: 'Welcome New Customer Message',
        trigger: 'Sent immediately after first purchase',
        message: `Namaste! 🙏 Thank you for supporting ${name}. Your order of ${product} has been prepared with immense care. We hope you and your family love the taste. If you need any assistance or have feedback, I'm just a WhatsApp message away!`
      },
      {
        type: 'Review Request (Google Maps / WhatsApp)',
        trigger: 'Sent 3 days after delivery',
        message: `Hi there! Hope you are enjoying your ${product}. As a growing local enterprise in ${location}, your honest feedback means the world to us. Could you take 30 seconds to leave us a quick Google review? Here is the direct link: [google.review.link]. Thank you for championing local!`
      },
      {
        type: 'Repeat Purchase Re-engagement',
        trigger: 'Sent 21 days after last order',
        message: `Hello! We noticed it has been a few weeks since your last batch of ${product} from ${name}. We have just harvested a fresh batch this morning! Reply "YES" and we will send a fresh pack with complimentary free delivery.`
      },
      {
        type: 'Festival / Seasonal Campaign Message',
        trigger: 'Festive seasons (Diwali, Makar Sankranti, Eid, etc.)',
        message: `Warm festive greetings from all of us at ${name}! 🪔 Celebrate this auspicious season with pure, unadulterated ${product} gift boxes. Perfect for sharing warmth with family, friends, and colleagues. Limited festive hampers available — reserve yours today!`
      }
    ]
  };
}

/**
 * Generates Advertising Planner recommendations with daily budgets and estimated KPIs.
 */
export function generateAdvertisingPlans(profile, monthlyBudget = 30000) {
  const b = Math.max(0, Number(monthlyBudget) || 0);

  const instaBudget = Math.min(8000, Math.round(b * 0.35));
  const googleBudget = Math.min(6000, Math.round(b * 0.25));
  const localBudget = Math.min(4000, Math.round(b * 0.15));

  return [
    {
      id: 'ad_plan_1',
      platform: 'Instagram & Facebook (Meta Ads)',
      objective: 'Customer Acquisition via WhatsApp Link',
      targetAudience: 'Men & Women (22–50 yrs) within 5 km radius interested in local foods & lifestyle',
      dailyBudget: Math.max(150, Math.round(instaBudget / 20)),
      campaignDuration: '20 Days',
      totalCost: instaBudget,
      creativeType: '15-sec Short Video Showcase & Carousel',
      estimatedReach: `${Math.round(instaBudget * 1.8)}–${Math.round(instaBudget * 2.5)} local people`,
      estimatedClicks: `${Math.round(instaBudget * 0.08)}–${Math.round(instaBudget * 0.12)} WhatsApp inquiries`,
      estimatedCostPerInquiry: '₹12–₹18 per lead',
      status: 'RECOMMENDED'
    },
    {
      id: 'ad_plan_2',
      platform: 'Google Business & Search Maps Promoted Pin',
      objective: 'Local Intent Capture (Buyers searching "near me")',
      targetAudience: 'People actively searching for product keywords in your district',
      dailyBudget: Math.max(150, Math.round(googleBudget / 25)),
      campaignDuration: '25 Days',
      totalCost: googleBudget,
      creativeType: 'Google Map Promoted Pin & Search Headline',
      estimatedReach: `${Math.round(googleBudget * 0.9)}–${Math.round(googleBudget * 1.4)} high-intent searches`,
      estimatedClicks: `${Math.round(googleBudget * 0.06)}–${Math.round(googleBudget * 0.09)} direct store calls / navigations`,
      estimatedCostPerInquiry: '₹15–₹25 per direct call',
      status: 'RECOMMENDED'
    },
    {
      id: 'ad_plan_3',
      platform: 'Local Community Society Kiosks & Printed Counter Cards',
      objective: 'Physical Trust & Immediate Footfall',
      targetAudience: 'High-density residential apartment complexes and commercial markets',
      dailyBudget: 'One-time weekend activation',
      campaignDuration: '2 Weekends',
      totalCost: localBudget,
      creativeType: 'Standee Banner, Sampling Cups & QR Ordering Flyers',
      estimatedReach: '800–1,200 neighborhood residents',
      estimatedClicks: '150+ direct product tastings and contacts',
      estimatedCostPerInquiry: '₹20–₹30 per customer acquired',
      status: 'OPTIONAL'
    }
  ];
}
