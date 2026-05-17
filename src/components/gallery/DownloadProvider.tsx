"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export type DownloadStatus = "preparing" | "downloading" | "done" | "error";

export type DownloadItem = {
  id: string;
  label: string;
  /** "file" = single image, "zip" = whole gallery */
  kind: "file" | "zip";
  status: DownloadStatus;
  /** 0-100. When the server hasn't sent Content-Length we leave at 0 and
   * show "preparing" / spinner state until done. */
  progress: number;
  /** Once finished, holds the object URL so the panel can offer "Save". */
  objectUrl?: string;
  /** Filename to save as. */
  saveAs: string;
  error?: string;
  /** URL used for retry */
  url: string;
};

type DownloadContextValue = {
  items: DownloadItem[];
  enqueueFile: (filename: string, url: string) => void;
  enqueueZip: (slug: string, galleryTitle: string) => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  clearFinished: () => void;
};

const DownloadContext = createContext<DownloadContextValue | null>(null);

export function useDownloadQueue() {
  const ctx = useContext(DownloadContext);
  if (!ctx) throw new Error("useDownloadQueue must be used inside DownloadProvider");
  return ctx;
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `d-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after a tick so Safari finishes streaming
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const abortRefs = useRef<Map<string, AbortController>>(new Map());

  const updateItem = useCallback((id: string, patch: Partial<DownloadItem>) => {
    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const startDownload = useCallback(
    async (item: DownloadItem) => {
      const controller = new AbortController();
      abortRefs.current.set(item.id, controller);

      try {
        const res = await fetch(item.url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        updateItem(item.id, { status: "downloading" });

        const total = Number(res.headers.get("Content-Length") ?? "0");
        const reader = res.body?.getReader();

        if (!reader) {
          // Fallback: no streaming, just await the blob.
          const blob = await res.blob();
          saveBlob(blob, item.saveAs);
          updateItem(item.id, { status: "done", progress: 100 });
          return;
        }

        const chunks: Uint8Array[] = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.byteLength;
          if (total > 0) {
            updateItem(item.id, { progress: Math.min(99, Math.round((received / total) * 100)) });
          }
        }

        const blob = new Blob(chunks as BlobPart[]);
        saveBlob(blob, item.saveAs);
        updateItem(item.id, { status: "done", progress: 100 });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        updateItem(item.id, {
          status: "error",
          error: (err as Error).message || "Download failed",
        });
      } finally {
        abortRefs.current.delete(item.id);
      }
    },
    [updateItem],
  );

  const enqueueFile = useCallback(
    (filename: string, url: string) => {
      const item: DownloadItem = {
        id: uuid(),
        label: filename,
        kind: "file",
        status: "preparing",
        progress: 0,
        saveAs: filename,
        url,
      };
      setItems((cur) => [...cur, item]);
      void startDownload(item);
    },
    [startDownload],
  );

  const enqueueZip = useCallback(
    (slug: string, galleryTitle: string) => {
      const item: DownloadItem = {
        id: uuid(),
        label: `${galleryTitle} — all photos`,
        kind: "zip",
        status: "preparing",
        progress: 0,
        saveAs: `${slug}.zip`,
        url: `/api/gallery/${slug}/download`,
      };
      setItems((cur) => [...cur, item]);
      void startDownload(item);
    },
    [startDownload],
  );

  const retry = useCallback(
    (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const refreshed: DownloadItem = {
        ...item,
        status: "preparing",
        progress: 0,
        error: undefined,
      };
      updateItem(id, refreshed);
      void startDownload(refreshed);
    },
    [items, startDownload, updateItem],
  );

  const remove = useCallback((id: string) => {
    abortRefs.current.get(id)?.abort();
    abortRefs.current.delete(id);
    setItems((cur) => cur.filter((it) => it.id !== id));
  }, []);

  const clearFinished = useCallback(() => {
    setItems((cur) => cur.filter((it) => it.status !== "done"));
  }, []);

  const value = useMemo<DownloadContextValue>(
    () => ({ items, enqueueFile, enqueueZip, retry, remove, clearFinished }),
    [items, enqueueFile, enqueueZip, retry, remove, clearFinished],
  );

  return <DownloadContext.Provider value={value}>{children}</DownloadContext.Provider>;
}
