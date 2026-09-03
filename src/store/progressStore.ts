import { create } from 'zustand';

export interface GameStats {
  totalPoints: number;
  level: number;
  experience: number;
  streak: number;
  lastPracticeDate: string | null;
  achievements: Record<string, string | number | boolean>;
  questionsCompleted: number;
  correctAnswers: number;
  maxStreak: number;
  planeAnswered: number;
  dirAnswered: number;
  blitzCompleted: number;
  bossCompleted: number;
}

export interface TopicProgress {
  correct: number;
  total: number;
  byType: Record<string, { correct: number; total: number; }>;
}

export interface Progress {
  planes: TopicProgress;
  directions: TopicProgress;
  streak: number;
  lastPractice: string | null;
  weaknesses: string[];
  strengths: string[];
  gameStats: GameStats;
}

export interface CompletedLessons {
  directions: number[];
  planes: number[];
  fundamentals: number[];
}

export interface LevelInfo {
  level: number;
  name: string;
  pct: number;
  xpToNext: number;
  nextName: string;
}

export const LEVELS = [
  { name: 'Apprentice', xp: 0 },
  { name: 'Novice', xp: 100 },
  { name: 'Student', xp: 250 },
  { name: 'Scholar', xp: 500 },
  { name: 'Expert', xp: 1000 },
  { name: 'Master', xp: 2000 },
  { name: 'Grandmaster', xp: 4000 },
  { name: 'Crystal Lord', xp: 8000 }
];

export function getLevelInfo(xp: number): LevelInfo {
  let lvl = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xp) lvl = i;
  }
  const cur = LEVELS[lvl];
  const next = LEVELS[Math.min(lvl + 1, LEVELS.length - 1)];
  const pct = lvl >= LEVELS.length - 1 ? 100 : Math.min(100, Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100));
  return {
    level: lvl + 1,
    name: cur.name,
    pct,
    xpToNext: next.xp - xp,
    nextName: next.name
  };
}

export interface AchievementDef {
  id: string;
  icon: string;
  name: string;
  req: string;
  check: (stats: GameStats, planes: TopicProgress, directions: TopicProgress) => boolean;
}

export const ACHIEVEMENTS_DEF: AchievementDef[] = [
  { id: 'first_answer', icon: '⭐', name: 'First Answer', req: 'Answer your first question', check: s => s.questionsCompleted >= 1 },
  { id: 'streak3', icon: '🔥', name: 'On Fire', req: 'Get a 3-answer streak', check: s => s.maxStreak >= 3 },
  { id: 'streak7', icon: '🌋', name: 'Unstoppable', req: 'Get a 7-answer streak', check: s => s.maxStreak >= 7 },
  { id: 'perfect10', icon: '💎', name: 'Perfect Round', req: '10 correct in a row', check: s => s.maxStreak >= 10 },
  { id: 'xp100', icon: '⚡', name: 'XP Seeker', req: 'Earn 100 XP total', check: s => s.totalPoints >= 100 },
  { id: 'xp500', icon: '🌟', name: 'XP Hunter', req: 'Earn 500 XP total', check: s => s.totalPoints >= 500 },
  { id: 'xp2000', icon: '🏆', name: 'XP Legend', req: 'Earn 2000 XP total', check: s => s.totalPoints >= 2000 },
  { id: 'planes50', icon: '🔷', name: 'Crystallographic Plane Pilot', req: 'Answer 50 crystallographic plane questions', check: s => s.planeAnswered >= 50 },
  { id: 'dirs50', icon: '➡️', name: 'Crystallographic Direction Guru', req: 'Answer 50 crystallographic direction questions', check: s => s.dirAnswered >= 50 },
  {
    id: 'accuracy80',
    icon: '🎯',
    name: 'Sharpshooter',
    req: 'Reach 80% overall accuracy',
    check: s => s.questionsCompleted > 10 && (s.correctAnswers / s.questionsCompleted) >= 0.8
  },
  { id: 'speed_demon', icon: '⚡', name: 'Speed Demon', req: 'Complete a Blitz round', check: s => s.blitzCompleted >= 1 },
  { id: 'boss_slayer', icon: '👑', name: 'Boss Slayer', req: 'Complete a Boss Battle', check: s => s.bossCompleted >= 1 },
];

