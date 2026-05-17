import { slugify } from "./slug";
import type { Client, Database, Gallery } from "@/lib/db/types";

export type GalleryAccessResult =
  | {
      state: "ready";
      gallery: Gallery;
      client: Client;
      canonicalSlug: string;
    }
  | {
      state: "not_found" | "not_published" | "client_missing";
      gallery?: Gallery;
      client?: Client;
      canonicalSlug?: string;
    };

function decodeIdentifier(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeAccessIdentifier(value: string) {
  return decodeIdentifier(value)
    .trim()
    .replace(/^\/+gallery\/+/i, "")
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

function byNewest(left: Gallery, right: Gallery) {
  return right.createdAt.localeCompare(left.createdAt);
}

function finish(gallery: Gallery | undefined, client: Client | undefined): GalleryAccessResult {
  if (!gallery) {
    return { state: "not_found" };
  }

  if (!gallery.isActive) {
    return {
      state: "not_published",
      gallery,
      client,
      canonicalSlug: gallery.slug,
    };
  }

  if (!client) {
    return {
      state: "client_missing",
      gallery,
      canonicalSlug: gallery.slug,
    };
  }

  return {
    state: "ready",
    gallery,
    client,
    canonicalSlug: gallery.slug,
  };
}

export function resolveGalleryAccess(
  db: Database,
  identifier: string,
): GalleryAccessResult {
  const normalized = normalizeAccessIdentifier(identifier);
  const titleSlug = slugify(normalized);

  const exactGallery = db.galleries.find(
    (gallery) => gallery.slug.toLowerCase() === normalized,
  );

  if (exactGallery) {
    return finish(
      exactGallery,
      db.clients.find((client) => client.id === exactGallery.clientId),
    );
  }

  const titleGallery = db.galleries
    .filter((gallery) => gallery.slug.toLowerCase().startsWith(`${titleSlug}-`))
    .sort(byNewest)[0];

  if (titleGallery) {
    return finish(
      titleGallery,
      db.clients.find((client) => client.id === titleGallery.clientId),
    );
  }

  const client = db.clients.find((item) => {
    const username = item.username?.toLowerCase();
    const email = item.email.toLowerCase();
    return username === normalized || email === normalized;
  });

  if (!client) {
    return { state: "not_found" };
  }

  const galleries = db.galleries
    .filter((gallery) => gallery.clientId === client.id)
    .sort(byNewest);
  const activeGallery = galleries.find((gallery) => gallery.isActive);

  return finish(activeGallery ?? galleries[0], client);
}
