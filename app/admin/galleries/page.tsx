import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { readDB } from "@/lib/db";
import { deleteGallery, toggleGalleryActive } from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function GalleriesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; q?: string }>;
}) {
  const params = await searchParams;
  const db = await readDB();
  const q = (params.q ?? "").toLowerCase();
  const filter = params.filter ?? "all";
  const galleries = db.galleries.filter((gallery) => {
    const client = db.clients.find((item) => item.id === gallery.clientId);
    const matchesFilter =
      filter === "active" ? gallery.isActive : filter === "inactive" ? !gallery.isActive : true;
    const matchesQuery =
      !q ||
      gallery.title.toLowerCase().includes(q) ||
      gallery.slug.toLowerCase().includes(q) ||
      client?.name.toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Library</p>
          <h1 className={styles.title}>Galleries</h1>
        </div>
        <form className={styles.inlineActions}>
          <input className={styles.smallInput} name="q" placeholder="Search" />
          <select className={styles.smallInput} name="filter" defaultValue={filter}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className={styles.ghostButton} type="submit">
            Filter
          </button>
        </form>
      </div>

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Gallery</th>
              <th>Client</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {galleries.map((gallery) => {
              const client = db.clients.find((item) => item.id === gallery.clientId);
              return (
                <tr key={gallery.id}>
                  <td>
                    <Link href={`/admin/galleries/${gallery.id}`}>{gallery.title}</Link>
                    <br />
                    <span className={styles.muted}>/gallery/{gallery.slug}</span>
                  </td>
                  <td>{client?.name ?? "Unknown"}</td>
                  <td>{gallery.eventDate || "No date"}</td>
                  <td>
                    <span className={styles.badge}>
                      {gallery.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.inlineActions}>
                      <Link className={styles.ghostButton} href={`/admin/galleries/${gallery.id}`}>
                        Open
                      </Link>
                      <CopyLinkButton href={`/gallery/${gallery.slug}`} />
                      <form action={toggleGalleryActive}>
                        <input name="id" type="hidden" value={gallery.id} />
                        <button className={styles.ghostButton} type="submit">
                          {gallery.isActive ? "Disable" : "Activate"}
                        </button>
                      </form>
                      <form action={deleteGallery}>
                        <input name="id" type="hidden" value={gallery.id} />
                        <ConfirmSubmitButton
                          className={styles.dangerButton}
                          message="Delete this gallery and all uploaded photos?"
                          type="submit"
                        >
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!galleries.length ? (
              <tr>
                <td colSpan={5}>No galleries found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
