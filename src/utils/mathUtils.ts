// GCD with proper zero handling
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return Math.max(a, 1);
}

// LCM with zero/infinity handling
export function lcm(a: number, b: number): number {
  if (!a || !b) return Math.max(Math.abs(a), Math.abs(b)) || 1;
  const g = gcd(a, b);
  if (g === 0 || !isFinite(a) || !isFinite(b)) return 1;
  const result = Math.abs(a * b) / g;
  return isFinite(result) ? result : 1;
}

export function parseFrac(str: string | number): number {
  const s = String(str).trim().toLowerCase();
  if (s === 'inf' || s === 'infinity' || s === '∞') return Infinity;
  if (s.includes('/')) {
    const pts = s.split('/');
    return parseFloat(pts[0]) / parseFloat(pts[1]);
  }
  return parseFloat(s);
}

export function toFracStr(val: number): string {
  if (!isFinite(val)) return '∞';
  if (Math.abs(val) < 1e-5) return "0";
  if (Math.abs(val - Math.round(val)) < 1e-5) return String(Math.round(val));
  for (let i = 2; i <= 12; i++) {
    const num = val * i;
    if (Math.abs(num - Math.round(num)) < 1e-4) {
      return i === 1 ? `${Math.round(num)}` : `${Math.round(num)}/${i}`;
    }
  }
  return val.toFixed(2);
}

export function formatHKL(h: number | string, k: number | string, l: number | string): string {
  const fmt = (val: number | string) => {
    const n = typeof val === 'string' ? parseFloat(val) : val;
    return n < 0
      ? `<span class="overline">${typeof val === 'string' ? val.replace(/^-/, '') : Math.abs(val)}</span>`
      : String(val);
  };
  return `(${fmt(h)}${fmt(k)}${fmt(l)})`;
}

export function formatUVW(u: number | string, v: number | string, w: number | string): string {
  const fmt = (val: number | string) => {
    const n = typeof val === 'string' ? parseFloat(val) : val;
    return n < 0
      ? `<span class="overline">${typeof val === 'string' ? val.replace(/^-/, '') : Math.abs(val)}</span>`
      : String(val);
  };
  return `[${fmt(u)} ${fmt(v)} ${fmt(w)}]`;
}

export interface Coords3D {
  x: number;
  y: number;
  z: number;
}

export interface DirectionCoords {
  tail: Coords3D;
  head: Coords3D;
}

export function getDrawingCoords(u: number, v: number, w: number): DirectionCoords | null {
  if (u === 0 && v === 0 && w === 0) return null;
  const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
  const dx = u / maxAbs, dy = v / maxAbs, dz = w / maxAbs;
  const tx = u < 0 ? 1 : 0, ty = v < 0 ? 1 : 0, tz = w < 0 ? 1 : 0;
  return {
    tail: { x: tx, y: ty, z: tz },
    head: { x: tx + dx, y: ty + dy, z: tz + dz }
  };
}

// Parse "0.5", "1/2", "-3/4", "2", "∞", "infinity" -> number (or Infinity)
export function parseFractionOrDecimal(str: string | null | undefined): number {
  if (str === null || str === undefined) return NaN;
  str = String(str).trim();
  if (!str) return NaN;

  // Infinity handling
  const sLower = str.toLowerCase();
  if (str === "∞" || sLower === "inf" || sLower === "infinity") return Infinity;
  if (str === "-∞" || sLower === "-inf" || sLower === "-infinity") return -Infinity;

  // Fraction a/b
  if (str.includes("/")) {
    const parts = str.split("/");
    if (parts.length !== 2) return NaN;
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (!isFinite(num) || !isFinite(den) || den === 0) return NaN;
    return num / den;
  }

  // Decimal or integer
  const val = parseFloat(str);
  return isNaN(val) ? NaN : val;
}

// Convert decimal -> (num, den) fraction approx with limited denominator
export function decimalToFraction(x: number, maxDen = 1000): { num: number; den: number } {
  if (!isFinite(x)) return { num: x > 0 ? 1 : -1, den: 1 };
  if (Math.abs(x) < 1e-12) return { num: 0, den: 1 };
  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x);

  let bestNum = 1, bestDen = 1, bestError = Math.abs(x - 1);
  for (let den = 1; den <= maxDen; den++) {
    const num = Math.round(x * den);
    if (num === 0) continue; // Skip zero numerators
    const approx = num / den;
    const error = Math.abs(x - approx);
    if (error < bestError) {
      bestError = error;
      bestNum = num;
      bestDen = den;
      if (error < 1e-12) break;
    }
  }
  const g = Math.max(gcd(bestNum, bestDen), 1);
  return { num: sign * Math.round(bestNum / g), den: Math.round(bestDen / g) };
}

// Convert Miller indices (h, k, l) to fractional intercepts (A/a, B/b, C/c)
export function indicesToIntercepts(h: number, k: number, l: number): { A_a: number; B_b: number; C_c: number } {
  if (!isFinite(h) && h !== 0) h = 0;
  if (!isFinite(k) && k !== 0) k = 0;
  if (!isFinite(l) && l !== 0) l = 0;

  return {
    A_a: h === 0 ? Infinity : 1 / h,
    B_b: k === 0 ? Infinity : 1 / k,
    C_c: l === 0 ? Infinity : 1 / l
  };
}

