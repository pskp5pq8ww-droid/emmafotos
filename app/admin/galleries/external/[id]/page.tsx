import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { readDB } from "@/lib/db";
import { isInvitationExpired } from "@/lib/galleries/invitation";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import {
  updateExternalInvitation,
  toggleExternalInvitation,
  deleteExternalInvitation,
} from "../../invitation-actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default async function ExternalInvitationEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await hasAdminSession())) redirect("/admin-login");

  const { id } = await params;
  const db = await readDB();
  const invitation = db.externalInvitations.find((inv) => inv.id === id);

  if (!invitation) notFound();

  const expired = isInvitationExpired(invitation);
  const publicPath = `/gallery-invitation/${invitation.slug}`;

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>
            <Link href="/admin/galleries" style={{ color: "#A1A1AA" }}>Galleries</Link>
            {" / External invitation"}
          </p>
          <h1 className={styles.title}>{invitation.title}</h1>
          <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span className={`${styles.badge} ${styles.badgeExternal}`}>External</span>
            {expired ? (
              <span className={`${styles.badge} ${styles.badgeExpired}`}>Expired</span>
            ) : invitation.isActive ? (
              <span className={`${styles.badge} ${styles.badgePaid}`}>Active</span>
            ) : (
              <span className={`${styles.badge} ${styles.badgeUnpaid}`}>Inactive</span>
            )}
            <span className={styles.muted} style={{ fontSize: 12 }}>
              {invitation.clientName} · Created {fmtDateTime(invitation.createdAt)}
            </span>
          </div>
        </div>

        {/* Action bar */}
        <div className={styles.inlineActions}>
          <CopyLinkButton href={publicPath} label="Copy invitation link" />
          <Link className={styles.ghostButton} href={publicPath} target="_blank">
            Open page
          </Link>
          <form action={toggleExternalInvitation}>
            <input type="hidden" name="id" value={invitation.id} />
            <button type="submit" className={styles.ghostButton}>
              {invitation.isActive ? "Disable" : "Activate"}
            </button>
          </form>
          <form action={deleteExternalInvitation}>
            <input type="hidden" name="id" value={invitation.id} />
            <ConfirmSubmitButton
              className={styles.dangerButton}
              message="Delete this external invitation? This cannot be undone."
              type="submit"
            >
              Delete
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      {/* ── Edit form ── */}
      <div className={styles.panel} style={{ maxWidth: 720 }}>
        <div className={styles.panelPad}>
          <form action={updateExternalInvitation} className={styles.form}>
            <input type="hidden" name="id" value={invitation.id} />

            <div className={styles.field}>
              <label className={styles.label} htmlFor="clientName">Client name *</label>
              <input id="clientName" name="clientName" required defaultValue={invitation.clientName} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">Gallery title *</label>
              <input id="title" name="title" required defaultValue={invitation.title} />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="externalDownloadLink">External download link *</label>
              <input
                id="externalDownloadLink"
                name="externalDownloadLink"
                type="url"
                required
                defaultValue={invitation.externalDownloadLink}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="customMessage">Custom message</label>
              <textarea
                id="customMessage"
                name="customMessage"
                defaultValue={invitation.customMessage ?? ""}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="coverImageUrl">Cover image URL (optional)</label>
              <input
                id="coverImageUrl"
                name="coverImageUrl"
                type="url"
                defaultValue={invitation.coverImageUrl ?? ""}
                placeholder="https://…/cover.jpg"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="expiresAt">Expiration date (optional)</label>
              <input
                id="expiresAt"
                name="expiresAt"
                type="date"
                defaultValue={invitation.expiresAt ?? ""}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="internalNotes">
                Internal notes <span style={{ color: "#5A5A62" }}>(admin only)</span>
              </label>
              <textarea
                id="internalNotes"
                name="internalNotes"
                defaultValue={invitation.internalNotes ?? ""}
              />
            </div>
            <label className={styles.checkboxLabel}>
              <input name="isActive" type="checkbox" defaultChecked={invitation.isActive} />
              Active
            </label>

            <div className={styles.invoiceActions}>
              <button className={styles.primaryButton} type="submit">
                Save changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
