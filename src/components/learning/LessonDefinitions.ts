import {
  lDrawCube,
  lDot,
  lLabel,
  lDashedLine,
  lArrow3D,
  lFilledPlane,
  CanvasConfig
} from '../../utils/drawingUtils';
import { AnimationSegment } from './LessonCanvas';

export interface LessonStep {
  html: string;
  type: 'static' | 'animated';
  drawStatic?: (ctx: CanvasRenderingContext2D, config: CanvasConfig) => void;
  segments?: AnimationSegment[];
  interactive?: string;
}

export interface LessonDef {
  level: number;
  title: string;
  tag: string;
  icon: string;
  desc: string;
  steps?: LessonStep[];
}

export const HUB_LESSONS: Record<'directions' | 'planes', LessonDef[]> = {
  directions: [
    { level: 1, title: 'What is a Crystallographic Direction?', tag: 'Concept', icon: '🧭', desc: 'Understand the meaning of [uvw] vector notation.' },
    { level: 2, title: 'Crystallographic Direction Indices → Drawing', tag: 'Guided', icon: '✏️', desc: 'Given [uvw], animate the crystallographic vector step by step.' },
    { level: 3, title: 'Drawing → Crystallographic Direction Indices', tag: 'Interactive', icon: '🔍', desc: 'Read tail & head coordinates, compute [uvw] indices.' },
    { level: 4, title: 'Negative Crystallographic Direction Indices', tag: 'Advanced', icon: '⊖', desc: 'Bar notation, shifting origin, negative [uvw] components.' }
  ],
  planes: [
    { level: 1, title: 'What is a Crystallographic Plane?', tag: 'Concept', icon: '🏔️', desc: 'Understand Miller indices (hkl) and crystal planes.' },
    { level: 2, title: 'Crystallographic Plane Indices → Drawing', tag: 'Guided', icon: '✏️', desc: 'Given (hkl), find intercepts and draw the crystallographic plane.' },
    { level: 3, title: 'Drawing → Crystallographic Plane Indices', tag: 'Interactive', icon: '🔍', desc: 'Read intercept points, take reciprocals, get (hkl) indices.' },
    { level: 4, title: 'Zero Index Crystallographic Planes', tag: 'Advanced', icon: '∥', desc: 'When h, k, or l = 0: plane parallel to that coordinate axis.' }
  ]
};

// ─── REDESIGNED DIRECTIONS TRACK LESSON STEPS ───

