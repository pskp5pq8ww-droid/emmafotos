import Link from "next/link";
import { notFound } from "next/navigation";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { readDB } from "@/lib/db";
import { deleteClient, regenerateClientPin } from "../../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = await readDB();
  const client = db.clients.find((item) => item.id === id);

  if (!client) {
    notFound();
  }

  const galleries = db.galleries.filter((gallery) => gallery.clientId === client.id);

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Client</p>
          <h1 className={styles.title}>{client.name}</h1>
          <p className={styles.muted}>{client.email || client.username}</p>
        </div>
        <Link className={styles.ghostButton} href="/admin#new">
          New gallery
        </Link>
      </div>

      <section className={styles.twoColumn}>
        <div className={styles.panel}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Gallery</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {galleries.map((gallery) => (
                <tr key={gallery.id}>
                  <td>
                    <Link href={`/admin/galleries/${gallery.id}`}>{gallery.title}</Link>
                  </td>
                  <td>
                    <span className={styles.badge}>
                      {gallery.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>{gallery.eventDate || "No date"}</td>
                </tr>
              ))}
              {!galleries.length ? (
                <tr>
                  <td colSpan={3}>No galleries for this client.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <aside className={`${styles.panel} ${styles.panelPad}`}>
          <h2 className={styles.panelTitle}>Client actions</h2>
          <form action={regenerateClientPin} className={styles.form}>
            <input name="id" type="hidden" value={client.id} />
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pin">
                New client PIN
              </label>
              <input id="pin" name="pin" inputMode="numeric" />
            </div>
            <button className={styles.textButton} type="submit">
              Regenerate PIN
            </button>
          </form>
          <form action={deleteClient} className={styles.form}>
            <input name="id" type="hidden" value={client.id} />
            <ConfirmSubmitButton
              className={styles.dangerButton}
              message="Delete this client, all galleries and uploaded photos?"
              type="submit"
            >
              Delete client
            </ConfirmSubmitButton>
          </form>
        </aside>
      </section>
    </div>
  );
}
