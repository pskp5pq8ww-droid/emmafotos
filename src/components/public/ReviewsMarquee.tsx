"use client";

import styles from "./Public.module.css";

type Review = { name: string; rating: number; text: string };

function ratingStars(rating: number) {
  return "★★★★★".slice(0, Math.max(0, Math.min(5, rating)));
}

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return null;
  }

  // Triple the array so the seamless loop works at any viewport width
  const items = [...reviews, ...reviews, ...reviews];

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
            aria-hidden={i >= reviews.length ? "true" : undefined}
          >
            <p className={styles.meta}>{r.name}</p>
            <p className={styles.marqueeRating} aria-label={`${r.rating} out of 5`}>
              {ratingStars(r.rating)}
            </p>
            <p className={styles.marqueeCopy}>{r.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