export const OTHER_ACHIEVEMENTS: Record<string, { name: string; desc: string; icon: string; points: number }> = {
  'first_correct': { name: 'First Success', desc: 'Answer your first question correctly', icon: '🎯', points: 10 },
  'streak_5': { name: '5-Day Streak', desc: 'Practice 5 consecutive days', icon: '🔥', points: 50 },
  'perfect_10': { name: 'Perfect 10', desc: 'Get 10 correct answers in a row', icon: '⭐', points: 100 },
  'master_planes': { name: 'Plane Master', desc: 'Achieve 80% accuracy on planes', icon: '🏆', points: 75 },
  'master_directions': { name: 'Direction Master', desc: 'Achieve 80% accuracy on directions', icon: '🧭', points: 75 },
  'crystal_master': { name: 'Crystal Master', desc: 'Master both planes and directions', icon: '💎', points: 200 },
  '50_practice': { name: 'Practice Warrior', desc: 'Complete 50 practice questions', icon: '⚔️', points: 60 },
  '100_practice': { name: 'Practice Champion', desc: 'Complete 100 practice questions', icon: '👑', points: 100 },
  'speed_demon_legacy': { name: 'Speed Demon Legacy', desc: 'Answer 5 questions correctly in under 1 minute', icon: '⚡', points: 80 }
};

interface ProgressState {
  progress: Progress;
  completedLessons: CompletedLessons;
  currentPage: 'home' | 'directions' | 'planes' | 'practice' | 'progress' | 'about';
  toast: { message: string; visible: boolean } | null;
  achievementPopup: { icon: string; name: string; desc: string; visible: boolean } | null;

  // Actions
  showPage: (page: 'home' | 'directions' | 'planes' | 'practice' | 'progress' | 'about') => void;
  addXP: (amount: number) => void;
  completeLesson: (track: 'directions' | 'planes' | 'fundamentals', level: number) => void;
  completeGuidedPractice: (track: 'directions' | 'planes') => void;
  resetProgress: () => void;
  recordAnswer: (kind: 'plane' | 'dir', correct: boolean, category?: string) => void;
  recordCustomStats: (key: 'blitzCompleted' | 'bossCompleted') => void;
  showToast: (msg: string) => void;
  hideToast: () => void;
  hideAchievementPopup: () => void;
}

const initialProgress = (): Progress => {
  const saved = localStorage.getItem('crystallograph_progress');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Backwards compatibility normalization
      const gs = parsed.gameStats || {};
      const ensureByType = (obj: any) => {
        if (!obj) return { correct: 0, total: 0, byType: {} };
        const b = obj.byType || {};
        const safeByType: Record<string, { correct: number, total: number }> = {};
        for (const [k, v] of Object.entries(b)) {
          if (typeof v === 'number') {
            safeByType[k] = { correct: obj.correct || 0, total: obj.total || 1 };
          } else {
            safeByType[k] = v as { correct: number, total: number };
          }
        }
        return {
          correct: obj.correct || 0,
          total: obj.total || 0,
          byType: safeByType
        };
      };
      return {
        planes: ensureByType(parsed.planes),
        directions: ensureByType(parsed.directions),
        streak: parsed.streak || 0,
        lastPractice: parsed.lastPractice || null,
        weaknesses: parsed.weaknesses || [],
        strengths: parsed.strengths || [],
        gameStats: {
          totalPoints: gs.totalPoints || 0,
          level: gs.level || 1,
          experience: gs.experience || 0,
          streak: gs.streak || 0,
          lastPracticeDate: gs.lastPracticeDate || null,
          achievements: gs.achievements || {},
          questionsCompleted: gs.questionsCompleted || 0,
          correctAnswers: gs.correctAnswers || 0,
          maxStreak: gs.maxStreak || 0,
          planeAnswered: gs.planeAnswered || 0,
          dirAnswered: gs.dirAnswered || 0,
          blitzCompleted: gs.blitzCompleted || 0,
          bossCompleted: gs.bossCompleted || 0,
        }
      };
    } catch (e) {
      console.error('Failed to parse progress:', e);
    }
  }
  return {
    planes: { correct: 0, total: 0, byType: {} },
    directions: { correct: 0, total: 0, byType: {} },
    streak: 0,
    lastPractice: null,
    weaknesses: [],
    strengths: [],
    gameStats: {
      totalPoints: 0,
      level: 1,
      experience: 0,
      streak: 0,
      lastPracticeDate: null,
      achievements: {},
      questionsCompleted: 0,
      correctAnswers: 0,
      maxStreak: 0,
      planeAnswered: 0,
      dirAnswered: 0,
      blitzCompleted: 0,
      bossCompleted: 0
    }
  };
};

