"use client";

import styles from "./Public.module.css";

type Review = {
  name: string;
  rating: number;
  text: string;
  imageUrl?: string;
};

function ratingStars(rating: number) {
  return "★★★★★".slice(0, Math.max(0, Math.min(5, rating)));
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? [parts[0], parts[parts.length - 1]] : parts;
  return letters
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
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
      <div className={styles.marqueeIntro}>
        <p className={styles.sectionEyebrow}>Client words</p>
        <p>Real notes from delivered galleries.</p>
      </div>
      <div className={styles.marqueeTrack}>
        {items.map((r, i) => (
          <article
            className={styles.marqueeCard}
            key={i}
            aria-hidden={i >= reviews.length ? "true" : undefined}
          >
            <div className={styles.marqueePortrait} aria-hidden={r.imageUrl ? undefined : "true"}>
              {r.imageUrl ? (
                <img src={r.imageUrl} alt={`Gallery photograph for ${r.name}`} loading="lazy" />
              ) : (
                <span>{initials(r.name)}</span>
              )}
            </div>
            <div className={styles.marqueeBody}>
              <div className={styles.marqueeMeta}>
                <p className={styles.meta}>{r.name}</p>
                <p className={styles.marqueeRating} aria-label={`${r.rating} out of 5`}>
                  {ratingStars(r.rating)}
                </p>
              </div>
              <p className={styles.marqueeCopy}>{r.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
