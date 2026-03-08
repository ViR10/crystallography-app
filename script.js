// ==================== DATA & STATE ====================
const planeExamples = [];
const dirExamples = [];
let currentModule = 'planes';
let currentPage = 'learning';
let currentPlaneTab = 0;
let currentDirTab = 0;
let practiceMode = null;
let practiceQuestionIdx = 0;
let practiceQuestions = [];
let intMode = null, intTail = null, intHead = null;
let sessionCorrect = 0, sessionWrong = 0;

// Progress tracking
let progress = {
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
        questionsCompleted: 0
    }
};

// Initialize data
function initData() {
    // Generate plane examples
    const planeBase = [
        { h: 1, k: 0, l: 0, label: "x-face" }, { h: 0, k: 1, l: 0, label: "y-face" },
        { h: 0, k: 0, l: 1, label: "z-face" }, { h: 1, k: 1, l: 0, label: "face diagonal" },
        { h: 1, k: 1, l: 1, label: "body diagonal" }, { h: 2, k: 1, l: 0, label: "low-index" },
        { h: 2, k: 2, l: 1, label: "medium-index" }, { h: 3, k: 1, l: 1, label: "medium-index" }
    ];
    let planeSeen = new Set();
    planeBase.forEach(base => {
        let signs = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]];
        let perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
        let arr = [base.h, base.k, base.l];
        perms.forEach(perm => {
            signs.forEach(s => {
                let h = arr[perm[0]] * s[0], k = arr[perm[1]] * s[1], l = arr[perm[2]] * s[2];
                let key = `${h},${k},${l}`;
                if (!planeSeen.has(key) && (h || k || l)) {
                    planeSeen.add(key);
                    planeExamples.push({ h, k, l, label: base.label, category: base.label });
                }
            });
        });
    });
    planeExamples.sort((a, b) => (Math.abs(a.h) + Math.abs(a.k) + Math.abs(a.l)) - (Math.abs(b.h) + Math.abs(b.k) + Math.abs(b.l)));

    // Generate direction examples — full set with positive & negative variants
    const dirBase = [
        // Axis-aligned (edges)
        { u: 1, v: 0, w: 0, desc: "Edge" },
        // Face diagonals
        { u: 1, v: 1, w: 0, desc: "Face diagonal" },
        { u: 1, v: 0, w: 1, desc: "Face diagonal" },
        // Body diagonals
        { u: 1, v: 1, w: 1, desc: "Body diagonal" },
        // Low-index oblique
        { u: 2, v: 1, w: 0, desc: "Oblique face" },
        { u: 2, v: 0, w: 1, desc: "Oblique face" },
        // Low-index 3D
        { u: 2, v: 1, w: 1, desc: "Low-index" },
        { u: 1, v: 2, w: 1, desc: "Low-index" },
        // Mixed negative dominant
        { u: 2, v: 1, w: -1, desc: "Mixed-direction" },
        { u: 1, v: 2, w: -1, desc: "Mixed-direction" },
        { u: 2, v: -1, w: 1, desc: "Mixed-direction" },
        // Medium-index
        { u: 2, v: 2, w: 1, desc: "Medium-index" },
        { u: 3, v: 1, w: 1, desc: "Medium-index" },
        { u: 3, v: 2, w: 0, desc: "Medium-index" },
        // High-index
        { u: 3, v: 2, w: 1, desc: "High-index" },
        { u: 3, v: 1, w: 2, desc: "High-index" },
        { u: 4, v: 1, w: 0, desc: "High-index" },
        { u: 4, v: 2, w: 1, desc: "High-index" },
        // Negative-dominant directions
        { u: -1, v: 2, w: 1, desc: "Neg-dominant" },
        { u: -2, v: 1, w: 1, desc: "Neg-dominant" },
        { u: -1, v: -1, w: 2, desc: "Neg-dominant" }
    ];
    let dirSeen = new Set();
    dirBase.forEach(proto => {
        let signs = [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [1, 1, -1], [-1, -1, 1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]];
        let perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
        let arr = [proto.u, proto.v, proto.w];
        perms.forEach(p => {
            signs.forEach(s => {
                let u = arr[p[0]] * s[0], v = arr[p[1]] * s[1], w = arr[p[2]] * s[2];
                let key = `${u},${v},${w}`;
                if (!dirSeen.has(key) && (u || v || w)) {
                    dirSeen.add(key);
                    let coords = getDrawingCoords(u, v, w);
                    dirExamples.push({ u, v, w, tail: coords.tail, head: coords.head, desc: proto.desc, category: proto.desc });
                }
            });
        });
    });
    dirExamples.sort((a, b) => (Math.abs(a.u) + Math.abs(a.v) + Math.abs(a.w)) - (Math.abs(b.u) + Math.abs(b.v) + Math.abs(b.w)));
}

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('crystallograph_progress');
    if (saved) {
        try {
            progress = JSON.parse(saved);
            // Ensure gameStats exists for backward compatibility
            if (!progress.gameStats) {
                progress.gameStats = {
                    totalPoints: 0,
                    level: 1,
                    experience: 0,
                    streak: 0,
                    lastPracticeDate: null,
                    achievements: {},
                    questionsCompleted: 0
                };
            }
            updateProgressUI();
        } catch (e) {
            console.error('Error loading progress:', e);
            showToast('Error loading progress. Starting fresh.');
        }
    } else {
        // Initialize gameStats if no saved progress
        progress.gameStats = {
            totalPoints: 0,
            level: 1,
            experience: 0,
            streak: 0,
            lastPracticeDate: null,
            achievements: {},
            questionsCompleted: 0
        };
    }
}

// Save progress
function saveProgress() {
    try {
        localStorage.setItem('crystallograph_progress', JSON.stringify(progress));
    } catch (e) {
        console.error('Error saving progress:', e);
    }
}

// ==================== MATH UTILITIES ====================
// GCD with proper zero handling
function gcd(a, b) {
    a = Math.abs(Math.round(a));
    b = Math.abs(Math.round(b));
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return Math.max(a, 1);
}

function parseFrac(str) {
    str = String(str).trim().toLowerCase();
    if (str === 'inf' || str === 'infinity' || str === '∞') return Infinity;
    if (str.includes('/')) { let pts = str.split('/'); return parseFloat(pts[0]) / parseFloat(pts[1]); }
    return parseFloat(str);
}
function toFracStr(val) {
    if (!isFinite(val)) return '∞';
    if (Math.abs(val) < 1e-5) return "0";
    if (Math.abs(val - Math.round(val)) < 1e-5) return String(Math.round(val));
    for (let i = 2; i <= 12; i++) { let num = val * i; if (Math.abs(num - Math.round(num)) < 1e-4) return i === 1 ? `${Math.round(num)}` : `${Math.round(num)}/${i}`; }
    return val.toFixed(2);
}
function formatHKL(h, k, l) {
    const fmt = (val) => val < 0 ? `<span class="overline">${Math.abs(val)}</span>` : val;
    return `(${fmt(h)}${fmt(k)}${fmt(l)})`;
}
function formatUVW(u, v, w) {
    const fmt = (val) => val < 0 ? `<span class="overline">${Math.abs(val)}</span>` : val;
    return `[${fmt(u)} ${fmt(v)} ${fmt(w)}]`;
}
function getDrawingCoords(u, v, w) {
    if (u === 0 && v === 0 && w === 0) return null;
    let maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
    let dx = u / maxAbs, dy = v / maxAbs, dz = w / maxAbs;
    let tx = u < 0 ? 1 : 0, ty = v < 0 ? 1 : 0, tz = w < 0 ? 1 : 0;
    return { tail: { x: tx, y: ty, z: tz }, head: { x: tx + dx, y: ty + dy, z: tz + dz } };
}

// ---- Helpers for Intercepts ↔ Miller Indices ----
// Parse "0.5", "1/2", "-3/4", "2", "∞", "infinity" -> number (or Infinity)
function parseFractionOrDecimal(str) {
    if (!str) return NaN;
    str = String(str).trim();
    if (!str) return NaN;

    // Infinity handling
    if (str === "∞" || str.toLowerCase() === "infinity") return Infinity;
    if (str === "-∞" || str.toLowerCase() === "-infinity") return -Infinity;

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

// LCM with zero/infinity handling
function lcm(a, b) {
    if (!a || !b) return Math.max(Math.abs(a), Math.abs(b)) || 1;
    const g = gcd(a, b);
    if (g === 0 || !isFinite(a) || !isFinite(b)) return 1;
    const result = Math.abs(a * b) / g;
    return isFinite(result) ? result : 1;
}

// Convert decimal -> (num, den) fraction approx with limited denominator
function decimalToFraction(x, maxDen = 1000) {
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
function indicesToIntercepts(h, k, l) {
    // Ensure we have valid numbers
    if (!isFinite(h) && h !== 0) h = 0;
    if (!isFinite(k) && k !== 0) k = 0;
    if (!isFinite(l) && l !== 0) l = 0;

    const results = {};

    // A/a = 1/h
    if (h === 0) {
        results.A_a = Infinity;
    } else {
        results.A_a = 1 / h;
    }

    // B/b = 1/k
    if (k === 0) {
        results.B_b = Infinity;
    } else {
        results.B_b = 1 / k;
    }

    // C/c = 1/l
    if (l === 0) {
        results.C_c = Infinity;
    } else {
        results.C_c = 1 / l;
    }

    return results;
}

// Convert intercepts (A/a, B/b, C/c) back to Miller indices with robust error handling
function interceptsToMillerIndices(Astr, Bstr, Cstr) {
    const A = parseFractionOrDecimal(Astr);
    const B = parseFractionOrDecimal(Bstr);
    const C = parseFractionOrDecimal(Cstr);

    // Check for invalid input (NaN is error, Infinity is allowed for 0 index)
    if (isNaN(A) || isNaN(B) || isNaN(C)) {
        return null; // error
    }

    // Reciprocals: infinity -> 0 index, 0 -> error
    let h = (A === Infinity || A === -Infinity) ? 0 : (A === 0 ? null : 1 / A);
    let k = (B === Infinity || B === -Infinity) ? 0 : (B === 0 ? null : 1 / B);
    let l = (C === Infinity || C === -Infinity) ? 0 : (C === 0 ? null : 1 / C);

    // If any reciprocal is null (because intercept was 0), return error
    if (h === null || k === null || l === null) {
        return null;
    }

    // If any reciprocal is not finite, return error
    if (!isFinite(h) || !isFinite(k) || !isFinite(l)) {
        return null;
    }

    // Convert reciprocals to fractions
    const fh = decimalToFraction(h);
    const fk = decimalToFraction(k);
    const fl = decimalToFraction(l);

    // Ensure valid fractions
    if (!fh || !fk || !fl) return null;

    // LCM of denominators with safety checks
    let commonDen = Math.abs(fh.den);
    commonDen = lcm(commonDen, Math.abs(fk.den));
    commonDen = lcm(commonDen, Math.abs(fl.den));

    if (commonDen === 0 || !isFinite(commonDen)) commonDen = 1;

    // Scale numerators to common denominator (with safety checks)
    let H = fh.num * (commonDen / fh.den);
    let K = fk.num * (commonDen / fk.den);
    let L = fl.num * (commonDen / fl.den);

    // Round to nearest integer
    H = Math.round(H);
    K = Math.round(K);
    L = Math.round(L);

    // Reduce by gcd
    const gAll = gcd(gcd(H, K), L);
    if (gAll > 1) {
        H = Math.round(H / gAll);
        K = Math.round(K / gAll);
        L = Math.round(L / gAll);
    }

    return { h: H, k: K, l: L };
}

// ---- Helpers for Direction from Points [uvw] ----
// Parse decimal, fraction, or integer -> number
function parseFracOrDec(str) {
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

// GCD for integers with zero handling
function gcdInt(a, b) {
    a = Math.round(a);
    b = Math.round(b);
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        const t = b;
        b = a % b;
        a = t;
    }
    return Math.max(a, 1);
}

// LCM for integers with zero/infinity handling
function lcmInt(a, b) {
    if (!a || !b) return Math.max(Math.abs(a), Math.abs(b)) || 1;
    const g = gcdInt(a, b);
    if (g === 0 || !isFinite(a) || !isFinite(b)) return 1;
    const result = Math.abs(a * b) / g;
    return isFinite(result) ? result : 1;
}

// Convert decimal to fraction with max denominator (improved version)
function decToFrac(x, maxDen = 1000) {
    if (!isFinite(x)) return { num: x > 0 ? 1 : -1, den: 1 };
    if (Math.abs(x) < 1e-12) return { num: 0, den: 1 };
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);

    let bestNum = 1, bestDen = 1, bestErr = Math.abs(x - 1);

    for (let den = 1; den <= maxDen; den++) {
        const num = Math.round(x * den);
        if (num === 0) continue; // Skip zero numerators
        const approx = num / den;
        const err = Math.abs(x - approx);
        if (err < bestErr) {
            bestErr = err;
            bestNum = num;
            bestDen = den;
            if (err < 1e-12) break;
        }
    }
    const g = Math.max(gcdInt(bestNum, bestDen), 1);
    return { num: sign * Math.round(bestNum / g), den: Math.round(bestDen / g) };
}

// Calculate direction [uvw] from tail and head points (robust version)
// tail/head: {x, y, z} coordinates (can be strings: decimals, fractions, or numbers)
// returns: {u, v, w} direction indices or null on error
function directionFromPoints(tail, head) {
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

    const fx = decToFrac(dx);
    const fy = decToFrac(dy);
    const fz = decToFrac(dz);

    // Ensure valid fractions
    if (!fx || !fy || !fz) return null;

    let commonDen = Math.abs(fx.den);
    commonDen = lcmInt(commonDen, Math.abs(fy.den));
    commonDen = lcmInt(commonDen, Math.abs(fz.den));

    if (commonDen === 0 || !isFinite(commonDen)) commonDen = 1;

    let u = fx.num * (commonDen / fx.den);
    let v = fy.num * (commonDen / fy.den);
    let w = fz.num * (commonDen / fz.den);

    u = Math.round(u);
    v = Math.round(v);
    w = Math.round(w);

    const gAll = gcdInt(gcdInt(u, v), w);
    if (gAll > 1) {
        u = Math.round(u / gAll);
        v = Math.round(v / gAll);
        w = Math.round(w / gAll);
    }

    return { u, v, w }; // indices [u v w]
}

// ==================== CANVAS & 3D ====================

const W = 600, H = 500, a = 180, ox = W / 2 - 20, oy = H / 2 + 80;

const angleX = Math.PI / 6;

const vecX = { u: -Math.cos(angleX) * a * 0.8, v: Math.sin(angleX) * a * 0.8 };

const vecY = { u: a, v: 0 };

const vecZ = { u: 0, v: -a };

let viewRotY = 0;

const canvas = document.getElementById('crystalCanvas');

const ctx = canvas.getContext('2d');

const practiceCanvas = document.getElementById('practiceCanvas');

const practiceCtx = practiceCanvas ? practiceCanvas.getContext('2d') : null;
// Scale canvas for device pixel ratio and container width
function resizeCanvas(cvs) {
    if (!cvs || !cvs.parentElement) return;
    const container = cvs.parentElement;
    const containerWidth = container.clientWidth - 24;
    if (containerWidth < W) {
        cvs.style.width = '100%';
        cvs.style.height = 'auto';
    } else {
        cvs.style.width = '';
        cvs.style.height = '';
    }
}

function resizeAllCanvases() {
    if (canvas) resizeCanvas(canvas);
    if (practiceCanvas) resizeCanvas(practiceCanvas);
}

window.addEventListener('resize', function () {
    resizeAllCanvases();
    refreshCanvas();
});

function project(x, y, z) {
    let rad = viewRotY * Math.PI / 180;
    let rx = x * Math.cos(rad) - y * Math.sin(rad);
    let ry = x * Math.sin(rad) + y * Math.cos(rad);
    let rz = z;
    return {
        u: ox + rx * vecX.u + ry * vecY.u + rz * vecZ.u,
        v: oy + rx * vecX.v + ry * vecY.v + rz * vecZ.v
    };
}

function drawAxesAndCube(targetCtx = ctx) {
    if (!targetCtx) return; // Safety check
    targetCtx.clearRect(0, 0, W, H);
    const pts = {
        v000: project(0, 0, 0), v100: project(1, 0, 0), v010: project(0, 1, 0), v110: project(1, 1, 0),
        v001: project(0, 0, 1), v101: project(1, 0, 1), v011: project(0, 1, 1), v111: project(1, 1, 1)
    };
    targetCtx.lineWidth = 1; targetCtx.strokeStyle = '#A19F9D'; targetCtx.setLineDash([5, 5]);
    targetCtx.beginPath();
    targetCtx.moveTo(pts.v010.u, pts.v010.v); targetCtx.lineTo(pts.v000.u, pts.v000.v);
    targetCtx.moveTo(pts.v001.u, pts.v001.v); targetCtx.lineTo(pts.v000.u, pts.v000.v);
    targetCtx.moveTo(pts.v100.u, pts.v100.v); targetCtx.lineTo(pts.v000.u, pts.v000.v);
    targetCtx.stroke(); targetCtx.setLineDash([]);

    targetCtx.lineWidth = 2; targetCtx.strokeStyle = '#323130';
    targetCtx.beginPath();
    targetCtx.moveTo(pts.v100.u, pts.v100.v); targetCtx.lineTo(pts.v110.u, pts.v110.v); targetCtx.lineTo(pts.v010.u, pts.v010.v);
    targetCtx.moveTo(pts.v001.u, pts.v001.v); targetCtx.lineTo(pts.v101.u, pts.v101.v); targetCtx.lineTo(pts.v111.u, pts.v111.v);
    targetCtx.lineTo(pts.v011.u, pts.v011.v); targetCtx.closePath();
    targetCtx.moveTo(pts.v100.u, pts.v100.v); targetCtx.lineTo(pts.v101.u, pts.v101.v);
    targetCtx.moveTo(pts.v110.u, pts.v110.v); targetCtx.lineTo(pts.v111.u, pts.v111.v);
    targetCtx.moveTo(pts.v010.u, pts.v010.v); targetCtx.lineTo(pts.v011.u, pts.v011.v);
    targetCtx.stroke();

    drawArrow3D(0, 0, 0, 1.4, 0, 0, '#005A9E', 'x', targetCtx);
    drawArrow3D(0, 0, 0, 0, 1.4, 0, '#107C10', 'y', targetCtx);
    drawArrow3D(0, 0, 0, 0, 0, 1.4, '#A4262C', 'z', targetCtx);
}

function drawArrow3D(x1, y1, z1, x2, y2, z2, color, label, targetCtx = ctx) {
    if (!targetCtx) return; // Safety check
    let p1 = project(x1, y1, z1), p2 = project(x2, y2, z2);
    targetCtx.beginPath(); targetCtx.moveTo(p1.u, p1.v); targetCtx.lineTo(p2.u, p2.v);
    targetCtx.strokeStyle = color; targetCtx.lineWidth = 3; targetCtx.stroke();
    let angle = Math.atan2(p2.v - p1.v, p2.u - p1.u);
    targetCtx.beginPath(); targetCtx.moveTo(p2.u, p2.v);
    targetCtx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
    targetCtx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
    targetCtx.fillStyle = color; targetCtx.fill();
    if (label) {
        targetCtx.font = 'bold 16px Arial'; targetCtx.fillStyle = '#333';
        targetCtx.fillText(label, p2.u + 15, p2.v);
    }
}

function drawPlane(h, k, l, targetCtx = ctx, showLabel = true) {
    if (!targetCtx) return; // Safety check
    drawAxesAndCube(targetCtx);
    if (showLabel) {
        document.getElementById('current-indices').innerHTML = formatHKL(h, k, l);
        document.getElementById('current-intercepts').textContent = `${h === 0 ? '∞' : toFracStr(1 / h)}, ${k === 0 ? '∞' : toFracStr(1 / k)}, ${l === 0 ? '∞' : toFracStr(1 / l)}`;
    }
    if (h === 0 && k === 0 && l === 0) return;
    let n = 1; if (h < 0 || k < 0 || l < 0) n = (h < 0 ? h : 0) + (k < 0 ? k : 0) + (l < 0 ? l : 0) + 1;
    const edges = [[[0, 0, 0], [1, 0, 0]], [[1, 0, 0], [1, 1, 0]], [[1, 1, 0], [0, 1, 0]], [[0, 1, 0], [0, 0, 0]], [[0, 0, 1], [1, 0, 1]], [[1, 0, 1], [1, 1, 1]], [[1, 1, 1], [0, 1, 1]], [[0, 1, 1], [0, 0, 1]], [[0, 0, 0], [0, 0, 1]], [[1, 0, 0], [1, 0, 1]], [[1, 1, 0], [1, 1, 1]], [[0, 1, 0], [0, 1, 1]]];
    let points3D = [];
    edges.forEach(edge => {
        const A = edge[0], B = edge[1];
        const denom = h * (B[0] - A[0]) + k * (B[1] - A[1]) + l * (B[2] - A[2]);
        const num = n - (h * A[0] + k * A[1] + l * A[2]);
        if (denom !== 0) {
            const t = num / denom;
            if (t >= -0.0001 && t <= 1.0001) points3D.push({ x: A[0] + t * (B[0] - A[0]), y: A[1] + t * (B[1] - A[1]), z: A[2] + t * (B[2] - A[2]) });
        }
    });
    points3D = points3D.filter((p, i, self) => i === self.findIndex(t => (Math.abs(t.x - p.x) < 1e-4 && Math.abs(t.y - p.y) < 1e-4 && Math.abs(t.z - p.z) < 1e-4)));
    if (points3D.length < 3) return;
    let points2D = points3D.map(p => project(p.x, p.y, p.z));
    let cx = 0, cy = 0; points2D.forEach(p => { cx += p.u; cy += p.v; }); cx /= points2D.length; cy /= points2D.length;
    points2D.sort((a, b) => Math.atan2(a.v - cy, a.u - cx) - Math.atan2(b.v - cy, b.u - cx));
    targetCtx.beginPath(); targetCtx.moveTo(points2D[0].u, points2D[0].v);
    for (let i = 1; i < points2D.length; i++) targetCtx.lineTo(points2D[i].u, points2D[i].v);
    targetCtx.closePath(); targetCtx.fillStyle = 'rgba(0,150,255,0.6)'; targetCtx.fill();
    targetCtx.strokeStyle = '#005A9E'; targetCtx.lineWidth = 2; targetCtx.stroke();
    targetCtx.fillStyle = '#D83B01'; points2D.forEach(p => { targetCtx.beginPath(); targetCtx.arc(p.u, p.v, 5, 0, Math.PI * 2); targetCtx.fill(); });
}

function drawDirection(u, v, w, color = '#107C10', targetCtx = ctx, ox = null, oy = null, oz = null) {
    if (!targetCtx) return; // Safety check
    let coords;
    if (ox !== null && oy !== null && oz !== null) {
        coords = { tail: { x: ox, y: oy, z: oz }, head: { x: ox + u, y: oy + v, z: oz + w } };
    } else {
        coords = getDrawingCoords(u, v, w);
    }
    if (!coords) return;
    let p1 = project(coords.tail.x, coords.tail.y, coords.tail.z);
    let p2 = project(coords.head.x, coords.head.y, coords.head.z);
    targetCtx.beginPath(); targetCtx.arc(p1.u, p1.v, 6, 0, Math.PI * 2); targetCtx.fillStyle = '#d9534f'; targetCtx.fill(); targetCtx.strokeStyle = '#fff'; targetCtx.lineWidth = 2; targetCtx.stroke();
    targetCtx.beginPath(); targetCtx.moveTo(p1.u, p1.v); targetCtx.lineTo(p2.u, p2.v);
    targetCtx.strokeStyle = color; targetCtx.lineWidth = 4; targetCtx.stroke();
    let angle = Math.atan2(p2.v - p1.v, p2.u - p1.u);
    targetCtx.beginPath(); targetCtx.moveTo(p2.u, p2.v);
    targetCtx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
    targetCtx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
    targetCtx.fillStyle = color; targetCtx.fill();
}

// ==================== UI FUNCTIONS ====================
function toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', menu.classList.contains('active') ? 'true' : 'false');
}

