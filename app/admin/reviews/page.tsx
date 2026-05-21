import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { readDB } from "@/lib/db";
import {
  allowReviewDisplay,
  approveReview,
  assignReviewImage,
  createReviewInvite,
  deleteAllReviews,
  deleteReview,
  deleteReviewInvite,
  hideReview,
  keepReviewPrivate,
} from "../actions";
import styles from "@/components/admin/Admin.module.css";

export const dynamic = "force-dynamic";

function ratingStars(rating: number) {
  return "★★★★★".slice(0, rating);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function AdminReviewsPage() {
  const db = await readDB();
  const reviews = [...db.reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const invites = [...(db.reviewInvites ?? [])].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Client feedback</p>
          <h1 className={styles.title}>Reviews</h1>
          <p className={styles.muted}>
            Generate invite links to collect reviews. Approve to show on the
            public homepage.
          </p>
        </div>
        {reviews.length > 0 && (
          <form action={deleteAllReviews}>
            <ConfirmSubmitButton
              className={styles.dangerButton}
              message={`Delete all ${reviews.length} review${reviews.length !== 1 ? "s" : ""} permanently?`}
              type="submit"
            >
              Delete all reviews
            </ConfirmSubmitButton>
          </form>
        )}
      </div>

      {/* ── Generate invite link ── */}
      <section className={styles.panel} style={{ marginBottom: "24px" }}>
        <div className={styles.panelPad}>
          <h2 className={styles.panelTitle}>Generate invite link</h2>
          <p className={styles.muted} style={{ marginBottom: "16px" }}>
            Send this link to a client so they can leave a review. Each link is
            one-time use.
          </p>
          <form action={createReviewInvite} className={styles.form}>
            <div className={styles.twoCol}>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="inviteGallery">
                  Gallery (optional)
                </label>
                <select id="inviteGallery" name="galleryId">
                  <option value="">— No gallery —</option>
                  {db.galleries.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="inviteNote">
                  Note (internal)
                </label>
                <input
                  id="inviteNote"
                  name="note"
                  type="text"
                  placeholder="e.g. Natalia & Renato wedding"
                />
              </div>
            </div>
            <button className={styles.textButton} type="submit">
              Generate link
            </button>
          </form>
        </div>

        {invites.length > 0 && (
          <div className={styles.panelPad} style={{ borderTop: "1px solid var(--line, #e8e2d8)" }}>
            <h3 className={styles.panelTitle} style={{ fontSize: "13px" }}>
              Active invite links
            </h3>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Link</th>
                  <th>Gallery</th>
                  <th>Note</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((inv) => {
                  const gallery = inv.galleryId
                    ? db.galleries.find((g) => g.id === inv.galleryId)
                    : undefined;
                  const link = `${baseUrl}/review/${inv.token}`;
                  return (
                    <tr key={inv.id}>
                      <td>
                        <CopyLinkButton href={link} />
                      </td>
                      <td>{gallery?.title ?? "—"}</td>
                      <td className={styles.muted}>{inv.note ?? "—"}</td>
                      <td className={styles.muted}>{formatDate(inv.createdAt)}</td>
                      <td>
                        <span className={styles.badge}>
                          {inv.usedAt ? "Used" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <form action={deleteReviewInvite}>
                          <input name="id" type="hidden" value={inv.id} />
                          <ConfirmSubmitButton
                            className={styles.dangerButton}
                            message="Delete this invite link?"
                            type="submit"
                          >
                            Delete
                          </ConfirmSubmitButton>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── Reviews table ── */}
      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Review</th>
              <th>Gallery</th>
              <th>Client</th>
              <th>Rating</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Display</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const gallery = review.galleryId
                ? db.galleries.find((item) => item.id === review.galleryId)
                : undefined;
              const client = gallery
                ? db.clients.find((item) => item.id === gallery.clientId)
                : undefined;
              const galleryImages = gallery
                ? db.galleryImages.filter((img) => img.galleryId === gallery.id)
                : [];

              return (
                <tr key={review.id}>
                  <td>
                    <p className={styles.reviewMessage}>{review.message}</p>
                    <span className={styles.muted}>{formatDate(review.createdAt)}</span>
                  </td>
                  <td>
                    {gallery?.title ?? "—"}
                    {gallery && (
                      <>
                        <br />
                        <span className={styles.muted}>/gallery/{gallery.slug}</span>
                      </>
                    )}
                  </td>
                  <td>
                    {review.clientName}
                    <br />
                    <span className={styles.muted}>
                      {review.email || client?.email || "No email"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.ratingStars} aria-label={`${review.rating} out of 5`}>
                      {ratingStars(review.rating)}
                    </span>
                  </td>
                  <td>
                    {/* Admin assigns a gallery image for the marquee */}
                    {galleryImages.length > 0 ? (
                      <form action={assignReviewImage}>
                        <input name="id" type="hidden" value={review.id} />
                        <select
                          name="imageId"
                          defaultValue={review.imageId ?? ""}
                          onChange={(e) => (e.target.form as HTMLFormElement).requestSubmit()}
                          style={{ fontSize: "12px" }}
                        >
                          <option value="">— None —</option>
                          {galleryImages.map((img) => (
                            <option key={img.id} value={img.id}>
                              {img.filename}
                            </option>
                          ))}
                        </select>
                      </form>
                    ) : (
                      <span className={styles.muted}>No gallery</span>
                    )}
                  </td>
                  <td>
                    <span className={styles.badge}>
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.badge}>
                      {review.allowPublicDisplay ? "Visible" : "Private"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.inlineActions}>
                      {review.approved ? (
                        <form action={hideReview}>
                          <input name="id" type="hidden" value={review.id} />
                          <button className={styles.ghostButton} type="submit">
                            Hide
                          </button>
                        </form>
                      ) : (
                        <form action={approveReview}>
                          <input name="id" type="hidden" value={review.id} />
                          <button className={styles.textButton} type="submit">
                            Approve
                          </button>
                        </form>
                      )}
                      {review.allowPublicDisplay ? (
                        <form action={keepReviewPrivate}>
                          <input name="id" type="hidden" value={review.id} />
                          <button className={styles.ghostButton} type="submit">
                            Keep private
                          </button>
                        </form>
                      ) : (
                        <form action={allowReviewDisplay}>
                          <input name="id" type="hidden" value={review.id} />
                          <button className={styles.ghostButton} type="submit">
                            Allow display
                          </button>
                        </form>
                      )}
                      <form action={deleteReview}>
                        <input name="id" type="hidden" value={review.id} />
                        <ConfirmSubmitButton
                          className={styles.dangerButton}
                          message="Delete this review permanently?"
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
            {!reviews.length ? (
              <tr>
                <td colSpan={8}>No reviews received yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
