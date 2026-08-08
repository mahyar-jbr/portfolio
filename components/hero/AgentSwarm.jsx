'use client';

import { useEffect, useRef } from 'react';

// "Swarm of parallel thoughts" — a living field where many agent thought
// fragments spawn, drift, flicker, and decay at once. Rendered on a canvas
// with rAF so it never triggers React re-renders. Monochrome + rare cyan.

// Real agent-flavored fragments (not lorem) — reasoning, tool-calls, tokens,
// graph ops. Feels like multiple agents thinking in parallel.
const FRAGMENTS = [
  'plan →', '▸ reasoning…', 'tool_call(search)', 'retrieve(k=8)', '→ act',
  '{graph}', 'token···', 'await stream', 'embed(1024d)', 'node.invoke()',
  'reflect()', 'σ confidence 0.91', 'vector match', 'ctx ← memory',
  'spawn(agent)', 'observe →', 'plan ∙ act ∙ observe', 'gemini.stream()',
  'langgraph.run', 'state.update()', '✓ deployed', 'rate_limit ok',
  'tool: calculator', 'route → agent_2', 'parse(json)', 'verify(claim)',
  '→ orchestrate', 'fan-out [3]', 'merge results', 'pipe ⇉ token',
];

// One drifting thought fragment with a full lifecycle (fade in → hold → decay).
function makeFragment(w, h, rnd) {
  const life = 1.8 + rnd() * 3.0; // moderate churn
  return {
    text: FRAGMENTS[Math.floor(rnd() * FRAGMENTS.length)],
    x: rnd() * w,
    y: rnd() * h,
    vx: (rnd() - 0.5) * 13, // moderate drift
    vy: (rnd() - 0.5) * 13,
    age: 0,
    life,
    size: 11 + rnd() * 6,
    glitch: rnd() < 0.28, // some flicker, not frantic
    seed: rnd() * 1000,
  };
}

export default function AgentSwarm() {
  const canvasRef = useRef(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // deterministic-ish PRNG
    let s = 12345;
    const rnd = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // population scales with area
    const TARGET = Math.min(62, Math.floor((w * h) / 11000));
    const frags = [];
    for (let i = 0; i < TARGET; i++) {
      const f = makeFragment(w, h, rnd);
      f.age = rnd() * f.life; // stagger initial ages
      frags.push(f);
    }

    let last = performance.now();
    let hidden = false;
    const onVis = () => {
      hidden = document.hidden;
      if (!hidden) {
        last = performance.now();
        loop(last);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    const loop = (now) => {
      if (hidden) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, w, h);
      ctx.textBaseline = 'middle';
      ctx.font = '400 13px ui-monospace, SFMono-Regular, Menlo, monospace';

      for (let i = 0; i < frags.length; i++) {
        const f = frags[i];
        f.age += dt;
        f.x += f.vx * dt;
        f.y += f.vy * dt;

        // lifecycle opacity: ease in, hold, decay
        const t = f.age / f.life;
        let op;
        if (t < 0.15) op = t / 0.15;
        else if (t > 0.7) op = 1 - (t - 0.7) / 0.3;
        else op = 1;
        op = Math.max(0, Math.min(1, op));

        // flicker — chaotic agents
        const flick = f.glitch
          ? 0.55 + 0.45 * Math.sin(now * 0.02 + f.seed) * Math.sin(now * 0.013 + f.seed * 2)
          : 0.85 + 0.15 * Math.sin(now * 0.006 + f.seed);
        const alpha = op * flick;

        // pure monochrome — white/gray fragments, varying brightness
        ctx.font = `400 ${f.size}px ui-monospace, SFMono-Regular, Menlo, monospace`;
        const g = 235;
        ctx.fillStyle = `rgba(${g},${g},${g},${alpha * 0.5})`;
        ctx.fillText(f.text, f.x, f.y);

        // occasional faint connecting tick to the next fragment (parallel link)
        if (i % 5 === 0 && i + 1 < frags.length) {
          const n = frags[i + 1];
          const d = Math.hypot(n.x - f.x, n.y - f.y);
          if (d < 160) {
            ctx.strokeStyle = `rgba(235,235,235,${alpha * 0.07})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(f.x, f.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }

        // respawn when dead or off-canvas
        if (t >= 1 || f.x < -150 || f.x > w + 150 || f.y < -50 || f.y > h + 50) {
          frags[i] = makeFragment(w, h, rnd);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