const initialCompletedLessons = (): CompletedLessons => {
  const saved = localStorage.getItem('hub_progress');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        directions: parsed.directions || [],
        planes: parsed.planes || [],
        fundamentals: parsed.fundamentals || []
      };
    } catch (e) {
      console.error('Failed to parse hub progress:', e);
    }
  }
  return {
    directions: [],
    planes: [],
    fundamentals: []
  };
};

export const useProgressStore = create<ProgressState>((set, get) => ({
  progress: initialProgress(),
  completedLessons: initialCompletedLessons(),
  currentPage: 'home',
  toast: null,
  achievementPopup: null,

  showPage: (page) => set({ currentPage: page }),

  showToast: (message) => set({ toast: { message, visible: true } }),
  hideToast: () => set({ toast: null }),
  hideAchievementPopup: () => set({ achievementPopup: null }),

  addXP: (amount) => {
    const state = get();
    const oldXP = state.progress.gameStats.totalPoints;
    const newXP = oldXP + amount;
    const oldLvl = getLevelInfo(oldXP).level;
    const newLvl = getLevelInfo(newXP).level;
    const updatedGameStats = {
      ...state.progress.gameStats,
      totalPoints: newXP,
      experience: newXP,
      level: newLvl
    };
    const updatedProgress = {
      ...state.progress,
      gameStats: updatedGameStats
    };
    localStorage.setItem('crystallograph_progress', JSON.stringify(updatedProgress));
    set({ progress: updatedProgress });
    if (newLvl > oldLvl) {
      set({
        achievementPopup: {
          icon: '🆙',
          name: 'Level Up!',
          desc: `You reached Level ${newLvl}! Keep going!`,
          visible: true
        }
      });
    }
    checkAchievementsAfterUpdate(set, get);
  },

  completeLesson: (track, level) => {
    const state = get();
    const list = state.completedLessons[track] || [];
    if (!list.includes(level)) {
      const newList = [...list, level];
      const updatedLessons = {
        ...state.completedLessons,
        [track]: newList
      };
      localStorage.setItem('hub_progress', JSON.stringify(updatedLessons));
      set({ completedLessons: updatedLessons });
      get().addXP(25);
      const trackName = track === 'fundamentals' ? 'Fundamentals' : track === 'directions' ? 'Directions' : 'Planes';
      get().showToast(`🎉 ${trackName} Lesson ${level} complete! +25 XP earned!`);
    }
  },

  completeGuidedPractice: (track) => {
    get().addXP(20);
    const trackName = track === 'directions' ? 'Directions' : 'Planes';
    get().showToast(`🎯 ${trackName} Guided Practice completed! +20 XP awarded!`);
  },

  resetProgress: () => {
    const clearedProgress: Progress = {
      planes: { correct: 0, total: 0, byType: {} },
      directions: { correct: 0, total: 0, byType: {} },
      streak: 0,
      lastPractice: null,
      weaknesses: [],
      strengths: [],
      gameStats: {
        totalPoints: 0,
        level: 1,
        experience: 0,
        streak: 0,
        lastPracticeDate: null,
        achievements: {},
        questionsCompleted: 0,
        correctAnswers: 0,
        maxStreak: 0,
        planeAnswered: 0,
        dirAnswered: 0,
        blitzCompleted: 0,
        bossCompleted: 0
      }
    };
    const clearedLessons: CompletedLessons = {
      directions: [],
      planes: [],
      fundamentals: []
    };
    localStorage.setItem('crystallograph_progress', JSON.stringify(clearedProgress));
    localStorage.setItem('hub_progress', JSON.stringify(clearedLessons));
    set({
      progress: clearedProgress,
      completedLessons: clearedLessons,
      toast: { message: 'Progress reset successfully', visible: true }
    });
  },

  recordAnswer: (kind, correct, category = 'General') => {
    const state = get();
    const gs = state.progress.gameStats;
    const mod = kind === 'plane' ? 'planes' : 'directions';
    const correctCount = state.progress[mod].correct + (correct ? 1 : 0);
    const totalCount = state.progress[mod].total + 1;
    const currentByType = state.progress[mod].byType || {};
    const catData = currentByType[category] || { correct: 0, total: 0 };
    const updatedByType = {
      ...currentByType,
      [category]: {
        correct: catData.correct + (correct ? 1 : 0),
        total: catData.total + 1
      }
    };
    const questionsCompleted = gs.questionsCompleted + 1;
    const correctAnswers = gs.correctAnswers + (correct ? 1 : 0);
    const currentStreak = correct ? gs.streak + 1 : 0;
    const maxStreak = Math.max(gs.maxStreak, currentStreak);
    const today = new Date().toDateString();
    let updatedStreak = gs.streak;
    let lastPracticeDate = gs.lastPracticeDate;
    if (correct && lastPracticeDate !== today) {
      if (lastPracticeDate !== null) {
        const lastDate = new Date(lastPracticeDate);
        const diff = (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diff <= 2) updatedStreak += 1;
        else updatedStreak = 1;
      } else {
        updatedStreak = 1;
      }
      lastPracticeDate = today;
    }
    const updatedGameStats: GameStats = {
      ...gs,
      questionsCompleted,
      correctAnswers,
      maxStreak,
      streak: updatedStreak,
      lastPracticeDate,
      planeAnswered: gs.planeAnswered + (kind === 'plane' ? 1 : 0),
      dirAnswered: gs.dirAnswered + (kind === 'dir' ? 1 : 0)
    };
    const updatedProgress = {
      ...state.progress,
      [mod]: {
        ...state.progress[mod],
        correct: correctCount,
        total: totalCount,
        byType: updatedByType
      },
      gameStats: updatedGameStats
    };
    localStorage.setItem('crystallograph_progress', JSON.stringify(updatedProgress));
    set({ progress: updatedProgress });
    checkAchievementsAfterUpdate(set, get);
  },

  recordCustomStats: (key) => {
    const state = get();
    const gs = state.progress.gameStats;
    const updatedGameStats = {
      ...gs,
      [key]: (gs[key] || 0) + 1
    };
    const updatedProgress = {
      ...state.progress,
      gameStats: updatedGameStats
    };
    localStorage.setItem('crystallograph_progress', JSON.stringify(updatedProgress));
    set({ progress: updatedProgress });
    checkAchievementsAfterUpdate(set, get);
  }
}));

