"use client";

import styles from "./Public.module.css";

type Review = { name: string; text: string };

// Three extra placeholder reviews so the marquee never looks sparse
const EXTRA: Review[] = [
  {
    name: "Sophie & Liam",
    text: "Every frame tells a story. Our wedding album is something we will treasure for the rest of our lives.",
  },
  {
    name: "Camila R.",
    text: "Emmanuel has an incredible eye for the quiet, in-between moments. Exactly the style we were looking for.",
  },
  {
    name: "Marcus T.",
    text: "Relaxed, professional and genuinely talented. The final gallery exceeded every expectation.",
  },
];

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  const all = [...reviews, ...EXTRA];
  // Triple the array so the seamless loop works at any viewport width
  const items = [...all, ...all, ...all];

  return (
    <section
      className={styles.marqueeOuter}
      aria-label="Client testimonials"
    >
      <div className={styles.marqueeTrack}>
        {items.map((r, i) => (
          <article
            className={styles.marqueeCard}
            key={i}
            aria-hidden={i >= all.length ? "true" : undefined}
          >
            <p className={styles.meta}>{r.name}</p>
            <p className={styles.marqueeCopy}>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
