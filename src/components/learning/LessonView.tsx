import React, { useState, useEffect } from 'react';
import { useProgressStore } from '../../store/progressStore';
import { getLessonSteps, LessonDef } from './LessonDefinitions';
import { LessonCanvas } from './LessonCanvas';

interface LessonViewProps {
  track: 'directions' | 'planes';
  level: number;
  lessonInfo: LessonDef;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  track,
  level,
  lessonInfo,
  onBack
}) => {
  const { completeLesson } = useProgressStore();
  const [stepIndex, setStepIndex] = useState(0);

  // Live animation controller states
  const [isPlaying, setIsPlaying] = useState(true);
  const [activePhase, setActivePhase] = useState<'origin' | 'x' | 'y' | 'z' | 'vector' | undefined>(undefined);
  const [resetKey, setResetKey] = useState(0);

  const steps = React.useMemo(() => getLessonSteps(track, level), [track, level]);
  const currentStep = steps[stepIndex] || { html: '', type: 'static' };

  // Reset controls on slide changes
  useEffect(() => {
    setIsPlaying(true);
    setActivePhase(undefined);
    setResetKey(0);
  }, [stepIndex]);

  const handleNext = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const handleComplete = () => {
    completeLesson(track, level);
    onBack();
  };

  const handleRestart = () => {
    setResetKey(prev => prev + 1);
    setActivePhase(undefined);
  };

  const isLast = stepIndex === steps.length - 1;

  const checkIcon = (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" style={{ display: 'inline-block', verticalAlign: '-1px' }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );

  // Return text descriptions corresponding to active phase for guiding
  const getPhaseExplanation = () => {
    switch (activePhase) {
      case 'origin':
        return '📍 Tail placement: Start at the origin atom (0, 0, 0) or the shifted origin.';
      case 'x':
        return '🔵 X-Axis Travel: Moving along the x-axis (Front-Left).';
      case 'y':
        return '🟢 Y-Axis Travel: Moving parallel to the y-axis (Right).';
      case 'z':
        return '🔴 Z-Axis Travel: Moving parallel to the z-axis (Up).';
      case 'vector':
        return '🎯 Vector drawn! Connecting starting tail to final head coordinate.';
      default:
        return 'Click play to start the step-by-step vector trace.';
    }
  };

  const isAnimated = currentStep.type === 'animated';

  const handleSegmentChange = React.useCallback((_: number, phase: 'origin' | 'x' | 'y' | 'z' | 'vector' | undefined) => {
    setActivePhase(phase);
  }, []);

  return (
    <div id="hub-lesson-view" className="hub-lesson-view">
      {/* Breadcrumb + nav */}
      <div className="hub-lesson-topbar">
        <button className="hub-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to roadmap
        </button>
        <div className="hub-breadcrumb">
          Course Roadmap → {track === 'directions' ? 'Crystallographic Directions' : 'Crystallographic Planes'} → {lessonInfo.title}
        </div>
        <div className="lesson-xp-badge">+25 XP on complete</div>
      </div>

      {/* Stepper */}
      <div className="lesson-stepper-wrap">
        <div className="lesson-stepper">
          {steps.map((_, idx) => {
            const isDone = idx < stepIndex;
            const isActive = idx === stepIndex;
            const cls = isDone ? 'ls-done' : isActive ? 'ls-active' : 'ls-idle';

            return (
              <React.Fragment key={idx}>
                {idx > 0 && <div className="ls-line" />}
                <div
                  className={`ls-dot ${cls}`}
                  onClick={() => setStepIndex(idx)}
                  title={`Step ${idx + 1}`}
                >
                  <span>{isDone ? checkIcon : idx + 1}</span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main lesson layout */}
      <div className="lesson-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
        <div className="lesson-canvas-wrap" style={{ position: 'relative' }}>
          <LessonCanvas
            type={currentStep.type}
            drawStatic={currentStep.drawStatic}
            segments={currentStep.segments}
            stepIndex={stepIndex + resetKey}
            isPlaying={isPlaying}
            onSegmentChange={handleSegmentChange}
          />

          {/* Interactive Live Controls Panel */}
          {isAnimated && (
            <div className="live-controls-bar" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              padding: '12px',
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              marginTop: '15px'
            }}>
              <button
                className={`btn ${isPlaying ? 'btn-secondary' : 'btn-primary'}`}
                style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    Pause Animation
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Play Live Animation
                  </>
                )}
              </button>

              <button
                className="btn btn-secondary"
                style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={handleRestart}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 12" />
                </svg>
                Restart Trace
              </button>
            </div>
          )}

          <div className="lesson-axis-legend" style={{ marginTop: '15px' }}>
            <span className="lal-item">
              <span className="lal-dot" style={{ background: '#005A9E' }}></span>x (Front-Left)
            </span>
            <span className="lal-item">
              <span className="lal-dot" style={{ background: '#107C10' }}></span>y (Right)
            </span>
            <span className="lal-item">
              <span className="lal-dot" style={{ background: '#A4262C' }}></span>z (Up)
            </span>
          </div>
        </div>

        <div className="lesson-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="lesson-tag">{lessonInfo.tag}</div>
          <h2 className="lesson-title">{lessonInfo.title}</h2>
          
          <div
            className="lesson-explanation"
            dangerouslySetInnerHTML={{ __html: currentStep.html }}
            style={{ marginBottom: '20px' }}
          />

          {/* Guide Overlay Panel */}
          {isAnimated && (
            <div className="live-guide-card" style={{
              background: '#f8fafc',
              color: '#0f172a',
              padding: '20px 24px',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              marginBottom: '24px',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '8px' }}>
                <span style={{ marginRight: '6px' }}>🔴</span> Live Animation Guide
              </div>
              <div style={{ fontSize: '15px', fontWeight: '600', lineHeight: '1.5', color: '#334155' }}>
                {getPhaseExplanation()}
              </div>

              {/* Step indicator pills */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap' }}>
                {['origin', 'x', 'y', 'z', 'vector'].map((ph) => {
                  const segsToUse = currentStep.segments;
                  const hasPhase = segsToUse?.some(seg => seg.axisPhase === ph);
                  if (!hasPhase && ph !== 'origin' && ph !== 'vector') return null;
                  
                  const isCurrent = activePhase === ph;
                  return (
                    <span
                      key={ph}
                      style={{
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        borderRadius: '6px',
                        background: isCurrent ? '#2563eb' : '#f1f5f9',
                        color: isCurrent ? 'white' : '#64748b',
                        border: isCurrent ? '1px solid #2563eb' : '1px solid #cbd5e1',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {ph}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {currentStep.interactive && (
            <div
              className="lesson-interactive"
              dangerouslySetInnerHTML={{ __html: currentStep.interactive }}
              style={{ marginBottom: '20px' }}
            />
          )}

          <div className="lesson-nav" style={{ marginTop: 'auto' }}>
            {stepIndex > 0 && (
              <button className="lesson-nav-btn secondary" onClick={handlePrev}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>
            )}

            {!isLast ? (
              <button className="lesson-nav-btn primary" onClick={handleNext}>
                Next Step
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button className="lesson-nav-btn success" onClick={handleComplete}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Mark Complete &amp; Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