// Convert intercepts (A/a, B/b, C/c) back to Miller indices
export function interceptsToMillerIndices(Astr: string, Bstr: string, Cstr: string): { h: number; k: number; l: number } | null {
  const A = parseFractionOrDecimal(Astr);
  const B = parseFractionOrDecimal(Bstr);
  const C = parseFractionOrDecimal(Cstr);

  if (isNaN(A) || isNaN(B) || isNaN(C)) {
    return null; // error
  }

  const h = (A === Infinity || A === -Infinity) ? 0 : (A === 0 ? null : 1 / A);
  const k = (B === Infinity || B === -Infinity) ? 0 : (B === 0 ? null : 1 / B);
  const l = (C === Infinity || C === -Infinity) ? 0 : (C === 0 ? null : 1 / C);

  if (h === null || k === null || l === null) return null;
  if (!isFinite(h) || !isFinite(k) || !isFinite(l)) return null;

  const fh = decimalToFraction(h);
  const fk = decimalToFraction(k);
  const fl = decimalToFraction(l);

  if (!fh || !fk || !fl) return null;

  let commonDen = Math.abs(fh.den);
  commonDen = lcm(commonDen, Math.abs(fk.den));
  commonDen = lcm(commonDen, Math.abs(fl.den));

  if (commonDen === 0 || !isFinite(commonDen)) commonDen = 1;

  let H = fh.num * (commonDen / fh.den);
  let K = fk.num * (commonDen / fk.den);
  let L = fl.num * (commonDen / fl.den);

  H = Math.round(H);
  K = Math.round(K);
  L = Math.round(L);

  const gAll = gcd(gcd(H, K), L);
  if (gAll > 1) {
    H = Math.round(H / gAll);
    K = Math.round(K / gAll);
    L = Math.round(L / gAll);
  }

  return { h: H, k: K, l: L };
}

// Parse decimal, fraction, or integer -> number
export function parseFracOrDec(str: string | number | null | undefined): number {
  if (typeof str === 'number') return str;
  if (str === null || str === undefined) return NaN;
  str = String(str).trim();
  if (!str) return NaN;

  if (str.includes("/")) {
    const [n, d] = str.split("/");
    const num = parseFloat(n);
    const den = parseFloat(d);
    if (!isFinite(num) || !isFinite(den) || den === 0) return NaN;
    return num / den;
  }
  const v = parseFloat(str);
  return isNaN(v) ? NaN : v;
}

interface Point3D {
  x: string | number;
  y: string | number;
  z: string | number;
}

// Calculate direction [uvw] from tail and head points
export function directionFromPoints(tail: Point3D, head: Point3D): { u: number; v: number; w: number } | null {
  if (!tail || !head) return null;

  const x1 = parseFracOrDec(tail.x);
  const y1 = parseFracOrDec(tail.y);
  const z1 = parseFracOrDec(tail.z);

  const x2 = parseFracOrDec(head.x);
  const y2 = parseFracOrDec(head.y);
  const z2 = parseFracOrDec(head.z);

  if ([x1, y1, z1, x2, y2, z2].some(v => isNaN(v))) return null;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const dz = z2 - z1;

  if (Math.abs(dx) < 1e-9 && Math.abs(dy) < 1e-9 && Math.abs(dz) < 1e-9) {
    return null; // no direction
  }

  const fx = decimalToFraction(dx);
  const fy = decimalToFraction(dy);
  const fz = decimalToFraction(dz);

  if (!fx || !fy || !fz) return null;

  let commonDen = Math.abs(fx.den);
  commonDen = lcm(commonDen, Math.abs(fy.den));
  commonDen = lcm(commonDen, Math.abs(fz.den));

  if (commonDen === 0 || !isFinite(commonDen)) commonDen = 1;

  let u = fx.num * (commonDen / fx.den);
  let v = fy.num * (commonDen / fy.den);
  let w = fz.num * (commonDen / fz.den);

  u = Math.round(u);
  v = Math.round(v);
  w = Math.round(w);

  const gAll = gcd(gcd(u, v), w);
  if (gAll > 1) {
    u = Math.round(u / gAll);
    v = Math.round(v / gAll);
    w = Math.round(w / gAll);
  }

  return { u, v, w };
}

const SNAP_EPS = 0.02;
export function snapToAxis(x: number, y: number, z: number): Coords3D {
  const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
  const nearX = ax < SNAP_EPS, nearY = ay < SNAP_EPS, nearZ = az < SNAP_EPS;
  if (nearX && nearY && nearZ) return { x: 0, y: 0, z: 0 };
  if (nearY && nearZ) return { x, y: 0, z: 0 };  // x-axis
  if (nearX && nearZ) return { x: 0, y, z: 0 };  // y-axis
  if (nearX && nearY) return { x: 0, y: 0, z };  // z-axis
  return { x: nearX ? 0 : x, y: nearY ? 0 : y, z: nearZ ? 0 : z };
}

// Auto-divide indices by the smallest non-zero absolute value
export function autoReduceIndices(h: number, k: number, l: number): { h: number; k: number; l: number; divisor: number | null } {
  const vals = [h, k, l].filter(v => isFinite(v) && v !== 0);
  if (vals.length === 0) return { h, k, l, divisor: null };
  const minAbs = Math.min(...vals.map(Math.abs));
  // Only auto-divide when all non-zero values are integers AND minAbs > 1
  const allInts = vals.every(v => Math.abs(v - Math.round(v)) < 1e-9);
  if (!allInts || minAbs <= 1) return { h, k, l, divisor: null };
  return { h: h / minAbs, k: k / minAbs, l: l / minAbs, divisor: minAbs };
}
