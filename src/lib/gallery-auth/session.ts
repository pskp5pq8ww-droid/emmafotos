import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

// GALLERY_SESSION_SECRET must be set in production (random 32+ char string).
// Without it tokens cannot be forged, but sessions won't survive server restarts.
function getSecret(): string {
  const secret = process.env.GALLERY_SESSION_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      // Loud warning — won't break the app but should be fixed.
      console.warn(
        "[security] GALLERY_SESSION_SECRET is not set. " +
          "Sessions will be invalidated on every server restart. " +
          "Set this variable to a random 32+ character string.",
      );
    }
    // Dev fallback — still an HMAC, just not stable across restarts.
    return `dev-fallback-${process.pid}`;
  }
  return secret;
}

function cookieName(slug: string) {
  return `ers_gallery_${slug.replace(/[^a-z0-9_-]/gi, "")}`;
}

function sign(slug: string, clientId: string, expires: number): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`${slug}.${clientId}.${expires}`)
    .digest("hex");
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function createGallerySession(slug: string, clientId: string) {
  const expires = Date.now() + SESSION_TTL_MS;
  const token = `${clientId}.${expires}.${sign(slug, clientId, expires)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName(slug), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expires),
  });
}

export async function hasGallerySession(slug: string, clientId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName(slug))?.value;

  if (!token) return false;

  // Token format: {clientId}.{expires}.{hmac}
  // clientId is a UUID (no dots); expires is a number; hmac is hex (no dots).
  const firstDot = token.indexOf(".");
  const lastDot = token.lastIndexOf(".");
  if (firstDot === -1 || lastDot === -1 || firstDot === lastDot) return false;

  const sessionClientId = token.slice(0, firstDot);
  const expiresValue = token.slice(firstDot + 1, lastDot);
  const signature = token.slice(lastDot + 1);

  const expires = Number(expiresValue);

  if (
    sessionClientId !== clientId ||
    !signature ||
    Number.isNaN(expires) ||
    expires < Date.now()
  ) {
    return false;
  }

  const expected = sign(slug, clientId, expires);
  return timingSafeEqual(signature, expected);
}