function showPage(page) {
    currentPage = page;
    document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
    document.getElementById(`page-${page}`).classList.remove('hidden');
    document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => a.classList.remove('active'));
    document.getElementById(`nav-${page}`)?.classList.add('active');

    if (page === 'learning') {
        showCurriculumMap();
    } else if (page === 'practice') {
        renderPracticeModes();
    } else if (page === 'progress') {
        updateProgressUI();
    }
    window.scrollTo(0, 0);
}

function switchModule(module, btn) {
    currentModule = module;
    document.querySelectorAll('.module-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('planes-controls').style.display = module === 'planes' ? 'block' : 'none';
    document.getElementById('directions-controls').style.display = module === 'directions' ? 'block' : 'none';
    document.getElementById('info-overlay').style.display = module === 'planes' ? 'block' : 'none';
    if (module === 'planes') switchPlaneTab(0); else switchDirTab(0);
}

function switchPlaneTab(idx) {
    currentPlaneTab = idx;
    document.querySelectorAll('#planes-controls .tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('#planes-controls .tab-content').forEach((c, i) => c.classList.toggle('active', i === idx));
    if (idx === 0) setTimeout(drawPlaneFromInputs, 100);
    refreshCanvas();
}

function switchDirTab(idx) {
    currentDirTab = idx;
    document.querySelectorAll('#directions-controls .tab').forEach((t, i) => t.classList.toggle('active', i === idx));
    document.querySelectorAll('#directions-controls .tab-content').forEach((c, i) => c.classList.toggle('active', i === idx));
    if (idx === 0) setTimeout(drawDirectionFromInputs, 100);
    else if (idx === 1) { intMode = 'tail'; intTail = null; intHead = null; updateInteractiveStatus(); drawAxesAndCube(); }
    refreshCanvas();
}

function updateRotation() {
    viewRotY = parseInt(document.getElementById(currentPage === 'practice' ? 'rotY-practice' : 'rotY').value);
    refreshCanvas();
}

function resetRotation() {
    document.getElementById(currentPage === 'practice' ? 'rotY-practice' : 'rotY').value = 0;
    viewRotY = 0;
    refreshCanvas();
}

function refreshCanvas() {
    if (currentPage === 'practice' && practiceMode) {
        renderPracticeQuestion();
    } else {
        drawAxesAndCube();
        if (currentModule === 'planes') {
            if (currentPlaneTab === 0) {
                // Parse with fraction/decimal support
                let hInput = document.getElementById('h-input').value || '0';
                let kInput = document.getElementById('k-input').value || '0';
                let lInput = document.getElementById('l-input').value || '0';

                let h = parseFractionOrDecimal(hInput) || 0;
                let k = parseFractionOrDecimal(kInput) || 0;
                let l = parseFractionOrDecimal(lInput) || 0;

                // Auto-divide by smallest non-zero index for large integer inputs
                const rdc = autoReduceIndices(h, k, l);
                drawPlane(rdc.h, rdc.k, rdc.l);
            }
        } else {
            if (currentDirTab === 0) {
                let uInput = document.getElementById('dir-u').value || '0';
                let vInput = document.getElementById('dir-v').value || '0';
                let wInput = document.getElementById('dir-w').value || '0';
                let u = parseFractionOrDecimal(uInput) || 0;
                let v = parseFractionOrDecimal(vInput) || 0;
                let w = parseFractionOrDecimal(wInput) || 0;

                let oxInput = document.getElementById('origin-x').value;
                let oyInput = document.getElementById('origin-y').value;
                let ozInput = document.getElementById('origin-z').value;
                let ox = oxInput ? (parseFractionOrDecimal(oxInput) || null) : null;
                let oy = oyInput ? (parseFractionOrDecimal(oyInput) || null) : null;
                let oz = ozInput ? (parseFractionOrDecimal(ozInput) || null) : null;

                if (ox !== null || oy !== null || oz !== null) {
                    drawDirection(u, v, w, '#107C10', ctx, ox || 0, oy || 0, oz || 0);
                } else {
                    drawDirection(u, v, w);
                }
            } else if (currentDirTab === 1) {
                // Interactive overlay for Compute tab
                if (intTail) { let p = project(intTail.x, intTail.y, intTail.z); ctx.beginPath(); ctx.arc(p.u, p.v, 8, 0, Math.PI * 2); ctx.fillStyle = '#d9534f'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
                if (intHead) { let p = project(intHead.x, intHead.y, intHead.z); ctx.beginPath(); ctx.arc(p.u, p.v, 8, 0, Math.PI * 2); ctx.fillStyle = '#5cb85c'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
                if (intTail && intHead) {
                    // Green arrow from tail T → head H exactly
                    drawArrow3D(intTail.x, intTail.y, intTail.z, intHead.x, intHead.y, intHead.z, '#107C10');
                }
            }
        }
    }
}

// ==================== LEARNING FUNCTIONS ====================
// Auto-divide indices by the smallest non-zero absolute value
// e.g. (4,5,3) -> smallest=3 -> (4/3, 5/3, 1)
function autoReduceIndices(h, k, l) {
    const vals = [h, k, l].filter(v => isFinite(v) && v !== 0);
    if (vals.length === 0) return { h, k, l, divisor: null };
    const minAbs = Math.min(...vals.map(Math.abs));
    // Only auto-divide when all non-zero values are integers AND minAbs > 1
    const allInts = vals.every(v => Math.abs(v - Math.round(v)) < 1e-9);
    if (!allInts || minAbs <= 1) return { h, k, l, divisor: null };
    return { h: h / minAbs, k: k / minAbs, l: l / minAbs, divisor: minAbs };
}

function drawPlaneFromInputs() {
    // Parse input - supports fractions, decimals, and integers
    const hInput = document.getElementById('h-input').value || '0';
    const kInput = document.getElementById('k-input').value || '0';
    const lInput = document.getElementById('l-input').value || '0';

    let h = parseFractionOrDecimal(hInput);
    let k = parseFractionOrDecimal(kInput);
    let l = parseFractionOrDecimal(lInput);

    let expl = document.getElementById('plane-explanation-0');

    // Check for parse errors
    if (isNaN(h) || isNaN(k) || isNaN(l)) {
        expl.innerHTML = `<span style="color:var(--error)">Error: Invalid input. Please enter integers, decimals (0.5), fractions (1/2), or ∞</span>`;
        expl.classList.add('visible');
        return;
    }

    // Check if all are zero
    if (h === 0 && k === 0 && l === 0) {
        expl.innerHTML = `<span style="color:var(--error)">Error: Miller indices cannot all be zero.</span>`;
        expl.classList.add('visible');
        return;
    }

    // Auto-divide by the smallest non-zero absolute value (for big integer inputs)
    const reduced = autoReduceIndices(h, k, l);
    const hD = reduced.h, kD = reduced.k, lD = reduced.l;
    const divisor = reduced.divisor;

    drawPlane(hD, kD, lD);
    const fmt = (v) => isNaN(v) ? "" : toFracStr(v);
    let p = hD === 0 ? '∞' : toFracStr(1 / hD);
    let q = kD === 0 ? '∞' : toFracStr(1 / kD);
    let r = lD === 0 ? '∞' : toFracStr(1 / lD);

    let divStep = '';
    if (divisor !== null) {
        const hR = fmt(h), kR = fmt(k), lR = fmt(l);
        const hDf = fmt(hD), kDf = fmt(kD), lDf = fmt(lD);
        divStep = `
                    <div class="step" data-step="2">Smallest non-zero index = <strong>${divisor}</strong> → divide all by ${divisor}</div>
                    <div class="step" data-step="3">After division: (${hR}/${divisor}, ${kR}/${divisor}, ${lR}/${divisor}) = <strong>(${hDf}, ${kDf}, ${lDf})</strong></div>
                `;
    }

    expl.innerHTML = `
                <div class="step" data-step="1">Input: (${hInput}, ${kInput}, ${lInput})</div>
                ${divStep}
                <div class="step" data-step="${divisor !== null ? 4 : 2}">Effective (hkl): ${formatHKL(fmt(hD), fmt(kD), fmt(lD))}</div>
                <div class="step" data-step="${divisor !== null ? 5 : 3}">Intercepts 1/h, 1/k, 1/l → <strong>${p}, ${q}, ${r}</strong> (0 index = ∞, parallel axis)</div>
                <div class="step" data-step="${divisor !== null ? 6 : 4}">${formatHKL(fmt(hD), fmt(kD), fmt(lD))} plane drawn in unit cell</div>
            `;
    expl.classList.add('visible');
}

function computePlaneFromIntercepts() {
    let pStr = document.getElementById('p-input').value.trim();
    let qStr = document.getElementById('q-input').value.trim();
    let rStr = document.getElementById('r-input').value.trim();
    if (pStr === '') pStr = 'inf';
    if (qStr === '') qStr = 'inf';
    if (rStr === '') rStr = '1';

    let p = parseFrac(pStr);
    let q = parseFrac(qStr);
    let r = parseFrac(rStr);
    let u = !isFinite(p) ? 0 : 1 / p, v = !isFinite(q) ? 0 : 1 / q, w = !isFinite(r) ? 0 : 1 / r;
    let bestM = 1; for (let M = 1; M <= 100; M++) if (Math.abs(M * u - Math.round(M * u)) < 1e-4 && Math.abs(M * v - Math.round(M * v)) < 1e-4 && Math.abs(M * w - Math.round(M * w)) < 1e-4) { bestM = M; break; }
    let H = Math.round(bestM * u), K = Math.round(bestM * v), L = Math.round(bestM * w);
    let g = gcd(H, gcd(K, L)); let h = H / g, k = K / g, l = L / g;
    drawPlane(h, k, l);
    document.getElementById('plane-explanation-1').innerHTML = `<div class="step" data-step="1">Intercepts (p,q,r) = ${pStr}, ${qStr}, ${rStr}</div><div class="step" data-step="2">Reciprocals = (${toFracStr(u)}, ${toFracStr(v)}, ${toFracStr(w)})</div><div class="step" data-step="3">Multiply by ${bestM} to clear fractions → (${H}, ${K}, ${L})</div><div class="step" data-step="4">Divide by GCD(${g}) → smallest integers</div><div class="step" data-step="5">Miller indices (hkl) = <strong>${formatHKL(h, k, l)}</strong></div>`;
    document.getElementById('plane-explanation-1').classList.add('visible');
}

function drawDirectionFromInputs() {
    let uInput = document.getElementById('dir-u').value || '0';
    let vInput = document.getElementById('dir-v').value || '0';
    let wInput = document.getElementById('dir-w').value || '0';
    let u = parseFractionOrDecimal(uInput) || 0;
    let v = parseFractionOrDecimal(vInput) || 0;
    let w = parseFractionOrDecimal(wInput) || 0;

    let oxInput = document.getElementById('origin-x').value;
    let oyInput = document.getElementById('origin-y').value;
    let ozInput = document.getElementById('origin-z').value;
    let ox = oxInput ? (parseFractionOrDecimal(oxInput) || null) : null;
    let oy = oyInput ? (parseFractionOrDecimal(oyInput) || null) : null;
    let oz = ozInput ? (parseFractionOrDecimal(ozInput) || null) : null;

    let expl = document.getElementById('dir-explanation-0');
    if (u === 0 && v === 0 && w === 0) { expl.innerHTML = `<span style="color:var(--error)">Indices cannot all be zero.</span>`; expl.classList.add('visible'); return; }
    if (isNaN(u) || isNaN(v) || isNaN(w)) { expl.innerHTML = `<span style="color:var(--error)">Invalid vector indices.</span>`; expl.classList.add('visible'); return; }

    let coords;
    if (ox !== null || oy !== null || oz !== null) {
        ox = ox || 0; oy = oy || 0; oz = oz || 0;
        coords = { tail: { x: ox, y: oy, z: oz }, head: { x: ox + u, y: oy + v, z: oz + w } };
        drawAxesAndCube();
        drawDirection(u, v, w, '#107C10', ctx, ox, oy, oz);
    } else {
        coords = getDrawingCoords(u, v, w);
        drawAxesAndCube();
        drawDirection(u, v, w);
    }
    if (!coords) return;

    const fmt = (val) => isNaN(val) ? "" : toFracStr(val);
    expl.innerHTML = `<div class="step" data-step="1">Given [uvw] = ${formatUVW(fmt(u), fmt(v), fmt(w))}</div><div class="step" data-step="2">Vector <strong>d</strong> = ${fmt(u)}<strong>x̂</strong> + ${fmt(v)}<strong>ŷ</strong> + ${fmt(w)}<strong>ẑ</strong></div><div class="step" data-step="3">Custom origin parsed and applied if provided.</div><div class="step" data-step="4">Tail at (${fmt(coords.tail.x)}, ${fmt(coords.tail.y)}, ${fmt(coords.tail.z)}), Head at (${fmt(coords.head.x)}, ${fmt(coords.head.y)}, ${fmt(coords.head.z)})</div><div class="step" data-step="5">The arrow represents the ${formatUVW(fmt(u), fmt(v), fmt(w))} direction</div>`;
    expl.classList.add('visible');
}

function computeDirectionFromPoints() {
    const tailXElem = document.getElementById('tail-x');
    const tailYElem = document.getElementById('tail-y');
    const tailZElem = document.getElementById('tail-z');
    const headXElem = document.getElementById('head-x');
    const headYElem = document.getElementById('head-y');
    const headZElem = document.getElementById('head-z');

    if (!tailXElem || !tailYElem || !tailZElem || !headXElem || !headYElem || !headZElem) {
        console.error("Direction input elements not found");
        return;
    }

    const tailX = tailXElem.value || "0";
    const tailY = tailYElem.value || "0";
    const tailZ = tailZElem.value || "0";
    const headX = headXElem.value || "1";
    const headY = headYElem.value || "1";
    const headZ = headZElem.value || "0";


    const tail = { x: tailX, y: tailY, z: tailZ };
    const head = { x: headX, y: headY, z: headZ };

    const outBox = document.getElementById('dir-explanation-1');
    if (!outBox) { console.error("Output box not found"); return; }

    const x1 = parseFracOrDec(tailX);
    const y1 = parseFracOrDec(tailY);
    const z1 = parseFracOrDec(tailZ);
    const x2 = parseFracOrDec(headX);
    const y2 = parseFracOrDec(headY);
    const z2 = parseFracOrDec(headZ);

    // ---- Direction = Head − Tail ----
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dz = z2 - z1;

    // Compute result from the Δ vector
    const result = directionFromPoints(tail, head);

    if (!result) {
        outBox.innerHTML = `<div style="color:var(--error);font-weight:600;">Error: Tail and head are the same point — no direction defined.</div>`;
        outBox.classList.add('visible');
        drawAxesAndCube();
        // still show the dots
        let pT = project(x1, y1, z1);
        ctx.beginPath(); ctx.arc(pT.u, pT.v, 8, 0, Math.PI * 2); ctx.fillStyle = '#d9534f'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
        return;
    }

    // ---- Step-by-step on Δ components ----
    const fx = decToFrac(dx);
    const fy = decToFrac(dy);
    const fz = decToFrac(dz);

    const fracStrX = fx.den === 1 ? `${fx.num}` : `${fx.num}/${fx.den}`;
    const fracStrY = fy.den === 1 ? `${fy.num}` : `${fy.num}/${fy.den}`;
    const fracStrZ = fz.den === 1 ? `${fz.num}` : `${fz.num}/${fz.den}`;

    let commonDen = Math.abs(fx.den);
    commonDen = lcmInt(commonDen, Math.abs(fy.den));
    commonDen = lcmInt(commonDen, Math.abs(fz.den));
    if (!isFinite(commonDen) || commonDen === 0) commonDen = 1;

    let u = Math.round(fx.num * (commonDen / fx.den));
    let v = Math.round(fy.num * (commonDen / fy.den));
    let w = Math.round(fz.num * (commonDen / fz.den));

    const gAll = gcdInt(gcdInt(Math.abs(u), Math.abs(v)), Math.abs(w)) || 1;
    const uR = Math.round(u / gAll);
    const vR = Math.round(v / gAll);
    const wR = Math.round(w / gAll);

    // ---- Draw ----
    drawAxesAndCube();

    // Red dot exactly at tail T
    let rTail = project(x1, y1, z1);
    ctx.beginPath(); ctx.arc(rTail.u, rTail.v, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#d9534f'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Green dot exactly at head H
    let rHead = project(x2, y2, z2);
    ctx.beginPath(); ctx.arc(rHead.u, rHead.v, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#107C10'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

    // Green arrow from tail T → head H (exactly)
    drawArrow3D(x1, y1, z1, x2, y2, z2, '#107C10');

    // ---- Explanation ----
    const lcmNote = (fx.den === 1 && fy.den === 1 && fz.den === 1)
        ? `All components are already integers — no LCM needed.`
        : `LCM of denominators (${Math.abs(fx.den)}, ${Math.abs(fy.den)}, ${Math.abs(fz.den)}) = <strong>${commonDen}</strong>`;

    const gcdNote = gAll > 1
        ? `GCD(|${u}|, |${v}|, |${w}|) = <strong>${gAll}</strong> → divide all by ${gAll}`
        : `GCD(|${u}|, |${v}|, |${w}|) = 1 — already fully reduced`;

    outBox.innerHTML = `
        <div class="step" data-step="1">
            <strong>Tail (from origin):</strong> (${toFracStr(x1)}, ${toFracStr(y1)}, ${toFracStr(z1)})<br>
            <strong>Head (from origin):</strong> (${toFracStr(x2)}, ${toFracStr(y2)}, ${toFracStr(z2)})
        </div>
        <div class="step" data-step="2">
            <strong>Δ = Head − Tail</strong><br>
            Δx = ${toFracStr(x2)} − ${toFracStr(x1)} = <strong>${toFracStr(dx)}</strong><br>
            Δy = ${toFracStr(y2)} − ${toFracStr(y1)} = <strong>${toFracStr(dy)}</strong><br>
            Δz = ${toFracStr(z2)} − ${toFracStr(z1)} = <strong>${toFracStr(dz)}</strong>
        </div>
        <div class="step" data-step="3">
            <strong>Express Δ as fractions</strong><br>
            Δx = ${fracStrX}, &nbsp; Δy = ${fracStrY}, &nbsp; Δz = ${fracStrZ}
        </div>
        <div class="step" data-step="4">
            <strong>Clear denominators (multiply by LCM)</strong><br>
            ${lcmNote}<br>
            × ${commonDen} → &nbsp; u = ${u}, &nbsp; v = ${v}, &nbsp; w = ${w}
        </div>
        <div class="step" data-step="5">
            <strong>Reduce by GCD</strong><br>
            ${gcdNote}<br>
            Result: u = ${uR}, &nbsp; v = ${vR}, &nbsp; w = ${wR}
        </div>
        <div class="step" data-step="6">
            <strong>Direction index: ${formatUVW(result.u, result.v, result.w)}</strong>
        </div>
    `;
    outBox.classList.add('visible');
}


function setDirMode(mode) {
    intMode = mode; intTail = null; intHead = null;
    updateInteractiveStatus();
    refreshCanvas();
}

function resetComputeDir() {
    intMode = 'tail'; intTail = null; intHead = null;
    document.getElementById('tail-x').value = '0';
    document.getElementById('tail-y').value = '0';
    document.getElementById('tail-z').value = '0';
    document.getElementById('head-x').value = '';
    document.getElementById('head-y').value = '';
    document.getElementById('head-z').value = '';
    const expl = document.getElementById('dir-explanation-1');
    if (expl) { expl.innerHTML = ''; expl.classList.remove('visible'); }
    updateInteractiveStatus();
    drawAxesAndCube();
}

function onComputeInputChange() {
    let tx = parseFracOrDec(document.getElementById('tail-x').value);
    let ty = parseFracOrDec(document.getElementById('tail-y').value);
    let tz = parseFracOrDec(document.getElementById('tail-z').value);
    let hx = parseFracOrDec(document.getElementById('head-x').value);
    let hy = parseFracOrDec(document.getElementById('head-y').value);
    let hz = parseFracOrDec(document.getElementById('head-z').value);

    // Apply axis-snapping to typed values
    if (!isNaN(tx) && !isNaN(ty) && !isNaN(tz)) {
        const st = snapToAxis(tx, ty, tz);
        tx = st.x; ty = st.y; tz = st.z;
        // Write snapped values back to inputs so the user sees the clean coords
        document.getElementById('tail-x').value = toFracStr(tx);
        document.getElementById('tail-y').value = toFracStr(ty);
        document.getElementById('tail-z').value = toFracStr(tz);
        intTail = { x: tx, y: ty, z: tz };
    }
    if (!isNaN(hx) && !isNaN(hy) && !isNaN(hz)) {
        const sh = snapToAxis(hx, hy, hz);
        hx = sh.x; hy = sh.y; hz = sh.z;
        document.getElementById('head-x').value = toFracStr(hx);
        document.getElementById('head-y').value = toFracStr(hy);
        document.getElementById('head-z').value = toFracStr(hz);
        intHead = { x: hx, y: hy, z: hz }; intMode = null;
    }
    updateInteractiveStatus();
    drawAxesAndCube();
    if (intTail) { let p = project(intTail.x, intTail.y, intTail.z); ctx.beginPath(); ctx.arc(p.u, p.v, 8, 0, Math.PI * 2); ctx.fillStyle = '#d9534f'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
    if (intHead) { let p = project(intHead.x, intHead.y, intHead.z); ctx.beginPath(); ctx.arc(p.u, p.v, 8, 0, Math.PI * 2); ctx.fillStyle = '#107C10'; ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); }
    if (intHead) {
        // Green arrow from tail T → head H exactly
        const tx = intTail ? intTail.x : 0, ty = intTail ? intTail.y : 0, tz = intTail ? intTail.z : 0;
        drawArrow3D(tx, ty, tz, intHead.x, intHead.y, intHead.z, '#107C10');
    }
}

function updateInteractiveStatus() {
    document.getElementById('status-tail').className = 'status-dot' + (intMode === 'tail' ? ' active' : intTail ? ' active' : '');
    document.getElementById('status-head').className = 'status-dot' + (intMode === 'head' ? ' pending' : intHead ? ' active' : '');
}

// Touch support for interactive canvas mode
function getCanvasPoint(e, cvs) {
    const rect = cvs.getBoundingClientRect();
    const scaleX = W / rect.width;
    const scaleY = H / rect.height;
    let clientX, clientY;
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

// ---- Axis-snapping helper ----
// Tolerance in fractional coordinates (ε = 0.02 of the unit cell)
const SNAP_EPS = 0.02;
function snapToAxis(x, y, z) {
    const ax = Math.abs(x), ay = Math.abs(y), az = Math.abs(z);
    const nearX = ax < SNAP_EPS, nearY = ay < SNAP_EPS, nearZ = az < SNAP_EPS;
    // All three near-zero → origin
    if (nearX && nearY && nearZ) return { x: 0, y: 0, z: 0 };
    // Two components near-zero → snap those to 0, keep dominant axis
    if (nearY && nearZ) return { x, y: 0, z: 0 };  // x-axis
    if (nearX && nearZ) return { x: 0, y, z: 0 };  // y-axis
    if (nearX && nearY) return { x: 0, y: 0, z };  // z-axis
    // Only one component near-zero → snap that to 0
    return { x: nearX ? 0 : x, y: nearY ? 0 : y, z: nearZ ? 0 : z };
}

function handleCanvasInteraction(e, cvs) {
    if (currentPage !== 'learning' || currentModule !== 'directions' || currentDirTab !== 1 || !intMode) return;
    e.preventDefault();
    const pt = getCanvasPoint(e, cvs);
    const mx = pt.x, my = pt.y;
    let closest = null, minDist = 25;
    const fractions = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1];
    for (let x of fractions) {
        for (let y of fractions) {
            for (let z of fractions) {
                let p = project(x, y, z);
                let dist = Math.hypot(p.u - mx, p.v - my);
                if (dist < minDist) { minDist = dist; closest = { x: x, y: y, z: z }; }
            }
        }
    }
    if (closest) {
        // Apply axis-snap to the snapped grid point
        const snapped = snapToAxis(closest.x, closest.y, closest.z);
        if (intMode === 'tail') {
            intTail = snapped; intMode = 'head';
            document.getElementById('tail-x').value = toFracStr(snapped.x);
            document.getElementById('tail-y').value = toFracStr(snapped.y);
            document.getElementById('tail-z').value = toFracStr(snapped.z);
        } else {
            intHead = snapped; intMode = null;
            document.getElementById('head-x').value = toFracStr(snapped.x);
            document.getElementById('head-y').value = toFracStr(snapped.y);
            document.getElementById('head-z').value = toFracStr(snapped.z);
            computeDirectionFromPoints();
        }
        updateInteractiveStatus(); refreshCanvas();
    }
}

if (canvas) {
    canvas.addEventListener('mousedown', function (e) {
        handleCanvasInteraction(e, canvas);
    });

    canvas.addEventListener('touchstart', function (e) {
        handleCanvasInteraction(e, canvas);
    }, { passive: false });
}


function identifyDirection() {
    if (!intTail || !intHead) return;

    const result = directionFromPoints(intTail, intHead);
    const expl = document.getElementById('dir-explanation-2');
    expl.style.display = 'block';

    if (!result) {
        expl.innerHTML = `<div style="color: var(--error); font-weight: 600;">Error: Points are identical or invalid.</div>`;
        return;
    }

    const dx = intHead.x - intTail.x;
    const dy = intHead.y - intTail.y;
    const dz = intHead.z - intTail.z;

    expl.innerHTML = `
                <div class="step" data-step="1">Tail selected at (${intTail.x}, ${intTail.y}, ${intTail.z})</div>
                <div class="step" data-step="2">Head selected at (${intHead.x}, ${intHead.y}, ${intHead.z})</div>
                <div class="step" data-step="3">Vector components: Δx=${toFracStr(dx)}, Δy=${toFracStr(dy)}, Δz=${toFracStr(dz)}</div>
                <div class="step" data-step="4">Convert to fractions and clear denominators via LCM</div>
                <div class="step" data-step="5">Direction identified as <strong>${formatUVW(result.u, result.v, result.w)}</strong></div>
            `;
}

// ==================== PRACTICE ARENA ====================

function getModeAccuracy(modeId) {
    // Calculate accuracy from progress data
    return 0; // Placeholder
}

function analyzeWeaknesses() {
    const weaknesses = [];
    const categories = ['x-face', 'y-face', 'z-face', 'face diagonal', 'body diagonal', 'low-index', 'medium-index', 'Edge', 'Face diagonal', 'Body diagonal'];

    categories.forEach(cat => {
        const planeData = progress.planes.byType[cat];
        const dirData = progress.directions.byType[cat];

        if (planeData && planeData.total > 0) {
            const accuracy = planeData.correct / planeData.total;
            if (accuracy < 0.7 && planeData.total >= 3) {
                weaknesses.push({
                    id: cat.includes('face') || cat.includes('index') ? 'planes-advanced' : 'planes-basic',
                    topic: cat,
                    accuracy: Math.round(accuracy * 100),
                    type: 'plane'
                });
            }
        }

        if (dirData && dirData.total > 0) {
            const accuracy = dirData.correct / dirData.total;
            if (accuracy < 0.7 && dirData.total >= 3) {
                weaknesses.push({
                    id: cat === 'Edge' ? 'directions-basic' : 'directions-advanced',
                    topic: cat,
                    accuracy: Math.round(accuracy * 100),
                    type: 'direction'
                });
            }
        }
    });

    return weaknesses.sort((a, b) => a.accuracy - b.accuracy);
}


function updateSessionStats() {
    const total = sessionCorrect + sessionWrong;
    const acc = total > 0 ? Math.round((sessionCorrect / total) * 100) : null;
    document.getElementById('sess-q-num').textContent = (practiceQuestionIdx + 1) + '/' + Math.max(practiceQuestions.length, 1);
    document.getElementById('sess-correct').textContent = sessionCorrect;
    document.getElementById('sess-wrong').textContent = sessionWrong;
    document.getElementById('sess-accuracy').textContent = acc !== null ? acc + '%' : '—';
    const pct = practiceQuestions.length > 0 ? Math.round(((practiceQuestionIdx) / practiceQuestions.length) * 100) : 0;
    document.getElementById('sess-progress-fill').style.width = pct + '%';
}

function renderPracticeModes() {
    const weaknesses = analyzeWeaknesses();
    const recommendId = weaknesses.length > 0 ? weaknesses[0].id : 'planes-basic';
    const modes = [
        {
            id: 'planes-basic',
            icon: '&#9635;',
            title: 'Planes — Basic',
            desc: 'Practice identifying low-index Miller planes: (100), (110), (111) families and their equivalents.',
            color: 'linear-gradient(135deg,#0078D7,#005fa3)',
            bg: 'rgba(0,120,215,0.08)',
            pills: ['Low-index', 'h+k+l ≤ 2', '~20 Qs'],
            level: 'Beginner'
        },
        {
            id: 'planes-advanced',
            icon: '&#9636;',
            title: 'Planes — Advanced',
            desc: 'Tackle high-index planes (210), (221), (311) — harder intercepts, bar notation required.',
            color: 'linear-gradient(135deg,#663399,#4b1f7a)',
            bg: 'rgba(102,51,153,0.08)',
            pills: ['High-index', 'Mixed signs', 'Varied Qs'],
            level: 'Advanced'
        },
        {
            id: 'planes-mixed',
            icon: '&#128201;',
            title: 'Planes — Mixed',
            desc: 'Random mix of all difficulty levels. Great for comprehensive exam preparation.',
            color: 'linear-gradient(135deg,#107C10,#0a5a0a)',
            bg: 'rgba(16,124,16,0.08)',
            pills: ['All levels', 'Randomized', 'Unlimited'],
            level: 'Mixed'
        },
        {
            id: 'directions-basic',
            icon: '&#10148;',
            title: 'Directions — Basic',
            desc: 'Practice edge [100], face diagonal [110], and body diagonal [111] directions.',
            color: 'linear-gradient(135deg,#e67e00,#c26800)',
            bg: 'rgba(230,126,0,0.08)',
            pills: ['Low-index', 'Positive only', '~15 Qs'],
            level: 'Beginner'
        },
        {
            id: 'directions-advanced',
            icon: '&#10149;',
            title: 'Directions — Advanced',
            desc: 'High-index directions with negative components: [2У1], [1У2], [У11У2] and more.',
            color: 'linear-gradient(135deg,#a4262c,#7d1d22)',
            bg: 'rgba(164,38,44,0.08)',
            pills: ['High-index', 'Negatives', '~60+ Qs'],
            level: 'Advanced'
        },
        {
            id: 'directions-mixed',
            icon: '&#127919;',
            title: 'Directions — Mixed',
            desc: 'Full random mix of directions including all signs and indices. Best for mastery.',
            color: 'linear-gradient(135deg,#0ea5e9,#0369a1)',
            bg: 'rgba(14,165,233,0.08)',
            pills: ['All levels', '+/− indices', 'Unlimited'],
            level: 'Mixed'
        }
    ];
    const container = document.getElementById('practice-modes');
    container.innerHTML = modes.map(m => `
                <div class="practice-mode-card" onclick="startPractice('${m.id}')">
                    ${m.id === recommendId ? '<div class="recommended-tag">★ Recommended</div>' : ''}
                    <div class="practice-card-header" style="background:${m.bg}">
                        <div class="practice-card-icon" style="background:${m.color};color:#fff">${m.icon}</div>
                        <div class="practice-card-title">${m.title}</div>
                        <div class="practice-card-desc">${m.desc}</div>
                    </div>
                    <div class="practice-card-body">
                        <div class="practice-card-meta">
                            ${m.pills.map(p => `<span class="practice-card-pill">${p}</span>`).join('')}
                        </div>
                    </div>
                </div>
            `).join('');
}

function generatePlaneQuestions(modeId) {
    let qs = [];
    if (modeId === 'planes-basic') {
        qs = planeExamples.filter(e => Math.abs(e.h) + Math.abs(e.k) + Math.abs(e.l) <= 2).slice(0, 20);
    } else if (modeId === 'planes-advanced') {
        qs = planeExamples.filter(e => Math.abs(e.h) + Math.abs(e.k) + Math.abs(e.l) > 2);
    } else {
        qs = [...planeExamples].sort(() => Math.random() - 0.5);
    }
    return qs.map(e => ({ ...e, type: Math.random() > 0.5 ? 'guess-hkl' : 'guess-intercepts' }));
}

function generateDirQuestions(modeId) {
    let qs = [];
    if (modeId === 'directions-basic') {
        qs = dirExamples.filter(e => Math.abs(e.u) + Math.abs(e.v) + Math.abs(e.w) <= 2).slice(0, 30);
    } else if (modeId === 'directions-advanced') {
        qs = dirExamples.filter(e => Math.abs(e.u) + Math.abs(e.v) + Math.abs(e.w) > 2);
    } else {
        qs = [...dirExamples].sort(() => Math.random() - 0.5);
    }
    return qs.map(e => ({ ...e, type: 'guess-uvw' }));
}

function getHint(q, isPlane) {
    if (isPlane) {
        if (q.h === 0) return "This plane is parallel to the x-axis (h=0)";
        if (q.k === 0) return "This plane is parallel to the y-axis (k=0)";
        if (q.l === 0) return "This plane is parallel to the z-axis (l=0)";
        if (Math.abs(q.h) === Math.abs(q.k) && Math.abs(q.k) === Math.abs(q.l)) return "All indices have equal magnitude";
        return "Look at where the plane intersects each axis";
    } else {
        if (q.u === 0) return "No component along x-axis";
        if (q.v === 0) return "No component along y-axis";
        if (q.w === 0) return "No component along z-axis";
        return "Follow the arrow from tail to head";
    }
}

// ==================== PROGRESS PAGE ====================

function getTip(topic, type) {
    const tips = {
        'x-face': 'Remember: h=0 means the plane is parallel to the x-axis. The plane never crosses the x-axis.',
        'y-face': 'Remember: k=0 means the plane is parallel to the y-axis. Look for intersection on other axes.',
        'z-face': 'Remember: l=0 means the plane is parallel to the z-axis. The plane is horizontal.',
        'face diagonal': 'These planes cut two axes equally. The indices often have two equal non-zero values.',
        'body diagonal': 'These planes cut all three axes. Look for intercepts where h=k=l.',
        'low-index': 'Take reciprocals of intercepts, then clear fractions by finding LCM.',
        'medium-index': 'For complex planes, carefully track the intercept points on each axis.',
        'Edge': 'Directions along axes have two zero indices [100], [010], or [001].',
        'Face diagonal': 'Face diagonals have one zero index and two equal non-zero indices.',
        'Body diagonal': 'Body diagonals have all three indices equal [111] or variants.',
        'Oblique face': 'Watch for negative indices indicating direction opposite to axis.',
        'Low-index': 'Find the smallest integers proportional to the vector components.',
        'Medium-index': 'Divide vector components by their GCD to get simplest indices.'
    };
    return tips[topic] || 'Focus on understanding the geometric relationship between indices and the crystal structure.';
}

function startPracticeFromWeakness(modeId) {
    showPage('practice');
    startPractice(modeId);
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        progress = {
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
                questionsCompleted: 0
            }
        };
        saveProgress();
        updateProgressUI();
        showToast('Progress reset successfully');
    }
}

// ==================== UTILITY ====================
function showToast(msg) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').textContent = msg;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 3000);
}

// ==================== GAMIFICATION SYSTEM ====================
const achievements = {
    'first_correct': { name: 'First Success', desc: 'Answer your first question correctly', icon: '🎯', points: 10 },
    'streak_5': { name: '5-Day Streak', desc: 'Practice 5 consecutive days', icon: '🔥', points: 50 },
    'perfect_10': { name: 'Perfect 10', desc: 'Get 10 correct answers in a row', icon: '⭐', points: 100 },
    'master_planes': { name: 'Plane Master', desc: 'Achieve 80% accuracy on planes', icon: '🏆', points: 75 },
    'master_directions': { name: 'Direction Master', desc: 'Achieve 80% accuracy on directions', icon: '🧭', points: 75 },
    'crystal_master': { name: 'Crystal Master', desc: 'Master both planes and directions', icon: '💎', points: 200 },
    '50_practice': { name: 'Practice Warrior', desc: 'Complete 50 practice questions', icon: '⚔️', points: 60 },
    '100_practice': { name: 'Practice Champion', desc: 'Complete 100 practice questions', icon: '👑', points: 100 },
    'speed_demon': { name: 'Speed Demon', desc: 'Answer 5 questions correctly in under 1 minute', icon: '⚡', points: 80 }
};

function updateGameMetrics() {
    if (!progress.gameStats) {
        progress.gameStats = {
            totalPoints: 0,
            level: 1,
            experience: 0,
            streak: 0,
            lastPracticeDate: null,
            achievements: {},
            questionsCompleted: 0
        };
    }

    const planesAcc = progress.planes.total > 0 ? (progress.planes.correct / progress.planes.total) * 100 : 0;
    const dirsAcc = progress.directions.total > 0 ? (progress.directions.correct / progress.directions.total) * 100 : 0;
    const totalQuestions = progress.planes.total + progress.directions.total;

    progress.gameStats.questionsCompleted = totalQuestions;

    // Calculate level
    progress.gameStats.level = Math.floor(progress.gameStats.experience / 500) + 1;

    // Check achievements
    if (progress.planes.correct + progress.directions.correct === 1) unlockAchievement('first_correct');
    if (totalQuestions >= 50) unlockAchievement('50_practice');
    if (totalQuestions >= 100) unlockAchievement('100_practice');
    if (planesAcc >= 80 && progress.planes.total >= 10) unlockAchievement('master_planes');
    if (dirsAcc >= 80 && progress.directions.total >= 10) unlockAchievement('master_directions');
    if (planesAcc >= 80 && dirsAcc >= 80 && progress.planes.total >= 10 && progress.directions.total >= 10) unlockAchievement('crystal_master');

    const today = new Date().toDateString();
    if (progress.gameStats.lastPracticeDate !== today) {
        if (progress.gameStats.lastPracticeDate !== null) {
            const lastDate = new Date(progress.gameStats.lastPracticeDate);
            const diff = (new Date() - lastDate) / (1000 * 60 * 60 * 24);
            if (diff <= 2) progress.gameStats.streak += 1;
            else progress.gameStats.streak = 1;
        } else {
            progress.gameStats.streak = 1;
        }
        progress.gameStats.lastPracticeDate = today;
        if (progress.gameStats.streak >= 5) unlockAchievement('streak_5');
    }

    saveProgress();
}

function unlockAchievement(achievementId) {
    if (!progress.gameStats.achievements[achievementId]) {
        progress.gameStats.achievements[achievementId] = { unlockedAt: new Date().toISOString() };
        if (achievements[achievementId]) {
            progress.gameStats.totalPoints += achievements[achievementId].points;
            progress.gameStats.experience += achievements[achievementId].points;
            showToast(`🎉 Achievement Unlocked! "${achievements[achievementId].name}" +${achievements[achievementId].points}pts`);
        }
        saveProgress();
    }
}

function awardPoints(amount, reason) {
    progress.gameStats.totalPoints += amount;
    progress.gameStats.experience += amount;
    updateGameMetrics();
}

// ==================== LEARNING HUB ENGINE ====================

// ---- Canvas context helper (shared projection) ----
let lessonCtx = null;
const LW = 520, LH = 420, La = 150, Lox = LW / 2 - 10, Loy = LH / 2 + 65;
const LangleX = Math.PI / 6;
const LvecX = { u: -Math.cos(LangleX) * La * 0.8, v: Math.sin(LangleX) * La * 0.8 };
const LvecY = { u: La, v: 0 };
const LvecZ = { u: 0, v: -La };

function lProject(x, y, z) {
    return {
        u: Lox + x * LvecX.u + y * LvecY.u + z * LvecZ.u,
        v: Loy + x * LvecX.v + y * LvecY.v + z * LvecZ.v
    };
}

function lDrawCube(c) {
    if (!c) return;
    c.clearRect(0, 0, LW, LH);
    const pts = {
        v000: lProject(0, 0, 0), v100: lProject(1, 0, 0), v010: lProject(0, 1, 0), v110: lProject(1, 1, 0),
        v001: lProject(0, 0, 1), v101: lProject(1, 0, 1), v011: lProject(0, 1, 1), v111: lProject(1, 1, 1)
    };
    c.lineWidth = 1; c.strokeStyle = '#C8C6C4'; c.setLineDash([4, 4]);
    c.beginPath();
    c.moveTo(pts.v010.u, pts.v010.v); c.lineTo(pts.v000.u, pts.v000.v);
    c.moveTo(pts.v001.u, pts.v001.v); c.lineTo(pts.v000.u, pts.v000.v);
    c.moveTo(pts.v100.u, pts.v100.v); c.lineTo(pts.v000.u, pts.v000.v);
    c.stroke(); c.setLineDash([]);
    c.lineWidth = 2; c.strokeStyle = '#323130';
    c.beginPath();
    c.moveTo(pts.v100.u, pts.v100.v); c.lineTo(pts.v110.u, pts.v110.v); c.lineTo(pts.v010.u, pts.v010.v);
    c.moveTo(pts.v001.u, pts.v001.v); c.lineTo(pts.v101.u, pts.v101.v); c.lineTo(pts.v111.u, pts.v111.v);
    c.lineTo(pts.v011.u, pts.v011.v); c.closePath();
    c.moveTo(pts.v100.u, pts.v100.v); c.lineTo(pts.v101.u, pts.v101.v);
    c.moveTo(pts.v110.u, pts.v110.v); c.lineTo(pts.v111.u, pts.v111.v);
    c.moveTo(pts.v010.u, pts.v010.v); c.lineTo(pts.v011.u, pts.v011.v);
    c.stroke();
    lArrow3D(c, 0, 0, 0, 1.4, 0, 0, '#005A9E', 'x');
    lArrow3D(c, 0, 0, 0, 0, 1.4, 0, '#107C10', 'y');
    lArrow3D(c, 0, 0, 0, 0, 0, 1.4, '#A4262C', 'z');
}

function lArrow3D(c, x1, y1, z1, x2, y2, z2, color, label) {
    if (!c) return;
    const p1 = lProject(x1, y1, z1), p2 = lProject(x2, y2, z2);
    c.beginPath(); c.moveTo(p1.u, p1.v); c.lineTo(p2.u, p2.v);
    c.strokeStyle = color; c.lineWidth = 3; c.stroke();
    const ang = Math.atan2(p2.v - p1.v, p2.u - p1.u);
    c.beginPath(); c.moveTo(p2.u, p2.v);
    c.lineTo(p2.u - 11 * Math.cos(ang - Math.PI / 6), p2.v - 11 * Math.sin(ang - Math.PI / 6));
    c.lineTo(p2.u - 11 * Math.cos(ang + Math.PI / 6), p2.v - 11 * Math.sin(ang + Math.PI / 6));
    c.fillStyle = color; c.fill();
    if (label) { c.font = 'bold 15px Inter,Arial'; c.fillStyle = '#201f1e'; c.fillText(label, p2.u + 12, p2.v + 4); }
}

function lDot(c, x, y, z, color, r) {
    if (!c) return;
    const p = lProject(x, y, z);
    c.beginPath(); c.arc(p.u, p.v, r || 6, 0, Math.PI * 2); c.fillStyle = color; c.fill();
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.stroke();
}

function lDashedLine(c, x1, y1, z1, x2, y2, z2, color) {
    if (!c) return;
    const p1 = lProject(x1, y1, z1), p2 = lProject(x2, y2, z2);
    c.save(); c.setLineDash([7, 5]); c.beginPath();
    c.moveTo(p1.u, p1.v); c.lineTo(p2.u, p2.v);
    c.strokeStyle = color; c.lineWidth = 2.5; c.stroke(); c.restore();
}

function lLabel(c, x, y, z, text, color, offsetX, offsetY) {
    if (!c) return;
    const p = lProject(x, y, z);
    c.font = 'bold 14px Inter,Arial'; c.fillStyle = color || '#323130';
    c.fillText(text, p.u + (offsetX || 14), p.v + (offsetY || 4));
}

function lFilledPlane(c, points3D, fillColor, strokeColor) {
    if (!c || points3D.length < 3) return;
    const pts2 = points3D.map(p => lProject(p[0], p[1], p[2]));
    const cx = pts2.reduce((s, p) => s + p.u, 0) / pts2.length;
    const cy = pts2.reduce((s, p) => s + p.v, 0) / pts2.length;
    pts2.sort((a, b) => Math.atan2(a.v - cy, a.u - cx) - Math.atan2(b.v - cy, b.u - cx));
    c.beginPath(); c.moveTo(pts2[0].u, pts2[0].v);
    for (let i = 1; i < pts2.length; i++) c.lineTo(pts2[i].u, pts2[i].v);
    c.closePath(); c.fillStyle = fillColor || 'rgba(99,102,241,0.35)'; c.fill();
    c.strokeStyle = strokeColor || '#6366f1'; c.lineWidth = 2.5; c.stroke();
}

// ---- Hub State ----
var hubState = {
    track: 'directions',
    lesson: 1,
    step: 0,
    steps: [],
    completedLessons: { directions: [], planes: [] }
};

function loadHubProgress() {
    try {
        var s = localStorage.getItem('hub_progress');
        if (s) hubState.completedLessons = JSON.parse(s);
    } catch (e) { }
}

function saveHubProgress() {
    try { localStorage.setItem('hub_progress', JSON.stringify(hubState.completedLessons)); } catch (e) { }
}

// ---- Lesson Definitions ----
var HUB_LESSONS = {
    directions: [
        { level: 1, title: 'What is a Direction?', tag: 'Concept', icon: '🧭', desc: 'Understand the meaning of [uvw] notation.' },
        { level: 2, title: 'Indices → Drawing', tag: 'Guided', icon: '✏️', desc: 'Given [uvw], animate the vector step by step.' },
        { level: 3, title: 'Drawing → Indices', tag: 'Interactive', icon: '🔍', desc: 'Read tail & head coordinates, compute [uvw].' },
        { level: 4, title: 'Negative Indices', tag: 'Advanced', icon: '⊖', desc: 'Bar notation, shifting origin, negative components.' },
        { level: 5, title: 'Expert Sandbox', tag: 'Sandbox', icon: '🔬', desc: 'Use all tools freely — draw, compute, explore.' }
    ],
    planes: [
        { level: 1, title: 'What is a Plane?', tag: 'Concept', icon: '🏔️', desc: 'Understand Miller indices (hkl) and crystal planes.' },
        { level: 2, title: 'Indices → Drawing', tag: 'Guided', icon: '✏️', desc: 'Given (hkl), find intercepts and draw the plane.' },
        { level: 3, title: 'Drawing → Indices', tag: 'Interactive', icon: '🔍', desc: 'Read intercept points, take reciprocals, get (hkl).' },
        { level: 4, title: 'Zero Index Planes', tag: 'Advanced', icon: '∥', desc: 'When h, k, or l = 0: parallel to that axis.' },
        { level: 5, title: 'Expert Sandbox', tag: 'Sandbox', icon: '🔬', desc: 'Use all tools freely — draw, compute, explore.' }
    ]
};

function lessonIsUnlocked(track, level) {
    if (level === 1) return true;
    return hubState.completedLessons[track].includes(level - 1);
}

function lessonIsComplete(track, level) {
    return hubState.completedLessons[track].includes(level);
}

// ---- Render Curriculum Map ----
function renderCurriculumMap() {
    loadHubProgress();
    var totalComplete = hubState.completedLessons.directions.length + hubState.completedLessons.planes.length;
    var pct = Math.round(totalComplete / 10 * 100);
    var pf = document.getElementById('hub-progress-fill');
    var pl = document.getElementById('hub-progress-label');
    if (pf) pf.style.width = pct + '%';
    if (pl) pl.textContent = totalComplete + ' of 10 lessons complete';

    ['directions', 'planes'].forEach(function (track) {
        var col = document.getElementById(track === 'directions' ? 'dir-lessons-col' : 'plane-lessons-col');
        if (!col) return;
        col.innerHTML = HUB_LESSONS[track].map(function (l) {
            var unlocked = lessonIsUnlocked(track, l.level);
            var complete = lessonIsComplete(track, l.level);
            var cls = 'hub-lesson-card' + (complete ? ' completed' : unlocked ? '' : ' locked');
            var fn = unlocked ? 'openLesson(\'' + track + '\',' + l.level + ')' : '';
            return '<div class="' + cls + '" ' + (unlocked ? 'onclick="' + fn + '" role="button" tabindex="0"' : '') + '>' +
                '<div class="hlc-level">' + (complete ? '✓' : unlocked ? l.level : '🔒') + '</div>' +
                '<div class="hlc-body">' +
                '<div class="hlc-tag">' + l.tag + '</div>' +
                '<div class="hlc-title">' + l.icon + ' ' + l.title + '</div>' +
                '<div class="hlc-desc">' + l.desc + '</div>' +
                '</div>' +
                (complete ? '<div class="hlc-check">✓</div>' : '') +
                (unlocked && !complete ? '<div class="hlc-arrow">→</div>' : '') +
                '</div>';
        }).join('');
    });
}

function showCurriculumMap() {
    document.getElementById('hub-curriculum').classList.remove('hidden');
    document.getElementById('hub-lesson-view').classList.add('hidden');
    document.getElementById('hub-sandbox').classList.add('hidden');
    renderCurriculumMap();
}

// ---- Open Lesson ----
function openLesson(track, level) {
    if (!lessonIsUnlocked(track, level)) return;
    if (level === 5) { openSandbox(track); return; }
    hubState.track = track;
    hubState.lesson = level;
    hubState.step = 0;
    hubState.steps = buildLessonSteps(track, level);

    document.getElementById('hub-curriculum').classList.add('hidden');
    document.getElementById('hub-sandbox').classList.add('hidden');
    document.getElementById('hub-lesson-view').classList.remove('hidden');

    var info = HUB_LESSONS[track].find(function (l) { return l.level === level; });
    document.getElementById('hub-breadcrumb').textContent = 'Hub → ' + (track === 'directions' ? 'Directions' : 'Planes') + ' → ' + info.title;
    document.getElementById('lesson-tag').textContent = info.tag;
    document.getElementById('lesson-title').textContent = info.title;

    var lessonCanvasEl = document.getElementById('lessonCanvas');
    lessonCtx = lessonCanvasEl ? lessonCanvasEl.getContext('2d') : null;

    renderLessonStep();
    window.scrollTo(0, 0);
}

function openSandbox(track) {
    document.getElementById('hub-curriculum').classList.add('hidden');
    document.getElementById('hub-lesson-view').classList.add('hidden');
    document.getElementById('hub-sandbox').classList.remove('hidden');
    var label = track === 'directions' ? 'Directions' : 'Planes';
    document.getElementById('sandbox-breadcrumb').textContent = 'Hub → ' + label + ' → Expert Sandbox';
    currentModule = track === 'directions' ? 'directions' : 'planes';
    var btn = document.querySelector('.module-btn' + (track === 'planes' ? '' : ':last-child'));
    switchModule(currentModule, null);
    setTimeout(function () { refreshCanvas(); }, 150);
    window.scrollTo(0, 0);
}

// ---- Render Current Step ----
function renderLessonStep() {
    var steps = hubState.steps;
    var idx = hubState.step;
    // Stepper
    var stepper = document.getElementById('lesson-stepper');
    if (stepper) {
        stepper.innerHTML = steps.map(function (s, i) {
            var cls = i < idx ? 'ls-done' : i === idx ? 'ls-active' : 'ls-idle';
            return '<div class="ls-dot ' + cls + '" onclick="jumpToStep(' + i + ')" title="Step ' + (i + 1) + '"><span>' + (i < idx ? '✓' : (i + 1)) + '</span></div>';
        }).join('<div class="ls-line"></div>');
    }
    // Content
    var s = steps[idx];
    var expEl = document.getElementById('lesson-explanation');
    if (expEl) expEl.innerHTML = s.html;
    // Canvas draw
    if (s.draw && lessonCtx) s.draw(lessonCtx);
    // Buttons
    var prev = document.getElementById('btn-prev-step');
    var next = document.getElementById('btn-next-step');
    var complete = document.getElementById('btn-complete-lesson');
    var inter = document.getElementById('lesson-interactive');
    if (prev) prev.style.display = idx > 0 ? '' : 'none';
    var isLast = idx === steps.length - 1;
    if (next) next.style.display = isLast ? 'none' : '';
    if (complete) complete.classList.toggle('hidden', !isLast);
    // Interactive
    if (inter) {
        if (s.interactive) { inter.style.display = ''; inter.innerHTML = s.interactive; }
        else { inter.style.display = 'none'; inter.innerHTML = ''; }
    }
}

function lessonNextStep() {
    if (hubState.step < hubState.steps.length - 1) { hubState.step++; renderLessonStep(); }
}
function lessonPrevStep() {
    if (hubState.step > 0) { hubState.step--; renderLessonStep(); }
}
function jumpToStep(i) { hubState.step = i; renderLessonStep(); }

function completeLesson() {
    var track = hubState.track, level = hubState.lesson;
    if (!hubState.completedLessons[track].includes(level)) {
        hubState.completedLessons[track].push(level);
        saveHubProgress();
        addXP(25);
        showToast('🎉 Lesson complete! +25 XP — Level ' + (level + 1) + ' unlocked!');
    }
    showCurriculumMap();
}

// ==================== LESSON STEP BUILDERS ====================

function buildLessonSteps(track, level) {
    if (track === 'directions') {
        if (level === 1) return dirLesson1();
        if (level === 2) return dirLesson2();
        if (level === 3) return dirLesson3();
        if (level === 4) return dirLesson4();
    } else {
        if (level === 1) return planeLesson1();
        if (level === 2) return planeLesson2();
        if (level === 3) return planeLesson3();
        if (level === 4) return planeLesson4();
    }
    return [{ html: '<p>Lesson not found.</p>', draw: lDrawCube }];
}

// ---- DIR Lesson 1: What is a Direction? ----
function dirLesson1() {
    return [
        {
            html: '<h3>What is a Crystallographic Direction?</h3><p>In a crystal, a <strong>direction</strong> is simply a vector — like an arrow pointing from one lattice point to another.</p><p>We write it as <code>[u v w]</code> where <strong>u, v, w</strong> are the components along the <span style="color:#005A9E"><strong>x</strong></span>, <span style="color:#107C10"><strong>y</strong></span>, <span style="color:#A4262C"><strong>z</strong></span> axes.</p><div class="lex-rule">Key rule: reduce to the <strong>smallest integers</strong> with no common factor.</div>',
            draw: function (c) {
                lDrawCube(c);
                // Highlight axes
                c.font = 'bold 16px Inter,Arial'; c.fillStyle = '#005A9E'; c.fillText('x →', lProject(1.5, 0, 0).u - 10, lProject(1.5, 0, 0).v + 4);
                c.fillStyle = '#107C10'; c.fillText('y →', lProject(0, 1.5, 0).u + 5, lProject(0, 1.5, 0).v + 4);
                c.fillStyle = '#A4262C'; c.fillText('z ↑', lProject(0, 0, 1.5).u + 5, lProject(0, 0, 1.5).v + 4);
            }
        },
        {
            html: '<h3>The Origin & Tail</h3><p>Every direction has a <strong>tail</strong> (start) and a <strong>head</strong> (end). By default, we place the <strong>tail at the origin (0,0,0)</strong>.</p><p>The <span style="color:#d9534f"><strong>red dot</strong></span> marks the tail.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8);
                lLabel(c, 0, 0, 0, '(0,0,0) — Tail', '#d9534f', 10, -12);
            }
        },
        {
            html: '<h3>Direction [1 1 0]</h3><p>For direction <code>[1 1 0]</code>:</p><ul><li>Move <strong>1 unit along x</strong></li><li>Move <strong>1 unit along y</strong></li><li>Move <strong>0 units along z</strong></li></ul><p>Head = (1, 1, 0). Draw arrow from tail to head.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, '#005A9E');
                lLabel(c, 0.5, 0, 0, 'Δx=1', '#005A9E', 0, -14);
                lDashedLine(c, 1, 0, 0, 1, 1, 0, '#107C10');
                lLabel(c, 1, 0.5, 0, 'Δy=1', '#107C10', 10, 0);
                lDot(c, 1, 1, 0, '#107C10', 7);
                lArrow3D(c, 0, 0, 0, 1, 1, 0, '#6366f1', '[110]');
            }
        },
        {
            html: '<h3>Direction [1 0 1]</h3><p>Now try <code>[1 0 1]</code>:</p><ul><li>Move <strong>1 unit along x</strong></li><li>Move <strong>0 units along y</strong></li><li>Move <strong>1 unit along z</strong></li></ul><p>Head = (1, 0, 1). Notice: when a component is 0, we skip that axis entirely.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, '#005A9E');
                lLabel(c, 0.5, 0, 0, 'Δx=1', '#005A9E', 0, -14);
                lDashedLine(c, 1, 0, 0, 1, 0, 1, '#A4262C');
                lLabel(c, 1, 0, 0.5, 'Δz=1', '#A4262C', 10, 0);
                lDot(c, 1, 0, 1, '#107C10', 7);
                lArrow3D(c, 0, 0, 0, 1, 0, 1, '#6366f1', '[101]');
            }
        },
        {
            html: '<h3>Notation Rules</h3><p>Two important rules for direction indices:</p><ol><li><strong>Always reduce</strong> to smallest integers: [2 2 0] → [1 1 0]</li><li><strong>Negative components</strong>: use a bar over the digit — written as <code>[1̄ 0 0]</code> or <code>[-1 0 0]</code> in text.</li></ol><div class="lex-rule">The direction <em>family</em> ⟨uvw⟩ includes all symmetrically equivalent directions.</div>',
            draw: function (c) {
                lDrawCube(c);
                lArrow3D(c, 0, 0, 0, 1, 1, 0, '#6366f1', '[110]');
                lArrow3D(c, 1, 1, 0, 0, 0, 0, '#e67e22', '[1̄1̄0]');
                lDot(c, 0, 0, 0, '#d9534f', 6); lDot(c, 1, 1, 0, '#107C10', 6);
            }
        }
    ];
}

