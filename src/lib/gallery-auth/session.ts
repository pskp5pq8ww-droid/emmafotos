import crypto from "node:crypto";
import { cookies } from "next/headers";

const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function cookieName(slug: string) {
  return `ers_gallery_${slug.replace(/[^a-z0-9_-]/gi, "")}`;
}

function sign(slug: string, clientId: string, expires: number) {
  return crypto
    .createHash("sha256")
    .update(`${slug}.${clientId}.${expires}`)
    .digest("hex");
}

export async function createGallerySession(slug: string, clientId: string) {
  const expires = Date.now() + SESSION_TTL_MS;
  const token = `${clientId}.${expires}.${sign(slug, clientId, expires)}`;
  const cookieStore = await cookies();

  cookieStore.set(cookieName(slug), token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: `/gallery/${slug}`,
    expires: new Date(expires),
  });
}

export async function hasGallerySession(slug: string, clientId: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName(slug))?.value;

  if (!token) {
    return false;
  }

  const [sessionClientId, expiresValue, signature] = token.split(".");
  const expires = Number(expiresValue);

  if (
    sessionClientId !== clientId ||
    !signature ||
    Number.isNaN(expires) ||
    expires < Date.now()
  ) {
    return false;
  }

  return signature === sign(slug, clientId, expires);
}
