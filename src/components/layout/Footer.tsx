import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="premium-footer">
      <div className="footer-top">
        {/* Brand & Creator Identity Section */}
        <div className="footer-brand-section">
          <Link to="/" className="footer-logo">
            <div className="footer-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="footer-logo-text">CrystalloGraphy</span>
          </Link>
          <p className="footer-description">
            The next-generation interactive 3D learning platform for materials science, physics, and metallurgical engineering students.
          </p>

          {/* Social & Developer Profiles */}
          <div className="footer-socials">
            {/* LinkedIn */}
            <a 
              href="https://www.linkedin.com/in/adeel0014" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              title="LinkedIn - Adeel Shahid"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>

            {/* ViR Developers Organization Site */}
            <a 
              href="https://virdevelopers.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              title="ViR Developers Website"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
            </a>

            {/* Adeel Shahid Portfolio */}
            <a 
              href="https://adeelshahid.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-link" 
              title="Adeel Shahid - Digital Profile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </a>

            {/* About Page Internal Link */}
            <Link to="/about" className="social-link" title="About the Platform & Developers">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Sitemap Columns */}
        <div className="footer-links-group">
          <div className="footer-col">
            <h4 className="footer-heading">Curriculum</h4>
            <ul className="footer-links">
              <li><Link to="/learn/fundamentals">Fundamentals (SC &amp; Lattices)</Link></li>
              <li><Link to="/learn/miller-indices">Directions [uvw] Guide</Link></li>
              <li><Link to="/learn/crystal-planes">Planes (hkl) Guide</Link></li>
              <li><Link to="/sandbox">3D Expert Sandbox</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Practice &amp; Arena</h4>
            <ul className="footer-links">
              <li><Link to="/practice/guided">Miller Guided Steps</Link></li>
              <li><Link to="/practice/planes-guided">Planes Guided Steps</Link></li>
              <li><Link to="/practice">Battle Arena &amp; Blitz</Link></li>
              <li><Link to="/dashboard">Academy Dashboard</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-heading">Developer &amp; Team</h4>
            <ul className="footer-links">
              <li><a href="https://adeelshahid.netlify.app" target="_blank" rel="noopener noreferrer">Adeel Shahid (Profile) ↗</a></li>
              <li><a href="https://virdevelopers.netlify.app" target="_blank" rel="noopener noreferrer">ViR Developers ↗</a></li>
              <li><a href="https://www.linkedin.com/in/adeel0014" target="_blank" rel="noopener noreferrer">LinkedIn Profile ↗</a></li>
              <li><Link to="/about">About This Platform</Link></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="copyright">
            © 2026 ViR Developers. Designed &amp; Engineered by <a href="https://adeelshahid.netlify.app" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>Adeel Shahid</a>.
          </p>
          <div className="footer-legal">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/practice">Practice Arena</Link>
            <Link to="/sandbox">3D Sandbox</Link>
            <Link to="/about">About Us</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
