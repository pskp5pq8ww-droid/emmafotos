"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function parse(value: string): { n: number; suffix: string } | null {
  const m = value.match(/^(\d+)(\+?)$/);
  if (!m) return null;
  return { n: parseInt(m[1], 10), suffix: m[2] };
}

/**
 * Animated counter that counts up to `value` when scrolled into view.
 * Powered by GSAP — no rAF/IntersectionObserver boilerplate.
 * Respects prefers-reduced-motion via gsap.matchMedia().
 */
export function AnimatedStat({ value }: { value: string }) {
  const parsed = parse(value);
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!parsed || !ref.current) return;
      const el = ref.current;
      const counter = { val: 0 };

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(counter, {
          val: parsed.n,
          duration: 3.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate() {
            el.textContent = `${Math.round(counter.val)}${parsed!.suffix}`;
          },
          onComplete() {
            // Set the exact string (e.g. "4+") so it matches the source data
            el.textContent = value;
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        el.textContent = value;
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <strong ref={ref}>{parsed ? `0${parsed.suffix}` : value}</strong>;
}
