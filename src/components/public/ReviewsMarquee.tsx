"use client";

import { useState } from "react";
import styles from "./Public.module.css";

type Review = {
  name: string;
  rating: number;
  text: string;
  imageUrl?: string;
};

const TRUNCATE_AT = 180;

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

function ReviewCard({ r, isDuplicate }: { r: Review; isDuplicate: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = r.text.length > TRUNCATE_AT;
  const displayText = isLong && !expanded ? r.text.slice(0, TRUNCATE_AT).trimEnd() + "…" : r.text;

  return (
    <article
      className={styles.marqueeCard}
      aria-hidden={isDuplicate ? "true" : undefined}
    >
      <div
        className={styles.marqueePortrait}
        aria-hidden={r.imageUrl ? undefined : "true"}
      >
        {r.imageUrl ? (
          <img
            src={r.imageUrl}
            alt={`Gallery photograph for ${r.name}`}
            loading="lazy"
          />
        ) : (
          <span>{initials(r.name)}</span>
        )}
      </div>
      <div className={styles.marqueeBody}>
        <div className={styles.marqueeMeta}>
          <p className={styles.meta}>{r.name}</p>
          <p
            className={styles.marqueeRating}
            aria-label={`${r.rating} out of 5`}
          >
            {ratingStars(r.rating)}
          </p>
        </div>
        <p className={styles.marqueeCopy}>{displayText}</p>
        {isLong && (
          <button
            type="button"
            className={styles.marqueeReadMore}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>
    </article>
  );
}

export function ReviewsMarquee({ reviews }: { reviews: Review[] }) {
  if (!reviews.length) {
    return null;
  }

  // Triple the array so the seamless loop works at any viewport width
  const items = [
    ...reviews.map((r, i) => ({ r, key: `a${i}`, isDuplicate: false })),
    ...reviews.map((r, i) => ({ r, key: `b${i}`, isDuplicate: true })),
    ...reviews.map((r, i) => ({ r, key: `c${i}`, isDuplicate: true })),
  ];

  return (
    <section className={styles.marqueeOuter} aria-label="Client testimonials">
      <div className={styles.marqueeIntro}>
        <p className={styles.sectionEyebrow}>Client words</p>
        <p>Real notes from delivered galleries.</p>
      </div>
      <div className={styles.marqueeTrack}>
        {items.map(({ r, key, isDuplicate }) => (
          <ReviewCard key={key} r={r} isDuplicate={isDuplicate} />
        ))}
      </div>
    </section>
  );
}
