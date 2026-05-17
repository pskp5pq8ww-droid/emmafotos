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
