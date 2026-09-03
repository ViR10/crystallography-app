import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HUB_LESSONS } from './LessonDefinitions';
import { LessonView } from './LessonView';
import { useProgressStore } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const CrystalPlanesLearn: React.FC = () => {
  const navigate = useNavigate();
  const { completedLessons } = useProgressStore();
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  if (activeLevel !== null) {
    const lessonInfo = HUB_LESSONS.planes.find(l => l.level === activeLevel)!;
    return (
      <LessonView 
        track="planes" 
        level={activeLevel} 
        lessonInfo={lessonInfo} 
        onBack={() => setActiveLevel(null)} 
      />
    );
  }

  const completedCount = completedLessons.planes.length;

  return (
    <div className="learn-roadmap-page">
      <div className="learn-roadmap-container">
        <SeoHead
          title={seoData.crystalPlanes.title}
          description={seoData.crystalPlanes.description}
          canonical={seoData.crystalPlanes.canonical}
          keywords={seoData.crystalPlanes.keywords}
          jsonLd={seoData.crystalPlanes.jsonLd}
        />
        {/* Top Action & Navigation Bar */}
        <div className="roadmap-topbar">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-secondary btn-sm"
          >
            ← Dashboard
          </button>
          
          <div className="roadmap-quick-switches">
            <button 
              onClick={() => navigate('/learn/miller-indices')}
              className="btn btn-outline btn-sm"
            >
              Switch to Directions [uvw] 🧭
            </button>
            <button 
              onClick={() => navigate('/practice/planes-guided')}
              className="btn btn-outline btn-sm"
            >
              Planes Guided Steps ✏️
            </button>
            <button 
              onClick={() => navigate('/sandbox')}
              className="btn btn-outline btn-sm"
            >
              3D Sandbox 🔬
            </button>
          </div>
        </div>

        {/* Roadmap Header */}
        <header className="roadmap-hero-header">
          <div className="roadmap-pill-tag purple">Interactive Planar Curriculum</div>
          <h1 className="roadmap-hero-title">
            Crystal <span className="gradient-text-purple">Planes (hkl)</span>
          </h1>
          <p className="roadmap-hero-desc">
            Master Miller indices for planes, reciprocals of intercepts, planes parallel to axes, and octahedral facets across 5 structured levels.
          </p>

          <div className="roadmap-progress-summary">
            <div className="progress-summary-text">
              <strong>Progress:</strong> {completedCount} of {HUB_LESSONS.planes.length} Levels Complete ({Math.round((completedCount / HUB_LESSONS.planes.length) * 100)}%)
            </div>
            <div className="progress-summary-track">
              <div 
                className="progress-summary-fill" 
                style={{ width: `${(completedCount / HUB_LESSONS.planes.length) * 100}%`, background: '#9333ea' }}
              />
            </div>
          </div>
        </header>

        {/* Lessons List Cards */}
        <div className="roadmap-cards-list">
          {HUB_LESSONS.planes.map((l) => {
            const isCompleted = completedLessons.planes.includes(l.level);
            return (
              <div 
                key={l.level} 
                onClick={() => setActiveLevel(l.level)}
                className={`roadmap-lesson-card purple ${isCompleted ? 'completed' : ''}`}
              >
                <div className="lesson-card-main">
                  <div className="lesson-card-header">
                    <span className="lesson-card-icon">{l.icon}</span>
                    <h3 className="lesson-card-title">
                      Level {l.level}: {l.title}
                    </h3>
                  </div>
                  <div className="lesson-card-body">
                    <span className="lesson-tag-pill purple">{l.tag}</span>
                    <p className="lesson-desc-text">{l.desc}</p>
                  </div>
                </div>
                
                <div className="lesson-card-actions">
                  {isCompleted && (
                    <span className="lesson-completed-chip">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Completed
                    </span>
                  )}
                  <button className={`btn ${isCompleted ? 'btn-secondary' : 'btn-purple'} lesson-start-btn`}>
                    {isCompleted ? 'Review' : 'Start Level'}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Practice Banner */}
        <div className="roadmap-bottom-card purple">
          <div>
            <h3>Ready to practice identifying crystal planes?</h3>
            <p>Test your spatial skills in the Practice Arena or solve step-by-step guided plane exercises.</p>
          </div>
          <div className="roadmap-bottom-buttons">
            <button onClick={() => navigate('/practice/planes-guided')} className="btn btn-outline">
              Planes Guided Steps
            </button>
            <button onClick={() => navigate('/practice')} className="btn btn-purple">
              Enter Arena ⚔️
            </button>
          </div>
        </div>

        {/* ─── AEO / FAQ Semantic Educational Section ────────────────────── */}
        <section className="planes-faq-section" style={{ marginTop: '40px', padding: '32px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Frequently Asked Questions: Crystal Planes (hkl)
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Concise, authoritative answers for determining planar Miller indices, axial reciprocals, and parallel intercepts.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <article style={{ borderLeft: '4px solid #9333ea', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                How do you calculate Miller indices (hkl) for a crystal plane?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                1. Determine the fractional intercepts of the plane along the x, y, and z axes (p, q, r). 2. Invert each intercept to find its reciprocal (1/p, 1/q, 1/r). 3. Clear any fractions by multiplying by the least common multiple (LCM). 4. Enclose the resulting integers in round parentheses <strong>(hkl)</strong>.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #2563eb', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What does an index of 0 mean in crystal planes (hkl)?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                An index of 0 indicates that the plane is completely parallel to that crystallographic axis and intercepts it at infinity (since 1/∞ = 0). For example, the <strong>(100)</strong> plane intercepts the x-axis at 1 and is parallel to both the y and z axes.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #10b981', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What does the (111) plane represent in a cubic crystal?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                The <strong>(111)</strong> plane intercepts all three axes at unit length (1, 1, 1). In cubic systems, it forms an equilateral triangular cut across the unit cell corners and represents the closest-packed octahedral plane family &#123;111&#125; in FCC and diamond cubic structures.
              </p>
            </article>
          </div>
        </section>

      </div>
    </div>
  );
};
