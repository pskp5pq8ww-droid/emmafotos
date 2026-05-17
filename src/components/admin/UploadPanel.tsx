"use client";

import { useState } from "react";
import styles from "./Admin.module.css";
import { useUploadQueue } from "./UploadProvider";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadPanel() {
  const { items, totals, retry, remove, clearFinished } = useUploadQueue();
  const [collapsed, setCollapsed] = useState(false);

  if (totals.total === 0) return null;

  const overall = totals.total
    ? Math.round(
        items.reduce((acc, item) => acc + (item.status === "done" ? 100 : item.progress), 0) /
          totals.total,
      )
    : 0;

  const allDone = totals.done === totals.total;

  return (
    <aside
      className={`${styles.uploadPanel} ${collapsed ? styles.uploadPanelCollapsed : ""}`}
      role="status"
      aria-live="polite"
    >
      <header className={styles.uploadPanelHead}>
        <div>
          <p className={styles.uploadPanelTitle}>
            {allDone
              ? "Upload complete"
              : totals.uploading
                ? `Uploading ${totals.done + 1} / ${totals.total}`
                : `Queue · ${totals.total} files`}
          </p>
          <p className={styles.uploadPanelSubtitle}>
            {totals.done} done · {totals.uploading} active · {totals.pending} pending
            {totals.error ? ` · ${totals.error} failed` : ""}
          </p>
        </div>
        <button
          type="button"
          className={styles.uploadPanelToggle}
          aria-label={collapsed ? "Expand uploads" : "Minimize uploads"}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? "▴" : "▾"}
        </button>
      </header>

      {!collapsed && (
        <>
          <div className={styles.uploadPanelOverall}>
            <div
              className={styles.uploadPanelOverallBar}
              style={{ width: `${overall}%` }}
            />
          </div>

          <ul className={styles.uploadPanelList}>
            {items.map((item) => (
              <li key={item.id} className={styles.uploadPanelItem}>
                <div className={styles.uploadPanelItemHead}>
                  <span className={styles.uploadPanelItemName} title={item.filename}>
                    {item.filename}
                  </span>
                  <span className={styles.uploadPanelItemMeta}>
                    {item.status === "done"
                      ? "✓"
                      : item.status === "error"
                        ? "Failed"
                        : item.status === "uploading"
                          ? `${item.progress}%`
                          : "Pending"}
                  </span>
                </div>
                <div className={styles.uploadPanelItemBarTrack}>
                  <div
                    className={`${styles.uploadPanelItemBar} ${
                      item.status === "error" ? styles.uploadPanelItemBarError : ""
                    } ${item.status === "done" ? styles.uploadPanelItemBarDone : ""}`}
                    style={{ width: `${item.status === "done" ? 100 : item.progress}%` }}
                  />
                </div>
                <div className={styles.uploadPanelItemFoot}>
                  <span className={styles.uploadPanelItemSize}>{formatSize(item.size)}</span>
                  {item.status === "error" && (
                    <>
                      {item.error && <span className={styles.uploadPanelItemError}>{item.error}</span>}
                      <button
                        type="button"
                        className={styles.uploadPanelItemAction}
                        onClick={() => retry(item.id)}
                      >
                        Retry
                      </button>
                    </>
                  )}
                  {(item.status === "done" || item.status === "error") && (
                    <button
                      type="button"
                      className={styles.uploadPanelItemAction}
                      onClick={() => remove(item.id)}
                    >
                      Dismiss
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>

          {allDone && (
            <footer className={styles.uploadPanelFoot}>
              <button
                type="button"
                className={styles.uploadPanelClear}
                onClick={clearFinished}
              >
                Clear completed
              </button>
            </footer>
          )}
        </>
      )}
    </aside>
  );
}
