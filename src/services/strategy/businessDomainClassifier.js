/**
 * Business Domain & Semantic Profiling Classifier
 * 
 * Deeply analyzes:
 * - business.description (e.g. "makes cost effective innovative farming equipments for farmers")
 * - business.productService (e.g. "Farming equipment, small weeders, seeders")
 * - business.name (e.g. "AgriGrow")
 * - business.targetCustomers (e.g. "Farmers, cooperatives")
 * - business.sector
 * 
 * Principle:
 * NEVER make crude keyword assumptions (like thinking any "Agri" or "Farm" means "Dairy Milk & Halwais").
 * Intelligently recognizes specific trades: Farm Equipment, Food Processing, Dairy, Manufacturing, etc.
 */

export const BUSINESS_DOMAINS = {
  AGRI_EQUIPMENT_MACHINERY: 'AGRI_EQUIPMENT_MACHINERY',
  AGRI_CROP_FARMING: 'AGRI_CROP_FARMING',
  AGRI_INPUTS: 'AGRI_INPUTS',
  AGRI_FOOD_PROCESSING: 'AGRI_FOOD_PROCESSING',
  DAIRY_ANIMAL_HUSBANDRY: 'DAIRY_ANIMAL_HUSBANDRY',
  HOSPITALITY_CAFE_RESTAURANT: 'HOSPITALITY_CAFE_RESTAURANT',
  HEALTH_MEDICAL_WELLNESS: 'HEALTH_MEDICAL_WELLNESS',
  EDUCATION_COACHING_ACADEMY: 'EDUCATION_COACHING_ACADEMY',
  BEAUTY_SALON_PERSONAL_CARE: 'BEAUTY_SALON_PERSONAL_CARE',
  PROFESSIONAL_CREATIVE_SERVICES: 'PROFESSIONAL_CREATIVE_SERVICES',
  ARTISAN_HANDICRAFT_DECOR: 'ARTISAN_HANDICRAFT_DECOR',
  MANUFACTURING_FABRICATION: 'MANUFACTURING_FABRICATION',
  TEXTILE_APPAREL_FASHION: 'TEXTILE_APPAREL_FASHION',
  TECH_ELECTRONICS_REPAIR: 'TECH_ELECTRONICS_REPAIR',
  RETAIL_KIRANA_COMMERCE: 'RETAIL_KIRANA_COMMERCE',
  SERVICES_LOGISTICS_TRANSPORT: 'SERVICES_LOGISTICS_TRANSPORT',
  HEALTH_EDUCATION_HOSPITALITY: 'HEALTH_EDUCATION_HOSPITALITY',
  GENERAL_ENTERPRISE: 'GENERAL_ENTERPRISE'
};