const dirLesson1 = (): LessonStep[] => [
  {
    html: '<h3>1. The Concept of a Vector in a Crystal</h3><p>Imagine a crystal lattice as a repeating 3D grid of atoms. A <strong>direction</strong> is simply a vector—like an arrow pointing from one lattice point (atom) to another.</p><p>We describe this vector by its components along the primary coordinate axes of the unit cell: <span style="color:#005A9E"><strong>x</strong></span>, <span style="color:#107C10"><strong>y</strong></span>, and <span style="color:#A4262C"><strong>z</strong></span>.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
    }
  },
  {
    html: '<h3>2. The 3D Coordinate System</h3><p>Unlike standard math coordinates where Y points up, crystallography uses a specialized right-handed system:</p><ul><li><span style="color:#005A9E"><strong>x-axis</strong></span>: Points <strong>out of the screen</strong> (down-left diagonal).</li><li><span style="color:#107C10"><strong>y-axis</strong></span>: Points <strong>to the right</strong>.</li><li><span style="color:#A4262C"><strong>z-axis</strong></span>: Points <strong>vertically up</strong>.</li></ul><p>We analyze these inside a single unit cell (a single cube).</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
    }
  },
  {
    html: '<h3>3. Unit Cell Bounds</h3><p>We limit our analysis to a single unit cell where coordinates on each axis range from <strong>0 to 1</strong>.</p><p>By default, our vector\'s <strong>tail</strong> starts at the <strong>origin (0,0,0)</strong>, which is the back-left-bottom corner of the cell.</p><p>Click <strong>Play Live Animation</strong> below to see the starting tail point highlight on the cube.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 8, axisPhase: 'origin' },
      { type: 'label', x: 0, y: 0, z: 0, text: 'Origin Tail (0,0,0)', color: '#d9534f', ox: 10, oy: -12, axisPhase: 'origin' }
    ]
  },
  {
    html: '<h3>4. What is [uvw] Notation?</h3><p>We write crystallographic directions in square brackets as <strong><code>[u v w]</code></strong>:</p><ul><li><strong>u</strong> represents the step distance along the <strong>x-axis</strong>.</li><li><strong>v</strong> represents the step distance along the <strong>y-axis</strong>.</li><li><strong>w</strong> represents the step distance along the <strong>z-axis</strong>.</li></ul><div class="lex-rule">⚠️ Important: We write them as space-separated integers, with no commas between components!</div>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 0, 0, 0, '#d9534f', 6, config);
    }
  },
  {
    html: '<h3>5. Tracing Direction [1 0 0]</h3><p>Let\'s draw <code>[1 0 0]</code>. This means:</p><ul><li>Move <strong>1 unit along x</strong> (front-left direction).</li><li>Move <strong>0 units along y</strong>.</li><li>Move <strong>0 units along z</strong>.</li></ul><p>Watch the trace below. The line moves forward along the bottom-left edge to the head at (1,0,0).</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dot', x: 1, y: 0, z: 0, color: '#5cb85c', r: 7, axisPhase: 'x' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#F59E0B', label: '[100]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>6. Tracing Direction [0 1 0]</h3><p>Now let\'s draw <code>[0 1 0]</code>. This vector only travels along the Y axis:</p><ul><li>Move <strong>0 units along x</strong>.</li><li>Move <strong>1 unit along y</strong> (right direction).</li><li>Move <strong>0 units along z</strong>.</li></ul><p>The vector moves directly from the origin to the back-right corner (0,1,0).</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 0, y2: 1, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dot', x: 0, y: 1, z: 0, color: '#5cb85c', r: 7, axisPhase: 'y' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 0, y2: 1, z2: 0, color: '#F59E0B', label: '[010]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>7. Tracing Direction [0 0 1]</h3><p>Finally, <code>[0 0 1]</code> represents a vertical vector:</p><ul><li>Move <strong>0 units along x</strong>.</li><li>Move <strong>0 units along y</strong>.</li><li>Move <strong>1 unit along z</strong> (up direction).</li></ul><p>The head finishes at the top corner (0,0,1).</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 1, color: '#A4262C', axisPhase: 'z' },
      { type: 'dot', x: 0, y: 0, z: 1, color: '#5cb85c', r: 7, axisPhase: 'z' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 0, y2: 0, z2: 1, color: '#F59E0B', label: '[001]', axisPhase: 'vector' }
    ]
  }
];

const dirLesson2 = (): LessonStep[] => [
  {
    html: '<h3>1. Combining Coordinate Directions</h3><p>In most crystal structures, directions are not aligned with just a single edge; they travel across multiple dimensions inside the cell.</p><p>We draw them by chaining the x, y, and z step distances together, tail-to-head.</p>',
    type: 'static',
    drawStatic: (ctx, config) => { lDrawCube(ctx, config); }
  },
  {
    html: '<h3>2. Drawing Face Diagonal [1 1 0]</h3><p>Let\'s draw direction <code>[1 1 0]</code>:</p><ol><li>Place tail at origin (0,0,0).</li><li>Move <strong>1 unit along X</strong>.</li><li>Move <strong>1 unit along Y</strong> from that point.</li><li>Move <strong>0 units along Z</strong>.</li></ol><p>The head finishes at (1,1,0), making a diagonal vector across the bottom face of the cube.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 1, y2: 1, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dot', x: 1, y: 1, z: 0, color: '#5cb85c', r: 7, axisPhase: 'y' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 1, y2: 1, z2: 0, color: '#F59E0B', label: '[110]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>3. Drawing Face Diagonal [1 0 1]</h3><p>Next, let\'s draw <code>[1 0 1]</code>. This time we bypass Y:</p><ol><li>Start at (0,0,0).</li><li>Move <strong>1 unit along X</strong>.</li><li>Move <strong>0 units along Y</strong>.</li><li>Move <strong>1 unit along Z</strong>.</li></ol><p>This creates a diagonal vector climbing the front-left face of the cube.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 1, y2: 0, z2: 1, color: '#A4262C', axisPhase: 'z' },
      { type: 'dot', x: 1, y: 0, z: 1, color: '#5cb85c', r: 7, axisPhase: 'z' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 1, color: '#F59E0B', label: '[101]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>4. Drawing Face Diagonal [0 1 1]</h3><p>For <code>[0 1 1]</code>: X is bypassed.</p><ol><li>Start at (0,0,0).</li><li>Move <strong>1 unit along Y</strong>.</li><li>Move <strong>1 unit along Z</strong>.</li></ol><p>This vector ascends diagonally along the right-hand face of the unit cell.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 0, y2: 1, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dashedLine', x1: 0, y1: 1, z1: 0, x2: 0, y2: 1, z2: 1, color: '#A4262C', axisPhase: 'z' },
      { type: 'dot', x: 0, y: 1, z: 1, color: '#5cb85c', r: 7, axisPhase: 'z' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 0, y2: 1, z2: 1, color: '#F59E0B', label: '[011]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>5. Drawing Body Diagonal [1 1 1]</h3><p>A body diagonal connects opposite corners, running directly through the center of the unit cell. Let\'s draw <code>[1 1 1]</code>:</p><ol><li>Start at (0,0,0).</li><li>Move <strong>1 along X</strong>, then <strong>1 along Y</strong>, and finally <strong>1 along Z</strong>.</li></ol><p>Watch the trace below: the vector terminates at the far top-right corner.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 1, y2: 1, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dashedLine', x1: 1, y1: 1, z1: 0, x2: 1, y2: 1, z2: 1, color: '#A4262C', axisPhase: 'z' },
      { type: 'dot', x: 1, y: 1, z: 1, color: '#5cb85c', r: 7, axisPhase: 'z' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 1, y2: 1, z2: 1, color: '#F59E0B', label: '[111]', axisPhase: 'vector' }
    ]
  }
];