// ---- DIR Lesson 2: Indices → Drawing ----
function dirLesson2() {
    return [
        // Step 1: Introduction
        {
            html: '<h3>\uD83D\uDCCF Drawing a Direction from Indices</h3><p>Given direction <code>[u v w]</code>, follow this <strong>4-step process</strong>:</p><ol><li>Place the <span style="color:#d9534f"><strong>tail at origin (0,0,0)</strong></span></li><li>Move u along x, then v along y, then w along z</li><li>If any coordinate &gt; 1: <strong>divide all by the maximum</strong></li><li>Draw arrow from tail to head and label it</li></ol><div class="lex-rule">\u26A0\uFE0F All points must stay <strong>inside the unit cell</strong> (0 to 1 on every axis). If v=2, the head would be at y=2 — outside the cell!</div>',
            draw: function (c) { lDrawCube(c); }
        },
        // Step 2: Example [111] — tail
        {
            html: '<h3>Example: [1 1 1]</h3><p>Indices: <code>u=1, v=1, w=1</code>. All equal 1, max=1 — <strong>no scaling needed.</strong></p><p>Place the <span style="color:#d9534f"><strong>tail at origin (0,0,0)</strong></span>.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 9);
                lLabel(c, 0, 0, 0, 'Tail (0,0,0)', '#d9534f', 10, -14);
            }
        },
        // Step 3: move x
        {
            html: '<h3>Move u=1 along x</h3><p>From (0,0,0) travel <strong>1 unit along x</strong>. Mark temporary point at (1,0,0).</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, '#005A9E');
                lDot(c, 1, 0, 0, '#005A9E', 6);
                lLabel(c, 0.5, 0, 0, 'u=1', '#005A9E', 0, -16);
                lLabel(c, 1, 0, 0, '(1,0,0)', '#005A9E', 8, 14);
            }
        },
        // Step 4: move y
        {
            html: '<h3>Move v=1 along y</h3><p>From (1,0,0) travel <strong>1 unit along y</strong>. Reach intermediate point (1,1,0).</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, 'rgba(0,90,158,0.4)');
                lDashedLine(c, 1, 0, 0, 1, 1, 0, '#107C10');
                lDot(c, 1, 0, 0, '#005A9E', 5);
                lDot(c, 1, 1, 0, '#107C10', 6);
                lLabel(c, 1, 0.5, 0, 'v=1', '#107C10', 10, 0);
                lLabel(c, 1, 1, 0, '(1,1,0)', '#107C10', 8, 14);
            }
        },
        // Step 5: move z
        {
            html: '<h3>Move w=1 along z</h3><p>From (1,1,0) travel <strong>1 unit along z</strong>. Reach <span style="color:#5cb85c"><strong>head (1,1,1)</strong></span>. All coords in [0,1] — inside cell! \u2713</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, 'rgba(0,90,158,0.3)');
                lDashedLine(c, 1, 0, 0, 1, 1, 0, 'rgba(16,124,16,0.3)');
                lDashedLine(c, 1, 1, 0, 1, 1, 1, '#A4262C');
                lDot(c, 1, 1, 0, '#107C10', 5);
                lDot(c, 1, 1, 1, '#5cb85c', 9);
                lLabel(c, 1, 1, 0.5, 'w=1', '#A4262C', 10, 0);
                lLabel(c, 1, 1, 1, 'Head (1,1,1)', '#5cb85c', 8, -14);
            }
        },
        // Step 6: final arrow
        {
            html: '<h3>Draw the Arrow [111]</h3><p>Connect tail (0,0,0) to head (1,1,1) with a labeled arrow. This is the <strong>body diagonal</strong> of the cube!</p><div class="lex-rule">Arrowhead always points to the <strong>head</strong> (end point).</div>',
            draw: function (c) {
                lDrawCube(c);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, 'rgba(0,90,158,0.2)');
                lDashedLine(c, 1, 0, 0, 1, 1, 0, 'rgba(16,124,16,0.2)');
                lDashedLine(c, 1, 1, 0, 1, 1, 1, 'rgba(164,38,44,0.2)');
                lDot(c, 0, 0, 0, '#d9534f', 7);
                lDot(c, 1, 1, 1, '#5cb85c', 7);
                lArrow3D(c, 0, 0, 0, 1, 1, 1, '#6366f1', '[111]');
            }
        },
        // Step 7: scaling rule — [112]
        {
            html: '<h3>\u26A0\uFE0F Scaling Rule: [1 1 2]</h3><p>For <code>[1 1 2]</code>: u=1, v=1, w=2. Raw head = (1,1,2) — <strong>outside the cell (w=2 &gt; 1)!</strong></p><p><strong>Fix:</strong> divide all by max(1,1,2)=2:</p><ul><li>1/2 = 0.5, 1/2 = 0.5, 2/2 = 1</li></ul><p><strong>Scaled head: (0.5, 0.5, 1) — inside cell \u2713</strong></p><div class="lex-rule">Scale rule: divide all by <strong>max(|u|, |v|, |w|)</strong> so the largest component = 1.</div>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8);
                lDashedLine(c, 0, 0, 0, 0.5, 0, 0, '#005A9E');
                lLabel(c, 0.25, 0, 0, 'u/2', '#005A9E', 0, -14);
                lDashedLine(c, 0.5, 0, 0, 0.5, 0.5, 0, '#107C10');
                lLabel(c, 0.5, 0.25, 0, 'v/2', '#107C10', 8, 0);
                lDashedLine(c, 0.5, 0.5, 0, 0.5, 0.5, 1, '#A4262C');
                lLabel(c, 0.5, 0.5, 0.5, 'w/2=1', '#A4262C', 8, 0);
                lDot(c, 0.5, 0.5, 1, '#5cb85c', 8);
                lLabel(c, 0.5, 0.5, 1, 'Head', '#5cb85c', 8, -14);
                lArrow3D(c, 0, 0, 0, 0.5, 0.5, 1, '#6366f1', '[112]');
            }
        },
        // Step 8: summary
        {
            html: '<h3>\u2705 Summary: Drawing Rules</h3><table class="lex-table"><tr><th>Rule</th><th>Action</th></tr><tr><td>Tail</td><td>Always start at (0,0,0)</td></tr><tr><td>Components</td><td>u\u2192x, v\u2192y, w\u2192z (step by step)</td></tr><tr><td>Scaling</td><td>If max component &gt; 1, divide all by max</td></tr><tr><td>Arrow</td><td>Draw Tail\u2192Head, label as [uvw]</td></tr><tr><td>Negatives</td><td>Shift tail so head stays in cell</td></tr></table><div class="lex-rule">Practice: [101], [011], [110] — all three face diagonals shown!</div>',
            draw: function (c) {
                lDrawCube(c);
                lArrow3D(c, 0, 0, 0, 1, 0, 1, '#6366f1', '[101]');
                lArrow3D(c, 0, 0, 0, 0, 1, 1, '#e67e22', '[011]');
                lArrow3D(c, 0, 0, 0, 1, 1, 0, '#10b981', '[110]');
                lDot(c, 0, 0, 0, '#d9534f', 6);
            }
        }
    ];
}

