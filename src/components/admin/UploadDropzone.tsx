"use client";

import { useRef, useState, type DragEvent } from "react";
import styles from "./Admin.module.css";

type UploadDropzoneProps = {
  galleryId: string;
};

export function UploadDropzone({ galleryId }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState("Ready for upload");
  const [busy, setBusy] = useState(false);

  async function upload(files: FileList | File[]) {
    if (!files.length) {
      return;
    }

    setBusy(true);
    setStatus(`Uploading ${files.length} file${files.length === 1 ? "" : "s"}...`);

    const formData = new FormData();
    formData.set("galleryId", galleryId);
    Array.from(files).forEach((file) => formData.append("files", file));

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setStatus("Upload failed. Check file type and try again.");
      setBusy(false);
      return;
    }

    setStatus("Upload complete. Refreshing gallery...");
    window.location.reload();
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    upload(event.dataTransfer.files);
  }

  return (
    <div
      className={styles.uploadBox}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <div>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            if (event.target.files) {
              upload(event.target.files);
            }
          }}
        />
        <p className={styles.eyebrow}>Upload photos</p>
        <p className={styles.muted}>{status}</p>
        <button
          className={styles.textButton}
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          Choose files
        </button>
      </div>
    </div>
  );
}