const dirLesson3 = (): LessonStep[] => [
  {
    html: '<h3>1. The Smallest Integer Rule</h3><p>In crystallography, direction indices are always written as the <strong>smallest possible integers</strong>. The ratios between the components must be preserved.</p><p>For example, if you draw a vector that travels 2 units in X and 2 units in Y, the indices are reduced: <code>[2 2 0]</code> is divided by 2 to become <code>[1 1 0]</code>.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lArrow3D(ctx, 0, 0, 0, 1, 1, 0, '#F59E0B', '[110] (Reduced)', config);
    }
  },
  {
    html: '<h3>2. How to Draw Fractional Vectors</h3><p>What if a vector terminates at a fractional position? E.g., a vector starting at (0,0,0) and ending at <strong>(1, 0.5, 0)</strong>.</p><p>We cannot write fractions like <code>[1 ½ 0]</code> inside direction brackets!</p><p>We must convert the components to integers first.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0.5, 0, '#5cb85c', 7, config);
    }
  },
  {
    html: '<h3>3. Finding the Least Common Multiple (LCM)</h3><p>To convert components (1, ½, 0) to integers:</p><ol><li>Find the denominators: here we have 1 and 2.</li><li>The Least Common Multiple (LCM) is <strong>2</strong>.</li><li>Multiply all components by 2: <strong><code>1×2 = 2</code>, &nbsp; <code>½×2 = 1</code>, &nbsp; <code>0×2 = 0</code></strong>.</li></ol><p>This gives the integer direction indices: <strong><code>[2 1 0]</code></strong>.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
    }
  },
  {
    html: '<h3>4. Fitting [2 1 0] in the Unit Cell</h3><p>If we try to draw <code>[2 1 0]</code> directly, moving 2 units in X goes outside our single unit cell boundary (since X max is 1).</p><p><strong>Rule</strong>: Divide the integers by the maximum component (2) to get the drawing endpoint.</p><ul><li>Draw head at: (2/2, 1/2, 0/2) = <strong>(1, 0.5, 0)</strong>.</li></ul><p>The direction indices remain <strong><code>[2 1 0]</code></strong>, but it is drawn scaled inside the cell.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0.5, 0, '#5cb85c', 7, config);
    }
  },
  {
    html: '<h3>5. Trace Animation of [2 1 0]</h3><p>Click Play below to see the scaled drawing of <code>[2 1 0]</code>:</p><ul><li>Start at origin (0,0,0).</li><li>Move <strong>1 unit along X</strong>.</li><li>Move <strong>0.5 units along Y</strong>.</li></ul><p>The vector terminates on the front-right edge at (1, 0.5, 0).</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 1, y2: 0.5, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dot', x: 1, y: 0.5, z: 0, color: '#5cb85c', r: 7, axisPhase: 'y' },
      { type: 'arrow', x1: 0, y1: 0, z1: 0, x2: 1, y2: 0.5, z2: 0, color: '#F59E0B', label: '[210]', axisPhase: 'vector' }
    ]
  }
];

