/**
 * AI Marketing Hub Intelligence Engine
 * 
 * Generates deeply personalized, budget-aware strategies, 100-day roadmaps,
 * channel allocations, campaign plans, and content tailored to the entrepreneur's
 * real business context, domain classification, and Working Capital marketing allocation.
 */

import { formatRupees } from '../financialCalculationService';
import { classifyBusinessDomain, BUSINESS_DOMAINS } from '../strategy/businessDomainClassifier';

/**
 * Calculates Marketing Health Score (0–100) based on realistic setup factors.
 */
export function calculateMarketingHealth(profile, budgetStatus, campaigns = [], roadmapStatuses = {}) {
  let score = 30; // Baseline score for registered enterprise profile

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
 * Helper to safely extract business profile attributes
 */
function extractProfileContext(profile) {
  const business = profile?.business || profile || {};
  const personal = profile?.personalInfo || {};

  const name = business.name || 'Your Enterprise';
  const sector = business.sector || 'General Business';
  const description = business.description || '';
  const product = business.productService || business.description || 'Specialty Products & Services';
  const targetCustomers = business.targetCustomers || '';
  const stage = (business.stage || 'IDEA').toUpperCase();
  const district = personal.district || (business.location?.includes(',') ? business.location.split(',')[0].trim() : 'Local Catchment');
  const state = personal.state || (business.location?.includes(',') ? business.location.split(',')[1].trim() : 'India');
  const location = `${district}, ${state}`;
  const isRural = (personal.ruralUrban || business.areaClassification || '').toUpperCase() === 'RURAL';

  const domainInfo = classifyBusinessDomain(business, personal);

  return {
    business,
    personal,
    name,
    sector,
    description,
    product,
    targetCustomers,
    stage,
    district,
    state,
    location,
    isRural,
    domainInfo
  };
}

/**
 * Generates a personalized marketing strategy grounded in profile & budget.
 */
export function generateMarketingStrategy(profile, monthlyMarketingBudget = 30000) {
  const ctx = extractProfileContext(profile);
  const budget = Math.max(0, Number(monthlyMarketingBudget) || 0);
  const { domainInfo, name, product, location, district, isRural, targetCustomers, description } = ctx;

  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;
  const isDairy = key === BUSINESS_DOMAINS.DAIRY_ANIMAL_HUSBANDRY;
  const isFoodProc = key === BUSINESS_DOMAINS.AGRI_FOOD_PROCESSING;
  const isHealth = key === BUSINESS_DOMAINS.HEALTH_MEDICAL_WELLNESS;
  const isEdu = key === BUSINESS_DOMAINS.EDUCATION_COACHING_ACADEMY;
  const isBeauty = key === BUSINESS_DOMAINS.BEAUTY_SALON_PERSONAL_CARE;
  const isProf = key === BUSINESS_DOMAINS.PROFESSIONAL_CREATIVE_SERVICES;
  const isTextile = key === BUSINESS_DOMAINS.TEXTILE_APPAREL_FASHION;
  const isTech = key === BUSINESS_DOMAINS.TECH_ELECTRONICS_REPAIR;
  const isMfg = key === BUSINESS_DOMAINS.MANUFACTURING_FABRICATION;
  const isRetail = key === BUSINESS_DOMAINS.RETAIL_KIRANA_COMMERCE;
  const isArtisan = key === BUSINESS_DOMAINS.ARTISAN_HANDICRAFT_DECOR;

  // 1. Primary Marketing Objective
  let objective = '';
  if (budget === 0) {
    objective = `Allocate initial working capital in Funding Panel to unlock targeted customer acquisition channels for ${name}.`;
  } else if (isCafe) {
    objective = budget >= 25000
      ? `Drive 200–250 new dine-in and takeaway patrons, achieve 4.6+ Google Maps rating, and build a 400+ member WhatsApp loyalty circle within 45 days in ${district}.`
      : `Establish initial regular footfall of 30–50 daily customers through Google Maps optimization and neighborhood WhatsApp promotions.`;
  } else if (isAgriEquip) {
    objective = budget >= 25000
      ? `Conduct 25 live village/field demonstrations, partner with 3 local FPOs or equipment dealers, and secure 15–20 machine unit orders within 60 days.`
      : `Deliver hands-on machine trials to 10 progressive farmers and establish village demonstration word-of-mouth.`;
  } else if (isDairy) {
    objective = budget >= 25000
      ? `Secure daily subscription deliveries for 80–120 households and establish bulk supply ties with 5 commercial tea stalls or sweet shops.`
      : `Acquire the first 30 daily milk and fresh paneer delivery subscribers in nearby residential colonies.`;
  } else if (isFoodProc) {
    objective = budget >= 25000
      ? `Place packaged ${product} in 40+ local retail grocers and mandis, and acquire 100 direct household buyers via WhatsApp re-orders.`
      : `Acquire first 40 regular household buyers through local bazaar tasting stalls and direct WhatsApp re-ordering.`;
  } else if (isHealth || isBeauty) {
    objective = budget >= 25000
      ? `Book 80–120 client consultations/appointments per month and build a verified 5-star local Google Maps reputation.`
      : `Acquire 30 initial recurring clients through introductory wellness/styling offers and neighborhood referrals.`;
  } else if (isEdu) {
    objective = budget >= 25000
      ? `Enroll 40–60 students for the upcoming term through free diagnostic demo sessions and parent counseling workshops.`
      : `Fill the inaugural batch of 15–20 students through school-gate outreach and parent referral incentives.`;
  } else if (isTextile) {
    objective = budget >= 25000
      ? `Generate 150+ direct boutique inquiries via Instagram Reels and secure 50+ custom garment or stitching orders this festive season.`
      : `Acquire 30 first-time tailoring and boutique customers through community lookbook sharing and introductory fitting discounts.`;
  } else if (isTech) {
    objective = budget >= 25000
      ? `Position as ${district}'s top-rated repair and technical service hub with 100+ monthly service orders and 5 commercial AMC contracts.`
      : `Capture high-intent local repair searches on Google Maps to generate 35+ direct store walk-in repairs.`;
  } else if (isMfg || isProf) {
    objective = budget >= 25000
      ? `Generate 20 qualified commercial B2B procurement leads and close 6–8 high-value regional supply contracts.`
      : `Establish direct outreach to 25 local commercial contractors and institutional clients to secure initial repeat orders.`;
  } else {
    objective = budget >= 25000
      ? `Acquire 100–140 verified paying customers and build recurring repeat purchase behavior across ${district} in 45 days.`
      : `Acquire the first 40–60 local customers through direct WhatsApp outreach and prominent local storefront discovery.`;
  }

  // 2. Target Customer Segment
  let targetSegment = targetCustomers;
  if (!targetSegment || targetSegment.toLowerCase().includes('local consumers') || targetSegment.length < 10) {
    if (isCafe) {
      targetSegment = `College students, young working professionals, remote workers, and families seeking cozy ambiance, specialty beverages, and fresh snacks in ${district}.`;
    } else if (isAgriEquip) {
      targetSegment = `Smallholder farmers (1–5 acres), vegetable growers, Farmer Producer Organizations (FPOs), and agricultural machinery hiring centers in ${district}.`;
    } else if (isDairy) {
      targetSegment = `Health-conscious residential families, morning tea stall vendors, sweet makers (halwais), and neighborhood milk consumers.`;
    } else if (isFoodProc) {
      targetSegment = `Neighborhood grocery stores (kirana), supermarket shelves, and home cooks seeking pure, unadulterated ${product}.`;
    } else if (isHealth) {
      targetSegment = `Local patients, seniors requiring specialized care, fitness enthusiasts, and families in residential societies within 5 km.`;
    } else if (isEdu) {
      targetSegment = `School and college students, competitive exam aspirants, and parents seeking quality academic mentorship and career skills.`;
    } else if (isBeauty) {
      targetSegment = `Brides, working women, college youth, and local residents seeking hygienic, contemporary grooming and styling services.`;
    } else if (isTextile) {
      targetSegment = `Women seeking bespoke ethnic wear, brides, festive shoppers, and boutique buyers desiring custom tailoring and quality fabrics.`;
    } else if (isTech) {
      targetSegment = `Smartphone and laptop owners, small businesses requiring IT support, and residents seeking quick doorstep or workshop gadget repair.`;
    } else if (isMfg) {
      targetSegment = `Building contractors, regional fabrication shops, interior designers, hardware retailers, and institutional buyers.`;
    } else if (isProf) {
      targetSegment = `Local MSME business owners, self-employed professionals, and commercial enterprises requiring dependable specialist expertise.`;
    } else {
      targetSegment = `Residents, retail consumers, and commercial clients in ${district} seeking dependable quality and direct accountability.`;
    }
  }

  // 3. Recommended Positioning
  let positioning = '';
  if (isCafe) {
    positioning = `${name} is the neighborhood's welcoming gathering hub—blending handcrafted specialty beverages, freshly baked delicacies, and vibrant ambiance at accessible everyday prices.`;
  } else if (isAgriEquip) {
    positioning = `Durable, fuel-efficient, and easily serviceable ${product} engineered specifically for local terrain, cutting labor costs by 60% with instant spare parts support.`;
  } else if (isDairy) {
    positioning = `100% pure, farm-fresh milk and dairy essentials with zero adulteration, tested daily and delivered within hours of morning milking.`;
  } else if (isFoodProc) {
    positioning = `Authentically crafted, hygienic, and traditionally processed ${product} with verified ingredient transparency, outperforming mass chemical-preserved brands.`;
  } else if (isHealth) {
    positioning = `Empathetic, scientifically grounded healthcare and wellness care with transparent pricing, minimal wait times, and compassionate patient focus.`;
  } else if (isEdu) {
    positioning = `Concept-first, student-centric academic mentorship combining personalized attention, structured revision notes, and proven test results.`;
  } else if (isBeauty) {
    positioning = `Premium hygiene standards, certified stylists, and customized aesthetic treatments delivering city-grade beauty experiences at neighborhood convenience.`;
  } else if (isTextile) {
    positioning = `Impeccable custom fits, designer flair, and premium textile finishing that turns every fabric into a stylish signature statement.`;
  } else if (isTech) {
    positioning = `Transparent diagnostic pricing, original genuine replacement parts, and swift same-day turnaround with a 90-day service warranty.`;
  } else if (isMfg) {
    positioning = `Precision engineered, heavy-duty fabricated components built to exact client specifications with prompt delivery and competitive direct-from-factory rates.`;
  } else if (isProf) {
    positioning = `Practical, results-oriented professional advisory that removes administrative friction and unlocks measurable business growth.`;
  } else {
    positioning = description
      ? `${name} delivers ${description.slice(0, 140)} with uncompromising quality, local accountability, and exceptional customer care.`
      : `The trusted local destination for ${product}, combining consistent quality, approachable pricing, and community-first service.`;
  }

  // 4. Ranked Channels with Domain-Specific Rationales
  const channels = getRankedChannelsForDomain(domainInfo, ctx, budget);

  // 5. Hyperlocal Catchment Breakdown (0-2 km, 2-5 km, 5-10 km)
  const catchment = getCatchmentBreakdownForDomain(domainInfo, ctx);

  // 6. Recommended Monthly Budget Allocation
  const allocations = generateBudgetAllocation(budget, domainInfo);

  return {
    businessName: name,
    sector: ctx.sector,
    domainTitle: domainInfo.domainTitle,
    location,
    product,
    monthlyBudget: budget,
    objective,
    targetSegment,
    positioning,
    channels,
    catchment,
    allocations,
    domainInfo,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Returns ranked channels tailored strictly to the business domain
 */
function getRankedChannelsForDomain(domainInfo, ctx, budget) {
  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;
  const isMfg = key === BUSINESS_DOMAINS.MANUFACTURING_FABRICATION;
  const isTextile = key === BUSINESS_DOMAINS.TEXTILE_APPAREL_FASHION;
  const isTech = key === BUSINESS_DOMAINS.TECH_ELECTRONICS_REPAIR;
  const isHealth = key === BUSINESS_DOMAINS.HEALTH_MEDICAL_WELLNESS;
  const isEdu = key === BUSINESS_DOMAINS.EDUCATION_COACHING_ACADEMY;
  const isBeauty = key === BUSINESS_DOMAINS.BEAUTY_SALON_PERSONAL_CARE;

  if (isCafe) {
    return [
      {
        name: 'Google Business Profile & Local Search Map Pin',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Captures 70%+ of high-intent nearby customers searching "cafe near me", "best coffee", or "hangout spot" on Google Maps.',
        suggestedShare: '25%'
      },
      {
        name: 'Instagram & Meta Reels (Aesthetic Ambiance & Food)',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Visual short-form video reels of latte art, sizzling appetizers, and cozy interior vibes drive massive local youth & foodie discovery.',
        suggestedShare: '30%'
      },
      {
        name: 'Table Tent Cards & Counter QR Loyalty Club',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        reason: 'Directly converts one-time cafe visitors into lifetime WhatsApp VIP members for secret weekly offers and birthday freebies.',
        suggestedShare: '15%'
      },
      {
        name: 'WhatsApp Direct Broadcast & VIP Community',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        reason: 'Zero-cost direct channel to announce weekend live music, fresh seasonal specials, and priority table reservations.',
        suggestedShare: '15%'
      },
      {
        name: 'Local College & Corporate Co-Promotions',
        priority: 'LOW PRIORITY',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        reason: 'Special student combo discount cards or corporate afternoon coffee breaks stimulate off-peak weekday revenue.',
        suggestedShare: '15%'
      }
    ];
  }

  if (isAgriEquip) {
    return [
      {
        name: 'On-Field Farmer Demonstrations & Village Trials',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Live hands-on machinery trials on farmers\' own soil build unquestionable proof of speed, durability, and diesel savings.',
        suggestedShare: '35%'
      },
      {
        name: 'WhatsApp Broadcast with Video Work Demos',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Short 20-second WhatsApp clips of the machine working in heavy soil achieve 90%+ open rates across farmer groups.',
        suggestedShare: '25%'
      },
      {
        name: 'Mandi Trade Booths & Weekly Haat Kiosks',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        reason: 'Physical display at block agricultural mandis on peak market days captures progressive growers with ready cash flow.',
        suggestedShare: '15%'
      },
      {
        name: 'FPO & Custom Hiring Center (CHC) Tie-ups',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        reason: 'Institutional linkages allow Farmer Producer Organizations to purchase units for collective member rent-outs.',
        suggestedShare: '15%'
      },
      {
        name: 'Google Business Profile & YouTube Technical Walkthroughs',
        priority: 'LOW PRIORITY',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        reason: 'Assures distant buyers that spare parts, user manuals, and warranty services are genuine and locally backed.',
        suggestedShare: '10%'
      }
    ];
  }

  if (isTextile || isBeauty) {
    return [
      {
        name: 'Instagram Reels & Visual Lookbook Showcases',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Before/after client transformations, fabric drape videos, and styling reels generate emotional purchase intent instantly.',
        suggestedShare: '35%'
      },
      {
        name: 'WhatsApp VIP Catalog & Booking Link',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'High open rates for private previews of new festival arrivals, appointment reminders, and custom measurement notes.',
        suggestedShare: '25%'
      },
      {
        name: 'Google Maps Business Profile & Client Reviews',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        reason: 'High-intent searches for "boutique near me" or "bridal parlour near me" convert directly when backed by 5-star photo reviews.',
        suggestedShare: '15%'
      },
      {
        name: 'Customer Referral & Bridal Party Incentives',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        reason: 'Word-of-mouth incentives (e.g. ₹200 off styling for introducing a friend) deliver the lowest CAC in personal care.',
        suggestedShare: '15%'
      },
      {
        name: 'Neighborhood Apartment Community Trunk Shows',
        priority: 'LOW PRIORITY',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        reason: 'Pop-up weekend exhibitions inside residential societies provide direct tactile interaction without showroom rent.',
        suggestedShare: '10%'
      }
    ];
  }

  if (isTech || isHealth || isEdu) {
    return [
      {
        name: 'Google Maps Local SEO & Verified Business Pin',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Captures urgent, immediate customer searches ("clinic near me", "phone repair near me", "best coaching institute").',
        suggestedShare: '35%'
      },
      {
        name: 'WhatsApp Direct Inquiries & Appointment Booking',
        priority: 'HIGH PRIORITY',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        reason: 'Enables zero-friction direct messaging to check fees, book time slots, or receive diagnostic status updates.',
        suggestedShare: '25%'
      },
      {
        name: 'Neighborhood Society Noticeboards & Informational Flyers',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
        reason: 'Tangible educational checklists, diagnostic camps, or gadget care tips dropped directly to nearby families.',
        suggestedShare: '15%'
      },
      {
        name: 'Satisfied Customer Google Reviews & Testimonials Circle',
        priority: 'MEDIUM PRIORITY',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        reason: 'Reputation is everything in services; systematically requesting Google reviews builds unbeatable organic authority.',
        suggestedShare: '15%'
      },
      {
        name: 'Geo-Targeted Meta Local Awareness Ads',
        priority: 'LOW PRIORITY',
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
        reason: 'Radius-locked ads announcing seasonal admissions, diagnostic health checkups, or rapid screen replacement offers.',
        suggestedShare: '10%'
      }
    ];
  }

  // Default / Manufacturing / General / Retail Channels
  return [
    {
      name: isMfg ? 'Direct B2B Procurement Outreach & Catalogs' : 'WhatsApp Business API & Direct Broadcasts',
      priority: 'HIGH PRIORITY',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reason: isMfg
        ? 'Direct technical specifications and wholesale quotation sharing with contractors and purchase managers.'
        : 'Achieves 90%+ open rates in local clusters; enables catalog sharing, repeat orders, and zero-friction UPI purchasing.',
      suggestedShare: '28%'
    },
    {
      name: isMfg ? 'Trade Directory & Regional Dealer Linkages' : 'Instagram & Meta Reels Showcase',
      priority: 'HIGH PRIORITY',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      reason: isMfg
        ? 'Empowers regional hardware retailers and distributors to stock and recommend your fabricated inventory.'
        : 'Visual proof of product craftsmanship, packaging, and behind-the-scenes quality attracts nearby suburban buyers.',
      suggestedShare: '26%'
    },
    {
      name: 'Google Business Profile & Local Maps Pin',
      priority: 'MEDIUM PRIORITY',
      badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
      reason: 'Captures high-intent nearby buyers searching "near me" on Google Maps with zero ongoing ad fees once verified.',
      suggestedShare: '18%'
    },
    {
      name: 'Community Customer Referral & Loyalty Program',
      priority: 'MEDIUM PRIORITY',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      reason: 'Word-of-mouth referral incentives for introducing neighboring households or commercial clients yield the lowest CAC.',
      suggestedShare: '14%'
    },
    {
      name: 'Hyper-Local Printed Materials & Counter QR Cards',
      priority: 'LOW PRIORITY',
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-300',
      reason: 'Cost-effective physical touchpoint for localized foot-traffic awareness in busy commercial bazaar markets.',
      suggestedShare: '14%'
    }
  ];
}

/**
 * Returns catchment breakdown tailored to domain
 */
function getCatchmentBreakdownForDomain(domainInfo, ctx) {
  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;
  const isMfg = key === BUSINESS_DOMAINS.MANUFACTURING_FABRICATION;

  if (isCafe) {
    return [
      {
        radius: '0–2 km (Walk-in & Regular Core)',
        channels: ['Walk-in Signage', 'Counter QR Loyalty', 'WhatsApp VIP Alerts', 'Local Society Flyers'],
        focus: 'Daily coffee commuters, student study sessions, quick afternoon bites, and high-frequency repeat visitors.',
        conversionExpectation: 'High conversion (20–30%), minimal media spend, high lifetime value.'
      },
      {
        radius: '2–5 km (Primary Commercial Catchment)',
        channels: ['Google Maps Local Pin', 'Instagram Reels Ads', 'Food Delivery App Visibility'],
        focus: 'Weekend destination dining, evening social catchups, family brunch trips, and online delivery orders over ₹399.',
        conversionExpectation: 'Moderate conversion (8–12%), steady ad-driven footfall.'
      },
      {
        radius: '5–10 km (Extended City Reach)',
        channels: ['Local Foodie Influencer Reviews', 'Birthday & Party Booking Promotions', 'Corporate Catering Outreach'],
        focus: 'Celebration bookings, specialty pastry orders, corporate bulk meetings, and brand destination buzz.',
        conversionExpectation: 'Lower impulse visit, high average bill value for party/event bookings.'
      }
    ];
  }

  if (isAgriEquip || isMfg) {
    return [
      {
        radius: '0–5 km (Immediate Trial Zone)',
        channels: ['Direct Field Trials', 'Demonstration Workshop', 'Local Contractor Calls'],
        focus: 'Hands-on product trials with neighbor farmers/contractors to build local social proof and word-of-mouth.',
        conversionExpectation: 'High conversion (25–35%), direct personal relationship building.'
      },
      {
        radius: '5–15 km (Block & Mandi Territory)',
        channels: ['Weekly Mandi Kiosks', 'WhatsApp Video Demos', 'Agro-Dealer Recommendations'],
        focus: 'Capturing progressive commercial buyers attending weekly markets and visiting agricultural input shops.',
        conversionExpectation: 'Moderate conversion (12–18%), high transaction ticket size.'
      },
      {
        radius: '15–30 km (Regional Distribution Belt)',
        channels: ['FPO Tie-ups', 'Regional Machinery Hubs', 'State Highway Billboards'],
        focus: 'Bulk institutional orders, cooperative purchases, and regional dealer linkage networks.',
        conversionExpectation: 'Longer evaluation cycle (30–45 days), high-margin commercial batch orders.'
      }
    ];
  }

  // Default Consumer & Services Catchment
  return [
    {
      radius: '0–2 km (Neighborhood Core)',
      channels: ['WhatsApp Broadcasts', 'Storefront Standee & Signage', 'Counter QR Display'],
      focus: 'High-frequency neighborhood repeat orders, instant walk-ins, and personal relationship building.',
      conversionExpectation: 'High conversion (15–25%), minimal media spend.'
    },
    {
      radius: '2–5 km (Primary Commercial Catchment)',
      channels: ['Geo-targeted Meta Ads', 'Google Maps Local Pins', 'Apartment Community Groups'],
      focus: 'New customer discovery, weekend shopping trips, and orders over ₹499.',
      conversionExpectation: 'Moderate conversion (6–10%), moderate ad investment.'
    },
    {
      radius: '5–10 km (Extended Regional Reach)',
      channels: ['Wholesale / Partner Linkages', 'Local Market Kiosks', 'Regional Delivery Partners'],
      focus: 'Bulk orders, institutional accounts, and regional brand awareness.',
      conversionExpectation: 'Lower consumer impulse, high B2B or batch transaction value.'
    }
  ];
}

/**
 * Generates an itemized monthly marketing allocation strictly <= monthly budget,
 * tailored to the business domain's optimal channel mix.
 */
export function generateBudgetAllocation(totalBudget = 30000, domainInfo = null) {
  const b = Math.max(0, Number(totalBudget) || 0);

  const key = domainInfo?.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;
  const isMfg = key === BUSINESS_DOMAINS.MANUFACTURING_FABRICATION;
  const isServiceOrTech = key === BUSINESS_DOMAINS.TECH_ELECTRONICS_REPAIR || key === BUSINESS_DOMAINS.HEALTH_MEDICAL_WELLNESS || key === BUSINESS_DOMAINS.EDUCATION_COACHING_ACADEMY;

  if (b === 0) {
    return [
      { channel: 'Paid Social (Instagram & Meta)', amount: 0, percentage: 25, purpose: 'Local customer acquisition' },
      { channel: 'Search & Google Maps', amount: 0, percentage: 20, purpose: 'High-intent search capture' },
      { channel: 'Storefront & Neighborhood Outreach', amount: 0, percentage: 20, purpose: 'Physical trust building' },
      { channel: 'Content Creation & Photography', amount: 0, percentage: 15, purpose: 'Professional visual assets' },
      { channel: 'Customer Referral Program', amount: 0, percentage: 10, purpose: 'Word-of-mouth incentives' },
      { channel: 'Testing Reserve & Experiments', amount: 0, percentage: 10, purpose: 'Buffer for experiments' }
    ];
  }

  if (isCafe) {
    const pInsta = Math.round(b * 0.30);
    const pMaps = Math.round(b * 0.22);
    const pLoyalty = Math.round(b * 0.18);
    const pPhoto = Math.round(b * 0.15);
    const pCampus = Math.round(b * 0.08);
    const pReserve = b - (pInsta + pMaps + pLoyalty + pPhoto + pCampus);

    return [
      { channel: 'Instagram & Meta Reels Ads', amount: pInsta, percentage: 30, purpose: 'Visual food & cafe ambiance promotion to nearby 5 km youth & foodies' },
      { channel: 'Google Maps Promoted Pin & Local SEO', amount: pMaps, percentage: 22, purpose: 'Capture high-intent diners searching "cafe near me" and "coffee shop"' },
      { channel: 'Table QR Club & Customer Loyalty Rewards', amount: pLoyalty, percentage: 18, purpose: 'WhatsApp VIP program, birthday perks, and repeat dining cashback' },
      { channel: 'Food Styling & Beverage Photography', amount: pPhoto, percentage: 15, purpose: 'Professional mouth-watering imagery for digital menu, reels, and banners' },
      { channel: 'Local College & Workplace Co-Promotions', amount: pCampus, percentage: 8, purpose: 'Special student privilege passes and office break combo cards' },
      { channel: 'Weekend Event & Festival Buffer', amount: pReserve, percentage: 7, purpose: 'Surge buffer for live acoustic evenings and festive holiday menus' }
    ];
  }

  if (isAgriEquip || isMfg) {
    const pTrials = Math.round(b * 0.32);
    const pWa = Math.round(b * 0.24);
    const pKiosks = Math.round(b * 0.18);
    const pReferral = Math.round(b * 0.12);
    const pVideo = Math.round(b * 0.08);
    const pReserve = b - (pTrials + pWa + pKiosks + pReferral + pVideo);

    return [
      { channel: 'On-Field Live Farmer Demonstrations', amount: pTrials, percentage: 32, purpose: 'Direct diesel fuel and trial logistics for village farm demonstrations' },
      { channel: 'WhatsApp Video Broadcasts & Direct Outreach', amount: pWa, percentage: 24, purpose: 'High-converting field operation video clips sent to farmer groups' },
      { channel: 'Mandi Trade Stalls & Haat Exhibitions', amount: pKiosks, percentage: 18, purpose: 'Physical demonstration stall setup during weekly block trade bazaars' },
      { channel: 'Customer Referral & Dealer Commissions', amount: pReferral, percentage: 12, purpose: 'Incentives for progressive farmers who recommend units to neighbors' },
      { channel: 'Technical Video & Operating Manuals', amount: pVideo, percentage: 8, purpose: 'Clear vernacular video guides showing maintenance and tool calibration' },
      { channel: 'Seasonal Harvest Surge Reserve', amount: pReserve, percentage: 6, purpose: 'Marketing buffer for peak pre-sowing and harvest buying seasons' }
    ];
  }

  if (isServiceOrTech) {
    const pSearch = Math.round(b * 0.32);
    const pReferral = Math.round(b * 0.22);
    const pSigns = Math.round(b * 0.18);
    const pWa = Math.round(b * 0.14);
    const pReserve = b - (pSearch + pReferral + pSigns + pWa);

    return [
      { channel: 'Google Search & Maps Local SEO', amount: pSearch, percentage: 32, purpose: 'Capture urgent repair and professional service inquiries near your clinic/shop' },
      { channel: 'Word-of-Mouth Referral Program', amount: pReferral, percentage: 22, purpose: 'Loyalty discount incentives for clients who refer their family & colleagues' },
      { channel: 'Storefront Signage & Neighborhood Flyers', amount: pSigns, percentage: 18, purpose: 'Prominent directional sidewalk boards and informative society pamphlets' },
      { channel: 'WhatsApp Automated Booking & Alerts', amount: pWa, percentage: 14, purpose: 'Appointment scheduling, service completion notifications, and warranty alerts' },
      { channel: 'Emergency Service Testing Reserve', amount: pReserve, percentage: 14, purpose: 'Ad surge buffer for seasonal peaks and promotional campaigns' }
    ];
  }

  // Standard Balanced Distribution
  const pSocial = Math.round(b * 0.27);
  const pSearch = Math.round(b * 0.20);
  const pLocal = Math.round(b * 0.18);
  const pContent = Math.round(b * 0.13);
  const pReferral = Math.round(b * 0.11);
  const pTesting = b - (pSocial + pSearch + pLocal + pContent + pReferral);

  return [
    { channel: 'Paid Social (Instagram & Meta Ads)', amount: pSocial, percentage: 27, purpose: 'High-converting local visual ads to drive direct inquiries' },
    { channel: 'Google Business & Maps Promotion', amount: pSearch, percentage: 20, purpose: 'Capture buyers searching for your category in your town' },
    { channel: 'Storefront & Neighborhood Outreach', amount: pLocal, percentage: 18, purpose: 'Field displays, counter QR cards, and localized bazaar presence' },
    { channel: 'Content Creation & Asset Production', amount: pContent, percentage: 13, purpose: 'Professional product photography, digital banners, and verified labeling' },
    { channel: 'Customer Referral & Loyalty Rewards', amount: pReferral, percentage: 11, purpose: 'Incentivize existing buyers to recommend friends and colleagues' },
    { channel: 'Testing Reserve & Seasonal Experiments', amount: pTesting, percentage: 11, purpose: 'Buffer for festival surges and creative A/B testing' }
  ];
}

/**
 * Generates the 100-Day Marketing Roadmap tailored across 4 structured phases.
 */
export function generate100DayRoadmap(profile, monthlyBudget = 30000) {
  const ctx = extractProfileContext(profile);
  const b = Math.max(0, Number(monthlyBudget) || 0);
  const { name, product, domainInfo, district } = ctx;

  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;

  if (isCafe) {
    return [
      {
        phase: 1,
        name: 'FOUNDATION',
        days: 'Day 0–7',
        focus: 'Menu Curation, Visual Identity & Digital Storefront Setup',
        tasks: [
          {
            id: 'task_1_1',
            day: 'Day 1–2',
            task: `Finalize signature beverage and snack menu items for ${name}, specifying competitive local pricing.`,
            channel: 'Internal Menu Strategy',
            estimatedCost: 0,
            expectedOutcome: 'Clear menu card with hero items and profit margin breakdown.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_2',
            day: 'Day 3–4',
            task: 'Set up verified Google Business Profile with location pins, operating hours, cafe photos, and QR menu.',
            channel: 'Google Maps / Search',
            estimatedCost: 0,
            expectedOutcome: 'Searchable cafe on Google Maps within 48 hours with direct navigation directions.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_3',
            day: 'Day 5',
            task: 'Place QR code tent cards on all cafe tables linking directly to the VIP WhatsApp club for a 10% instant discount.',
            channel: 'Table Tent Cards',
            estimatedCost: Math.min(1000, Math.round(b * 0.05)),
            expectedOutcome: 'Every visiting customer automatically enrolled into direct repeat marketing database.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_4',
            day: 'Day 6–7',
            task: `Conduct professional photo shoot of top 8 dishes/drinks at ${name} and design launch flyers.`,
            channel: 'Content Studio',
            estimatedCost: Math.min(2500, Math.round(b * 0.1)),
            expectedOutcome: 'High-res image bank for social media and 500 printed opening invitation flyers.',
            defaultStatus: 'IN_PROGRESS'
          }
        ]
      },
      {
        phase: 2,
        name: 'LAUNCH',
        days: 'Day 8–30',
        focus: 'Hyperlocal Neighborhood Buzz & First 200 Dine-In Guests',
        tasks: [
          {
            id: 'task_2_1',
            day: 'Day 8–10',
            task: 'Launch "Buy 1 Get 1 on Specialty Brews / Pastries" opening offer shared across local WhatsApp groups.',
            channel: 'WhatsApp Direct',
            estimatedCost: Math.min(1500, Math.round(b * 0.05)),
            expectedOutcome: 'Initial rush of 50+ local foodies and young diners during opening week.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_2',
            day: 'Day 11–15',
            task: 'Host an exclusive complimentary tasting evening for 10 prominent local food creators and micro-influencers.',
            channel: 'Influencer PR & Tasting',
            estimatedCost: Math.min(3000, Math.round(b * 0.12)),
            expectedOutcome: '15+ authentic Instagram stories and reels tagging the cafe location pin.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_3',
            day: 'Day 16–22',
            task: 'Run 3 km radius Instagram ad featuring your top signature dish with "Visit Us Today" button.',
            channel: 'Meta Ads',
            estimatedCost: Math.min(4500, Math.round(b * 0.18)),
            expectedOutcome: '5,000+ local impressions and 60+ new guest walk-ins.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_4',
            day: 'Day 23–30',
            task: 'Prompt every happy diner via WhatsApp to leave a 5-star review on Google Maps in exchange for a free cookie on next visit.',
            channel: 'Customer Care & Reviews',
            estimatedCost: 0,
            expectedOutcome: '35+ authentic 5-star Google reviews establishing strong search ranking.',
            defaultStatus: 'PENDING'
          }
        ]
      },
      {
        phase: 3,
        name: 'GROWTH',
        days: 'Day 31–60',
        focus: 'Weekday Revenue Optimization, Student Passes & Loyalty',
        tasks: [
          {
            id: 'task_3_1',
            day: 'Day 31–38',
            task: 'Introduce "Weekday Afternoon Work & Study Combo" (Brew + Snack at flat ₹149) to fill slow 2 PM–6 PM hours.',
            channel: 'Targeted In-Store Promo',
            estimatedCost: Math.min(1500, Math.round(b * 0.06)),
            expectedOutcome: '40% increase in weekday afternoon table occupancy.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_3_2',
            day: 'Day 39–48',
            task: 'Partner with 2 nearby colleges or co-working spaces to offer member student discount cards.',
            channel: 'Campus & Office Alliances',
            estimatedCost: Math.min(2000, Math.round(b * 0.08)),
            expectedOutcome: 'Consistent recurring youth groups during weekdays.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_3_3',
            day: 'Day 49–60',
            task: 'Double down on the single highest-performing menu item promotion based on Phase 2 sales data.',
            channel: 'Performance Social Ads',
            estimatedCost: Math.min(5000, Math.round(b * 0.18)),
            expectedOutcome: 'Established "hero item" that people travel across town to taste.',
            defaultStatus: 'PENDING'
          }
        ]
      },
      {
        phase: 4,
        name: 'SCALE',
        days: 'Day 61–100',
        focus: 'Event Hosting, Birthday Packages & Weekend Acoustic Nights',
        tasks: [
          {
            id: 'task_4_1',
            day: 'Day 61–75',
            task: 'Launch weekend acoustic music / open mic evenings and specialty weekend breakfast menus.',
            channel: 'Experiential Marketing',
            estimatedCost: Math.min(4000, Math.round(b * 0.15)),
            expectedOutcome: 'Full house weekend evenings with 100% table turnover and waiting list.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_4_2',
            day: 'Day 76–85',
            task: 'Introduce pre-booked birthday celebration and party catering packages (₹2,999+ tiers).',
            channel: 'High-Ticket Party Packages',
            estimatedCost: Math.min(2000, Math.round(b * 0.07)),
            expectedOutcome: 'Predictable high-margin group reservations booked weeks in advance.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_4_3',
            day: 'Day 86–100',
            task: 'Run seasonal / festival celebration campaign (e.g. Diwali festive hamper boxes or holiday special menu).',
            channel: 'Integrated Multi-Channel',
            estimatedCost: Math.min(7000, Math.round(b * 0.22)),
            expectedOutcome: 'Highest monthly turnover since launch with established local brand equity.',
            defaultStatus: 'PENDING'
          }
        ]
      }
    ];
  }

  if (isAgriEquip) {
    return [
      {
        phase: 1,
        name: 'FOUNDATION',
        days: 'Day 0–7',
        focus: 'Machine Specs, Demonstration Kits & Digital Verification',
        tasks: [
          {
            id: 'task_1_1',
            day: 'Day 1–2',
            task: `Document exact technical specs, fuel consumption savings, and labor replacement metrics for ${product}.`,
            channel: 'Engineering Portfolio',
            estimatedCost: 0,
            expectedOutcome: 'One-page visual comparison sheet showing cost savings vs manual labor.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_2',
            day: 'Day 3–4',
            task: 'Set up verified Google Business Profile and YouTube channel with demonstration videos.',
            channel: 'Google & Video Search',
            estimatedCost: 0,
            expectedOutcome: 'Farmers can find workshop location and watch machine working on their phone.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_3',
            day: 'Day 5',
            task: 'Set up WhatsApp Business catalog with direct video links and spare parts availability list.',
            channel: 'WhatsApp Business',
            estimatedCost: 0,
            expectedOutcome: 'Catalog link shareable instantly via WhatsApp in any farming group.',
            defaultStatus: 'COMPLETED'
          },
          {
            id: 'task_1_4',
            day: 'Day 6–7',
            task: `Produce 3 short 30-second on-field action videos of ${product} operating in wet and dry soils.`,
            channel: 'Field Media Studio',
            estimatedCost: Math.min(2500, Math.round(b * 0.1)),
            expectedOutcome: 'Ready video assets demonstrating real machinery reliability.',
            defaultStatus: 'IN_PROGRESS'
          }
        ]
      },
      {
        phase: 2,
        name: 'LAUNCH',
        days: 'Day 8–30',
        focus: 'On-Farm Live Demonstrations & First 10 Unit Placements',
        tasks: [
          {
            id: 'task_2_1',
            day: 'Day 8–12',
            task: 'Host 5 live farm trial demonstrations in prominent agricultural village panchayats.',
            channel: 'On-Farm Trials',
            estimatedCost: Math.min(3500, Math.round(b * 0.12)),
            expectedOutcome: 'Hands-on validation by 50+ local farmers, overcoming purchase doubt.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_2',
            day: 'Day 13–18',
            task: 'Set up demonstration stall at block weekly mandi during peak morning trading hours.',
            channel: 'Mandi Kiosks',
            estimatedCost: Math.min(2500, Math.round(b * 0.08)),
            expectedOutcome: '30+ high-intent farmer inquiries collected in verified register.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_3',
            day: 'Day 19–25',
            task: 'Offer first 5 buyers a "Free On-Site 6-Month Maintenance & Spare Blades Kit".',
            channel: 'Introductory Offer',
            estimatedCost: Math.min(3000, Math.round(b * 0.1)),
            expectedOutcome: 'Immediate conversion of trial attendees into proud machine owners.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_2_4',
            day: 'Day 26–30',
            task: 'Record video testimonials from first 3 machine buyers explaining how much labor cost they saved.',
            channel: 'Customer Proof',
            estimatedCost: 0,
            expectedOutcome: 'Unbeatable peer trust videos to circulate across district WhatsApp groups.',
            defaultStatus: 'PENDING'
          }
        ]
      },
      {
        phase: 3,
        name: 'GROWTH',
        days: 'Day 31–60',
        focus: 'FPO Linkages, Dealer Channels & Custom Hiring Centers',
        tasks: [
          {
            id: 'task_3_1',
            day: 'Day 31–40',
            task: 'Present equipment package to 3 regional Farmer Producer Organizations (FPOs) for collective procurement.',
            channel: 'Institutional FPO Sales',
            estimatedCost: Math.min(2000, Math.round(b * 0.08)),
            expectedOutcome: 'Bulk purchase discussions for custom hiring centers under government subsidy schemes.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_3_2',
            day: 'Day 41–50',
            task: 'Appoint 2 local agro-input dealers as authorized referral partners with transparent commission structure.',
            channel: 'Dealer Network',
            estimatedCost: Math.min(2500, Math.round(b * 0.08)),
            expectedOutcome: 'Dealer showroom presence without paying retail storefront rent.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_3_3',
            day: 'Day 51–60',
            task: 'Run targeted WhatsApp broadcast campaign before seasonal sowing with early-bird booking discounts.',
            channel: 'Pre-Season Campaign',
            estimatedCost: Math.min(3500, Math.round(b * 0.12)),
            expectedOutcome: '10+ machine pre-orders with advance token deposits.',
            defaultStatus: 'PENDING'
          }
        ]
      },
      {
        phase: 4,
        name: 'SCALE',
        days: 'Day 61–100',
        focus: 'Regional Expansion & Spare Parts Support Guarantee',
        tasks: [
          {
            id: 'task_4_1',
            day: 'Day 61–75',
            task: 'Expand marketing radius to neighboring tehsils/districts, deploying a mobile demo van on market days.',
            channel: 'Regional Expansion',
            estimatedCost: Math.min(6000, Math.round(b * 0.2)),
            expectedOutcome: 'Expansion into 3 adjacent agricultural blocks.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_4_2',
            day: 'Day 76–85',
            task: 'Launch annual maintenance & spare parts subscription package guaranteeing 24-hour breakdown replacement.',
            channel: 'After-Sales Service Guarantee',
            estimatedCost: Math.min(2000, Math.round(b * 0.07)),
            expectedOutcome: 'High customer satisfaction and recurring post-sales revenue stream.',
            defaultStatus: 'PENDING'
          },
          {
            id: 'task_4_3',
            day: 'Day 86–100',
            task: 'Conduct festive harvest demonstration mela showcasing upcoming new tool attachments.',
            channel: 'Harvest Festival Mela',
            estimatedCost: Math.min(7500, Math.round(b * 0.25)),
            expectedOutcome: 'Established market leadership as the premier local mechanization brand.',
            defaultStatus: 'PENDING'
          }
        ]
      }
    ];
  }

  // Default Structured 100-Day Roadmap for Services, Retail & Manufacturing
  return [
    {
      phase: 1,
      name: 'FOUNDATION',
      days: 'Day 0–7',
      focus: 'Digital Presence, Product Photography & Pricing Architecture',
      tasks: [
        {
          id: 'task_1_1',
          day: 'Day 1–2',
          task: `Define precise target customer persona and core value proposition for ${name}.`,
          channel: 'Strategy Blueprint',
          estimatedCost: 0,
          expectedOutcome: 'Clear positioning document defining who buys and why.',
          defaultStatus: 'COMPLETED'
        },
        {
          id: 'task_1_2',
          day: 'Day 3–4',
          task: `Set up verified Google Business Profile for ${name} with location pins, operating hours, and photo gallery.`,
          channel: 'Google Maps / Search',
          estimatedCost: 0,
          expectedOutcome: 'Searchable business on Google Maps within 48 hours.',
          defaultStatus: 'COMPLETED'
        },
        {
          id: 'task_1_3',
          day: 'Day 5',
          task: 'Set up WhatsApp Business account with automated greeting, catalog of offerings, and quick reply templates.',
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
          expectedOutcome: 'Ready-to-publish image bank and introductory offer coupon.',
          defaultStatus: 'IN_PROGRESS'
        }
      ]
    },
    {
      phase: 2,
      name: 'LAUNCH',
      days: 'Day 8–30',
      focus: 'First-Customer Traction & Local Neighborhood Buzz',
      tasks: [
        {
          id: 'task_2_1',
          day: 'Day 8–10',
          task: `Launch first-customer announcement to local WhatsApp groups and community contacts in ${district}.`,
          channel: 'WhatsApp Direct',
          estimatedCost: Math.min(1500, Math.round(b * 0.05)),
          expectedOutcome: 'First 20 inbound inquiries and orders from early adopters.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_2',
          day: 'Day 11–15',
          task: `Distribute introductory promotional kits and brochures to 30 prominent local community hubs and businesses.`,
          channel: 'Field Outreach',
          estimatedCost: Math.min(3000, Math.round(b * 0.1)),
          expectedOutcome: 'Strong word-of-mouth endorsements and initial social proof.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_3',
          day: 'Day 16–22',
          task: 'Run 5 km radius geo-targeted Meta ad promoting the introductory launch offer.',
          channel: 'Meta Ads',
          estimatedCost: Math.min(5000, Math.round(b * 0.18)),
          expectedOutcome: '3,000+ local impressions and 40+ direct inquiry clicks.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_2_4',
          day: 'Day 23–30',
          task: 'Personally follow up with every first-time customer to collect feedback and request a 5-star Google review.',
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
          task: 'Launch "Introduce a Neighbor" referral rewards program offering discount vouchers for both parties.',
          channel: 'Referral Rewards',
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
          task: 'Partner with complementary local businesses for counter co-promotions.',
          channel: 'Strategic Alliances',
          estimatedCost: Math.min(1500, Math.round(b * 0.05)),
          expectedOutcome: 'Access to verified customer bases without paying digital auction fees.',
          defaultStatus: 'PENDING'
        }
      ]
    },
    {
      phase: 4,
      name: 'SCALE',
      days: 'Day 61–100',
      focus: 'Catchment Expansion, Subscriptions / Retainers & Festive Growth',
      tasks: [
        {
          id: 'task_4_1',
          day: 'Day 61–75',
          task: 'Expand marketing radius from 5 km to 10 km, linking with regional delivery or distribution partners.',
          channel: 'Regional Reach',
          estimatedCost: Math.min(7000, Math.round(b * 0.22)),
          expectedOutcome: '50% expansion in total addressable customer households.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_4_2',
          day: 'Day 76–85',
          task: 'Introduce recurring loyalty tiers, bulk retainer packages, or subscription delivery options.',
          channel: 'Recurring Revenue Model',
          estimatedCost: Math.min(2000, Math.round(b * 0.07)),
          expectedOutcome: 'Predictable recurring monthly revenue covering fixed overheads.',
          defaultStatus: 'PENDING'
        },
        {
          id: 'task_4_3',
          day: 'Day 86–100',
          task: 'Run seasonal / festive celebration campaign capitalizing on peak regional festive purchasing.',
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
 * Generates tailored copy for the Content Studio across 3 categories,
 * dynamically reflecting the true trade, name, products, and location.
 */
export function generateContentStudio(profile) {
  const ctx = extractProfileContext(profile);
  const { name, product, location, district, domainInfo } = ctx;

  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;

  if (isCafe) {
    return {
      socialMedia: [
        {
          type: 'Instagram Post',
          headline: 'A Cozy Corner & Handcrafted Flavors in Town',
          content: `Your new favorite hangout spot in ${district} is ready for you! ☕✨\n\nAt ${name}, we pour passion into every cup and bake perfection into every treat. Whether you need a peaceful work corner, an afternoon coffee date, or a weekend family brunch—we've saved the best table for you.\n\n🌟 What awaits you:\n☕ Specialty roasted coffees & handcrafted beverages\n🥐 Freshly baked daily snacks & savory bites\n🌿 Warm, peaceful aesthetic ambiance with high-speed WiFi\n\n📍 Visit us today in ${location}. First-time guests get a complimentary treat with any specialty brew!\n\n👉 Tap the link in bio or WhatsApp us for directions & reservations.`,
          hashtags: `#${name.replace(/\s+/g, '')} #CafeVibes #${district.replace(/\s+/g, '')}Cafes #CoffeeLovers #LocalHangout #ArtisanalEats`
        },
        {
          type: 'Instagram Reel Script Idea',
          headline: '30-Second "Barista Pour & Cozy Cafe Vibe" Reel',
          content: `🎥 **Hook (0-3s)**: Close-up shot of rich espresso flowing into steaming textured milk forming intricate latte art with soothing cup sounds.\n\n✨ **Body (3-15s)**: Quick warm aesthetic cuts: a fresh plate of snacks placed on a rustic table, laughter between friends, steam rising from fresh pastries.\n\n💡 **Value (15-25s)**: On-screen text: "Looking for a calm cafe in ${district} with amazing coffee, peaceful work vibes, and great music? Welcome to ${name}."\n\n🎯 **Call to Action (25-30s)**: "Tag a friend who owes you a coffee date! Claim 10% off your first visit with code CAFE10 at the counter."`,
          audioTip: 'Use trending cozy lofi beats or warm acoustic guitar cafe audio.'
        },
        {
          type: 'WhatsApp Status Update',
          headline: 'Fresh Brew & Daily Special Alert',
          content: `🟢 FRESH BAKES & TODAY'S SPECIAL BREW AT ${name.toUpperCase()}!\n\nJust pulled fresh oven-warm pastries and brewed our signature roast coffee.\n\n✨ Today's Special: Order any specialty drink and get our hero snack at 50% off!\n\n📍 Stop by ${location} or reply "RESERVE" to hold a table for today.`,
          cta: 'Reply "RESERVE" for priority table'
        },
        {
          type: 'LinkedIn Post (Community & MSME Enterprise)',
          headline: 'Creating Welcoming Third Places for Regional Communities',
          content: `In every growing district, people need more than just home and the office—they need a welcoming "Third Place" where ideas flow, conversations happen, and community thrives.\n\nAt ${name} in ${district}, we are proud to build that space. Beyond specialty coffee and curated food, we support local suppliers and foster neighborhood connections.\n\nOpen for corporate catering, remote team work sessions, and community gatherings. Welcome to our table!`,
          hashtags: '#Hospitality #LocalBusiness #MSMEIndia #CommunityFirst'
        }
      ],
      advertising: [
        {
          type: 'Meta Ad Headline & Description',
          headline: `Discover Your New Favorite Cafe in ${district} — 15% Off Your First Visit!`,
          primaryText: `Tired of crowded, noisy spots? Experience handcrafted coffees, freshly prepared delicacies, and peaceful aesthetic ambiance right here at ${name} in ${district}. The perfect spot for work, conversations, and weekend catchups.`,
          cta: 'Claim 15% Cafe Voucher on WhatsApp'
        },
        {
          type: 'Local Pamphlet / Newspaper Insert Copy',
          headline: `ANNOUNCING THE OPENING OF ${name.toUpperCase()} IN ${location.toUpperCase()}`,
          bodyText: `Your neighborhood's newest destination for specialty coffees, freshly baked treats, and cozy ambiance.\n\n• Handcrafted espresso & gourmet coolers\n• Fresh oven bakes & wholesome snacks\n• Cozy work tables with high-speed WiFi\n\n🎁 SPECIAL INTRODUCTORY VOUCHER: Bring this flyer or show code "CAFEFIRST" on WhatsApp to get a COMPLIMENTARY treat with any drink!`,
          contactDetails: `Visit us in ${location} | WhatsApp reservations: +91 98765 43210.`
        },
        {
          type: 'Table Tent Card Copy (In-Store)',
          headline: 'Scan to Join Our VIP Coffee Club',
          bodyText: `Love the vibe at ${name}? Scan the QR code with your phone camera to join our WhatsApp VIP club for instant secret weekly discounts, free birthday treats, and priority event invites.`,
          cta: 'Scan QR with Phone Camera'
        }
      ],
      customerCommunication: [
        {
          type: 'Welcome New Customer Message',
          trigger: 'Sent after first visit / WhatsApp check-in',
          message: `Namaste! 🙏 Thank you for visiting us at ${name}. It was an absolute pleasure hosting you. We hope you loved your coffee and food! If you have any feedback or special requests for your next visit, reply directly to this chat.`
        },
        {
          type: 'Review Request (Google Maps)',
          trigger: 'Sent next morning after visit',
          message: `Hi there! Hope you enjoyed your time at ${name} in ${district}. As an independent local cafe, your honest review helps food lovers in town discover us. Could you spare 30 seconds to rate us on Google Maps? Here is the link: [google.maps.link]. Thank you for your support!`
        },
        {
          type: 'Weekend Re-engagement Message',
          trigger: 'Sent Friday afternoon to past diners',
          message: `Happy Friday! ☕ Planning your weekend hangout? At ${name}, we have fresh weekend specials and a cozy corner waiting for you and your friends. Reply "TABLE" to book a priority spot for this weekend!`
        },
        {
          type: 'Festival / Celebration Message',
          trigger: 'Festive seasons (Diwali, New Year, Valentine, Eid)',
          message: `Warm festive greetings from ${name}! ✨ Celebrate this joyful season with our handcrafted holiday menu specials and artisanal festive bakery gift boxes. Perfect for sharing warmth with loved ones!`
        }
      ]
    };
  }

  if (isAgriEquip) {
    return {
      socialMedia: [
        {
          type: 'Instagram / Facebook Post',
          headline: 'Cut Farming Labor Costs by 60% with Proven Local Machinery',
          content: `Attention progressive farmers of ${district}! 🚜🌾\n\nStruggling with labor shortages and rising cultivation expenses? At ${name}, we engineer durable, fuel-efficient ${product} designed specifically for local field conditions.\n\n⚙️ Proven Farmer Benefits:\n✔️ Complete 1 acre in 1/4th the manual time\n✔️ Ultra-low fuel consumption with guaranteed spare parts\n✔️ 1-year comprehensive workshop warranty with local service\n\n📍 Manufactured and serviced right here in ${location}. Book a free live demonstration on your own farmland today!\n\n👉 WhatsApp us or call directly to schedule your farm trial.`,
          hashtags: `#${name.replace(/\s+/g, '')} #FarmMechanization #${district.replace(/\s+/g, '')}Farmers #AgriTechIndia #MakeInIndia`
        },
        {
          type: 'YouTube / Reel Video Script',
          headline: '30-Second "Field Operation & Power Demonstration" Clip',
          content: `🎥 **Hook (0-3s)**: High-energy action shot of ${product} cutting effortlessly through tough weed-infested soil in one clean pass.\n\n⚙️ **Body (3-15s)**: Side-by-side timer comparison: 4 manual laborers struggling under sun vs 1 farmer operating ${name}'s equipment with ease.\n\n💡 **Value (15-25s)**: Farmer testimonial: "I saved ₹18,000 on labor in my very first crop cycle. The machine paid for itself in 3 months."\n\n🎯 **Call to Action (25-30s)**: "Try it on your own soil before you pay a single rupee! Call or WhatsApp for a free village demo."`,
          audioTip: 'Use dynamic upbeat regional instrumental rhythm with crisp natural machine audio.'
        },
        {
          type: 'WhatsApp Broadcast Message',
          headline: 'Free On-Field Machinery Demonstration This Week',
          content: `🚜 FREE VILLAGE DEMONSTRATION OF ${product.toUpperCase()} IN ${district.toUpperCase()}!\n\nSee how ${name}'s machinery works on real soil before buying.\n\n📅 Demonstration slots open for this Wednesday and Friday.\n\n💬 Reply "DEMO" with your village name to book a trial on your farm.`,
          cta: 'Reply "DEMO" to book free trial'
        },
        {
          type: 'LinkedIn Post (B2B & Institutional Procurement)',
          headline: 'Scaling Grassroots Farm Mechanization in Regional Clusters',
          content: `Smallholder farm productivity depends on accessible, reliable engineering. At ${name} in ${district}, we design implements that withstand demanding field conditions while remaining affordable for small farmers and FPOs.\n\nLooking to collaborate with regional Farmer Producer Organizations, CSR foundations, and Custom Hiring Centers to expand access. Open for institutional partnership discussions!`,
          hashtags: '#Agriculture #FPO #Mechanization #MSMEIndia'
        }
      ],
      advertising: [
        {
          type: 'Meta / Facebook Ad Copy',
          headline: `Save Labor & Boost Farm Yield with ${name} ${product}`,
          primaryText: `Farming shouldn't break your back or your wallet. Experience durable, fuel-efficient ${product} engineered for local soil in ${district}. Free on-farm demonstration available before purchase with local spare parts warranty.`,
          cta: 'Book Free Village Demo on WhatsApp'
        },
        {
          type: 'Local Pamphlet / Mandi Handout Copy',
          headline: `MODERN MECHANIZATION FOR PROGRESSIVE FARMERS — ${name.toUpperCase()}`,
          bodyText: `Stop wasting hard-earned money on costly manual labor.\n\n• Completes weeding, tilling & spraying 4x faster\n• Heavy-duty steel body built for rugged soil\n• 100% spare parts and local technician support in ${district}\n\n🎁 SPECIAL PRE-SEASON SUBSIDY/OFFER: Book this week and receive a FREE spare blade set and 6-month engine servicing kit!`,
          contactDetails: `Visit our center in ${location} or call / WhatsApp: +91 98765 43210.`
        },
        {
          type: 'Mandi Trade Stall Banner Copy',
          headline: 'Live Farm Machine Trial Stall',
          bodyText: `Test the power of ${name} ${product} with your own hands! Walk in for instant live trial and seasonal booking discount.`,
          cta: 'Step inside for live demonstration'
        }
      ],
      customerCommunication: [
        {
          type: 'Welcome New Equipment Owner Message',
          trigger: 'Sent immediately on machine delivery',
          message: `Namaste! 🙏 Congratulations on acquiring your new ${product} from ${name}. Your unit has undergone rigorous quality inspection. Our technician is on standby for any operating questions. Wishing you bountiful harvests!`
        },
        {
          type: 'First Service Check-in (14 Days)',
          trigger: 'Sent 14 days after delivery',
          message: `Namaste! How is your ${product} performing in the field? Our team would like to check oil levels and calibration. Reply "OK" or message us your village location for a routine check.`
        },
        {
          type: 'Customer Referral Incentive',
          trigger: 'Sent 30 days after purchase',
          message: `Hello! If a neighboring farmer purchases ${product} on your recommendation, we will gift you a ₹1,000 spare parts voucher as a token of gratitude for championing local engineering!`
        },
        {
          type: 'Pre-Sowing Season Reminder',
          trigger: 'Sent before peak agricultural season',
          message: `Auspicious sowing season is approaching! Bring your ${product} to ${name}'s workshop in ${location} for complimentary pre-season tune-up and blade sharpening.`
        }
      ]
    };
  }

  // Default Adaptive Content Studio for Services, Retail & Manufacturing
  return {
    socialMedia: [
      {
        type: 'Instagram Post',
        headline: `Craftsmanship, Quality & Local Trust in ${district}`,
        content: `At ${name}, we believe in zero compromises. Serving our community in ${location}, our mission is delivering dependable, exceptional ${product}.\n\n✨ Why our clients trust us:\n✔️ Verified quality & craftsmanship\n✔️ Transparent local pricing with zero hidden charges\n✔️ Direct accountability & post-sale support\n\n📍 Visit our center right here in ${location}. First-time clients enjoy an introductory 10% privilege discount!\n\n👉 Send us a message or WhatsApp directly to learn more.`,
        hashtags: `#${name.replace(/\s+/g, '')} #LocalBusiness #${district.replace(/\s+/g, '')} #VocalForLocal #QualityFirst`
      },
      {
        type: 'Instagram Reel Script Idea',
        headline: `30-Second "Behind The Scenes & Quality Delivery" Reel`,
        content: `🎥 **Hook (0-3s)**: Fast visual cut revealing the finished excellence of ${product} with engaging sound.\n\n⚙️ **Body (3-15s)**: Dynamic walkthrough showing careful precision, authentic materials, and skilled attention to detail at ${name} in ${district}.\n\n💡 **Value (15-25s)**: "No shortcuts. Just reliable quality backed by verified local accountability."\n\n🎯 **Call to Action (25-30s)**: "Get your personalized consultation or quotation today! WhatsApp us directly via the link in bio."`,
        audioTip: 'Use crisp modern upbeat track with clear natural sound effects.'
      },
      {
        type: 'WhatsApp Status Update',
        headline: 'New Bookings & Weekly Availability Alert',
        content: `🟢 READY FOR ORDERS & CONSULTATIONS AT ${name.toUpperCase()}!\n\nNow accepting bookings for ${product} across ${district}.\n\n📦 Special introductory slots available this week.\n\n💬 Reply "DETAILS" directly to this status for immediate catalog and pricing.`,
        cta: 'Reply directly to reserve'
      },
      {
        type: 'LinkedIn Post (B2B & Institutional)',
        headline: `Strengthening Regional Enterprise & Supply Value in ${district}`,
        content: `Grassroots economic growth is built through reliable regional enterprises. At ${name} in ${district}, we take pride in delivering dependable ${product} tailored to real customer requirements.\n\nLooking to collaborate with regional distributors, institutional procurement partners, and local enterprises. Open for business discussions!`,
        hashtags: '#MSMEIndia #SupplyChain #MakeInIndia #Entrepreneurship'
      }
    ],
    advertising: [
      {
        type: 'Meta Ad Headline & Description',
        headline: `Dependable, Quality ${product} in ${location} — Introductory Offer`,
        primaryText: `Looking for trusted quality without mass-market shortcuts? Experience personalized, verified ${product} right here in ${district} with ${name}. Exceptional local service backed by genuine accountability.`,
        cta: 'Inquire on WhatsApp'
      },
      {
        type: 'Local Pamphlet / Newspaper Insert Copy',
        headline: `ANNOUNCING THE LAUNCH OF ${name.toUpperCase()} IN ${location.toUpperCase()}`,
        bodyText: `Your neighborhood's trusted partner for premium ${product}.\n\n• Uncompromising quality standards\n• Transparent pricing & local warranty\n• Prompt delivery and dedicated client care\n\n🎁 SPECIAL INTRODUCTORY OFFER: Present this voucher code "FIRST10" or message us on WhatsApp to claim a special privilege discount on your first order!`,
        contactDetails: `Visit our center in ${location} or call / WhatsApp: +91 98765 43210.`
      },
      {
        type: 'Shop Counter Display Tent Card Copy',
        headline: 'Scan to Join Our VIP WhatsApp Club',
        bodyText: `Scan the QR code below to receive direct weekly updates, priority booking alerts, and exclusive member savings on ${product}.`,
        cta: 'Scan QR with Phone Camera'
      }
    ],
    customerCommunication: [
      {
        type: 'Welcome New Customer Message',
        trigger: 'Sent immediately after initial purchase / order',
        message: `Namaste! 🙏 Thank you for choosing ${name}. Your order of ${product} is handled with the utmost care. If you have any questions or feedback, we are just a WhatsApp message away!`
      },
      {
        type: 'Review Request (Google Maps / WhatsApp)',
        trigger: 'Sent 3 days after order completion',
        message: `Hi there! Hope you are delighted with your experience with ${name} in ${district}. Your honest review helps fellow community members find trusted local providers. Could you spare 30 seconds to rate us on Google Maps? Here is the link: [google.maps.link]. Thank you!`
      },
      {
        type: 'Repeat Purchase Re-engagement',
        trigger: 'Sent 25 days after last interaction',
        message: `Hello! We wanted to check in and see how everything is going with ${product} from ${name}. We have exciting new updates and offers available this week. Reply "YES" and we will send you our latest catalog!`
      },
      {
        type: 'Festival / Seasonal Campaign Message',
        trigger: 'Festive seasons (Diwali, Eid, New Year)',
        message: `Warm festive greetings from all of us at ${name}! 🪔 Celebrate this auspicious season with special festive discounts and priority services on ${product}. Wishing you and your family joy and prosperity!`
      }
    ]
  };
}

/**
 * Generates Advertising Planner recommendations with daily budgets and estimated KPIs,
 * tailored to the business domain and platform characteristics.
 */
export function generateAdvertisingPlans(profile, monthlyBudget = 30000) {
  const ctx = extractProfileContext(profile);
  const b = Math.max(0, Number(monthlyBudget) || 0);
  const { name, product, domainInfo, district } = ctx;

  const key = domainInfo.domainKey;
  const isCafe = key === BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT;
  const isAgriEquip = key === BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY;

  const instaBudget = Math.min(8000, Math.round(b * 0.35));
  const googleBudget = Math.min(6000, Math.round(b * 0.25));
  const localBudget = Math.min(4000, Math.round(b * 0.15));

  if (isCafe) {
    return [
      {
        id: 'ad_plan_1',
        platform: 'Instagram & Facebook (Meta Visual Ads)',
        objective: 'Cafe Footfall & WhatsApp Table Reservations',
        targetAudience: `Men & Women (18–42 yrs) within 4 km of ${district} interested in cafes, coffee, desserts & casual dining`,
        dailyBudget: Math.max(150, Math.round(instaBudget / 20)),
        campaignDuration: '20 Days',
        totalCost: instaBudget,
        creativeType: '15-sec Food & Ambiance Video Reel + Carousel Menu',
        estimatedReach: `${Math.round(instaBudget * 2.2)}–${Math.round(instaBudget * 3.1)} local diners`,
        estimatedClicks: `${Math.round(instaBudget * 0.10)}–${Math.round(instaBudget * 0.15)} menu clicks / reservations`,
        estimatedCostPerInquiry: '₹8–₹14 per guest inquiry',
        status: 'RECOMMENDED'
      },
      {
        id: 'ad_plan_2',
        platform: 'Google Business & Maps Promoted Pin',
        objective: 'Local High-Intent Dining Searches ("cafe near me")',
        targetAudience: `People actively searching "best cafe", "coffee shop", or "bistro" in ${district}`,
        dailyBudget: Math.max(150, Math.round(googleBudget / 25)),
        campaignDuration: '25 Days',
        totalCost: googleBudget,
        creativeType: 'Promoted Google Maps Pin with Star Rating & Food Photos',
        estimatedReach: `${Math.round(googleBudget * 1.2)}–${Math.round(googleBudget * 1.8)} high-intent searches`,
        estimatedClicks: `${Math.round(googleBudget * 0.08)}–${Math.round(googleBudget * 0.12)} direct navigation directions & calls`,
        estimatedCostPerInquiry: '₹12–₹18 per direct walk-in click',
        status: 'RECOMMENDED'
      },
      {
        id: 'ad_plan_3',
        platform: 'Campus & High-Density Society Pop-up Activation',
        objective: 'Neighborhood Youth & Office Regulars',
        targetAudience: `Students & young professionals in residential societies & colleges within 2 km`,
        dailyBudget: 'Weekend pop-up event setup',
        campaignDuration: '2 Weekends',
        totalCost: localBudget,
        creativeType: 'Standee Banner, QR Discount Coupon Cards & Free Tasting Cups',
        estimatedReach: '1,200–1,800 local residents & students',
        estimatedClicks: '250+ direct cafe visits & WhatsApp signups',
        estimatedCostPerInquiry: '₹10–₹16 per acquired regular',
        status: 'OPTIONAL'
      }
    ];
  }

  if (isAgriEquip) {
    return [
      {
        id: 'ad_plan_1',
        platform: 'Facebook & YouTube Video Ads',
        objective: 'Farmer Field Demo Requests via WhatsApp',
        targetAudience: `Rural farmers & landowners (25–58 yrs) across agricultural blocks in ${district}`,
        dailyBudget: Math.max(150, Math.round(instaBudget / 20)),
        campaignDuration: '20 Days',
        totalCost: instaBudget,
        creativeType: 'Vernacular 25-sec Real Farm Soil Working Video',
        estimatedReach: `${Math.round(instaBudget * 1.6)}–${Math.round(instaBudget * 2.2)} local farmers`,
        estimatedClicks: `${Math.round(instaBudget * 0.06)}–${Math.round(instaBudget * 0.09)} direct WhatsApp demo requests`,
        estimatedCostPerInquiry: '₹20–₹35 per verified farmer lead',
        status: 'RECOMMENDED'
      },
      {
        id: 'ad_plan_2',
        platform: 'Google Local Search & Maps Listing',
        objective: 'Commercial Agriculture Equipment Searches',
        targetAudience: `Buyers searching "farm tools near me", "tiller price", "agri machinery workshop"`,
        dailyBudget: Math.max(150, Math.round(googleBudget / 25)),
        campaignDuration: '25 Days',
        totalCost: googleBudget,
        creativeType: 'Google Search Ad with Call Button & Workshop Directions',
        estimatedReach: `${Math.round(googleBudget * 0.8)}–${Math.round(googleBudget * 1.2)} high-intent agricultural searches`,
        estimatedClicks: `${Math.round(googleBudget * 0.05)}–${Math.round(googleBudget * 0.08)} direct workshop calls`,
        estimatedCostPerInquiry: '₹25–₹40 per commercial inquiry',
        status: 'RECOMMENDED'
      },
      {
        id: 'ad_plan_3',
        platform: 'Block Mandi Demonstration Booth & Standee',
        objective: 'Tangible Physical Demonstration & Instant Bookings',
        targetAudience: `Progressive farmers attending weekly agricultural trade mandis`,
        dailyBudget: 'Peak weekly market day setup',
        campaignDuration: '3 Mandi Days',
        totalCost: localBudget,
        creativeType: 'Demonstration Machine on Ramp, Specs Standee & Vernacular Handbills',
        estimatedReach: '800–1,500 active commercial farmers',
        estimatedClicks: '80+ direct machine trials & contact registrations',
        estimatedCostPerInquiry: '₹30–₹50 per high-intent buyer',
        status: 'OPTIONAL'
      }
    ];
  }

  // Default Advertising Plans for Services, Retail & Manufacturing
  return [
    {
      id: 'ad_plan_1',
      platform: 'Instagram & Facebook (Meta Ads)',
      objective: 'Customer Acquisition via WhatsApp Link',
      targetAudience: `Target buyers in ${district} interested in ${domainInfo.tradeCategory}`,
      dailyBudget: Math.max(150, Math.round(instaBudget / 20)),
      campaignDuration: '20 Days',
      totalCost: instaBudget,
      creativeType: 'Product Showcase Carousel & Benefit Video',
      estimatedReach: `${Math.round(instaBudget * 1.8)}–${Math.round(instaBudget * 2.6)} targeted local buyers`,
      estimatedClicks: `${Math.round(instaBudget * 0.08)}–${Math.round(instaBudget * 0.12)} direct WhatsApp inquiries`,
      estimatedCostPerInquiry: '₹12–₹18 per inquiry',
      status: 'RECOMMENDED'
    },
    {
      id: 'ad_plan_2',
      platform: 'Google Business & Search Maps Promoted Pin',
      objective: `Local Intent Capture (Searches for "${product} near me")`,
      targetAudience: `Local buyers actively searching for ${product} in your district`,
      dailyBudget: Math.max(150, Math.round(googleBudget / 25)),
      campaignDuration: '25 Days',
      totalCost: googleBudget,
      creativeType: 'Google Maps Promoted Pin & Search Headline',
      estimatedReach: `${Math.round(googleBudget * 1.0)}–${Math.round(googleBudget * 1.5)} high-intent searches`,
      estimatedClicks: `${Math.round(googleBudget * 0.06)}–${Math.round(googleBudget * 0.09)} direct store calls / navigations`,
      estimatedCostPerInquiry: '₹15–₹25 per direct call',
      status: 'RECOMMENDED'
    },
    {
      id: 'ad_plan_3',
      platform: 'Local Community Society Kiosks & Printed Displays',
      objective: 'Local Neighborhood Trust & Word of Mouth',
      targetAudience: 'High-density residential apartment complexes and commercial markets',
      dailyBudget: 'Weekend activation setup',
      campaignDuration: '2 Weekends',
      totalCost: localBudget,
      creativeType: 'Standee Banner, Information Flyers & QR Cards',
      estimatedReach: '800–1,200 neighborhood residents',
      estimatedClicks: '150+ direct contacts & conversations',
      estimatedCostPerInquiry: '₹20–₹30 per customer acquired',
      status: 'OPTIONAL'
    }
  ];
}