// ---- DIR Lesson 3: Drawing → Indices ----
function dirLesson3() {
    return [
        {
            html: '<h3>Reading a Drawn Direction</h3><p>When you see an arrow drawn on a cube, follow these steps to find <code>[u v w]</code>:</p><ol><li>Read tail coordinates (x₁,y₁,z₁)</li><li>Read head coordinates (x₂,y₂,z₂)</li><li>Compute Δ = head − tail</li><li>Reduce to smallest integers</li></ol>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7); lDot(c, 1, 0, 1, '#5cb85c', 7);
                lArrow3D(c, 0, 0, 0, 1, 0, 1, '#6366f1', '?');
            }
        },
        {
            html: '<h3>Example: Arrow shown on cube</h3><p>Given: Tail at <strong>(0,0,0)</strong>, Head at <strong>(1,0,1)</strong>.</p><p>Δx = 1−0 = <strong>1</strong><br>Δy = 0−0 = <strong>0</strong><br>Δz = 1−0 = <strong>1</strong></p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 8); lLabel(c, 0, 0, 0, 'Tail (0,0,0)', '#d9534f', 10, -14);
                lDot(c, 1, 0, 1, '#5cb85c', 8); lLabel(c, 1, 0, 1, 'Head (1,0,1)', '#107C10', 10, 14);
                lDashedLine(c, 0, 0, 0, 1, 0, 0, '#005A9E');
                lDashedLine(c, 1, 0, 0, 1, 0, 1, '#A4262C');
            }
        },
        {
            html: '<h3>Compute Δ values</h3><p>We compute the difference head − tail for each component:</p><table class="lex-table"><tr><th>Axis</th><th>Head</th><th>Tail</th><th>Δ</th></tr><tr><td>x</td><td>1</td><td>0</td><td><strong>1</strong></td></tr><tr><td>y</td><td>0</td><td>0</td><td><strong>0</strong></td></tr><tr><td>z</td><td>1</td><td>0</td><td><strong>1</strong></td></tr></table>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7); lDot(c, 1, 0, 1, '#5cb85c', 7);
                lArrow3D(c, 0, 0, 0, 1, 0, 1, '#6366f1', '[101]');
                lDashedLine(c, 0, 0, 0, 1, 0, 0, '#005A9E');
                lLabel(c, 0.5, 0, 0, 'Δx=1', '#005A9E', 0, -16);
                lDashedLine(c, 1, 0, 0, 1, 0, 1, '#A4262C');
                lLabel(c, 1, 0, 0.5, 'Δz=1', '#A4262C', 10, 0);
            }
        },
        {
            html: '<h3>Reduce & Write Direction</h3><p>Δ = (1, 0, 1). These are already the smallest integers (GCD=1).</p><p style="font-size:24px;text-align:center;font-weight:700;color:#6366f1;margin:16px 0">[1 0 1]</p><div class="lex-rule">If GCD > 1, divide all by GCD. E.g., (2,2,0) ÷ 2 = [1 1 0]</div>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7); lDot(c, 1, 0, 1, '#5cb85c', 7);
                lArrow3D(c, 0, 0, 0, 1, 0, 1, '#6366f1', '[101]');
            }
        },
        {
            html: '<h3>Try it yourself!</h3><p>Use the <strong>Compute tab</strong> in the Expert Sandbox to practice. Click two points on the cube — tail then head — and the app computes [uvw] automatically.</p><p>Practice examples to try:</p><ul><li>Tail (0,0,0) → Head (1,1,1) = <strong>[111]</strong></li><li>Tail (0,0,0) → Head (0,1,0) = <strong>[010]</strong></li><li>Tail (0,1,0) → Head (1,0,0) = <strong>[1,-1,0]</strong></li></ul>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 0, 0, 0, '#d9534f', 7); lDot(c, 1, 1, 1, '#5cb85c', 7);
                lArrow3D(c, 0, 0, 0, 1, 1, 1, '#6366f1', '[111]');
            }
        }
    ];
}

