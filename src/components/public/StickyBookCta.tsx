"use client";

import { useEffect, useRef, useState } from "react";
import { studio } from "@/lib/public-content";
import styles from "./Public.module.css";

/**
 * Sticky bottom CTA bar — mobile only (hidden via CSS on desktop).
 * Appears after scrolling past the hero, disappears when the final
 * CTA section enters the viewport so they never overlap.
 */
export function StickyBookCta({ finalCtaId }: { finalCtaId: string }) {
  const [visible, setVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let heroGone = false;
    let finalCtaVisible = false;

    function update() {
      setVisible(heroGone && !finalCtaVisible);
    }

    // Observer 1: watch a sentinel placed just below the hero
    const sentinel = sentinelRef.current;
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        heroGone = !entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    if (sentinel) heroObserver.observe(sentinel);

    // Observer 2: watch the final CTA section
    const finalEl = document.getElementById(finalCtaId);
    const finalObserver = new IntersectionObserver(
      ([entry]) => {
        finalCtaVisible = entry.isIntersecting;
        update();
      },
      { threshold: 0 },
    );
    if (finalEl) finalObserver.observe(finalEl);

    return () => {
      heroObserver.disconnect();
      finalObserver.disconnect();
    };
  }, [finalCtaId]);

  return (
    <>
      {/* Sentinel placed after the hero — when it scrolls off-screen the bar appears */}
      <div ref={sentinelRef} aria-hidden="true" className={styles.stickyCtaSentinel} />
      <div
        className={`${styles.stickyCtaBar} ${visible ? styles.stickyCtaBarVisible : ""}`}
        aria-hidden={!visible}
      >
        <a
          href={studio.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.stickyCtaButton}
        >
          Book Your Session
        </a>
      </div>
    </>
  );
}
