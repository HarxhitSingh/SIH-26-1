import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  MapPin,
  Building2,
  IndianRupee,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Edit3,
  HelpCircle,
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBusiness, normalizeBusinessRecord } from '../context/BusinessContext';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import Logo from '../components/common/Logo';

export const getDraftStorageKey = (uid) => uid ? `udyamsaathi_onboarding_draft_${uid}` : 'udyamsaathi_onboarding_draft_demo';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry'
];

const SUPPORT_OPTIONS = [
  'Government schemes',
  'Loans / funding',
  'Subsidies',
  'Business registration',
  'Licenses / compliance',
  'Business planning',
  'Accounting / taxation',
  'Marketing',
  'Website / technology',
  'Hiring employees',
  'Equipment / machinery',
  'Raw materials',
  'Finding customers',
  'Business expansion',
  'Other'
];

const FUNDING_PURPOSE_OPTIONS = [
  'Starting a new business',
  'Purchasing equipment',
  'Purchasing machinery',
  'Working capital',
  'Expanding existing business',
  'Inventory/raw materials',
  'Shop/business premises',
  'Other'
];

const INITIAL_FORM = {
  // Step 1: Personal Info
  fullName: '',
  age: '',
  gender: '',
  phone: '',
  state: 'Delhi',
  district: '',
  locality: '',
  ruralUrban: 'Urban',
  entrepreneurStatus: 'PLANNING', // 'PLANNING' | 'OPERATING'
  experienceLevel: 'First-time entrepreneur',

  // Step 2: Eligibility / Social Profile
  category: 'General',
  incomeRange: '₹2.5 Lakhs - ₹5 Lakhs',
  employmentStatus: 'Employed',
  disabilityStatus: 'No',
  minorityStatus: 'No',
  eligibilityNotes: '',

  // Step 3: Business Information
  businessName: '',
  sector: 'Services',
  businessType: 'Proprietorship',
  description: '',
  productService: '',
  targetCustomers: 'Local consumers & retail',
  businessLocation: '',
  startDate: '',
  stage: 'IDEA', // Standardized: IDEA, PLANNING, FUNDING, REGISTRATION, PRE_LAUNCH, OPERATING, GROWING
  employeesCount: '1-5',
  monthlyRevenue: 'Under ₹50,000',
  annualRevenue: 'Under ₹5 Lakhs',
  registrationStatus: 'Unregistered',
  licensesHeld: '',

  // Step 4: Financial Situation
  availableMarginCapital: '₹1,00,000',
  availableCapital: '₹1,00,000',
  estimatedProjectCost: '₹10,00,000',
  fundingRequired: '₹9,00,000',
  fundingPurpose: ['Starting a new business', 'Purchasing equipment', 'Working capital'],
  monthlyOperatingExpenses: '₹45,000',
  existingRevenue: '',
  existingExpenses: '',
  hasExistingLoans: 'No',
  existingLoanAmount: '',
  existingMonthlyObligation: '',
  existingEmi: '',
  expectedMonthlyRevenue: '₹1,20,000',
  expectedMonthlyOperatingCost: '₹65,000',
  preferredFundingType: 'Government scheme grant / credit guarantee',

  // Step 5: Goals & Support
  supportNeeded: ['Government schemes', 'Loans / funding'],
  primaryChallenge: 'Navigating government schemes & paperwork',
  customChallenge: '',
  twelveMonthGoal: 'Start my business',
  additionalNotes: ''
};

