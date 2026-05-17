"use client";

import { useRef, useState, type DragEvent } from "react";
import styles from "./Admin.module.css";

type Stage = "idle" | "preparing" | "uploading" | "processing" | "done" | "error";

const STAGE_LABELS: Record<Stage, string> = {
  idle: "Ready for upload",
  preparing: "Preparing upload...",
  uploading: "Uploading photos...",
  processing: "Processing gallery...",
  done: "Upload complete",
  error: "Upload failed. Please try again.",
};

const STAGE_PROGRESS: Record<Stage, number> = {
  idle: 0,
  preparing: 10,
  uploading: 60,
  processing: 90,
  done: 100,
  error: 0,
};

type UploadDropzoneProps = {
  galleryId: string;
};

export function UploadDropzone({ galleryId }: UploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("idle");

  const busy = stage !== "idle" && stage !== "done" && stage !== "error";
  const progress = STAGE_PROGRESS[stage];

  async function upload(files: FileList | File[]) {
    if (!files.length) return;

    setStage("preparing");

    const formData = new FormData();
    formData.set("galleryId", galleryId);
    Array.from(files).forEach((file) => formData.append("files", file));

    setStage("uploading");

    const response = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      setStage("error");
      return;
    }

    setStage("processing");
    await new Promise((r) => setTimeout(r, 600));
    setStage("done");
    await new Promise((r) => setTimeout(r, 800));
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
      <div style={{ width: "100%" }}>
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept="image/*"
          multiple
          onChange={(event) => {
            if (event.target.files) upload(event.target.files);
          }}
        />
        <p className={styles.eyebrow}>Upload photos</p>
        <p className={styles.muted}>{STAGE_LABELS[stage]}</p>

        {stage !== "idle" && stage !== "error" && (
          <div className={styles.progressTrack}>
            <div
              className={styles.progressBar}
              style={{
                width: `${progress}%`,
                background: stage === "done" ? "#4caf7d" : undefined,
              }}
            />
          </div>
        )}

        {stage === "error" && (
          <div className={styles.progressTrack}>
            <div className={styles.progressBar} style={{ width: "100%", background: "#c7a194" }} />
          </div>
        )}

        <button
          className={styles.textButton}
          disabled={busy}
          onClick={() => {
            if (stage === "error") setStage("idle");
            inputRef.current?.click();
          }}
          type="button"
          style={{ marginTop: "12px" }}
        >
          {stage === "error" ? "Try again" : "Choose files"}
        </button>
      </div>
    </div>
  );
}
