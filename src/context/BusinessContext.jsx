import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const BusinessContext = createContext(null);

export const getStorageKey = (uid) => uid ? `udyamsaathi.businesses_${uid}` : 'udyamsaathi.businesses_demo';
export const getActiveIdKey = (uid) => uid ? `udyamsaathi.activeBusinessId_${uid}` : 'udyamsaathi.activeBusinessId_demo';

// Legacy keys reference for backward compatibility purge
export const STORAGE_KEYS = {
  BUSINESSES: 'udyamsaathi.businesses',
  ACTIVE_ID: 'udyamsaathi.activeBusinessId'
};

// Initial default seed profile (Clean Template)
export const DEFAULT_BUSINESS = {
  id: 'biz_default_enterprise',
  name: 'New Enterprise',
  stage: 'IDEA',
  sector: 'Services',
  type: 'Proprietorship',
  description: 'Enterprise planning and government scheme enablement.',
  productService: 'General Products/Services',
  targetCustomers: 'Local consumers & retail',
  location: 'India',
  areaClassification: 'Urban',
  operatingStatus: 'Planning to Launch',
  employeesCount: '0',
  monthlyRevenue: 'N/A',
  annualRevenue: 'N/A',
  registrationStatus: 'Unregistered',
  licensesHeld: 'None',
  financialProfile: {
    availableCapital: '₹50,000',
    estimatedProjectCost: '₹2,00,000',
    fundingRequired: '₹1,50,000',
    existingRevenue: 'N/A',
    existingExpenses: 'N/A',
    hasExistingLoans: 'No',
    existingEmi: '0',
    preferredFundingType: 'Government scheme grant / credit guarantee',
    workingCapitalAllocations: {
      rawMaterials: 60000,
      salaries: 35000,
      rentUtilities: 15000,
      marketing: 30000,
      other: 10000
    }
  },
  goals: {
    supportNeeded: ['Government schemes', 'Loans / funding', 'Business registration'],
    primaryChallenge: 'Navigating government schemes & paperwork',
    twelveMonthGoal: 'Establish operations and achieve break-even',
    additionalNotes: ''
  },
  personalInfo: {
    fullName: '',
    age: '',
    gender: 'Not specified',
    phone: '',
    state: '',
    district: '',
    locality: '',
    ruralUrban: 'Urban',
    entrepreneurStatus: 'PLANNING',
    experienceLevel: 'First-time entrepreneur'
  },
  eligibilityProfile: {
    category: 'General',
    incomeRange: '₹2.5 Lakhs - ₹5 Lakhs',
    employmentStatus: 'Self-employed',
    disabilityStatus: 'No',
    minorityStatus: 'No',
    notes: ''
  },
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z'
};

// Helper to create a fresh default business profile tailored for a specific user
export const createDefaultBusinessForUser = (user, fallbackName = '') => {
  const userName = user?.displayName || fallbackName || 'Entrepreneur';
  const bizId = `biz_${(user?.uid || 'user').slice(0, 8)}_${Date.now().toString(36)}`;
  return normalizeBusinessRecord({
    ...DEFAULT_BUSINESS,
    id: bizId,
    name: 'My Enterprise',
    personalInfo: {
      ...DEFAULT_BUSINESS.personalInfo,
      fullName: userName
    }
  });
};

