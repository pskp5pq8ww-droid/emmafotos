"use client";

import { useEffect, useRef, useState } from "react";

function parse(value: string): { n: number; suffix: string } | null {
  const m = value.match(/^(\d+)(\+?)$/);
  if (!m) return null;
  return { n: parseInt(m[1], 10), suffix: m[2] };
}

export function AnimatedStat({ value }: { value: string }) {
  const parsed = parse(value);
  const [display, setDisplay] = useState(parsed ? `0${parsed.suffix}` : value);
  const ref = useRef<HTMLElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!parsed || ran.current) return;
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || ran.current) return;
        ran.current = true;
        observer.disconnect();

        const target = parsed.n;
        const duration = 1600;
        const start = performance.now();

        function tick(now: number) {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3);
          setDisplay(`${Math.round(eased * target)}${parsed!.suffix}`);
          if (t < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <strong ref={ref}>{display}</strong>;
}
