"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, type PropsWithChildren } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * HeroParallax — wraps hero inner content and applies two effects on scroll:
 *  1. Subtle upward drift (y: -60px) — the text floats relative to the hero bg.
 *  2. Opacity fade-out as the hero exits the viewport.
 *
 * Both effects use scrub:true so they're tied 1:1 to scroll position.
 * Respects prefers-reduced-motion via gsap.matchMedia().
 */
export function HeroParallax({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 700px)",
        },
        (ctx) => {
          const { motion, desktop } = ctx.conditions as {
            motion: boolean;
            desktop: boolean;
          };

          if (!motion) return;

          const el = ref.current!;
          // The hero section is two levels up: el → heroInner → section.hero
          const hero = el.parentElement?.parentElement ?? el.parentElement;

          // Effect 1 — text drifts up slightly while hero is in view
          gsap.to(el, {
            y: desktop ? -60 : -30,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });

          // Effect 2 — fade + additional lift as hero scrolls out
          gsap.to(el, {
            opacity: 0,
            y: desktop ? -110 : -55,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "55% top",   // start fading once past midpoint of hero
              end: "bottom top",
              scrub: true,
            },
          });
        },
      );

      return () => mm.revert();
    },
    { scope: ref },
  );

  return <div ref={ref}>{children}</div>;
}
