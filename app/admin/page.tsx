import Link from "next/link";
import { readDB } from "@/lib/db";
import { createClientGallery } from "./actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const db = await readDB();
  const recentGalleries = [...db.galleries]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 30);
  const active = db.galleries.filter((gallery) => gallery.isActive).length;
  const pendingReviews = db.reviews.filter((review) => !review.approved).length;

  const metrics = [
    { label: "Clients", value: db.clients.length, href: "/admin/clients" },
    { label: "Galleries", value: db.galleries.length, href: "/admin/galleries" },
    { label: "Active", value: active, href: "/admin/galleries?filter=active" },
    { label: "Photos", value: db.galleryImages.length },
    { label: "Pending reviews", value: pendingReviews, href: "/admin/reviews" },
  ];

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Overview</p>
          <h1 className={styles.title}>Dashboard</h1>
        </div>
      </div>

      <section className={styles.metrics}>
        {metrics.map((metric) => {
          const content = (
            <div className={styles.metric}>
              <p className={styles.eyebrow}>{metric.label}</p>
              <strong>{metric.value}</strong>
            </div>
          );

          return metric.href ? (
            <Link href={metric.href} key={metric.label}>
              {content}
            </Link>
          ) : (
            <div key={metric.label}>{content}</div>
          );
        })}
      </section>

      <section className={styles.dashboardGrid}>
        <div className={styles.panel}>
          <div className={styles.panelPad}>
            <h2 className={styles.panelTitle}>Recent galleries</h2>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Date</th>
                <th>Status</th>
                <th>Photos</th>
              </tr>
            </thead>
            <tbody>
              {recentGalleries.map((gallery) => {
                const client = db.clients.find((item) => item.id === gallery.clientId);
                const photoCount = db.galleryImages.filter(
                  (image) => image.galleryId === gallery.id,
                ).length;

                return (
                  <tr key={gallery.id}>
                    <td>
                      <Link href={`/admin/galleries/${gallery.id}`}>{gallery.title}</Link>
                      <br />
                      <span className={styles.muted}>/gallery/{gallery.slug}</span>
                    </td>
                    <td>
                      {client?.name ?? "Unknown"}
                      <br />
                      <span className={styles.muted}>{client?.email}</span>
                    </td>
                    <td>{gallery.eventDate || "No date"}</td>
                    <td>
                      <span className={styles.badge}>
                        {gallery.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>{photoCount}</td>
                  </tr>
                );
              })}
              {!recentGalleries.length ? (
                <tr>
                  <td colSpan={5}>No galleries yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <aside className={`${styles.panel} ${styles.panelPad} ${styles.sticky}`} id="new">
          <h2 className={styles.panelTitle}>New gallery</h2>
          <form action={createClientGallery} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="name">
                Client name
              </label>
              <input id="name" name="name" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Client email
              </label>
              <input id="email" name="email" type="email" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input id="username" name="username" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="pin">
                Client PIN
              </label>
              <input id="pin" name="pin" inputMode="numeric" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Gallery title
              </label>
              <input id="title" name="title" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="eventDate">
                Event date
              </label>
              <input id="eventDate" name="eventDate" type="date" />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Description
              </label>
              <textarea id="description" name="description" />
            </div>
            <label className={styles.inlineActions}>
              <input name="isActive" type="checkbox" defaultChecked />
              Activate immediately
            </label>
            <button className={styles.textButton} type="submit">
              Create gallery
            </button>
          </form>
        </aside>
      </section>
    </div>
  );
}
