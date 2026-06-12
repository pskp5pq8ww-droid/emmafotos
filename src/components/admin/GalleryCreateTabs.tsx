"use client";

import { useState } from "react";
import { createClientGallery } from "@app/admin/actions";
import { createExternalInvitation } from "@app/admin/galleries/invitation-actions";
import styles from "./Admin.module.css";

type Mode = "local" | "external";

export function GalleryCreateTabs() {
  const [mode, setMode] = useState<Mode>("local");

  return (
    <div>
      {/* ── Type selector cards ── */}
      <div className={styles.typeCards}>
        <button
          type="button"
          className={`${styles.typeCard} ${mode === "local" ? styles.typeCardActive : ""}`}
          onClick={() => setMode("local")}
          aria-pressed={mode === "local"}
        >
          <span className={styles.typeCardIcon}>▦</span>
          <p className={styles.typeCardTitle}>Local Gallery</p>
          <p className={styles.typeCardDesc}>
            Upload photos directly to the website server. Client signs in with a PIN.
          </p>
        </button>

        <button
          type="button"
          className={`${styles.typeCard} ${mode === "external" ? styles.typeCardActive : ""}`}
          onClick={() => setMode("external")}
          aria-pressed={mode === "external"}
        >
          <span className={styles.typeCardIcon}>◈</span>
          <p className={styles.typeCardTitle}>External Download Invitation</p>
          <p className={styles.typeCardDesc}>
            Create a private invitation page with a download button linked to external
            storage (Google Drive, Dropbox, OneDrive…).
          </p>
        </button>
      </div>

      {/* ── Forms ── */}
      <div className={styles.panel} style={{ maxWidth: 720 }}>
        <div className={styles.panelPad}>
          {mode === "local" ? <LocalGalleryForm /> : <ExternalInvitationForm />}
        </div>
      </div>
    </div>
  );
}

// ── Local gallery form (same fields + action as the dashboard) ──────────────────

function LocalGalleryForm() {
  return (
    <form action={createClientGallery} className={styles.form}>
      <h2 className={styles.panelTitle} style={{ fontSize: 20 }}>New local gallery</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="name">Client name *</label>
        <input id="name" name="name" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="email">Client email</label>
        <input id="email" name="email" type="email" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="username">Username</label>
        <input id="username" name="username" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="pin">Client PIN *</label>
        <input id="pin" name="pin" inputMode="numeric" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Gallery title *</label>
        <input id="title" name="title" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="eventDate">Event date</label>
        <input id="eventDate" name="eventDate" type="date" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="description">Description</label>
        <textarea id="description" name="description" />
      </div>
      <label className={styles.checkboxLabel}>
        <input name="isActive" type="checkbox" defaultChecked />
        Activate immediately
      </label>
      <div className={styles.invoiceActions}>
        <button className={styles.primaryButton} type="submit">
          Create gallery
        </button>
      </div>
    </form>
  );
}

// ── External invitation form ────────────────────────────────────────────────────

function ExternalInvitationForm() {
  return (
    <form action={createExternalInvitation} className={styles.form}>
      <h2 className={styles.panelTitle} style={{ fontSize: 20 }}>New external invitation</h2>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-clientName">Client name *</label>
        <input id="ext-clientName" name="clientName" required />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-title">Gallery title *</label>
        <input id="ext-title" name="title" required placeholder="e.g. Natalia & Renato — Wedding" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-link">External download link *</label>
        <input
          id="ext-link"
          name="externalDownloadLink"
          type="url"
          required
          placeholder="https://drive.google.com/…"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-message">Custom message</label>
        <textarea
          id="ext-message"
          name="customMessage"
          placeholder="A warm personal note shown on the invitation page…"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-cover">Cover image URL (optional)</label>
        <input
          id="ext-cover"
          name="coverImageUrl"
          type="url"
          placeholder="https://…/cover.jpg — leave blank for default background"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-expires">Expiration date (optional)</label>
        <input id="ext-expires" name="expiresAt" type="date" />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="ext-notes">
          Internal notes <span style={{ color: "#5A5A62" }}>(admin only)</span>
        </label>
        <textarea
          id="ext-notes"
          name="internalNotes"
          placeholder="Private notes — never shown to the client."
        />
      </div>
      <label className={styles.checkboxLabel}>
        <input name="isActive" type="checkbox" defaultChecked />
        Active immediately
      </label>
      <div className={styles.invoiceActions}>
        <button className={styles.primaryButton} type="submit">
          Create invitation
        </button>
      </div>
    </form>
  );
}
