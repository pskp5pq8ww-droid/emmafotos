"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MAX_CONCURRENT = 3;
const MAX_AUTO_RETRIES = 2;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export type UploadStatus = "pending" | "uploading" | "done" | "error";

export type UploadItem = {
  id: string;
  galleryId: string;
  galleryTitle: string;
  filename: string;
  size: number;
  status: UploadStatus;
  progress: number; // 0-100
  attempts: number;
  error?: string;
};

type UploadContextValue = {
  items: UploadItem[];
  enqueue: (galleryId: string, galleryTitle: string, files: File[]) => void;
  retry: (id: string) => void;
  remove: (id: string) => void;
  clearFinished: () => void;
  totals: { total: number; done: number; uploading: number; pending: number; error: number };
};

const UploadContext = createContext<UploadContextValue | null>(null);

export function useUploadQueue() {
  const ctx = useContext(UploadContext);
  if (!ctx) {
    throw new Error("useUploadQueue must be used inside an UploadProvider");
  }
  return ctx;
}

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function UploadProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [items, setItems] = useState<UploadItem[]>([]);

  // Files live in a ref keyed by item id so they're not stored in state
  // (a File can't be serialized and we never need React to re-render on it).
  const filesRef = useRef<Map<string, File>>(new Map());
  // Active xhr objects so we could abort them in the future if needed.
  const activeRef = useRef<Map<string, XMLHttpRequest>>(new Map());

  const updateItem = useCallback((id: string, patch: Partial<UploadItem>) => {
    setItems((cur) => cur.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const enqueue = useCallback(
    (galleryId: string, galleryTitle: string, files: File[]) => {
      const newItems: UploadItem[] = [];
      for (const file of files) {
        const type = (file.type || "").toLowerCase();
        if (type && !ALLOWED_TYPES.includes(type)) continue;
        const id = uuid();
        filesRef.current.set(id, file);
        newItems.push({
          id,
          galleryId,
          galleryTitle,
          filename: file.name,
          size: file.size,
          status: "pending",
          progress: 0,
          attempts: 0,
        });
      }
      if (newItems.length) {
        setItems((cur) => [...cur, ...newItems]);
      }
    },
    [],
  );

  const retry = useCallback(
    (id: string) => {
      // Only items with the file still in memory can be retried.
      if (!filesRef.current.has(id)) return;
      updateItem(id, { status: "pending", progress: 0, error: undefined });
    },
    [updateItem],
  );

  const remove = useCallback((id: string) => {
    setItems((cur) => cur.filter((item) => item.id !== id));
    filesRef.current.delete(id);
    activeRef.current.delete(id);
  }, []);

  const clearFinished = useCallback(() => {
    setItems((cur) => {
      const next = cur.filter((item) => item.status !== "done");
      // Free File memory for cleared items.
      for (const item of cur) {
        if (item.status === "done") filesRef.current.delete(item.id);
      }
      return next;
    });
  }, []);

  // ── Worker loop: when capacity opens up, start the next pending item.
  // We re-evaluate on every state change because that's cheap and obvious.
  useEffect(() => {
    const uploading = items.filter((i) => i.status === "uploading").length;
    if (uploading >= MAX_CONCURRENT) return;

    const slotsOpen = MAX_CONCURRENT - uploading;
    const toStart = items.filter((i) => i.status === "pending").slice(0, slotsOpen);
    if (!toStart.length) return;

    for (const item of toStart) {
      const file = filesRef.current.get(item.id);
      if (!file) {
        updateItem(item.id, { status: "error", error: "File missing" });
        continue;
      }
      startUpload(item, file);
    }
    // We intentionally only depend on `items` — startUpload closes over current state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  function startUpload(item: UploadItem, file: File) {
    const xhr = new XMLHttpRequest();
    activeRef.current.set(item.id, xhr);

    const formData = new FormData();
    formData.set("galleryId", item.galleryId);
    formData.set("file", file);

    updateItem(item.id, { status: "uploading", progress: 0, attempts: item.attempts + 1 });

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;
      const pct = Math.min(99, Math.round((e.loaded / e.total) * 100));
      updateItem(item.id, { progress: pct });
    };

    xhr.onload = () => {
      activeRef.current.delete(item.id);
      if (xhr.status >= 200 && xhr.status < 300) {
        updateItem(item.id, { status: "done", progress: 100, error: undefined });
        // Refresh the admin gallery server component so the new image appears.
        router.refresh();
      } else {
        handleFailure(item, `HTTP ${xhr.status}`);
      }
    };

    xhr.onerror = () => {
      activeRef.current.delete(item.id);
      handleFailure(item, "Network error");
    };

    xhr.open("POST", "/api/admin/upload");
    xhr.send(formData);
  }

  function handleFailure(item: UploadItem, message: string) {
    // Auto-retry transient failures up to MAX_AUTO_RETRIES.
    if (item.attempts < MAX_AUTO_RETRIES + 1) {
      const delay = 600 * 2 ** (item.attempts - 1);
      setTimeout(() => {
        if (!filesRef.current.has(item.id)) return;
        updateItem(item.id, { status: "pending", progress: 0, error: message });
      }, delay);
    } else {
      updateItem(item.id, { status: "error", error: message });
    }
  }

  // ── beforeunload guard while uploads are active.
  useEffect(() => {
    const active = items.some(
      (i) => i.status === "uploading" || i.status === "pending",
    );
    if (!active) return;

    function onBeforeUnload(e: BeforeUnloadEvent) {
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [items]);

  const totals = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.status === "done").length;
    const uploading = items.filter((i) => i.status === "uploading").length;
    const pending = items.filter((i) => i.status === "pending").length;
    const error = items.filter((i) => i.status === "error").length;
    return { total, done, uploading, pending, error };
  }, [items]);

  const value = useMemo<UploadContextValue>(
    () => ({ items, enqueue, retry, remove, clearFinished, totals }),
    [items, enqueue, retry, remove, clearFinished, totals],
  );

  return <UploadContext.Provider value={value}>{children}</UploadContext.Provider>;
}