// Helper to ensure nested compatibility for existing consumers (profile.business.*, profile.financialProfile.*)
export function normalizeBusinessRecord(raw) {
  if (!raw) return null;
  const bizObj = raw.business || {};
  const personal = raw.personalInfo || {};
  const fin = raw.financialProfile || {};
  const goals = raw.goals || {};
  const eligibility = raw.eligibilityProfile || {};

  const name = raw.name || bizObj.name || 'My Enterprise';
  const stage = (raw.stage || bizObj.stage || 'IDEA').toUpperCase();
  const sector = raw.sector || bizObj.sector || 'Services';
  const type = raw.type || bizObj.type || 'Proprietorship';
  const description = raw.description || bizObj.description || '';
  const productService = raw.productService || bizObj.productService || '';
  const targetCustomers = raw.targetCustomers || bizObj.targetCustomers || 'Local consumers & retail';
  const location = raw.location || bizObj.location || (personal.district ? `${personal.district}, ${personal.state}` : 'India');
  const areaClassification = raw.areaClassification || personal.ruralUrban || 'Urban';
  const operatingStatus = raw.operatingStatus || (bizObj.status === 'OPERATING' ? 'Active Enterprise' : 'Planning to Launch');
  const employeesCount = raw.employeesCount || bizObj.employeesCount || '0';
  const monthlyRevenue = raw.monthlyRevenue || bizObj.monthlyRevenue || 'N/A';
  const annualRevenue = raw.annualRevenue || bizObj.annualRevenue || 'N/A';
  const registrationStatus = raw.registrationStatus || bizObj.registrationStatus || 'Unregistered';
  const licensesHeld = raw.licensesHeld || bizObj.licensesHeld || 'None';

  const normalized = {
    ...raw,
    id: raw.id || `biz_${Date.now()}`,
    name,
    stage,
    sector,
    type,
    description,
    productService,
    targetCustomers,
    location,
    areaClassification,
    operatingStatus,
    employeesCount,
    monthlyRevenue,
    annualRevenue,
    registrationStatus,
    licensesHeld,
    personalInfo: {
      fullName: personal.fullName || '',
      age: personal.age || '',
      gender: personal.gender || 'Not specified',
      phone: personal.phone || '',
      state: personal.state || (location.includes(',') ? location.split(',')[1].trim() : ''),
      district: personal.district || (location.includes(',') ? location.split(',')[0].trim() : ''),
      locality: personal.locality || '',
      ruralUrban: areaClassification,
      entrepreneurStatus: raw.operatingStatus === 'Active Enterprise' ? 'OPERATING' : 'PLANNING',
      experienceLevel: personal.experienceLevel || 'First-time entrepreneur',
      ...personal
    },
    eligibilityProfile: {
      category: eligibility.category || 'General',
      incomeRange: eligibility.incomeRange || '₹2.5 Lakhs - ₹5 Lakhs',
      employmentStatus: eligibility.employmentStatus || 'Self-employed',
      disabilityStatus: eligibility.disabilityStatus || 'No',
      minorityStatus: eligibility.minorityStatus || 'No',
      notes: eligibility.notes || '',
      ...eligibility
    },
    financialProfile: {
      availableCapital: fin.availableCapital || '₹50,000',
      estimatedProjectCost: fin.estimatedProjectCost || '₹2,00,000',
      fundingRequired: fin.fundingRequired || '₹1,50,000',
      existingRevenue: fin.existingRevenue || 'N/A',
      existingExpenses: fin.existingExpenses || 'N/A',
      hasExistingLoans: fin.hasExistingLoans || 'No',
      existingEmi: fin.existingEmi || '0',
      preferredFundingType: fin.preferredFundingType || 'Government scheme grant / credit guarantee',
      ...fin,
      workingCapitalAllocations: {
        rawMaterials: 60000,
        wages: 35000,
        rent: 15000,
        utilities: 5000,
        transport: 5000,
        marketing: 30000,
        ...(fin.workingCapitalAllocations || {}),
        marketing: (fin.workingCapitalAllocations?.marketing !== undefined && fin.workingCapitalAllocations?.marketing !== null)
          ? Number(fin.workingCapitalAllocations.marketing)
          : 30000
      }
    },
    goals: {
      supportNeeded: goals.supportNeeded || ['Government schemes', 'Loans / funding'],
      primaryChallenge: goals.primaryChallenge || 'Navigating government schemes & paperwork',
      twelveMonthGoal: goals.twelveMonthGoal || 'Launch operations',
      additionalNotes: goals.additionalNotes || '',
      ...goals
    },
    business: {
      name,
      stage,
      sector,
      type,
      description,
      productService,
      targetCustomers,
      location,
      status: operatingStatus === 'Active Enterprise' ? 'OPERATING' : 'PLANNING',
      employeesCount,
      monthlyRevenue,
      annualRevenue,
      registrationStatus,
      licensesHeld,
      ...bizObj
    }
  };

  return normalized;
}

