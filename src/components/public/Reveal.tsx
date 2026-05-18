"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, type PropsWithChildren, type CSSProperties } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type RevealProps = PropsWithChildren<{
  delay?: number;
  style?: CSSProperties;
  className?: string;
}>;

/**
 * Drop-in Reveal — fades + lifts children into view on scroll.
 * Uses GSAP ScrollTrigger (once) + gsap.matchMedia for reduced-motion.
 * Replaces the previous Framer Motion implementation.
 */
export function Reveal({ children, delay = 0, style, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current!, {
          opacity: 0,
          y: 28,
          filter: "blur(8px)",
          duration: 0.9,
          delay,
          ease: "expo.out",
          clearProps: "filter",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 88%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
}

/**
 * Stagger / StaggerItem — kept for API compatibility.
 * With GSAP each child is its own Reveal; these are plain wrappers.
 */
export function Stagger({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

export function StaggerItem({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: CSSProperties }>) {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}
