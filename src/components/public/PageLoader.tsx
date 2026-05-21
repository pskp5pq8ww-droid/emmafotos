"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "./LogoMark";
import styles from "./Public.module.css";

gsap.registerPlugin(useGSAP);

/**
 * Entrance animation overlay — shows a dark screen with the ER logo
 * animating in, then slides up off-screen to reveal the page content.
 * Total duration ≈ 1.6 s.  Respects prefers-reduced-motion.
 */
export function PageLoader() {
  const [gone, setGone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Both SVG paths inside LogoMark
      const paths = overlay.querySelectorAll<SVGPathElement>("path");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ onComplete: () => setGone(true) });

        // Set paths invisible before animating
        gsap.set(paths, { opacity: 0, y: 18, scale: 0.88, transformOrigin: "627px 627px" });

        tl
          // E path draws in
          .to(paths[0], {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            ease: "expo.out",
          })
          // R path follows
          .to(
            paths[1],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.75,
              ease: "expo.out",
            },
            "-=0.52",
          )
          // Brief pause — let the mark breathe
          .to({}, { duration: 0.28 })
          // Logo fades out slightly as overlay begins to lift
          .to(
            paths,
            { opacity: 0, y: -12, duration: 0.45, ease: "power2.in", stagger: 0.06 },
            "+=0",
          )
          // Overlay slides up revealing the page
          .to(
            overlay,
            { yPercent: -100, duration: 0.68, ease: "power3.inOut" },
            "-=0.28",
          );
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        // Just a quick fade for low-motion users
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.25,
          onComplete: () => setGone(true),
        });
      });

      return () => mm.revert();
    },
    { scope: overlayRef },
  );

  if (gone) return null;

  return (
    <div ref={overlayRef} className={styles.pageLoader} aria-hidden="true">
      <LogoMark size={120} className={styles.pageLoaderLogo} />
    </div>
  );
}
