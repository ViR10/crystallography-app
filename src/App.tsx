import React, { useEffect, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useProgressStore } from './store/progressStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PracticeArena } from './components/practice/PracticeArena';
import { AboutView } from './components/about/AboutView';
import { HomeView } from './components/home/HomeView';
import { DashboardView } from './components/dashboard/DashboardView';
import { FundamentalsView } from './components/learning/FundamentalsView';
import { MillerIndicesLearn } from './components/learning/MillerIndicesLearn';
import { MillerGuidedPractice } from './components/practice/MillerGuidedPractice';
import { CrystalPlanesLearn } from './components/learning/CrystalPlanesLearn';
import { PlanesGuidedPractice } from './components/practice/PlanesGuidedPractice';
import { MasteryView } from './components/mastery/MasteryView';
import { ExpertSandbox } from './components/learning/ExpertSandbox';

export const App: React.FC = () => {
  const {
    toast,
    hideToast,
    achievementPopup,
    hideAchievementPopup,
    showToast
  } = useProgressStore();

  const hasShownWelcome = useRef(false);

  // Auto-close Toast messages
  useEffect(() => {
    if (toast?.visible) {
      const t = setTimeout(() => {
        hideToast();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [toast, hideToast]);

  // Auto-close Achievement popups
  useEffect(() => {
    if (achievementPopup?.visible) {
      const t = setTimeout(() => {
        hideAchievementPopup();
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [achievementPopup, hideAchievementPopup]);

  // Welcome toast on load (fires once per session)
  useEffect(() => {
    if (!hasShownWelcome.current) {
      hasShownWelcome.current = true;
      showToast('Welcome to CrystalloGraphy! Your progress is automatically saved.');
    }
  }, [showToast]);

  return (
    <>
      <Navbar />

      <div className="main-wrapper">
        <Routes>
          <Route path="/" element={<HomeView />} />
          
          {/* Learning Routes */}
          <Route path="/dashboard" element={<DashboardView />} />
          <Route path="/learn/fundamentals" element={<FundamentalsView />} />
          <Route path="/learn/miller-indices" element={<MillerIndicesLearn />} />
          <Route path="/learn/crystal-planes" element={<CrystalPlanesLearn />} />
          
          {/* Practice Routes */}
          <Route path="/practice/guided" element={<MillerGuidedPractice />} />
          <Route path="/practice/planes-guided" element={<PlanesGuidedPractice />} />
          <Route path="/practice" element={<PracticeArena />} />
          
          {/* Utilities */}
          <Route path="/mastery" element={<MasteryView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/sandbox" element={<ExpertSandbox />} />
          
          {/* Legacy redirects */}
          <Route path="/progress" element={<Navigate to="/dashboard" replace />} />
          <Route path="/learn/visualizer" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
      <Footer />

      {/* Dynamic Toast System */}
      <div className={`toast ${toast?.visible ? 'visible' : ''}`} id="toast">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <span id="toast-message">{toast?.message || 'Operation successful'}</span>
      </div>

      {/* Achievement Unlocked Popup */}
      <div className={`achievement-popup ${achievementPopup?.visible ? 'visible' : ''}`} id="achievement-popup">
        <div className="achievement-popup-icon" id="ach-icon">
          {achievementPopup?.icon && achievementPopup.icon.includes('<svg') ? (
            <div dangerouslySetInnerHTML={{ __html: achievementPopup.icon }} />
          ) : (
            <span style={{ fontSize: '28px' }}>{achievementPopup?.icon || '🏆'}</span>
          )}
        </div>
        <div>
          <div className="achievement-popup-title">Achievement Unlocked!</div>
          <div className="achievement-popup-name" id="ach-name">
            {achievementPopup?.name || ''}
          </div>
          <div className="achievement-popup-desc" id="ach-desc">
            {achievementPopup?.desc || ''}
          </div>
        </div>
      </div>
    </>
  );
};
