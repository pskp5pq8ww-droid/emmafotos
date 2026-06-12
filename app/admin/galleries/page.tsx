import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { readDB } from "@/lib/db";
import { isInvitationExpired } from "@/lib/galleries/invitation";
import { deleteGallery, toggleGalleryActive } from "../actions";
import {
  deleteExternalInvitation,
  toggleExternalInvitation,
} from "./invitation-actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

type Row =
  | {
      kind: "local";
      id: string;
      title: string;
      slug: string;
      clientName: string;
      date: string;
      isActive: boolean;
      createdAt: string;
    }
  | {
      kind: "external";
      id: string;
      title: string;
      slug: string;
      clientName: string;
      date: string;
      isActive: boolean;
      expired: boolean;
      createdAt: string;
    };

export default async function GalleriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const db = await readDB();
  const q = (params.q ?? "").toLowerCase();
  const filter = params.filter ?? "all";

  // ── Build unified rows ──
  const localRows: Row[] = db.galleries.map((gallery) => {
    const client = db.clients.find((item) => item.id === gallery.clientId);
    return {
      kind: "local",
      id: gallery.id,
      title: gallery.title,
      slug: gallery.slug,
      clientName: client?.name ?? "Unknown",
      date: gallery.eventDate || "No date",
      isActive: gallery.isActive,
      createdAt: gallery.createdAt,
    };
  });

  const externalRows: Row[] = db.externalInvitations.map((inv) => ({
    kind: "external",
    id: inv.id,
    title: inv.title,
    slug: inv.slug,
    clientName: inv.clientName,
    date: inv.expiresAt ? `Expires ${inv.expiresAt}` : "No expiry",
    isActive: inv.isActive,
    expired: isInvitationExpired(inv),
    createdAt: inv.createdAt,
  }));

  const rows = [...localRows, ...externalRows]
    .filter((row) => {
      const matchesFilter =
        filter === "active"
          ? row.isActive
          : filter === "inactive"
            ? !row.isActive
            : filter === "local"
              ? row.kind === "local"
              : filter === "external"
                ? row.kind === "external"
                : true;
      const matchesQuery =
        !q ||
        row.title.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q) ||
        row.clientName.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Library</p>
          <h1 className={styles.title}>Galleries</h1>
        </div>
        <div className={styles.inlineActions}>
          <form className={styles.inlineActions}>
            <input className={styles.smallInput} name="q" placeholder="Search" defaultValue={params.q ?? ""} />
            <select className={styles.smallInput} name="filter" defaultValue={filter}>
              <option value="all">All</option>
              <option value="local">Local</option>
              <option value="external">External</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className={styles.ghostButton} type="submit">
              Filter
            </button>
          </form>
          <Link className={styles.primaryButton} href="/admin/galleries/new">
            + New
          </Link>
        </div>
      </div>

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gallery</th>
              <th>Client</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const editHref =
                row.kind === "local"
                  ? `/admin/galleries/${row.id}`
                  : `/admin/galleries/external/${row.id}`;
              const publicPath =
                row.kind === "local"
                  ? `/gallery/${row.slug}`
                  : `/gallery-invitation/${row.slug}`;

              return (
                <tr key={`${row.kind}-${row.id}`}>
                  <td>
                    <Link href={editHref}>{row.title}</Link>
                    <br />
                    <span className={styles.muted}>{publicPath}</span>
                  </td>
                  <td>{row.clientName}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        row.kind === "local" ? styles.badgeLocal : styles.badgeExternal
                      }`}
                    >
                      {row.kind === "local" ? "Local" : "External"}
                    </span>
                  </td>
                  <td>{row.date}</td>
                  <td>
                    {row.kind === "external" && row.expired ? (
                      <span className={`${styles.badge} ${styles.badgeExpired}`}>Expired</span>
                    ) : row.isActive ? (
                      <span className={`${styles.badge} ${styles.badgePaid}`}>Active</span>
                    ) : (
                      <span className={`${styles.badge} ${styles.badgeUnpaid}`}>Inactive</span>
                    )}
                  </td>
                  <td>
                    <div className={styles.inlineActions}>
                      <Link className={styles.ghostButton} href={editHref}>
                        Open
                      </Link>
                      <CopyLinkButton href={publicPath} />
                      {row.kind === "local" ? (
                        <>
                          <form action={toggleGalleryActive}>
                            <input name="id" type="hidden" value={row.id} />
                            <button className={styles.ghostButton} type="submit">
                              {row.isActive ? "Disable" : "Activate"}
                            </button>
                          </form>
                          <form action={deleteGallery}>
                            <input name="id" type="hidden" value={row.id} />
                            <ConfirmSubmitButton
                              className={styles.dangerButton}
                              message="Delete this gallery and all uploaded photos?"
                              type="submit"
                            >
                              Delete
                            </ConfirmSubmitButton>
                          </form>
                        </>
                      ) : (
                        <>
                          <form action={toggleExternalInvitation}>
                            <input name="id" type="hidden" value={row.id} />
                            <button className={styles.ghostButton} type="submit">
                              {row.isActive ? "Disable" : "Activate"}
                            </button>
                          </form>
                          <form action={deleteExternalInvitation}>
                            <input name="id" type="hidden" value={row.id} />
                            <ConfirmSubmitButton
                              className={styles.dangerButton}
                              message="Delete this external invitation? This cannot be undone."
                              type="submit"
                            >
                              Delete
                            </ConfirmSubmitButton>
                          </form>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {!rows.length ? (
              <tr>
                <td colSpan={6}>No galleries found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