// ---- DIR Lesson 4: Negative Indices ----
function dirLesson4() {
    return [
        {
            html: '<h3>Negative Direction Components</h3><p>A direction can point in the <strong>negative</strong> direction along any axis. We write negative indices with a <strong>bar</strong> over the digit:</p><p style="font-size:20px;text-align:center;margin:12px 0"><code>[1̄ 1 0]</code> means u=−1, v=1, w=0</p>',
            draw: function (c) {
                lDrawCube(c);
                lArrow3D(c, 1, 0, 0, 0, 1, 0, '#e67e22', '[1̄10]');
                lDot(c, 1, 0, 0, '#d9534f', 7); lLabel(c, 1, 0, 0, 'Tail (1,0,0)', '#d9534f', 8, 14);
                lDot(c, 0, 1, 0, '#5cb85c', 7); lLabel(c, 0, 1, 0, 'Head (0,1,0)', '#107C10', 8, -14);
            }
        },
        {
            html: '<h3>The Origin-Shift Trick</h3><p>To draw <code>[1̄ 0 0]</code>, the head would be at (−1,0,0) — outside the unit cell!</p><p><strong>Solution:</strong> Shift the tail to (1,0,0). Now the head lands at (0,0,0) — inside the cell.</p><div class="lex-rule">Shift origin so both tail and head stay inside the unit cell.</div>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 1, 0, 0, '#d9534f', 8); lLabel(c, 1, 0, 0, 'Tail (1,0,0)', '#d9534f', 8, 14);
                lDot(c, 0, 0, 0, '#5cb85c', 8); lLabel(c, 0, 0, 0, 'Head (0,0,0)', '#107C10', 8, -14);
                lArrow3D(c, 1, 0, 0, 0, 0, 0, '#e67e22', '[1̄00]');
            }
        },
        {
            html: '<h3>Example: [1̄ 1 1]</h3><p>For <code>[1̄ 1 1]</code> — u=−1, v=1, w=1:</p><ul><li>Shift tail to (1,0,0) so head = (0,1,1)</li></ul><p>Both points inside the cell. ✓</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 1, 0, 0, '#d9534f', 7); lLabel(c, 1, 0, 0, 'Tail', '#d9534f', 8, 14);
                lDot(c, 0, 1, 1, '#5cb85c', 7); lLabel(c, 0, 1, 1, 'Head', '#107C10', 8, -10);
                lDashedLine(c, 1, 0, 0, 0, 0, 0, 'rgba(150,0,0,0.4)');
                lDashedLine(c, 0, 0, 0, 0, 1, 0, 'rgba(0,150,0,0.4)');
                lDashedLine(c, 0, 1, 0, 0, 1, 1, 'rgba(200,0,0,0.4)');
                lArrow3D(c, 1, 0, 0, 0, 1, 1, '#6366f1', '[1̄11]');
            }
        },
        {
            html: '<h3>Common Negative Directions</h3><p>Compare these equivalent opposite directions:</p><ul><li><code>[100]</code> vs <code>[1̄00]</code> — same line, opposite sense</li><li><code>[110]</code> vs <code>[1̄1̄0]</code></li><li><code>[111]</code> vs <code>[1̄1̄1̄]</code></li></ul><div class="lex-rule"><code>[uvw]</code> and <code>[ūv̄w̄]</code> are antiparallel — they point in exactly opposite directions.</div>',
            draw: function (c) {
                lDrawCube(c);
                lArrow3D(c, 0, 0, 0, 1, 0, 0, '#6366f1', '[100]');
                lArrow3D(c, 1, 0, 0, 0, 0, 0, '#e67e22', '[1̄00]');
            }
        }
    ];
}

