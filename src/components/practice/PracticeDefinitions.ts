import { toFracStr } from '../../utils/mathUtils';

export interface GameModeDef {
  key: string;
  name: string;
  icon: string;
  banner: string;
  desc: string;
  qCount: number;
  type: 'planes' | 'directions' | 'mixed';
  qType: 'mc' | 'type' | 'reverse_mc';
  timedSec: number;
  tag: 'easy' | 'medium' | 'hard' | 'expert';
  xpMult: number;
  tagLabel: string;
  difficulty: 'pos' | 'neg' | 'mixed';
}

export const GAME_MODES: GameModeDef[] = [
  {
    key: 'planes_mc_pos', name: 'Planes: Visual to Indices (Basic)', icon: '??', banner: '',
    desc: 'Identify simple positive crystallographic planes from 3D visualizations.',
    qCount: 10, type: 'planes', qType: 'mc', timedSec: 0, tag: 'easy', xpMult: 1, tagLabel: 'Level 1', difficulty: 'pos'
  },
  {
    key: 'dirs_mc_pos', name: 'Directions: Visual to Indices (Basic)', icon: '??', banner: '',
    desc: 'Identify simple positive crystallographic directions from 3D arrows.',
    qCount: 10, type: 'directions', qType: 'mc', timedSec: 0, tag: 'easy', xpMult: 1, tagLabel: 'Level 2', difficulty: 'pos'
  },
  {
    key: 'planes_mc_neg', name: 'Planes: Visual to Indices (Advanced)', icon: '??', banner: 'blue',
    desc: 'Identify planes with negative indices (bar notation) and origin shifts.',
    qCount: 10, type: 'planes', qType: 'mc', timedSec: 0, tag: 'medium', xpMult: 1.5, tagLabel: 'Level 3', difficulty: 'mixed'
  },
  {
    key: 'dirs_mc_neg', name: 'Directions: Visual to Indices (Advanced)', icon: '??', banner: 'blue',
    desc: 'Identify directions with negative components and origin shifts.',
    qCount: 10, type: 'directions', qType: 'mc', timedSec: 0, tag: 'medium', xpMult: 1.5, tagLabel: 'Level 4', difficulty: 'mixed'
  },
  {
    key: 'planes_rev_mc', name: 'Planes: Indices to Visual', icon: '??', banner: 'green',
    desc: 'Read the Miller indices and select the correct 3D plane visualization.',
    qCount: 10, type: 'planes', qType: 'reverse_mc', timedSec: 0, tag: 'medium', xpMult: 2, tagLabel: 'Level 5', difficulty: 'mixed'
  },
  {
    key: 'dirs_rev_mc', name: 'Directions: Indices to Visual', icon: '??', banner: 'green',
    desc: 'Read the direction indices and select the correct 3D arrow visualization.',
    qCount: 10, type: 'directions', qType: 'reverse_mc', timedSec: 0, tag: 'medium', xpMult: 2, tagLabel: 'Level 6', difficulty: 'mixed'
  },
  {
    key: 'planes_type', name: 'Planes: Typing Master', icon: '??', banner: 'orange',
    desc: 'Type the exact Miller indices (hkl) for each plane shown. No multiple choice!',
    qCount: 10, type: 'planes', qType: 'type', timedSec: 0, tag: 'hard', xpMult: 2.5, tagLabel: 'Level 7', difficulty: 'mixed'
  },
  {
    key: 'dirs_type', name: 'Directions: Typing Master', icon: '??', banner: 'orange',
    desc: 'Type the exact crystallographic direction indices [uvw] for each arrow shown.',
    qCount: 10, type: 'directions', qType: 'type', timedSec: 0, tag: 'hard', xpMult: 2.5, tagLabel: 'Level 8', difficulty: 'mixed'
  },
  {
    key: 'blitz', name: '? Blitz Round', icon: '?', banner: 'red',
    desc: '20 mixed questions. 15 seconds each! Race the clock for maximum XP multipliers.',
    qCount: 20, type: 'mixed', qType: 'mc', timedSec: 15, tag: 'hard', xpMult: 3, tagLabel: 'Level 9', difficulty: 'mixed'
  },
  {
    key: 'boss', name: '?? Boss Battle', icon: '??', banner: 'red',
    desc: '25 typing questions covering everything. 3 lives - lose them all and it is over.',
    qCount: 25, type: 'mixed', qType: 'type', timedSec: 30, tag: 'hard', xpMult: 4, tagLabel: 'Level 10', difficulty: 'mixed'
  },
  {
    key: 'final_exam', name: '?? Final Exam', icon: '??', banner: 'purple',
    desc: 'The ultimate test of your crystallography knowledge. 20 mixed questions, Reverse & Type modes. Passing unlocks Mastery.',
    qCount: 20, type: 'mixed', qType: 'reverse_mc', timedSec: 0, tag: 'expert', xpMult: 6, tagLabel: 'Mastery', difficulty: 'mixed'
  }
];