const dirLesson4 = (): LessonStep[] => [
  {
    html: '<h3>1. Negative Components &amp; Bar Notation</h3><p>When a direction vector points in a negative direction along any axis, we write it with a <strong>bar (overline)</strong> above the digit.</p><p>For example, a vector pointing in the negative X direction is written as: <strong><code>[1̄ 0 0]</code></strong> (read as "bar 1, zero, zero").</p><p>In standard text, we write this as <code>[-1 0 0]</code>.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lArrow3D(ctx, 1, 0, 0, 0, 0, 0, '#e67e22', '[1̄00]', config);
      lDot(ctx, 1, 0, 0, '#d9534f', 7, config);
      lDot(ctx, 0, 0, 0, '#5cb85c', 7, config);
    }
  },
  {
    html: '<h3>2. The Boundary Problem</h3><p>If we try to draw <code>[1̄ 0 0]</code> starting the tail at the origin (0,0,0), the vector would move to (-1,0,0), which lies completely outside our unit cell cube.</p><p>We need a method to draw this vector while keeping all points inside the unit cell bounds.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 0, 0, 0, '#d9534f', 7, config);
    }
  },
  {
    html: `
      <h3>3. The Origin Shifting Rule (Finding the Tail)</h3>
      <p>The hardest part of drawing negative indices is finding where to start. To keep our vector inside the cell, we must <strong>shift the tail (origin)</strong> away from (0,0,0) before we begin drawing.</p>
      
      <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 4px; margin: 16px 0;">
        <strong>The Rule:</strong> Look at your indices.
        <ul style="margin-top: 8px; margin-bottom: 0;">
          <li>If X is negative (<code>ū</code>): Shift your starting point <strong>+1 along X</strong>.</li>
          <li>If Y is negative (<code>v̄</code>): Shift your starting point <strong>+1 along Y</strong>.</li>
          <li>If Z is negative (<code>w̄</code>): Shift your starting point <strong>+1 along Z</strong>.</li>
        </ul>
      </div>
      
      <p>This creates a temporary "shifted origin" so that when you draw backwards (negatively), you stay exactly inside the unit cell!</p>
    `,
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
    }
  },
  {
    html: '<h3>4. Shifting Example: [1̄ 0 0]</h3><p>Let\'s trace <code>[1̄ 0 0]</code>:</p><ol><li>Since X is negative, shift tail to <strong>(1,0,0)</strong>.</li><li>Move <strong>-1 along X</strong> (reaches x=0).</li><li>The head terminates at <strong>(0,0,0)</strong>.</li></ol><p>Both tail (1,0,0) and head (0,0,0) remain inside the cell!</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0, 0, '#d9534f', 8, config);
      lLabel(ctx, 1, 0, 0, 'New Tail (1,0,0)', '#d9534f', 10, 14, config);
      lDot(ctx, 0, 0, 0, '#5cb85c', 8, config);
      lLabel(ctx, 0, 0, 0, 'Head (0,0,0)', '#107C10', 10, -12, config);
    }
  },
  {
    html: '<h3>5. Trace Animation of [1̄ 0 0]</h3><p>Click Play to see the traced negative X vector:</p><ul><li>Tail starts at shifted position (1,0,0).</li><li>Animates <strong>-1 unit along X</strong> back to the origin.</li></ul><p>The vector arrow points backwards along the X-axis.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 1, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dot', x: 0, y: 0, z: 0, color: '#5cb85c', r: 7, axisPhase: 'x' },
      { type: 'arrow', x1: 1, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0, color: '#e67e22', label: '[1̄00]', axisPhase: 'vector' }
    ]
  },
  {
    html: '<h3>6. Shifting Example: [1̄ 1 1]</h3><p>Let\'s trace a mixed vector: <code>[1̄ 1 1]</code> (u=-1, v=1, w=1):</p><ol><li>Shift tail to <strong>(1,0,0)</strong> because X is negative.</li><li>Move <strong>-1 along X</strong> (reaches x=0).</li><li>Move <strong>+1 along Y</strong> (reaches y=1).</li><li>Move <strong>+1 along Z</strong> (reaches z=1).</li></ol><p>The head finishes at coordinate <strong>(0,1,1)</strong>. All points are inside cell!</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0, 0, '#d9534f', 7, config);
      lDot(ctx, 0, 1, 1, '#5cb85c', 7, config);
      lArrow3D(ctx, 1, 0, 0, 0, 1, 1, '#F59E0B', '[1̄11]', config);
    }
  },
  {
    html: '<h3>7. Trace Animation of [1̄ 1 1]</h3><p>Watch the complete trace animation for <code>[1̄ 1 1]</code>:</p><ul><li>Start at shifted tail (1,0,0).</li><li>Move <strong>-1 along X</strong>, then <strong>+1 along Y</strong>, and finally <strong>+1 along Z</strong>.</li></ul><p>The vector points from the bottom-front corner to the top-back-right corner.</p>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 1, y: 0, z: 0, color: '#d9534f', r: 7, axisPhase: 'origin' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 0, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 0, x2: 0, y2: 1, z2: 0, color: '#107C10', axisPhase: 'y' },
      { type: 'dashedLine', x1: 0, y1: 1, z1: 0, x2: 0, y2: 1, z2: 1, color: '#A4262C', axisPhase: 'z' },
      { type: 'dot', x: 0, y: 1, z: 1, color: '#5cb85c', r: 7, axisPhase: 'z' },
      { type: 'arrow', x1: 1, y1: 0, z1: 0, x2: 0, y2: 1, z2: 1, color: '#F59E0B', label: '[1̄11]', axisPhase: 'vector' }
    ]
  }
];

