import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProgressStore, getLevelInfo } from '../../store/progressStore';

export const Navbar: React.FC = () => {
  const { progress } = useProgressStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const totalXP = progress.gameStats.totalPoints || 0;
  const lvlInfo = getLevelInfo(totalXP);

  // Close mobile drawer on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    {
      id: '/',
      label: 'Home',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    {
      id: '/dashboard',
      label: 'Dashboard',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      )
    },
    {
      id: '/learn/fundamentals',
      label: 'Fundamentals',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <circle cx="12" cy="12" r="9" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )
    },
    {
      id: '/learn/miller-indices',
      label: 'Directions',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      )
    },
    {
      id: '/learn/crystal-planes',
      label: 'Planes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      )
    },
    {
      id: '/sandbox',
      label: '3D Sandbox',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      )
    },
    {
      id: '/practice',
      label: 'Arena',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      )
    }
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>
          <div className="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#2563eb" stroke="#1e40af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="logo-text">CrystalloGraphy</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.id;
            return (
              <li key={item.id}>
                <Link
                  to={item.id}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* User Level & XP Chip (Desktop & Tablet) */}
        <div className="nav-right-actions">
          <Link to="/dashboard" className="nav-xp-chip" title="View student dashboard & progress">
            <span className="nav-xp-badge">Lvl {lvlInfo.level}</span>
            <span className="nav-xp-text">{totalXP} XP</span>
          </Link>

          {/* Hamburger Menu Toggle Button */}
          <button
            className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen ? 'true' : 'false'}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-backdrop" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div className={`mobile-nav-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="mobile-user-card">
            <div className="mobile-user-avatar">
              {lvlInfo.level >= 6 ? '🔮' : lvlInfo.level >= 4 ? '🎓' : '🧑‍🔬'}
            </div>
            <div>
              <div className="mobile-user-rank">{lvlInfo.name} (Lvl {lvlInfo.level})</div>
              <div className="mobile-user-xp">{totalXP} Total XP • {lvlInfo.xpToNext} to Next Level</div>
            </div>
          </div>
          <div className="mobile-xp-bar">
            <div className="mobile-xp-fill" style={{ width: `${lvlInfo.pct}%` }} />
          </div>
        </div>

        <div className="mobile-drawer-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.id;
            return (
              <Link
                key={item.id}
                to={item.id}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="mobile-item-icon">{item.icon}</div>
                <span className="mobile-item-label">{item.label}</span>
                {isActive && <span className="mobile-active-dot" />}
              </Link>
            );
          })}
          
          <Link
            to="/about"
            className={`mobile-nav-item ${location.pathname === '/about' ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="mobile-item-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </div>
            <span className="mobile-item-label">About Platform</span>
          </Link>
        </div>

        <div className="mobile-drawer-footer">
          <Link 
            to="/practice" 
            className="mobile-cta-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            ⚔️ Quick Practice Arena
          </Link>
        </div>
      </div>
    </nav>
  );
};