// ---- PLANE Lesson 1: What is a Plane? ----
function planeLesson1() {
    return [
        {
            html: '<h3>What is a Crystallographic Plane?</h3><p>A <strong>crystallographic plane</strong> is a flat plane cutting through the crystal lattice. We describe it by its <strong>Miller indices (h k l)</strong>.</p><p>Key idea: Miller indices are the <strong>reciprocals of the intercepts</strong> the plane makes with the x, y, z axes.</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1');
                lDot(c, 1, 0, 0, '#005A9E', 6); lDot(c, 0, 1, 0, '#107C10', 6); lDot(c, 0, 0, 1, '#A4262C', 6);
            }
        },
        {
            html: '<h3>The (100) Plane</h3><p>The <code>(1 0 0)</code> plane has:</p><ul><li>x-intercept = 1/h = 1/1 = <strong>1</strong></li><li>y-intercept = 1/k = 1/0 = <strong>∞</strong> (parallel to y)</li><li>z-intercept = 1/l = 1/0 = <strong>∞</strong> (parallel to z)</li></ul><p>This plane cuts x at 1 and is vertical (parallel to y and z).</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 'rgba(0,90,158,0.3)', '#005A9E');
                lDot(c, 1, 0, 0, '#005A9E', 7);
                lLabel(c, 1, 0, 0, 'x=1', '#005A9E', 8, 14);
            }
        },
        {
            html: '<h3>Intercepts → Indices</h3><p>To find Miller indices from intercepts:</p><ol><li>Find intercepts on x, y, z (in units of a,b,c)</li><li>Take reciprocals</li><li>Multiply by LCM to clear fractions</li><li>Reduce to smallest integers</li></ol>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1');
                lDot(c, 1, 0, 0, '#005A9E', 6); lLabel(c, 1, 0, 0, 'p=1→h=1', '#005A9E', 8, 14);
                lDot(c, 0, 1, 0, '#107C10', 6); lLabel(c, 0, 1, 0, 'q=1→k=1', '#107C10', 8, -8);
                lDot(c, 0, 0, 1, '#A4262C', 6); lLabel(c, 0, 0, 1, 'r=1→l=1', '#A4262C', 8, 0);
            }
        },
        {
            html: '<h3>Directions vs. Planes</h3><table class="lex-table"><tr><th>Property</th><th>Direction [uvw]</th><th>Plane (hkl)</th></tr><tr><td>Notation</td><td>Square [ ]</td><td>Round ( )</td></tr><tr><td>Indices represent</td><td>Vector components</td><td>Reciprocal intercepts</td></tr><tr><td>Family notation</td><td>⟨uvw⟩</td><td>{hkl}</td></tr><tr><td>Reduction</td><td>Smallest integers</td><td>No common factor</td></tr></table>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.25)', '#6366f1');
                lArrow3D(c, 0, 0, 0, 0.5, 0.5, 0.5, '#e67e22', '[111]');
            }
        }
    ];
}

// ---- PLANE Lesson 2: Indices → Drawing ----
function planeLesson2() {
    return [
        {
            html: '<h3>Step 1: Start with (1 1 1)</h3><p>We want to draw plane <code>(h k l) = (1 1 1)</code>. Begin with an empty cube.</p>',
            draw: function (c) { lDrawCube(c); }
        },
        {
            html: '<h3>Step 2: Compute x-intercept</h3><p>x-intercept = 1/h = 1/1 = <strong>1</strong>. Mark the point on the x-axis at x=1.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 1, 0, 0, '#005A9E', 8);
                lLabel(c, 1, 0, 0, '1/h = 1', '#005A9E', 8, 14);
            }
        },
        {
            html: '<h3>Step 3: Compute y-intercept</h3><p>y-intercept = 1/k = 1/1 = <strong>1</strong>. Mark the point on the y-axis at y=1.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 1, 0, 0, '#005A9E', 7); lLabel(c, 1, 0, 0, '1/h=1', '#005A9E', 8, 14);
                lDot(c, 0, 1, 0, '#107C10', 8); lLabel(c, 0, 1, 0, '1/k=1', '#107C10', 8, -12);
            }
        },
        {
            html: '<h3>Step 4: Compute z-intercept</h3><p>z-intercept = 1/l = 1/1 = <strong>1</strong>. Mark the point on the z-axis at z=1.</p>',
            draw: function (c) {
                lDrawCube(c);
                lDot(c, 1, 0, 0, '#005A9E', 7); lLabel(c, 1, 0, 0, '1/h=1', '#005A9E', 8, 14);
                lDot(c, 0, 1, 0, '#107C10', 7); lLabel(c, 0, 1, 0, '1/k=1', '#107C10', 8, -12);
                lDot(c, 0, 0, 1, '#A4262C', 8); lLabel(c, 0, 0, 1, '1/l=1', '#A4262C', 8, -2);
            }
        },
        {
            html: '<h3>Step 5: Connect the intercepts</h3><p>Draw the plane through all three intercept points: (1,0,0), (0,1,0), (0,0,1). This is the classic (111) plane — the octahedral plane.</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1');
                lDot(c, 1, 0, 0, '#005A9E', 7); lDot(c, 0, 1, 0, '#107C10', 7); lDot(c, 0, 0, 1, '#A4262C', 7);
                c.font = 'bold 16px Inter,Arial'; c.fillStyle = '#6366f1';
                const mid = lProject(0.33, 0.33, 0.33);
                c.fillText('(111)', mid.u + 5, mid.v - 5);
            }
        }
    ];
}

// ---- PLANE Lesson 3: Drawing → Indices ----
function planeLesson3() {
    return [
        {
            html: '<h3>Reading a Drawn Plane</h3><p>When a plane is drawn on a cube, to find (hkl):</p><ol><li>Find where the plane crosses each axis (intercepts p, q, r)</li><li>Take reciprocals: h=1/p, k=1/q, l=1/r</li><li>Clear fractions by multiplying by LCM</li><li>Reduce to smallest integers</li></ol>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1');
                lDot(c, 1, 0, 0, '#005A9E', 7); lDot(c, 0, 1, 0, '#107C10', 7); lDot(c, 0, 0, 1, '#A4262C', 7);
            }
        },
        {
            html: '<h3>Example: Find (hkl) for this plane</h3><p>Plane cuts: x at 2, y at 1, z at ∞ (parallel to z).</p><p>Intercepts: p=2, q=1, r=∞</p>',
            draw: function (c) {
                lDrawCube(c);
                const pts = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]];
                // plane parallel to z, cuts x@1, y@1 means plane through (1,0,0) (0,1,0)
                lFilledPlane(c, [[1, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]], 'rgba(16,124,16,0.25)', '#107C10');
                lDot(c, 1, 0, 0, '#005A9E', 7); lLabel(c, 1, 0, 0, 'x=1', '#005A9E', 8, 14);
                lDot(c, 0, 1, 0, '#107C10', 7); lLabel(c, 0, 1, 0, 'y=1', '#107C10', 8, -12);
                lLabel(c, 0.5, 0.5, 1, 'parallel to z', '#A4262C', 0, 12);
            }
        },
        {
            html: '<h3>Take Reciprocals</h3><p>Intercepts: p=1, q=1, r=∞</p><p>Reciprocals:<br>h = 1/p = 1/1 = <strong>1</strong><br>k = 1/q = 1/1 = <strong>1</strong><br>l = 1/r = 1/∞ = <strong>0</strong></p><p style="font-size:20px;text-align:center;font-weight:700;color:#107C10;margin:12px 0">(1 1 0)</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]], 'rgba(16,124,16,0.3)', '#107C10');
                lDot(c, 1, 0, 0, '#005A9E', 7); lDot(c, 0, 1, 0, '#107C10', 7);
                c.font = 'bold 16px Inter,Arial'; c.fillStyle = '#107C10';
                const mid = lProject(0.5, 0.5, 0.5);
                c.fillText('(110)', mid.u + 5, mid.v);
            }
        },
        {
            html: '<h3>Fractional Intercepts Example</h3><p>Plane cuts: x at 2, y at 1, z at ∞ (p=2, q=1, r=∞)</p><p>Reciprocals: h=½, k=1, l=0<br>Multiply by 2: <strong>h=1, k=2, l=0</strong></p><p style="font-size:20px;text-align:center;font-weight:700;color:#6366f1;margin:12px 0">(1 2 0)</p><div class="lex-rule">Always multiply all reciprocals by the same factor to get integers.</div>',
            draw: function (c) {
                lDrawCube(c);
                // (120) plane intercepts x@1, y@0.5
                lFilledPlane(c, [[1, 0, 0], [1, 0, 1], [0, 0.5, 1], [0, 0.5, 0]], 'rgba(99,102,241,0.3)', '#6366f1');
                lDot(c, 1, 0, 0, '#005A9E', 7); lLabel(c, 1, 0, 0, 'x=1', '#005A9E', 8, 14);
                lDot(c, 0, 0.5, 0, '#107C10', 7); lLabel(c, 0, 0.5, 0, 'y=½', '#107C10', 8, -10);
                c.font = 'bold 15px Inter,Arial'; c.fillStyle = '#6366f1';
                const mid = lProject(0.5, 0.25, 0.5);
                c.fillText('(120)', mid.u, mid.v);
            }
        }
    ];
}

// ---- PLANE Lesson 4: Zero Index Planes ----
function planeLesson4() {
    return [
        {
            html: '<h3>What does a Zero Index Mean?</h3><p>When an index is <strong>0</strong>, it means the plane is <strong>parallel to that axis</strong> — it never intersects it (intercept = ∞).</p><ul><li>h=0 → parallel to x-axis</li><li>k=0 → parallel to y-axis</li><li>l=0 → parallel to z-axis</li></ul>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], 'rgba(164,38,44,0.25)', '#A4262C');
                lLabel(c, 0.5, 0, 0.5, 'Parallel to y (k=0)', '#A4262C', 0, 20);
            }
        },
        {
            html: '<h3>The (001) Plane — Horizontal</h3><p><code>(0 0 1)</code>: l=1 means z-intercept = 1. h=0, k=0 means the plane never crosses x or y.</p><p>This is a <strong>horizontal plane</strong> at z=1 — the top face of the cube.</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], 'rgba(164,38,44,0.35)', '#A4262C');
                lDot(c, 0, 0, 1, '#A4262C', 7); lLabel(c, 0, 0, 1, 'z=1', '#A4262C', 8, 0);
                c.font = 'bold 15px Inter,Arial'; c.fillStyle = '#A4262C';
                const mid = lProject(0.5, 0.5, 1);
                c.fillText('(001)', mid.u - 15, mid.v - 10);
            }
        },
        {
            html: '<h3>The (010) Plane — Side Face</h3><p><code>(0 1 0)</code>: k=1 means y-intercept = 1. Parallel to x and z.</p><p>This is a <strong>vertical side face</strong> of the cube — perpendicular to the y-axis.</p>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], 'rgba(16,124,16,0.35)', '#107C10');
                lDot(c, 0, 1, 0, '#107C10', 7); lLabel(c, 0, 1, 0, 'y=1', '#107C10', 8, -12);
                c.font = 'bold 15px Inter,Arial'; c.fillStyle = '#107C10';
                const mid = lProject(0.5, 1, 0.5);
                c.fillText('(010)', mid.u + 5, mid.v);
            }
        },
        {
            html: '<h3>Family of Planes {100}</h3><p>The family <code>{100}</code> contains all equivalent planes: (100), (010), (001) and their negatives.</p><p>In cubic crystals, all these planes are equivalent by symmetry.</p><div class="lex-rule">Curly braces {} denote a family of symmetrically equivalent planes.</div>',
            draw: function (c) {
                lDrawCube(c);
                lFilledPlane(c, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 'rgba(0,90,158,0.2)', '#005A9E');
                lFilledPlane(c, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], 'rgba(16,124,16,0.2)', '#107C10');
                lFilledPlane(c, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], 'rgba(164,38,44,0.2)', '#A4262C');
                c.font = 'bold 13px Inter,Arial';
                c.fillStyle = '#005A9E'; c.fillText('(100)', lProject(1, 0.5, 0.5).u + 5, lProject(1, 0.5, 0.5).v);
                c.fillStyle = '#107C10'; c.fillText('(010)', lProject(0.5, 1, 0.5).u + 5, lProject(0.5, 1, 0.5).v);
                c.fillStyle = '#A4262C'; c.fillText('(001)', lProject(0.5, 0.5, 1).u, lProject(0.5, 0.5, 1).v - 8);
            }
        }
    ];
}

// ---- Initialize Hub on page load ----
function initLearningHub() {
    loadHubProgress();
    renderCurriculumMap();
}

// ==================== INITIALIZATION ====================
// ==================== CRYSTALLOGRAPHIC CALCULATOR ====================
function _pN(id) {
    var v = ((document.getElementById(id) || {}).value || '').trim();
    if (!v || v === '-') return 0;
    if (v.indexOf('/') > -1) { var p = v.split('/'); return parseFloat(p[0]) / parseFloat(p[1]); }
    return parseFloat(v) || 0;
}
function _mag(x, y, z) { return Math.sqrt(x * x + y * y + z * z); }
function _stepsHtml(arr) { return arr.map(function (s) { return '<div class="calc-step">' + s + '</div>'; }).join(''); }
function _showRes(id, steps, answer, unit) {
    var el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = '<div class="calc-steps">' + _stepsHtml(steps) + '</div><div class="calc-answer">' + answer + (unit ? ' <span class="calc-unit">' + unit + '</span>' : '') + '</div>';
    el.classList.add('visible');
}
function switchCalcTab(tabId, btn) {
    document.querySelectorAll('.hct-tab').forEach(function (b) { b.classList.remove('active'); });
    document.querySelectorAll('.hct-content').forEach(function (c) { c.classList.remove('active'); });
    btn.classList.add('active');
    var el = document.getElementById('calc-' + tabId);
    if (el) el.classList.add('active');
}
function calcDirAngle() {
    var u1 = _pN('d1u'), v1 = _pN('d1v'), w1 = _pN('d1w'), u2 = _pN('d2u'), v2 = _pN('d2v'), w2 = _pN('d2w');
    var dot = u1 * u2 + v1 * v2 + w1 * w2, m1 = _mag(u1, v1, w1), m2 = _mag(u2, v2, w2);
    if (!m1 || !m2) { _showRes('res-dir-angle', ['Error'], 'Both directions must be non-zero', ''); return; }
    var cosV = Math.max(-1, Math.min(1, dot / (m1 * m2)));
    var ang = (Math.acos(cosV) * 180 / Math.PI).toFixed(4);
    _showRes('res-dir-angle', [
        'Direction 1: [' + u1 + ' ' + v1 + ' ' + w1 + '],  |d\u2081| = ' + m1.toFixed(4),
        'Direction 2: [' + u2 + ' ' + v2 + ' ' + w2 + '],  |d\u2082| = ' + m2.toFixed(4),
        'Dot product = ' + u1 + '\u00D7' + u2 + ' + ' + v1 + '\u00D7' + v2 + ' + ' + w1 + '\u00D7' + w2 + ' = ' + dot.toFixed(4),
        'cos \u03B8 = ' + dot.toFixed(4) + ' / (' + m1.toFixed(4) + '\u00D7' + m2.toFixed(4) + ') = ' + cosV.toFixed(6)
    ], '\u03B8 = ' + ang + '\u00B0', '');
}
function calcPlaneAngle() {
    var h1 = _pN('p1h'), k1 = _pN('p1k'), l1 = _pN('p1l'), h2 = _pN('p2h'), k2 = _pN('p2k'), l2 = _pN('p2l');
    var dot = h1 * h2 + k1 * k2 + l1 * l2, m1 = _mag(h1, k1, l1), m2 = _mag(h2, k2, l2);
    if (!m1 || !m2) { _showRes('res-plane-angle', ['Error'], 'Both planes must be non-zero', ''); return; }
    var cosV = Math.max(-1, Math.min(1, dot / (m1 * m2)));
    var ang = (Math.acos(cosV) * 180 / Math.PI).toFixed(4);
    _showRes('res-plane-angle', [
        'Plane 1: (' + h1 + ' ' + k1 + ' ' + l1 + '),  |n\u2081| = ' + m1.toFixed(4),
        'Plane 2: (' + h2 + ' ' + k2 + ' ' + l2 + '),  |n\u2082| = ' + m2.toFixed(4),
        'Dot = ' + dot.toFixed(4) + ',  cos \u03B8 = ' + cosV.toFixed(6)
    ], '\u03B8 = ' + ang + '\u00B0', '');
}
function calcDirPlaneAngle() {
    var h = _pN('dph'), k = _pN('dpk'), l = _pN('dpl'), u = _pN('dpu'), v = _pN('dpv'), w = _pN('dpw');
    var dot = h * u + k * v + l * w, mp = _mag(h, k, l), md = _mag(u, v, w);
    if (!mp || !md) { _showRes('res-dir-plane', ['Error'], 'Both must be non-zero', ''); return; }
    var sinV = Math.max(-1, Math.min(1, dot / (mp * md)));
    var ang = (Math.asin(sinV) * 180 / Math.PI).toFixed(4);
    _showRes('res-dir-plane', [
        'Plane: (' + h + ' ' + k + ' ' + l + '),  |(hkl)| = ' + mp.toFixed(4),
        'Direction: [' + u + ' ' + v + ' ' + w + '],  |[uvw]| = ' + md.toFixed(4),
        'hu+kv+lw = ' + dot.toFixed(4) + ',  sin \u03B8 = ' + sinV.toFixed(6)
    ], '\u03B8 = ' + ang + '\u00B0', '');
}
function calcDSpacing() {
    var a = _pN('ds-a'), h = _pN('ds-h'), k = _pN('ds-k'), l = _pN('ds-l');
    if (a <= 0) { _showRes('res-d-spacing', ['Error'], 'Lattice parameter a must be > 0', ''); return; }
    var den = Math.sqrt(h * h + k * k + l * l);
    if (!den) { _showRes('res-d-spacing', ['Error'], 'At least one index must be non-zero', ''); return; }
    var d = (a / den).toFixed(6);
    _showRes('res-d-spacing', [
        'a = ' + a + ' \u00C5,  Plane (' + h + ' ' + k + ' ' + l + ')',
        '\u221A(h\u00B2+k\u00B2+l\u00B2) = \u221A(' + h * h + '+' + k * k + '+' + l * l + ') = ' + den.toFixed(4),
        'd = ' + a + ' / ' + den.toFixed(4) + ' = ' + d + ' \u00C5'
    ], 'd\u2096\u2097\u2097 = ' + d, '\u00C5');
}
function calcMagnitude() {
    var u = _pN('mag-u'), v = _pN('mag-v'), w = _pN('mag-w');
    var mag = _mag(u, v, w).toFixed(6);
    _showRes('res-magnitude', [
        'u = ' + u + ', v = ' + v + ', w = ' + w,
        '|[uvw]|\u00B2 = ' + u * u + ' + ' + v * v + ' + ' + w * w + ' = ' + (u * u + v * v + w * w).toFixed(4),
        '|[uvw]| = \u221A' + (u * u + v * v + w * w).toFixed(4) + ' = ' + mag
    ], '|[' + u + ' ' + v + ' ' + w + ']| = ' + mag, '');
}
// ==================== END CALCULATOR ====================

