"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { LogoMark } from "@/components/public/LogoMark";
import { submitReview } from "./actions";
import styles from "./review.module.css";

gsap.registerPlugin(useGSAP);

const BG_IMAGES = [
  "/assets/backgrounds/fondo-1.jpg",
  "/assets/backgrounds/fondo-2.jpg",
  "/assets/backgrounds/fondo-3.jpg",
];

type Props = {
  token: string;
  galleryTitle?: string;
};

export function ReviewForm({ token, galleryTitle }: Props) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const wrapRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const thanksRef = useRef<HTMLDivElement>(null);

  // Entrance — form slides up
  useGSAP(() => {
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
  }, { scope: wrapRef });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setError("");
    setPending(true);

    const fd = new FormData(e.currentTarget);
    fd.set("rating", String(rating));
    const result = await submitReview(token, fd);

    if (!result.ok) {
      setError(result.error);
      setPending(false);
      return;
    }

    // Transition: form fades out → thanks fades in
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(formRef.current!, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
          setDone(true);
          gsap.from(thanksRef.current!, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "expo.out",
          });
        },
      });
    });
    mm.add("(prefers-reduced-motion: reduce)", () => setDone(true));
  }

  return (
    <div className={styles.shell}>
      {/* Slideshow background */}
      <div className={styles.bg} aria-hidden="true">
        {BG_IMAGES.map((src, i) => (
          <div
            key={src}
            className={styles.bgSlide}
            style={{
              backgroundImage: `url(${src})`,
              animationDelay: `${i * -10}s`,
            }}
          />
        ))}
        <div className={styles.bgOverlay} />
      </div>

      {/* Minimal header */}
      <header className={styles.header}>
        <a href="/" aria-label="Emmanuel Rojas Studio">
          <LogoMark size={36} style={{ color: "rgba(255,255,255,0.9)" }} />
        </a>
      </header>

      {/* Form card */}
      <main className={styles.main}>
        <div ref={wrapRef} className={styles.card}>
          {!done ? (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className={styles.form}
              noValidate
            >
              <div className={styles.formTop}>
                <p className={styles.eyebrow}>Client review</p>
                <h1 className={styles.heading}>
                  {galleryTitle ? `${galleryTitle}` : "Share your experience"}
                </h1>
                <p className={styles.sub}>
                  A few words mean everything.
                </p>
              </div>

              {/* Star rating */}
              <div className={styles.starsWrap} role="group" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    className={`${styles.star} ${
                      n <= (hovered || rating) ? styles.starActive : ""
                    }`}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className={styles.fields}>
                <input
                  className={styles.input}
                  name="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  required
                />
                <input
                  className={styles.input}
                  name="email"
                  type="email"
                  placeholder="Email (optional)"
                  autoComplete="email"
                />
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  placeholder="Tell us about your experience…"
                  rows={4}
                  required
                />
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button
                className={styles.submit}
                type="submit"
                disabled={pending || rating === 0}
              >
                {pending ? "Sending…" : "Send review"}
              </button>
            </form>
          ) : (
            <div ref={thanksRef} className={styles.thanks}>
              <LogoMark size={52} style={{ color: "rgba(255,255,255,0.85)" }} />
              <h2 className={styles.thanksTitle}>Thank you.</h2>
              <p className={styles.thanksSub}>
                Your words are kept with care.<br />
                We're grateful you trusted us with your story.
              </p>
              <a href="/" className={styles.thanksBack}>
                ← Return home
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
