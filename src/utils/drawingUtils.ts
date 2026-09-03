import { toFracStr, formatHKL, formatUVW, getDrawingCoords, autoReduceIndices } from './mathUtils';

export interface CanvasConfig {
  width: number;
  height: number;
  a: number; // axis length
  ox: number; // origin x
  oy: number; // origin y
}

export const MAIN_CONFIG: CanvasConfig = {
  width: 600,
  height: 500,
  a: 180,
  ox: 600 / 2 - 20,
  oy: 500 / 2 + 80
};

export const LESSON_CONFIG: CanvasConfig = {
  width: 520,
  height: 420,
  a: 150,
  ox: 520 / 2 - 10,
  oy: 420 / 2 + 65
};

export function project(
  x: number,
  y: number,
  z: number,
  rotY: number,
  config: CanvasConfig
): { u: number; v: number } {
  const rad = (rotY * Math.PI) / 180;
  const rx = x * Math.cos(rad) - y * Math.sin(rad);
  const ry = x * Math.sin(rad) + y * Math.cos(rad);
  const rz = z;

  const angleX = Math.PI / 6;
  const vecX = { u: -Math.cos(angleX) * config.a * 0.8, v: Math.sin(angleX) * config.a * 0.8 };
  const vecY = { u: config.a, v: 0 };
  const vecZ = { u: 0, v: -config.a };

  return {
    u: config.ox + rx * vecX.u + ry * vecY.u + rz * vecZ.u,
    v: config.oy + rx * vecX.v + ry * vecY.v + rz * vecZ.v
  };
}

export function drawAxesAndCube(
  ctx: CanvasRenderingContext2D,
  rotY: number,
  config: CanvasConfig
) {
  ctx.clearRect(0, 0, config.width, config.height);

  const pts = {
    v000: project(0, 0, 0, rotY, config),
    v100: project(1, 0, 0, rotY, config),
    v010: project(0, 1, 0, rotY, config),
    v110: project(1, 1, 0, rotY, config),
    v001: project(0, 0, 1, rotY, config),
    v101: project(1, 0, 1, rotY, config),
    v011: project(0, 1, 1, rotY, config),
    v111: project(1, 1, 1, rotY, config)
  };

  // Draw dashed inner lines (axes & back borders)
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#A19F9D';
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(pts.v010.u, pts.v010.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.moveTo(pts.v001.u, pts.v001.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.stroke();
  ctx.setLineDash([]);

  // Draw front edges of the cube
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#323130';
  ctx.beginPath();
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v110.u, pts.v110.v); ctx.lineTo(pts.v010.u, pts.v010.v);
  ctx.moveTo(pts.v001.u, pts.v001.v); ctx.lineTo(pts.v101.u, pts.v101.v); ctx.lineTo(pts.v111.u, pts.v111.v);
  ctx.lineTo(pts.v011.u, pts.v011.v); ctx.closePath();
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v101.u, pts.v101.v);
  ctx.moveTo(pts.v110.u, pts.v110.v); ctx.lineTo(pts.v111.u, pts.v111.v);
  ctx.moveTo(pts.v010.u, pts.v010.v); ctx.lineTo(pts.v011.u, pts.v011.v);
  ctx.stroke();

  // Draw X, Y, Z axes vectors
  drawArrow3D(ctx, 0, 0, 0, 1.4, 0, 0, '#005A9E', null, rotY, config);
  drawArrow3D(ctx, 0, 0, 0, 0, 1.4, 0, '#107C10', null, rotY, config);
  drawArrow3D(ctx, 0, 0, 0, 0, 0, 1.4, '#A4262C', null, rotY, config);

  ctx.font = 'bold 16px Inter,Arial';
  const px = project(1.5, 0, 0, rotY, config);
  ctx.fillStyle = '#005A9E';
  ctx.fillText('x \u2192', px.u - 10, px.v + 4);

  const py = project(0, 1.5, 0, rotY, config);
  ctx.fillStyle = '#107C10';
  ctx.fillText('y \u2192', py.u + 5, py.v + 4);

  const pz = project(0, 0, 1.5, rotY, config);
  ctx.fillStyle = '#A4262C';
  ctx.fillText('z \u2191', pz.u + 5, pz.v + 4);
}