window.onload = function () {
    initData();
    loadProgress();
    resizeAllCanvases();
    initLearningHub();

    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    if (pageParam && document.getElementById('page-' + pageParam)) {
        showPage(pageParam);
    } else {
        showPage('learning');
    }

    updateGameMetrics();

    // Auto-select text on input focus to improve UX and prevent string concatenation issues
    document.querySelectorAll('input[type="number"], input[type="text"]').forEach(input => {
        input.addEventListener('focus', function () {
            this.select();
        });
    });

    showToast('Welcome to CrystalloGraphy! Your progress is automatically saved.');
};

// ==================== GAME ENGINE ====================

// ---- State ----
var gameMode = null;
var gameQuestions = [];
var gameQIdx = 0;
var gameSessionXP = 0;
var gameCombo = 1;
var gameBestStreak = 0;
var gameCurrStreak = 0;
var gameCorrect = 0;
var gameTotal = 0;
var gameTimer = null;
var gameTimerSec = 0;
var gameSelectedOption = null;
var gameAnswered = false;
var lastModeKey = null;

var LEVELS = [
    { name: 'Apprentice', xp: 0 }, { name: 'Novice', xp: 100 }, { name: 'Student', xp: 250 },
    { name: 'Scholar', xp: 500 }, { name: 'Expert', xp: 1000 }, { name: 'Master', xp: 2000 },
    { name: 'Grandmaster', xp: 4000 }, { name: 'Crystal Lord', xp: 8000 }
];

var ACHIEVEMENTS_DEF = [
    { id: 'first_answer', icon: '⭐', name: 'First Answer', req: 'Answer your first question', check: s => s.questionsCompleted >= 1 },
    { id: 'streak3', icon: '🔥', name: 'On Fire', req: 'Get a 3-answer streak', check: s => s.maxStreak >= 3 },
    { id: 'streak7', icon: '🌋', name: 'Unstoppable', req: 'Get a 7-answer streak', check: s => s.maxStreak >= 7 },
    { id: 'perfect10', icon: '💎', name: 'Perfect Round', req: '10 correct in a row', check: s => s.maxStreak >= 10 },
    { id: 'xp100', icon: '⚡', name: 'XP Seeker', req: 'Earn 100 XP total', check: s => s.totalXP >= 100 },
    { id: 'xp500', icon: '🌟', name: 'XP Hunter', req: 'Earn 500 XP total', check: s => s.totalXP >= 500 },
    { id: 'xp2000', icon: '🏆', name: 'XP Legend', req: 'Earn 2000 XP total', check: s => s.totalXP >= 2000 },
    { id: 'planes50', icon: '🔷', name: 'Plane Pilot', req: 'Answer 50 plane questions', check: s => s.planeAnswered >= 50 },
    { id: 'dirs50', icon: '➡️', name: 'Direction Guru', req: 'Answer 50 direction questions', check: s => s.dirAnswered >= 50 },
    { id: 'accuracy80', icon: '🎯', name: 'Sharpshooter', req: 'Reach 80% overall accuracy', check: s => s.questionsCompleted > 10 && (s.correctAnswers / s.questionsCompleted) >= 0.8 },
    { id: 'speed_demon', icon: '⚡', name: 'Speed Demon', req: 'Complete a Blitz round', check: s => s.blitzCompleted >= 1 },
    { id: 'boss_slayer', icon: '👑', name: 'Boss Slayer', req: 'Complete a Boss Battle', check: s => s.bossCompleted >= 1 },
];

function getGameStats() {
    var gs = progress.gameStats;
    return {
        totalXP: gs.totalPoints || 0,
        questionsCompleted: gs.questionsCompleted || 0,
        correctAnswers: gs.correctAnswers || 0,
        maxStreak: gs.maxStreak || 0,
        planeAnswered: gs.planeAnswered || 0,
        dirAnswered: gs.dirAnswered || 0,
        blitzCompleted: gs.blitzCompleted || 0,
        bossCompleted: gs.bossCompleted || 0,
        level: gs.level || 1,
        achievements: gs.achievements || {}
    };
}

function getLevelInfo(xp) {
    var lvl = 0;
    for (var i = 0; i < LEVELS.length; i++) if (xp >= LEVELS[i].xp) lvl = i;
    var cur = LEVELS[lvl], next = LEVELS[Math.min(lvl + 1, LEVELS.length - 1)];
    var pct = lvl >= LEVELS.length - 1 ? 100 : Math.min(100, Math.round((xp - cur.xp) / (next.xp - cur.xp) * 100));
    return { level: lvl + 1, name: cur.name, pct: pct, xpToNext: next.xp - xp, nextName: next.name };
}

function addXP(amount) {
    if (!progress.gameStats) progress.gameStats = { totalPoints: 0, level: 1, questionsCompleted: 0, correctAnswers: 0, maxStreak: 0, planeAnswered: 0, dirAnswered: 0, blitzCompleted: 0, bossCompleted: 0, experience: 0, achievements: {} };
    var gs = progress.gameStats;
    var oldLvl = getLevelInfo(gs.totalPoints).level;
    gs.totalPoints = (gs.totalPoints || 0) + amount;
    var newLvl = getLevelInfo(gs.totalPoints).level;
    gameSessionXP += amount;
    var el = document.getElementById('hud-xp'); if (el) el.textContent = gs.totalPoints;
    var nc = document.getElementById('nav-xp-display'); if (nc) nc.textContent = gs.totalPoints + ' XP';
    if (newLvl > oldLvl) showLevelUp(newLvl);
    saveProgress();
}

function showLevelUp(lvl) {
    showAchievementPopup('🆙', 'Level Up!', 'You reached Level ' + lvl + '! Keep going!');
}

function showAchievementPopup(icon, name, desc) {
    var p = document.getElementById('achievement-popup');
    if (!p) return;
    document.getElementById('ach-icon').textContent = icon;
    document.getElementById('ach-name').textContent = name;
    document.getElementById('ach-desc').textContent = desc;
    p.classList.add('visible');
    setTimeout(() => p.classList.remove('visible'), 3500);
}

function checkAchievements() {
    var gs = progress.gameStats;
    var stats = getGameStats();
    ACHIEVEMENTS_DEF.forEach(function (a) {
        if (!gs.achievements[a.id] && a.check(stats)) {
            gs.achievements[a.id] = Date.now();
            showAchievementPopup(a.icon, a.name, a.req);
        }
    });
    saveProgress();
}

// ---- Game Mode Definitions ----
var GAME_MODES = [
    {
        key: 'planes_mc', name: 'Plane Blitz', icon: '🔷', banner: 'green',
        desc: 'Identify shown planes by selecting the correct Miller indices (hkl). Multiple choice — fast & fun!',
        qCount: 10, type: 'planes', qType: 'mc', timedSec: 0, tag: 'easy', xpMult: 1,
        tagLabel: 'Beginner Friendly'
    },
    {
        key: 'planes_type', name: 'Plane Expert', icon: '🔬', banner: '',
        desc: 'Type the exact Miller indices for each visualized plane. Tests deep knowledge!',
        qCount: 10, type: 'planes', qType: 'type', timedSec: 0, tag: 'medium', xpMult: 1.5,
        tagLabel: 'Medium'
    },
    {
        key: 'dirs_mc', name: 'Direction Dash', icon: '➡️', banner: 'cyan',
        desc: 'Identify direction vectors [uvw] shown on the crystal cube. Multiple choice format.',
        qCount: 10, type: 'directions', qType: 'mc', timedSec: 0, tag: 'easy', xpMult: 1,
        tagLabel: 'Beginner Friendly'
    },
    {
        key: 'dirs_type', name: 'Direction Master', icon: '🧭', banner: '',
        desc: 'Type the exact direction indices for each arrow shown. Prove your mastery!',
        qCount: 10, type: 'directions', qType: 'type', timedSec: 0, tag: 'medium', xpMult: 1.5,
        tagLabel: 'Medium'
    },
    {
        key: 'blitz', name: '⚡ Blitz Round', icon: '⚡', banner: 'orange',
        desc: '20 mixed questions. 15 seconds each! Race the clock for maximum XP multipliers.',
        qCount: 20, type: 'mixed', qType: 'mc', timedSec: 15, tag: 'hard', xpMult: 2,
        tagLabel: 'Timed Challenge'
    },
    {
        key: 'boss', name: '👑 Boss Battle', icon: '💀', banner: 'red',
        desc: '25 questions covering everything. 3 lives — lose them all and it\'s over. Survive to earn rare XP!',
        qCount: 25, type: 'mixed', qType: 'type', timedSec: 30, tag: 'hard', xpMult: 3,
        tagLabel: 'Ultimate Challenge'
    },
];

var bosslives = 3;

// ---- Render Lobby ----
function renderPracticeModes() {
    var gs = getGameStats();
    var lvlInfo = getLevelInfo(gs.totalXP);
    // Update lobby XP bar
    var lv = document.getElementById('lobby-level'); if (lv) lv.textContent = 'LVL ' + lvlInfo.level;
    var lf = document.getElementById('lobby-xp-fill'); if (lf) lf.style.width = lvlInfo.pct + '%';
    var lt = document.getElementById('lobby-xp-text'); if (lt) lt.textContent = gs.totalXP + ' XP — ' + lvlInfo.name;
    var ls = document.getElementById('lobby-streak'); if (ls) ls.textContent = '🔥 ' + gs.maxStreak + ' best streak';

    // Show lobby, hide session
    document.getElementById('game-lobby').classList.remove('hidden');
    document.getElementById('game-session').classList.add('hidden');
    document.getElementById('score-screen').classList.remove('visible');
    document.getElementById('score-screen').style.display = 'none';

    var grid = document.getElementById('game-modes-grid');
    if (!grid) return;
    grid.innerHTML = '';
    GAME_MODES.forEach(function (m) {
        var best = gs.achievements && gs.achievements['completed_' + m.key] ? 'Personal Best!' : '';
        grid.innerHTML += '<div class="game-mode-card" onclick="startGame(\'' + m.key + '\')" role="button" tabindex="0" aria-label="' + m.name + '">'
            + '<div class="game-mode-card-banner ' + m.banner + '"></div>'
            + '<div class="game-mode-card-inner">'
            + (best ? '<div class="game-mode-best">✓ Completed</div>' : '')
            + '<div class="game-mode-icon">' + m.icon + '</div>'
            + '<div class="game-mode-name">' + m.name + '</div>'
            + '<div class="game-mode-desc">' + m.desc + '</div>'
            + '<div class="game-mode-meta">'
            + '<span class="game-mode-pill ' + m.tag + '">' + m.tagLabel + '</span>'
            + '<span class="game-mode-pill">' + m.qCount + ' questions</span>'
            + '<span class="game-mode-pill">' + m.xpMult + 'x XP</span>'
            + (m.timedSec ? '<span class="game-mode-pill hard">⏱ ' + m.timedSec + 's each</span>' : '')
            + '</div></div></div>';
    });
}

// ---- Build question list ----
function buildQuestions(modeKey) {
    var m = GAME_MODES.find(x => x.key === modeKey);
    var pool = [];
    if (m.type === 'planes' || m.type === 'mixed') {
        planeExamples.forEach(function (p) {
            pool.push({ kind: 'plane', h: p.h, k: p.k, l: p.l });
        });
    }
    if (m.type === 'directions' || m.type === 'mixed') {
        dirExamples.forEach(function (d) {
            pool.push({ kind: 'dir', u: d.u, v: d.v, w: d.w, tail: d.tail, head: d.head });
        });
    }
    // Shuffle
    for (var i = pool.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1));[pool[i], pool[j]] = [pool[j], pool[i]]; }
    return pool.slice(0, m.qCount);
}

function makeMCOptions(q, allPool) {
    var correct, fmt;
    if (q.kind === 'plane') {
        correct = [q.h, q.k, q.l];
        fmt = arr => '(' + arr.map(v => v < 0 ? '<u>' + Math.abs(v) + '</u>' : v).join('') + ')';
    } else {
        correct = [q.u, q.v, q.w];
        fmt = arr => '[' + arr.join(' ') + ']';
    }
    var opts = [correct.slice()];
    var tries = 0;
    while (opts.length < 4 && tries < 200) {
        tries++;
        var alt;
        if (q.kind === 'plane') {
            var r = planeExamples[Math.floor(Math.random() * planeExamples.length)];
            alt = [r.h, r.k, r.l];
        } else {
            var r2 = dirExamples[Math.floor(Math.random() * dirExamples.length)];
            alt = [r2.u, r2.v, r2.w];
        }
        var exists = opts.some(o => o[0] === alt[0] && o[1] === alt[1] && o[2] === alt[2]);
        if (!exists) opts.push(alt);
    }
    for (var i = opts.length - 1; i > 0; i--) { var j2 = Math.floor(Math.random() * (i + 1));[opts[i], opts[j2]] = [opts[j2], opts[i]]; }
    return { options: opts, correctIdx: opts.findIndex(o => o[0] === correct[0] && o[1] === correct[1] && o[2] === correct[2]), fmt: fmt };
}

// ---- Start Game ----
function startGame(modeKey) {
    var m = GAME_MODES.find(x => x.key === modeKey);
    if (!m) return;
    lastModeKey = modeKey;
    gameMode = m; gameQuestions = buildQuestions(modeKey);
    gameQIdx = 0; gameSessionXP = 0; gameCombo = 1; gameBestStreak = 0; gameCurrStreak = 0;
    gameCorrect = 0; gameTotal = 0; gameAnswered = false; bosslives = 3;

    document.getElementById('game-lobby').classList.add('hidden');
    document.getElementById('score-screen').style.display = 'none';
    document.getElementById('game-session').classList.remove('hidden');

    // HUD
    var hm = document.getElementById('hud-mode-name'); if (hm) hm.textContent = m.icon + ' ' + m.name;
    updateHUD();
    renderGameQuestion();
}

function updateHUD() {
    var gs = getGameStats();
    var he = document.getElementById('hud-xp'); if (he) he.textContent = gs.totalXP;
    var hs = document.getElementById('hud-streak'); if (hs) hs.textContent = gameCurrStreak;
    var hc = document.getElementById('hud-combo'); if (hc) hc.textContent = gameCombo;
    var hcw = document.getElementById('hud-combo-wrap'); if (hcw) hcw.style.display = gameCombo > 1 ? '' : 'none';
    var pct = gameQIdx / gameQuestions.length * 100;
    var hpf = document.getElementById('hud-progress-fill'); if (hpf) hpf.style.width = pct + '%';
    var hqc = document.getElementById('hud-q-count'); if (hqc) hqc.textContent = (gameQIdx + 1) + '/' + gameQuestions.length;
}

