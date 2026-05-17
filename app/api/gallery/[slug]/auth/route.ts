import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { createGallerySession } from "@/lib/gallery-auth/session";
import { getRequestOrigin } from "@/lib/security/request-origin";
import { verifyPin } from "@/lib/security/pin";
import { checkRateLimit, clearRateLimit } from "@/lib/security/rate-limit";

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const origin = getRequestOrigin(request);
  const ip = getClientIp(request);

  // Rate limit: keyed by IP + slug so different galleries don't share a bucket.
  const rateLimitKey = `gallery-auth:${ip}:${slug}`;
  const { allowed, retryAfterSec } = checkRateLimit(rateLimitKey);

  if (!allowed) {
    return NextResponse.redirect(
      new URL(`/gallery/${slug}?error=locked`, origin),
      303,
    );
  }

  const formData = await request.formData();
  const pin = String(formData.get("pin") ?? "");
  const db = await readDB();
  const access = resolveGalleryAccess(db, slug);

  if (access.state !== "ready") {
    return NextResponse.redirect(new URL(`/gallery/${slug}`, origin), 303);
  }

  if (!(await verifyPin(pin, access.client.pinHash))) {
    return NextResponse.redirect(
      new URL(`/gallery/${access.canonicalSlug}?error=invalid`, origin),
      303,
    );
  }

  // PIN correct — clear the failed-attempt counter for this IP+gallery.
  clearRateLimit(rateLimitKey);

  await createGallerySession(access.canonicalSlug, access.client.id);
  return NextResponse.redirect(
    new URL(`/gallery/${access.canonicalSlug}/view`, origin),
    303,
  );
}
