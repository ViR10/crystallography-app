import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgressStore, getLevelInfo } from '../../store/progressStore';
import { CrystalCanvas } from '../3d/CrystalCanvas';
import {
  GAME_MODES,
  getPracticeData,
  getHintText,
  GameModeDef,
  Question
} from './PracticeDefinitions';
import { toFracStr, formatHKL, formatUVW } from '../../utils/mathUtils';
import { SeoHead } from '../seo/SeoHead';
import { seoData } from '../seo/seoConfig';

export const PracticeArena: React.FC = () => {
  const navigate = useNavigate();
  const { progress, recordAnswer, recordCustomStats, addXP } = useProgressStore();
  const gs = progress.gameStats;
  const levelInfo = getLevelInfo(gs.totalPoints);

  const [activeScreen, setActiveScreen] = useState<'lobby' | 'session' | 'score'>('lobby');
  const [activeMode, setActiveMode] = useState<GameModeDef | null>(null);

  // Active session variables
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [sessionXP, setSessionXP] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [bossLives, setBossLives] = useState(3);

  // Question specific
  const [answered, setAnswered] = useState(false);
  const [selectedMC, setSelectedMC] = useState<number | null>(null);
  const [typedAns, setTypedAns] = useState({ h: '', k: '', l: '', u: '', v: '', w: '' });
  const [mcOptions, setMcOptions] = useState<{ options: number[][]; correctIdx: number; fmt: (arr: number[]) => string }>({
    options: [],
    correctIdx: -1,
    fmt: () => ''
  });

  // UI overlays
  const [feedback, setFeedback] = useState<{ visible: boolean; correct: boolean; msg: string } | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  const [comboBurst, setComboBurst] = useState<string | null>(null);

  // Timer reference
  const [timerSec, setTimerSec] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load start mode from redirect
  useEffect(() => {
    const startMode = sessionStorage.getItem('practice_start_mode');
    if (startMode) {
      sessionStorage.removeItem('practice_start_mode');
      const mode = GAME_MODES.find(m => m.key === startMode);
      if (mode) {
        startNewGame(mode);
      }
    }
  }, []);

  // Timer loop
  useEffect(() => {
    if (timerSec !== null && timerSec > 0 && !answered) {
      timerRef.current = setTimeout(() => {
        setTimerSec(timerSec - 1);
      }, 1000);
    } else if (timerSec === 0 && !answered) {
      autoFailQuestion();
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timerSec, answered]);

  const generateMCOptions = (q: Question) => {
    const { planeExamples, dirExamples } = getPracticeData();
    let correct: number[];
    let fmt: (arr: number[]) => string;

    if (q.kind === 'plane') {
      correct = [q.h!, q.k!, q.l!];
      fmt = (arr) => '(' + arr.map(v => v < 0 ? '<u>' + Math.abs(v) + '</u>' : String(v)).join('') + ')';
    } else {
      correct = [q.u!, q.v!, q.w!];
      fmt = (arr) => '[' + arr.map(v => v < 0 ? '<u>' + Math.abs(v) + '</u>' : String(v)).join(' ') + ']';
    }

    const opts: number[][] = [correct.slice()];
    let tries = 0;
    while (opts.length < 4 && tries < 200) {
      tries++;
      let alt: number[];
      if (q.kind === 'plane') {
        const r = planeExamples[Math.floor(Math.random() * planeExamples.length)];
        alt = [r.h, r.k, r.l];
      } else {
        const r2 = dirExamples[Math.floor(Math.random() * dirExamples.length)];
        alt = [r2.u, r2.v, r2.w];
      }

      const exists = opts.some(o => o[0] === alt[0] && o[1] === alt[1] && o[2] === alt[2]);
      if (!exists) opts.push(alt);
    }

    // Shuffle options
    for (let i = opts.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [opts[i], opts[j]] = [opts[j], opts[i]];
    }

    const correctIdx = opts.findIndex(o => o[0] === correct[0] && o[1] === correct[1] && o[2] === correct[2]);
    setMcOptions({ options: opts, correctIdx, fmt });
  };

  const startNewGame = (mode: GameModeDef) => {
    const { planeExamples, dirExamples } = getPracticeData();
    const pool: Question[] = [];

    const isPos = (a: number, b: number, c: number) => a >= 0 && b >= 0 && c >= 0;
    const isNeg = (a: number, b: number, c: number) => a < 0 || b < 0 || c < 0;

    if (mode.type === 'planes' || mode.type === 'mixed') {
      planeExamples.forEach(p => {
        if (mode.difficulty === 'pos' && !isPos(p.h, p.k, p.l)) return;
        if (mode.difficulty === 'neg' && !isNeg(p.h, p.k, p.l)) return;
        pool.push({ kind: 'plane', category: p.category, h: p.h, k: p.k, l: p.l, qType: mode.qType });
      });
    }
    if (mode.type === 'directions' || mode.type === 'mixed') {
      dirExamples.forEach(d => {
        if (mode.difficulty === 'pos' && !isPos(d.u, d.v, d.w)) return;
        if (mode.difficulty === 'neg' && !isNeg(d.u, d.v, d.w)) return;
        pool.push({ kind: 'dir', category: d.category, u: d.u, v: d.v, w: d.w, tail: d.tail, head: d.head, qType: mode.qType });
      });
    }

    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    const gameQs = pool.slice(0, mode.qCount);

    setActiveMode(mode);
    setQuestions(gameQs);
    setQIdx(0);
    setSessionXP(0);
    setBestStreak(0);
    setCurrentStreak(0);
    setComboMultiplier(1);
    setCorrectCount(0);
    setTotalCount(0);
    setBossLives(3);

    setAnswered(false);
    setSelectedMC(null);
    setTypedAns({ h: '', k: '', l: '', u: '', v: '', w: '' });
    setFeedback(null);
    setHintVisible(false);

    // Initial question MC options
    if (mode.qType === 'mc') {
      generateMCOptions(gameQs[0]);
    }

    if (mode.timedSec > 0) {
      setTimerSec(mode.timedSec);
    } else {
      setTimerSec(null);
    }

    setActiveScreen('session');
  };

  const nextQuestion = () => {
    const nextIdx = qIdx + 1;
    if (nextIdx >= questions.length) {
      // Completed round!
      if (activeMode?.key === 'boss' && bossLives > 0) {
        recordCustomStats('bossCompleted');
      } else if (activeMode?.key === 'blitz') {
        recordCustomStats('blitzCompleted');
      }
      setActiveScreen('score');
      return;
    }

    setQIdx(nextIdx);
    setAnswered(false);
    setSelectedMC(null);
    setTypedAns({ h: '', k: '', l: '', u: '', v: '', w: '' });
    setFeedback(null);
    setHintVisible(false);

    const nextQ = questions[nextIdx];
    if (activeMode?.qType === 'mc') {
      generateMCOptions(nextQ);
    }

    if (activeMode?.timedSec && activeMode.timedSec > 0) {
      setTimerSec(activeMode.timedSec);
    } else {
      setTimerSec(null);
    }
  };

  const skipQuestion = () => {
    if (answered) return;
    setAnswered(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    processAnswerResult(false);
  };

  const autoFailQuestion = () => {
    setAnswered(true);
    processAnswerResult(false, 'Time\'s up!');
  };

  const handleMCOptionClick = (idx: number) => {
    if (answered) return;
    setSelectedMC(idx);
  };

  const checkAnswer = () => {
    if (answered) return;
    const q = questions[qIdx];

    if (q.qType === 'mc' || q.qType === 'reverse_mc') {
      if (selectedMC === null) {
        setFeedback({ visible: true, correct: false, msg: 'Please select an option!' });
        return;
      }
      setAnswered(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      const correct = selectedMC === mcOptions.correctIdx;
      processAnswerResult(correct);
    } else {
      // Direct typing
      const checkVal = (val: string) => parseInt(val.trim()) || 0;
      let correct = false;
      if (q.kind === 'plane') {
        const h = checkVal(typedAns.h);
        const k = checkVal(typedAns.k);
        const l = checkVal(typedAns.l);
        correct = h === q.h && k === q.k && l === q.l;
      } else {
        const u = checkVal(typedAns.u);
        const v = checkVal(typedAns.v);
        const w = checkVal(typedAns.w);
        correct = u === q.u && v === q.v && w === q.w;
      }

      setAnswered(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      processAnswerResult(correct);
    }
  };

  const processAnswerResult = (correct: boolean, customMsg?: string) => {
    const q = questions[qIdx];
    setTotalCount(prev => prev + 1);

    if (correct) {
      const newStreak = currentStreak + 1;
      setCorrectCount(prev => prev + 1);
      setCurrentStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      let newCombo = comboMultiplier;
      if (newStreak >= 3) {
        newCombo = Math.min(5, Math.floor(newStreak / 3) + 1);
        setComboMultiplier(newCombo);
        triggerComboBurst(newCombo);
      }

      const xpAward = Math.round(10 * newCombo * activeMode!.xpMult);
      addXP(xpAward);
      setSessionXP(prev => prev + xpAward);

      const hklOrUvw = q.kind === 'plane'
        ? formatHKL(q.h!, q.k!, q.l!)
        : formatUVW(q.u!, q.v!, q.w!);

      setFeedback({
        visible: true,
        correct: true,
        msg: `${customMsg || 'Correct!'} ${q.kind === 'plane' ? 'The plane is ' : 'The direction is '} ${hklOrUvw} <br/> <span class="xp-gain">+${xpAward} XP ${newCombo > 1 ? ` 🔥 ${newCombo}x combo!` : ''}</span>`
      });

      // Update global progress totals
      recordAnswer(q.kind, true, q.category);
    } else {
      // Wrong answer
      setCurrentStreak(0);
      setComboMultiplier(1);

      let livesLeft = bossLives;
      if (activeMode?.key === 'boss') {
        livesLeft = bossLives - 1;
        setBossLives(livesLeft);
      }

      const correctAnsStr = q.kind === 'plane'
        ? `(${q.h} ${q.k} ${q.l})`
        : `[${q.u} ${q.v} ${q.w}]`;

      if (activeMode?.key === 'boss' && livesLeft <= 0) {
        setFeedback({
          visible: true,
          correct: false,
          msg: `💀 Game Over! You ran out of lives on the Boss Battle! The correct answer was <strong>${correctAnsStr}</strong>`
        });
        setTimeout(() => {
          setActiveScreen('score');
        }, 2000);
      } else {
        setFeedback({
          visible: true,
          correct: false,
          msg: `${customMsg || 'Not quite!'} The correct answer was <strong>${correctAnsStr}</strong>`
        });
      }

      recordAnswer(q.kind, false, q.category);
    }
  };

  const triggerComboBurst = (combo: number) => {
    setComboBurst(`🔥 ${combo}x COMBO!`);
    setTimeout(() => {
      setComboBurst(null);
    }, 1200);
  };

  const showHint = () => {
    setHintVisible(true);
  };

  const exitSession = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActiveMode(null);
    setActiveScreen('lobby');
  };

  const playAgain = () => {
    if (activeMode) startNewGame(activeMode);
  };

  // Rendering screens
  if (activeScreen === 'session' && activeMode) {
    const q = questions[qIdx];
    const isPlane = q.kind === 'plane';

    return (
      <div id="page-practice">
        <SeoHead
          title="Crystallography Practice Session | Practice Arena"
          description="Interactive crystallography practice problem session."
          canonical={seoData.practice.canonical}
          robots="noindex, nofollow"
        />
        {/* Session HUD */}
        <div className="game-hud">
          <span className="hud-badge primary">{activeMode.icon} {activeMode.name}</span>
          <div className="hud-sep"></div>
          <span className="hud-badge xp">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: '-2px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>{' '}
            {gs.totalPoints} XP
          </span>
          <span className="hud-badge streak">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px' }}>
              <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" />
            </svg>{' '}
            {currentStreak}
          </span>
          {comboMultiplier > 1 && (
            <span className="hud-badge combo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px' }}>
                <path d="M12 3l1.912 5.813L20 10l-6.088 1.187L12 17l-1.912-5.813L4 10l6.088-1.187z" />
              </svg>{' '}
              {comboMultiplier}x
            </span>
          )}

          {activeMode.key === 'boss' && (
            <span className="hud-badge timer" style={{ background: '#ef4444', color: 'white' }}>
              ❤️ {bossLives} Lives
            </span>
          )}

          {timerSec !== null && (
            <span className={`hud-badge timer ${timerSec <= 5 ? 'urgent' : ''}`}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px' }}>
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9v4l2 2" />
                <path d="M9 2h6" />
              </svg>{' '}
              {timerSec}s
            </span>
          )}

          <div className="hud-sep"></div>
          <div className="hud-progress-wrap">
            <div className="hud-progress-track">
              <div className="hud-progress-fill" style={{ width: `${(qIdx / questions.length) * 100}%` }}></div>
            </div>
          </div>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
            {qIdx + 1}/{questions.length}
          </span>
          <button className="btn btn-secondary hud-exit" onClick={exitSession} style={{ padding: '8px 16px', fontSize: '13px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: '-2px' }}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>{' '}
            Exit
          </button>
        </div>

        {/* Combo Burst overlays */}
        {comboBurst && <div className="combo-burst show">{comboBurst}</div>}

        <div className="game-layout">
          {/* Question View card */}
          <div className="question-card">
            <div className="question-card-header">
              <span className="question-type-badge">
                {isPlane ? 'Identify Crystallographic Plane (hkl)' : 'Identify Crystallographic Direction [uvw]'}
              </span>
              <span className="question-num">Question {qIdx + 1} of {questions.length}</span>
            </div>
            <div className="question-card-canvas">
              {q.qType === 'reverse_mc' ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '20px' }}>
                  <div style={{ fontSize: '24px', color: 'var(--text-color)' }}>
                    Identify the correct visualization for:
                  </div>
                  <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'var(--primary-color)' }}
                       dangerouslySetInnerHTML={{ __html: isPlane ? formatHKL(q.h!, q.k!, q.l!) : formatUVW(q.u!, q.v!, q.w!) }} />
                </div>
              ) : (
                <CrystalCanvas
                  module={isPlane ? 'planes' : 'directions'}
                  tab={0}
                  h={isPlane ? q.h! : 0}
                  k={isPlane ? q.k! : 0}
                  l={isPlane ? q.l! : 0}
                  u={!isPlane ? q.u! : 0}
                  v={!isPlane ? q.v! : 0}
                  w={!isPlane ? q.w! : 0}
                  originX={!isPlane && q.tail ? q.tail.x : null}
                  originY={!isPlane && q.tail ? q.tail.y : null}
                  originZ={!isPlane && q.tail ? q.tail.z : null}
                  rotY={0}
                />
              )}
            </div>
          </div>

          {/* Answer grading side */}
          <div className="answer-panel">
            <div className="answer-panel-header">
              <div className="answer-panel-title">
                {isPlane ? 'What are the Miller indices?' : 'What are the direction indices?'}
              </div>
            </div>

            <div className="answer-panel-body">
              <div id="practice-inputs">
                {q.qType === 'mc' || q.qType === 'reverse_mc' ? (
                  <div className={`mc-options ${q.qType === 'reverse_mc' ? 'reverse-grid' : ''}`} style={q.qType === 'reverse_mc' ? { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } : {}}>
                    {mcOptions.options.map((opt, i) => {
                      const isCorrect = i === mcOptions.correctIdx;
                      const isSelected = i === selectedMC;
                      const optionClass = isSelected
                        ? (answered ? (isCorrect ? 'correct selected' : 'wrong selected') : 'selected')
                        : (answered && isCorrect ? 'correct' : '');
                      
                      if (q.qType === 'reverse_mc') {
                        return (
                          <div
                            key={i}
                            className={`mc-option reverse-mc-option ${optionClass}`}
                            onClick={() => handleMCOptionClick(i)}
                            style={{ height: '180px', padding: '5px', position: 'relative', display: 'flex', flexDirection: 'column', border: '2px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', overflow: 'hidden' }}
                          >
                            <span className="mc-option-letter" style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>{String.fromCharCode(65 + i)}</span>
                            <div style={{ flex: 1, position: 'relative', pointerEvents: 'none' }}>
                              <CrystalCanvas
                                module={isPlane ? 'planes' : 'directions'}
                                tab={0}
                                h={isPlane ? opt[0] : 0}
                                k={isPlane ? opt[1] : 0}
                                l={isPlane ? opt[2] : 0}
                                u={!isPlane ? opt[0] : 0}
                                v={!isPlane ? opt[1] : 0}
                                w={!isPlane ? opt[2] : 0}
                                rotY={0}
                              />
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={i}
                          className={`mc-option ${optionClass}`}
                          onClick={() => handleMCOptionClick(i)}
                          dangerouslySetInnerHTML={{
                            __html: `<span class="mc-option-letter">${String.fromCharCode(65 + i)}</span> <span>${mcOptions.fmt(opt)}</span>`
                          }}
                        />
                      );
                    })}
                  </div>
                ) : (
                  // direct input fields
                  <div className="answer-input-row">
                    {isPlane ? (
                      <>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.h) === q.h ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.h}
                            onChange={e => setTypedAns({ ...typedAns, h: e.target.value })}
                            disabled={answered}
                            placeholder="h"
                          />
                          <div className="answer-index-label">h</div>
                        </div>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.k) === q.k ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.k}
                            onChange={e => setTypedAns({ ...typedAns, k: e.target.value })}
                            disabled={answered}
                            placeholder="k"
                          />
                          <div className="answer-index-label">k</div>
                        </div>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.l) === q.l ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.l}
                            onChange={e => setTypedAns({ ...typedAns, l: e.target.value })}
                            disabled={answered}
                            placeholder="l"
                          />
                          <div className="answer-index-label">l</div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.u) === q.u ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.u}
                            onChange={e => setTypedAns({ ...typedAns, u: e.target.value })}
                            disabled={answered}
                            placeholder="u"
                          />
                          <div className="answer-index-label">u</div>
                        </div>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.v) === q.v ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.v}
                            onChange={e => setTypedAns({ ...typedAns, v: e.target.value })}
                            disabled={answered}
                            placeholder="v"
                          />
                          <div className="answer-index-label">v</div>
                        </div>
                        <div>
                          <input
                            className={`answer-index-input ${answered ? (parseInt(typedAns.w) === q.w ? 'correct' : 'wrong') : ''}`}
                            type="number"
                            value={typedAns.w}
                            onChange={e => setTypedAns({ ...typedAns, w: e.target.value })}
                            disabled={answered}
                            placeholder="w"
                          />
                          <div className="answer-index-label">w</div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {!answered ? (
                <div className="game-actions">
                  <button className="btn btn-success" onClick={checkAnswer}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>{' '}
                    Submit
                  </button>
                  <button className="btn btn-secondary" onClick={showHint}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                      <path d="M12 2a7 7 0 00-4 12.7V17h8v-2.3A7 7 0 0012 2z" />
                    </svg>{' '}
                    Hint
                  </button>
                  <button className="btn btn-secondary" onClick={skipQuestion}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                      <polygon points="5 4 15 12 5 20 5 4" />
                      <line x1="19" y1="5" x2="19" y2="19" />
                    </svg>{' '}
                    Skip
                  </button>
                </div>
              ) : null}

              {hintVisible && (
                <div className="hint-text shown">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>{getHintText(q)}</span>
                </div>
              )}

              {feedback && (
                <div className={`game-feedback visible ${feedback.correct ? 'correct' : 'wrong'}`}>
                  <span className="game-feedback-icon">{feedback.correct ? '✅' : '❌'}</span>
                  <div className="game-feedback-text">
                    <strong>{feedback.correct ? 'Excellent!' : 'Not quite!'}</strong>
                    <span dangerouslySetInnerHTML={{ __html: feedback.msg }} />
                  </div>
                </div>
              )}

              {answered && (
                <div style={{ marginTop: '14px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button className="btn btn-secondary" onClick={nextQuestion} style={{ padding: '10px 20px' }}>
                    Next →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeScreen === 'score') {
    const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    const emoji = accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : accuracy >= 50 ? '😊' : '💪';
    const accolade = accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great job!' : accuracy >= 50 ? 'Good effort!' : 'Keep practicing!';

    // Special logic for Final Exam
    const isFinalExam = activeMode?.key === 'final_exam';
    const passedFinal = isFinalExam && accuracy >= 80;

    return (
      <div id="page-practice" className="hidden-lobby">
        <SeoHead
          title="Quiz Results | Practice Arena"
          description="Crystallography quiz results and accuracy."
          canonical={seoData.practice.canonical}
          robots="noindex, nofollow"
        />
        <div className="score-screen visible" style={{ display: 'block' }}>
          <div className="score-emoji" style={{ fontSize: '48px', marginBottom: '16px' }}>{passedFinal ? '🎓' : emoji}</div>
          <div className="score-title">{passedFinal ? 'Exam Passed!' : accolade}</div>
          <div className="score-subtitle">
            Accuracy: {accuracy}% — Completed {totalCount} questions
            {isFinalExam && !passedFinal && <div style={{ color: '#ef4444', marginTop: '8px' }}>You need 80% to pass the final exam.</div>}
          </div>
          <div className="score-stats-row">
            <div className="score-stat-box">
              <div className="score-stat-val">{correctCount}</div>
              <div className="score-stat-lbl">Correct</div>
            </div>
            <div className="score-stat-box">
              <div className="score-stat-val">{accuracy}%</div>
              <div className="score-stat-lbl">Accuracy</div>
            </div>
            <div className="score-stat-box">
              <div className="score-stat-val">+{sessionXP}</div>
              <div className="score-stat-lbl">XP Earned</div>
            </div>
            <div className="score-stat-box">
              <div className="score-stat-val">{bestStreak}</div>
              <div className="score-stat-lbl">Best Streak</div>
            </div>
          </div>
          <div className="score-actions">
            {passedFinal ? (
              <button className="btn" onClick={() => navigate('/mastery')} style={{ background: '#a855f7' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                  <path d="M12 2l10 6.5-10 6.5-10-6.5L12 2z" />
                  <path d="M12 22l10-6.5-10 6.5-10-6.5" />
                </svg>{' '}
                Claim Mastery Certificate
              </button>
            ) : (
              <>
                <button className="btn" onClick={playAgain}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" />
                  </svg>{' '}
                  Play Again
                </button>
                <button className="btn btn-secondary" onClick={() => setActiveScreen('lobby')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>{' '}
                  Lobby
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Lobby view
  return (
    <div id="page-practice">
      <SeoHead
        title={seoData.practice.title}
        description={seoData.practice.description}
        canonical={seoData.practice.canonical}
        keywords={seoData.practice.keywords}
        jsonLd={seoData.practice.jsonLd}
      />
      <div id="game-lobby" className="game-lobby">
        <div className="lobby-hero">
          <div className="lobby-hero-content">
            <div className="lobby-title">
              <span className="lobby-title-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10 2v7.527a2 2 0 01-.211.896L4.72 20.55a1 1 0 00.9 1.45h12.76a1 1 0 00.9-1.45l-5.069-10.127A2 2 0 0114 9.527V2" />
                  <path d="M8.5 2h7" />
                  <path d="M7 16.5h10" />
                </svg>
              </span>
              Crystal Academy
            </div>
            <p className="lobby-subtitle">
              Master crystallographic planes &amp; directions through epic game modes. Earn XP, unlock achievements, and level up!
            </p>
            <div className="lobby-xp-bar">
              <span className="lobby-level-badge">LVL {levelInfo.level} {levelInfo.name}</span>
              <div className="lobby-xp-track">
                <div className="lobby-xp-fill" style={{ width: `${levelInfo.pct}%` }}></div>
              </div>
              <span className="lobby-xp-text">{gs.totalPoints} / {levelInfo.level * 500} XP</span>
              <span className="lobby-streak">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: '-2px', marginRight: '4px' }}>
                  <path d="M12 12c2-2.96 0-7-1-8 0 3.038-1.773 4.741-3 6-1.226 1.26-2 3.24-2 5a6 6 0 1012 0c0-1.532-1.056-3.94-2-5-1.786 3-2.791 3-4 2z" />
                </svg>{' '}
                {gs.streak} streak
              </span>
            </div>
          </div>
        </div>

        <div className="game-modes-grid">
          {GAME_MODES.map((m) => {
            const hasCompleted = gs.achievements[`completed_${m.key}`];
            return (
              <div className="game-mode-card" key={m.key} onClick={() => startNewGame(m)} role="button" tabIndex={0} aria-label={m.name}>
                <div className={`game-mode-card-banner ${m.banner}`}></div>
                <div className="game-mode-card-inner">
                  {hasCompleted && <div className="game-mode-best">✓ Completed</div>}
                  <div className="game-mode-icon">{m.icon}</div>
                  <div className="game-mode-name">{m.name}</div>
                  <div className="game-mode-desc">{m.desc}</div>
                  <div className="game-mode-meta">
                    <span className={`game-mode-pill ${m.tag}`}>{m.tagLabel}</span>
                    <span className="game-mode-pill">{m.qCount} questions</span>
                    <span className="game-mode-pill">{m.xpMult}x XP</span>
                    {m.timedSec > 0 && <span className="game-mode-pill hard">⏱ {m.timedSec}s each</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