function renderGameQuestion() {
    if (gameQIdx >= gameQuestions.length) { showScoreScreen(); return; }
    gameAnswered = false; gameSelectedOption = null;
    var q = gameQuestions[gameQIdx];
    var m = gameMode;

    // Labels
    var qnl = document.getElementById('q-num-label'); if (qnl) qnl.textContent = 'Question ' + (gameQIdx + 1) + ' of ' + gameQuestions.length;
    var qtb = document.getElementById('q-type-badge'); if (qtb) qtb.textContent = q.kind === 'plane' ? 'Identify Plane (hkl)' : 'Identify Direction [uvw]';
    var qi = document.getElementById('q-instruction'); if (qi) qi.textContent = q.kind === 'plane' ? 'What are the Miller indices (hkl) for this plane?' : 'What are the direction indices [uvw] for this arrow?';

    // Clear feedback
    var fb = document.getElementById('game-feedback'); if (fb) { fb.className = 'game-feedback'; fb.innerHTML = ''; }
    var hint = document.getElementById('game-hint-box'); if (hint) hint.className = 'hint-text';
    var btnN = document.getElementById('btn-next'); if (btnN) btnN.style.display = 'none';
    var btnC = document.getElementById('btn-check'); if (btnC) btnC.style.display = '';
    var btnHi = document.getElementById('btn-hint'); if (btnHi) btnHi.style.display = '';

    // Draw on canvas
    setTimeout(function () {
        if (q.kind === 'plane') drawPlane(q.h, q.k, q.l, practiceCtx, false);
        else {
            drawAxesAndCube(practiceCtx);
            var ox2 = q.tail ? q.tail.x : null, oy2 = q.tail ? q.tail.y : null, oz2 = q.tail ? q.tail.z : null;
            drawDirection(q.u, q.v, q.w, '#6366f1', practiceCtx, ox2, oy2, oz2);
        }
    }, 50);

    // Inputs
    var inp = document.getElementById('practice-inputs');
    if (m.qType === 'mc') {
        var mc = makeMCOptions(q, gameQuestions);
        var letters = ['A', 'B', 'C', 'D'];
        inp.innerHTML = '<div class="mc-options">' + mc.options.map(function (opt, i) {
            return '<div class="mc-option" id="mc-opt-' + i + '" onclick="selectMCOption(' + i + ',' + mc.correctIdx + ')">'
                + '<span class="mc-option-letter">' + letters[i] + '</span>'
                + '<span>' + mc.fmt(opt) + '</span></div>';
        }).join('') + '</div>';
        inp.dataset.correctIdx = mc.correctIdx;
        inp.dataset.correctVal = JSON.stringify(mc.options[mc.correctIdx]);
    } else {
        if (q.kind === 'plane') {
            inp.innerHTML = '<div class="answer-input-row">'
                + '<div><input class="answer-index-input" id="ans-h" placeholder="h" maxlength="4"><div class="answer-index-label">h</div></div>'
                + '<div><input class="answer-index-input" id="ans-k" placeholder="k" maxlength="4"><div class="answer-index-label">k</div></div>'
                + '<div><input class="answer-index-input" id="ans-l" placeholder="l" maxlength="4"><div class="answer-index-label">l</div></div>'
                + '</div>';
        } else {
            inp.innerHTML = '<div class="answer-input-row">'
                + '<div><input class="answer-index-input" id="ans-u" placeholder="u" maxlength="4"><div class="answer-index-label">u</div></div>'
                + '<div><input class="answer-index-input" id="ans-v" placeholder="v" maxlength="4"><div class="answer-index-label">v</div></div>'
                + '<div><input class="answer-index-input" id="ans-w" placeholder="w" maxlength="4"><div class="answer-index-label">w</div></div>'
                + '</div>';
        }
    }
    updateHUD();

    // Timer
    clearInterval(gameTimer);
    var tb = document.getElementById('hud-timer-badge');
    if (m.timedSec > 0) {
        gameTimerSec = m.timedSec;
        if (tb) tb.style.display = '';
        var ts = document.getElementById('hud-timer'); if (ts) ts.textContent = gameTimerSec;
        gameTimer = setInterval(function () {
            gameTimerSec--;
            if (ts) ts.textContent = gameTimerSec;
            if (tb) tb.className = 'hud-badge timer' + (gameTimerSec <= 5 ? ' urgent' : '');
            if (gameTimerSec <= 0) { clearInterval(gameTimer); if (!gameAnswered) autoFailQuestion(); }
        }, 1000);
    } else {
        if (tb) tb.style.display = 'none';
    }
}

function selectMCOption(idx, correctIdx) {
    if (gameAnswered) return;
    document.querySelectorAll('.mc-option').forEach(function (el, i) {
        el.classList.remove('selected');
    });
    var el = document.getElementById('mc-opt-' + idx);
    if (el) el.classList.add('selected');
    gameSelectedOption = idx;
}

function checkGameAnswer() {
    if (gameAnswered) return;
    var q = gameQuestions[gameQIdx];
    var m = gameMode;
    var correct = false;

    if (m.qType === 'mc') {
        if (gameSelectedOption === null) { showGameFeedback(false, 'Please select an answer!'); return; }
        var correctIdx = parseInt(document.getElementById('practice-inputs').dataset.correctIdx);
        correct = (gameSelectedOption === correctIdx);
        // Visual
        document.querySelectorAll('.mc-option').forEach(function (el, i) {
            if (i === correctIdx) el.classList.add('correct');
            else if (i === gameSelectedOption && !correct) el.classList.add('wrong');
        });
    } else {
        var a, b, c;
        if (q.kind === 'plane') {
            a = parseInt(document.getElementById('ans-h').value) || 0;
            b = parseInt(document.getElementById('ans-k').value) || 0;
            c = parseInt(document.getElementById('ans-l').value) || 0;
            correct = (a === q.h && b === q.k && c === q.l);
            ['ans-h', 'ans-k', 'ans-l'].forEach(function (id) {
                var el2 = document.getElementById(id); if (el2) el2.classList.add(correct ? 'correct' : 'wrong');
            });
        } else {
            a = parseInt(document.getElementById('ans-u').value) || 0;
            b = parseInt(document.getElementById('ans-v').value) || 0;
            c = parseInt(document.getElementById('ans-w').value) || 0;
            correct = (a === q.u && b === q.v && c === q.w);
            ['ans-u', 'ans-v', 'ans-w'].forEach(function (id) {
                var el3 = document.getElementById(id); if (el3) el3.classList.add(correct ? 'correct' : 'wrong');
            });
        }
    }
    gameAnswered = true;
    clearInterval(gameTimer);
    processAnswer(correct, q);
}

function processAnswer(correct, q) {
    var gs = progress.gameStats;
    if (!gs) gs = progress.gameStats = { totalPoints: 0, questionsCompleted: 0, correctAnswers: 0, maxStreak: 0, planeAnswered: 0, dirAnswered: 0, blitzCompleted: 0, bossCompleted: 0, experience: 0, achievements: {} };
    gs.questionsCompleted = (gs.questionsCompleted || 0) + 1;
    if (q.kind === 'plane') gs.planeAnswered = (gs.planeAnswered || 0) + 1;
    else gs.dirAnswered = (gs.dirAnswered || 0) + 1;
    gameTotal++;

    if (correct) {
        gameCorrect++; gameCurrStreak++;
        if (gameCurrStreak > gameBestStreak) gameBestStreak = gameCurrStreak;
        if (gameCurrStreak >= (gs.maxStreak || 0)) gs.maxStreak = gameCurrStreak;
        gs.correctAnswers = (gs.correctAnswers || 0) + 1;
        if (gameCurrStreak >= 3) gameCombo = Math.min(5, Math.floor(gameCurrStreak / 3) + 1);
        var xp = Math.round(10 * gameCombo * gameMode.xpMult);
        addXP(xp);
        if (gameCurrStreak >= 3) showComboBurst();
        // Feedback
        var fmsg = q.kind === 'plane'
            ? 'Correct! The plane is ' + formatHKL(q.h, q.k, q.l)
            : 'Correct! The direction is ' + formatUVW(q.u, q.v, q.w);
        showGameFeedback(true, fmsg + '<br><span class="xp-gain">+' + xp + ' XP' + (gameCombo > 1 ? ' 🔥 ' + gameCombo + 'x combo!' : '') + '</span>');
        // Update specific module tracking
        var mod = q.kind === 'plane' ? 'planes' : 'directions';
        progress[mod].correct = (progress[mod].correct || 0) + 1;
        progress[mod].total = (progress[mod].total || 0) + 1;
    } else {
        gameCurrStreak = 0; gameCombo = 1;
        if (gameMode.key === 'boss') { bosslives--; if (bosslives <= 0) { endBossGame(); return; } }
        var ans = q.kind === 'plane' ? '(' + q.h + ' ' + q.k + ' ' + q.l + ')' : '[' + q.u + ' ' + q.v + ' ' + q.w + ']';
        showGameFeedback(false, 'Not quite! The answer was <strong>' + ans + '</strong>');
        var mod2 = q.kind === 'plane' ? 'planes' : 'directions';
        progress[mod2].total = (progress[mod2].total || 0) + 1;
    }
    checkAchievements();
    saveProgress();
    updateHUD();
    // Show next button
    var btnN = document.getElementById('btn-next'); if (btnN) btnN.style.display = '';
    var btnC = document.getElementById('btn-check'); if (btnC) btnC.style.display = 'none';
    var btnHi = document.getElementById('btn-hint'); if (btnHi) btnHi.style.display = 'none';
}

function autoFailQuestion() {
    if (!gameAnswered) { gameAnswered = true; processAnswer(false, gameQuestions[gameQIdx]); }
}

function endBossGame() {
    gameAnswered = true; clearInterval(gameTimer);
    showGameFeedback(false, '💀 Game Over! You ran out of lives on the Boss Battle!');
    setTimeout(showScoreScreen, 1800);
}

function showGameFeedback(correct, msg) {
    var fb = document.getElementById('game-feedback');
    if (!fb) return;
    fb.className = 'game-feedback visible ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = '<span class="game-feedback-icon">' + (correct ? '✅' : '❌') + '</span>'
        + '<div class="game-feedback-text"><strong>' + (correct ? 'Excellent!' : 'Not quite!') + '</strong>'
        + '<span>' + msg + '</span></div>';
}

function showComboBurst() {
    var el = document.getElementById('combo-burst');
    if (!el) return;
    el.textContent = '🔥 ' + gameCombo + 'x COMBO!';
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 900);
}

function nextGameQuestion() { gameQIdx++; renderGameQuestion(); }
function skipGameQuestion() { gameAnswered = true; clearInterval(gameTimer); processAnswer(false, gameQuestions[gameQIdx]); }

function showGameHint() {
    var q = gameQuestions[gameQIdx];
    var hint = '', hb = document.getElementById('game-hint-box'), ht = document.getElementById('game-hint-text');
    if (q.kind === 'plane') {
        hint = 'The plane intercepts the axes at: ' + (q.h === 0 ? '∞' : toFracStr(1 / q.h)) + ', ' + (q.k === 0 ? '∞' : toFracStr(1 / q.k)) + ', ' + (q.l === 0 ? '∞' : toFracStr(1 / q.l));
    } else {
        hint = 'The direction vector components are: Δx=' + (q.head.x - q.tail.x) + ', Δy=' + (q.head.y - q.tail.y) + ', Δz=' + (q.head.z - q.tail.z);
    }
    if (ht) ht.textContent = hint;
    if (hb) hb.classList.add('shown');
}

function playAgain() { startGame(lastModeKey || 'planes_mc'); }

function exitGame() {
    clearInterval(gameTimer);
    gameMode = null;
    document.getElementById('game-session').classList.add('hidden');
    document.getElementById('score-screen').style.display = 'none';
    renderPracticeModes();
}

function showScoreScreen() {
    clearInterval(gameTimer);
    document.getElementById('game-session').classList.add('hidden');
    var sc = document.getElementById('score-screen');
    sc.style.display = 'block'; sc.classList.add('visible');
    var pct = gameTotal > 0 ? Math.round(gameCorrect / gameTotal * 100) : 0;
    if (gameMode && gameMode.key === 'boss' && bosslives > 0) {
        progress.gameStats.bossCompleted = (progress.gameStats.bossCompleted || 0) + 1;
        checkAchievements();
    }
    if (gameMode && gameMode.key === 'blitz') {
        progress.gameStats.blitzCompleted = (progress.gameStats.blitzCompleted || 0) + 1;
        checkAchievements();
    }
    progress.gameStats.achievements = progress.gameStats.achievements || {};
    progress.gameStats.achievements['completed_' + (gameMode ? gameMode.key : '')] = true;
    saveProgress();
    // Emoji+title
    var emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '😊' : '💪';
    var title = pct >= 90 ? 'Outstanding!' : pct >= 70 ? 'Great job!' : pct >= 50 ? 'Good effort!' : 'Keep practicing!';
    var se = document.getElementById('score-emoji'); if (se) se.textContent = emoji;
    var st = document.getElementById('score-title'); if (st) st.textContent = title;
    var ss = document.getElementById('score-subtitle'); if (ss) ss.textContent = 'Accuracy: ' + pct + '% — Completed ' + gameTotal + ' questions';
    var sco = document.getElementById('sc-correct'); if (sco) sco.textContent = gameCorrect;
    var sca = document.getElementById('sc-accuracy'); if (sca) sca.textContent = pct + '%';
    var scx = document.getElementById('sc-xp'); if (scx) scx.textContent = '+' + gameSessionXP;
    var scs = document.getElementById('sc-streak'); if (scs) scs.textContent = gameBestStreak;
}

// ==================== PROGRESS PAGE ====================
function updateProgressUI() {
    var gs = progress.gameStats || {};
    var totalXP = gs.totalPoints || 0;
    var lvlInfo = getLevelInfo(totalXP);
    var planeT = progress.planes.total || 0, planeC = progress.planes.correct || 0;
    var dirT = progress.directions.total || 0, dirC = progress.directions.correct || 0;
    var totalT = planeT + dirT, totalC = planeC + dirC;
    var planePct = planeT ? Math.round(planeC / planeT * 100) : 0;
    var dirPct = dirT ? Math.round(dirC / dirT * 100) : 0;
    var overallPct = totalT ? Math.round(totalC / totalT * 100) : 0;

    // Player XP bar
    var pxf = document.getElementById('player-xp-fill'); if (pxf) pxf.style.width = lvlInfo.pct + '%';
    var pxl = document.getElementById('player-xp-label'); if (pxl) pxl.textContent = totalXP + ' XP — ' + lvlInfo.xpToNext + ' to Level ' + (lvlInfo.level + 1);
    var pr = document.getElementById('player-rank'); if (pr) pr.textContent = 'Rank: ' + lvlInfo.name + ' (Level ' + lvlInfo.level + ')';
    var pa = document.getElementById('player-avatar');
    if (pa) pa.textContent = lvlInfo.level >= 8 ? '👑' : lvlInfo.level >= 6 ? '🔮' : lvlInfo.level >= 4 ? '🎓' : lvlInfo.level >= 2 ? '📚' : '🧑‍🔬';
    var pgx = document.getElementById('pg-total-xp'); if (pgx) pgx.textContent = totalXP;
    var pgs = document.getElementById('pg-streak'); if (pgs) pgs.textContent = gs.maxStreak || 0;
    var pgq = document.getElementById('pg-questions'); if (pgq) pgq.textContent = gs.questionsCompleted || 0;
    var nc = document.getElementById('nav-xp-display'); if (nc) nc.textContent = totalXP + ' XP';

    // Mastery rings
    function setRing(id, pct) {
        var circ = 251.2, el = document.getElementById(id);
        if (el) el.style.strokeDashoffset = circ * (1 - pct / 100);
        var tel = document.getElementById(id + '-text'); if (tel) tel.textContent = pct + '%';
    }
    setTimeout(function () {
        setRing('ring-planes', planePct);
        setRing('ring-dirs', dirPct);
        setRing('ring-overall', overallPct);
    }, 200);

    // Topic mastery grid
    var tmg = document.getElementById('topic-mastery-grid');
    if (tmg) {
        var topics = [
            { icon: '🔷', name: 'Planes (hkl) Draw', c: planeC, t: planeT },
            { icon: '➡️', name: 'Directions [uvw]', c: dirC, t: dirT },
            { icon: '⚡', name: 'Blitz Rounds', c: gs.blitzCompleted || 0, t: Math.max(gs.blitzCompleted || 0, 1), raw: true },
            { icon: '👑', name: 'Boss Battles', c: gs.bossCompleted || 0, t: Math.max(gs.bossCompleted || 0, 1), raw: true },
        ];
        tmg.innerHTML = topics.map(function (tp) {
            var pct2 = tp.raw ? Math.min(100, (tp.c / 5) * 100) : tp.t ? Math.round(tp.c / tp.t * 100) : 0;
            var cls2 = pct2 >= 70 ? 'high' : pct2 >= 40 ? 'mid' : 'low';
            return '<div class="topic-card"><div class="topic-card-top">'
                + '<span class="topic-card-icon">' + tp.icon + '</span>'
                + '<span class="topic-card-name">' + tp.name + '</span>'
                + '<span class="topic-card-pct ' + cls2 + '">' + pct2 + '%</span></div>'
                + '<div class="topic-bar"><div class="topic-bar-fill ' + cls2 + '" style="width:' + pct2 + '%"></div></div>'
                + (tp.raw ? '<div style="font-size:11px;color:var(--text-muted);margin-top:6px">Completed: ' + tp.c + '</div>'
                    : '<div style="font-size:11px;color:var(--text-muted);margin-top:6px">' + tp.c + '/' + tp.t + ' correct</div>')
                + '</div>';
        }).join('');
    }

    // Achievements
    var ag = document.getElementById('achievement-grid');
    if (ag) {
        var earned = gs.achievements || {};
        ag.innerHTML = ACHIEVEMENTS_DEF.map(function (a) {
            var isEarned = !!earned[a.id];
            return '<div class="achievement-tile' + (isEarned ? ' earned' : ' locked') + '" title="' + a.req + '">'
                + '<div class="achievement-icon">' + a.icon + '</div>'
                + '<div class="achievement-name">' + a.name + '</div>'
                + '<div class="achievement-req">' + (isEarned ? '✓ Earned' : a.req) + '</div>'
                + '</div>';
        }).join('');
    }

    // Focus areas
    displayWeaknesses();
}

function displayWeaknesses() {
    var wg = document.getElementById('weakness-grid');
    if (!wg) return;
    var areas = [];
    var pt = progress.planes.total || 0, pc = progress.planes.correct || 0;
    var dt = progress.directions.total || 0, dc = progress.directions.correct || 0;
    if (pt > 3 && pc / pt < 0.7) areas.push({ icon: '🔷', topic: 'Miller Planes (hkl)', score: Math.round(pc / pt * 100) + '%', tip: 'Practice identifying intercepts on each axis and computing reciprocals. Start with simple planes like (100), (110), (111).', mode: 'planes_mc' });
    if (dt > 3 && dc / dt < 0.7) areas.push({ icon: '➡️', topic: 'Crystal Directions [uvw]', score: Math.round(dc / dt * 100) + '%', tip: 'Remember: subtract tail from head coordinates, then reduce to smallest integers. Draw the vector on the cube.', mode: 'dirs_mc' });
    if (areas.length === 0) {
        wg.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text-muted);font-size:15px">🎉 No weak areas detected! Keep practicing to maintain your edge.</div>';
    } else {
        wg.innerHTML = areas.map(function (a) {
            return '<div class="weakness-card">'
                + '<div class="weakness-topic">' + a.icon + ' ' + a.topic + '</div>'
                + '<div class="weakness-score">Current accuracy: ' + a.score + '</div>'
                + '<div class="weakness-tip">' + a.tip + '</div>'
                + '<button class="btn btn-practice-weakness" onclick="startGame(\'' + a.mode + '\')">Practice Now →</button>'
                + '</div>';
        }).join('');
    }
}

function displayAchievments() { } // kept for compatibility — now handled in updateProgressUI

