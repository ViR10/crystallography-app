import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const HomeView: React.FC = () => {
  const navigate = useNavigate();

  // Hero interactive 3D crystal state
  const [heroMode, setHeroMode] = useState<'plane' | 'direction'>('plane');
  const [heroPlane, setHeroPlane] = useState<{ h: number; k: number; l: number; label: string }>({ h: 1, k: 1, l: 1, label: '(111) Octahedral' });
  const [heroRotY, setHeroRotY] = useState<number>(15);

  const presetPlanes = [
    { h: 1, k: 0, l: 0, label: '(100) Face' },
    { h: 1, k: 1, l: 0, label: '(110) Diagonal' },
    { h: 1, k: 1, l: 1, label: '(111) Octahedral' },
    { h: 0, k: 0, l: 1, label: '(001) Base' }
  ];

  return (
    <div className="homepage-wrap">
      <SeoHead
        title={seoData.home.title}
        description={seoData.home.description}
        canonical={seoData.home.canonical}
        keywords={seoData.home.keywords}
        jsonLd={seoData.home.jsonLd}
      />
      {/* ─── Hero Section ────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-container">
          {/* Left Column: Hero Copy & Gateway CTAs */}
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-pulse" />
              Interactive 3D Materials Platform
            </div>

            <h1 className="hero-title">
              Master Crystallography <span className="gradient-text">Visually</span>
            </h1>

            <p className="hero-subtitle">
              The premier interactive 3D learning platform for materials science, metallurgy, and physics students to master Miller Indices, crystal planes, and directional vectors.
            </p>

            <div className="hero-actions">
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn btn-primary hero-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="9" rx="1" />
                  <rect x="14" y="3" width="7" height="5" rx="1" />
                  <rect x="14" y="12" width="7" height="9" rx="1" />
                  <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
                Enter Student Dashboard →
              </button>

              <button 
                onClick={() => navigate('/learn/fundamentals')}
                className="btn btn-secondary hero-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Start Fundamentals
              </button>

              <button 
                onClick={() => navigate('/sandbox')}
                className="btn btn-outline hero-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                3D Sandbox
              </button>
            </div>

            {/* Platform Stats Row */}
            <div className="hero-stats-row">
              <div className="hero-stat-item">
                <span className="hero-stat-val">300+</span>
                <span className="hero-stat-lbl">Interactive Exercises</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-val">100%</span>
                <span className="hero-stat-lbl">Free &amp; Open Access</span>
              </div>
              <div className="hero-stat-divider" />
              <div className="hero-stat-item">
                <span className="hero-stat-val">3D Live</span>
                <span className="hero-stat-lbl">Simple Cubic Engine</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Interactive 3D Crystal Hero Visualizer */}
          <div className="hero-visual">
            <div className="hero-canvas-card">
              <div className="hero-canvas-header">
                <div className="hero-canvas-title">
                  <span className="crystal-indicator" />
                  Live Simple Cubic Unit Cell
                </div>
                <div className="hero-canvas-pill">
                  {heroMode === 'plane' ? heroPlane.label : '[111] Body Diagonal'}
                </div>
              </div>

              {/* 3D Canvas Container */}
              <div className="hero-canvas-viewport">
                <CrystalCanvas
                  module={heroMode === 'plane' ? 'planes' : 'directions'}
                  tab={0}
                  h={heroPlane.h}
                  k={heroPlane.k}
                  l={heroPlane.l}
                  u={1}
                  v={1}
                  w={1}
                  rotY={heroRotY}
                />
              </div>

              {/* Canvas Interactive Controls Bar */}
              <div className="hero-canvas-controls">
                <div className="hero-presets-row">
                  {presetPlanes.map(p => (
                    <button
                      key={p.label}
                      className={`hero-preset-btn ${heroMode === 'plane' && heroPlane.label === p.label ? 'active' : ''}`}
                      onClick={() => {
                        setHeroMode('plane');
                        setHeroPlane(p);
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                  <button
                    className={`hero-preset-btn ${heroMode === 'direction' ? 'active' : ''}`}
                    onClick={() => setHeroMode('direction')}
                  >
                    [111] Vector
                  </button>
                </div>

                <div className="hero-rotation-slider">
                  <label htmlFor="hero-rot">Rotate Unit Cell:</label>
                  <input
                    id="hero-rot"
                    type="range"
                    min="-45"
                    max="45"
                    value={heroRotY}
                    onChange={(e) => setHeroRotY(parseInt(e.target.value))}
                  />
                  <button 
                    className="hero-rot-reset" 
                    onClick={() => setHeroRotY(15)}
                    title="Reset angle"
                  >
                    ↺
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The 4-Step Learning Pipeline ────────────────────────────── */}
      <section className="pipeline-section">
        <div className="pipeline-container">
          <div className="section-heading text-center">
            <div className="curriculum-pill">Pedagogical Framework</div>
            <h2 className="section-title">The 4-Step Crystallography Mastery Loop</h2>
            <p className="section-subtitle">How our students achieve rapid spatial intuition and exam excellence</p>
          </div>

          <div className="pipeline-grid">
            <div className="pipeline-card">
              <div className="pipeline-num">1</div>
              <div className="pipeline-icon">👁️</div>
              <h3 className="pipeline-title">See in 3D</h3>
              <p className="pipeline-desc">
                Replace confusing 2D textbook diagrams with rotatable 3D unit cells. Inspect corner atoms and coordinate planes from any angle.
              </p>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-num">2</div>
              <div className="pipeline-icon">🧭</div>
              <h3 className="pipeline-title">Trace Step-by-Step</h3>
              <p className="pipeline-desc">
                Follow animated vector walks along the x, y, and z axes with live playback and automatic origin shifting for negative indices.
              </p>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-num">3</div>
              <div className="pipeline-icon">✏️</div>
              <h3 className="pipeline-title">Solve with Guidance</h3>
              <p className="pipeline-desc">
                Work through assisted problem-solving modules where each intermediate intercept and reciprocal step is verified before proceeding.
              </p>
            </div>

            <div className="pipeline-card">
              <div className="pipeline-num">4</div>
              <div className="pipeline-icon">⚔️</div>
              <h3 className="pipeline-title">Conquer the Arena</h3>
              <p className="pipeline-desc">
                Put your skills to the test with Blitz time-attacks, Boss Battles, and 300+ randomized questions to achieve full mastery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Educational Pillars & Features ──────────────────────────── */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-heading text-center">
            <h2 className="section-title">Built for Engineering Rigor</h2>
            <p className="section-subtitle">Engineered specifically for Materials Science, Metallurgy, and Solid-State Physics courses</p>
          </div>

          <div className="features-grid">
            <div className="feature-card" onClick={() => navigate('/learn/fundamentals')}>
              <div className="feature-icon-wrap" style={{ background: '#ecfdf5', color: '#10b981' }}>
                📘
              </div>
              <h3 className="feature-card-title">Crystallography Fundamentals</h3>
              <p className="feature-card-desc">
                Understand lattices, unit cell volumes, the 8 corner atoms of Simple Cubic (SC), coordination numbers, and coordinate frame orientations.
              </p>
              <span className="feature-card-link" style={{ color: '#10b981' }}>Explore Fundamentals →</span>
            </div>

            <div className="feature-card" onClick={() => navigate('/learn/miller-indices')}>
              <div className="feature-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
                🧭
              </div>
              <h3 className="feature-card-title">Directions &amp; Vectors [uvw]</h3>
              <p className="feature-card-desc">
                Master bracket notation, fractional coordinates, overbars for negative indices, origin shifts, and family of directions &lt;uvw&gt;.
              </p>
              <span className="feature-card-link" style={{ color: '#2563eb' }}>Explore Directions →</span>
            </div>

            <div className="feature-card" onClick={() => navigate('/learn/crystal-planes')}>
              <div className="feature-icon-wrap" style={{ background: '#faf5ff', color: '#9333ea' }}>
                🔷
              </div>
              <h3 className="feature-card-title">Crystal Planes (hkl)</h3>
              <p className="feature-card-desc">
                Calculate intercepts, compute reciprocals, clear fractions via LCM, understand planes parallel to axes with infinity, and octahedral planes.
              </p>
              <span className="feature-card-link" style={{ color: '#9333ea' }}>Explore Planes →</span>
            </div>

            <div className="feature-card" onClick={() => navigate('/practice')}>
              <div className="feature-icon-wrap" style={{ background: '#fffbeb', color: '#f59e0b' }}>
                ⚔️
              </div>
              <h3 className="feature-card-title">The Practice Arena</h3>
              <p className="feature-card-desc">
                Over 300+ randomized questions with multiple-choice, reverse identification, Blitz mode timers, Boss Battles, and combo multipliers.
              </p>
              <span className="feature-card-link" style={{ color: '#f59e0b' }}>Enter Arena →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Real-World Applications ─────────────────────────────────── */}
      <section className="applications-section">
        <div className="applications-container">
          <div className="section-heading text-center">
            <h2 className="section-title">Why Crystallography Matters in Industry</h2>
            <p className="section-subtitle">Real-world applications where Miller indices determine engineering outcomes</p>
          </div>

          <div className="app-cards-grid">
            <div className="app-card">
              <span className="app-icon">🔩</span>
              <h4>Metal Deformation &amp; Slip</h4>
              <p>Dislocations glide along closest-packed planes and directions. Miller indices define the active slip systems that dictate ductility.</p>
            </div>
            <div className="app-card">
              <span className="app-icon">📡</span>
              <h4>X-Ray Diffraction (XRD)</h4>
              <p>Constructive interference peaks occur at specific angles governed by Bragg's law (λ = 2d<sub>hkl</sub> sin θ) for each (hkl) plane.</p>
            </div>
            <div className="app-card">
              <span className="app-icon">💻</span>
              <h4>Semiconductor Wafers</h4>
              <p>Silicon ingots are sliced along specific crystallographic orientations like (100) or (111) for precise transistor chemical etching.</p>
            </div>
            <div className="app-card">
              <span className="app-icon">💎</span>
              <h4>Crystal Cleavage &amp; Growth</h4>
              <p>Crystals fracture along planes of lowest bond density. Miller indices predict facet growth rates and cleavage planes in ceramics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Final Call to Action ────────────────────────────────────── */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-card">
            <h2>Ready to Elevate Your Materials Engineering Skills?</h2>
            <p>Access the complete curriculum, interactive 3D visualizers, and practice arena completely free.</p>
            <div className="cta-buttons">
              <button onClick={() => navigate('/dashboard')} className="btn btn-light cta-btn">
                Go to Student Dashboard 🚀
              </button>
              <button onClick={() => navigate('/practice')} className="btn btn-secondary-light cta-btn">
                Battle in Arena ⚔️
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
