import React, { useRef, useEffect } from 'react';
import {
  lDrawCube,
  lDashedLine,
  lDot,
  lLabel,
  lArrow3D,
  lFilledPlane,
  LESSON_CONFIG,
  CanvasConfig
} from '../../utils/drawingUtils';

export interface AnimationSegment {
  type: 'dashedLine' | 'label' | 'dot' | 'arrow' | 'plane';
  x1?: number;
  y1?: number;
  z1?: number;
  x2?: number;
  y2?: number;
  z2?: number;
  x?: number;
  y?: number;
  z?: number;
  r?: number;
  text?: string;
  color?: string;
  label?: string;
  ox?: number;
  oy?: number;
  points3D?: number[][];
  fillColor?: string;
  strokeColor?: string;
  axisPhase?: 'origin' | 'x' | 'y' | 'z' | 'vector'; // phase identifier
}

interface LessonCanvasProps {
  type: 'static' | 'animated';
  drawStatic?: (ctx: CanvasRenderingContext2D, config: CanvasConfig) => void;
  segments?: AnimationSegment[];
  stepIndex: number; // key to restart animations
  isPlaying?: boolean;
  onSegmentChange?: (segIdx: number, phase: 'origin' | 'x' | 'y' | 'z' | 'vector' | undefined) => void;
}

export const LessonCanvas: React.FC<LessonCanvasProps> = ({
  type,
  drawStatic,
  segments = [],
  stepIndex,
  isPlaying = true,
  onSegmentChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Keep tracks of mutable animation counters
  const stateRef = useRef({
    segIdx: 0,
    progress: 0,
    activePhase: undefined as 'origin' | 'x' | 'y' | 'z' | 'vector' | undefined
  });

  // Reset animations when step changes or tab re-opens
  useEffect(() => {
    stateRef.current = {
      segIdx: 0,
      progress: 0,
      activePhase: undefined
    };
  }, [stepIndex, segments]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      const cvs = canvasRef.current;
      if (!cvs || !cvs.parentElement) return;
      const containerWidth = cvs.parentElement.clientWidth - 24;
      if (containerWidth < LESSON_CONFIG.width) {
        cvs.style.width = '100%';
        cvs.style.height = 'auto';
      } else {
        cvs.style.width = '';
        cvs.style.height = '';
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Drawing effect
  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext('2d');
    if (!ctx) return;

    // Clear active animation loop
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (type === 'static' && drawStatic) {
      drawStatic(ctx, LESSON_CONFIG);
    } else if (type === 'animated' && segments.length > 0) {
      const speed = 0.004; // Very slow and clear tracing speed

      const drawFrame = () => {
        lDrawCube(ctx, LESSON_CONFIG);

        const s = stateRef.current;

        // Render completed segments
        for (let i = 0; i < s.segIdx; i++) {
          renderSegment(ctx, segments[i], 1.0, LESSON_CONFIG);
        }

        // Render current segment
        if (s.segIdx < segments.length) {
          const currentSeg = segments[s.segIdx];

          // Trigger segment phase change callbacks
          if (s.activePhase !== currentSeg.axisPhase) {
            s.activePhase = currentSeg.axisPhase;
            if (onSegmentChange) {
              onSegmentChange(s.segIdx, currentSeg.axisPhase);
            }
          }

          if (currentSeg.type === 'dashedLine') {
            renderSegment(ctx, currentSeg, s.progress, LESSON_CONFIG);
            
            // Advance tracing ONLY if playing
            if (isPlaying) {
              s.progress += speed;
              if (s.progress >= 1) {
                s.progress = 0;
                s.segIdx++;
              }
            }
          } else {
            // Instant elements like dots or labels
            renderSegment(ctx, currentSeg, 1.0, LESSON_CONFIG);
            if (isPlaying) {
              s.segIdx++;
              s.progress = 0;
            }
          }
        }

        // Request next frame
        animationRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, drawStatic, segments, stepIndex, isPlaying, onSegmentChange]);

  const renderSegment = (
    ctx: CanvasRenderingContext2D,
    seg: AnimationSegment,
    prog: number,
    config: CanvasConfig
  ) => {
    const color = seg.color || '#333';
    switch (seg.type) {
      case 'dot':
        if (seg.x !== undefined && seg.y !== undefined && seg.z !== undefined) {
          lDot(ctx, seg.x, seg.y, seg.z, color, seg.r || 6, config);
        }
        break;
      case 'dashedLine':
        if (
          seg.x1 !== undefined &&
          seg.y1 !== undefined &&
          seg.z1 !== undefined &&
          seg.x2 !== undefined &&
          seg.y2 !== undefined &&
          seg.z2 !== undefined
        ) {
          const cx = seg.x1 + (seg.x2 - seg.x1) * prog;
          const cy = seg.y1 + (seg.y2 - seg.y1) * prog;
          const cz = seg.z1 + (seg.z2 - seg.z1) * prog;
          lDashedLine(ctx, seg.x1, seg.y1, seg.z1, cx, cy, cz, color, config);
          
          // Draw a clear highlighted tracking dot for the trace head
          lDot(ctx, cx, cy, cz, '#ef4444', 8, config);
          
          // Inner dot for a target effect
          lDot(ctx, cx, cy, cz, '#ffffff', 4, config);
        }
        break;
      case 'label':
        if (seg.x !== undefined && seg.y !== undefined && seg.z !== undefined && seg.text) {
          lLabel(ctx, seg.x, seg.y, seg.z, seg.text, color, seg.ox, seg.oy, config);
        }
        break;
      case 'arrow':
        if (
          seg.x1 !== undefined &&
          seg.y1 !== undefined &&
          seg.z1 !== undefined &&
          seg.x2 !== undefined &&
          seg.y2 !== undefined &&
          seg.z2 !== undefined
        ) {
          lArrow3D(ctx, seg.x1, seg.y1, seg.z1, seg.x2, seg.y2, seg.z2, color, seg.label || null, config);
        }
        break;
      case 'plane':
        if (seg.points3D) {
          lFilledPlane(ctx, seg.points3D, seg.fillColor, seg.strokeColor, config);
        }
        break;
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={LESSON_CONFIG.width}
      height={LESSON_CONFIG.height}
      style={{ display: 'block', margin: '0 auto', background: 'transparent' }}
    />
  );
};