export function drawArrow3D(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  color: string,
  label: string | null = null,
  rotY: number,
  config: CanvasConfig
) {
  const p1 = project(x1, y1, z1, rotY, config);
  const p2 = project(x2, y2, z2, rotY, config);

  const angle = Math.atan2(p2.v - p1.v, p2.u - p1.u);
  ctx.beginPath();
  ctx.moveTo(p1.u, p1.v);
  ctx.lineTo(p2.u - 3 * Math.cos(angle), p2.v - 3 * Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p2.u, p2.v);
  ctx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
  ctx.fillStyle = color;
  ctx.fill();

  if (label) {
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(label, p2.u + 15, p2.v);
  }
}

export function drawPlane(
  ctx: CanvasRenderingContext2D,
  h: number,
  k: number,
  l: number,
  rotY: number,
  config: CanvasConfig,
  updateCallback?: (hklStr: string, interceptsStr: string) => void
) {
  drawAxesAndCube(ctx, rotY, config);

  if (updateCallback) {
    const formatLabel = (v: number) => (isNaN(v) ? "" : toFracStr(v));
    const hklStr = formatHKL(formatLabel(h), formatLabel(k), formatLabel(l));
    const interceptsStr = `${h === 0 ? '∞' : toFracStr(1 / h)}, ${k === 0 ? '∞' : toFracStr(1 / k)}, ${l === 0 ? '∞' : toFracStr(1 / l)}`;
    updateCallback(hklStr, interceptsStr);
  }

  if (h === 0 && k === 0 && l === 0) return;

  // Auto-divide by smallest non-zero index for large inputs
  const reduced = autoReduceIndices(h, k, l);
  const hR = reduced.h, kR = reduced.k, lR = reduced.l;

  let n = 1;
  if (hR < 0 || kR < 0 || lR < 0) {
    n = (hR < 0 ? hR : 0) + (kR < 0 ? kR : 0) + (lR < 0 ? lR : 0) + 1;
  }

  const edges = [
    [[0, 0, 0], [1, 0, 0]], [[1, 0, 0], [1, 1, 0]], [[1, 1, 0], [0, 1, 0]], [[0, 1, 0], [0, 0, 0]],
    [[0, 0, 1], [1, 0, 1]], [[1, 0, 1], [1, 1, 1]], [[1, 1, 1], [0, 1, 1]], [[0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 0, 1]], [[1, 0, 0], [1, 0, 1]], [[1, 1, 0], [1, 1, 1]], [[0, 1, 0], [0, 1, 1]]
  ];

  let points3D: { x: number; y: number; z: number }[] = [];
  edges.forEach(edge => {
    const A = edge[0];
    const B = edge[1];
    const denom = hR * (B[0] - A[0]) + kR * (B[1] - A[1]) + lR * (B[2] - A[2]);
    const num = n - (hR * A[0] + kR * A[1] + lR * A[2]);
    if (denom !== 0) {
      const t = num / denom;
      if (t >= -0.0001 && t <= 1.0001) {
        points3D.push({
          x: A[0] + t * (B[0] - A[0]),
          y: A[1] + t * (B[1] - A[1]),
          z: A[2] + t * (B[2] - A[2])
        });
      }
    }
  });

  // Filter duplicate intersection points
  points3D = points3D.filter((p, i, self) =>
    i === self.findIndex(t =>
      Math.abs(t.x - p.x) < 1e-4 &&
      Math.abs(t.y - p.y) < 1e-4 &&
      Math.abs(t.z - p.z) < 1e-4
    )
  );

  if (points3D.length < 3) return;

  const points2D = points3D.map(p => project(p.x, p.y, p.z, rotY, config));
  let cx = 0, cy = 0;
  points2D.forEach(p => { cx += p.u; cy += p.v; });
  cx /= points2D.length;
  cy /= points2D.length;

  points2D.sort((a, b) => Math.atan2(a.v - cy, a.u - cx) - Math.atan2(b.v - cy, b.u - cx));

  ctx.beginPath();
  ctx.moveTo(points2D[0].u, points2D[0].v);
  for (let i = 1; i < points2D.length; i++) {
    ctx.lineTo(points2D[i].u, points2D[i].v);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(0,150,255,0.6)';
  ctx.fill();

  ctx.strokeStyle = '#005A9E';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#D83B01';
  points2D.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.u, p.v, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

export function drawDirection(
  ctx: CanvasRenderingContext2D,
  u: number,
  v: number,
  w: number,
  color = '#F59E0B',
  rotY: number,
  config: CanvasConfig,
  ox: number | null = null,
  oy: number | null = null,
  oz: number | null = null
) {
  let coords;
  if (ox !== null && oy !== null && oz !== null) {
    let dx = u, dy = v, dz = w;
    const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
    if (maxAbs > 0) {
      dx = u / maxAbs;
      dy = v / maxAbs;
      dz = w / maxAbs;
    }
    
    // Universal Rule Lock: Clip the line strictly to the 0..1 bounding box of the unit cell
    let t = 1.0;
    if (dx > 0 && ox + dx * t > 1) t = (1 - ox) / dx;
    if (dx < 0 && ox + dx * t < 0) t = (0 - ox) / dx;
    if (dy > 0 && oy + dy * t > 1) t = (1 - oy) / dy;
    if (dy < 0 && oy + dy * t < 0) t = (0 - oy) / dy;
    if (dz > 0 && oz + dz * t > 1) t = (1 - oz) / dz;
    if (dz < 0 && oz + dz * t < 0) t = (0 - oz) / dz;
    t = Math.max(0, t);

    coords = { tail: { x: ox, y: oy, z: oz }, head: { x: ox + dx * t, y: oy + dy * t, z: oz + dz * t } };
  } else {
    coords = getDrawingCoords(u, v, w);
  }
  if (!coords) return;

  const p1 = project(coords.tail.x, coords.tail.y, coords.tail.z, rotY, config);
  const p2 = project(coords.head.x, coords.head.y, coords.head.z, rotY, config);

  ctx.beginPath();
  ctx.arc(p1.u, p1.v, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#d9534f';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  const angle = Math.atan2(p2.v - p1.v, p2.u - p1.u);
  ctx.beginPath();
  ctx.moveTo(p1.u, p1.v);
  ctx.lineTo(p2.u - 3 * Math.cos(angle), p2.v - 3 * Math.sin(angle));
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(p2.u, p2.v);
  ctx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
  ctx.fillStyle = color;
  ctx.fill();
}

// ─── LESSON / LEARNING CANVAS HELPERS (rotY = 0) ───

export function lDrawCube(ctx: CanvasRenderingContext2D, config: CanvasConfig) {
  ctx.clearRect(0, 0, config.width, config.height);

  const pts = {
    v000: project(0, 0, 0, 0, config),
    v100: project(1, 0, 0, 0, config),
    v010: project(0, 1, 0, 0, config),
    v110: project(1, 1, 0, 0, config),
    v001: project(0, 0, 1, 0, config),
    v101: project(1, 0, 1, 0, config),
    v011: project(0, 1, 1, 0, config),
    v111: project(1, 1, 1, 0, config)
  };

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#C8C6C4';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(pts.v010.u, pts.v010.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.moveTo(pts.v001.u, pts.v001.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v000.u, pts.v000.v);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.lineWidth = 2;
  ctx.strokeStyle = '#323130';
  ctx.beginPath();
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v110.u, pts.v110.v); ctx.lineTo(pts.v010.u, pts.v010.v);
  ctx.moveTo(pts.v001.u, pts.v001.v); ctx.lineTo(pts.v101.u, pts.v101.v); ctx.lineTo(pts.v111.u, pts.v111.v);
  ctx.lineTo(pts.v011.u, pts.v011.v); ctx.closePath();
  ctx.moveTo(pts.v100.u, pts.v100.v); ctx.lineTo(pts.v101.u, pts.v101.v);
  ctx.moveTo(pts.v110.u, pts.v110.v); ctx.lineTo(pts.v111.u, pts.v111.v);
  ctx.moveTo(pts.v010.u, pts.v010.v); ctx.lineTo(pts.v011.u, pts.v011.v);
  ctx.stroke();

  drawArrow3D(ctx, 0, 0, 0, 1.4, 0, 0, '#005A9E', null, 0, config);
  drawArrow3D(ctx, 0, 0, 0, 0, 1.4, 0, '#107C10', null, 0, config);
  drawArrow3D(ctx, 0, 0, 0, 0, 0, 1.4, '#A4262C', null, 0, config);

  ctx.font = 'bold 16px Inter,Arial';
  const px = project(1.5, 0, 0, 0, config);
  ctx.fillStyle = '#005A9E';
  ctx.fillText('x \u2192', px.u - 10, px.v + 4);

  const py = project(0, 1.5, 0, 0, config);
  ctx.fillStyle = '#107C10';
  ctx.fillText('y \u2192', py.u + 5, py.v + 4);

  const pz = project(0, 0, 1.5, 0, config);
  ctx.fillStyle = '#A4262C';
  ctx.fillText('z \u2191', pz.u + 5, pz.v + 4);
}

export function lDot(ctx: CanvasRenderingContext2D, x: number, y: number, z: number, color: string, r = 6, config: CanvasConfig) {
  const p = project(x, y, z, 0, config);
  ctx.beginPath();
  ctx.arc(p.u, p.v, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
}

export function lDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, color: string, config: CanvasConfig) {
  const p1 = project(x1, y1, z1, 0, config);
  const p2 = project(x2, y2, z2, 0, config);
  ctx.save();
  ctx.setLineDash([7, 5]);
  ctx.beginPath();
  ctx.moveTo(p1.u, p1.v);
  ctx.lineTo(p2.u, p2.v);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
}

export function lLabel(ctx: CanvasRenderingContext2D, x: number, y: number, z: number, text: string, color = '#323130', offsetX = 14, offsetY = 4, config: CanvasConfig) {
  const p = project(x, y, z, 0, config);
  ctx.font = 'bold 14px Inter,Arial';
  ctx.fillStyle = color;
  ctx.fillText(text, p.u + offsetX, p.v + offsetY);
}

export function lArrow3D(
  ctx: CanvasRenderingContext2D,
  x1: number, y1: number, z1: number,
  x2: number, y2: number, z2: number,
  color: string,
  label: string | null = null,
  config: CanvasConfig
) {
  drawArrow3D(ctx, x1, y1, z1, x2, y2, z2, color, label, 0, config);
}

export function lFilledPlane(ctx: CanvasRenderingContext2D, points3D: number[][], fillColor = 'rgba(99,102,241,0.35)', strokeColor = '#6366f1', config: CanvasConfig) {
  if (points3D.length < 3) return;
  const pts2 = points3D.map(p => project(p[0], p[1], p[2], 0, config));
  const cx = pts2.reduce((s, p) => s + p.u, 0) / pts2.length;
  const cy = pts2.reduce((s, p) => s + p.v, 0) / pts2.length;
  pts2.sort((a, b) => Math.atan2(a.v - cy, a.u - cx) - Math.atan2(b.v - cy, b.u - cx));

  ctx.beginPath();
  ctx.moveTo(pts2[0].u, pts2[0].v);
  for (let i = 1; i < pts2.length; i++) {
    ctx.lineTo(pts2[i].u, pts2[i].v);
  }
  ctx.closePath();
  ctx.fillStyle = fillColor;
  ctx.fill();

  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2.5;
  ctx.stroke();
}
export function drawAnimatedDirection(
  ctx: CanvasRenderingContext2D,
  u: number,
  v: number,
  w: number,
  color: string,
  rotY: number,
  config: CanvasConfig,
  progress: number,
  ox: number | null = null,
  oy: number | null = null,
  oz: number | null = null
) {
  let coords;
  if (ox !== null && oy !== null && oz !== null) {
    let dx = u, dy = v, dz = w;
    const maxAbs = Math.max(Math.abs(u), Math.abs(v), Math.abs(w));
    if (maxAbs > 0) { dx = u / maxAbs; dy = v / maxAbs; dz = w / maxAbs; }
    let t = 1.0;
    if (dx > 0 && ox + dx * t > 1) t = (1 - ox) / dx;
    if (dx < 0 && ox + dx * t < 0) t = (0 - ox) / dx;
    if (dy > 0 && oy + dy * t > 1) t = (1 - oy) / dy;
    if (dy < 0 && oy + dy * t < 0) t = (0 - oy) / dy;
    if (dz > 0 && oz + dz * t > 1) t = (1 - oz) / dz;
    if (dz < 0 && oz + dz * t < 0) t = (0 - oz) / dz;
    t = Math.max(0, t);
    coords = { tail: { x: ox, y: oy, z: oz }, head: { x: ox + dx * t, y: oy + dy * t, z: oz + dz * t } };
  } else {
    coords = getDrawingCoords(u, v, w);
  }
  if (!coords) return;

  const tX = coords.tail.x;
  const tY = coords.tail.y;
  const tZ = coords.tail.z;
  const hX = coords.head.x;
  const hY = coords.head.y;
  const hZ = coords.head.z;

  const dx = hX - tX;
  const dy = hY - tY;
  const dz = hZ - tZ;

  // 1. Draw Tail Dot
  const pTail = project(tX, tY, tZ, rotY, config);
  ctx.beginPath();
  ctx.arc(pTail.u, pTail.v, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#d9534f';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Helper to draw dashed line trace
  const drawTrace = (sx: number, sy: number, sz: number, ex: number, ey: number, ez: number, p: number, c: string) => {
    if (p <= 0) return;
    const currentX = sx + (ex - sx) * Math.min(p, 1);
    const currentY = sy + (ey - sy) * Math.min(p, 1);
    const currentZ = sz + (ez - sz) * Math.min(p, 1);
    const startP = project(sx, sy, sz, rotY, config);
    const endP = project(currentX, currentY, currentZ, rotY, config);
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.moveTo(startP.u, startP.v);
    ctx.lineTo(endP.u, endP.v);
    ctx.strokeStyle = c;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Phase 0-1: X trace
  drawTrace(tX, tY, tZ, tX + dx, tY, tZ, progress, '#005A9E');
  
  // Phase 1-2: Y trace
  if (progress > 1) {
    drawTrace(tX + dx, tY, tZ, tX + dx, tY + dy, tZ, progress - 1, '#107C10');
  }

  // Phase 2-3: Z trace
  if (progress > 2) {
    drawTrace(tX + dx, tY + dy, tZ, hX, hY, hZ, progress - 2, '#A4262C');
  }

  // Phase 3-4: Draw final arrow
  if (progress > 3) {
    const arrowP = Math.min(1, progress - 3);
    const currentHx = tX + dx * arrowP;
    const currentHy = tY + dy * arrowP;
    const currentHz = tZ + dz * arrowP;
    
    const pCurrent = project(currentHx, currentHy, currentHz, rotY, config);
    
    // Calculate angle for arrowhead and line shortening
    const p2 = project(hX, hY, hZ, rotY, config);
    const angle = Math.atan2(p2.v - pTail.v, p2.u - pTail.u);
    
    ctx.beginPath();
    ctx.moveTo(pTail.u, pTail.v);
    
    if (arrowP >= 1) {
      // Shorten the final line slightly so the flat cap hides under the arrowhead
      ctx.lineTo(pCurrent.u - 3 * Math.cos(angle), pCurrent.v - 3 * Math.sin(angle));
    } else {
      ctx.lineTo(pCurrent.u, pCurrent.v);
    }
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arrowhead only when fully drawn
    if (arrowP >= 1) {
      ctx.beginPath();
      ctx.moveTo(p2.u, p2.v);
      ctx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
      ctx.fillStyle = color;
      ctx.fill();
    }
  }
}
