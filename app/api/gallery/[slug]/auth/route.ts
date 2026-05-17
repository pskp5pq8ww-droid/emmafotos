import { NextResponse } from "next/server";
import { readDB } from "@/lib/db";
import { resolveGalleryAccess } from "@/lib/galleries/access";
import { createGallerySession } from "@/lib/gallery-auth/session";
import { getRequestOrigin } from "@/lib/security/request-origin";
import { verifyPin } from "@/lib/security/pin";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const formData = await request.formData();
  const pin = String(formData.get("pin") ?? "");
  const db = await readDB();
  const access = resolveGalleryAccess(db, slug);
  const origin = getRequestOrigin(request);

  if (access.state !== "ready") {
    return NextResponse.redirect(new URL(`/gallery/${slug}`, origin), 303);
  }

  if (!(await verifyPin(pin, access.client.pinHash))) {
    return NextResponse.redirect(
      new URL(`/gallery/${access.canonicalSlug}?error=invalid`, origin),
      303,
    );
  }

  await createGallerySession(access.canonicalSlug, access.client.id);
  return NextResponse.redirect(new URL(`/gallery/${access.canonicalSlug}/view`, origin), 303);
}
