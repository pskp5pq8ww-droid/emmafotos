"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CodeRain } from "./CodeRain";
import styles from "./Project.module.css";

type Phase = "black" | "logo" | "glow" | "code";

export function ProjectScene() {
  const [phase, setPhase] = useState<Phase>("black");

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
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    } else {
      // Direct URL navigation — skip intro, show everything immediately
      setPhase("code");
    }
  }, []);

  return (
    <div className={styles.scene}>
      {/* Code rain layer — behind logo */}
      <CodeRain active={phase === "code"} />

      {/* Logo */}
      <motion.div
        className={styles.logoWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "black" ? 0 : 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/assets/er-logo-white.png"
          alt="Emmanuel Rojas"
          className={`${styles.logo} ${
            phase === "glow" || phase === "code" ? styles.logoGlow : ""
          }`}
          draggable={false}
        />
      </motion.div>

      {/* Back link */}
      <motion.div
        className={styles.backWrap}
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "code" ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
      >
        <a href="/" className={styles.backLink}>← Back</a>
      </motion.div>
    </div>
  );
}
