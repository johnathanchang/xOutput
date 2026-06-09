'use client';

import { useEffect, useRef } from 'react';

const COLUMNS = 24;
const DROPS_PER_COL = 40;

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

export function FallingPattern() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    const syncSize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    syncSize();
    window.addEventListener('resize', syncSize);

    const rng = seededRandom(42);
    const drops = [];
    for (let c = 0; c < COLUMNS; c++) {
      const xFrac = (c + 0.5) / COLUMNS;
      const speed = rng() * 40 + 30;
      for (let d = 0; d < DROPS_PER_COL; d++) {
        drops.push({
          xFrac,
          yFrac: rng() * 2 - 0.5,
          len: rng() * 60 + 20,
          opacity: rng() * 0.3 + 0.05,
          speed,
        });
      }
    }

    let animId;
    let lastTime = 0;

    const draw = (time) => {
      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      ctx.clearRect(0, 0, w, h);

      for (const drop of drops) {
        drop.yFrac += (drop.speed / h) * dt;
        if (drop.yFrac > 1.2) {
          drop.yFrac = -(drop.len / h) - rng() * 0.3;
        }

        const x = drop.xFrac * w;
        const y = drop.yFrac * h;

        const grad = ctx.createLinearGradient(x, y, x, y + drop.len);
        grad.addColorStop(0, 'rgba(100,100,100,0)');
        grad.addColorStop(0.5, `rgba(100,100,100,${drop.opacity})`);
        grad.addColorStop(1, 'rgba(100,100,100,0)');

        ctx.beginPath();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + drop.len);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', syncSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none select-none"
      style={{ zIndex: 0 }}
    />
  );
}

export default FallingPattern;
