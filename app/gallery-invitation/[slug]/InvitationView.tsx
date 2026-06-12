"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "@/components/public/LogoMark";
import styles from "./invitation.module.css";

gsap.registerPlugin(useGSAP);

const BG_IMAGES = [
  "/assets/backgrounds/fondo-1.jpg",
  "/assets/backgrounds/fondo-2.jpg",
  "/assets/backgrounds/fondo-3.jpg",
  "/assets/backgrounds/fondo-4.jpg",
  "/assets/backgrounds/fondo-5.jpg",
];

type Props = {
  slug: string;
  clientName: string;
  title: string;
  customMessage?: string;
  coverImageUrl?: string;
  /** When false, render the friendly "no longer available" state. */
  available: boolean;
};

export function InvitationView({
  slug,
  clientName,
  title,
  customMessage,
  coverImageUrl,
  available,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(wrapRef.current!, {
          opacity: 0,
          y: 36,
          duration: 1,
          ease: "expo.out",
          delay: 0.2,
        });
      });
      return () => mm.revert();
    },
    { scope: wrapRef },
  );

  return (
    <div className={styles.shell}>
      {/* Background */}
      <div className={styles.bg} aria-hidden="true">
        {coverImageUrl ? (
          <div
            className={styles.bgStatic}
            style={{ backgroundImage: `url(${coverImageUrl})` }}
          />
        ) : (
          BG_IMAGES.map((src, i) => (
            <div
              key={src}
              className={styles.bgSlide}
              style={{ backgroundImage: `url(${src})`, animationDelay: `${i * -10}s` }}
            />
          ))
        )}
        <div className={styles.bgOverlay} />
      </div>

      {/* Header */}
      <header className={styles.header}>
        <a href="/" aria-label="Emmanuel Rojas Studio">
          <LogoMark size={36} style={{ color: "rgba(255,255,255,0.9)" }} />
        </a>
      </header>

      {/* Card */}
      <main className={styles.main}>
        <div ref={wrapRef} className={styles.card}>
          {available ? (
            <>
              <div className={styles.top}>
                <p className={styles.eyebrow}>Private Gallery</p>
                <h1 className={styles.heading}>{title || "Your Gallery Is Ready"}</h1>
                <p className={styles.sub}>
                  Hi {clientName}, your photos have been prepared and are ready to download.
                </p>
              </div>

              {customMessage && <p className={styles.message}>{customMessage}</p>}

              <div className={styles.actions}>
                {/* Real link is hidden — this hits the secure redirect endpoint */}
                <a
                  className={styles.download}
                  href={`/api/gallery-invitation/${slug}/open`}
                  rel="noopener noreferrer nofollow"
                >
                  ↓ Download Your Gallery
                </a>
                <a className={styles.review} href="/review">
                  Leave a Review
                </a>
              </div>

              <p className={styles.note}>
                Your photos are stored securely in an external gallery link prepared by
                Emmanuel Rojas Studio.
              </p>
              <p className={styles.signature}>
                This private invitation was created for you by Emmanuel Rojas Studio.
              </p>
            </>
          ) : (
            <div className={styles.unavailable}>
              <LogoMark size={48} style={{ color: "rgba(255,255,255,0.85)" }} />
              <h1 className={styles.unavailableTitle}>
                This gallery invitation is no longer available.
              </h1>
              <p className={styles.unavailableSub}>
                Please contact the photographer to have your private gallery re-opened.
              </p>
              <a href="/" className={styles.unavailableBack}>
                ← Return home
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
