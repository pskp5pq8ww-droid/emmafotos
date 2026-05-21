"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CodeRain } from "./CodeRain";
import { LogoMark } from "./LogoMark";
import styles from "./Project.module.css";

gsap.registerPlugin(useGSAP);

type Phase = "black" | "logo" | "glow" | "code";

export function ProjectScene() {
  const [phase, setPhase] = useState<Phase>("black");
  const logoRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cinemaEntry =
      typeof window !== "undefined"
        ? sessionStorage.getItem("project-entry")
        : null;

    if (cinemaEntry) {
      sessionStorage.removeItem("project-entry");
      // Cinematic sequence: black → logo fades in → glow activates → code appears
      const t1 = setTimeout(() => setPhase("logo"), 350);
      const t2 = setTimeout(() => setPhase("glow"), 1500);
      const t3 = setTimeout(() => setPhase("code"), 2200);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else {
      // Direct URL navigation — skip intro, show everything immediately
      setPhase("code");
    }
  }, []);

  // Logo: fades in/out based on phase
  useGSAP(
    () => {
      if (!logoRef.current) return;
      gsap.to(logoRef.current, {
        opacity: phase === "black" ? 0 : 1,
        duration: 1.4,
        ease: "expo.out",
        overwrite: "auto",
      });
    },
    { dependencies: [phase] },
  );

  // Back link: fades in only at code phase
  useGSAP(
    () => {
      if (!backRef.current) return;
      gsap.to(backRef.current, {
        opacity: phase === "code" ? 1 : 0,
        duration: 1,
        delay: phase === "code" ? 0.6 : 0,
        ease: "power2.out",
        overwrite: "auto",
      });
    },
    { dependencies: [phase] },
  );

  return (
    <div className={styles.scene}>
      {/* Code rain layer — behind logo */}
      <CodeRain active={phase === "code"} />

      {/* Logo */}
      <div ref={logoRef} className={styles.logoWrap} style={{ opacity: 0 }}>
        <LogoMark
          aria-label="Emmanuel Rojas"
          className={`${styles.logo} ${
            phase === "glow" || phase === "code" ? styles.logoGlow : ""
          }`}
          style={{ color: "white" }}
        />
      </div>

      {/* Back link */}
      <div ref={backRef} className={styles.backWrap} style={{ opacity: 0 }}>
        <a href="/" className={styles.backLink}>
          ← Back
        </a>
      </div>
    </div>
  );
}
