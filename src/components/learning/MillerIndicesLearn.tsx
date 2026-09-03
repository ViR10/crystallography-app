import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HUB_LESSONS } from './LessonDefinitions';
import { LessonView } from './LessonView';
import { useProgressStore } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const MillerIndicesLearn: React.FC = () => {
  const navigate = useNavigate();
  const { completedLessons } = useProgressStore();
  const [activeLevel, setActiveLevel] = useState<number | null>(null);

  if (activeLevel !== null) {
    const lessonInfo = HUB_LESSONS.directions.find(l => l.level === activeLevel)!;
    return (
      <LessonView 
        track="directions" 
        level={activeLevel} 
        lessonInfo={lessonInfo} 
        onBack={() => setActiveLevel(null)} 
      />
    );
  }

  const completedCount = completedLessons.directions.length;

  return (
    <div className="learn-roadmap-page">
      <div className="learn-roadmap-container">
        <SeoHead
          title={seoData.millerIndices.title}
          description={seoData.millerIndices.description}
          canonical={seoData.millerIndices.canonical}
          keywords={seoData.millerIndices.keywords}
          jsonLd={seoData.millerIndices.jsonLd}
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
              onClick={() => navigate('/learn/crystal-planes')}
              className="btn btn-outline btn-sm"
            >
              Switch to Planes (hkl) 🔷
            </button>
            <button 
              onClick={() => navigate('/practice/guided')}
              className="btn btn-outline btn-sm"
            >
              Guided Steps ✏️
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
          <div className="roadmap-pill-tag">Interactive Vector Curriculum</div>
          <h1 className="roadmap-hero-title">
            Crystallographic <span className="gradient-text">Directions [uvw]</span>
          </h1>
          <p className="roadmap-hero-desc">
            Master vector coordinates, origin shifting for negative indices, and animated 3D path tracing across 5 progressive levels.
          </p>

          <div className="roadmap-progress-summary">
            <div className="progress-summary-text">
              <strong>Progress:</strong> {completedCount} of {HUB_LESSONS.directions.length} Levels Complete ({Math.round((completedCount / HUB_LESSONS.directions.length) * 100)}%)
            </div>
            <div className="progress-summary-track">
              <div 
                className="progress-summary-fill" 
                style={{ width: `${(completedCount / HUB_LESSONS.directions.length) * 100}%`, background: '#2563eb' }}
              />
            </div>
          </div>
        </header>

        {/* Lessons List Cards */}
        <div className="roadmap-cards-list">
          {HUB_LESSONS.directions.map((l) => {
            const isCompleted = completedLessons.directions.includes(l.level);
            return (
              <div 
                key={l.level} 
                onClick={() => setActiveLevel(l.level)}
                className={`roadmap-lesson-card ${isCompleted ? 'completed' : ''}`}
              >
                <div className="lesson-card-main">
                  <div className="lesson-card-header">
                    <span className="lesson-card-icon">{l.icon}</span>
                    <h3 className="lesson-card-title">
                      Level {l.level}: {l.title}
                    </h3>
                  </div>
                  <div className="lesson-card-body">
                    <span className="lesson-tag-pill">{l.tag}</span>
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
                  <button className={`btn ${isCompleted ? 'btn-secondary' : 'btn-primary'} lesson-start-btn`}>
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
        <div className="roadmap-bottom-card">
          <div>
            <h3>Ready to put your directions knowledge to the test?</h3>
            <p>Challenge yourself in the Practice Arena with Blitz timed rounds and Boss Battles.</p>
          </div>
          <div className="roadmap-bottom-buttons">
            <button onClick={() => navigate('/practice/guided')} className="btn btn-outline">
              Guided Practice
            </button>
            <button onClick={() => navigate('/practice')} className="btn btn-primary">
              Enter Arena ⚔️
            </button>
          </div>
        </div>

        {/* ─── AEO / FAQ Semantic Educational Section ────────────────────── */}
        <section className="miller-faq-section" style={{ marginTop: '40px', padding: '32px', background: '#ffffff', borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: 'var(--card-shadow)' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
            Frequently Asked Questions: Crystallographic Directions [uvw]
          </h2>
          <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
            Clear explanations for directional vector problems, negative index overbars, and origin shifting.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <article style={{ borderLeft: '4px solid #2563eb', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What are Miller indices for crystallographic directions [uvw]?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                Miller indices for directions are a set of three reduced integers enclosed in square brackets <strong>[uvw]</strong> representing the directional vector connecting a reference origin to coordinate point (u, v, w) in terms of unit cell lattice parameters.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #9333ea', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                How do negative coordinates work in crystallographic directions?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                Negative directional components are written with an overbar above the number (e.g., [1̄10]). Whenever a vector points along a negative axis, the reference coordinate origin is shifted to a positive corner of the unit cell (e.g., origin shifted to (1,0,0)) so that the vector remains fully contained inside the unit cell volume.
              </p>
            </article>

            <article style={{ borderLeft: '4px solid #10b981', paddingLeft: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px' }}>
                What is the difference between [uvw] and &lt;uvw&gt;?
              </h3>
              <p style={{ fontSize: '14.5px', color: '#334155', lineHeight: '1.6', margin: 0 }}>
                Square brackets <strong>[uvw]</strong> denote one specific crystallographic direction vector, whereas angle brackets <strong>&lt;uvw&gt;</strong> denote an entire family of symmetry-equivalent directions (e.g., &lt;100&gt; includes [100], [010], [001], [1̄00], [01̄0], and [001̄]).
              </p>
            </article>
          </div>
        </section>

      </div>
    </div>
  );
};