// Helper projection that uses lesson settings directly
function projectLabel(x: number, y: number, z: number, config: CanvasConfig) {
  const angleX = Math.PI / 6;
  const vecX = { u: -Math.cos(angleX) * config.a * 0.8, v: Math.sin(angleX) * config.a * 0.8 };
  const vecY = { u: config.a, v: 0 };
  const vecZ = { u: 0, v: -config.a };
  return {
    u: config.ox + x * vecX.u + y * vecY.u + z * vecZ.u,
    v: config.oy + x * vecX.v + y * vecY.v + z * vecZ.v
  };
}

export function getLessonSteps(track: 'directions' | 'planes', level: number): LessonStep[] {
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
  return [{ html: '<p>Lesson steps not found.</p>', type: 'static', drawStatic: (ctx, config) => { lDrawCube(ctx, config); } }];
}

// ─── PLANES LESSON STEPS (RETAINED FROM PREVIOUS BUILD) ───

const planeLesson1 = (): LessonStep[] => [
  {
    html: '<h3>What is a Crystallographic Plane?</h3><p>A <strong>crystallographic plane</strong> is a flat plane cutting through the crystal lattice. We describe it by its <strong>Miller indices (h k l)</strong>.</p><p>Key idea: Miller indices are the <strong>reciprocals of the intercepts</strong> the plane makes with the x, y, z axes.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 6, config);
      lDot(ctx, 0, 1, 0, '#107C10', 6, config);
      lDot(ctx, 0, 0, 1, '#A4262C', 6, config);
    }
  },
  {
    html: '<h3>The (100) Crystallographic Plane</h3><p>The <code>(1 0 0)</code> crystallographic plane has:</p><ul><li>x-intercept = 1/h = 1/1 = <strong>1</strong></li><li>y-intercept = 1/k = 1/0 = <strong>∞</strong> (parallel to y)</li><li>z-intercept = 1/l = 1/0 = <strong>∞</strong> (parallel to z)</li></ul><p>This plane cuts x at 1 and is vertical (parallel to y and z).</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 'rgba(0,90,158,0.3)', '#005A9E', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lLabel(ctx, 1, 0, 0, 'x=1', '#005A9E', 8, 14, config);
    }
  },
  {
    html: '<h3>Intercepts → Crystallographic Plane Indices</h3><p>To find Miller indices from intercepts:</p><ol><li>Find intercepts on x, y, z (in units of a,b,c)</li><li>Take reciprocals</li><li>Multiply by LCM to clear fractions</li><li>Reduce to smallest integers</li></ol>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 6, config);
      lLabel(ctx, 1, 0, 0, 'p=1→h=1', '#005A9E', 8, 14, config);
      lDot(ctx, 0, 1, 0, '#107C10', 6, config);
      lLabel(ctx, 0, 1, 0, 'q=1→k=1', '#107C10', 8, -8, config);
      lDot(ctx, 0, 0, 1, '#A4262C', 6, config);
      lLabel(ctx, 0, 0, 1, 'r=1→l=1', '#A4262C', 8, 0, config);
    }
  },
  {
    html: '<h3>Crystallographic Directions vs. Crystallographic Planes</h3><table class="lex-table"><tr><th>Property</th><th>Crystallographic Direction [uvw]</th><th>Crystallographic Plane (hkl)</th></tr><tr><td>Notation</td><td>Square [ ]</td><td>Round ( )</td></tr><tr><td>Indices represent</td><td>Vector components</td><td>Reciprocal intercepts</td></tr><tr><td>Family notation</td><td>⟨uvw⟩</td><td>{hkl}</td></tr><tr><td>Reduction</td><td>Smallest integers</td><td>No common factor</td></tr></table>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.25)', '#6366f1', config);
      lArrow3D(ctx, 0, 0, 0, 0.5, 0.5, 0.5, '#e67e22', '[111]', config);
    }
  }
];

