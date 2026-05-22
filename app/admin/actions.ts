"use server";

import { randomUUID } from "node:crypto";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateDB, getUploadsDir } from "@/lib/db";
import type { Gallery } from "@/lib/db/types";
import { createGallerySlug } from "@/lib/galleries/slug";
import { clearAdminSession, getAdminPinHash } from "@/lib/admin-auth/session";
import { hashPin, isValidClientPin, verifyPin } from "@/lib/security/pin";

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

async function removeGalleryFolder(clientId: string, slug: string, galleryId?: string) {
  await Promise.all([
    rm(path.join(getUploadsDir(), "clients", clientId, slug), {
      recursive: true,
      force: true,
    }),
    galleryId
      ? rm(path.join(getUploadsDir(), "galleries", galleryId), {
          recursive: true,
          force: true,
        })
      : Promise.resolve(),
  ]);
}

async function removeClientFolder(clientId: string) {
  await rm(path.join(getUploadsDir(), "clients", clientId), {
    recursive: true,
    force: true,
  });
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin-login");
}

export async function createClientGallery(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email").toLowerCase();
  const username = value(formData, "username").toLowerCase();
  const pin = value(formData, "pin");
  const title = value(formData, "title");
  const eventDate = value(formData, "eventDate");
  const description = value(formData, "description");
  const isActive = formData.get("isActive") === "on";

  if (!name || !title || !isValidClientPin(pin)) {
    return;
  }

  const pinHash = await hashPin(pin);
  let createdGallery: Gallery | undefined;

  await updateDB((db) => {
    const now = new Date().toISOString();
    let client = db.clients.find(
      (item) =>
        (email && item.email.toLowerCase() === email) ||
        (username && item.username?.toLowerCase() === username),
    );

    if (!client) {
      client = {
        id: randomUUID(),
        name,
        email,
        username: username || undefined,
        pinHash,
        createdAt: now,
      };
      db.clients.push(client);
    } else {
      client.name = name || client.name;
      client.email = email || client.email;
      client.username = username || client.username;
      client.pinHash = pinHash;
    }

    const slug = createGallerySlug(title);
    createdGallery = {
      id: randomUUID(),
      clientId: client.id,
      title,
      slug,
      eventDate: eventDate || undefined,
      description: description || undefined,
      isActive,
      createdAt: now,
    };
    db.galleries.push(createdGallery);
    return db;
  });

  if (createdGallery) {
    await mkdir(
      path.join(getUploadsDir(), "clients", createdGallery.clientId, createdGallery.slug, "thumbs"),
      { recursive: true },
    );
  }

  revalidatePath("/admin");
  revalidatePath("/admin/galleries");
  revalidatePath("/admin/clients");
}

export async function toggleGalleryActive(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => {
    const gallery = db.galleries.find((item) => item.id === id);
    if (gallery) {
      gallery.isActive = !gallery.isActive;
    }
    return db;
  });

  revalidatePath("/admin");
  revalidatePath("/admin/galleries");
}

export async function updateGallery(formData: FormData) {
  const id = value(formData, "id");
  const title = value(formData, "title");
  const eventDate = value(formData, "eventDate");
  const description = value(formData, "description");

  await updateDB((db) => {
    const gallery = db.galleries.find((item) => item.id === id);
    if (gallery) {
      gallery.title = title || gallery.title;
      gallery.eventDate = eventDate || undefined;
      gallery.description = description || undefined;
    }
    return db;
  });

  revalidatePath(`/admin/galleries/${id}`);
  revalidatePath("/admin/galleries");
}

