"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./Gallery.module.css";

export type GalleryPhoto = {
  id: string;
  filename: string;
  path: string;
  thumbPath?: string;
  favorite: boolean;
};

export function PhotoGrid({
  slug,
  photos,
}: {
  slug: string;
  photos: GalleryPhoto[];
}) {
  const [items, setItems] = useState(photos);
  const [active, setActive] = useState<GalleryPhoto | null>(null);

  async function toggleFavorite(imageId: string) {
    const response = await fetch(`/api/gallery/${slug}/favorite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });

    if (!response.ok) {
      return;
    }

    setItems((current) =>
      current.map((item) =>
        item.id === imageId ? { ...item, favorite: !item.favorite } : item,
      ),
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {items.map((photo) => (
          <article className={styles.photo} key={photo.id}>
            <button
              onClick={() => setActive(photo)}
              type="button"
              aria-label={`Open ${photo.filename}`}
            >
              <Image
                src={`/api/files/${photo.thumbPath ?? photo.path}`}
                alt={photo.filename}
                width={560}
                height={700}
              />
            </button>
            <div className={styles.photoActions}>
              <button
                className={styles.iconButton}
                onClick={() => toggleFavorite(photo.id)}
                type="button"
                aria-label={photo.favorite ? "Remove favorite" : "Mark favorite"}
              >
                {photo.favorite ? "★" : "☆"}
              </button>
              <a
                className={styles.iconButton}
                href={`/api/files/${photo.path}?download=1`}
                aria-label={`Download ${photo.filename}`}
              >
                ↓
              </a>
            </div>
          </article>
        ))}
      </div>
      {active ? (
        <div className={styles.lightbox} role="dialog" aria-modal="true">
          <button
            className={`${styles.iconButton} ${styles.close}`}
            onClick={() => setActive(null)}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
          <Image
            src={`/api/files/${active.path}`}
            alt={active.filename}
            width={1600}
            height={1200}
          />
        </div>
      ) : null}
    </>
  );
}
