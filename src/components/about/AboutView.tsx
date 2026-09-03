import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const AboutView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div id="page-about">
      <SeoHead
        title={seoData.about.title}
        description={seoData.about.description}
        canonical={seoData.about.canonical}
        keywords={seoData.about.keywords}
        jsonLd={seoData.about.jsonLd}
      />
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content">
          <div className="about-badge animate-in">
            <span className="about-badge-dot"></span>
            Our Mission &amp; Vision
          </div>
          <h1 className="animate-in delay-1">
            Engineering Education<br />
            <span className="about-gradient-text">Reimagined in 3D</span>
          </h1>
          <p className="about-hero-subtitle animate-in delay-2">
            Bridging the gap between abstract metallurgical theory and interactive web technology,
            empowering students worldwide to master crystallography through intuitive spatial visualization.
          </p>

          <div className="about-hero-stats animate-in delay-3">
            <div className="about-stat">
              <div className="about-stat-value">300+</div>
              <div className="about-stat-label">Practice Exercises</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">100%</div>
              <div className="about-stat-label">Free &amp; Open Access</div>
            </div>
            <div className="about-stat">
              <div className="about-stat-value">3D Live</div>
              <div className="about-stat-label">Cubic Projections</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="about-main-content">
        {/* Features Grid */}
        <div className="about-features-grid">
          {/* Professional Impact */}
          <article className="about-feature-card">
            <div className="about-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                <line x1="12" y1="22.08" x2="12" y2="12" />
              </svg>
            </div>
            <h2 className="about-feature-title">Why an Interactive Tool?</h2>
            <p className="about-feature-description">
              Traditional textbooks teach 3D crystallographic planes and directional vectors using flat 2D black-and-white drawings. 
              Students often struggle with negative indices, origin shifts, and reciprocals. CrystalloGraphy solves this by placing real-time 3D spatial rotation right in the browser.
            </p>
            <ul className="about-feature-list">
              <li>Instant 3D spatial rotation &amp; inspection</li>
              <li>Animated vector steps with origin shifts</li>
              <li>Reciprocal space derivation for planes</li>
              <li>Real-time input validation &amp; guidance</li>
            </ul>
          </article>

          {/* Academic Excellence */}
          <article className="about-feature-card">
            <div className="about-feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h2 className="about-feature-title">Academic &amp; Industrial Relevance</h2>
            <p className="about-feature-description">
              Crystallography is the foundational backbone of modern materials science. Understanding Miller indices enables engineers to predict material properties and solve industrial problems:
            </p>
            <ul className="about-feature-list">
              <li>Metal slip systems and dislocation motion</li>
              <li>X-Ray Diffraction (XRD) Bragg peak indexing</li>
              <li>Semiconductor wafer orientation (e.g., Si (100) vs (111))</li>
              <li>Mechanical anisotropy and phase transformations</li>
            </ul>
          </article>
        </div>

        {/* Philosophy Section */}
        <section className="about-philosophy-section">
          <div className="about-philosophy-content">
            <div className="about-philosophy-label">Our Philosophy</div>
            <h2 className="about-philosophy-title">Theory Meets Modern Technology</h2>
            <p className="about-philosophy-text">
              We believe the best way to understand an engineering concept is to touch it, rotate it, and build spatial intuition. 
              By combining deep metallurgical principles with modern responsive web engineering, we've created a platform that makes crystallography intuitive, engaging, and freely accessible to everyone.
            </p>
          </div>
        </section>

        {/* Team & Lead Developer Section */}
        <section className="about-team-section">
          <div className="about-section-header">
            <span className="about-section-label">The Creators</span>
            <h2 className="about-section-title">Meet the Developer &amp; Organization</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' }}>
            {/* Lead Developer Card */}
            <div className="about-team-card" style={{ textAlign: 'center' }}>
              <div className="about-team-logo" style={{ background: '#eff6ff', color: '#2563eb', border: '2px solid #bfdbfe' }}>AS</div>
              <h3 className="about-team-name">Adeel Shahid</h3>
              <p className="about-team-role">Lead Engineer &amp; Platform Architect</p>
              <p className="about-team-bio">
                Software engineer and materials science enthusiast passionate about building high-performance educational software, interactive 3D simulations, and modern full-stack web applications.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                <a href="https://adeelshahid.netlify.app" target="_blank" rel="noopener noreferrer" className="about-team-link">
                  Digital Profile ↗
                </a>
                <a href="https://www.linkedin.com/in/adeel0014" target="_blank" rel="noopener noreferrer" className="about-team-link" style={{ background: '#0a66c2', color: 'white' }}>
                  LinkedIn ↗
                </a>
                <a href="https://github.com/ViR10" target="_blank" rel="noopener noreferrer" className="about-team-link" style={{ background: '#24292f', color: 'white' }}>
                  GitHub (@ViR10) ↗
                </a>
              </div>
            </div>

            {/* ViR Developers Organization Card */}
            <div className="about-team-card" style={{ textAlign: 'center' }}>
              <div className="about-team-logo">ViR</div>
              <h3 className="about-team-name">ViR Developers</h3>
              <p className="about-team-role">Engineering &amp; Technology Collective</p>
              <p className="about-team-bio">
                A creative technology collective focused on crafting impactful digital experiences, educational tools, and modern web solutions that solve real-world problems.
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}>
                <a href="https://virdevelopers.netlify.app" target="_blank" rel="noopener noreferrer" className="about-team-link">
                  Visit Portfolio ↗
                </a>
                <a href="https://github.com/ViR10" target="_blank" rel="noopener noreferrer" className="about-team-link" style={{ background: '#24292f', color: 'white' }}>
                  GitHub Org ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta-section">
          <h2 className="about-cta-title">Ready to Master Crystallography?</h2>
          <p className="about-cta-text">
            Explore our interactive curriculum, practice with real-time feedback, and master the 3D unit cell.
          </p>
          <div className="about-cta-buttons">
            <button className="btn btn-primary" onClick={() => navigate('/practice')}>
              Start Practicing Now ⚔️
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/learn/fundamentals')}>
              Explore Fundamentals 📘
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