const planeLesson2 = (): LessonStep[] => [
  {
    html: '<h3>Step 1: Start with Crystallographic Plane (1 1 1)</h3><p>We want to draw crystallographic plane <code>(h k l) = (1 1 1)</code>. Begin with an empty cube.</p>',
    type: 'static',
    drawStatic: (ctx, config) => { lDrawCube(ctx, config); }
  },
  {
    html: '<h3>Step 2: Compute x-intercept</h3><p>x-intercept = 1/h = 1/1 = <strong>1</strong>. Mark the point on the x-axis at x=1.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0, 0, '#005A9E', 8, config);
      lLabel(ctx, 1, 0, 0, '1/h = 1', '#005A9E', 8, 14, config);
    }
  },
  {
    html: '<h3>Step 3: Compute y-intercept</h3><p>y-intercept = 1/k = 1/1 = <strong>1</strong>. Mark the point on the y-axis at y=1.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lLabel(ctx, 1, 0, 0, '1/h=1', '#005A9E', 8, 14, config);
      lDot(ctx, 0, 1, 0, '#107C10', 8, config);
      lLabel(ctx, 0, 1, 0, '1/k=1', '#107C10', 8, -12, config);
    }
  },
  {
    html: '<h3>Step 4: Compute z-intercept</h3><p>z-intercept = 1/l = 1/1 = <strong>1</strong>. Mark the point on the z-axis at z=1.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lLabel(ctx, 1, 0, 0, '1/h=1', '#005A9E', 8, 14, config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      lLabel(ctx, 0, 1, 0, '1/k=1', '#107C10', 8, -12, config);
      lDot(ctx, 0, 0, 1, '#A4262C', 8, config);
      lLabel(ctx, 0, 0, 1, '1/l=1', '#A4262C', 8, -2, config);
    }
  },
  {
    html: '<h3>Step 5: Connect the intercepts to form Crystallographic Plane</h3><p>Draw the plane through all three intercept points: (1,0,0), (0,1,0), (0,0,1). This is the classic (111) plane — the octahedral plane.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      lDot(ctx, 0, 0, 1, '#A4262C', 7, config);
      ctx.font = 'bold 16px Inter,Arial';
      ctx.fillStyle = '#6366f1';
      const mid = projectLabel(0.33, 0.33, 0.33, config);
      ctx.fillText('(111)', mid.u + 5, mid.v - 5);
    }
  },
  {
    html: '<h3>Step 6: Trace Animation of (1 1 1)</h3><p>Watch the complete trace animation for the <code>(1 1 1)</code> plane:</p><ul><li>Plot the x, y, and z intercepts.</li><li>Connect the intercepts to trace the plane.</li></ul>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 1, y: 0, z: 0, color: '#005A9E', r: 7, axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 0, y2: 1, z2: 0, color: '#107C10', axisPhase: 'x' },
      { type: 'dot', x: 0, y: 1, z: 0, color: '#107C10', r: 7, axisPhase: 'y' },
      { type: 'dashedLine', x1: 0, y1: 1, z1: 0, x2: 0, y2: 0, z2: 1, color: '#A4262C', axisPhase: 'y' },
      { type: 'dot', x: 0, y: 0, z: 1, color: '#A4262C', r: 7, axisPhase: 'z' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 1, x2: 1, y2: 0, z2: 0, color: '#005A9E', axisPhase: 'z' },
      { type: 'plane', points3D: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], fillColor: 'rgba(99,102,241,0.3)', strokeColor: '#6366f1', axisPhase: 'vector' }
    ]
  }
];

