import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { readDB, updateDB } from "@/lib/db";
import { hasGallerySession } from "@/lib/gallery-auth/session";
import type { Review } from "@/lib/db/types";

const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 700;

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function cleanEmail(value: unknown) {
  const email = cleanText(value, MAX_EMAIL_LENGTH).toLowerCase();

  if (!email) {
    return "";
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}

function ratingValue(value: unknown): Review["rating"] | undefined {
  const rating = Number(value);

  if ([1, 2, 3, 4, 5].includes(rating)) {
    return rating as Review["rating"];
  }

  return undefined;
}

function hasTooManyLinks(message: string) {
  const matches = message.match(/https?:\/\/|www\./gi);
  return (matches?.length ?? 0) > 1;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  let body: Record<string, unknown>;

  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot field. Real clients never see it, bots often fill it.
  if (cleanText(body.website, 120)) {
    return NextResponse.json({ ok: true });
  }

  const db = await readDB();
  const gallery = db.galleries.find((item) => item.slug === slug && item.isActive);

  if (!gallery || !(await hasGallerySession(slug, gallery.clientId))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawMessage = typeof body.message === "string" ? body.message : "";
  if (rawMessage.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json({ error: "Review is too long" }, { status: 400 });
  }

  const clientName = cleanText(body.clientName, MAX_NAME_LENGTH);
  const email = cleanEmail(body.email);
  const rating = ratingValue(body.rating);
  const message = cleanText(rawMessage, MAX_MESSAGE_LENGTH);
  const allowPublicDisplay = body.allowPublicDisplay === true;

  if (!clientName || !rating || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (hasTooManyLinks(message)) {
    return NextResponse.json({ error: "Review could not be accepted" }, { status: 400 });
  }

  const duplicate = db.reviews.some(
    (review) =>
      review.galleryId === gallery.id &&
      review.clientName.toLowerCase() === clientName.toLowerCase() &&
      review.message.toLowerCase() === message.toLowerCase(),
  );

  if (!duplicate) {
    const review: Review = {
      id: randomUUID(),
      galleryId: gallery.id,
      clientName,
      email: email || undefined,
      rating,
      message,
      approved: false,
      allowPublicDisplay,
      createdAt: new Date().toISOString(),
    };

    await updateDB((current) => ({
      ...current,
      reviews: [...current.reviews, review],
    }));
  }

  return NextResponse.json({ ok: true });
}
