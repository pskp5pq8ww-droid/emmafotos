"use server";

import { randomUUID } from "node:crypto";
import { updateDB } from "@/lib/db";
import type { Review } from "@/lib/db/types";

export type SubmitResult = { ok: true } | { ok: false; error: string };

export async function submitReview(
  token: string,
  formData: FormData,
): Promise<SubmitResult> {
  const clientName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const ratingRaw = Number(formData.get("rating"));

  if (!clientName || !message) {
    return { ok: false, error: "Please fill in your name and message." };
  }

  if (!ratingRaw || ratingRaw < 1 || ratingRaw > 5) {
    return { ok: false, error: "Please select a star rating." };
  }

  const rating = ratingRaw as 1 | 2 | 3 | 4 | 5;
  let alreadyUsed = false;
  let invalidToken = false;

  const review: Review = {
    id: randomUUID(),
    clientName,
    email: email || undefined,
    rating,
    message,
    approved: false,
    allowPublicDisplay: false,
    createdAt: new Date().toISOString(),
  };

  // General permanent review page — no invite required
  if (token === "__general__") {
    await updateDB((db) => ({
      ...db,
      reviews: [...db.reviews, review],
    }));
    return { ok: true };
  }

  await updateDB((db) => {
    const invite = db.reviewInvites.find(
      (inv) => inv.token === token && !inv.usedAt,
    );

    if (!invite) {
      invalidToken = true;
      return db;
    }

    if (invite.usedAt) {
      alreadyUsed = true;
      return db;
    }

    return {
      ...db,
      reviews: [...db.reviews, { ...review, galleryId: invite.galleryId }],
      reviewInvites: db.reviewInvites.map((inv) =>
        inv.token === token
          ? { ...inv, usedAt: new Date().toISOString() }
          : inv,
      ),
    };
  });

  if (invalidToken) return { ok: false, error: "This link is no longer valid." };
  if (alreadyUsed) return { ok: false, error: "This link has already been used." };

  return { ok: true };
}