export default function OnboardingPage() {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const { syncUserProfileFromOnboarding } = useBusiness();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // Initialize draft strictly scoped to active user
  useEffect(() => {
    // Purge legacy unscoped draft
    try {
      localStorage.removeItem('udyamsaathi_onboarding_draft');
    } catch {}

    if (!currentUser) return;
    const userDraftKey = getDraftStorageKey(currentUser.uid);

    try {
      const savedDraft = localStorage.getItem(userDraftKey);
      if (savedDraft) {
        setFormData(JSON.parse(savedDraft));
      } else {
        // Initialize fresh form with authentic registered name
        setFormData({
          ...INITIAL_FORM,
          fullName: userProfile?.name || currentUser.displayName || ''
        });
      }
    } catch (e) {
      console.error('Draft load error', e);
      setFormData({
        ...INITIAL_FORM,
        fullName: userProfile?.name || currentUser.displayName || ''
      });
    }
  }, [currentUser?.uid, userProfile?.name]);

  // Persist draft on changes scoped to active user
  useEffect(() => {
    if (!currentUser?.uid) return;
    const userDraftKey = getDraftStorageKey(currentUser.uid);
    try {
      localStorage.setItem(userDraftKey, JSON.stringify(formData));
    } catch (e) {
      console.error('Draft save error', e);
    }
  }, [formData, currentUser?.uid]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSupportToggle = (option) => {
    setFormData((prev) => {
      const current = prev.supportNeeded || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, supportNeeded: updated };
    });
  };

  const handlePurposeToggle = (option) => {
    setFormData((prev) => {
      const current = prev.fundingPurpose || [];
      const updated = current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option];
      return { ...prev, fundingPurpose: updated };
    });
  };

  // Step Validations
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required for verification.';
      if (!formData.district.trim()) newErrors.district = 'District is required for local scheme eligibility.';
    } else if (step === 2) {
      if (!formData.category) newErrors.category = 'Category is required for scheme evaluation.';
      if (!formData.incomeRange) newErrors.incomeRange = 'Income range is required.';
    } else if (step === 3) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = formData.entrepreneurStatus === 'OPERATING'
          ? 'Business name is required.'
          : 'Proposed business/idea name is required.';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Please provide a short description.';
      }
    } else if (step === 4) {
      const margin = formData.availableMarginCapital || formData.availableCapital;
      if (!margin || !margin.toString().trim()) {
        newErrors.availableMarginCapital = 'Please enter how much of your own money you can invest.';
      }
      if (formData.hasExistingLoans === 'Yes') {
        const obligation = formData.existingMonthlyObligation || formData.existingEmi;
        if (!obligation || !obligation.toString().trim()) {
          newErrors.existingMonthlyObligation = 'Please specify approximate monthly EMI.';
        }
      }
    } else if (step === 5) {
      if (!formData.supportNeeded || formData.supportNeeded.length === 0) {
        newErrors.supportNeeded = 'Please select at least one area where you need support.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 6));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Profile Submission
  const handleSubmitProfile = async () => {
    if (!currentUser?.uid) return;

    try {
      setSaving(true);

      const structuredProfile = {
        userId: currentUser.uid,
        userEmail: currentUser.email,

        personalInfo: {
          fullName: formData.fullName.trim(),
          age: formData.age || null,
          gender: formData.gender || 'Not specified',
          phone: formData.phone.trim(),
          state: formData.state,
          district: formData.district.trim(),
          locality: formData.locality.trim(),
          ruralUrban: formData.ruralUrban,
          entrepreneurStatus: formData.entrepreneurStatus,
          experienceLevel: formData.experienceLevel
        },

        eligibilityProfile: {
          category: formData.category,
          incomeRange: formData.incomeRange,
          employmentStatus: formData.employmentStatus,
          disabilityStatus: formData.disabilityStatus,
          minorityStatus: formData.minorityStatus,
          notes: formData.eligibilityNotes || ''
        },

        business: {
          status: formData.entrepreneurStatus,
          name: formData.businessName.trim(),
          sector: formData.sector,
          type: formData.businessType,
          description: formData.description.trim(),
          productService: formData.productService.trim(),
          targetCustomers: formData.targetCustomers,
          location: formData.businessLocation.trim() || formData.district.trim(),
          startDate: formData.startDate || null,
          stage: formData.stage,
          employeesCount: formData.entrepreneurStatus === 'OPERATING' ? formData.employeesCount : '0',
          monthlyRevenue: formData.entrepreneurStatus === 'OPERATING' ? formData.monthlyRevenue : 'N/A',
          annualRevenue: formData.entrepreneurStatus === 'OPERATING' ? formData.annualRevenue : 'N/A',
          registrationStatus: formData.registrationStatus,
          licensesHeld: formData.licensesHeld.trim() || 'None'
        },

        financialProfile: {
          availableMarginCapital: formData.availableMarginCapital || formData.availableCapital,
          availableCapital: formData.availableMarginCapital || formData.availableCapital,
          estimatedProjectCost: formData.estimatedProjectCost || '',
          fundingRequired: formData.fundingRequired || '',
          fundingPurpose: formData.fundingPurpose || [],
          monthlyOperatingExpenses: formData.monthlyOperatingExpenses || formData.existingExpenses || '',
          existingRevenue: formData.existingRevenue || formData.monthlyRevenue || 'N/A',
          existingExpenses: formData.monthlyOperatingExpenses || formData.existingExpenses || 'N/A',
          hasExistingLoans: formData.hasExistingLoans,
          existingLoanAmount: formData.existingLoanAmount || '0',
          existingMonthlyObligation: formData.existingMonthlyObligation || formData.existingEmi || '0',
          existingEmi: formData.existingMonthlyObligation || formData.existingEmi || '0',
          expectedMonthlyRevenue: formData.expectedMonthlyRevenue || '',
          expectedMonthlyOperatingCost: formData.expectedMonthlyOperatingCost || '',
          preferredFundingType: formData.preferredFundingType
        },

        goals: {
          supportNeeded: formData.supportNeeded,
          primaryChallenge: formData.primaryChallenge === 'Other' && formData.customChallenge
            ? formData.customChallenge
            : formData.primaryChallenge,
          twelveMonthGoal: formData.twelveMonthGoal,
          additionalNotes: formData.additionalNotes || ''
        },

        onboarding: {
          completed: true,
          completedAt: serverTimestamp()
        }
      };

      // Prepare normalized primary business record for multi-business schema compatibility
      const bizId = `biz_${currentUser.uid.slice(0, 8)}_${Date.now().toString(36)}`;
      const primaryBusiness = normalizeBusinessRecord({
        ...structuredProfile,
        id: bizId,
        name: formData.businessName.trim() || 'My Enterprise',
        stage: formData.stage,
        sector: formData.sector,
        type: formData.businessType,
        description: formData.description.trim(),
        productService: formData.productService.trim(),
        targetCustomers: formData.targetCustomers,
        location: formData.businessLocation.trim() || formData.district.trim() || 'India',
        personalInfo: structuredProfile.personalInfo,
        eligibilityProfile: structuredProfile.eligibilityProfile,
        financialProfile: structuredProfile.financialProfile,
        goals: structuredProfile.goals
      });

      structuredProfile.businesses = [primaryBusiness];
      structuredProfile.activeBusinessId = bizId;

      // Save structured profile
      if (db && !currentUser?.isDemo) {
        // 1. Save structured profile to Firestore
        await setDoc(doc(db, 'entrepreneurProfiles', currentUser.uid), structuredProfile);

        // 2. Mark user doc as onboarding completed
        await updateDoc(doc(db, 'users', currentUser.uid), {
          name: formData.fullName.trim() || currentUser.displayName || 'Entrepreneur',
          onboardingCompleted: true,
          updatedAt: serverTimestamp()
        });
      } else {
        // Fallback local storage for preview / demo mode
        localStorage.setItem('udyamsathi_demo_profile_data', JSON.stringify(structuredProfile));
        const storedProfile = localStorage.getItem('udyamsathi_demo_profile');
        if (storedProfile) {
          try {
            const p = JSON.parse(storedProfile);
            p.name = formData.fullName.trim() || p.name;
            p.onboardingCompleted = true;
            localStorage.setItem('udyamsathi_demo_profile', JSON.stringify(p));
          } catch (e) {
            console.error('Error updating demo profile:', e);
          }
        }
      }

      // Clear user draft and any legacy drafts
      const userDraftKey = getDraftStorageKey(currentUser.uid);
      localStorage.removeItem(userDraftKey);
      localStorage.removeItem('udyamsaathi_onboarding_draft');

      // Update BusinessContext immediately
      if (syncUserProfileFromOnboarding) {
        syncUserProfileFromOnboarding(structuredProfile);
      }

      // Refresh AuthContext state so route guard knows profile is complete
      await refreshProfile();

      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Error saving entrepreneur profile:', err);
      setErrors({ submit: err.message || 'Failed to save profile. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const stepsMeta = [
    { num: 1, title: 'About You', icon: User },
    { num: 2, title: 'Eligibility', icon: MapPin },
    { num: 3, title: 'Business', icon: Building2 },
    { num: 4, title: 'Finances', icon: IndianRupee },
    { num: 5, title: 'Goals & Needs', icon: Target },
    { num: 6, title: 'Review & Save', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col font-sans text-slate-900 w-full max-w-full overflow-x-hidden relative">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 py-3 px-3 sm:px-8 sticky top-0 z-30 w-full">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Logo variant="dark" size="sm" showTagline={false} />
            <span className="hidden sm:inline-block px-2.5 py-0.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
              Entrepreneur Onboarding
            </span>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Step <span className="font-bold text-slate-900">{currentStep}</span> of 6
          </div>
        </div>
      </header>

      {/* Progress Wizard Header */}
      <div className="max-w-4xl w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-6 pb-2">
        <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
          {stepsMeta.map((s) => {
            const isDone = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isDone) setCurrentStep(s.num);
                }}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  isDone ? 'cursor-pointer' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-soft-sm'
                      : isCurrent
                      ? 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-600 font-extrabold'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </div>
                <span
                  className={`text-[11px] mt-1 hidden sm:block truncate font-medium ${
                    isCurrent ? 'text-emerald-700 font-bold' : isDone ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 sm:mt-4 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Step Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 pb-16">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft-md p-4 sm:p-10">
          {/* STEP 1: ABOUT YOU */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">👤 Personal Information</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tell us about yourself. This helps calibrate location-specific government schemes and state grants.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    placeholder="Your legal name"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {errors.fullName && <p className="text-rose-500 text-xs mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {errors.phone && <p className="text-rose-500 text-xs mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Age / Date of Birth
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="e.g. 28 years or DD/MM/YYYY"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Gender (Optional, for scheme eligibility)
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female (Special schemes & subsidies available)</option>
                    <option value="Male">Male</option>
                    <option value="Transgender">Transgender</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    District <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => handleChange('district', e.target.value)}
                    placeholder="e.g. Pune, Varanasi, Jaipur"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {errors.district && <p className="text-rose-500 text-xs mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Village / Town / City
                  </label>
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => handleChange('locality', e.target.value)}
                    placeholder="Locality or town name"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Rural / Urban Classification
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['Rural', 'Urban'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handleChange('ruralUrban', type)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                          formData.ruralUrban === type
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {type} Area
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-2">
                    Are you an existing entrepreneur or planning to start?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => {
                        handleChange('entrepreneurStatus', 'PLANNING');
                        handleChange('stage', 'IDEA');
                      }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.entrepreneurStatus === 'PLANNING'
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-sm text-slate-900">🌱 Planning to start</div>
                      <p className="text-xs text-slate-500 mt-1">
                        I have an idea or business plan and want guidance to launch and fund it.
                      </p>
                    </div>

                    <div
                      onClick={() => {
                        handleChange('entrepreneurStatus', 'OPERATING');
                        handleChange('stage', 'OPERATING');
                      }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.entrepreneurStatus === 'OPERATING'
                          ? 'border-emerald-600 bg-emerald-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="font-semibold text-sm text-slate-900">🏢 Already operating</div>
                      <p className="text-xs text-slate-500 mt-1">
                        I run an active enterprise and want subsidies, growth capital, or compliance support.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Business Experience Level
                  </label>
                  <select
                    value={formData.experienceLevel}
                    onChange={(e) => handleChange('experienceLevel', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="First-time entrepreneur">First-time entrepreneur</option>
                    <option value="Some experience">Some business experience (1-3 years)</option>
                    <option value="Experienced entrepreneur">Experienced entrepreneur (3+ years)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ELIGIBILITY PROFILE */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">📍 Eligibility & Social Profile</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Many Central & State schemes (PMEGP, Stand-Up India, Mudra) provide targeted subsidies based on demographic criteria.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  This data is strictly used to evaluate government scheme eligibility. It is encrypted and not shared with third-party advertisers.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Social / Category Classification <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Prefer not to state">Prefer not to state</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Annual Household Income Range <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.incomeRange}
                    onChange={(e) => handleChange('incomeRange', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Below ₹1 Lakh">Below ₹1 Lakh</option>
                    <option value="₹1 Lakh - ₹2.5 Lakhs">₹1 Lakh - ₹2.5 Lakhs</option>
                    <option value="₹2.5 Lakhs - ₹5 Lakhs">₹2.5 Lakhs - ₹5 Lakhs</option>
                    <option value="₹5 Lakhs - ₹10 Lakhs">₹5 Lakhs - ₹10 Lakhs</option>
                    <option value="Above ₹10 Lakhs">Above ₹10 Lakhs</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Current Employment Status
                  </label>
                  <select
                    value={formData.employmentStatus}
                    onChange={(e) => handleChange('employmentStatus', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Employed">Employed (Full-time / Part-time)</option>
                    <option value="Unemployed">Unemployed / Seeking Self-Employment</option>
                    <option value="Self-employed">Self-employed / Freelancer</option>
                    <option value="Student">Student</option>
                    <option value="Homemaker">Homemaker</option>
                    <option value="Retired">Retired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Disability Status (Divyangjan)
                  </label>
                  <select
                    value={formData.disabilityStatus}
                    onChange={(e) => handleChange('disabilityStatus', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Eligible for specialized PwD subsidies)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Minority Community Status
                  </label>
                  <select
                    value={formData.minorityStatus}
                    onChange={(e) => handleChange('minorityStatus', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes (Eligible for NMDFC & Minority Welfare schemes)</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Additional Eligibility Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.eligibilityNotes}
                    onChange={(e) => handleChange('eligibilityNotes', e.target.value)}
                    placeholder="e.g. Ex-serviceman, Artisan card holder"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: YOUR BUSINESS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  🏢 {formData.entrepreneurStatus === 'OPERATING' ? 'Your Active Business' : 'Your Proposed Business Idea'}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Specify sector and operational details to build your roadmap and scheme eligibility.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    {formData.entrepreneurStatus === 'OPERATING' ? 'Registered / Business Name' : 'Proposed Business / Project Name'}{' '}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleChange('businessName', e.target.value)}
                    placeholder={formData.entrepreneurStatus === 'OPERATING' ? 'e.g. Sharma Organic Agro' : 'e.g. GreenTech Solar Solutions'}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {errors.businessName && <p className="text-rose-500 text-xs mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Industry Sector
                  </label>
                  <select
                    value={formData.sector}
                    onChange={(e) => handleChange('sector', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Services">Services</option>
                    <option value="Agriculture & Allied">Agriculture & Allied (Agri-tech, Dairy, Poultry)</option>
                    <option value="Retail & Trade">Retail & E-commerce</option>
                    <option value="Technology & Software">Technology & Software</option>
                    <option value="Food & Hospitality">Food & Hospitality</option>
                    <option value="Handloom & Handicrafts">Handloom, Textiles & Handicrafts</option>
                    <option value="Healthcare">Healthcare & Wellness</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Business Entity Type
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => handleChange('businessType', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Proprietorship">Sole Proprietorship</option>
                    <option value="Partnership">Partnership Firm</option>
                    <option value="Private Limited">Private Limited Company</option>
                    <option value="LLP">Limited Liability Partnership (LLP)</option>
                    <option value="Self Help Group">Self Help Group (SHG) / Trust</option>
                    <option value="Undecided">Undecided / Need Guidance</option>
                  </select>
                </div>

                {/* Standardized Business Stage */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Standardized Business Stage (Roadmap Driver)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(formData.entrepreneurStatus === 'OPERATING'
                      ? ['OPERATING', 'GROWING']
                      : ['IDEA', 'PLANNING', 'FUNDING', 'REGISTRATION', 'PRE_LAUNCH']
                    ).map((stg) => (
                      <button
                        key={stg}
                        type="button"
                        onClick={() => handleChange('stage', stg)}
                        className={`p-2.5 text-xs font-bold rounded-xl border text-center transition-all ${
                          formData.stage === stg
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-soft-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {stg.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Short Description of Business / Idea <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Briefly describe what your business does or plans to produce..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Product / Service Offered
                  </label>
                  <input
                    type="text"
                    value={formData.productService}
                    onChange={(e) => handleChange('productService', e.target.value)}
                    placeholder="e.g. Cold pressed oils, Web design"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Target Customers
                  </label>
                  <input
                    type="text"
                    value={formData.targetCustomers}
                    onChange={(e) => handleChange('targetCustomers', e.target.value)}
                    placeholder="e.g. Local retail consumers, B2B restaurants"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                {/* Additional fields for OPERATING enterprises */}
                {formData.entrepreneurStatus === 'OPERATING' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Current Number of Employees
                      </label>
                      <select
                        value={formData.employeesCount}
                        onChange={(e) => handleChange('employeesCount', e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      >
                        <option value="Just myself (1)">Just myself (1)</option>
                        <option value="2-5">2-5 employees</option>
                        <option value="6-10">6-10 employees</option>
                        <option value="11-25">11-25 employees</option>
                        <option value="25+">25+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Registration Status
                      </label>
                      <select
                        value={formData.registrationStatus}
                        onChange={(e) => handleChange('registrationStatus', e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      >
                        <option value="Registered">Registered (Udyam / GST / Shop Act)</option>
                        <option value="In Process">Registration in progress</option>
                        <option value="Unregistered">Unregistered</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Existing Licenses / Registrations Held
                      </label>
                      <input
                        type="text"
                        value={formData.licensesHeld}
                        onChange={(e) => handleChange('licensesHeld', e.target.value)}
                        placeholder="e.g. Udyam MSME, GSTIN, FSSAI"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Approximate Annual Revenue
                      </label>
                      <select
                        value={formData.annualRevenue}
                        onChange={(e) => handleChange('annualRevenue', e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      >
                        <option value="Under ₹5 Lakhs">Under ₹5 Lakhs</option>
                        <option value="₹5L - ₹20 Lakhs">₹5L - ₹20 Lakhs</option>
                        <option value="₹20L - ₹50 Lakhs">₹20L - ₹50 Lakhs</option>
                        <option value="₹50L - ₹1 Crore">₹50L - ₹1 Crore</option>
                        <option value="Above ₹1 Crore">Above ₹1 Crore</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: FINANCIAL SITUATION */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">💰 Financial Structuring & Capital</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tell us about your available savings and project budget. We use this to calculate your feasible project capacity and match eligible funding tiers.
                </p>
              </div>

              {/* Security Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-start gap-2.5">
                <ShieldAlert className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Security Notice: </span>
                  We will <span className="underline">never</span> ask for sensitive financial credentials like bank passwords, UPI PINs, or account numbers. Only enter high-level capital estimates.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 1. Margin Capital - Core PS Input */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    How much of your own money can you invest in this business? <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.availableMarginCapital || formData.availableCapital}
                    onChange={(e) => {
                      handleChange('availableMarginCapital', e.target.value);
                      handleChange('availableCapital', e.target.value);
                    }}
                    placeholder="e.g. ₹50,000 / ₹1,00,000 / ₹2,00,000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    💡 This helps us estimate how much project funding you may be able to structure (e.g. at 10% margin, ₹1 Lakh contribution supports a ₹10 Lakh project).
                  </p>
                  {errors.availableMarginCapital && <p className="text-rose-500 text-xs mt-1">{errors.availableMarginCapital}</p>}
                </div>

                {/* 2. Estimated Total Project Cost */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    How much do you estimate you will need to start or expand this business? <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.estimatedProjectCost}
                    onChange={(e) => handleChange('estimatedProjectCost', e.target.value)}
                    placeholder="e.g. ₹10,00,000 (or leave blank to auto-calculate)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    If left blank, Business Compass will automatically determine your feasible project size based on your available own contribution.
                  </p>
                </div>

                {/* 3. Operational Financials - Tailored by Stage */}
                {formData.entrepreneurStatus === 'OPERATING' ? (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Current Monthly Revenue
                      </label>
                      <input
                        type="text"
                        value={formData.monthlyRevenue}
                        onChange={(e) => handleChange('monthlyRevenue', e.target.value)}
                        placeholder="e.g. ₹85,000 / month"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Monthly Operating Expenses
                      </label>
                      <input
                        type="text"
                        value={formData.monthlyOperatingExpenses || formData.existingExpenses}
                        onChange={(e) => {
                          handleChange('monthlyOperatingExpenses', e.target.value);
                          handleChange('existingExpenses', e.target.value);
                        }}
                        placeholder="e.g. ₹45,000 (rent, wages, raw materials)"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Expected Monthly Revenue (After Launch)
                      </label>
                      <input
                        type="text"
                        value={formData.expectedMonthlyRevenue}
                        onChange={(e) => handleChange('expectedMonthlyRevenue', e.target.value)}
                        placeholder="e.g. ₹1,20,000 / month"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-400 mt-0.5">Used to assess debt repayment comfort & coverage ratio.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Expected Monthly Operating Cost
                      </label>
                      <input
                        type="text"
                        value={formData.expectedMonthlyOperatingCost}
                        onChange={(e) => handleChange('expectedMonthlyOperatingCost', e.target.value)}
                        placeholder="e.g. ₹65,000 (wages, rent, electricity, transport)"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                      <p className="text-[11px] text-slate-400 mt-0.5">Helps calculate necessary working capital reserves.</p>
                    </div>
                  </>
                )}

                {/* 4. Existing Loans */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Do you currently have any business or personal loans that affect your repayment capacity?
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['No', 'Yes'].map((ans) => (
                      <button
                        key={ans}
                        type="button"
                        onClick={() => handleChange('hasExistingLoans', ans)}
                        className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                          formData.hasExistingLoans === ans
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500 ring-1 ring-emerald-500'
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {ans}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.hasExistingLoans === 'Yes' && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Total Outstanding Loan Amount
                      </label>
                      <input
                        type="text"
                        value={formData.existingLoanAmount}
                        onChange={(e) => handleChange('existingLoanAmount', e.target.value)}
                        placeholder="e.g. ₹1,50,000"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                        Approximate Monthly Repayment / EMI <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.existingMonthlyObligation || formData.existingEmi}
                        onChange={(e) => {
                          handleChange('existingMonthlyObligation', e.target.value);
                          handleChange('existingEmi', e.target.value);
                        }}
                        placeholder="e.g. ₹12,000 / month"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                      />
                      {errors.existingMonthlyObligation && <p className="text-rose-500 text-xs mt-1">{errors.existingMonthlyObligation}</p>}
                    </div>
                  </>
                )}

                {/* 5. Funding Purpose (Multi-Select) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-2">
                    What will this funding be used for? (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {FUNDING_PURPOSE_OPTIONS.map((purpose) => {
                      const isSelected = (formData.fundingPurpose || []).includes(purpose);
                      return (
                        <button
                          key={purpose}
                          type="button"
                          onClick={() => handlePurposeToggle(purpose)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-soft-xs'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}{purpose}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 6. Preferred Funding Channel */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Preferred Funding Channel
                  </label>
                  <select
                    value={formData.preferredFundingType}
                    onChange={(e) => handleChange('preferredFundingType', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Government scheme grant / credit guarantee">Government scheme grant / credit guarantee (PMEGP, PMFME, CGTMSE)</option>
                    <option value="Mudra loan">Mudra Shishu/Kishore/Tarun collateral-free credit</option>
                    <option value="Bank term loan">Scheduled Commercial Bank Term Loan</option>
                    <option value="Microfinance">Microfinance Institution (MFI)</option>
                    <option value="Self-funded">Self-funded / Bootstrapped</option>
                    <option value="Other">Other institutional financing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: GOALS & SUPPORT */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">🎯 Business Goals & Support</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Select the key areas where UdyamSaathi can assist you with recommendations and advisor connections.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-2">
                  What kind of help do you need? (Select all that apply) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPPORT_OPTIONS.map((opt) => {
                    const isSelected = formData.supportNeeded?.includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSupportToggle(opt)}
                        className={`p-3 text-xs rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>{opt}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {errors.supportNeeded && <p className="text-rose-500 text-xs mt-1.5">{errors.supportNeeded}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    What is your biggest challenge right now?
                  </label>
                  <select
                    value={formData.primaryChallenge}
                    onChange={(e) => handleChange('primaryChallenge', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Navigating government schemes & paperwork">Navigating government schemes & paperwork</option>
                    <option value="Lack of working capital / funds">Lack of working capital / funds</option>
                    <option value="Getting customers & market visibility">Getting customers & market visibility</option>
                    <option value="Legal compliance & licenses">Legal compliance & licenses</option>
                    <option value="Skilled labor & hiring">Skilled labor & hiring</option>
                    <option value="Technology & digital presence">Technology & digital presence</option>
                    <option value="Other">Other / Tell us more</option>
                  </select>
                </div>

                {formData.primaryChallenge === 'Other' && (
                  <div>
                    <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                      Specify Your Challenge
                    </label>
                    <input
                      type="text"
                      value={formData.customChallenge}
                      onChange={(e) => handleChange('customChallenge', e.target.value)}
                      placeholder="Describe your primary obstacle..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    What is your main goal for the next 12 months?
                  </label>
                  <select
                    value={formData.twelveMonthGoal}
                    onChange={(e) => handleChange('twelveMonthGoal', e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  >
                    <option value="Start my business">Start my business</option>
                    <option value="Get funding">Get funding / bank loan</option>
                    <option value="Increase revenue">Increase revenue & profitability</option>
                    <option value="Expand my business">Expand my business / new branches</option>
                    <option value="Hire employees">Hire and train employees</option>
                    <option value="Reach new customers">Reach new customers & digital presence</option>
                    <option value="Become financially stable">Become financially stable</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">
                    Tell us anything else about your business or goal (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.additionalNotes}
                    onChange={(e) => handleChange('additionalNotes', e.target.value)}
                    placeholder="This information will be passed to your AI Business Advisor for personalized responses..."
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW & FINISH */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">✅ Review Your Entrepreneur Profile</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Check your submitted information. You can edit any section before finalizing.
                </p>
              </div>

              {errors.submit && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span>{errors.submit}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Personal summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">1. Personal Profile</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div><span className="text-slate-400 block">Name</span><strong>{formData.fullName}</strong></div>
                    <div><span className="text-slate-400 block">Phone</span><strong>{formData.phone}</strong></div>
                    <div><span className="text-slate-400 block">Location</span><strong>{formData.district}, {formData.state}</strong></div>
                    <div><span className="text-slate-400 block">Status</span><strong>{formData.entrepreneurStatus === 'OPERATING' ? 'Already Operating' : 'Planning to Start'}</strong></div>
                  </div>
                </div>

                {/* Eligibility summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">2. Eligibility & Social Profile</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div><span className="text-slate-400 block">Category</span><strong>{formData.category}</strong></div>
                    <div><span className="text-slate-400 block">Income</span><strong>{formData.incomeRange}</strong></div>
                    <div><span className="text-slate-400 block">Employment</span><strong>{formData.employmentStatus}</strong></div>
                    <div><span className="text-slate-400 block">Disability / Minority</span><strong>{formData.disabilityStatus} / {formData.minorityStatus}</strong></div>
                  </div>
                </div>

                {/* Business summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">3. Business Details</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div><span className="text-slate-400 block">Business Name</span><strong>{formData.businessName}</strong></div>
                    <div><span className="text-slate-400 block">Sector</span><strong>{formData.sector}</strong></div>
                    <div><span className="text-slate-400 block">Entity</span><strong>{formData.businessType}</strong></div>
                    <div><span className="text-slate-400 block">Stage</span><strong>{formData.stage}</strong></div>
                  </div>
                </div>

                {/* Financial summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">4. Financial Profile</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-600">
                    <div><span className="text-slate-400 block">Own Margin</span><strong>{formData.availableMarginCapital || formData.availableCapital}</strong></div>
                    <div><span className="text-slate-400 block">Project Cost</span><strong>{formData.estimatedProjectCost || 'Auto-calculated (10% Margin)'}</strong></div>
                    <div><span className="text-slate-400 block">Existing Loans</span><strong>{formData.hasExistingLoans === 'Yes' ? `${formData.existingMonthlyObligation || formData.existingEmi} EMI` : 'None'}</strong></div>
                    <div><span className="text-slate-400 block">Preferred Channel</span><strong className="truncate block">{formData.preferredFundingType}</strong></div>
                  </div>
                </div>

                {/* Goals summary */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">5. Goals & Requirements</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="text-xs text-slate-600 space-y-2">
                    <div>
                      <span className="text-slate-400 block">12-Month Goal:</span>
                      <strong>{formData.twelveMonthGoal}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">Support Areas Selected:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {formData.supportNeeded?.map((item, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold text-white shadow-soft-sm hover:shadow-soft-md transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitProfile}
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-bold text-white shadow-soft-md hover:shadow-soft-lg transition-all focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving Profile to Firestore...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Confirm & Complete Profile</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
