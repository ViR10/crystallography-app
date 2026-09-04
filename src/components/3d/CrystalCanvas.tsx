import React, { useRef, useEffect } from 'react';
import {
  project,
  drawAxesAndCube,
  drawPlane,
  drawDirection,
  drawAnimatedDirection,
  MAIN_CONFIG,
  CanvasConfig
} from '../../utils/drawingUtils';
import { Coords3D, snapToAxis, toFracStr } from '../../utils/mathUtils';

interface CrystalCanvasProps {
  module: 'planes' | 'directions';
  tab: number;
  h: number;
  k: number;
  l: number;
  u: number;
  v: number;
  w: number;
  originX?: number | null;
  originY?: number | null;
  originZ?: number | null;
  intMode?: 'tail' | 'head' | null;
  intTail?: Coords3D | null;
  intHead?: Coords3D | null;
  rotY: number;
  interactive?: boolean;
  onSelectPoint?: (point: Coords3D) => void;
  onUpdateInfo?: (hklStr: string, interceptsStr: string) => void;
  isAnimated?: boolean;
  animKey?: number;
}

export const CrystalCanvas: React.FC<CrystalCanvasProps> = ({
  module,
  tab,
  h,
  k,
  l,
  u,
  v,
  w,
  originX = null,
  originY = null,
  originZ = null,
  intMode = null,
  intTail = null,
  intHead = null,
  rotY,
  interactive = false,
  onSelectPoint,
  onUpdateInfo,
  isAnimated = false,
  animKey = 0
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number | null>(null);
  const progressRef = useRef<number>(0);

  // Resize canvas for responsiveness
  useEffect(() => {
    const handleResize = () => {
      const cvs = canvasRef.current;
      if (!cvs || !cvs.parentElement) return;
      const containerWidth = cvs.parentElement.clientWidth - 24;
      if (containerWidth < MAIN_CONFIG.width) {
        cvs.style.width = '100%';
        cvs.style.height = 'auto';
      } else {
        cvs.style.width = '';
        cvs.style.height = '';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Canvas drawing loop
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    // Cleanup any existing animation frame when dependencies change
    if (animRef.current) cancelAnimationFrame(animRef.current);
    // We want to restart animation only when animKey changes, not on every rotation
    const lastAnimKey = (canvasRef.current as any)._lastAnimKey;
    if (lastAnimKey !== animKey) {
      progressRef.current = 0;
      (canvasRef.current as any)._lastAnimKey = animKey;
    }

    if (module === 'planes') {
      if (tab === 0) {
        drawPlane(ctx, h, k, l, rotY, MAIN_CONFIG, onUpdateInfo);
      } else {
        // In Compute tab, we calculate from intercepts
        drawPlane(ctx, h, k, l, rotY, MAIN_CONFIG, onUpdateInfo);
      }
    } else {
      // Directions module
      if (tab === 0) {
        if (isAnimated) {
          const speed = 0.015; // fast enough to complete in a few seconds (4 / 0.015 frames)
          
          const drawFrame = () => {
            ctx.clearRect(0, 0, MAIN_CONFIG.width, MAIN_CONFIG.height);
            drawAxesAndCube(ctx, rotY, MAIN_CONFIG);
            
            const ox = originX !== null ? originX : null;
            const oy = originY !== null ? originY : null;
            const oz = originZ !== null ? originZ : null;

            // Use the new drawAnimatedDirection function!
            drawAnimatedDirection(ctx, u, v, w, '#F59E0B', rotY, MAIN_CONFIG, progressRef.current, ox, oy, oz);

            if (progressRef.current < 4.2) { // pad a bit past 4
              progressRef.current += speed;
              animRef.current = requestAnimationFrame(drawFrame);
            }
          };
          drawFrame();
        } else {
          drawAxesAndCube(ctx, rotY, MAIN_CONFIG);
          if (originX !== null || originY !== null || originZ !== null) {
            drawDirection(ctx, u, v, w, '#F59E0B', rotY, MAIN_CONFIG, originX || 0, originY || 0, originZ || 0);
          } else {
            drawDirection(ctx, u, v, w, '#F59E0B', rotY, MAIN_CONFIG);
          }
        }
      } else {
        // Compute tab for Directions
        drawAxesAndCube(ctx, rotY, MAIN_CONFIG);

        // Compute tab interactive dots
        if (intTail) {
          const p = project(intTail.x, intTail.y, intTail.z, rotY, MAIN_CONFIG);
          ctx.beginPath();
          ctx.arc(p.u, p.v, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#d9534f';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        if (intHead) {
          const p = project(intHead.x, intHead.y, intHead.z, rotY, MAIN_CONFIG);
          ctx.beginPath();
          ctx.arc(p.u, p.v, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#F59E0B';
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        if (intTail && intHead) {
          // Draw direction vector arrow exactly between tail and head points
          const p1 = project(intTail.x, intTail.y, intTail.z, rotY, MAIN_CONFIG);
          const p2 = project(intHead.x, intHead.y, intHead.z, rotY, MAIN_CONFIG);
          ctx.beginPath();
          ctx.moveTo(p1.u, p1.v);
          ctx.lineTo(p2.u, p2.v);
          ctx.strokeStyle = '#F59E0B';
          ctx.lineWidth = 4;
          ctx.stroke();

          // Draw arrowhead
          const angle = Math.atan2(p2.v - p1.v, p2.u - p1.u);
          ctx.beginPath();
          ctx.moveTo(p2.u, p2.v);
          ctx.lineTo(p2.u - 12 * Math.cos(angle - Math.PI / 6), p2.v - 12 * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(p2.u - 12 * Math.cos(angle + Math.PI / 6), p2.v - 12 * Math.sin(angle + Math.PI / 6));
          ctx.fillStyle = '#F59E0B';
          ctx.fill();
        }
      }
    }
  }, [module, tab, h, k, l, u, v, w, originX, originY, originZ, intTail, intHead, rotY, onUpdateInfo, isAnimated, animKey]);

  // Click / touch interaction
  const handleInteraction = (clientX: number, clientY: number) => {
    if (!interactive || module !== 'directions' || tab !== 1 || !intMode || !onSelectPoint) return;
    
    const cvs = canvasRef.current;
    if (!cvs) return;
    const rect = cvs.getBoundingClientRect();
    const scaleX = MAIN_CONFIG.width / rect.width;
    const scaleY = MAIN_CONFIG.height / rect.height;

    const mx = (clientX - rect.left) * scaleX;
    const my = (clientY - rect.top) * scaleY;

    let closest: Coords3D | null = null;
    let minDist = 25;
    const fractions = [0, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 1];

    for (const x of fractions) {
      for (const y of fractions) {
        for (const z of fractions) {
          const p = project(x, y, z, rotY, MAIN_CONFIG);
          const dist = Math.hypot(p.u - mx, p.v - my);
          if (dist < minDist) {
            minDist = dist;
            closest = { x, y, z };
          }
        }
      }
    }

    if (closest) {
      const snapped = snapToAxis(closest.x, closest.y, closest.z);
      onSelectPoint(snapped);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    handleInteraction(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches && e.touches[0]) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      className="crystal-canvas"
      width={MAIN_CONFIG.width}
      height={MAIN_CONFIG.height}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{
        display: 'block',
        margin: '0 auto',
        background: 'transparent',
        maxWidth: '100%',
        height: 'auto',
        touchAction: interactive ? 'none' : 'manipulation'
      }}
    />
  );
};
