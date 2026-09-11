/**
 * Verified Expert Consultants Data & Personas
 * For Funding Page (Chartered Accountant / Finance Expert)
 * and Strategy Page (Business Analyst / Strategy Expert)
 */

export const FUNDING_EXPERT = {
  id: 'ca_finance',
  domain: 'funding',
  name: 'CA Rajesh Singhania, FCA',
  role: 'Chartered Accountant & MSME Project Finance Lead',
  title: 'Senior CA & Banking DPR Specialist',
  qualification: 'Fellow Chartered Accountant (FCA), DISA (ICAI), Ex-SBI Credit Manager',
  regNumber: 'ICAI Reg. No. 084729 / MSME-V-2021',
  avatarInitials: 'RS',
  avatarBg: 'bg-emerald-600',
  themeColor: 'emerald',
  experience: '14+ Years Banking & Subsidies',
  rating: 4.9,
  reviewsCount: 342,
  consultationsCompleted: '850+',
  location: 'Mumbai & Pan-India (Virtual / Telephonic)',
  languages: ['English', 'Hindi', 'Marathi'],
  verified: true,
  isOnline: true,
  typicalResponseTime: 'Under 2 minutes',
  
  bio: 'Former Senior Credit Appraiser at a premier nationalized bank turned independent MSME financial architect. CA Rajesh has helped over 850+ entrepreneurs successfully prepare bank-grade DPRs, resolve credit appraisal bottlenecks, and unlock ₹45+ Crores in collateral-free CGTMSE & PMEGP funding.',

  fees: {
    firstCallFree: true,
    firstCallDuration: '15 Mins',
    firstCallPrice: 'FREE (₹0)',
    standardPrice: '₹499',
    standardDuration: '30 Mins Advisory Session',
    dprReviewPrice: '₹1,499',
    dprReviewDuration: 'Detailed Bank DPR & CMA Data Audit',
    guarantee: '100% Satisfaction or No Questions Asked Refund'
  },

  specialties: [
    'Bank DPR Preparation & CMA Data Structuring',
    'PMEGP & CGTMSE Subsidy Sanctioning',
    'Working Capital vs. Term Loan Optimization',
    'Collateral-Free Bank Appraisal Criteria',
    'GST, Udyam & Statutory MSME Compliance'
  ],

  badges: [
    'Verified FCA Member',
    'Ex-Bank Credit Officer',
    'CGTMSE Specialist',
    '1st Call Free'
  ],

  suggestedQuestions: [
    'How do I make my project report bank-ready for CGTMSE?',
    'Am I eligible for the 35% PMEGP government capital subsidy?',
    'What should be my ideal equity margin contribution?',
    'How do banks assess debt service coverage ratio (DSCR)?'
  ],

  welcomeMessage: (profile) => {
    const bizName = profile?.business?.name || 'your enterprise';
    const district = profile?.personalInfo?.district || 'your local district';
    return `Namaste! I'm **CA Rajesh Singhania**. I've reviewed your estimated funding figures and capital requirements for **${bizName}** in **${district}**.\n\nWhether you need advice on structuring your bank project report (DPR), obtaining collateral-free CGTMSE loans, or maximizing government scheme subsidies, I am here to help.\n\n💡 **Good news:** Your initial 15-minute 1-on-1 discovery call is **100% FREE (₹0)**! You can also ask me any question directly in this chat.`;
  }
};

export const STRATEGY_EXPERT = {
  id: 'strategy_analyst',
  domain: 'strategy',
  name: 'Ananya Sen, MBA',
  role: 'Lead Business Analyst & Market Expansion Strategist',
  title: 'Senior Enterprise Strategy Consultant',
  qualification: 'MBA (IIM Calcutta) • Certified MSME Growth Analyst',
  regNumber: 'MCKIN-ALUM / MSME-STRAT-941',
  avatarInitials: 'AS',
  avatarBg: 'bg-indigo-600',
  themeColor: 'indigo',
  experience: '11+ Years Market Strategy & Unit Economics',
  rating: 4.9,
  reviewsCount: 288,
  consultationsCompleted: '620+',
  location: 'Bengaluru & Pan-India (Virtual / Telephonic)',
  languages: ['English', 'Hindi', 'Bengali'],
  verified: true,
  isOnline: true,
  typicalResponseTime: 'Under 2 minutes',

  bio: 'Specialist business analyst with 11+ years consulting micro and small enterprises across Tier-2/3 Indian markets. Ananya specializes in deciphering hyper-local catchment demographics, fixing unit economics leaks, and crafting high-margin differentiation moats against entrenched incumbents.',

  fees: {
    firstCallFree: true,
    firstCallDuration: '15 Mins',
    firstCallPrice: 'FREE (₹0)',
    standardPrice: '₹499',
    standardDuration: '30 Mins Advisory Session',
    strategyReviewPrice: '₹1,299',
    strategyReviewDuration: 'Full Market Catchment & Go-To-Market Blueprint',
    guarantee: '100% Satisfaction or No Questions Asked Refund'
  },

  specialties: [
    '5–10 km Hyper-Local Catchment Demand Mapping',
    'Unit Economics & Contribution Margin Optimization',
    'Competitor Benchmarking & Strategic Moats',
    'Low-Cost Go-To-Market & Channel Distribution',
    'Seasonality & Supply-Chain Risk Mitigation'
  ],

  badges: [
    'IIM Calcutta Alum',
    'Tier-2/3 Market Specialist',
    'Unit Economics Expert',
    '1st Call Free'
  ],

  suggestedQuestions: [
    'How can I differentiate against entrenched local retailers?',
    'Is my product pricing aligned with district purchasing power?',
    'What low-cost distribution channels yield maximum margin retention?',
    'How do I calculate my true monthly break-even sales volume?'
  ],

  welcomeMessage: (profile) => {
    const bizName = profile?.business?.name || 'your enterprise';
    const sector = profile?.business?.sector || 'your industry';
    return `Hello! I'm **Ananya Sen**, your dedicated Business Strategy Analyst. I've analyzed your local market feasibility data for **${bizName}** in the **${sector}** sector.\n\nFrom validating customer segments and fixing pricing margins to identifying unserved gaps in your 5–10 km radius, I'm here to ensure your business roadmap is battle-tested.\n\n🎯 **Remember:** Your first 15-minute strategic evaluation call is **completely FREE (₹0)**! Feel free to ask any question here or book your slot.`;
  }
};
