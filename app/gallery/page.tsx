"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/components/gallery/Gallery.module.css";

export default function GalleryLandingPage() {
  const router = useRouter();
  const [slug, setSlug] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = slug.trim().toLowerCase();
    if (clean) router.push(`/gallery/${encodeURIComponent(clean)}`);
  }

  return (
    <main className={styles.login}>
      <section className={styles.loginPanel}>
        <p className={styles.eyebrow}>Client Gallery</p>
        <h1 className={styles.title}>Your private gallery</h1>
        <p className={styles.copy}>
          Enter the gallery code shared with you after your session.
        </p>
        <form className={styles.form} onSubmit={handleSubmit} style={{ marginTop: "24px" }}>
          <div className={styles.field}>
            <label htmlFor="code">Gallery code</label>
            <input
              id="code"
              type="text"
              placeholder="e.g. natalia-renato"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <button className={styles.button} type="submit">
            Access Gallery
          </button>
        </form>
        <p className={styles.copy} style={{ marginTop: "20px", fontSize: "13px", opacity: 0.7 }}>
          Your gallery link was included in the delivery email.
        </p>
      </section>
    </main>
  );
}
