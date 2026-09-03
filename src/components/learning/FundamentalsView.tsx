import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import { useProgressStore } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

const FUNDAMENTAL_LESSONS = [
  {
    id: 1,
    title: 'What is Crystallography?',
    desc: 'Understand the periodic arrangement of atoms in metals & solids.',
    content: (
      <>
        <p>
          <strong>Crystallography</strong> is the experimental science of determining the arrangement of atoms in crystalline solids. 
          In materials engineering, metallurgy, and solid-state physics, nearly all metals (like iron, copper, gold, aluminum) and advanced ceramics are crystalline.
        </p>
        <p>
          The regular, periodic three-dimensional arrangement of atoms dictates key physical properties:
        </p>
        <ul className="lesson-bullet-list">
          <li><strong>Mechanical strength &amp; ductility:</strong> How dislocations move along specific crystal planes.</li>
          <li><strong>Electrical &amp; thermal conductivity:</strong> Electron transport through the lattice.</li>
          <li><strong>X-Ray Diffraction (XRD):</strong> Constructive interference governed by Bragg's Law (λ = 2d sin θ).</li>
        </ul>
        <p>
          To specify directions of slip and planes of atomic density, materials scientists use <strong>Miller Indices</strong>.
        </p>
      </>
    ),
    type: 'read',
    visualState: { module: 'planes', h: 1, k: 0, l: 0, u: 0, v: 0, w: 0 }
  },
  {
    id: 2,
    title: 'Crystal Lattice & Unit Cell',
    desc: 'The fundamental repeating building block of a 3D crystal.',
    content: (
      <>
        <p>
          A <strong>crystal lattice</strong> is an infinite periodic array of points in space, where every lattice point has identical surroundings.
        </p>
        <p>
          A <strong>unit cell</strong> is the smallest repeating volume of the lattice that, when tiled in three dimensions by pure translation, generates the entire crystal structure.
        </p>
        <div className="callout-note">
          <strong>Analogy:</strong> Think of a unit cell like an individual brick in a brick wall, or a single repeating tile in an intricate mosaic pattern.
        </div>
      </>
    ),
    type: 'visual',
    visualState: { module: 'planes', h: 0, k: 0, l: 1, u: 0, v: 0, w: 0 }
  },
  {
    id: 3,
    title: 'Simple Cubic (SC) Structure',
    desc: 'Atoms at the 8 corners of the cubic unit cell.',
    content: (
      <>
        <p>
          The <strong>Simple Cubic (SC)</strong> crystal structure is the baseline cubic unit cell.
        </p>
        <ul className="lesson-bullet-list">
          <li><strong>Atom Positions:</strong> Atoms are positioned only at the 8 corners of the cube.</li>
          <li><strong>Atom Sharing:</strong> Each corner atom is shared equally among 8 adjacent unit cells.</li>
          <li><strong>Net Atoms per Unit Cell:</strong> \(8 \times \frac{1}{8} = 1\) net atom per unit cell.</li>
          <li><strong>Coordination Number:</strong> 6 (each atom touches 6 nearest neighbors).</li>
          <li><strong>Atomic Packing Factor (APF):</strong> \(0.52\) (approximately 52% of the cell volume is occupied).</li>
        </ul>
      </>
    ),
    type: 'visual',
    visualState: { module: 'planes', h: 1, k: 1, l: 0, u: 0, v: 0, w: 0 }
  },
  {
    id: 4,
    title: '3D Coordinate System Orientation',
    desc: 'Mastering the x, y, and z crystallographic axes convention.',
    content: (
      <>
        <p>
          In materials engineering, we establish a right-handed orthogonal coordinate system with respect to the cubic unit cell:
        </p>
        <ul className="lesson-bullet-list">
          <li><strong>Origin (0,0,0):</strong> Typically situated at the back-bottom-left corner of the unit cell.</li>
          <li><strong>X-Axis (Blue):</strong> Projects forward (out of the page/screen toward the observer).</li>
          <li><strong>Y-Axis (Green):</strong> Extends horizontally to the right.</li>
          <li><strong>Z-Axis (Red):</strong> Extends vertically upward.</li>
        </ul>
        <p>
          Every crystallographic direction vector \([uvw]\) and plane \((hkl)\) is referenced to this exact coordinate frame.
        </p>
      </>
    ),
    type: 'visual',
    visualState: { module: 'directions', h: 0, k: 0, l: 0, u: 1, v: 1, w: 1 }
  }
];

