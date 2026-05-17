"use client";

import { useRef, type DragEvent } from "react";
import styles from "./Admin.module.css";
import { useUploadQueue } from "./UploadProvider";

type UploadDropzoneProps = {
  galleryId: string;
  galleryTitle?: string;
};

export function UploadDropzone({ galleryId, galleryTitle = "Gallery" }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { enqueue, totals } = useUploadQueue();

  function handleFiles(fileList: FileList | File[] | null) {
    if (!fileList) return;
    const files = Array.from(fileList);
    if (!files.length) return;
    enqueue(galleryId, galleryTitle, files);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  }

  const activeForThis = totals.uploading + totals.pending;

  return (
    <div
      className={styles.uploadBox}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
    >
      <div style={{ width: "100%" }}>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => handleFiles(event.target.files)}
        />
        <p className={styles.eyebrow}>Upload photos</p>
        <p className={styles.muted}>
          {activeForThis
            ? `${activeForThis} files in queue — keep working, uploads continue in background`
            : "Drag & drop or choose files. Uploads run in the background."}
        </p>

        <button
          className={styles.textButton}
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{ marginTop: "12px" }}
        >
          Choose files
        </button>
      </div>
    </div>
  );
}