export function classifyBusinessDomain(business = {}, personal = {}) {
  const name = (business.name || '').toLowerCase();
  const desc = (business.description || '').toLowerCase();
  const product = (business.productService || '').toLowerCase();
  const target = (business.targetCustomers || '').toLowerCase();
  const sector = (business.sector || '').toLowerCase();
  const type = (business.type || '').toLowerCase();

  const combinedText = `${name} ${desc} ${product} ${target} ${sector} ${type}`.toLowerCase();

  // 1. HOSPITALITY, CAFE, BAKERY, RESTAURANT & FOOD SERVICE
  const cafeRestaurantKeywords = [
    'cafe', 'coffee', 'bistro', 'restaurant', 'bakery', 'cloud kitchen', 'food truck',
    'catering', 'diner', 'dhaba', 'eatery', 'tea shop', 'chai', 'mithai', 'sweet shop',
    'pizzeria', 'burger', 'snacks', 'fast food', 'barista', 'patisserie', 'confectionery',
    'takeaway', 'dine-in', 'hospitality', 'beverage', 'juice bar', 'shakes', 'waffle'
  ];
  if (cafeRestaurantKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.HOSPITALITY_CAFE_RESTAURANT,
      domainTitle: 'Cafe, Restaurant & Food Service',
      tradeCategory: 'Food & Beverage Hospitality',
      primaryTargetAudience: 'Local Residents, Office Workers, Students, Families & Dine-in Guests',
      unitTypeLabel: 'Order / Table Bill',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: true,
      isService: true,
      isRetail: true,
      isB2B: false,
      summaryExplanation: 'Food service and hospitality enterprise serving freshly prepared beverages, artisanal baked goods, meals, or dine-in/takeaway hospitality experiences.'
    };
  }

  // 2. AGRICULTURAL EQUIPMENT, FARM MACHINERY & AGRI-TOOLS
  const equipKeywords = [
    'equipment', 'equipments', 'machinery', 'machine', 'machines', 'implement', 'implements',
    'tool', 'tools', 'tractor', 'tiller', 'power tiller', 'weeder', 'sprayer', 'harvester',
    'thresher', 'seed drill', 'plough', 'plow', 'irrigation equipment', 'drip', 'solar pump',
    'farm mechanization', 'farming equipment', 'farming tool', 'agritech hardware',
    'agricultural equipment', 'farming tools', 'combine', 'cultivator', 'rotavator'
  ];
  const hasEquipKeyword = equipKeywords.some(k => combinedText.includes(k));
  const isFarmerTargeted = combinedText.includes('farmer') || combinedText.includes('farming') || combinedText.includes('agriculture') || combinedText.includes('agri');

  if (hasEquipKeyword && isFarmerTargeted) {
    return {
      domainKey: BUSINESS_DOMAINS.AGRI_EQUIPMENT_MACHINERY,
      domainTitle: 'Agricultural Equipment & Farm Machinery',
      tradeCategory: 'Manufacturing & Engineering',
      primaryTargetAudience: 'Smallholder & Commercial Farmers, FPOs, CHCs, and Agro-Dealers',
      unitTypeLabel: 'Equipment / Implement Unit',
      isMachinery: true,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: false,
      isB2B: true,
      summaryExplanation: 'Enterprise designing, fabricating, assembling, or distributing mechanization tools, implements, and machinery to increase agricultural productivity.'
    };
  }

  // 3. DAIRY & ANIMAL HUSBANDRY (Strict check: must explicitly mention milk, dairy, cattle, cow, buffalo, poultry, goat)
  const dairyKeywords = [
    'dairy', 'milk', 'dudhiya', 'cow', 'buffalo', 'cattle', 'ghee', 'paneer', 'butter', 'curd',
    'poultry', 'broiler', 'layer', 'egg', 'goat farming', 'sheep', 'piggery', 'fishery', 'fish farm',
    'aquaculture', 'animal husbandry', 'livestock'
  ];
  const hasDairyKeyword = dairyKeywords.some(k => combinedText.includes(k));
  if (hasDairyKeyword && !hasEquipKeyword) {
    return {
      domainKey: BUSINESS_DOMAINS.DAIRY_ANIMAL_HUSBANDRY,
      domainTitle: 'Dairy & Animal Husbandry',
      tradeCategory: 'Livestock & Dairy Production',
      primaryTargetAudience: 'Households, Tea Stalls, Sweet Manufacturers (Halwais), and Dairy Unions',
      unitTypeLabel: 'Liter / Kilogram',
      isMachinery: false,
      isFoodOrDairy: true,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: true,
      summaryExplanation: 'Enterprise engaged in dairy farming, milk collection, chilling, livestock rearing, or poultry/fishery production.'
    };
  }

  // 4. AGRO & FOOD PROCESSING (Value-addition to raw farm produce)
  const foodProcessingKeywords = [
    'food processing', 'flour mill', 'atta chakki', 'oil mill', 'oil expeller',
    'spice grinding', 'masala', 'fruit pulp', 'puree', 'pickle', 'jam', 'jelly', 'honey',
    'chips', 'dal mill', 'rice mill', 'organic food', 'packaged food', 'cold pressed', 'edible oil'
  ];
  if (foodProcessingKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.AGRI_FOOD_PROCESSING,
      domainTitle: 'Agro & Food Processing',
      tradeCategory: 'Value-Added Food Manufacturing',
      primaryTargetAudience: 'Retail Consumers, Kirana Stores, Supermarkets, and Bulk Food Brands',
      unitTypeLabel: 'Pack / Kilogram',
      isMachinery: false,
      isFoodOrDairy: true,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: true,
      summaryExplanation: 'Enterprise transforming raw agricultural harvests into packaged, processed food products and culinary ingredients.'
    };
  }

  // 5. HEALTH, MEDICAL & WELLNESS
  const healthKeywords = [
    'clinic', 'doctor', 'dental', 'dentist', 'physiotherapy', 'pharmacy', 'medical',
    'diagnostic', 'pathology', 'ayurveda', 'homeopathy', 'gym', 'fitness', 'yoga', 'wellness'
  ];
  if (healthKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.HEALTH_MEDICAL_WELLNESS,
      domainTitle: 'Healthcare, Clinic & Wellness',
      tradeCategory: 'Healthcare & Wellness Services',
      primaryTargetAudience: 'Patients, Families, Fitness Enthusiasts & Local Residents',
      unitTypeLabel: 'Consultation / Session / Package',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: false,
      summaryExplanation: 'Healthcare, medical clinic, physical therapy, diagnostic care, or wellness fitness enterprise serving patient and community health.'
    };
  }

  // 6. EDUCATION, COACHING & SKILL TRAINING
  const eduKeywords = [
    'coaching', 'tuition', 'institute', 'academy', 'classes', 'training center',
    'school', 'playschool', 'daycare', 'dance academy', 'music school', 'computer training'
  ];
  if (eduKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.EDUCATION_COACHING_ACADEMY,
      domainTitle: 'Education, Coaching & Skill Academy',
      tradeCategory: 'Education & Training Services',
      primaryTargetAudience: 'Students, Aspirants, Working Professionals & Parents',
      unitTypeLabel: 'Student Enrollment / Course Fee',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: false,
      summaryExplanation: 'Educational tutoring, academic coaching, vocational skill development, or creative training institution.'
    };
  }

  // 7. BEAUTY, SALON & PERSONAL CARE
  const beautyKeywords = [
    'salon', 'beauty parlour', 'parlor', 'spa', 'barber', 'haircut', 'makeup',
    'skincare', 'cosmetics', 'nail art', 'grooming'
  ];
  if (beautyKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.BEAUTY_SALON_PERSONAL_CARE,
      domainTitle: 'Beauty Salon, Spa & Personal Care',
      tradeCategory: 'Personal Care & Grooming Services',
      primaryTargetAudience: 'Local Residents, Brides/Grooms, Working Professionals & Students',
      unitTypeLabel: 'Service Appointment / Package',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: false,
      summaryExplanation: 'Personal styling, hairdressing, aesthetic skincare, beauty therapy, and bridal makeover services.'
    };
  }

  // 8. PROFESSIONAL, CREATIVE & BUSINESS SERVICES
  const profKeywords = [
    'consulting', 'accounting', 'chartered accountant', 'legal', 'lawyer', 'taxation',
    'photography', 'photo studio', 'videography', 'event management', 'graphic design',
    'advertising agency', 'printing press', 'digital marketing agency', 'architect'
  ];
  if (profKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.PROFESSIONAL_CREATIVE_SERVICES,
      domainTitle: 'Professional, Creative & Business Services',
      tradeCategory: 'Professional & Creative Services',
      primaryTargetAudience: 'Local Businesses, Event Hosts, MSME Founders & Individual Clients',
      unitTypeLabel: 'Project / Client Retainer',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: true,
      summaryExplanation: 'Specialized professional advisory, accounting, media creation, event execution, or creative design consultancy.'
    };
  }

  // 9. ARTISAN, HANDICRAFT & HOME DECOR
  const artisanKeywords = [
    'handicraft', 'handicrafts', 'pottery', 'clay', 'artisan', 'handmade', 'candle',
    'bamboo', 'jute', 'leather craft', 'home decor', 'wooden craft', 'sculpture'
  ];
  if (artisanKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.ARTISAN_HANDICRAFT_DECOR,
      domainTitle: 'Handicrafts, Artisan & Creative Goods',
      tradeCategory: 'Artisan & Cultural Manufacturing',
      primaryTargetAudience: 'Direct Consumers, Gift Buyers, Tourists, Boutique Stores & Corporate Gifting',
      unitTypeLabel: 'Crafted Piece / Set',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: true,
      summaryExplanation: 'Indigenous craftwork, handmade lifestyle artifacts, pottery, and artistic utility goods celebrating traditional craftsmanship.'
    };
  }

  // 10. TEXTILE, GARMENT & TAILORING
  const textileKeywords = [
    'tailor', 'tailoring', 'garment', 'garments', 'boutique', 'cloth', 'apparel', 'textile',
    'stitching', 'dress', 'kurta', 'blouse', 'suit', 'embroidery', 'handloom', 'uniform', 'fashion'
  ];
  if (textileKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.TEXTILE_APPAREL_FASHION,
      domainTitle: 'Textiles, Garment Manufacturing & Tailoring',
      tradeCategory: 'Apparel & Fashion Craft',
      primaryTargetAudience: 'Individual Consumers, Students, Brides, and Local Retail Boutiques',
      unitTypeLabel: 'Garment / Stitching Job',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: false,
      summaryExplanation: 'Custom tailoring, apparel manufacturing, fashion design, or garment alterations.'
    };
  }

  // 11. TECH, ELECTRONICS & SMARTPHONE REPAIR
  const techKeywords = [
    'mobile repair', 'phone repair', 'smartphone', 'electronic', 'electronics', 'computer',
    'laptop', 'cctv', 'solar installation', 'solar', 'digital service', 'software', 'it service'
  ];
  if (techKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.TECH_ELECTRONICS_REPAIR,
      domainTitle: 'Electronics, Mobile Repair & Technical Services',
      tradeCategory: 'Technical Services & Repair',
      primaryTargetAudience: 'Local Residents, Students, Micro-Merchants, and Small Businesses',
      unitTypeLabel: 'Service Repair Job / Device',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: false,
      summaryExplanation: 'Hardware diagnostics, screen replacements, gadget maintenance, and technical installations.'
    };
  }

  // 12. MANUFACTURING, FABRICATION & WORKSHOP
  const mfgKeywords = [
    'manufacturing', 'fabrication', 'workshop', 'welding', 'carpentry', 'furniture',
    'hardware', 'metal', 'steel', 'plastic', 'packaging material', 'building material', 'bricks'
  ];
  if (mfgKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.MANUFACTURING_FABRICATION,
      domainTitle: 'Light Manufacturing & Engineering Fabrication',
      tradeCategory: 'Manufacturing & Industrial Production',
      primaryTargetAudience: 'Contractors, Local Businesses, Retail Builders, and Institutional Buyers',
      unitTypeLabel: 'Manufactured Unit / Batch',
      isMachinery: true,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: false,
      isB2B: true,
      summaryExplanation: 'Fabrication of physical goods, metal structures, parts, or industrial consumables.'
    };
  }

  // 13. RETAIL, GROCERY & KIRANA
  const retailKeywords = [
    'grocery', 'kirana', 'supermarket', 'retail shop', 'store', 'trading', 'wholesaler',
    'distributor', 'provisions', 'fmcg retail', 'merchant'
  ];
  if (retailKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.RETAIL_KIRANA_COMMERCE,
      domainTitle: 'Retail Commerce & Kirana Store',
      tradeCategory: 'Retail Trade',
      primaryTargetAudience: 'Neighborhood Families and Walk-in Consumers',
      unitTypeLabel: 'Basket / Transaction Order',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: false,
      summaryExplanation: 'Retail distribution and consumer goods merchandising.'
    };
  }

  // 14. LOGISTICS & TRANSPORT
  const transportKeywords = ['transport', 'logistics', 'delivery', 'cargo', 'truck', 'auto', 'warehouse'];
  if (transportKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.SERVICES_LOGISTICS_TRANSPORT,
      domainTitle: 'Logistics, Transport & Supply Services',
      tradeCategory: 'Logistics & Transportation',
      primaryTargetAudience: 'Local Farmers, Merchants, Wholesalers, and Mandi Shippers',
      unitTypeLabel: 'Trip / Consignment',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: true,
      isRetail: false,
      isB2B: true,
      summaryExplanation: 'Local and inter-district goods transport, last-mile delivery, or freight logistics.'
    };
  }

  // 15. AGRI-INPUTS & CROP PRODUCTION
  const agriCropKeywords = [
    'crop cultivation', 'vegetable farming', 'horticulture', 'floriculture', 'organic farming',
    'nursery', 'seedling', 'mushroom farming', 'hydroponics', 'polyhouse', 'greenhouse farming'
  ];
  if (agriCropKeywords.some(k => combinedText.includes(k))) {
    return {
      domainKey: BUSINESS_DOMAINS.AGRI_CROP_FARMING,
      domainTitle: 'Commercial Crop & Horticulture Production',
      tradeCategory: 'Agricultural Production',
      primaryTargetAudience: 'Wholesale Mandi Traders, Local Retail Vendors, and Direct Consumers',
      unitTypeLabel: 'Quintal / Kilogram',
      isMachinery: false,
      isFoodOrDairy: false,
      isFoodServiceOrCafe: false,
      isService: false,
      isRetail: true,
      isB2B: true,
      summaryExplanation: 'Direct cultivation of cash crops, vegetables, flowers, mushrooms, or fruit plantations.'
    };
  }

  // 16. DEFAULT / GENERAL ENTERPRISE (Derive title gracefully)
  return {
    domainKey: BUSINESS_DOMAINS.GENERAL_ENTERPRISE,
    domainTitle: business.sector ? `${business.sector} Enterprise` : 'Local Micro-Enterprise',
    tradeCategory: business.sector || 'General Commerce',
    primaryTargetAudience: business.targetCustomers || 'Local Consumers & Regional Retailers',
    unitTypeLabel: 'Standard Unit / Service',
    isMachinery: false,
    isFoodOrDairy: false,
    isFoodServiceOrCafe: false,
    isService: sector.includes('service'),
    isRetail: sector.includes('retail'),
    isB2B: sector.includes('b2b') || sector.includes('wholesale'),
    summaryExplanation: business.description || 'Specialized commercial goods or professional services tailored to regional demand.'
  };
}
