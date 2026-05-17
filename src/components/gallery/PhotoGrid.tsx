"use client";

import { useState, useCallback } from "react";
import { useDownloadQueue } from "./DownloadProvider";
import styles from "./Gallery.module.css";

export type GalleryPhoto = {
  id: string;
  filename: string;
  /** Legacy original path */
  path: string;
  /** Legacy JPEG thumbnail path */
  thumbPath?: string;
  /** New optimized WebP preview path */
  previewPath?: string;
  /** New canonical original path (for downloads / lightbox) */
  originalPath?: string;
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
  const { enqueueFile } = useDownloadQueue();

  const toggleFavorite = useCallback(
    async (imageId: string) => {
      const res = await fetch(`/api/gallery/${slug}/favorite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId }),
      });
      if (!res.ok) return;
      setItems((cur) =>
        cur.map((item) =>
          item.id === imageId ? { ...item, favorite: !item.favorite } : item,
        ),
      );
    },
    [slug],
  );

  const closeLightbox = useCallback(() => setActive(null), []);

  function previewSrc(photo: GalleryPhoto) {
    return `/api/files/${photo.previewPath ?? photo.thumbPath ?? photo.path}`;
  }

  function originalSrc(photo: GalleryPhoto) {
    return `/api/files/${photo.originalPath ?? photo.path}`;
  }

  return (
    <>
      <div className={styles.masonry}>
        {items.map((photo) => (
          <article className={styles.photo} key={photo.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewSrc(photo)}
              alt={photo.filename}
              loading="lazy"
              decoding="async"
              onLoad={(e) => (e.currentTarget as HTMLImageElement).classList.add(styles.loaded)}
              onClick={() => setActive(photo)}
              style={{ cursor: "pointer" }}
            />
            <div className={styles.photoActions}>
              <button
                className={styles.iconButton}
                onClick={() => toggleFavorite(photo.id)}
                type="button"
                aria-label={photo.favorite ? "Remove favourite" : "Mark as favourite"}
              >
                {photo.favorite ? "★" : "☆"}
              </button>
              <button
                className={styles.iconButton}
                onClick={(e) => {
                  e.stopPropagation();
                  enqueueFile(photo.filename, `${originalSrc(photo)}?download=1`);
                }}
                aria-label={`Download ${photo.filename}`}
                type="button"
              >
                ↓
              </button>
            </div>
          </article>
        ))}
      </div>

      {active ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          onKeyDown={(e) => e.key === "Escape" && closeLightbox()}
          tabIndex={-1}
        >
          <button
            className={`${styles.iconButton} ${styles.close}`}
            onClick={closeLightbox}
            type="button"
            aria-label="Close"
          >
            ×
          </button>
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalSrc(active)}
              alt={active.filename}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