const planeLesson3 = (): LessonStep[] => [
  {
    html: '<h3>Reading a Drawn Crystallographic Plane</h3><p>When a crystallographic plane is drawn on a cube, to find (hkl):</p><ol><li>Find where the plane crosses each axis (intercepts p, q, r)</li><li>Take reciprocals: h=1/p, k=1/q, l=1/r</li><li>Clear fractions by multiplying by LCM</li><li>Reduce to smallest integers</li></ol>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], 'rgba(99,102,241,0.3)', '#6366f1', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      lDot(ctx, 0, 0, 1, '#A4262C', 7, config);
    }
  },
  {
    html: '<h3>Example: Find (hkl) for this Crystallographic Plane</h3><p>Plane cuts: x at 2, y at 1, z at ∞ (parallel to z).</p><p>Intercepts: p=2, q=1, r=∞</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]], 'rgba(16,124,16,0.25)', '#107C10', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lLabel(ctx, 1, 0, 0, 'x=1', '#005A9E', 8, 14, config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      lLabel(ctx, 0, 1, 0, 'y=1', '#107C10', 8, -12, config);
      lLabel(ctx, 0.5, 0.5, 1, 'parallel to z', '#A4262C', 0, 12, config);
    }
  },
  {
    html: '<h3>Take Reciprocals</h3><p>Intercepts: p=1, q=1, r=∞</p><p>Reciprocals:<br>h = 1/p = 1/1 = <strong>1</strong><br>k = 1/q = 1/1 = <strong>1</strong><br>l = 1/r = 1/∞ = <strong>0</strong></p><p style="font-size:20px;text-align:center;font-weight:700;color:#107C10;margin:12px 0">(1 1 0)</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [1, 0, 1], [0, 1, 1], [0, 1, 0]], 'rgba(16,124,16,0.3)', '#107C10', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      ctx.font = 'bold 16px Inter,Arial';
      ctx.fillStyle = '#107C10';
      const mid = projectLabel(0.5, 0.5, 0.5, config);
      ctx.fillText('(110)', mid.u + 5, mid.v);
    }
  },
  {
    html: '<h3>Fractional Intercepts for Crystallographic Plane</h3><p>Plane cuts: x at 2, y at 1, z at ∞ (p=2, q=1, r=∞)</p><p>Reciprocals: h=½, k=1, l=0<br>Multiply by 2: <strong>h=1, k=2, l=0</strong></p><p style="font-size:20px;text-align:center;font-weight:700;color:#6366f1;margin:12px 0">(1 2 0)</p><div class="lex-rule">Always multiply all reciprocals by the same factor to get integers.</div>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [1, 0, 1], [0, 0.5, 1], [0, 0.5, 0]], 'rgba(99,102,241,0.3)', '#6366f1', config);
      lDot(ctx, 1, 0, 0, '#005A9E', 7, config);
      lLabel(ctx, 1, 0, 0, 'x=1', '#005A9E', 8, 14, config);
      lDot(ctx, 0, 0.5, 0, '#107C10', 7, config);
      lLabel(ctx, 0, 0.5, 0, 'y=½', '#107C10', 8, -10, config);
      ctx.font = 'bold 15px Inter,Arial';
      ctx.fillStyle = '#6366f1';
      const mid = projectLabel(0.5, 0.25, 0.5, config);
      ctx.fillText('(120)', mid.u, mid.v);
    }
  },
  {
    html: '<h3>Trace Animation of (1 2 0)</h3><p>Watch the trace animation for the <code>(1 2 0)</code> plane:</p><ul><li>Plot x intercept at 1.</li><li>Plot y intercept at .</li><li>Plane is parallel to z.</li></ul>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 1, y: 0, z: 0, color: '#005A9E', r: 7, axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 0, x2: 0, y2: 0.5, z2: 0, color: '#107C10', axisPhase: 'x' },
      { type: 'dot', x: 0, y: 0.5, z: 0, color: '#107C10', r: 7, axisPhase: 'y' },
      { type: 'dashedLine', x1: 0, y1: 0.5, z1: 0, x2: 0, y2: 0.5, z2: 1, color: '#A4262C', axisPhase: 'y' },
      { type: 'dashedLine', x1: 0, y1: 0.5, z1: 1, x2: 1, y2: 0, z2: 1, color: '#005A9E', axisPhase: 'z' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 1, x2: 1, y2: 0, z2: 0, color: '#107C10', axisPhase: 'z' },
      { type: 'plane', points3D: [[1, 0, 0], [1, 0, 1], [0, 0.5, 1], [0, 0.5, 0]], fillColor: 'rgba(99,102,241,0.3)', strokeColor: '#6366f1', axisPhase: 'vector' }
    ]
  }
];

