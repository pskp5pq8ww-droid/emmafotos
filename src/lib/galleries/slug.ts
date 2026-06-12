import { randomUUID } from "node:crypto";

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 72);
}

export function createGallerySlug(title: string) {
  const suffix = randomUUID().slice(0, 6);
  return `${slugify(title) || "gallery"}-${suffix}`;
}

/**
 * Slug for external invitations — uses a longer random token so the public
 * URL is hard to guess (these pages link to private external storage).
 */
export function createInvitationSlug(title: string) {
  const token = `${randomUUID()}${randomUUID()}`.replace(/-/g, "").slice(0, 24);
  return `${slugify(title) || "gallery"}-${token}`;
}

/**
 * Validates that a value is a safe public http(s) URL.
 * Rejects javascript:, data:, and other dangerous schemes.
 */
export function isSafeExternalUrl(value: string): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
