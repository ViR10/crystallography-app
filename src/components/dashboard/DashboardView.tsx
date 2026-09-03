import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore, getLevelInfo, ACHIEVEMENTS_DEF } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const { progress, completedLessons } = useProgressStore();

  const gs = progress.gameStats;
  const totalXP = gs.totalPoints || 0;
  const levelInfo = getLevelInfo(totalXP);

  const fundComplete = (completedLessons.fundamentals || []).length;
  const dirComplete = completedLessons.directions.length;
  const planeComplete = completedLessons.planes.length;
  
  const fundPct = Math.round((fundComplete / 4) * 100);
  const dirPct = Math.round((dirComplete / 5) * 100);
  const planePct = Math.round((planeComplete / 5) * 100);

  // Determine dynamic next recommended task
  const getNextRecommended = () => {
    if (fundComplete < 4) {
      return {
        title: `Fundamentals Topic 0${fundComplete + 1}`,
        desc: 'Build your foundation with unit cells and 3D coordinate system conventions.',
        route: '/learn/fundamentals',
        trackName: 'Module 01: Fundamentals',
        actionLabel: 'Resume Fundamentals →'
      };
    }
    if (dirComplete < 5) {
      return {
        title: `Directions [uvw] Level ${dirComplete + 1}`,
        desc: 'Master directional vector tracing, fractional coordinates, and origin shifts.',
        route: '/learn/miller-indices',
        trackName: 'Module 02: Directions',
        actionLabel: 'Resume Level →'
      };
    }
    if (planeComplete < 5) {
      return {
        title: `Crystal Planes (hkl) Level ${planeComplete + 1}`,
        desc: 'Derive planar Miller indices, reciprocals of intercepts, and plane families.',
        route: '/learn/crystal-planes',
        trackName: 'Module 03: Planes',
        actionLabel: 'Resume Level →'
      };
    }
    return {
      title: 'Curriculum Mastered! Test in the Arena',
      desc: 'You have completed all curriculum modules. Test your knowledge against Blitz timers!',
      route: '/practice',
      trackName: 'Practice Arena',
      actionLabel: 'Enter Arena ⚔️'
    };
  };

  const nextTask = getNextRecommended();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <SeoHead
          title={seoData.dashboard.title}
          description={seoData.dashboard.description}
          canonical={seoData.dashboard.canonical}
          robots={seoData.dashboard.robots}
        />
        
        {/* Personalized Student Welcome Header */}
        <header className="dashboard-header">
          <div>
            <div className="dashboard-badge">Student Command Center</div>
            <h1 className="dashboard-title">Welcome back, Scholar!</h1>
            <p className="dashboard-subtitle">
              Your personalized crystallography learning journey, streak status, and skill progression.
            </p>
          </div>
          <div className="dashboard-header-actions">
            <button 
              onClick={() => navigate('/practice')} 
              className="btn btn-primary"
            >
              Enter Practice Arena ⚔️
            </button>
            <button 
              onClick={() => navigate('/sandbox')} 
              className="btn btn-secondary"
            >
              3D Sandbox 🔬
            </button>
          </div>
        </header>

        {/* Dynamic Priority "Continue Learning" Hero Card */}
        <div className="dash-next-task-card">
          <div className="next-task-left">
            <div className="next-task-pill">
              <span className="crystal-indicator" />
              Next Recommended Action • {nextTask.trackName}
            </div>
            <h2 className="next-task-title">{nextTask.title}</h2>
            <p className="next-task-desc">{nextTask.desc}</p>
          </div>
          <button 
            onClick={() => navigate(nextTask.route)}
            className="btn btn-primary next-task-btn"
          >
            {nextTask.actionLabel}
          </button>
        </div>

        {/* Student Stats & Level Overview Grid */}
        <div className="dashboard-stats-grid">
          {/* XP & Level Progress Card */}
          <div className="dash-card xp-card">
            <div className="dash-card-header">
              <div>
                <span className="dash-level-pill">Level {levelInfo.level}</span>
                <h2 className="dash-rank-name">{levelInfo.name}</h2>
              </div>
              <div className="text-right">
                <div className="dash-xp-number">{totalXP} XP</div>
                <div className="dash-xp-sub">{levelInfo.xpToNext} XP to {levelInfo.nextName}</div>
              </div>
            </div>
            
            <div className="dash-xp-track">
              <div className="dash-xp-bar" style={{ width: `${levelInfo.pct}%` }} />
            </div>
            <div className="dash-xp-footer">
              <span>Progress: {levelInfo.pct}%</span>
              <span>Next Milestone: {levelInfo.nextName} (Level {levelInfo.level + 1})</span>
            </div>
          </div>

          {/* Streak & Consistency Card */}
          <div className="dash-card streak-card">
            <div className="streak-content">
              <div className="streak-icon-wrap">🔥</div>
              <div>
                <div className="streak-label">Active Learning Streak</div>
                <div className="streak-value">{gs.streak} {gs.streak === 1 ? 'Day' : 'Days'}</div>
                <div className="streak-max">Personal Best: {gs.maxStreak} Days • {gs.questionsCompleted} Solved</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Active Curriculum Progress Section */}
        <div className="dashboard-section">
          <div className="section-title-row">
            <h2 className="dash-section-heading">My Curriculum Tracks</h2>
            <span className="dash-section-meta">Complete each track to earn credentials and unlock advanced arena modes</span>
          </div>
          
          <div className="modules-list">
            {/* Fundamentals Track */}
            <div className="module-item mod-fundamentals">
              <div className="module-info">
                <div className="module-title-row">
                  <span className="module-icon">📘</span>
                  <h3 className="module-name">01. Crystallography Fundamentals</h3>
                  <span className={`module-status-badge ${fundComplete === 4 ? 'done' : fundComplete > 0 ? 'progress' : 'idle'}`}>
                    {fundComplete === 4 ? 'Completed' : fundComplete > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <div className="module-meta">
                  Lattices, unit cell geometry, Simple Cubic corner atoms, and 3D coordinate system conventions.
                </div>
                <div className="module-progress-track">
                  <div className="module-progress-fill" style={{ width: `${fundPct}%`, background: '#10b981' }} />
                </div>
                <div className="module-pct-label">{fundComplete} of 4 Topics Complete ({fundPct}%)</div>
              </div>
              <div className="module-btn-group">
                <button 
                  onClick={() => navigate('/learn/fundamentals')} 
                  className="btn btn-secondary module-action-btn"
                >
                  {fundComplete === 4 ? 'Review Topics' : 'Continue Track ➡️'}
                </button>
              </div>
            </div>

            {/* Directions Track */}
            <div className="module-item mod-directions">
              <div className="module-info">
                <div className="module-title-row">
                  <span className="module-icon">🧭</span>
                  <h3 className="module-name">02. Crystallographic Directions [uvw]</h3>
                  <span className={`module-status-badge ${dirComplete === 5 ? 'done' : dirComplete > 0 ? 'progress' : 'idle'}`}>
                    {dirComplete === 5 ? 'Mastered 🏆' : dirComplete > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <div className="module-meta">
                  Vector notation, origin shifting rules, negative indices with overbars, and animated 3D step traces.
                </div>
                <div className="module-progress-track">
                  <div className="module-progress-fill" style={{ width: `${dirPct}%`, background: '#2563eb' }} />
                </div>
                <div className="module-pct-label">{dirComplete} of 5 Levels Mastered ({dirPct}%)</div>
              </div>
              <div className="module-btn-group">
                <button 
                  onClick={() => navigate('/practice/guided')} 
                  className="btn btn-outline module-action-btn"
                  title="Step-by-step problem solver"
                >
                  Guided Practice
                </button>
                <button 
                  onClick={() => navigate('/learn/miller-indices')} 
                  className="btn btn-primary module-action-btn"
                >
                  {dirComplete === 5 ? 'Review Levels' : 'Continue Track ➡️'}
                </button>
              </div>
            </div>

            {/* Planes Track */}
            <div className="module-item mod-planes">
              <div className="module-info">
                <div className="module-title-row">
                  <span className="module-icon">🔷</span>
                  <h3 className="module-name">03. Crystal Planes (hkl)</h3>
                  <span className={`module-status-badge ${planeComplete === 5 ? 'done' : planeComplete > 0 ? 'progress' : 'idle'}`}>
                    {planeComplete === 5 ? 'Mastered 🏆' : planeComplete > 0 ? 'In Progress' : 'Not Started'}
                  </span>
                </div>
                <div className="module-meta">
                  Miller indices, reciprocal intercepts, planes parallel to axes, octahedral planes, and planar families.
                </div>
                <div className="module-progress-track">
                  <div className="module-progress-fill" style={{ width: `${planePct}%`, background: '#9333ea' }} />
                </div>
                <div className="module-pct-label">{planeComplete} of 5 Levels Mastered ({planePct}%)</div>
              </div>
              <div className="module-btn-group">
                <button 
                  onClick={() => navigate('/practice/planes-guided')} 
                  className="btn btn-outline module-action-btn"
                  title="Step-by-step planar problem solver"
                >
                  Guided Practice
                </button>
                <button 
                  onClick={() => navigate('/learn/crystal-planes')} 
                  className="btn btn-purple module-action-btn"
                >
                  {planeComplete === 5 ? 'Review Levels' : 'Continue Track ➡️'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launchpad Station (4 Tools) */}
        <div className="dashboard-section">
          <div className="section-title-row">
            <h2 className="dash-section-heading">Quick Launch Station</h2>
            <span className="dash-section-meta">Access all platform testing, sandbox, and diagnostic tools</span>
          </div>

          <div className="launchpad-grid">
            <div className="launchpad-card" onClick={() => navigate('/practice')}>
              <div className="launchpad-icon" style={{ background: '#fef3c7', color: '#d97706' }}>⚔️</div>
              <div className="launchpad-content">
                <h4 className="launchpad-title">Practice Arena</h4>
                <p className="launchpad-desc">Blitz time-attacks, Boss Battles, and 300+ randomized questions.</p>
              </div>
              <span className="launchpad-link">Launch Arena →</span>
            </div>

            <div className="launchpad-card" onClick={() => navigate('/sandbox')}>
              <div className="launchpad-icon" style={{ background: '#eff6ff', color: '#2563eb' }}>🔬</div>
              <div className="launchpad-content">
                <h4 className="launchpad-title">3D Expert Sandbox</h4>
                <p className="launchpad-desc">Free-form rotatable unit cell to draw or compute any (hkl) or [uvw].</p>
              </div>
              <span className="launchpad-link">Launch Sandbox →</span>
            </div>

            <div className="launchpad-card" onClick={() => navigate('/practice/guided')}>
              <div className="launchpad-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>✏️</div>
              <div className="launchpad-content">
                <h4 className="launchpad-title">Guided Problem Solver</h4>
                <p className="launchpad-desc">Step-by-step assisted vector and plane intercept calculation.</p>
              </div>
              <span className="launchpad-link">Launch Guided →</span>
            </div>

            <div className="launchpad-card" onClick={() => navigate('/mastery')}>
              <div className="launchpad-icon" style={{ background: '#faf5ff', color: '#9333ea' }}>🎓</div>
              <div className="launchpad-content">
                <h4 className="launchpad-title">Mastery Credentials</h4>
                <p className="launchpad-desc">View your graduation standing and total curriculum mastery.</p>
              </div>
              <span className="launchpad-link">View Credentials →</span>
            </div>
          </div>
        </div>

        {/* Bottom Section: Skills Breakdown & Achievements */}
        <div className="dashboard-grid-2col">
          
          {/* Skill Breakdown */}
          <div className="dash-card">
            <div className="dash-card-header-simple">
              <h3 className="dash-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 20V10M12 20V4M6 20v-6" />
                </svg>
                Arena Skill Accuracy
              </h3>
              <button 
                onClick={() => navigate('/practice')} 
                className="dash-text-link"
              >
                Launch Arena →
              </button>
            </div>

            <div className="skills-list">
              {(() => {
                const allSkills: { skill: string; score: number; count: number }[] = [];
                
                Object.entries(progress.planes.byType || {}).forEach(([cat, data]) => {
                  if (data.total > 0) {
                    allSkills.push({ skill: `Planes: ${cat}`, score: Math.round((data.correct / data.total) * 100), count: data.total });
                  }
                });

                Object.entries(progress.directions.byType || {}).forEach(([cat, data]) => {
                  if (data.total > 0) {
                    allSkills.push({ skill: `Dirs: ${cat}`, score: Math.round((data.correct / data.total) * 100), count: data.total });
                  }
                });
                
                allSkills.sort((a, b) => b.count - a.count);
                let displaySkills = allSkills.slice(0, 5);
                
                if (displaySkills.length === 0) {
                  return (
                    <div className="empty-skills-notice">
                      <p>No questions answered yet in the Practice Arena!</p>
                      <button 
                        onClick={() => navigate('/practice')} 
                        className="btn btn-primary btn-sm"
                      >
                        Start First Question ⚔️
                      </button>
                    </div>
                  );
                }

                return displaySkills.map(s => (
                  <div key={s.skill} className="skill-row">
                    <span className="skill-name" title={s.skill}>{s.skill}</span>
                    <div className="skill-bar-wrap">
                      <div className="skill-bar-track">
                        <div 
                          className="skill-bar-fill" 
                          style={{ 
                            width: `${s.score}%`, 
                            background: s.score >= 80 ? '#10b981' : s.score >= 50 ? '#f59e0b' : '#ef4444' 
                          }} 
                        />
                      </div>
                      <span className="skill-score">{s.score}%</span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Achievements Showcase */}
          <div className="dash-card">
            <div className="dash-card-header-simple">
              <h3 className="dash-section-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                Unlocked Badges
              </h3>
              <button 
                onClick={() => navigate('/mastery')} 
                className="dash-text-link"
              >
                View Mastery →
              </button>
            </div>

            <div className="achievements-preview-grid">
              {ACHIEVEMENTS_DEF.map(ach => {
                const isUnlocked = Boolean(gs.achievements[ach.id]);
                return (
                  <div 
                    key={ach.id} 
                    className={`dash-ach-item ${isUnlocked ? 'unlocked' : 'locked'}`}
                    title={`${ach.name}: ${ach.req}`}
                  >
                    <div className="dash-ach-icon">
                      {ach.icon}
                    </div>
                    <div className="dash-ach-name">{ach.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
