import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Hero.module.css';

const PARTICLE_COUNT = 80;
const MAX_DIST = 140;
const WAVE_MAX_DIST = 115; // wave propagates only through edges that are clearly visible

// Per-element independent lifecycle — each node/edge has its own fade in/peak/fade out.
// This creates a travelling wave: the back fades as the front advances.
const WAVE_LEVEL_MS  = 85;  // ms between each BFS level activating (speed of the wave)
const WAVE_HOLD_MS   = 160; // how long each element holds at peak after fully fading in
const WAVE_FADE_MS   = 200; // how long each element takes to fade back out
const WAVE_FADE_IN_MS = 50; // how long each element takes to fade in
const WAVE_REST_MIN  = 4000;
const WAVE_REST_MAX  = 8000;

function buildWave(particles, now) {
  const seed = Math.floor(Math.random() * particles.length);
  const levelOf = new Array(particles.length).fill(-1);
  levelOf[seed] = 0;
  const queue = [seed];
  let qi = 0;

  while (qi < queue.length) {
    const cur = queue[qi++];
    const curLevel = levelOf[cur];
    for (let j = 0; j < particles.length; j++) {
      if (levelOf[j] !== -1) continue;
      const dx = particles[cur].x - particles[j].x;
      const dy = particles[cur].y - particles[j].y;
      if (Math.hypot(dx, dy) < WAVE_MAX_DIST) {
        levelOf[j] = curLevel + 1;
        queue.push(j);
      }
    }
  }

  let maxLevel = 0;
  for (const l of levelOf) if (l > maxLevel) maxLevel = l;

  return { levelOf, totalLevels: maxLevel + 1, startTime: now, seed };
}

// Each element has its own activateAt and fadeStart — independent of all others.
// This is what makes it a wave rather than a flash.
function elemAlpha(elapsed, activateAt, fadeStart) {
  if (elapsed < activateAt) return 0;
  const fadeEnd = fadeStart + WAVE_FADE_MS;
  if (elapsed >= fadeEnd) return 0;
  if (elapsed < activateAt + WAVE_FADE_IN_MS) {
    return (elapsed - activateAt) / WAVE_FADE_IN_MS;
  }
  if (elapsed < fadeStart) return 1;
  return Math.max(0, 1 - (elapsed - fadeStart) / WAVE_FADE_MS);
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();
  const rgbRef = useRef('255, 255, 255');
  const highlightRgbRef = useRef('255, 175, 55');
  const edgeOpacityRef = useRef(0.5);

  useEffect(() => {
    const s = getComputedStyle(document.body);
    rgbRef.current = s.getPropertyValue('--particle-rgb').trim();
    highlightRgbRef.current = s.getPropertyValue('--highlight-rgb').trim();
    edgeOpacityRef.current = parseFloat(s.getPropertyValue('--canvas-edge-opacity').trim()) || 0.5;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W, H;
    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      W = w;
      H = h;
    };
    setSize();

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 1.5 + 0.5,
    }));

    const handleResize = () => {
      const scaleX = canvas.offsetWidth / W;
      const scaleY = canvas.offsetHeight / H;
      setSize();
      for (const p of particles) {
        p.x = Math.max(0, Math.min(W, p.x * scaleX));
        p.y = Math.max(0, Math.min(H, p.y * scaleY));
      }
    };
    window.addEventListener('resize', handleResize);

    // Track per-frame: which particles currently have a lit connecting edge.
    // Prevents glowing nodes with no visible wave edge attached.
    const particleEdgeHa = new Float32Array(PARTICLE_COUNT);

    let wave = null;
    let nextWaveAt = performance.now() + WAVE_REST_MIN + Math.random() * (WAVE_REST_MAX - WAVE_REST_MIN);

    const frame = (now) => {
      const rgb = rgbRef.current;
      const hRgb = highlightRgbRef.current;
      const edgeOp = edgeOpacityRef.current;

      for (const p of particles) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      if (!wave && now >= nextWaveAt) wave = buildWave(particles, now);

      let waveElapsed = -1;
      if (wave) {
        waveElapsed = now - wave.startTime;
        // Wave ends when the last element has finished fading.
        const waveEnd = (wave.totalLevels - 1) * WAVE_LEVEL_MS + WAVE_HOLD_MS + WAVE_FADE_MS;
        if (waveElapsed >= waveEnd) {
          wave = null;
          nextWaveAt = now + WAVE_REST_MIN + Math.random() * (WAVE_REST_MAX - WAVE_REST_MIN);
          waveElapsed = -1;
        }
      }

      ctx.clearRect(0, 0, W, H);
      particleEdgeHa.fill(0);

      // ── Edges ─────────────────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist >= MAX_DIST) continue;

          const proximity = 1 - dist / MAX_DIST;
          // Squared proximity: close nodes opaque, drops sharply near MAX_DIST.
          // edgeOp is theme-aware: higher in light mode so bursts remain visible.
          const baseA = proximity * proximity * edgeOp;

          let ha = 0;
          if (waveElapsed >= 0 && dist < WAVE_MAX_DIST) {
            const li = wave.levelOf[i];
            const lj = wave.levelOf[j];
            if (li >= 0 && lj >= 0) {
              // Edge activates halfway between its two endpoint levels.
              const activateAt = Math.min(li, lj) * WAVE_LEVEL_MS + WAVE_LEVEL_MS * 0.5;
              // Edge fades when the HIGHER-level endpoint starts fading — so the
              // edge outlasts the lower node and bridges to the next node naturally.
              const fadeStart = Math.max(li, lj) * WAVE_LEVEL_MS + WAVE_HOLD_MS;
              ha = elemAlpha(waveElapsed, activateAt, fadeStart);
              if (ha > 0) {
                particleEdgeHa[i] = Math.max(particleEdgeHa[i], ha);
                particleEdgeHa[j] = Math.max(particleEdgeHa[j], ha);
              }
            }
          }

          // Crossfade base colour → highlight. Highlight is brighter (2.5× base alpha).
          const highlightA = Math.min(baseA * 2.5, 0.65);
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${rgb},${(1 - ha) * baseA})`;
          ctx.stroke();
          if (ha > 0) {
            ctx.strokeStyle = `rgba(${hRgb},${ha * highlightA})`;
            ctx.stroke(); // same path
          }
        }
      }

      // ── Particles ──────────────────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        let ha = 0;
        if (waveElapsed >= 0) {
          const level = wave.levelOf[i];
          if (level >= 0) {
            const activateAt = level * WAVE_LEVEL_MS;
            const fadeStart  = level * WAVE_LEVEL_MS + WAVE_HOLD_MS;
            const ownHa = elemAlpha(waveElapsed, activateAt, fadeStart);
            // Show highlight only when: timing is active AND node has a live wave edge
            // (or it's the seed, which has no inbound edge).
            if (ownHa > 0 && (level === 0 || particleEdgeHa[i] > 0)) {
              ha = ownHa;
            }
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb},${(1 - ha) * 0.65})`;
        ctx.fill();
        if (ha > 0) {
          ctx.fillStyle = `rgba(${hRgb},${ha * 0.88})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.particleCanvas} />;
}
