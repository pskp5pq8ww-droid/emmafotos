import Link from "next/link";
import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { readDB } from "@/lib/db";
import { deleteClient, regenerateClientPin } from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const db = await readDB();

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>CRM</p>
          <h1 className={styles.title}>Clients</h1>
        </div>
        <Link className={styles.ghostButton} href="/admin#new">
          New gallery
        </Link>
      </div>
      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Username</th>
              <th>Galleries</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {db.clients.map((client) => {
              const galleryCount = db.galleries.filter(
                (gallery) => gallery.clientId === client.id,
              ).length;

              return (
                <tr key={client.id}>
                  <td>
                    <Link href={`/admin/clients/${client.id}`}>{client.name}</Link>
                  </td>
                  <td>{client.email || "No email"}</td>
                  <td>{client.username || "No username"}</td>
                  <td>{galleryCount}</td>
                  <td>
                    <div className={styles.inlineActions}>
                      <Link className={styles.ghostButton} href={`/admin/clients/${client.id}`}>
                        View
                      </Link>
                      <Link className={styles.ghostButton} href="/admin#new">
                        New gallery
                      </Link>
                      <form action={regenerateClientPin}>
                        <input name="id" type="hidden" value={client.id} />
                        <input
                          className={styles.smallInput}
                          name="pin"
                          placeholder="New PIN"
                          inputMode="numeric"
                        />
                        <button className={styles.ghostButton} type="submit">
                          Regenerate
                        </button>
                      </form>
                      <form action={deleteClient}>
                        <input name="id" type="hidden" value={client.id} />
                        <ConfirmSubmitButton
                          className={styles.dangerButton}
                          message="Delete this client, all galleries and uploaded photos?"
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
            {!db.clients.length ? (
              <tr>
                <td colSpan={5}>No clients yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