function checkAchievementsAfterUpdate(set: any, get: () => ProgressState) {
  const state = get();
  const gs = state.progress.gameStats;
  const planes = state.progress.planes;
  const dirs = state.progress.directions;
  const earned = { ...gs.achievements };
  let achievementsChanged = false;

  const planesAcc = planes.total > 0 ? (planes.correct / planes.total) * 100 : 0;
  const dirsAcc = dirs.total > 0 ? (dirs.correct / dirs.total) * 100 : 0;
  const totalCorrect = planes.correct + dirs.correct;
  const totalQuestions = planes.total + dirs.total;

  const checksLegacy = [
    { id: 'first_correct', condition: totalCorrect === 1 },
    { id: '50_practice', condition: totalQuestions >= 50 },
    { id: '100_practice', condition: totalQuestions >= 100 },
    { id: 'master_planes', condition: planesAcc >= 80 && planes.total >= 10 },
    { id: 'master_directions', condition: dirsAcc >= 80 && dirs.total >= 10 },
    { id: 'crystal_master', condition: planesAcc >= 80 && dirsAcc >= 80 && planes.total >= 10 && dirs.total >= 10 },
    { id: 'streak_5', condition: gs.streak >= 5 }
  ];

  checksLegacy.forEach(c => {
    if (!earned[c.id] && c.condition) {
      const def = OTHER_ACHIEVEMENTS[c.id];
      if (def) {
        earned[c.id] = new Date().toISOString();
        achievementsChanged = true;
        
        // Award points & show popup
        setTimeout(() => {
          get().addXP(def.points);
          set({
            achievementPopup: {
              icon: def.icon,
              name: `Achievement Unlocked: ${def.name}`,
              desc: def.desc,
              visible: true
            }
          });
        }, 100);
      }
    }
  });

  // 2. Check main achievements def list
  ACHIEVEMENTS_DEF.forEach(a => {
    if (!earned[a.id] && a.check(gs, planes, dirs)) {
      earned[a.id] = new Date().toISOString();
      achievementsChanged = true;

      set({
        achievementPopup: {
          icon: a.icon,
          name: 'Achievement Unlocked!',
          desc: a.name,
          visible: true
        }
      });
    }
  });

  if (achievementsChanged) {
    const updatedProgress = {
      ...state.progress,
      gameStats: {
        ...gs,
        achievements: earned
      }
    };
    localStorage.setItem('crystallograph_progress', JSON.stringify(updatedProgress));
    set({ progress: updatedProgress });
  }
}