const planeLesson4 = (): LessonStep[] => [
  {
    html: '<h3>What does a Zero Index Mean in a Crystallographic Plane?</h3><p>When an index is <strong>0</strong>, it means the plane is <strong>parallel to that axis</strong> — it never intersects it (intercept = ∞).</p><ul><li>h=0 → parallel to x-axis</li><li>k=0 → parallel to y-axis</li><li>l=0 → parallel to z-axis</li></ul>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]], 'rgba(164,38,44,0.25)', '#A4262C', config);
      lLabel(ctx, 0.5, 0, 0.5, 'Parallel to y (k=0)', '#A4262C', 0, 20, config);
    }
  },
  {
    html: '<h3>The (001) Crystallographic Plane — Horizontal</h3><p><code>(0 0 1)</code>: l=1 means z-intercept = 1. h=0, k=0 means the plane never crosses x or y.</p><p>This is a <strong>horizontal plane</strong> at z=1 — the top face of the cube.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], 'rgba(164,38,44,0.35)', '#A4262C', config);
      lDot(ctx, 0, 0, 1, '#A4262C', 7, config);
      lLabel(ctx, 0, 0, 1, 'z=1', '#A4262C', 8, 0, config);
      ctx.font = 'bold 15px Inter,Arial';
      ctx.fillStyle = '#A4262C';
      const mid = projectLabel(0.5, 0.5, 1, config);
      ctx.fillText('(001)', mid.u - 15, mid.v - 10);
    }
  },
  {
    html: '<h3>The (010) Crystallographic Plane — Side Face</h3><p><code>(0 1 0)</code>: k=1 means y-intercept = 1. Parallel to x and z.</p><p>This is a <strong>vertical side face</strong> of the cube — perpendicular to the y-axis.</p>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], 'rgba(16,124,16,0.35)', '#107C10', config);
      lDot(ctx, 0, 1, 0, '#107C10', 7, config);
      lLabel(ctx, 0, 1, 0, 'y=1', '#107C10', 8, -12, config);
      ctx.font = 'bold 15px Inter,Arial';
      ctx.fillStyle = '#107C10';
      const mid = projectLabel(0.5, 1, 0.5, config);
      ctx.fillText('(010)', mid.u + 5, mid.v);
    }
  },
  {
    html: '<h3>Family of Planes {100}</h3><p>The family <code>{100}</code> contains all equivalent planes: (100), (010), (001) and their negatives.</p><p>In cubic crystals, all these planes are equivalent by symmetry.</p><div class="lex-rule">Curly braces {} denote a family of symmetrically equivalent planes.</div>',
    type: 'static',
    drawStatic: (ctx, config) => {
      lDrawCube(ctx, config);
      lFilledPlane(ctx, [[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]], 'rgba(0,90,158,0.2)', '#005A9E', config);
      lFilledPlane(ctx, [[0, 1, 0], [1, 1, 0], [1, 1, 1], [0, 1, 1]], 'rgba(16,124,16,0.2)', '#107C10', config);
      lFilledPlane(ctx, [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], 'rgba(164,38,44,0.2)', '#A4262C', config);
      ctx.font = 'bold 13px Inter,Arial';
      ctx.fillStyle = '#005A9E';
      const p100 = projectLabel(1, 0.5, 0.5, config);
      ctx.fillText('(100)', p100.u + 5, p100.v);
      ctx.fillStyle = '#107C10';
      const p010 = projectLabel(0.5, 1, 0.5, config);
      ctx.fillText('(010)', p010.u + 5, p010.v);
      ctx.fillStyle = '#A4262C';
      const p001 = projectLabel(0.5, 0.5, 1, config);
      ctx.fillText('(001)', p001.u - 15, p001.v - 5);
    }
  },
  {
    html: '<h3>Trace Animation of (0 0 1)</h3><p>Watch the trace animation for the <code>(0 0 1)</code> plane:</p><ul><li>Plot z intercept at 1.</li><li>Plane is parallel to x and y.</li></ul>',
    type: 'animated',
    segments: [
      { type: 'dot', x: 0, y: 0, z: 1, color: '#A4262C', r: 7, axisPhase: 'z' },
      { type: 'dashedLine', x1: 0, y1: 0, z1: 1, x2: 1, y2: 0, z2: 1, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 1, y1: 0, z1: 1, x2: 1, y2: 1, z2: 1, color: '#107C10', axisPhase: 'y' },
      { type: 'dashedLine', x1: 1, y1: 1, z1: 1, x2: 0, y2: 1, z2: 1, color: '#005A9E', axisPhase: 'x' },
      { type: 'dashedLine', x1: 0, y1: 1, z1: 1, x2: 0, y2: 0, z2: 1, color: '#107C10', axisPhase: 'y' },
      { type: 'plane', points3D: [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]], fillColor: 'rgba(164,38,44,0.35)', strokeColor: '#A4262C', axisPhase: 'vector' }
    ]
  }
];
