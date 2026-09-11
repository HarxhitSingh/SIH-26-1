import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusinessProvider } from './context/BusinessContext';
import { EntrepreneurProfileProvider } from './context/EntrepreneurProfileContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import OnboardingPage from './pages/OnboardingPage';

// Authenticated Application Shell & Dashboard Pages
import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import MyBusinessPage from './pages/MyBusinessPage';
import SchemesPage from './pages/SchemesPage';
import SchemeDetailPage from './pages/SchemeDetailPage';
import FundingPage from './pages/FundingPage';
import StrategyPage from './pages/StrategyPage';
import MarketingHubPage from './pages/MarketingHubPage';
import RoadmapPage from './pages/RoadmapPage';
import ProfessionalsPage from './pages/ProfessionalsPage';
import AdvisorPage from './pages/AdvisorPage';
import DocumentsPage from './pages/DocumentsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import { LanguageProvider } from './context/LanguageContext';
import { RoadmapProvider } from './roadmap/context/RoadmapContext';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <BusinessProvider>
            <EntrepreneurProfileProvider>
              <RoadmapProvider>
                <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<LandingPage />} />

                {/* Authentication Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignUpPage />} />

                {/* Protected Onboarding Flow (if already completed, redirects to /dashboard) */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute requireIncompleteOnboarding={true}>
                      <OnboardingPage />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Business Compass Application Shell & Routes */}
                <Route
                  element={
                    <ProtectedRoute requireCompletedOnboarding={true}>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/business" element={<MyBusinessPage />} />
                  <Route path="/schemes" element={<SchemesPage />} />
                  <Route path="/schemes/:id" element={<SchemeDetailPage />} />
                  <Route path="/funding" element={<FundingPage />} />
                  <Route path="/strategy" element={<StrategyPage />} />
                  <Route path="/marketing" element={<MarketingHubPage />} />
                  <Route path="/roadmap" element={<RoadmapPage />} />
                  <Route path="/professionals" element={<ProfessionalsPage />} />
                  <Route path="/advisor" element={<AdvisorPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>

                {/* Catch-all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </RoadmapProvider>
          </EntrepreneurProfileProvider>
        </BusinessProvider>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);
}