export function BusinessProvider({ children }) {
  const { currentUser, userProfile } = useAuth();
  const [businesses, setBusinesses] = useState([]);
  const [activeBusinessId, setActiveBusinessIdState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize and load businesses strictly scoped to the active user
  useEffect(() => {
    async function loadBusinesses() {
      // If no user is logged in, reset businesses
      if (!currentUser) {
        setBusinesses([]);
        setActiveBusinessIdState(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // Purge legacy unscoped keys that caused cross-user leakage
      try {
        localStorage.removeItem(STORAGE_KEYS.BUSINESSES);
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_ID);
      } catch {}

      const userStorageKey = getStorageKey(currentUser.uid);
      const userActiveIdKey = getActiveIdKey(currentUser.uid);

      try {
        let loadedList = [];
        let storedActiveId = null;

        // 1. If Firebase is active and user is a real authenticated account, fetch their isolated Firestore profile
        if (db && currentUser?.uid && !currentUser?.isDemo) {
          try {
            const docRef = doc(db, 'entrepreneurProfiles', currentUser.uid);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              const data = snap.data();
              if (data.businesses && Array.isArray(data.businesses) && data.businesses.length > 0) {
                loadedList = data.businesses.map(b => {
                  const normalized = normalizeBusinessRecord(b);
                  if (userProfile?.name && (!normalized.personalInfo?.fullName || normalized.personalInfo.fullName === 'Shreya Singh')) {
                    normalized.personalInfo.fullName = userProfile.name;
                  }
                  return normalized;
                });
                if (data.activeBusinessId) {
                  storedActiveId = data.activeBusinessId;
                }
              } else if (data.business?.name) {
                // Migrate single profile into multi-business list
                const single = normalizeBusinessRecord({
                  ...data,
                  id: data.business.id || `biz_${currentUser.uid.slice(0, 8)}`,
                  name: data.business.name,
                  stage: data.business.stage,
                  personalInfo: {
                    ...data.personalInfo,
                    fullName: userProfile?.name || currentUser.displayName || data.personalInfo?.fullName || ''
                  }
                });
                loadedList = [single];
                storedActiveId = single.id;
              }
            }
          } catch (fireErr) {
            console.warn('Firestore business fetch error, falling back to user-scoped cache:', fireErr);
          }
        }

        // 2. If not loaded from Firestore, check user-scoped local storage
        if (loadedList.length === 0) {
          try {
            const rawStored = localStorage.getItem(userStorageKey);
            if (rawStored) {
              const parsed = JSON.parse(rawStored);
              if (Array.isArray(parsed) && parsed.length > 0) {
                loadedList = parsed.map(normalizeBusinessRecord);
              }
            }
            storedActiveId = localStorage.getItem(userActiveIdKey);
          } catch (e) {
            console.warn('Error reading user-scoped storage:', e);
          }
        }

        // 3. Fallback: Seed clean default profile specifically for THIS user
        if (loadedList.length === 0) {
          const initialBiz = createDefaultBusinessForUser(currentUser, userProfile?.name);
          loadedList = [initialBiz];
          storedActiveId = initialBiz.id;
        }

        // Determine active ID
        const validActiveId = loadedList.some(b => b.id === storedActiveId)
          ? storedActiveId
          : loadedList[0].id;

        setBusinesses(loadedList);
        setActiveBusinessIdState(validActiveId);

        // Sync to user-scoped localStorage
        try {
          localStorage.setItem(userStorageKey, JSON.stringify(loadedList));
          localStorage.setItem(userActiveIdKey, validActiveId);
        } catch {}
      } catch (err) {
        console.error('Fatal error loading businesses:', err);
        setError('Failed to load businesses');
        const fallback = [createDefaultBusinessForUser(currentUser, userProfile?.name)];
        setBusinesses(fallback);
        setActiveBusinessIdState(fallback[0].id);
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, [currentUser?.uid, currentUser?.isDemo, userProfile?.name]);

  // Derived active business
  const activeBusiness = useMemo(() => {
    if (!businesses || businesses.length === 0) return null;
    const found = businesses.find(b => b.id === activeBusinessId);
    return found || businesses[0];
  }, [businesses, activeBusinessId]);

  // Persist helper strictly scoped to current user
  const persistState = async (updatedList, newActiveId) => {
    if (!currentUser) return;
    const userStorageKey = getStorageKey(currentUser.uid);
    const userActiveIdKey = getActiveIdKey(currentUser.uid);

    try {
      localStorage.setItem(userStorageKey, JSON.stringify(updatedList));
      if (newActiveId) {
        localStorage.setItem(userActiveIdKey, newActiveId);
      }
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    if (db && currentUser?.uid && !currentUser?.isDemo) {
      try {
        const docRef = doc(db, 'entrepreneurProfiles', currentUser.uid);
        await setDoc(
          docRef,
          {
            businesses: updatedList,
            activeBusinessId: newActiveId || activeBusinessId,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      } catch (e) {
        console.warn('Firestore sync error:', e);
      }
    }
  };

  // Set Active Business
  const setActiveBusiness = (id) => {
    const target = businesses.find(b => b.id === id);
    if (!target) return;

    setActiveBusinessIdState(id);
    if (currentUser) {
      try {
        localStorage.setItem(getActiveIdKey(currentUser.uid), id);
      } catch {}
    }

    if (db && currentUser?.uid && !currentUser?.isDemo) {
      try {
        const docRef = doc(db, 'entrepreneurProfiles', currentUser.uid);
        updateDoc(docRef, { activeBusinessId: id, updatedAt: serverTimestamp() });
      } catch {}
    }
  };

  // Direct sync from onboarding completion
  const syncUserProfileFromOnboarding = (profileData) => {
    if (!profileData) return;
    const bizList = profileData.businesses && Array.isArray(profileData.businesses) && profileData.businesses.length > 0
      ? profileData.businesses.map(normalizeBusinessRecord)
      : [normalizeBusinessRecord({
          ...profileData,
          id: profileData.business?.id || `biz_${(currentUser?.uid || 'user').slice(0, 8)}_${Date.now().toString(36)}`,
          name: profileData.business?.name || 'My Enterprise'
        })];
    const activeId = profileData.activeBusinessId || bizList[0].id;
    setBusinesses(bizList);
    setActiveBusinessIdState(activeId);

    if (currentUser?.uid) {
      try {
        localStorage.setItem(getStorageKey(currentUser.uid), JSON.stringify(bizList));
        localStorage.setItem(getActiveIdKey(currentUser.uid), activeId);
      } catch {}
    }
  };

  // Create Business
  const createBusiness = async (formData) => {
    const newId = `biz_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
    const newRecord = normalizeBusinessRecord({
      ...formData,
      id: newId,
      ownerId: currentUser?.uid || 'local_user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const updatedList = [...businesses, newRecord];
    setBusinesses(updatedList);
    setActiveBusinessIdState(newId);
    await persistState(updatedList, newId);
    return newRecord;
  };

  // Update Business
  const updateBusiness = async (id, updatedFields) => {
    const targetId = id || activeBusinessId;
    let updatedRecord = null;

    const updatedList = businesses.map((item) => {
      if (item.id === targetId) {
        const merged = {
          ...item,
          ...updatedFields,
          financialProfile: {
            ...item.financialProfile,
            ...(updatedFields.financialProfile || {})
          },
          goals: {
            ...item.goals,
            ...(updatedFields.goals || {})
          },
          personalInfo: {
            ...item.personalInfo,
            ...(updatedFields.personalInfo || {})
          },
          eligibilityProfile: {
            ...item.eligibilityProfile,
            ...(updatedFields.eligibilityProfile || {})
          },
          updatedAt: new Date().toISOString()
        };
        updatedRecord = normalizeBusinessRecord(merged);
        return updatedRecord;
      }
      return item;
    });

    setBusinesses(updatedList);
    await persistState(updatedList, activeBusinessId);
    return updatedRecord;
  };

  // Delete Business
  const deleteBusiness = async (id) => {
    if (businesses.length <= 1) {
      throw new Error('Cannot delete the only business profile.');
    }

    const updatedList = businesses.filter(b => b.id !== id);
    let nextActiveId = activeBusinessId;
    if (activeBusinessId === id) {
      nextActiveId = updatedList[0].id;
    }

    setBusinesses(updatedList);
    setActiveBusinessIdState(nextActiveId);
    await persistState(updatedList, nextActiveId);
    return true;
  };

  // Refresh businesses from user-scoped storage
  const refreshBusinesses = () => {
    if (!currentUser) return;
    try {
      const rawStored = localStorage.getItem(getStorageKey(currentUser.uid));
      if (rawStored) {
        const parsed = JSON.parse(rawStored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBusinesses(parsed.map(normalizeBusinessRecord));
        }
      }
      const storedActive = localStorage.getItem(getActiveIdKey(currentUser.uid));
      if (storedActive) setActiveBusinessIdState(storedActive);
    } catch {}
  };

  const value = {
    businesses,
    activeBusiness,
    activeBusinessId,
    loading,
    error,
    setActiveBusiness,
    createBusiness,
    updateBusiness,
    deleteBusiness,
    refreshBusinesses,
    syncUserProfileFromOnboarding
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}

const fallbackBusinessContext = {
  businesses: [DEFAULT_BUSINESS],
  activeBusiness: DEFAULT_BUSINESS,
  activeBusinessId: DEFAULT_BUSINESS.id,
  loading: false,
  error: null,
  setActiveBusiness: () => {},
  createBusiness: async () => DEFAULT_BUSINESS,
  updateBusiness: async () => DEFAULT_BUSINESS,
  deleteBusiness: async () => false,
  refreshBusinesses: () => {},
  syncUserProfileFromOnboarding: () => {}
};

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    return fallbackBusinessContext;
  }
  return context;
}

