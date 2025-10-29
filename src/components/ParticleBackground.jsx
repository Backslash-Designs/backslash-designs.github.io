import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { darken, lighten } from "@mui/material/styles";

/**
 * ParticleBackground
 * Canvas-based subtle particle + linking lines background.
 * Adapted from src/components/testBackground.html into a reusable React component.
 *
 * Props
 * - density: higher value = fewer particles (area / density = count)
 * - speed: base drift speed of particles
 */
export default function ParticleBackground({ density = 14000, speed = 0.8, fixed = false, clipToRef = null, zIndex = 0 }) {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const ctxRef = useRef(null);
  const stateRef = useRef({ DPR: 1, W: 0, H: 0, LINK_DIST: 0, MAX_SPEED: 0, P: [] });
  const reduceMotionRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const clipObserverRef = useRef(null);
  const colorRef = useRef({ fill: [120,220,255], line: [80,190,220] });

  // Parse CSS color (#rgb/#rrggbb/rgb/rgba) into [r,g,b]
  const toRgb = (c) => {
    if (!c) return [31, 111, 235]; // fallback brand blue
    const s = String(c).trim();
    if (s[0] === '#') {
      const hex = s.slice(1);
      if (hex.length === 3) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return [r, g, b];
      } else if (hex.length === 6) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return [r, g, b];
      }
    }
    const m = s.match(/rgba?\s*\(\s*([0-9.]+)\s*[, ]\s*([0-9.]+)\s*[, ]\s*([0-9.]+)/i);
    if (m) {
      return [Number(m[1]), Number(m[2]), Number(m[3])];
    }
    return [31, 111, 235];
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    ctxRef.current = ctx;

    // Pick colors based on theme for better contrast in light mode
    const isLight = theme.palette.mode === 'light';
    const main = theme.palette?.primary?.main || '#1f6feb';
    // In light mode, use a darker variant for contrast; in dark, a slight lighten keeps it airy
    const baseFill = isLight
      ? (theme.palette?.primary?.dark || darken(main, 0.25))
      : (lighten(main, 0.05));
    const baseLine = isLight
      ? (theme.palette?.primary?.dark || darken(main, 0.25))
      : main;
    colorRef.current = { fill: toRgb(baseFill), line: toRgb(baseLine) };

    // Respect prefers-reduced-motion
    const mql = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
    reduceMotionRef.current = !!(mql && mql.matches);
    const onMotionChange = (e) => { reduceMotionRef.current = !!e.matches; };
    try {
      mql && mql.addEventListener && mql.addEventListener('change', onMotionChange);
    } catch (_) {
      // older browsers
      mql && mql.addListener && mql.addListener(onMotionChange);
    }

    const initParticles = (cssW, cssH) => {
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const W = Math.max(1, Math.floor(cssW * DPR));
      const H = Math.max(1, Math.floor(cssH * DPR));
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = cssW + 'px';
      canvas.style.height = cssH + 'px';

      const count = Math.max(4, Math.round((cssW * cssH) / density));
      const P = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * speed * DPR,
        vy: (Math.random() - 0.5) * speed * DPR,
        r: (Math.random() * 1.6 + 0.6) * DPR,
        tw: Math.random() * Math.PI * 2,
      }));

      stateRef.current = {
        DPR,
        W,
        H,
        P,
        LINK_DIST: 120 * DPR,
        MAX_SPEED: 0.07 * DPR,
      };
    };

    const handleResize = () => {
      const useViewport = fixed;
      const parent = canvas.parentElement;
      const rect = useViewport || !parent
        ? { width: window.innerWidth, height: window.innerHeight }
        : parent.getBoundingClientRect();
      initParticles(rect.width, rect.height);
      // Draw once so something appears instantly
      draw(true);
    };

    const updateClip = () => {
      if (!clipToRef || !clipToRef.current) {
        if (canvas.style.clipPath) canvas.style.clipPath = '';
        return;
      }
      const rect = clipToRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const top = Math.max(0, rect.top);
      const left = Math.max(0, rect.left);
      const bottom = Math.max(0, vh - rect.bottom);
      const right = Math.max(0, vw - rect.right);
      canvas.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    };

    const draw = (singlePass = false) => {
      const { W, H, P, LINK_DIST, MAX_SPEED } = stateRef.current;
      if (!ctxRef.current || !W || !H) return;
      const ctx2d = ctxRef.current;
      ctx2d.clearRect(0, 0, W, H);

      for (const p of P) {
        if (!reduceMotionRef.current) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
          p.vx += (Math.random() - 0.5) * 0.002;
          p.vy += (Math.random() - 0.5) * 0.002;
          const s = Math.hypot(p.vx, p.vy);
          if (s > MAX_SPEED) { p.vx *= MAX_SPEED / s; p.vy *= MAX_SPEED / s; }
          p.tw += 0.006;
        }

        const a = 0.35 + 0.25 * Math.sin(p.tw);
        ctx2d.beginPath();
        ctx2d.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        const frgb = colorRef.current.fill;
        ctx2d.fillStyle = `rgba(${frgb[0]},${frgb[1]},${frgb[2]},${a})`;
        ctx2d.fill();
      }

      ctx2d.lineWidth = 0.7 * stateRef.current.DPR;
      for (let i = 0; i < P.length; i++) {
        for (let j = i + 1; j < P.length; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const a = (1 - d / LINK_DIST) * 0.35;
            const lrgb = colorRef.current.line;
            ctx2d.strokeStyle = `rgba(${lrgb[0]},${lrgb[1]},${lrgb[2]},${a})`;
            ctx2d.beginPath();
            ctx2d.moveTo(P[i].x, P[i].y);
            ctx2d.lineTo(P[j].x, P[j].y);
            ctx2d.stroke();
          }
        }
      }

      if (!singlePass) {
        rafRef.current = requestAnimationFrame(() => draw(false));
      }
    };

    // Observe parent size for responsive canvas
    const parent = canvas.parentElement;
    if (fixed) {
      window.addEventListener('resize', handleResize, { passive: true });
      window.addEventListener('scroll', updateClip, { passive: true });
      if (window.ResizeObserver && clipToRef && clipToRef.current) {
        clipObserverRef.current = new ResizeObserver(() => updateClip());
        clipObserverRef.current.observe(clipToRef.current);
      }
    } else if (window.ResizeObserver && parent) {
      resizeObserverRef.current = new ResizeObserver(() => handleResize());
      resizeObserverRef.current.observe(parent);
    } else {
      window.addEventListener('resize', handleResize, { passive: true });
    }

    handleResize();
    updateClip();
    rafRef.current = requestAnimationFrame(() => draw(false));

    return () => {
      cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current && parent) {
        try { resizeObserverRef.current.unobserve(parent); } catch (_) {}
        try { resizeObserverRef.current.disconnect(); } catch (_) {}
      } else {
        window.removeEventListener('resize', handleResize);
      }
      if (fixed) {
        window.removeEventListener('scroll', updateClip);
        if (clipObserverRef.current && clipToRef && clipToRef.current) {
          try { clipObserverRef.current.unobserve(clipToRef.current); } catch (_) {}
          try { clipObserverRef.current.disconnect(); } catch (_) {}
        }
      }
      try {
        mql && mql.removeEventListener && mql.removeEventListener('change', onMotionChange);
      } catch (_) {
        mql && mql.removeListener && mql.removeListener(onMotionChange);
      }
    };
  }, [density, speed, fixed, clipToRef, theme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        width: fixed ? "100vw" : "100%",
        height: fixed ? "100vh" : "100%",
        display: "block",
        position: fixed ? "fixed" : undefined,
        inset: fixed ? 0 : undefined,
        zIndex: fixed ? zIndex : undefined,
        pointerEvents: "none",
      }}
    />
  );
}
