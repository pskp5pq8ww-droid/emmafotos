import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { CopyLinkButton } from "@/components/admin/CopyLinkButton";
import { ReviewPhotoUpload } from "@/components/admin/ReviewPhotoUpload";
import { readDB } from "@/lib/db";
import {
  publishReview,
  hideReview,
  deleteAllReviews,
  deleteReview,
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

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Client feedback</p>
          <h1 className={styles.title}>Reviews</h1>
          <p className={styles.muted}>
            Share the link with clients. Approve a review to show it on the homepage.
          </p>
        </div>
        {reviews.length > 0 && (
          <form action={deleteAllReviews}>
            <ConfirmSubmitButton
              className={styles.dangerButton}
              message={`Delete all ${reviews.length} review${reviews.length !== 1 ? "s" : ""} permanently?`}
              type="submit"
            >
              Delete all
            </ConfirmSubmitButton>
          </form>
        )}
      </div>

      {/* ── General review link ── */}
      <section className={styles.panel} style={{ marginBottom: "20px" }}>
        <div
          className={styles.panelPad}
          style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <h2 className={styles.panelTitle} style={{ fontSize: "18px", marginBottom: "4px" }}>
              Review link
            </h2>
            <p className={styles.muted} style={{ margin: 0 }}>
              Permanent — share freely with any client to collect name, email and a 1–5 star review.
            </p>
          </div>
          <CopyLinkButton href="/review" label="Link review" />
        </div>
      </section>

      {/* ── Reviews table ── */}
      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Review</th>
              <th>Client</th>
              <th>Rating</th>
              <th>Profile photo</th>
              <th>Status</th>
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
              return (
                <tr key={review.id}>
                  <td>
                    <p className={styles.reviewMessage}>{review.message}</p>
                    <span className={styles.muted}>{formatDate(review.createdAt)}</span>
                  </td>
                  <td>
                    <strong>{review.clientName}</strong>
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
                    <ReviewPhotoUpload
                      reviewId={review.id}
                      currentPhotoUrl={
                        review.profilePhotoPath
                          ? `/api/files/${review.profilePhotoPath.split("/").map(encodeURIComponent).join("/")}`
                          : undefined
                      }
                    />
                  </td>
                  <td>
                    <div className={styles.inlineActions}>
                      {review.approved ? (
                        <>
                          <span className={styles.badge} style={{ background: "#e8f5ec", borderColor: "#9ecfad", color: "#1a5c2e" }}>
                            ✓ Live
                          </span>
                          <form action={hideReview}>
                            <input name="id" type="hidden" value={review.id} />
                            <button className={styles.ghostButton} type="submit">
                              Hide
                            </button>
                          </form>
                        </>
                      ) : (
                        <>
                          <span className={styles.badge}>Pending</span>
                          <form action={publishReview}>
                            <input name="id" type="hidden" value={review.id} />
                            <button className={styles.textButton} type="submit">
                              Publish
                            </button>
                          </form>
                        </>
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
                <td colSpan={6} style={{ textAlign: "center", padding: "32px" }}>
                  No reviews yet — share the link above to collect the first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
