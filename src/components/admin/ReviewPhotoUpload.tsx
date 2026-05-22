"use client";

import { useRef, useTransition } from "react";
import { uploadReviewPhoto } from "@app/admin/actions";
import styles from "./Admin.module.css";

type Props = {
  reviewId: string;
  currentPhotoUrl?: string;
};

export function ReviewPhotoUpload({ reviewId, currentPhotoUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.set("id", reviewId);
    fd.set("photo", file);
    startTransition(() => uploadReviewPhoto(fd));
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      {currentPhotoUrl && (
        <img
          src={currentPhotoUrl}
          alt="Profile"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #dfd9ce",
            flexShrink: 0,
          }}
        />
      )}
      <button
        type="button"
        className={styles.ghostButton}
        style={{ fontSize: "11px", opacity: pending ? 0.5 : 1 }}
        disabled={pending}
        onClick={() => inputRef.current?.click()}
      >
        {pending ? "Uploading…" : currentPhotoUrl ? "Change" : "Upload photo"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}
