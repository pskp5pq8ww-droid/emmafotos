"use client";
import { useEffect, useRef } from "react";

const LINES = [
  "const memory = capture();",
  "f / 2.8 · 1/800s · ISO 400",
  "await render(emotion);",
  "frame.expose();",
  "light.compose(f2.8);",
  "return timeless;",
  "shutter.release();",
  "focus(heart);",
  "{ emotion: true }",
  "import { love } from 'life';",
  "const story = [];",
  "lens.bokeh = 'natural';",
  "export default forever;",
  "// Brisbane · Worldwide",
  "async function remember() {}",
  "timestamp: 2024.forever",
  "exposure.value = 'perfect';",
];

interface Fragment {
  x: number;
  y: number;
  text: string;
  opacity: number;
  speed: number;
  life: number;
  maxLife: number;
}

export function CodeRain({ active = true }: { active?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const fragments: Fragment[] = [];
    let frame = 0;
    let raf: number;

    function spawn(): Fragment {
      return {
        x: Math.random() * (canvas?.width ?? 800),
        y: -20 + Math.random() * ((canvas?.height ?? 600) + 40),
        text: LINES[Math.floor(Math.random() * LINES.length)],
        opacity: 0,
        speed: 0.12 + Math.random() * 0.22,
        life: 0,
        maxLife: 240 + Math.random() * 320,
      };
    }

    // Tune density to viewport: small screens get half as many fragments and
    // a smaller cap so the logo stays the protagonist on phones.
    const isMobile = window.innerWidth < 700;
    const initialCount = isMobile ? 7 : 16;
    const maxFragments = isMobile ? 10 : 20;
    const spawnEvery = isMobile ? 140 : 90;

    // Stagger initial fragments so they don't all start at once
    for (let i = 0; i < initialCount; i++) {
      const f = spawn();
      f.life = Math.random() * f.maxLife;
      fragments.push(f);
    }

    function draw() {
      raf = requestAnimationFrame(draw);
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = isMobile
        ? "11px 'JetBrains Mono', 'Courier New', monospace"
        : "12px 'JetBrains Mono', 'Courier New', monospace";

      if (frame % spawnEvery === 0 && fragments.length < maxFragments && activeRef.current) {
        fragments.push(spawn());
      }
      frame++;

      for (let i = fragments.length - 1; i >= 0; i--) {
        const f = fragments[i];
        f.life++;
        f.y += f.speed;

        const p = f.life / f.maxLife;
        if (p < 0.15) f.opacity = p / 0.15;
        else if (p > 0.82) f.opacity = 1 - (p - 0.82) / 0.18;
        else f.opacity = 1;

        ctx.globalAlpha = f.opacity * 0.2;
        ctx.fillStyle = "#ffffff";
        ctx.fillText(f.text, f.x, f.y);

        if (f.life >= f.maxLife) {
          fragments.splice(i, 1);
          if (activeRef.current) fragments.push(spawn());
        }
      }
      ctx.globalAlpha = 1;
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
}
