"use client";

import { useState, useCallback } from "react";
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

  const toggleFavorite = useCallback(async (imageId: string) => {
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
  }, [slug]);

  const closeLightbox = useCallback(() => setActive(null), []);

  return (
    <>
      <div className={styles.masonry}>
        {items.map((photo) => (
          <article className={styles.photo} key={photo.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${photo.thumbPath ?? photo.path}`}
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
                aria-label={photo.favorite ? "Quitar favorito" : "Marcar favorito"}
              >
                {photo.favorite ? "★" : "☆"}
              </button>
              <a
                className={styles.iconButton}
                href={`/api/files/${photo.path}?download=1`}
                aria-label={`Descargar ${photo.filename}`}
                onClick={(e) => e.stopPropagation()}
              >
                ↓
              </a>
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
            aria-label="Cerrar"
          >
            ×
          </button>
          <div
            className={styles.lightboxInner}
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${active.path}`}
              alt={active.filename}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
