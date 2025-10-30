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
export default function ParticleBackground({ density = 14000, speed = 0.8, fixed = false, clipToRef = null, zIndex = 0, hoverRadius = 50, hoverStrength = 1, inertiaDecay = 0.94 }) {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const rafRef = useRef(0);
  const ctxRef = useRef(null);
  const stateRef = useRef({ DPR: 1, W: 0, H: 0, LINK_DIST: 0, MAX_SPEED: 0, P: [] });
  const reduceMotionRef = useRef(false);
  const resizeObserverRef = useRef(null);
  const clipObserverRef = useRef(null);
  const colorRef = useRef({ fill: [120,220,255], line: [80,190,220] });
  const mouseRef = useRef({ x: 0, y: 0, active: false, lastX: 0, lastY: 0, lastT: 0, impulseX: 0, impulseY: 0 });

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
        ivx: 0,
        ivy: 0,
      }));

      stateRef.current = {
        DPR,
        W,
        H,
        P,
        LINK_DIST: 120 * DPR,
        MAX_SPEED: 0.07 * DPR,
        HOVER_DIST: Math.max(20, hoverRadius) * DPR,
        INERTIA_DECAY: Math.min(0.995, Math.max(0.85, inertiaDecay)),
        IMPULSE_MAX: 1.2 * DPR,
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
        // Without a clip target, mouse containment will rely on the canvas rect
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
      const { W, H, P, LINK_DIST, MAX_SPEED, HOVER_DIST, DPR, INERTIA_DECAY, IMPULSE_MAX } = stateRef.current;
      if (!ctxRef.current || !W || !H) return;
      const ctx2d = ctxRef.current;
      ctx2d.clearRect(0, 0, W, H);

      // Snapshot current impulse and consume it this frame
      let impulseX = 0, impulseY = 0;
      if (!reduceMotionRef.current && mouseRef.current.active) {
        impulseX = mouseRef.current.impulseX || 0;
        impulseY = mouseRef.current.impulseY || 0;
        // consume so it applies once; inertia continues via per-particle ivx/ivy decay
        mouseRef.current.impulseX = 0;
        mouseRef.current.impulseY = 0;
      }

      for (const p of P) {
        if (!reduceMotionRef.current) {
          // base drift + inertial component from mouse impulses
          p.x += p.vx + p.ivx; p.y += p.vy + p.ivy;
          if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
          if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
          p.vx += (Math.random() - 0.5) * 0.002;
          p.vy += (Math.random() - 0.5) * 0.002;
          const s = Math.hypot(p.vx, p.vy);
          if (s > MAX_SPEED) { p.vx *= MAX_SPEED / s; p.vy *= MAX_SPEED / s; }
          // decay inertial velocity over time to create sliding that slows down
          p.ivx *= INERTIA_DECAY;
          p.ivy *= INERTIA_DECAY;
          const is = Math.hypot(p.ivx, p.ivy);
          if (is > IMPULSE_MAX) { p.ivx *= IMPULSE_MAX / is; p.ivy *= IMPULSE_MAX / is; }
          if (Math.abs(p.ivx) < 0.0002) p.ivx = 0;
          if (Math.abs(p.ivy) < 0.0002) p.ivy = 0;
          p.tw += 0.006;
        }
        // Apply one-shot impulse based on mouse movement vector
        if (!reduceMotionRef.current && mouseRef.current.active && (impulseX !== 0 || impulseY !== 0)) {
          const mx = mouseRef.current.x;
          const my = mouseRef.current.y;
          const dx = p.x - mx;
          const dy = p.y - my;
          const d = Math.hypot(dx, dy);
          if (d > 0 && d < HOVER_DIST) {
            const falloff = 1 - d / HOVER_DIST; // 0..1
            // impulse direction is along mouse movement
            p.ivx += impulseX * falloff;
            p.ivy += impulseY * falloff;
          }
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

    // Pointer tracking (respect clip area if provided)
    const getContainmentRect = () => {
      if (clipToRef && clipToRef.current) return clipToRef.current.getBoundingClientRect();
      return canvas.getBoundingClientRect();
    };
    const onPointerMove = (e) => {
      const rect = getContainmentRect();
      const x = e.clientX, y = e.clientY;
      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      mouseRef.current.active = inside;
      if (inside) {
        const DPR = stateRef.current.DPR || 1;
        const cx = (x - rect.left) * DPR;
        const cy = (y - rect.top) * DPR;
        // compute mouse velocity and derive an impulse vector
        const now = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
        const lastT = mouseRef.current.lastT || now;
        const dt = Math.max(8, now - lastT); // ms, clamp to avoid huge values
        const lastX = mouseRef.current.lastX || cx;
        const lastY = mouseRef.current.lastY || cy;
        const mdx = cx - lastX;
        const mdy = cy - lastY;
        const vx = mdx / dt; // px per ms in canvas space
        const vy = mdy / dt;
        // scale impulse by strength and DPR, cap to avoid extreme kicks
        const scale = Math.max(0, hoverStrength) * 18; // tune: 18 gives a nice feel
        let ix = vx * scale;
        let iy = vy * scale;
        const mag = Math.hypot(ix, iy);
        const cap = stateRef.current.IMPULSE_MAX || (1.2 * DPR);
        if (mag > cap) { ix *= cap / mag; iy *= cap / mag; }
        mouseRef.current.impulseX = ix;
        mouseRef.current.impulseY = iy;
        // update cursor position and history
        mouseRef.current.x = cx;
        mouseRef.current.y = cy;
        mouseRef.current.lastX = cx;
        mouseRef.current.lastY = cy;
        mouseRef.current.lastT = now;
      }
    };
    const onTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      onPointerMove(t);
    };
    const onPointerLeaveWindow = (e) => {
      // When leaving the window entirely, deactivate
      if (e.relatedTarget == null) {
        mouseRef.current.active = false;
        mouseRef.current.impulseX = 0;
        mouseRef.current.impulseY = 0;
      }
    };
    window.addEventListener('mousemove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseout', onPointerLeaveWindow, { passive: true });

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
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseout', onPointerLeaveWindow);
      try {
        mql && mql.removeEventListener && mql.removeEventListener('change', onMotionChange);
      } catch (_) {
        mql && mql.removeListener && mql.removeListener(onMotionChange);
      }
    };
  }, [density, speed, fixed, clipToRef, theme, hoverRadius, hoverStrength]);

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