export async function deleteGallery(formData: FormData) {
  const id = value(formData, "id");
  let clientId = "";
  let slug = "";
  let galleryId = "";

  await updateDB((db) => {
    const gallery = db.galleries.find((item) => item.id === id);
    galleryId = gallery?.id ?? "";
    clientId = gallery?.clientId ?? "";
    slug = gallery?.slug ?? "";
    return {
      ...db,
      galleries: db.galleries.filter((item) => item.id !== id),
      galleryImages: db.galleryImages.filter((image) => image.galleryId !== id),
      favorites: db.favorites.filter((favorite) => favorite.galleryId !== id),
      reviews: db.reviews.filter((review) => review.galleryId !== id),
    };
  });

  if (clientId && slug) {
    await removeGalleryFolder(clientId, slug, galleryId);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/galleries");
  redirect("/admin/galleries");
}

export async function deleteClient(formData: FormData) {
  const id = value(formData, "id");
  let galleryIds: string[] = [];

  await updateDB((db) => {
    galleryIds = db.galleries
      .filter((gallery) => gallery.clientId === id)
      .map((gallery) => gallery.id);

    return {
      ...db,
      clients: db.clients.filter((client) => client.id !== id),
      galleries: db.galleries.filter((gallery) => gallery.clientId !== id),
      galleryImages: db.galleryImages.filter(
        (image) => !galleryIds.includes(image.galleryId),
      ),
      favorites: db.favorites.filter(
        (favorite) => !galleryIds.includes(favorite.galleryId),
      ),
      reviews: db.reviews.filter((review) => !galleryIds.includes(review.galleryId)),
    };
  });

  // Remove entire client folder (all their galleries at once)
  await Promise.all([
    removeClientFolder(id),
    ...galleryIds.map((galleryId) =>
      rm(path.join(getUploadsDir(), "galleries", galleryId), {
        recursive: true,
        force: true,
      }),
    ),
  ]);
  revalidatePath("/admin");
  revalidatePath("/admin/clients");
  redirect("/admin/clients");
}

export async function regenerateClientPin(formData: FormData) {
  const id = value(formData, "id");
  const pin = value(formData, "pin");

  if (!isValidClientPin(pin)) {
    return;
  }

  const pinHash = await hashPin(pin);

  await updateDB((db) => {
    const client = db.clients.find((item) => item.id === id);
    if (client) {
      client.pinHash = pinHash;
    }
    return db;
  });

  revalidatePath("/admin/clients");
  revalidatePath(`/admin/clients/${id}`);
}

export async function deleteGalleryImage(formData: FormData) {
  const galleryId = value(formData, "galleryId");
  const imageId = value(formData, "imageId");
  let imagePaths: string[] = [];

  await updateDB((db) => {
    const image = db.galleryImages.find((item) => item.id === imageId);
    if (image) {
      imagePaths = [
        image.path,
        image.thumbPath,
        image.originalPath,
        image.previewPath,
      ].filter(Boolean) as string[];
    }

    return {
      ...db,
      galleryImages: db.galleryImages.filter((item) => item.id !== imageId),
      favorites: db.favorites.filter((favorite) => favorite.imageId !== imageId),
    };
  });

  await Promise.all(
    [...new Set(imagePaths)].map((relativePath) =>
      rm(path.join(getUploadsDir(), relativePath), { force: true }),
    ),
  );

  revalidatePath(`/admin/galleries/${galleryId}`);
}

export async function updateStudioSettings(formData: FormData) {
  const studioName = value(formData, "studioName");
  const contactEmail = value(formData, "contactEmail");
  const instagram = value(formData, "instagram");
  const phone = value(formData, "phone");
  const emailTemplate = value(formData, "emailTemplate");
  const currentPin = value(formData, "currentPin");
  const nextPin = value(formData, "nextPin");
  let nextAdminPinHash: string | undefined;

  if (nextPin) {
    const currentHash = await getAdminPinHash();
    if (!(await verifyPin(currentPin, currentHash))) {
      return;
    }
    nextAdminPinHash = await hashPin(nextPin);
  }

  await updateDB((db) => {
    db.settings = {
      studioName,
      contactEmail,
      instagram,
      phone,
      emailTemplate,
      adminPinHash: nextAdminPinHash ?? db.settings?.adminPinHash,
    };
    return db;
  });

  revalidatePath("/admin/settings");
}

export async function publishReview(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.map((r) =>
      r.id === id ? { ...r, approved: true, allowPublicDisplay: true } : r,
    ),
  }));

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function approveReview(formData: FormData) {
  return publishReview(formData);
}

export async function hideReview(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.map((r) =>
      r.id === id ? { ...r, approved: false, allowPublicDisplay: false } : r,
    ),
  }));

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function allowReviewDisplay(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.map((r) =>
      r.id === id ? { ...r, allowPublicDisplay: true } : r,
    ),
  }));

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function keepReviewPrivate(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.map((r) =>
      r.id === id ? { ...r, allowPublicDisplay: false } : r,
    ),
  }));

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}

export async function deleteReview(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.filter((review) => review.id !== id),
  }));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}

export async function deleteAllReviews() {
  await updateDB((db) => ({ ...db, reviews: [] }));

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/reviews");
}

// ─── Review invites ────────────────────────────────────────────────────────

export async function createReviewInvite(formData: FormData) {
  const { randomBytes } = await import("node:crypto");
  const galleryId = value(formData, "galleryId") || undefined;
  const note = value(formData, "note") || undefined;
  const token = randomBytes(24).toString("base64url");

  await updateDB((db) => ({
    ...db,
    reviewInvites: [
      ...db.reviewInvites,
      {
        id: randomUUID(),
        token,
        galleryId,
        note,
        createdAt: new Date().toISOString(),
      },
    ],
  }));

  revalidatePath("/admin/reviews");
}

export async function deleteReviewInvite(formData: FormData) {
  const id = value(formData, "id");

  await updateDB((db) => ({
    ...db,
    reviewInvites: db.reviewInvites.filter((inv) => inv.id !== id),
  }));

  revalidatePath("/admin/reviews");
}

export async function assignReviewImage(formData: FormData) {
  const id = value(formData, "id");
  const imageId = value(formData, "imageId") || undefined;

  await updateDB((db) => ({
    ...db,
    reviews: db.reviews.map((r) => (r.id === id ? { ...r, imageId } : r)),
  }));

  revalidatePath("/");
  revalidatePath("/admin/reviews");
}
