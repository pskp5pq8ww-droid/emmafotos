"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { PATH_E, PATH_R } from "./LogoMark";
import styles from "./Public.module.css";

gsap.registerPlugin(useGSAP);

type Ctx = { navigate: (href: string) => void };

const TransitionContext = createContext<Ctx>({ navigate: () => {} });

export const useTransitionNav = () => useContext(TransitionContext);

/**
 * Animated route transition for the public site.
 *
 *  1. Two black panels close vertically (top ↓ + bottom ↑)
 *  2. E descends from above, R ascends from below — meet at centre
 *  3. Whole overlay rotates ‑90° (CCW) → still fully black
 *  4. router.push(href)  (new page renders behind the overlay)
 *  5. Panels separate (now horizontally because of the rotation),
 *     E flies left, R flies right → page revealed
 *
 * Total ≈ 2.0 s. Respects prefers-reduced-motion.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const eRef = useRef<SVGSVGElement>(null);
  const rRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ── Initial mount: page loads in "fully closed" state → play OPEN ──
  useGSAP(
    () => {
      const overlay = overlayRef.current!;
      const top = topRef.current!;
      const bottom = bottomRef.current!;
      const e = eRef.current!;
      const r = rRef.current!;

      // GSAP-set centering so animated rotations don't clobber CSS transforms
      gsap.set(overlay, { xPercent: -50, yPercent: -50, rotation: 0 });
      gsap.set([e, r], { xPercent: -50, yPercent: -50 });
      gsap.set([top, bottom], { yPercent: 0 });
      gsap.set([e, r], { y: 0, x: 0, opacity: 1, rotation: 0 });

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          onComplete: () => {
            // Keep overlay mounted but non-interactive
            gsap.set(overlay, { pointerEvents: "none" });
          },
        });

        // OPEN — reveal the page on first paint
        tl
          .to(e, { y: -260, opacity: 0, duration: 0.55, ease: "power3.in" }, 0)
          .to(r, { y: 260, opacity: 0, duration: 0.55, ease: "power3.in" }, 0)
          .to(top, { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, 0.1)
          .to(bottom, { yPercent: 100, duration: 0.75, ease: "power3.inOut" }, 0.1);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(top, { yPercent: -100 });
        gsap.set(bottom, { yPercent: 100 });
        gsap.set([e, r], { opacity: 0 });
      });

      return () => mm.revert();
    },
    { scope: overlayRef },
  );

  // ── Imperative navigate(): close → rotate → push → open ──
  const navigate = (href: string) => {
    if (!href || href === pathname) return;
    if (tlRef.current?.isActive()) return;

    const overlay = overlayRef.current!;
    const top = topRef.current!;
    const bottom = bottomRef.current!;
    const e = eRef.current!;
    const r = rRef.current!;

    // Reduced motion → just navigate
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      router.push(href);
      return;
    }

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl
      // ── Reset state ──
      .set(overlay, { pointerEvents: "auto", rotation: 0, xPercent: -50, yPercent: -50 })
      .set(top, { yPercent: -100 })
      .set(bottom, { yPercent: 100 })
      // rotation: 90 pre-tilts the logos so that after the container's
      // -90° rotation they appear perfectly upright in world space (90 + -90 = 0°)
      .set(e, { y: -260, x: 0, opacity: 0, rotation: 90, xPercent: -50, yPercent: -50 })
      .set(r, { y: 260, x: 0, opacity: 0, rotation: 90, xPercent: -50, yPercent: -50 })

      // ── 1. CLOSE: panels meet, E descends, R ascends ──
      .to(top, { yPercent: 0, duration: 0.7, ease: "power3.inOut" }, 0)
      .to(bottom, { yPercent: 0, duration: 0.7, ease: "power3.inOut" }, 0)
      .to(e, { y: 0, opacity: 1, duration: 0.78, ease: "expo.out" }, 0.12)
      .to(r, { y: 0, opacity: 1, duration: 0.78, ease: "expo.out" }, 0.12)

      // Brief pause — logo locks together at centre
      .to({}, { duration: 0.18 })

      // ── 2. ROTATE the whole sealed overlay 90° CCW ──
      .to(
        overlay,
        { rotation: -90, duration: 0.78, ease: "power2.inOut" },
        ">",
      )
      // tiny breath after rotation
      .to({}, { duration: 0.1 })

      // ── 3. NAVIGATE while fully covered ──
      .call(() => router.push(href))
      // give new page a beat to render
      .to({}, { duration: 0.22 })

      // ── 4. OPEN: in the rotated frame, panels slide apart, logos exit ──
      //   (E going "up" in its frame = LEFT in world; R "down" = RIGHT in world)
      .to(e, { y: -260, opacity: 0, duration: 0.6, ease: "power3.in" })
      .to(r, { y: 260, opacity: 0, duration: 0.6, ease: "power3.in" }, "<")
      .to(top, { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, "<0.1")
      .to(bottom, { yPercent: 100, duration: 0.75, ease: "power3.inOut" }, "<")

      .set(overlay, { pointerEvents: "none" });
  };

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}
      <div
        ref={overlayRef}
        className={styles.transition}
        aria-hidden="true"
      >
        <div ref={topRef} className={`${styles.transitionPanel} ${styles.transitionTop}`} />
        <div ref={bottomRef} className={`${styles.transitionPanel} ${styles.transitionBottom}`} />
        <svg
          ref={eRef}
          className={styles.transitionLogo}
          viewBox="0 0 1254 1254"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path fill="currentColor" d={PATH_E} />
        </svg>
        <svg
          ref={rRef}
          className={styles.transitionLogo}
          viewBox="0 0 1254 1254"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path fill="currentColor" d={PATH_R} />
        </svg>
      </div>
    </TransitionContext.Provider>
  );
}
