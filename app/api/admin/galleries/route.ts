import { randomUUID } from "node:crypto";
import { rm } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir, updateDB } from "@/lib/db";
import { hasAdminSession } from "@/lib/admin-auth/session";
import { createGallerySlug } from "@/lib/galleries/slug";

export async function POST(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    clientId?: string;
    title?: string;
    eventDate?: string;
    description?: string;
    isActive?: boolean;
  };

  if (!body.clientId || !body.title) {
    return NextResponse.json({ error: "Invalid gallery" }, { status: 400 });
  }

  const gallery = {
    id: randomUUID(),
    clientId: body.clientId,
    title: body.title,
    slug: createGallerySlug(body.title),
    eventDate: body.eventDate,
    description: body.description,
    isActive: body.isActive !== false,
    createdAt: new Date().toISOString(),
  };

  await updateDB((db) => ({ ...db, galleries: [...db.galleries, gallery] }));
  return NextResponse.json({ gallery });
}

export async function PATCH(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    id?: string;
    title?: string;
    eventDate?: string;
    description?: string;
    isActive?: boolean;
  };

  await updateDB((db) => {
    const gallery = db.galleries.find((item) => item.id === body.id);
    if (gallery) {
      gallery.title = body.title ?? gallery.title;
      gallery.eventDate = body.eventDate ?? gallery.eventDate;
      gallery.description = body.description ?? gallery.description;
      gallery.isActive =
        typeof body.isActive === "boolean" ? body.isActive : gallery.isActive;
    }
    return db;
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: string };
  let clientId = "";
  let slug = "";

  await updateDB((db) => {
    const gallery = db.galleries.find((item) => item.id === body.id);
    clientId = gallery?.clientId ?? "";
    slug = gallery?.slug ?? "";

    return {
      ...db,
      galleries: db.galleries.filter((gallery) => gallery.id !== body.id),
      galleryImages: db.galleryImages.filter((image) => image.galleryId !== body.id),
      favorites: db.favorites.filter((favorite) => favorite.galleryId !== body.id),
      reviews: db.reviews.filter((review) => review.galleryId !== body.id),
    };
  });

  await Promise.all([
    body.id
      ? rm(path.join(getUploadsDir(), "galleries", body.id), {
          recursive: true,
          force: true,
        })
      : Promise.resolve(),
    clientId && slug
      ? rm(path.join(getUploadsDir(), "clients", clientId, slug), {
          recursive: true,
          force: true,
        })
      : Promise.resolve(),
  ]);

  return NextResponse.json({ ok: true });
}
