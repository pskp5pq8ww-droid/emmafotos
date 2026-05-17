"use client";

import { useState, type FormEvent } from "react";
import styles from "./Gallery.module.css";

const MAX_MESSAGE_LENGTH = 700;
const RATINGS = [1, 2, 3, 4, 5] as const;

type SubmitState = "idle" | "sending" | "success" | "error";

export function ReviewForm({
  slug,
  defaultName = "",
}: {
  slug: string;
  defaultName?: string;
}) {
  const [clientName, setClientName] = useState(defaultName);
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [allowPublicDisplay, setAllowPublicDisplay] = useState(true);
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<SubmitState>("idle");
  const [validationMessage, setValidationMessage] = useState("");

  const sending = state === "sending";
  const remaining = MAX_MESSAGE_LENGTH - message.length;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextName = clientName.trim();
    const nextMessage = message.trim();

    if (!nextName || !rating || !nextMessage) {
      setValidationMessage("Please add your name, rating, and review message.");
      setState("error");
      return;
    }

    if (nextMessage.length > MAX_MESSAGE_LENGTH) {
      setValidationMessage(`Please keep your review under ${MAX_MESSAGE_LENGTH} characters.`);
      setState("error");
      return;
    }

    setValidationMessage("");
    setState("sending");

    try {
      const response = await fetch(`/api/gallery/${slug}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: nextName,
          email: email.trim(),
          rating,
          message: nextMessage,
          allowPublicDisplay,
          website,
        }),
      });

      if (!response.ok) {
        throw new Error("Review failed");
      }

      setState("success");
    } catch {
      setValidationMessage("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <section className={styles.reviewSection} aria-labelledby="gallery-review-title">
      <div className={styles.reviewIntro}>
        <p className={styles.eyebrow}>Testimonial</p>
        <h2 className={styles.reviewTitle} id="gallery-review-title">
          Share your experience
        </h2>
        <p className={styles.reviewCopy}>
          I'd love to hear how you felt about your gallery and experience.
        </p>
      </div>

      <form className={styles.reviewForm} onSubmit={handleSubmit} noValidate>
        <div className={styles.reviewFields}>
          <div className={styles.field}>
            <label htmlFor="review-client-name">Client name</label>
            <input
              id="review-client-name"
              name="clientName"
              value={clientName}
              onChange={(event) => setClientName(event.target.value)}
              maxLength={80}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="review-email">Email optional</label>
            <input
              id="review-email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={160}
            />
          </div>
        </div>

        <fieldset className={styles.ratingField}>
          <legend>Rating 1-5 stars</legend>
          <div className={styles.starGroup} role="radiogroup" aria-label="Rating">
            {RATINGS.map((value) => (
              <button
                aria-checked={rating === value}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className={`${styles.starButton} ${
                  value <= rating ? styles.starButtonActive : ""
                }`}
                key={value}
                onClick={() => setRating(value)}
                role="radio"
                type="button"
              >
                ★
              </button>
            ))}
          </div>
        </fieldset>

        <div className={styles.field}>
          <label htmlFor="review-message">Review message</label>
          <textarea
            id="review-message"
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value.slice(0, MAX_MESSAGE_LENGTH))}
            maxLength={MAX_MESSAGE_LENGTH}
            required
          />
          <span className={styles.characterCount}>{remaining} characters left</span>
        </div>

        <label className={styles.reviewCheckbox}>
          <input
            checked={allowPublicDisplay}
            name="allowPublicDisplay"
            onChange={(event) => setAllowPublicDisplay(event.target.checked)}
            type="checkbox"
          />
          <span>I allow my review to be displayed on the website.</span>
        </label>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="review-website">Website</label>
          <input
            autoComplete="off"
            id="review-website"
            name="website"
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            value={website}
          />
        </div>

        {state === "success" ? (
          <p className={styles.successMessage}>
            Thank you for your review. Once approved, it can appear on the website.
          </p>
        ) : null}
        {state === "error" ? (
          <p className={styles.errorMessage}>
            {validationMessage || "Something went wrong. Please try again."}
          </p>
        ) : null}

        <button
          className={styles.reviewSubmit}
          disabled={sending || state === "success"}
          type="submit"
        >
          {sending ? "Sending..." : "Submit Review"}
        </button>
      </form>
    </section>
  );
}
