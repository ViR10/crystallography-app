import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import { useProgressStore } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

const QUESTIONS = [
  {
    id: 1,
    title: 'Direction [100] — Along X-Axis',
    uvw: { u: 1, v: 0, w: 0 },
    intercepts: { x: '1', y: '0', z: '0' },
    steps: [
      { question: 'What vector components along (x, y, z) does this direction possess? (Format: x, y, z)', answer: '1, 0, 0', hint: 'The vector begins at (0,0,0) and terminates at (1,0,0).' },
      { question: 'What is the final Miller direction notation? (Format: [uvw])', answer: '[100]', hint: 'Directions are written in square brackets without commas: [100].' }
    ]
  },
  {
    id: 2,
    title: 'Direction [110] — Face Diagonal',
    uvw: { u: 1, v: 1, w: 0 },
    intercepts: { x: '1', y: '1', z: '0' },
    steps: [
      { question: 'What are the fractional head projections? (Format: x, y, z)', answer: '1, 1, 0', hint: 'Head is at x=1, y=1, z=0.' },
      { question: 'What is the final bracket notation for this face diagonal? (Format: [uvw])', answer: '[110]', hint: 'Square brackets: [110].' }
    ]
  },
  {
    id: 3,
    title: 'Direction [111] — Body Diagonal',
    uvw: { u: 1, v: 1, w: 1 },
    intercepts: { x: '1', y: '1', z: '1' },
    steps: [
      { question: 'What are the vector components from origin (0,0,0) to corner (1,1,1)?', answer: '1, 1, 1', hint: 'Δx = 1, Δy = 1, Δz = 1.' },
      { question: 'What is the body diagonal direction notation? (Format: [uvw])', answer: '[111]', hint: 'Square brackets: [111].' }
    ]
  }
];

export const MillerGuidedPractice: React.FC = () => {
  const navigate = useNavigate();
  const { completeGuidedPractice } = useProgressStore();
  const [qIndex, setQIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ correct: boolean; msg: string } | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [rotY, setRotY] = useState(20);
  const [completed, setCompleted] = useState(false);

  const currentQ = QUESTIONS[qIndex];
  const currentStep = currentQ.steps[stepIndex];

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '').replace(/\[|\]/g, '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (normalize(input) === normalize(currentStep.answer)) {
      setFeedback({ correct: true, msg: 'Correct! Step completed.' });
      setTimeout(() => {
        setFeedback(null);
        setInput('');
        setHintVisible(false);

        if (stepIndex < currentQ.steps.length - 1) {
          setStepIndex(stepIndex + 1);
        } else if (qIndex < QUESTIONS.length - 1) {
          setQIndex(qIndex + 1);
          setStepIndex(0);
        } else {
          completeGuidedPractice('directions');
          setCompleted(true);
        }
      }, 1000);
    } else {
      setFeedback({ correct: false, msg: `Not quite! Check the vector coordinate format and try again.` });
    }
  };

  return (
    <div className="guided-practice-page">
      <div className="guided-practice-container">
        <SeoHead
          title={seoData.guidedDirections.title}
          description={seoData.guidedDirections.description}
          canonical={seoData.guidedDirections.canonical}
          keywords={seoData.guidedDirections.keywords}
          jsonLd={seoData.guidedDirections.jsonLd}
        />
        
        {/* Top bar */}
        <div className="guided-topbar">
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            ← Back
          </button>
          <div className="breadcrumb-text">
            Practice → Guided Directions → Problem {qIndex + 1} of {QUESTIONS.length}
          </div>
          <div className="guided-step-badge">
            Step {stepIndex + 1} of {currentQ.steps.length}
          </div>
        </div>

        {/* Responsive 2-column or 1-column layout */}
        <div className="guided-layout">
          {/* Left / Top: Interactive 3D Visualizer */}
          <div className="guided-visual-card">
            <div className="guided-canvas-header">
              <div className="guided-canvas-title">
                <span className="crystal-indicator" />
                {currentQ.title}
              </div>
              <div className="guided-rot-ctrl">
                <label>Rotate:</label>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  value={rotY}
                  onChange={(e) => setRotY(parseInt(e.target.value))}
                />
                <button className="btn btn-xs" onClick={() => setRotY(20)}>↺</button>
              </div>
            </div>

            <div className="guided-canvas-wrap">
              <CrystalCanvas
                module="directions"
                tab={0}
                h={0}
                k={0}
                l={0}
                u={currentQ.uvw.u}
                v={currentQ.uvw.v}
                w={currentQ.uvw.w}
                rotY={rotY}
              />
            </div>

            <div className="guided-canvas-hint">
              <span>💡 Tip:</span> The gold vector arrow points from tail (origin) to head.
            </div>
          </div>

          {/* Right / Bottom: Problem Solving Form */}
          <div className="guided-form-card">
            <div className="guided-stepper-row">
              {currentQ.steps.map((_, i) => (
                <div
                  key={i}
                  className={`guided-stepper-dot ${i < stepIndex ? 'done' : i === stepIndex ? 'active' : 'idle'}`}
                >
                  {i < stepIndex ? '✓' : i + 1}
                </div>
              ))}
            </div>

            <h2 className="guided-step-title">
              Step {stepIndex + 1}: {currentStep.question}
            </h2>

            <form onSubmit={handleSubmit} className="guided-form">
              <div className="guided-input-wrap">
                <input
                  type="text"
                  className="guided-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g. 1, 0, 0 or [100]"
                  autoFocus
                />
              </div>

              {hintVisible && (
                <div className="guided-hint-box">
                  <span className="hint-icon">💡</span>
                  <span>{currentStep.hint}</span>
                </div>
              )}

              {feedback && (
                <div className={`guided-feedback-box ${feedback.correct ? 'correct' : 'wrong'}`}>
                  <span>{feedback.correct ? '✅' : '❌'}</span>
                  <span>{feedback.msg}</span>
                </div>
              )}

              <div className="guided-action-buttons">
                <button type="submit" className="btn btn-primary">
                  Check Step Answer
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setHintVisible(!hintVisible)}
                >
                  {hintVisible ? 'Hide Hint' : 'Need a Hint? 💡'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Completion Celebration Modal */}
        {completed && (
          <div className="modal-backdrop">
            <div className="modal-card">
              <div className="modal-icon">🏆</div>
              <h2 className="modal-title">Directions Guided Practice Complete!</h2>
              <p className="modal-desc">
                Excellent work! You derived coordinates and Miller direction vectors step-by-step. 
                You earned <strong>+20 XP</strong>!
              </p>
              <div className="modal-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate('/practice')}
                >
                  Enter Practice Arena ⚔️
                </button>
                <button
                  className="btn btn-purple"
                  onClick={() => navigate('/practice/planes-guided')}
                >
                  Try Planes Guided Practice 🔷
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
