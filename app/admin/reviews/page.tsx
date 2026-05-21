import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { readDB } from "@/lib/db";
import {
  allowReviewDisplay,
  approveReview,
  deleteAllReviews,
  deleteReview,
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

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Client feedback</p>
          <h1 className={styles.title}>Reviews</h1>
          <p className={styles.muted}>
            Approve only the reviews that should appear on the public homepage.
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

      <div className={styles.panel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Review</th>
              <th>Gallery</th>
              <th>Client</th>
              <th>Rating</th>
              <th>Status</th>
              <th>Display</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => {
              const gallery = db.galleries.find((item) => item.id === review.galleryId);
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
                    {gallery?.title ?? "Deleted gallery"}
                    {gallery ? (
                      <>
                        <br />
                        <span className={styles.muted}>/gallery/{gallery.slug}</span>
                      </>
                    ) : null}
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
                    <span className={styles.badge}>
                      {review.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td>
                    <span className={styles.badge}>
                      {review.allowPublicDisplay ? "Allowed" : "Private"}
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
                <td colSpan={7}>No reviews received yet.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
