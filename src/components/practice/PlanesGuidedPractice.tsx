import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import { useProgressStore } from '../../store/progressStore';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

const QUESTIONS = [
  {
    id: 1,
    hkl: { h: 1, k: 0, l: 0 },
    title: 'Plane (100) — Front Cube Face',
    steps: [
      { question: 'What are the Miller indices for this plane? (Format: h, k, l)', answer: '1, 0, 0', hint: 'The plane intersects x at 1 and is parallel to y and z.' },
      { question: 'What are the reciprocals of intercepts? (Format: 1/p, 1/q, 1/r)', answer: '1, 0, 0', hint: 'Reciprocals are 1/1, 1/∞, 1/∞ -> 1, 0, 0.' },
      { question: 'What are the intercepts on x, y, z? (Use "inf" or "∞" for infinity)', answer: '1, inf, inf', hint: 'The plane crosses the x-axis at 1, and never crosses y or z.' }
    ]
  },
  {
    id: 2,
    hkl: { h: 1, k: 1, l: 0 },
    title: 'Plane (110) — Diagonal Cut',
    steps: [
      { question: 'What are the intercepts on x, y, z? (Format: x, y, z)', answer: '1, 1, inf', hint: 'It intersects both x and y axes at 1, and is parallel to the vertical z axis.' },
      { question: 'What are the reciprocals of these intercepts? (Format: 1/x, 1/y, 1/z)', answer: '1, 1, 0', hint: '1/1 = 1, 1/1 = 1, 1/∞ = 0.' },
      { question: 'What is the final Miller plane notation? (Format: h, k, l)', answer: '1, 1, 0', hint: 'Miller indices are enclosed in parentheses: (110).' }
    ]
  },
  {
    id: 3,
    hkl: { h: 1, k: 1, l: 1 },
    title: 'Plane (111) — Octahedral Plane',
    steps: [
      { question: 'What are the intercepts on x, y, z?', answer: '1, 1, 1', hint: 'The plane cuts through all three axes at unit length 1.' },
      { question: 'What are the reciprocals? (Format: h, k, l)', answer: '1, 1, 1', hint: '1/1 = 1, 1/1 = 1, 1/1 = 1.' },
      { question: 'What are the Miller indices for this plane? (Format: h, k, l)', answer: '1, 1, 1', hint: 'Miller indices for this octahedral plane are (111).' }
    ]
  }
];

export const PlanesGuidedPractice: React.FC = () => {
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

  const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, '').replace(/infinity/g, 'inf').replace(/∞/g, 'inf');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (normalize(input) === normalize(currentStep.answer)) {
      setFeedback({ correct: true, msg: 'Correct! Excellent step progress.' });
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
          completeGuidedPractice('planes');
          setCompleted(true);
        }
      }, 1000);
    } else {
      setFeedback({ correct: false, msg: `Not quite! Check the reciprocals or format and try again.` });
    }
  };

  return (
    <div className="guided-practice-page">
      <div className="guided-practice-container">
        <SeoHead
          title={seoData.guidedPlanes.title}
          description={seoData.guidedPlanes.description}
          canonical={seoData.guidedPlanes.canonical}
          keywords={seoData.guidedPlanes.keywords}
          jsonLd={seoData.guidedPlanes.jsonLd}
        />
        
        {/* Top bar */}
        <div className="guided-topbar">
          <button onClick={() => navigate(-1)} className="btn btn-secondary btn-sm">
            ← Back
          </button>
          <div className="breadcrumb-text">
            Practice → Guided Planes → Problem {qIndex + 1} of {QUESTIONS.length}
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
                module="planes"
                tab={0}
                h={currentQ.hkl.h}
                k={currentQ.hkl.k}
                l={currentQ.hkl.l}
                u={0}
                v={0}
                w={0}
                rotY={rotY}
              />
            </div>

            <div className="guided-canvas-hint">
              <span>💡 Tip:</span> Use the rotation slider to inspect how the plane cuts through each axis.
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
                  placeholder="e.g. 1, 0, 0 or 1, inf, inf"
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
              <h2 className="modal-title">Planes Guided Practice Complete!</h2>
              <p className="modal-desc">
                Great job! You calculated intercepts, reciprocals, and Miller plane indices step-by-step. 
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
                  className="btn btn-outline"
                  onClick={() => navigate('/practice/guided')}
                >
                  Try Directions Guided Practice 🧭
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
