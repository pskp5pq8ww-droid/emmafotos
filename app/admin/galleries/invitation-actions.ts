"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { updateDB } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { createInvitationSlug, isSafeExternalUrl } from "@/lib/galleries/slug";
import type { ExternalInvitation } from "@/lib/db/types";

async function requireAdmin() {
  if (!(await hasAdminSession())) {
    redirect("/admin-login");
  }
}

function value(formData: FormData, key: string) {
  const raw = formData.get(key);
  return typeof raw === "string" ? raw.trim() : "";
}

/**
 * Create an external download invitation.
 * Validates required fields + that the external link is a safe http(s) URL.
 */
export async function createExternalInvitation(formData: FormData) {
  await requireAdmin();

  const clientName = value(formData, "clientName");
  const title = value(formData, "title");
  const externalDownloadLink = value(formData, "externalDownloadLink");
  const customMessage = value(formData, "customMessage");
  const coverImageUrl = value(formData, "coverImageUrl");
  const internalNotes = value(formData, "internalNotes");
  const expiresAt = value(formData, "expiresAt");
  const isActive = formData.get("isActive") === "on";

  // Validation — required fields + safe URL
  if (!clientName || !title || !isSafeExternalUrl(externalDownloadLink)) {
    return;
  }
  if (coverImageUrl && !isSafeExternalUrl(coverImageUrl)) {
    return;
  }

  const now = new Date().toISOString();
  const createdId = randomUUID();

  await updateDB((db) => {
    const created: ExternalInvitation = {
      id: createdId,
      slug: createInvitationSlug(title),
      clientName,
      title,
      customMessage: customMessage || undefined,
      externalDownloadLink,
      coverImageUrl: coverImageUrl || undefined,
      internalNotes: internalNotes || undefined,
      isActive,
      expiresAt: expiresAt || undefined,
      createdAt: now,
      updatedAt: now,
    };
    return {
      ...db,
      externalInvitations: [...db.externalInvitations, created],
    };
  });

  revalidatePath("/admin/galleries");
  redirect(`/admin/galleries/external/${createdId}`);
}

export async function updateExternalInvitation(formData: FormData) {
  await requireAdmin();

  const id = value(formData, "id");
  if (!id) return;

  const clientName = value(formData, "clientName");
  const title = value(formData, "title");
  const externalDownloadLink = value(formData, "externalDownloadLink");
  const customMessage = value(formData, "customMessage");
  const coverImageUrl = value(formData, "coverImageUrl");
  const internalNotes = value(formData, "internalNotes");
  const expiresAt = value(formData, "expiresAt");
  const isActive = formData.get("isActive") === "on";

  if (!clientName || !title || !isSafeExternalUrl(externalDownloadLink)) {
    return;
  }
  if (coverImageUrl && !isSafeExternalUrl(coverImageUrl)) {
    return;
  }

  await updateDB((db) => {
    const idx = db.externalInvitations.findIndex((inv) => inv.id === id);
    if (idx === -1) return db;

    const updated: ExternalInvitation = {
      ...db.externalInvitations[idx],
      clientName,
      title,
      customMessage: customMessage || undefined,
      externalDownloadLink,
      coverImageUrl: coverImageUrl || undefined,
      internalNotes: internalNotes || undefined,
      isActive,
      expiresAt: expiresAt || undefined,
      updatedAt: new Date().toISOString(),
    };

    const externalInvitations = [...db.externalInvitations];
    externalInvitations[idx] = updated;
    return { ...db, externalInvitations };
  });

  revalidatePath("/admin/galleries");
  revalidatePath(`/admin/galleries/external/${id}`);
  redirect(`/admin/galleries/external/${id}`);
}

export async function toggleExternalInvitation(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  if (!id) return;

  await updateDB((db) => ({
    ...db,
    externalInvitations: db.externalInvitations.map((inv) =>
      inv.id === id
        ? { ...inv, isActive: !inv.isActive, updatedAt: new Date().toISOString() }
        : inv,
    ),
  }));

  revalidatePath("/admin/galleries");
  revalidatePath(`/admin/galleries/external/${id}`);
}

export async function deleteExternalInvitation(formData: FormData) {
  await requireAdmin();
  const id = value(formData, "id");
  if (!id) return;

  await updateDB((db) => ({
    ...db,
    externalInvitations: db.externalInvitations.filter((inv) => inv.id !== id),
  }));

  revalidatePath("/admin/galleries");
  redirect("/admin/galleries");
}
