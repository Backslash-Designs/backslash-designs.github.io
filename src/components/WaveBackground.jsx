import React, { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

/**
 * Animated dotted wave background.
 * Renders an absolutely positioned <canvas> that paints a gently undulating
 * wave field of dots. Designed to sit behind page content (pointer-events: none).
 *
 * Props:
 *  - amplitude: vertical wave displacement in px (default 22)
 *  - wavelength: horizontal distance for one full sine cycle in px (default 180)
 *  - speed: animation speed factor (smaller = slower) (default 0.018)
 *  - dotRadius: base radius of dots in px (default 2.2)
 *  - gap: distance between dot centers in px (default 22)
 *  - opacity: max opacity of the dots (default 0.7)
 *  - color: optional override color for dots (falls back to theme colors)
 *
 * Uses colors defined in ColorModeProvider (theme.palette). In light mode the
 * primary brand blue (#1f6feb) is used; in dark mode near-white for contrast.
 */
export default function WaveBackground({
  amplitude = 22,
  wavelength = 180,
  speed = 0.018,
  dotRadius = 2.2,
  gap = 22,
  opacity = 0.7,
  color,
  className = '',
  style = {},
}) {
  const theme = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let frameId;

    const pickColor = () => {
      if (color) return color;
      return theme.palette.mode === 'dark'
        ? 'rgba(255,255,255,0.9)'
        : theme.palette.primary.main; // #1f6feb per ColorModeProvider
    };

    const drawColor = pickColor();

    function resize() {
      const { offsetWidth, offsetHeight } = canvas;
      // Reset transform before resizing to avoid cumulative scaling
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const dpr = window.devicePixelRatio || 1;
      canvas.width = offsetWidth * dpr;
      canvas.height = offsetHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    resize();
    window.addEventListener('resize', resize);

    let t = 0; // time accumulator

    const render = () => {
      const { width, height } = canvas;
      // width/height are in device pixels; divide by current transform scale (dpr)
      const dpr = window.devicePixelRatio || 1;
      const logicalW = width / dpr;
      const logicalH = height / dpr;

      ctx.clearRect(0, 0, logicalW, logicalH);

      const rows = Math.ceil(logicalH / gap * 1.5) + 2; // Increased for better density in distant areas
      const cols = Math.ceil(logicalW / gap) + 2; // a little overdraw edges

      for (let row = 0; row < rows; row++) {
        // Normalize row for non-linear calculations
        const norm = row / Math.max(rows - 1, 1);
        // Non-linear baseY for perspective compression at distance (top)
        const baseY = logicalH * Math.pow(norm, 1.5);
        // Perspective factor (nearer rows at bottom bigger & more opaque)
        const perspective = norm * 0.8 + 0.2; // From 0.2 at top (distant) to 1.0 at bottom (near)

        for (let col = 0; col < cols; col++) {
          const x = col * gap;
          // Combine two sine waves for richer motion
          const phase = (x / wavelength) * Math.PI * 2;
          const yWave = Math.sin(phase + t) + 0.5 * Math.sin(phase * 0.7 + t * 0.6);
          const yOffset = yWave * amplitude * perspective;

          const y = baseY + yOffset;
          const r = dotRadius * perspective;

          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = drawColor;
          ctx.globalAlpha = opacity * perspective;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
      t += speed * 2; // tweak multiplier for comfortable speed
      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
    };
  }, [amplitude, wavelength, speed, dotRadius, gap, opacity, color, theme.palette.mode, theme.palette.primary.main]);

  return (
    <div
      className={`wave-background ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block', filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 0 2px rgba(255,255,255,0.25))' : 'none' }}
      />
    </div>
  );
}