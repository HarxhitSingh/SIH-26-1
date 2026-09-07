import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { auth, googleProvider, db, isFirebaseConfigured } from '../firebase/config';

const AuthContext = createContext(null);

const DEMO_USER_STORAGE_KEY = 'udyamsathi_demo_user';
const DEMO_PROFILE_STORAGE_KEY = 'udyamsathi_demo_profile';

const DEFAULT_DEMO_USER = {
  uid: 'demo-entrepreneur-01',
  displayName: 'Priya Sharma',
  email: 'priya.sharma@udyamsathi.in',
  photoURL: null,
  isDemo: true
};

const DEFAULT_DEMO_PROFILE = {
  id: 'demo-entrepreneur-01',
  name: 'Priya Sharma',
  email: 'priya.sharma@udyamsathi.in',
  onboardingCompleted: true,
  isDemo: true
};

// Helper to clear demo and legacy cross-user keys
export const clearDemoAndLegacyStorage = () => {
  localStorage.removeItem(DEMO_USER_STORAGE_KEY);
  localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
  localStorage.removeItem('udyamsathi_demo_profile_data');
  // Legacy unscoped keys that caused cross-user contamination
  localStorage.removeItem('udyamsaathi.businesses');
  localStorage.removeItem('udyamsaathi.activeBusinessId');
  localStorage.removeItem('udyamsaathi_onboarding_draft');
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user profile from Firestore
  const fetchUserProfile = async (uid) => {
    if (!db) {
      const stored = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    }

    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUserProfile(data);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile from Firestore:', error);
      return null;
    }
  };

  useEffect(() => {
    // If Firebase is not configured, fall back to stored demo user or guest
    if (!auth) {
      const storedDemoUser = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      const storedDemoProfile = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      if (storedDemoUser && storedDemoProfile) {
        try {
          setCurrentUser(JSON.parse(storedDemoUser));
          setUserProfile(JSON.parse(storedDemoProfile));
        } catch (e) {
          clearDemoAndLegacyStorage();
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
      return;
    }

    // Firebase is configured: ALWAYS listen to auth state changes so real sessions take precedence
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Active Firebase user: clear any leftover demo markers so they never interfere
        localStorage.removeItem(DEMO_USER_STORAGE_KEY);
        localStorage.removeItem(DEMO_PROFILE_STORAGE_KEY);
        localStorage.removeItem('udyamsathi_demo_profile_data');

        setCurrentUser(user);
        await fetchUserProfile(user.uid);
      } else {
        // No active Firebase user: check if demo mode was explicitly requested
        const storedDemoUser = localStorage.getItem(DEMO_USER_STORAGE_KEY);
        const storedDemoProfile = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
        if (storedDemoUser && storedDemoProfile) {
          try {
            setCurrentUser(JSON.parse(storedDemoUser));
            setUserProfile(JSON.parse(storedDemoProfile));
          } catch (e) {
            clearDemoAndLegacyStorage();
            setCurrentUser(null);
            setUserProfile(null);
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Demo user login for fast review or when Firebase credentials are not set
  const loginAsDemoUser = async (completedOnboarding = true) => {
    if (auth && auth.currentUser) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn('Sign out before demo login error:', e);
      }
    }

    const demoUser = { ...DEFAULT_DEMO_USER };
    const demoProfile = {
      ...DEFAULT_DEMO_PROFILE,
      onboardingCompleted: completedOnboarding
    };

    localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
    localStorage.setItem(DEMO_PROFILE_STORAGE_KEY, JSON.stringify(demoProfile));

    setCurrentUser(demoUser);
    setUserProfile(demoProfile);
    return { user: demoUser, profile: demoProfile };
  };

  // Sign up with Email and Password
  const signupWithEmail = async (fullName, email, password) => {
    if (!auth || !db) {
      throw new Error(
        'Firebase credentials are not configured in this deployment. Please configure VITE_FIREBASE_* environment variables or continue as Demo Entrepreneur.'
      );
    }

    clearDemoAndLegacyStorage();

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, {
      displayName: fullName
    });

    // Create user document in Firestore
    const newProfile = {
      id: user.uid,
      name: fullName,
      email: user.email,
      onboardingCompleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    await setDoc(doc(db, 'users', user.uid), newProfile);
    setCurrentUser(user);
    setUserProfile(newProfile);

    return user;
  };

  // Log in with Email and Password
  const loginWithEmail = async (email, password) => {
    if (!auth) {
      throw new Error(
        'Firebase credentials are not configured in this deployment. Please configure VITE_FIREBASE_* environment variables or continue as Demo Entrepreneur.'
      );
    }

    clearDemoAndLegacyStorage();

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    setCurrentUser(userCredential.user);
    const profile = await fetchUserProfile(userCredential.user.uid);
    return { user: userCredential.user, profile };
  };

  // Sign in with Google (Popup)
  const loginWithGoogle = async () => {
    if (!auth || !googleProvider || !db) {
      throw new Error(
        'Firebase credentials are not configured in this deployment. Please configure VITE_FIREBASE_* environment variables or continue as Demo Entrepreneur.'
      );
    }

    clearDemoAndLegacyStorage();

    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;

    // Check if user record already exists in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    let profile;
    if (!userDocSnap.exists()) {
      profile = {
        id: user.uid,
        name: user.displayName || 'Entrepreneur',
        email: user.email,
        photoURL: user.photoURL || null,
        onboardingCompleted: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userDocRef, profile);
    } else {
      profile = userDocSnap.data();
    }

    setCurrentUser(user);
    setUserProfile(profile);
    return { user, profile };
  };

  // Log out
  const logout = async () => {
    const currentUid = currentUser?.uid;
    clearDemoAndLegacyStorage();

    if (currentUid) {
      localStorage.removeItem(`udyamsaathi_onboarding_draft_${currentUid}`);
      localStorage.removeItem(`udyamsaathi.businesses_${currentUid}`);
      localStorage.removeItem(`udyamsaathi.activeBusinessId_${currentUid}`);
    }

    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error('Error signing out of Firebase:', err);
      }
    }

    setCurrentUser(null);
    setUserProfile(null);
  };

  // Refresh profile state
  const refreshProfile = async () => {
    if (currentUser?.isDemo) {
      const stored = localStorage.getItem(DEMO_PROFILE_STORAGE_KEY);
      if (stored) {
        const p = JSON.parse(stored);
        setUserProfile(p);
        return p;
      }
    }
    if (auth?.currentUser) {
      return await fetchUserProfile(auth.currentUser.uid);
    }
    return null;
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isFirebaseConfigured,
    loginAsDemoUser,
    signupWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
    refreshProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
      {loading && (
        <div className="min-h-screen flex items-center justify-center bg-[#FBFBFA]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-slate-500">Loading UdyamSaathi...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

