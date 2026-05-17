"use client";

import { useState } from "react";
import adminStyles from "../admin/Admin.module.css";
import { useDownloadQueue } from "./DownloadProvider";

export function DownloadPanel() {
  const { items, retry, remove, clearFinished } = useDownloadQueue();
  const [collapsed, setCollapsed] = useState(false);

  if (!items.length) return null;

  const active = items.filter(
    (i) => i.status === "preparing" || i.status === "downloading",
  ).length;
  const done = items.filter((i) => i.status === "done").length;
  const allDone = done === items.length;

  return (
    <aside
      className={`${adminStyles.downloadPanel} ${collapsed ? adminStyles.downloadPanelCollapsed : ""}`}
      role="status"
      aria-live="polite"
    >
      <header className={adminStyles.downloadPanelHead}>
        <div>
          <p className={adminStyles.downloadPanelTitle}>
            {allDone ? "Downloads ready" : active ? "Downloading…" : "Downloads"}
          </p>
          <p className={adminStyles.downloadPanelSubtitle}>
            {done}/{items.length} complete
          </p>
        </div>
        <button
          type="button"
          className={adminStyles.uploadPanelToggle}
          aria-label={collapsed ? "Expand downloads" : "Minimize downloads"}
          onClick={() => setCollapsed((v) => !v)}
        >
          {collapsed ? "▴" : "▾"}
        </button>
      </header>

      {!collapsed && (
        <>
          <ul className={adminStyles.downloadPanelList}>
            {items.map((item) => (
              <li key={item.id} className={adminStyles.downloadPanelItem}>
                <div className={adminStyles.uploadPanelItemHead}>
                  <span className={adminStyles.uploadPanelItemName} title={item.label}>
                    {item.kind === "zip" ? "📦 " : ""}{item.label}
                  </span>
                  <span className={adminStyles.uploadPanelItemMeta}>
                    {item.status === "done"
                      ? "✓"
                      : item.status === "error"
                        ? "Failed"
                        : item.status === "preparing"
                          ? "Preparing…"
                          : `${item.progress}%`}
                  </span>
                </div>
                <div className={adminStyles.uploadPanelItemBarTrack}>
                  <div
                    className={`${adminStyles.uploadPanelItemBar} ${
                      item.status === "error" ? adminStyles.uploadPanelItemBarError : ""
                    } ${item.status === "done" ? adminStyles.uploadPanelItemBarDone : ""}`}
                    style={{
                      width: `${item.status === "done" ? 100 : item.progress || (item.status === "preparing" ? 4 : 0)}%`,
                    }}
                  />
                </div>
                <div className={adminStyles.uploadPanelItemFoot}>
                  {item.status === "error" && (
                    <>
                      {item.error && <span className={adminStyles.uploadPanelItemError}>{item.error}</span>}
                      <button
                        type="button"
                        className={adminStyles.uploadPanelItemAction}
                        onClick={() => retry(item.id)}
                      >
                        Retry
                      </button>
                    </>
                  )}
                  {(item.status === "done" || item.status === "error") && (
                    <button
                      type="button"
                      className={adminStyles.uploadPanelItemAction}
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
            <footer className={adminStyles.uploadPanelFoot}>
              <button
                type="button"
                className={adminStyles.uploadPanelClear}
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