export interface PlaneExample {
  h: number;
  k: number;
  l: number;
  label: string;
  category: string;
}

export interface DirExample {
  u: number;
  v: number;
  w: number;
  tail: { x: number; y: number; z: number };
  head: { x: number; y: number; z: number };
  desc: string;
  category: string;
}

export interface Question {
  kind: 'plane' | 'dir';
  category?: string;
  h?: number;
  k?: number;
  l?: number;
  u?: number;
  v?: number;
  w?: number;
  tail?: { x: number; y: number; z: number };
  head?: { x: number; y: number; z: number };
  qType?: 'mc' | 'type' | 'reverse_mc';
}

let planeExamples: PlaneExample[] = [];
let dirExamples: DirExample[] = [];

export function getPracticeData() {
  if (planeExamples.length > 0 && dirExamples.length > 0) {
    return { planeExamples, dirExamples };
  }

  const planeBase = [
    { h: 1, k: 0, l: 0, label: "x-face" }, { h: 0, k: 1, l: 0, label: "y-face" },
    { h: 0, k: 0, l: 1, label: "z-face" }, { h: 1, k: 1, l: 0, label: "face diagonal" },
    { h: 1, k: 1, l: 1, label: "body diagonal" }, { h: 2, k: 1, l: 0, label: "low-index" },
    { h: 2, k: 2, l: 1, label: "medium-index" }, { h: 3, k: 1, l: 1, label: "medium-index" }
  ];
  const planeSeen = new Set<string>();
  planeBase.forEach(base => {
    const signs = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]];
    const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const arr = [base.h, base.k, base.l];
    perms.forEach(perm => {
      signs.forEach(s => {
        const h = arr[perm[0]] * s[0];
        const k = arr[perm[1]] * s[1];
        const l = arr[perm[2]] * s[2];
        const key = `${h},${k},${l}`;
        if (!planeSeen.has(key) && (h || k || l)) {
          planeSeen.add(key);
          planeExamples.push({ h, k, l, label: base.label, category: base.label });
        }
      });
    });
  });
  planeExamples.sort((a, b) => (Math.abs(a.h) + Math.abs(a.k) + Math.abs(a.l)) - (Math.abs(b.h) + Math.abs(b.k) + Math.abs(b.l)));

  const getDrawingCoordsLocal = (u: number, v: number, w: number) => {
    if (u === 0 && v === 0 && w === 0) return { tail: { x: 0, y: 0, z: 0 }, head: { x: 0, y: 0, z: 0 } };
    const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
    const dx = u / maxAbs, dy = v / maxAbs, dz = w / maxAbs;
    const tx = u < 0 ? 1 : 0, ty = v < 0 ? 1 : 0, tz = w < 0 ? 1 : 0;
    return { tail: { x: tx, y: ty, z: tz }, head: { x: tx + dx, y: ty + dy, z: tz + dz } };
  };

  const dirBase = [
    { u: 1, v: 0, w: 0, desc: "Edge" },
    { u: 1, v: 1, w: 0, desc: "Face diagonal" },
    { u: 1, v: 0, w: 1, desc: "Face diagonal" },
    { u: 1, v: 1, w: 1, desc: "Body diagonal" },
    { u: 2, v: 1, w: 0, desc: "Oblique face" },
    { u: 2, v: 0, w: 1, desc: "Oblique face" },
    { u: 2, v: 1, w: 1, desc: "Low-index" },
    { u: 1, v: 2, w: 1, desc: "Low-index" },
    { u: 2, v: 2, w: 1, desc: "Medium-index" },
    { u: 3, v: 1, w: 1, desc: "Medium-index" },
    { u: 3, v: 2, w: 0, desc: "Medium-index" }
  ];
  
  const dirSeen = new Set<string>();
  dirBase.forEach(base => {
    const signs = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]];
    const perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const arr = [base.u, base.v, base.w];
    perms.forEach(perm => {
      signs.forEach(s => {
        const u = arr[perm[0]] * s[0];
        const v = arr[perm[1]] * s[1];
        const w = arr[perm[2]] * s[2];
        const key = `${u},${v},${w}`;
        if (!dirSeen.has(key) && (u || v || w)) {
          dirSeen.add(key);
          const coords = getDrawingCoordsLocal(u, v, w);
          dirExamples.push({ u, v, w, tail: coords.tail, head: coords.head, desc: base.desc, category: base.desc });
        }
      });
    });
  });

  return { planeExamples, dirExamples };
}

export function getHintText(q: Question) {
  if (q.kind === 'plane') {
    return 'Look at where the plane crosses the x, y, and z axes. Take the reciprocal of those intercepts (1/intercept) to get the Miller indices (hkl). Remember, if it is parallel to an axis, the intercept is infinity, making the index 0!';
  } else {
    return 'Find the head and tail coordinates. The vector is Head - Tail. Then multiply by the lowest common denominator to get the smallest integers [uvw]!';
  }
}