export const FundamentalsView: React.FC = () => {
  const navigate = useNavigate();
  const { completedLessons, completeLesson } = useProgressStore();
  const [activeLessonId, setActiveLessonId] = useState<number>(1);
  const [rotY, setRotY] = useState(15);
  const [showCelebration, setShowCelebration] = useState(false);

  const activeLesson = FUNDAMENTAL_LESSONS.find(l => l.id === activeLessonId) || FUNDAMENTAL_LESSONS[0];
  const fundList = completedLessons.fundamentals || [];
  const isLessonCompleted = (id: number) => fundList.includes(id);

  const handleCompleteCurrent = () => {
    completeLesson('fundamentals', activeLessonId);

    if (activeLessonId < FUNDAMENTAL_LESSONS.length) {
      setActiveLessonId(activeLessonId + 1);
    } else {
      setShowCelebration(true);
    }
  };

  return (
    <div className="fundamentals-page">
      <div className="fundamentals-container">
        <SeoHead
          title={seoData.fundamentals.title}
          description={seoData.fundamentals.description}
          canonical={seoData.fundamentals.canonical}
          keywords={seoData.fundamentals.keywords}
          jsonLd={seoData.fundamentals.jsonLd}
        />

        {/* Navigation Breadcrumb Bar */}
        <div className="fundamentals-topbar">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-secondary btn-sm"
          >
            ← Back to Dashboard
          </button>
          <div className="breadcrumb-text">
            Curriculum → Module 01: Fundamentals → {activeLesson.title}
          </div>
          <div className="fundamentals-badge">
            {fundList.length}/{FUNDAMENTAL_LESSONS.length} Completed
          </div>
        </div>

        {/* Responsive Layout Grid */}
        <div className="fundamentals-layout">
          {/* Module Selector Sidebar / Mobile Tabs */}
          <aside className="fundamentals-sidebar">
            <h3 className="sidebar-title">Fundamentals Topics</h3>
            <div className="sidebar-topic-list">
              {FUNDAMENTAL_LESSONS.map((l) => {
                const isActive = l.id === activeLessonId;
                const isDone = isLessonCompleted(l.id);
                return (
                  <button
                    key={l.id}
                    className={`topic-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => setActiveLessonId(l.id)}
                  >
                    <div className="topic-icon">
                      {isDone ? '✅' : l.id}
                    </div>
                    <div className="topic-info">
                      <div className="topic-title">{l.title}</div>
                      <div className="topic-desc">{l.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Lesson Content Card */}
          <main className="fundamentals-content">
            <div className="lesson-header-card">
              <span className="lesson-step-pill">Topic {activeLesson.id} of {FUNDAMENTAL_LESSONS.length}</span>
              <h1 className="lesson-main-title">{activeLesson.title}</h1>
              <p className="lesson-main-desc">{activeLesson.desc}</p>
            </div>

            <div className="lesson-body-text">
              {activeLesson.content}
            </div>

            {/* Interactive Visualizer Canvas */}
            {activeLesson.type === 'visual' && (
              <div className="fundamentals-canvas-card">
                <div className="canvas-card-top">
                  <div className="canvas-card-label">
                    <span className="crystal-indicator" />
                    3D Interactive Demonstration: {activeLesson.visualState.module === 'planes' ? 'Plane Projection' : 'Coordinate Axes & Vector'}
                  </div>
                  <div className="canvas-rot-wrap">
                    <label>Rotate:</label>
                    <input
                      type="range"
                      min="-45"
                      max="45"
                      value={rotY}
                      onChange={(e) => setRotY(parseInt(e.target.value))}
                    />
                    <button className="btn btn-xs" onClick={() => setRotY(15)}>↺</button>
                  </div>
                </div>

                <div className="fundamentals-canvas-wrap">
                  <CrystalCanvas
                    module={activeLesson.visualState.module as 'planes' | 'directions'}
                    tab={0}
                    h={activeLesson.visualState.h}
                    k={activeLesson.visualState.k}
                    l={activeLesson.visualState.l}
                    u={activeLesson.visualState.u}
                    v={activeLesson.visualState.v}
                    w={activeLesson.visualState.w}
                    rotY={rotY}
                  />
                </div>
              </div>
            )}

            {/* Step Action Bar */}
            <div className="fundamentals-actions">
              <button
                className="btn btn-secondary"
                disabled={activeLessonId === 1}
                onClick={() => setActiveLessonId(prev => Math.max(1, prev - 1))}
              >
                ← Previous Topic
              </button>

              <button
                className="btn btn-primary"
                onClick={handleCompleteCurrent}
              >
                {activeLessonId === FUNDAMENTAL_LESSONS.length ? 'Finish & Mark Completed 🏆' : 'Mark Complete & Next →'}
              </button>
            </div>
          </main>
        </div>

        {/* ─── AEO / FAQ Semantic Educational Section ────────────────────── */}
        <section className="fundamentals-faq-section" style={{ marginTop: '48px', padding: '32px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Frequently Asked Questions: Crystallography Fundamentals
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Direct answers to core concepts tested in materials science, metallurgy, and solid-state physics examinations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <article style={{ borderLeft: '4px solid #10b981', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What is a crystal lattice in materials science?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                A crystal lattice is an infinite, periodic, three-dimensional array of geometric points in space where every lattice point possesses identical physical, atomic, and chemical surroundings.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #2563eb', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What is a unit cell in crystallography?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                A unit cell is the smallest repeating structural volume of a crystal lattice that retains the full symmetry, geometry, and chemical stoichiometry of the entire crystalline substance. Repeating this volume in 3D space reconstructs the entire crystal.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #9333ea', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                How many atoms are in a Simple Cubic (SC) unit cell?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                A Simple Cubic (SC) unit cell contains exactly <strong>1 net atom</strong>. It has 8 corner atoms, and each corner atom is shared equally among 8 adjacent unit cells (8 × 1/8 = 1 atom). It has a coordination number of 6 and an atomic packing factor (APF) of approximately 0.52.
              </p>
            </article>
          </div>
        </section>

        {/* Celebration Modal when all fundamentals complete */}
        {showCelebration && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-icon">🎉</div>
              <h2 className="modal-title">Fundamentals Completed!</h2>
              <p className="modal-desc">
                Outstanding! You have mastered crystal lattices, unit cell geometry, and 3D coordinate orientations.
                You are now ready to tackle <strong>Crystallographic Directions [uvw]</strong> and <strong>Planes (hkl)</strong>!
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/learn/miller-indices')}
                >
                  Proceed to Directions [uvw] ➡️
                </button>
                <button
                  className="btn btn-purple"
                  onClick={() => navigate('/learn/crystal-planes')}
                >
                  Proceed to Planes (hkl) 🔷
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowCelebration(false);
                    navigate('/dashboard');
                  }}
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
